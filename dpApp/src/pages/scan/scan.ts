import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { PayCompletedPage } from '../payCompleted/payCompleted';
// import { QuickPayInfoPage } from '../quickPayInfo/quickPayInfo';

var scanPage: any;
declare let AliPay: any;
declare let Wechat:any;
@Component({
  selector: 'page-scan',
  templateUrl: 'scan.html'
})
export class ScanPage {

    payPwd:string='';
    source:string = "3";
    isShowPayPw:boolean = false;
    discountBoolean:boolean = false;
    orderNo:string;
    payTime:string;
    userId:string;
    myScore:number;
    myEP:number;
    scanText={
        businessSendEp:'',
        discountEP:'',
        firstReferrerScale:'',
        payAmount:'',
        secondReferrerScale:'',
        storeUserId:'',
        thirdReferrerScale:'',
    };
    onePayWay:boolean=false;//是否只能余额支付,在EP抵用券设置为100时
    actualPayMent:number;//实际付款
    discountAmount:number;//抵用金额
    epDiscountnum:number = 0;

    isDisable:boolean=false;//余额支付确定按钮点击后禁用，防止连点促发事件
    submitDisabled:boolean=false;//确定支付按钮点击后禁用，防止连点促发事件
    constructor(
        public navCtrl: NavController,
        public commonService: CommonService,
        private navParams: NavParams,
    ) {
        scanPage = this;
        this.checkisinstallwx();
        this.commonService.httpLoad({
             url:this.commonService.baseUrl+'/user/score',
             data:{
             }
         }).then(data=>{
             if(data.code=='200'){
                  this.myScore = data.result.score;
                  this.myEP = data.result.exchangeEP;
             }
         });
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.submitDisabled=false;
        this.scanText =JSON.parse(this.navParams.get("text"));
        this.discountBoolean=false;
        this.actualPayMent=parseFloat(this.scanText.payAmount);
        this.discountAmount=(this.actualPayMent*parseFloat(this.scanText.discountEP)*0.01);
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
                scanPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                scanPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            scanPage.ishasewx = false;
        });
    }

    changeSource(sourceId){
        this.source = sourceId;
    }

    /*是否使用EP兑换券*/
    epDiscount(){
        if(this.discountBoolean){
            this.discountBoolean = false;
            this.onePayWay=false;
            this.actualPayMent=parseFloat(this.scanText.payAmount);
            this.epDiscountnum=0;
        }else{
            this.discountBoolean = true;
            if(this.discountAmount >= this.myEP){
                this.actualPayMent=(parseFloat(this.scanText.payAmount)-this.myEP);
                this.epDiscountnum = this.myEP;
            }else{
                this.actualPayMent=(parseFloat(this.scanText.payAmount)-this.discountAmount);
                this.epDiscountnum = this.discountAmount;
            }
            if(this.scanText.discountEP=='100' && this.actualPayMent==0){
                this.onePayWay=true;
                this.source='3';
            }
        }
    }

    /*面对面扫码-生成支付单*/
    buildPayOrder(){
        this.submitDisabled=true;
        this.isDisable=true;
        //alert("this.payPwd"+ this.payPwd+" this.scanText.payAmount "+this.scanText.payAmount+" this.source "+this.source+" this.scanText.storeUserId "+this.scanText.storeUserId);
        let interval = setInterval(()=>{
          this.submitDisabled=false;clearInterval(interval);//移除对象
        },3000);
        if(!this.ishasewx && this.source=='2'){
            this.commonService.alert("系统提醒","请先安装微信");
            this.submitDisabled=false;
            return;
        }else{
            this.commonService.showLoading("");
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/wallet/buildPayOrder',
                data:{
                    discountEP:this.epDiscountnum,
                    payPwd:this.payPwd,
                    score:this.scanText.payAmount,
                    source:this.source,
                    storeUserId:this.scanText.storeUserId
                }
            }).then(data=>{
                this.commonService.hideLoading();
                if(data.code==200){
                    if(this.source=='3'){
                        this.navCtrl.push(
                            PayCompletedPage,
                            {source:this.source,score:this.scanText.payAmount,actualPayMent:this.actualPayMent,discountAmount:this.commonService.toDecimal(this.discountBoolean?this.discountAmount:0),orderNo:data.result.orderNo,payTime:data.result.payTime}
                        );
                        this.commonService.toast("支付成功");
                    }else if(this.source=='2'){
                        this.orderNo = data.result.orderNo;
                        this.payTime = data.result.payTime;
                         var params = {
                                partnerid: data.result.generate.partnerid, // merchant id
                                prepayid: data.result.generate.prepayid, // prepay id
                                noncestr: data.result.generate.noncestr, // nonce
                                timestamp: data.result.generate.timestamp, // timestamp
                                sign: data.result.generate.sign, // signed string
                            };

                            Wechat.sendPaymentRequest(params, function () {
                                scanPage.gotoPayCompletedPage();
                            }, function (reason) {
                                this.commonService.alert("系统提示",reason);
                            });
                    }else if(this.source == '1'){
                        this.orderNo = data.result.orderNo;
                        this.payTime = data.result.payTime;
                        let payInfo  =data.result.orderInfo;
                        //第二步：调用支付插件
                        AliPay.pay(payInfo,
                            function success(e){
                               scanPage.alipaycallback();
                              // scanPage.commonService.toast("支付成功");
                              // scanPage.navCtrl.push(
                              //     PayCompletedPage,
                              //     {source:scanPage.source,score:scanPage.scanText.payAmount,actualPayMent:scanPage.actualPayMent,discountAmount:scanPage.commonService.toDecimal(scanPage.discountBoolean?scanPage.discountAmount:0),orderNo:scanPage.orderNo,payTime:scanPage.payTime}
                              // );
                            },function error(e){
                               this.commService.alert("系统提醒","支付失败");
                        });
                    }

                }else{
                    this.isDisable=false;
                    this.submitDisabled=false;
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    /*确认支付*/
    submitData(){
        if(this.source == '3'){
            if(Number(this.actualPayMent) > this.myScore){
                this.commonService.toast('您的余额不足');
            }else{
                this.isShowPayPw = true;
                this.isDisable=false;
            }
        }else if(this.source == '2' || this.source == '1'){
            this.buildPayOrder();
        }
        // else if(this.source == '1'){
            // sessionStorage.setItem("flag","1");
            // this.navCtrl.push(QuickPayInfoPage,
            //   {payScore:this.commonService.toDecimal(this.scanText.payAmount),
            //   actualPayMent:this.commonService.toDecimal(this.actualPayMent),
            //   discountAmount:this.commonService.toDecimal(this.discountBoolean?this.discountAmount:0),
            //   tranType:'1',
            //   storeUserId:this.scanText.storeUserId,
            //   payUrl:'/wallet/buildPayOrder',
            //   payData:{
            //       discountEP:this.epDiscountnum,
            //       payPwd:this.payPwd,
            //       score:this.scanText.payAmount,
            //       source:this.source,
            //       storeUserId:this.scanText.storeUserId
            //   },aliCallBackURL:'/wallet/query/alipayscanorder'});
        // }
    }

    /*返回上一页*/
    goToBackPage(){
        if(this.isShowPayPw){
            this.isShowPayPw = false;
            this.submitDisabled = false;
        }else{
            this.navCtrl.pop();
        }
    }

    alipaycallback(){//支付宝二次回调接口
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/wallet/query/alipayscanorder',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
          if(data.code==200){
              this.commonService.toast("支付成功");
              this.navCtrl.push(
                  PayCompletedPage,
                  {source:this.source,score:this.scanText.payAmount,actualPayMent:this.actualPayMent,discountAmount:this.commonService.toDecimal(this.discountBoolean?this.discountAmount:0),orderNo:this.orderNo,payTime:this.payTime}
              );
          }else{
              this.commonService.alert("系统提示",data.msg);
          }
        })
    }
    /*跳转到支付完成页面*/
    gotoPayCompletedPage(){
        // this.commonService.httpGet({
        //     url:this.commonService.baseUrl+'/wallet/isPaySuccess',
        //     data:{
        //         orderNo:this.orderNo
        //     }
        // }).then(data=>{
        //     if(data.code==200){
        //         this.commonService.toast("支付成功");
        //         this.navCtrl.push(
        //             PayCompletedPage,
        //             {source:this.source,score:this.scanText.payAmount,actualPayMent:this.actualPayMent,discountAmount:this.commonService.toDecimal(this.discountBoolean?this.discountAmount:0),orderNo:this.orderNo,payTime:this.payTime}
        //         );
        //     }else{
        //         this.commonService.alert("系统提示",data.msg);
        //     }
        // });

        var temnum =0 ;
        this.commonService.showLoading("提交数据中。。。");
        let interval = setInterval(()=>{
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/wallet/query/wxscanorder',
                data:{
                    orderNo:this.orderNo
                }
            }).then(data=>{
                if(data.code==200){
                    clearInterval(interval);//移除对象
                    this.commonService.hideLoading();
                    this.commonService.toast("支付成功");
                    this.navCtrl.push(
                        PayCompletedPage,
                        {source:this.source,score:this.scanText.payAmount,actualPayMent:this.actualPayMent,discountAmount:this.commonService.toDecimal(this.discountBoolean?this.discountAmount:0),orderNo:this.orderNo,payTime:this.payTime}
                    );
                }else{
                    if(temnum==2){
                        this.commonService.alert("系统提示",data.msg);
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
}
