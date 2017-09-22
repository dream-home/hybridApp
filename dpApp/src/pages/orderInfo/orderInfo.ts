import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController ,NavParams,AlertController} from 'ionic-angular';
import { SellerShopPage } from '../sellerShop/sellerShop';
// import { QuickPayInfoPage } from '../quickPayInfo/quickPayInfo';
declare let Wechat:any;
declare let AliPay: any;
var orderInfoPage: any;
@Component({
    selector: 'page-orderInfo',
    templateUrl: 'orderInfo.html'
})

export class OrderInfoPage {

    orderNo:string;
    info:any;
    allPrice: number = 0;
    source: string = "3";
    isShowPayPw: boolean = false;
    myScore: number;
    myEP: number;
    payPwd: string = '';
    discountBoolean:boolean = false;
    onePayWay:boolean=false;//是否只能余额支付,在EP抵用券设置为100时
    /*商品订单的 ep折扣对象*/
    orderGoodsEp:any;
    //是否需要回调
    WechatCallback:boolean = false;
    isDisable:boolean=false;//余额支付确定按钮点击后禁用，防止连点促发事件
    submitDisabled:boolean=false;//立即付款按钮点击后禁用，防止连点促发事件
    noPay:boolean = false;//订单不存在或者下架时不可支付
    constructor(public navCtrl: NavController, private commonService: CommonService,private navParams: NavParams,public alertCtrl: AlertController) {
        orderInfoPage = this;
        this.orderNo =this.navParams.get("orderNo");
        this.checkisinstallwx();
        this.commonService.httpLoad({
            url: this.commonService.baseUrl + '/user/score',
            data: {
            }
        }).then(data => {
            if (data.code == '200') {
                this.myScore = data.result.score;
                this.myEP = data.result.exchangeEP;
            }
        });
        this.loadData();
        this.getPurchasingep();
    }

      /*页面事件*/
    ionViewWillEnter(){
        this.submitDisabled=false;
        this.orderNo =this.navParams.get("orderNo");
        //  orderInfoPage = this;

        // if(this.WechatCallback&&this.orderNo!=null&&this.orderNo!=''){
        //     this.buyCompleted();
        // }
    }

