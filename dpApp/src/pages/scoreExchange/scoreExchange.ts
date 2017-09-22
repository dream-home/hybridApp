import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,LoadingController } from 'ionic-angular';
import { UserInfoPage } from '../userInfo/userInfo';
import { AlertController } from 'ionic-angular';
declare var $;
declare let Wechat:any;
var scoreExchangePage: any;
let loader:any;
var commService:CommonService;
@Component({
    selector: 'page-scoreExchange',
    templateUrl: 'scoreExchange.html'
})
export class ScoreExchangePage {

    score:number;
    total:string;
    fee:number=0.05;
    trueScore:string;
    payPanel:boolean=false;
    payPwd:string;
    banks:string="";//提现银行卡名称和id
    username:string="";//体现银行卡姓名
    idcarNumber:string="";//提现的银行卡号
    isDisable:boolean=false;
    flage:boolean=false;
    source:string='0';//提现类型
    btnisDisable:boolean=false;
    constructor(public navCtrl: NavController,
        private commonService: CommonService,
        public alertCtrl: AlertController,
        public loadingCtrl:LoadingController ) {
        this.total = sessionStorage.getItem("score");
        this.fee = commonService.params!=null?commonService.params.exchangePoundageScale:0.05;
        this.username=this.commonService.user.userName;
        scoreExchangePage = this;
        commService = commonService;
       // console.log(this.username);
        if(this.username==""||this.username==null){
            this.flage=true;
        }else{
            this.flage=false;
        }
        if(commonService.user.userBankcard!=null && commonService.user.userBankcard!=''){
            this.banks = commonService.user.userBankcard.bankId+','+commonService.user.userBankcard.bankName;
            this.idcarNumber = commonService.user.userBankcard.cardNo;
        }
        this.checkisinstallwx();
        if(commonService.params.exchangeWay == '3'){
            this.isBindSHWeiXin();
        }


    }

    /*返回上一页*/
    goToBackPage(){
        if(this.payPanel){
            this.payPanel = false;
        }else{
            this.navCtrl.pop();
        }
    }

    ionViewWillEnter(){

    }

    showTrueScore(){
        let n = this.score;
        this.trueScore = new Number(n-this.score * this.fee).toFixed(2);
    }

    submitData(){
        this.btnisDisable = true;
        let interval = setInterval(()=>{
          this.btnisDisable=false;clearInterval(interval);//移除对象
        },2000);
        if(this.commonService.params.exchangeWay == '2' || this.commonService.params.exchangeWay == '1'){
            if(this.validator()){
                this.payPanel = true;
            }
        }else{
          console.log("进这里来？？？？");
          if(this.validator()){
              this.payPanel = true;
              // this.submitPay();
          }
        }

    }

