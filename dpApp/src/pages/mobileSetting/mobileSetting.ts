import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-mobileSetting',
    templateUrl: 'mobileSetting.html'
})
export class MobileSettingPage {
    mobile:string;
    imgCode:string;
    isShowMsgCode:boolean = false;
    imgStr:string;
    smsCode:string;
    constructor(public navCtrl: NavController,private commonService: CommonService) {
        this.loadImgCode();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*获取手机验证码*/
    loadMsgCode(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/common/smsCode',
                data:{
                    phone:this.mobile,
                    picCode:this.imgCode
                }
            }).then(data=>{
                if(data.code==200){
                    this.isShowMsgCode = true;
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    /*绑定手机号*/
    bingdMobileCode(){
        if(this.validatorMobile()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/change/phone',
                data:{
                    phone:this.mobile,
                    smsCode:this.smsCode
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.user.phone = this.mobile;
                    let toast = this.commonService.toast("绑定手机号成功");
                    toast.onDidDismiss(() => {
                        this.goToBackPage();
                    });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    /*获取图片验证码*/
    loadImgCode(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/common/picBase64Code',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.imgStr = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*绑定手机号验证*/
    validator(){
        if(!(/^1[34578]\d{9}$/.test(this.mobile))){
            this.commonService.toast("手机号码有误，请重填");
            return false;
        }
        if(!(/^[0-9a-zA-Z]{4}$/.test(this.imgCode))){
            this.commonService.toast("图片验证码输入有误，请重填");
            return false;
        }
        return true;
    }

    validatorMobile(){
        if(!(/^\d{6}$/.test(this.smsCode))){
            this.commonService.toast("手机验证码输入有误，请重填");
            return false;
        }
        return true;
    }

}