    //判断是否安装微信
    ishasewx:boolean = false;
    checkisinstallwx(){
        if(typeof Wechat == "undefined"){
            return;
        }
        Wechat.isInstalled(function (installed) {
            console.log("判断是否安装微信======installed  "+installed)
            if(installed){
                orderInfoPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                orderInfoPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            orderInfoPage.ishasewx = false;
        });
    }

    /*返回上一页*/
    goToBackPage(){
        if(this.isShowPayPw){
            this.isShowPayPw = false;
            this.submitDisabled=false;
        }else{
            this.navCtrl.pop();
        }
    }

/*进入店铺*/
    gotoShop(id){
        /*let inviteCode = sessionStorage.getItem(id);*/
        this.navCtrl.push(SellerShopPage,{id:id});
    }

    loadData(){
        this.commonService.httpGet({/* /user/store/order/info*/
            url:this.commonService.baseUrl+'/order/orderdetail',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
            if(data.code==200){
                this.info = data.result;
                for(var index in this.info.orderlist){
                    this.allPrice = this.allPrice+ this.info.orderlist[index].price*this.info.orderlist[index].num;
                }
                var date = new Date();
                var nowdate = date.getTime();
                var orderdate = data.result.createTime;
                var datecha = (nowdate-orderdate);
                console.log(" nowdate "+nowdate+" orderdate "+orderdate+"  --  "+(nowdate-orderdate));
                if(datecha>7200000){
                    this.noPay = true;
                }
            }else if(data.code==1){
                let alert = this.alertCtrl.create({
                    title: "系统提示",
                    subTitle: data.msg,
                    buttons: [{
                    text: '确认',
                    role: 'cancel',
                    handler: data => {
                        this.navCtrl.pop();
                    }
                  }]
                });
                alert.present();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /*获取订单商品的ep优惠值*/
    getPurchasingep(){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/order/purchasingep',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
            if(data.code==200){
                this.orderGoodsEp = data.result;
            }else if(data.code==2||data.code==3){
                this.noPay = true;
                let alert = this.alertCtrl.create({
                    title: "系统提示",
                    subTitle: data.msg,
                    buttons: [{
                    text: '确认',
                    role: 'cancel',
                    handler: data => {
                        // this.navCtrl.pop();
                    }
                  }]
                });
                alert.present();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    orderCancel(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/order/ordercancle',
            data:{
                orderNo:this.orderNo

            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.toast('取消订单成功');
                this.navCtrl.pop();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    orderPay(){
        let discountEP;
        if(this.discountBoolean){
            discountEP=(this.orderGoodsEp.totalDiscountEp>this.myEP?this.myEP:this.orderGoodsEp.totalDiscountEp);
        }else{
            discountEP = 0;
        }
        if (this.source == '3' && this.isShowPayPw == false) {
            if (this.info.price * 1 > this.myScore*1) {
                this.commonService.toast('您的余额不足');
            } else {
                this.isShowPayPw = true;
                this.isDisable=false;
            }
            return;
        }

        this.submitDisabled=true;
        // if (this.source == '1') {//支付宝支付
        //     sessionStorage.setItem("flag", "1");
        //     this.navCtrl.push(QuickPayInfoPage, {
        //         tranType: '2', payData: {
        //             orderNo: this.orderNo,
        //             source: this.source,
        //             payPwd: this.payPwd,
        //             discountEP:discountEP
        //         }, payUrl: '/order/purchasing',
        //         aliCallBackURL:'/order/alipayAppOrder',
        //         payScore: (this.discountBoolean?this.orderGoodsEp.originalPrice-(this.orderGoodsEp.totalDiscountEp>this.myEP?this.myEP:this.orderGoodsEp.totalDiscountEp):this.orderGoodsEp.originalPrice)
        //     });
        //  }else{
         this.isDisable=true;
         if(!this.ishasewx && this.source=='2'){
             this.commonService.alert("系统提醒","请先安装微信");
             return;
         }else{
             this.commonService.httpPost({
                url: this.commonService.baseUrl + "/order/purchasing",
                data: {
                    orderNo: this.orderNo,
                    source: this.source,
                    payPwd: this.payPwd,
                    discountEP:discountEP
                }
             }).then(data => {
                if (data.code == 200) {
                    this.orderNo = data.result.orderNo;
                    if (this.source == '2') {//微信
                        // alert("weixin"+this.orderNo);
                        // this.payTime = data.result.payTime;
                        var params = {
                            partnerid: data.result.partnerid, // merchant id
                            prepayid: data.result.prepayid, // prepay id
                            noncestr: data.result.noncestr, // nonce
                            timestamp: data.result.timestamp, // timestamp
                            sign: data.result.sign, // signed string
                        };
                        let interval = setInterval(()=>{
                          this.submitDisabled=false;clearInterval(interval);//移除对象
                        },2000);
                        this.WechatCallback = true;
                        Wechat.sendPaymentRequest(params, function () {
                            this.WechatCallback = false;
                            orderInfoPage.buyCompleted();
                        }, function (reason) {
                            this.commonService.alert("系统提示", reason);
                        });
                    } else if (this.source == '3') {//余额
                        this.goToBackPage();
                        this.goToBackPage();
                        this.commonService.toast("购买商品成功");
                    }else if (this.source == '1') {//支付宝
                        let payInfo  =data.result.orderInfo;
                        //第二步：调用支付插件
                        AliPay.pay(payInfo,
                            function success(e){
                               orderInfoPage.alipaycallback();
                            },function error(e){
                               this.commService.alert("系统提醒","支付失败");
                        });

                    }
                } else {
                    this.isDisable=false;
                    this.submitDisabled=false;
                    this.commonService.alert("系统提示",data.msg);
                }
            });
         }
        //  }
    }

    /*是否使用EP兑换券*/
    epDiscount(){
        if(this.discountBoolean){
            this.discountBoolean = false;
            this.onePayWay = false;
        }else{
            this.discountBoolean = true;
            if((this.orderGoodsEp.originalPrice-(this.orderGoodsEp.totalDiscountEp>this.myEP?this.myEP:this.orderGoodsEp.totalDiscountEp))  <=0){
                this.onePayWay = true;
                this.source = '3'
            }
        }
    }
    alipaycallback(){//支付宝二次回调接口
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/order/alipayAppOrder',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
          if(data.code==200){
              this.navCtrl.pop();
          }else{
              this.commonService.alert("系统提示",data.msg);
          }
        })
    }
    buyCompleted(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/wallet/isPaySuccess',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.alert("系统提示","支付成功");
                this.goToBackPage();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
        var temnum =0 ;
        this.commonService.showLoading("提交数据中。。。");
        // alert("weixinhuidiao"+this.orderNo);
        let interval = setInterval(()=>{
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/order/wxapporder',
                data:{
                    orderNo:this.orderNo
                }
            }).then(data=>{
                if(data.code==200){
                    clearInterval(interval);//移除对象
                    this.commonService.hideLoading();
                    // let toast = this.commonService.toast("购买商品成功");
                    // toast.onDidDismiss(() => {
                    //     this.goToBackPage();
                    // });
                }else{
                    if(temnum==2){
                        // this.commonService.alert("系统提示",data.msg);
                    }
                }
            });
            temnum =temnum+1;
            if(temnum==3){
                this.commonService.hideLoading();
                clearInterval(interval);//移除对象
            }
        },3000);

    }
    /*支付方式*/
    changeSource(sourceId) {
        this.source = sourceId;
    }



}
