import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,LoadingController,AlertController } from 'ionic-angular';
/*import { MobileSettingPage } from '../mobileSetting/mobileSetting';*/
/*import { PayPwSettingPage } from '../payPwSetting/payPwSetting';*/
/*import { LoginPwdSettingPage } from '../loginPwdSetting/loginPwdSetting';*/
import { AboutPage } from '../about/about';
import { LoginPage } from '../login/login';
import { UpdateMessagePage } from '../updateMessage/updateMessage';
import { Platform } from 'ionic-angular';

import { UserInfoPage } from '../userInfo/userInfo';
import { DeliveryAddressPage } from '../deliveryAddress/deliveryAddress';
@Component({
    selector: 'page-sysSetting',
    templateUrl: 'sysSetting.html'
})
export class SysSettingPage {
    osType:number;
    isupdate:boolean=false;
    updateData:any;
    constructor(
        public navCtrl: NavController,
        public commonService: CommonService,
        public loadingCtrl:LoadingController,
        private alertController: AlertController,
        public plt: Platform

    ) {
        if (this.plt.is('ios')) {
            // This will only print when on iOS
            this.osType=1;
        }else{
            this.osType=0;
        }
        this.getUpdate();
    }
    /*用户信息*/
    gotoUserInfoPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(UserInfoPage);
        }
    }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*登录页面*/
    goToLoginPage(){
        this.navCtrl.push(LoginPage);
    }

   /* settingLoginPw(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(LoginPwdSettingPage);
        }
    }

    settingMobile(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MobileSettingPage);
        }
    }

    settingPayPw(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(PayPwSettingPage);
        }
    }*/

    openAbout(){
        this.navCtrl.push(AboutPage);
    }
    
    /*退出登陆*/
    exitLogin(){
        this.commonService.token = null;
        this.commonService.count = 0;
        this.commonService.showOpenRed = true;
        localStorage.removeItem("token");
        localStorage.clear();
        sessionStorage.clear();
        this.commonService.alert("系统提示","您已成功退出当前账号!");
        this.navCtrl.pop();
    }

    /*获取版本更新*/
    getUpdate(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/system/update',
            data:{
                osType:this.osType
            }
        }).then(data=>{
            if(data.code==200){
                this.updateData = data.result;
                if(this.osType==0){//android
                    if(this.commonService.appVer!=data.result.androidAppVersion){
                        this.isupdate = true;
                    }
                }else if(this.osType==1){//ios
                    if(this.commonService.appVer!=data.result.iosAppVersion){
                        this.isupdate = true;
                    }
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    checkUpdate(){
        this.navCtrl.push(UpdateMessagePage);
    }

    //跳转收货地址页面
    gotoDeliveryAddress(urlId){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(DeliveryAddressPage,{fromId:urlId});
        }
    }

}
