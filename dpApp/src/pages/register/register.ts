import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { LoginPage } from '../login/login';
import { CommonService } from '../../app/app.base';

@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage{

    invitationCode:string;//邀请码
    nickName:string;//昵称
    telPhone:string;//手机号码
    loginPwd:string;//登录密码
    loginPwdagain:string;//再次确认登录密码
    msgCode:string;//短信验证码
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //发送短信验证码
    sendMsgCode(){
        if(this.telPhone == null || this.telPhone == ''){
            this.commonService.toast("手机号码不能为空");
        }else if(!(/^1[34578]\d{9}$/).test(this.telPhone)){
            this.commonService.toast("手机号码有误，请重填");
        }else{
            this.commonService.httpPost({
                url:this.commonService.baseUrl+"/common/registersms",
                data:{
                  phone:this.telPhone,
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast('发送成功');
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    //提交注册信息
    submitRegistr(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+"/user/registerwithphone",
                data:{
                  inviteCode:this.invitationCode,
                  password:this.loginPwd,
                  passwordConfirm:this.loginPwdagain,
                  phone:this.telPhone,
                  registrationId:this.commonService.registrationId,
                  smsCode:this.msgCode,
                  nickName:this.nickName,
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast('注册成功');
                    this.goToBackPage();
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    //验证
    validator(){
        if(this.invitationCode == null || this.invitationCode == ''){
            this.commonService.toast("邀请码不能为空");
            return false;
        }
        if(this.nickName == null || this.nickName == ''){
            this.commonService.toast("昵称不能为空");
            return false;
        }
        if(this.telPhone == null || this.telPhone == ''){
            this.commonService.toast("手机号码不能为空");
            return false;
        }
        if(!(/^1[34578]\d{9}$/).test(this.telPhone)){
            this.commonService.toast("手机号码有误，请重填");
            return false;
        }
        if(this.loginPwd == null || this.loginPwd == ''){
            this.commonService.toast("登录密码不能为空");
            return false;
        }
        if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{6,15}$/.test(this.loginPwd))){
            this.commonService.toast("密码必须由字母和数字组成，长度在6～15之间");
            return false;
        }
        // if(this.loginPwd.length < 6){
        //     this.commonService.toast("登录密码最少6位数");
        //     return false;
        // }
        // if(this.loginPwd.length > 32){
        //     this.commonService.toast("登录密码最多32位数");
        //     return false;
        // }
        if(this.loginPwd != this.loginPwdagain){
            this.commonService.toast("再次输入密码错误，请重新输入");
            return false;
        }
        if(this.msgCode == null || this.msgCode == ''){
            this.commonService.toast("短信验证码不能为空");
            return false;
        }
        if(!(/^[0-9]{6}$/.test(this.msgCode))){
            this.commonService.toast("短信验证码必须是6位数字");
            return false;
        }
        return true;
    }
}