    submitPay(){
        this.isDisable = true;
        let bankInfo=[];
        bankInfo=this.banks.split(","); //字符分割
       /* console.log("银行："+this.banks);
        console.log("银行id："+bankInfo[0]);
         console.log("银行名："+bankInfo[1]);
          console.log("银行卡号："+this.idcarNumber);
           console.log("支付密码"+this.payPwd);
           console.log("兑换数量"+this.score);*/
        if(this.commonService.params.exchangeWay=='3'){
            this.source = '3';
        }else{
            this.source = '1';
        }
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/wallet/v42/exchange',
            data:{
                bankId:bankInfo[0],
                bankName:bankInfo[1],
                cardNo:this.idcarNumber,
                source:this.source,
                payPwd:this.payPwd,
                userName:this.username,
                score:this.score
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.toast("余额兑换成功");
                this.getUserInfo();
                this.goToBackPage();
                this.goToBackPage();

            }else{
                this.isDisable = false;
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    cancel(){
        this.payPwd = '';
        this.payPanel = false;
    }

    validator(){
        if(!this.score || this.score==0){
            this.commonService.toast("兑换余额不能为空且必须大于0");
            return false;
        }
        if(!(/^[0-9]*[1-9][0-9]*$/).test(this.score+'')){

            this.commonService.toast("兑换余额必须是正整数");
            return false;
        }
        // if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(this.score+'')){
        //     this.commonService.toast("兑换余额输入有误(如有小数精确到2位)");
        //     return false;
        // }
        if(this.score*1<this.commonService.params.exchangeMin*1 || this.score*1>this.commonService.params.exchangeMax*1){
            this.commonService.toast("兑换余额范围只能在"+this.commonService.params.exchangeMin+"~"+this.commonService.params.exchangeMax);
            return false;
        }
        if(this.score>parseFloat(this.total)){
            this.commonService.toast("兑换余额不能大于"+this.total);
            return false;
        }
        if(Number(this.score)%100!=0){
            this.commonService.toast("兑换余额的数量只允许输入100的倍数");
            return false;
        }
        if(this.username==null||this.username==""){
            this.commonService.toast("姓名不能为空！");
            return false;
        }
        if(this.commonService.params.exchangeWay == '2' || this.commonService.params.exchangeWay == '1'){
            if(this.banks==null||this.banks==""){
                this.commonService.toast("银行不能为空！");
                return false;
            }
            if(this.idcarNumber==null||this.idcarNumber==""){
                this.commonService.toast("银行卡号不能为空！");
                return false;
            }
           if(!(/^[0-9]*$/).test(this.idcarNumber+'')){
                this.commonService.toast("请输入纯数字的银行卡号！");
                return false;
            }

        }
        this.payPanel = true;
        return true;
    }

    bindCard(){
        this.navCtrl.push(UserInfoPage);
    }
    //获取用户信息
    getUserInfo(){
         this.commonService.httpGet({
              url:this.commonService.baseUrl+'/user/login/getUser',
              data:{

              }
          }).then(data=>{
              if(data.code==200){
                this.commonService.user=data.result;
              }else{
                  this.commonService.alert("系统提示",data.msg);
              }
          });
    }

    isBindSHWeiXin(){
        console.log("this.commonService.user.isBindSHWeiXin "+this.commonService.user.isBindSHWeiXin+"  this.ishasewx "+this.ishasewx);
        if(this.commonService.user.isBindAppOpenId != '0' ){
            let confirm = this.alertCtrl.create({
              title: '系统提示',
              message: '提现需要获取到微信信息，是否调整到微信？',
              enableBackdropDismiss:false,
              buttons: [
                {
                  text: '确认',
                  handler: () => {
                      scoreExchangePage.weiXinLogin();
                  }
                },
                {
                  text: '取消',
                  handler: () => {
                      this.navCtrl.pop();
                  }
                }
              ]
            });
            confirm.present();
        }
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
                scoreExchangePage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                scoreExchangePage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            scoreExchangePage.ishasewx = false;
        });
    }

    weiXinLogin(){
        loader = this.loadingCtrl.create({content: "数据加载中..."});

        Wechat.isInstalled(function (installed) {

            if(installed){
                var scope = "snsapi_userinfo",
                state = "_" + (+new Date());
                Wechat.auth(scope, state, function (response) {
                    loader.present();
                    console.log(" wx login ------response  "+JSON.stringify(response))
                    commService.httpGet({
                        url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+commService.wxappid+'&secret='+commService.wxappsecret+'&code='+response.code+'&grant_type=authorization_code',
                        data:{}
                    }).then(data=>{
                        console.log("------------->>>>>weiXinLogin data "+JSON.stringify(data));
                        loader.dismiss().catch(()=>{});
                        commService.httpGet({
                            url:'https://api.weixin.qq.com/sns/userinfo?access_token='+data.access_token+'&openid='+data.openid+'&lang=zh_CN',
                            data:{}
                        }).then(data=>{
                            data.inviteCode='';
                            console.log("------------->>>>>weiXinLogineeeeee data "+JSON.stringify(data));
                            scoreExchangePage.bindWX(data);
                        });
                    });
                }, function (reason) {
                    loader.dismiss().catch(()=>{});
                    // commService.alert("系统错误",reason);
                });
            }else{
                loader.dismiss().catch(()=>{});
                commService.alert("系统提醒","请先安装微信");
            }
        }, function (reason) {
            loader.dismiss().catch(()=>{});
            commService.alert("系统错误",reason);
        });
    }

    bindWX(data){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+"/user/bindappopenid",
            data:{
                appOpenId:data.openid
            }
        }).then(data=>{
            if(data.code == '200'){
                this.commonService.toast("绑定成功");
                this.getUserInfo();
                this.commonService.user.isBindAppOpenId = '0';
            }else{
                commService.alert("系统错误",data.msg);
            }
        });
    }

}
