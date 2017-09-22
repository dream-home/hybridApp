import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { PayCompletedPage } from '../payCompleted/payCompleted';
import { PaySuccessPage } from '../paySuccess/paySuccess';
declare var jQuery:any;

@Component({
    selector: 'page-quickPayInfo',
    templateUrl: 'quickPayInfo.html'
})
export class QuickPayInfoPage {

    payType:string = '1';
    tranType:string;
    score:string;
    orderNo:string;
    payTime:string;
    userId:string;
    returnUrl:string;
    orderTitle:string;
    flag:string = '';
    datas;
    storeUserId:string;
    discountAmount:number;//抵用金额

    /*新的支付*/
    payData:string;
    payUrl:string;

    shopId:string;
    /*用于全局保存用户在购物车里面的信息*/
    myShopGoodData = {
        storeId:'',
        myShopGoods:[]
    };
    /*购物车里面的商品数组*/
    myShopGoods:any = [];
    /*二次回调地址*/
    aliCallBackURL:string;
    constructor(
      public navCtrl: NavController,
      public alertCtrl: AlertController,
      public plt: Platform,
      private commonService: CommonService,
      private navParams: NavParams
    ){
        this.score = navParams.get('payScore');
        this.tranType = navParams.get('tranType');
        this.storeUserId = navParams.get('storeUserId');
        this.payData = navParams.get('payData');
        this.payUrl = navParams.get('payUrl');
        this.discountAmount = navParams.get('discountAmount');
        this.aliCallBackURL = navParams.get('aliCallBackURL');
    }

    /*页面事件*/
    ionViewWillEnter(){
        //this.score = sessionStorage.getItem("payMoney");
        this.flag = sessionStorage.getItem("flag");
        this.shopId = this.navParams.get("storeId");
        let data = localStorage.getItem(this.shopId);
        if(this.shopId != '' && this.shopId !=null){
            if(data != null && data != '' && data != 'null'){
                //console.log("data"+data);
                this.myShopGoodData = JSON.parse(data);
                if(this.myShopGoodData!=null){
                    this.myShopGoods = this.myShopGoodData.myShopGoods;
                }
            }
        }
        this.loadData();
    }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //提交表单
    openPay(){
          if(this.flag == '1'){

              if (this.plt.is('ios')) {
                // alert(this.commonService.alipay+"?tradeNo="+this.orderNo+"&tranType="+this.tranType+"&payAmount="+this.score+"&orderTitle="+this.orderTitle+"&userId="+this.userId+"&returnUrl="+this.returnUrl+"&token="+encodeURIComponent(this.commonService.token));
                // This will only print when on iOS
                window.open(this.commonService.alipay+"?tradeNo="+this.orderNo+"&tranType="+this.tranType+"&payAmount="+this.score+"&orderTitle="+this.orderTitle+"&userId="+this.userId+"&returnUrl="+this.returnUrl+"&token="+encodeURIComponent(this.commonService.token),"_self");
                sessionStorage.setItem("flag","2");
                this.showConfirm();
              }else if(this.plt.is('android')){
                window.open(this.commonService.alipay+"?tradeNo="+this.orderNo+"&tranType="+this.tranType+"&payAmount="+this.score+"&orderTitle="+this.orderTitle+"&userId="+this.userId+"&returnUrl="+this.returnUrl+"&token="+encodeURIComponent(this.commonService.token),"_blank");
                sessionStorage.setItem("flag","2");
                this.showConfirm();
              }else{
                //this.commonService.alert("系统提示","该操作系统暂时不支持充值");
                window.open(this.commonService.alipay+"?tradeNo="+this.orderNo+"&tranType="+this.tranType+"&payAmount="+this.score+"&orderTitle="+this.orderTitle+"&userId="+this.userId+"&returnUrl="+this.returnUrl+"&token="+encodeURIComponent(this.commonService.token),"_blank");
                sessionStorage.setItem("flag","2");
                this.showConfirm();
              }
        }else{
            this.navCtrl.pop();
        }

    }

