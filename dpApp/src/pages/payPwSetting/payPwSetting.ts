import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { FindPayPwdPage } from '../findPayPwd/findPayPwd';

@Component({
    selector: 'page-payPwSetting',
    templateUrl: 'payPwSetting.html'
})
export class PayPwSettingPage {
    oldPayPwd:string;
    newPayPwd:string;
    newPayPwd2:string;
    constructor(public navCtrl: NavController,public commonService: CommonService) {

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    submitData(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/change/payPwd',
                data:{
                    oldPayPwd:this.oldPayPwd,
                    newPayPwd:this.newPayPwd,
                    newPayPwd2:this.newPayPwd2
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.user.isSetPayPwd = '1';
                    let toast = this.commonService.toast("修改支付密码成功");
                    toast.onDidDismiss(() => {
                        this.goToBackPage();
                    });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    gotoFindPayPwdPage(){
        this.navCtrl.push(FindPayPwdPage);
    }

    validator(){
        if(this.commonService.user.isSetPayPwd=='1' && (!(/^\d{6}$/.test(this.oldPayPwd)))){
            this.commonService.toast("旧密码输入有误，请重填");
            return false;
        }
        if(!(/^\d{6}$/.test(this.newPayPwd))){
            this.commonService.toast("新密码输入有误，请重填");
            return false;
        }
        if(!(/^\d{6}$/.test(this.newPayPwd2))){
            this.commonService.toast("确认密码输入有误，请重填");
            return false;
        }
        if(this.newPayPwd != this.newPayPwd2){
            this.commonService.toast("新密码和确认码输入不一致，请重填");
            return false;
        }
        return true;
    }

}
