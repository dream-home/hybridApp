import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-loginPwdSetting',
    templateUrl: 'loginPwdSetting.html'
})
export class LoginPwdSettingPage {
    oldPwd:string='';
    newPwd:string;
    newPwd2:string;
    constructor(public navCtrl: NavController,public commonService: CommonService) {

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    submitData(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/change/loginPwd',
                data:{
                    oldLoginPwd:this.oldPwd,
                    newLoginPwd:this.newPwd,
                    newLoginPwdConfirm:this.newPwd2
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.user.isSetPassword = '1';
                    this.commonService.toast("修改登录密码成功");
                    this.commonService.token = null;
                    this.commonService.count = 0;
                    this.commonService.showOpenRed = true;
                    localStorage.removeItem("token");
                    localStorage.clear();
                    sessionStorage.clear();
                    this.navCtrl.pop();
                    this.navCtrl.pop();
                    this.navCtrl.pop();
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }


    validator(){
        if(this.commonService.user.isSetPassword=='1' && (!(/^[0-9a-zA-Z]{6,15}$/.test(this.oldPwd)))){
            this.commonService.toast("旧密码输入有误，请重填");
            return false;
        }
        if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{6,15}$/.test(this.newPwd))){
            this.commonService.toast("密码必须由字母和数字组成，长度在6～15之间");
            return false;
        }
        if(this.newPwd != this.newPwd2){
            this.commonService.toast("新密码和确认码输入不一致，请重填");
            return false;
        }
        return true;
    }

}
