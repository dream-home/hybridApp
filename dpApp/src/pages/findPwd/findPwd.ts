import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-findPwd',
    templateUrl: 'findPwd.html'
})
export class FindPwdPage {
    strImg:string;
    key:string;
    phone:string
    picCode:string;
    isShowSetPw:boolean = false;
    newPwd:string;
    okPwd:string;
    msgCode:string;
    constructor(public navCtrl: NavController, private commonService: CommonService ) {
        this.loadData();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*提交数据*/
    subData(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/forget/loginPassword',
                data:{
                    newLoginPass:this.newPwd,
                    newLoginPassConfirm:this.okPwd,
                    phone:this.phone,
                    smsCode:this.msgCode
                }
            }).then(data=>{
                if(data.code==200){
                    let toast = this.commonService.toast("修改登录密码成功");
                    toast.onDidDismiss(() => {
                        this.goToBackPage();
                    });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    /*获取短信*/
    loadMsg(){
        if(this.validatorMsg()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/common/forgetLoginSmsCode',
                data:{
                    key:this.key,
                    phone:this.phone,
                    picCode:this.picCode
                }
            }).then(data=>{
                if(data.code==200){
                    this.isShowSetPw = true;
                }else{
                    this.commonService.alert("系统提示",data.msg);
                    this.loadData();
                }
            });
        }
    }

    /*获取图片验证码*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/common/forgetLoginPic',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.strImg = data.result.picCode;
                this.key = data.result.key;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    validatorMsg(){
        if(!(/^1[34578]\d{9}$/.test(this.phone))){
            this.commonService.toast("手机号码有误，请重填");
            return false;
        }
        if(!(/^[0-9a-zA-Z]{4}$/.test(this.picCode))){
            this.commonService.toast("图片验证码输入有误，请重填");
            return false;
        }
        return true;
    }

    validator(){
        if(!(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9a-zA-Z]{6,15}$/.test(this.newPwd))){
            this.commonService.toast("密码必须由字母和数字组成，长度在6～15之间");
            return false;
        }

        if(this.okPwd != this.newPwd){
            this.commonService.toast("密码输入不一致");
            return false;
        }

        if(!(/^[0-9]{6}$/.test(this.msgCode))){
            this.commonService.toast("短信验证码必须是6位数字");
            return false;
        }
        return true;
    }

}