    showConfirm() {
      let confirm = this.alertCtrl.create({
        title: '支付提醒',
        message: '是否支付成功?',
        enableBackdropDismiss:false,
        buttons: [
          {
            text: '支付失败',
            handler: () => {
              this.aliCallBack();
            }
          },
          {
            text: '支付成功',
            handler: () => {
                this.aliCallBack();
            }
          }
        ]
      });
      confirm.present();
    }

    /*加载我的消费记录*/
    loadData(){
        this.payType = this.tranType;
        this.commonService.httpPost({
            url:this.commonService.baseUrl+this.payUrl,
            data:this.payData
        }).then(data=>{
            if(data.code=='200'){
                this.orderNo = data.result.orderNo;
                this.userId = data.result.userId;
                // this.returnUrl = this.commonService.baseUrl + "/wallet/face/alipaycallback";
                this.returnUrl = data.result.returnUrl;
                if(this.tranType == '1'){
                    this.orderTitle = "面对面支付";
                    this.tranType = "10";
                    this.score =  data.result.realPayPrice;
                }else if(this.tranType == '2'){
                    this.orderTitle = "购买商品";
                    this.tranType = "30";
                }else if(this.tranType == '3'){
                    this.orderTitle = "线下支付";
                    this.tranType = "40";
                    this.score =  data.result.realPayPrice;
                }else if(this.tranType == '4'){
                    this.orderTitle = "加入合伙人支付";
                    this.tranType = "60";
                    this.score =  data.result.joinPrice;
                }else{
                    this.orderTitle = "斗拍商城充值";
                    this.tranType = "20";
                }
                // this.tranType = data.result.tranType;
                // this.orderTitle = data.result.orderTitle;
                this.payTime = data.result.payTime;
                this.openPay();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });

    }
    /*支付宝二次回调*/
    aliCallBack(){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+this.aliCallBackURL,
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.toast('支付成功');
                if(this.tranType == '10'){//面对面支付
                    this.navCtrl.push(
                        PayCompletedPage,
                        {source:this.tranType,score:this.score,orderNo:this.orderNo,payTime:this.payTime,actualPayMent:this.navParams.get("actualPayMent"),discountAmount:this.navParams.get("discountAmount")}
                    );
                }else if(this.tranType == '30'){//购买商品
                    this.clearCart();
                    this.navCtrl.pop();
                    this.navCtrl.pop();
                }else if(this.tranType == '40'){//线下支付
                  // this.navCtrl.push(PaySuccessPage,{shopID:this.shopId,paymentAmount:this.score,gotoPage:'quickPayInfo'});
                  this.navCtrl.push(PaySuccessPage,{shopID:this.shopId,
                    paymentAmount:this.score,
                    gotoPage:'quickPayInfo',
                    actualPayMent:this.navParams.get("actualPayMent"),
                    discountAmount:this.navParams.get("discountAmount")});
                }else if(this.tranType == '60'){//加入合伙人支付
                    this.navCtrl.pop();
                    this.navCtrl.pop();
                }else if(this.tranType == '20'){//斗拍商城充值
                    sessionStorage.setItem("backPage",'1');
                    this.navCtrl.pop();
                    this.navCtrl.pop();
                }
            }else{
                // this.commonService.alert("系统提示","支付失败");
                if(this.tranType == '30'){
                    this.clearCart();
                    this.commonService.alert("系统提示","支付失败");
                    this.navCtrl.pop();
                    this.navCtrl.pop();
                }else if(this.tranType == '10'){
                    this.navCtrl.pop();
                }else{
                    this.commonService.alert("系统提示","支付失败");
                    this.navCtrl.pop();
                    this.navCtrl.pop();
                }

            }
        });
    }
    /*清空购物车*/
    clearCart(){
        if(this.myShopGoodData!=null){
            if(this.myShopGoodData.myShopGoods!=null){
                for(let goods in this.myShopGoodData.myShopGoods){
                    this.myShopGoodData.myShopGoods[goods].num = 0;
                }
            }
        }
        if(this.shopId!='' && this.shopId!=null){
            localStorage.setItem(this.shopId,JSON.stringify(this.myShopGoodData));

        }
    }

}
