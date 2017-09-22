import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
// import { QuickPayInfoPage } from '../quickPayInfo/quickPayInfo';
import { PaySuccessPage } from '../paySuccess/paySuccess';
import { AlertController } from 'ionic-angular';
import { ServiceAgreementPage } from '../serviceAgreement/serviceAgreement';
import { PayCompletedPage } from '../payCompleted/payCompleted';
declare let Wechat:any;
declare let AliPay: any;
var payMentPage: any;
@Component({
    selector: 'page-payMent',
    templateUrl: 'payMent.html'
})
export class PayMentPage {

    showPayType:string='3';
    paymentAmount:number;
    isShowPayPw:boolean = false;
    checkStatus:boolean = true;
    isDisable:boolean = false;//余额支付确定按钮点击后禁用，防止连点促发事件
    submitDisabled:boolean=false;//确定支付按钮点击后禁用，防止连点促发事件
    myScore:number;
    myEP:number;
    orderNo:string;
    payTime:string;
    payPwd:string='';

    type:number=2;
    storeUserId:string;
    storeId:string;
    shopData:any;
    discountBoolean:boolean = false;
    onePayWay:boolean=false;//是否只能余额支付,在EP抵用券设置为100时
    epDiscountnum:number=0;//ep抵用券百分比
    actualPayMent:number = 0 ;//实际付款
    discountAmount:number=0;//抵用金额
    discountNum:number=0;//实际优惠金额
    constructor(
        private navCtrl: NavController,
        private commonService: CommonService,
        public navParams: NavParams,
        public alertCtrl: AlertController
    ) {
          payMentPage = this;
          this.storeUserId = navParams.get('storeUserId');
          this.storeId = navParams.get('storeId');
          this.getuserscore();
          this.getShopInfo();
          this.checkisinstallwx();

    }
    /*页面事件*/
    ionViewWillEnter(){
         this.submitDisabled=false;
         this.getByUserId();
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
                payMentPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                payMentPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            payMentPage.ishasewx = false;
        });
    }

    getShopInfo(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/info',
            data:{
                inviteCode:'',
                storeId:this.storeId
            }
        }).then(data=>{
            if(data.code==200){
                this.shopData = data.result;
                if(this.shopData==null){
                    this.navCtrl.pop();
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /*获取用户积分*/
    getuserscore(){
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
    /*获取二维码分销*/
    getByUserId(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/payDistribution/getByUserId',
            data:{
                type:this.type,
                userid:this.storeUserId
            }
        }).then(data=>{
            if(data.code=='200'){
                if(data.result != null){
                    this.epDiscountnum = data.result.discountEP;
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    //计算EP抵扣
    calculation(){
        this.actualPayMent=Number(this.paymentAmount);
        this.discountAmount=(Number(this.paymentAmount)*this.epDiscountnum*0.01);

        if(this.discountBoolean){
            if(this.discountAmount > this.myEP){
                console.log(" 这里实际金额是多少?? "+this.actualPayMent)
                this.discountNum = this.myEP;
                this.actualPayMent=(Number(this.paymentAmount)-this.discountNum);
                console.log(" 这里实际金额是多少?? "+this.actualPayMent)
            }else{
                this.discountNum = (Number(this.paymentAmount)*this.epDiscountnum*0.01);;
                this.actualPayMent=(Number(this.paymentAmount)-this.discountAmount);
            }
        }else{
            this.actualPayMent=Number(this.paymentAmount);
            this.discountNum=0;
        }
        console.log("discountAmount "+this.discountAmount+" this.epDiscountnum "+this.epDiscountnum+" actualPayMent "+this.actualPayMent+" this.discountAmount > this.myEP "+(this.discountAmount > this.myEP));
    }

    /*是否使用EP兑换券*/
    epDiscount(){
        if(this.discountBoolean){
            this.discountBoolean = false;
            this.onePayWay=false;
            this.actualPayMent=Number(this.paymentAmount);
            this.discountNum=0;
        }else{
            this.discountBoolean = true;
            if(this.discountAmount > this.myEP){
                this.discountNum = this.myEP;
                this.actualPayMent=(Number(this.paymentAmount)-this.myEP);
            }else{
                this.discountNum = this.discountAmount;
                this.actualPayMent=(Number(this.paymentAmount)-this.discountAmount);
            }
            if(this.epDiscountnum==100 && this.actualPayMent==0){
                this.onePayWay=true;
                this.showPayType='3';
            }
        }
        console.log("this.discountNum "+this.discountNum+"discountAmount "+this.discountAmount+" this.epDiscountnum "+this.epDiscountnum+" actualPayMent "+this.actualPayMent+" this.discountAmount > this.myEP "+(this.discountAmount > this.myEP));
    }

    changePayType(payType){
        this.showPayType = payType;
    }

    check(status){
        if(status == 0){
            this.checkStatus = true;
        }else{
            this.checkStatus = false;
        }
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

    ServiceAgreementPage(){
        this.navCtrl.push(ServiceAgreementPage);
    }

    payFor(){
        if(!this.validator()){
            return;
        }
        var con;
        if(this.isShowPayPw == false){
            let confirm = this.alertCtrl.create({
              title: '温馨提醒',
              message: '付款后，资金将直接进入商家账户，如果需要退款、退货请与商家联系，斗拍不介入交易纠纷处理',
              enableBackdropDismiss:false,
              buttons: [
                {
                  text: '确定',
                  handler: () => {
                    if(this.showPayType=='3'){
                        this.isShowPayPw=true;
                        this.isDisable = false;
                    }else{
                        this.getPay();
                    }
                  }
                },
                {
                  text: '取消',
                  handler: () => {
                      con = false;
                  }
                }
              ]
            });
            confirm.present();
        }else{
            con=true;
        }

        if(con==true){
            this.getPay();
        }
    }

    getPay(){
            this.submitDisabled=true;
          //   if(this.showPayType=='1'){
          //     sessionStorage.setItem("flag","1");
          //     this.navCtrl.push(QuickPayInfoPage,{tranType:'3',payData:{
          //         codeType:'2',
          //         discountEP:this.discountNum,
          //         payPwd:this.payPwd,
          //         score:this.paymentAmount,
          //         source:this.showPayType,
          //         storeUserId:this.storeUserId
          //     },payUrl:'/wallet/storeBuildPayOrder',
          //     aliCallBackURL:'/wallet/query/storealipayscanorder',
          //     payScore:this.commonService.toDecimal(this.paymentAmount),
          //     storeId:this.shopData.id,actualPayMent:(this.actualPayMent==null?0:this.actualPayMent),
          //     discountAmount:this.commonService.toDecimal((this.discountBoolean?(this.discountAmount>this.myEP?this.myEP:this.discountAmount):0))});
          // }else if(this.showPayType=='2' || this.showPayType=='3'){
            if(this.showPayType=='3' && this.isShowPayPw == false){
                if(this.actualPayMent*1 > this.myScore){
                    this.commonService.toast('您的余额不足');
                }else{
                    this.isShowPayPw = true;
                    this.isDisable=false;
                }
                return;
            }
            this.isDisable=true;
            if(!this.ishasewx && this.showPayType=='2'){
                this.commonService.alert("系统提醒","请先安装微信");
                this.submitDisabled=false;
                return;
            }else{
                this.commonService.httpPost({
                    url:this.commonService.baseUrl+"/wallet/storeBuildPayOrder",
                    data:{
                        codeType:2,
                        discountEP:this.discountNum,
                        payPwd:this.payPwd,
                        score:this.paymentAmount,
                        source:this.showPayType,
                        storeUserId:this.storeUserId
                    }
                }).then(data=>{
                    if(data.code==200){
                        this.orderNo = data.result.orderNo;
                        // alert(this.orderNo);
                        this.payTime = data.result.payTime;
                        if(this.showPayType == '2'){//微信
                             var params = {
                                    partnerid: data.result.generate.partnerid, // merchant id
                                    prepayid: data.result.generate.prepayid, // prepay id
                                    noncestr: data.result.generate.noncestr, // nonce
                                    timestamp: data.result.generate.timestamp, // timestamp
                                    sign: data.result.generate.sign, // signed string
                                };
                                let interval = setInterval(()=>{
                                  this.submitDisabled=false;clearInterval(interval);//移除对象
                                },2000);
                                Wechat.sendPaymentRequest(params, function () {
                                    payMentPage.buyCompleted();
                                }, function (reason) {
                                    this.commonService.alert("系统提示",reason);
                                });
                        }else if(this.showPayType=='3'){
                            this.commonService.toast("支付成功");
                            this.isDisable = true;
                            this.navCtrl.push(PaySuccessPage,{shopID:this.shopData.id,paymentAmount:this.paymentAmount,gotoPage:'payMent',actualPayMent:(this.actualPayMent==null?0:this.actualPayMent),discountAmount:this.commonService.toDecimal((this.discountBoolean?(this.discountAmount>this.myEP?this.myEP:this.discountAmount):0))});

                        }else if(this.showPayType=='1'){
                            let payInfo  =data.result.orderInfo;
                            //第二步：调用支付插件
                            AliPay.pay(payInfo,
                                function success(e){
                                   payMentPage.alipaycallback();
                                  // payMentPage.commonService.toast("支付成功");
                                  // payMentPage.navCtrl.push(PaySuccessPage,{shopID:payMentPage.shopData.id,paymentAmount:payMentPage.paymentAmount,actualPayMent:(payMentPage.actualPayMent==null?0:payMentPage.actualPayMent),discountAmount:payMentPage.commonService.toDecimal((payMentPage.discountBoolean?(payMentPage.discountAmount>payMentPage.myEP?payMentPage.myEP:payMentPage.discountAmount):0))});
                                },function error(e){
                                   this.commService.alert("系统提醒","支付失败");
                            });
                        }

                    }else{
                        this.commonService.alert("系统提示",data.msg);
                        this.isDisable=false;
                        this.submitDisabled=false;
                    }
                });
            }
            // }
    }

    /*取消支付*/
    cancel(){
        this.isShowPayPw = false;
        // this.discountBoolean = ;
    }

    /*数据验证*/
    validator(){
        if(this.paymentAmount == null){
            this.commonService.toast("付款金额不能为空");
            return false;
        }
        if(this.paymentAmount < 1){
            this.commonService.toast("付款金额不能小于1");
            return false;
        }
        if(this.paymentAmount > 99999){
            this.commonService.toast("付款金额不能超过99999");
            return false;
        }
        if(!(/^([1-9][\d]{0,5}|0)(\.[\d]{1,2})?$/).test(this.paymentAmount+'')){
            this.commonService.toast("付款金额输入有误(如有小数最多保留两位)");
            return false;
        }
        if(this.showPayType=='3'){
            if(this.paymentAmount*1 > this.myScore){
                this.commonService.toast('您的账户余额不足,请选择其他支付方式');
                return false;
            }
        }
        return true;
    }
    alipaycallback(){//支付宝二次回调接口
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/wallet/query/storealipayscanorder',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.toast("支付成功");
                this.navCtrl.push(PaySuccessPage,{shopID:this.shopData.id,paymentAmount:this.paymentAmount,actualPayMent:(this.actualPayMent==null?0:this.actualPayMent),discountAmount:this.commonService.toDecimal((this.discountBoolean?(this.discountAmount>this.myEP?this.myEP:this.discountAmount):0))});
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        })
    }
    buyCompleted(){
        // this.commonService.httpGet({
        //     url:this.commonService.baseUrl+'/wallet/isPaySuccess',
        //     data:{
        //         orderNo:this.orderNo
        //     }
        // }).then(data=>{
        //     if(data.code==200){
        //         this.commonService.toast("支付成功");
        //         this.navCtrl.push(PaySuccessPage,{shopID:this.shopData.id,paymentAmount:this.paymentAmount,actualPayMent:(this.actualPayMent==null?0:this.actualPayMent),discountAmount:this.commonService.toDecimal((this.discountBoolean?(this.discountAmount>this.myEP?this.myEP:this.discountAmount):0))});
        //     }else{
        //         this.commonService.alert("系统提示",data.msg);
        //     }
        // });
        var temnum =0 ;
        this.commonService.showLoading("提交数据中。。。");
        let interval = setInterval(()=>{
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/wallet/query/storewxscanorder',
                data:{
                    orderNo:this.orderNo
                }
            }).then(data=>{
                if(data.code==200){
                    clearInterval(interval);//移除对象
                    this.commonService.hideLoading();
                    // this.commonService.toast("支付成功");
                    // this.navCtrl.push(PaySuccessPage,{shopID:this.shopData.id,paymentAmount:this.paymentAmount,actualPayMent:(this.actualPayMent==null?0:this.actualPayMent),discountAmount:this.commonService.toDecimal((this.discountBoolean?(this.discountAmount>this.myEP?this.myEP:this.discountAmount):0))});
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
    toNumber(num:number){
        return num.toFixed(2);
    }
}
