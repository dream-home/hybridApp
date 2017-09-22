  import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
// import { QuickPayInfoPage } from '../quickPayInfo/quickPayInfo';

declare let Wechat:any;
declare let AliPay: any;
var rechargePage: any;
@Component({
    selector: 'page-recharge',
    templateUrl: 'recharge.html'
})

export class RechargePage {

    payType:string = '1';
    score:string;
    orderNo:string;
    userId:string;
    returnUrl:string;
    zhifubaoUrl:string;
    isDisable:boolean = false;

    constructor(public navCtrl: NavController, private commonService: CommonService,public alertCtrl: AlertController) {
        rechargePage = this;
        this.checkisinstallwx();
    }

    ionViewWillEnter(){
        // let backPage = sessionStorage.getItem("backPage");
        // if('1'===backPage){
        //     sessionStorage.setItem("backPage",'');
        //     this.goToBackPage();
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
                rechargePage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                rechargePage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            rechargePage.ishasewx = false;
        });
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*提交数据*/
    submitData(){
        if(parseFloat(this.score)<1){
            this.commonService.toast("充值余额必须大于1积分");
            return;
        }
        if(this.validator()){
            // if (this.payType=='1') {
            //     // //跳转支付宝支付页面
            //     // sessionStorage.setItem("payMoney",this.score+"");
            //     // sessionStorage.setItem("flag","1");
            //     // this.navCtrl.push(QuickPayInfoPage,{payScore:this.score,
            //     //     payUrl:'/wallet/recharge',
            //     //     payData:{
            //     //         score:this.score,
            //     //         source:this.payType,
            //     //     },
            //     //     aliCallBackURL:'/wallet/query/alipayChargeCallback'
            //     //   });
            //       //第一步：订单在服务端签名生成订单信息，具体请参考官网进行签名处理
            //       this.commonService.httpPost({
            //           url:this.commonService.baseUrl+'/wallet/recharge',
            //           data:{
            //               score:this.score,
            //               source:this.payType,
            //           }
            //       }).then(data=>{
            //           if(data.code=='200'){
            //               this.orderNo = data.result.orderNo;
            //               this.userId = data.result.userId;
            //               let payInfo  =data.result.orderInfo;
            //             	//第二步：调用支付插件
            //             	AliPay.pay(payInfo,
            //               	  function success(e){
            //               	     this.commService.alert("系统提醒","支付成功");
            //               	  },function error(e){
            //               	     this.commService.alert("系统提醒","支付失败");
            //               });
            //           }else{
            //               this.commonService.alert("系统提示",data.msg);
            //           }
            //       });
            //
            // }else{
              if(!this.ishasewx && this.payType=='2'){
                  this.commonService.alert("系统提醒","请先安装微信");
                  return;
              }else{
                  this.isDisable = true;
                  this.commonService.httpPost({
                      url:this.commonService.baseUrl+'/wallet/recharge',
                      data:{
                          score:this.score,
                          source:this.payType,
                      }
                  }).then(data=>{
                      if(data.code=='200'){
                          this.orderNo = data.result.orderNo;
                          this.userId = data.result.userId;
                          console.log(data.result);
                          if(this.payType=='1'){//支付宝支付
                              let payInfo  =data.result.orderInfo;
                            	//第二步：调用支付插件
                            	AliPay.pay(payInfo,
                              	  function success(e){
                                      rechargePage.alipaycallback();
                                      // rechargePage.commonService.toast("充值成功");
                                      // rechargePage.navCtrl.pop();
                              	  },function error(e){
                              	     this.commService.alert("系统提醒","支付失败");
                              });
                          }else{//微信支付
                              var params = {
                                  partnerid: data.result.generate.partnerid, // merchant id
                                  prepayid: data.result.generate.prepayid, // prepay id
                                  noncestr: data.result.generate.noncestr, // nonce
                                  timestamp: data.result.generate.timestamp, // timestamp
                                  sign: data.result.generate.sign, // signed string
                              };
                              Wechat.isInstalled(function (installed) {
                                  if(installed){
                                      Wechat.sendPaymentRequest(params, function () {
                                          rechargePage.paycallback();
                                      }, function (reason) {
                                          this.commonService.alert("系统提示",reason);
                                      });
                                  }else{
                                      this.commService.alert("系统提醒","请先安装微信");
                                  }
                              }, function (reason) {
                                  this.commService.alert("系统错误",reason);
                              });
                          }
                          this.isDisable = false;
                      }else{
                          this.commonService.alert("系统提示",data.msg);
                      }
                  });
              }
          }
        // }

    }


    validator(){
        if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(this.score)){
            this.commonService.toast("余额输入有误");
            return false;
        }
        if(parseFloat(this.score) >= 100000){
            this.commonService.toast("余额充值需小于100000");
            return false;
        }
        return true;
    }

    paycallback(){
        var temnum =0 ;
        this.commonService.showLoading("提交数据中。。。");
        let interval = setInterval(()=>{
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/wallet/query/wxChargeCallback',
                data:{
                    orderNo:this.orderNo
                }
            }).then(data=>{
                if(data.code==200){
                    clearInterval(interval);//移除对象
                    this.commonService.hideLoading();
                    this.showConfirm();
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
    alipaycallback(){//支付宝二次回调接口
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/wallet/query/alipayChargeCallback',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
          if(data.code==200){
              this.commonService.toast("充值成功");
              this.navCtrl.pop();
          }else{
              this.commonService.alert("系统提示",data.msg);
          }
        })
    }

    showConfirm() {
      let confirm = this.alertCtrl.create({
        title: '系统提示',
        message: '充值成功',
        enableBackdropDismiss:false,
        buttons: [
          {
            text: '确定',
            handler: () => {
              this.navCtrl.pop();
            }
          }
        ]
      });
      confirm.present();
    }
}
