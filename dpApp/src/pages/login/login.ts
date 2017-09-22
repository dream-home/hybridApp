import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,LoadingController } from 'ionic-angular';
import { OtherLoginPage } from '../otherLogin/otherLogin';
import { UserAgreementPage } from '../userAgreement/userAgreement';
declare let Wechat:any;
var commService:CommonService;
var loginPage: any;
let loader:any;
declare let window:any;
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

    constructor(public navCtrl: NavController,
        public commonService: CommonService,
        public loadingCtrl:LoadingController,
    ) {
        commService = commonService;
        loginPage = this;
        this.checkisinstallwx();
        if(commService.registrationId==null||commService.registrationId==''){
            this.init();
        }
    }

    /*页面事件*/
    ionViewWillEnter(){
        if(commService.token!=null && commService.token.length>5){
            this.goToBackPage();
        }
    }

    goToBackPage(){
        this.navCtrl.pop();
    }

     /**
     * 注册极光
     */
    init() {
    //启动极光推送
        if (window.plugins && window.plugins.jPushPlugin) {
            window.plugins.jPushPlugin.init();
            window.plugins.jPushPlugin.getRegistrationID(function(data) {
                commService.registrationId=data;
             });
        }
     }

    loginIn(reqData){
        commService.httpPost({
            url:commService.baseUrl+'/user/login/weixin',
            data:{
                headImgUrl:reqData.headimgurl,
                nickName:reqData.nickname,
                inviteCode:reqData.inviteCode,
                weixin:reqData.unionid,
                registrationId:commService.registrationId
            }
        }).then(data=>{
            if(data.code=='200'){
                //登录成功
                commService.token = data.result.token;
                commService.user = data.result;
                localStorage.setItem("token", commService.token);
                /*签到*/
                this.commonService.signedIn();
                let toast = this.commonService.toast("用户登录成功");
                toast.onDidDismiss(() => {
                    this.commonService.loadMsgCount();
                    this.goToBackPage();
                });
            }else if(data.code=='10000'){
                //输入邀请码
                loginPage.openInputCode(reqData);
            }else{
                commService.alert("登录失败",data.msg);
            }
        });
    }

    openInputCode(reqData){
        let prompt = commService.alertCtrl.create({
            message: "请输入邀请码",
            enableBackdropDismiss:false,
            inputs: [{
                name: 'code',
                placeholder: '邀请码'
            },],
            buttons: [{
                text: '取消',
                handler: data => {
                }
            },
            {
                text: '登录',
                role:null,
                handler: data => {
                    if(!(/^[0-9]{6,11}$/).test(data.code)){
                        commService.toast("邀请码必须为6~11位数字");
                        return false;
                    }
                    reqData.inviteCode = data.code;
                    loginPage.loginIn(reqData);
                }
            }]
        });
        prompt.present();
    }

    weiXinLogin(){
        loader = this.loadingCtrl.create({content: "数据加载中..."});

        Wechat.isInstalled(function (installed) {

            if(installed){
                var scope = "snsapi_userinfo",
                state = "_" + (+new Date());
                Wechat.auth(scope, state, function (response) {
                    loader.present();
                    commService.httpGet({
                        url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid=wx1581a2802e11162d&secret=2f25e5339178db0314b2742cb13605e6&code='+response.code+'&grant_type=authorization_code',
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
                            loginPage.loginIn(data);
                        });
                    });
                }, function (reason) {
                    loader.dismiss().catch(()=>{});
                    commService.alert("系统错误",reason);
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


    showAgreement(){
        this.navCtrl.push(UserAgreementPage);
    }

    goToOtherLoginPage(){
        this.navCtrl.push(OtherLoginPage);
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
                loginPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                loginPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            loginPage.ishasewx = false;
        });
    }

}
