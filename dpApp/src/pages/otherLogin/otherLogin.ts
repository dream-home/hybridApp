import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams} from 'ionic-angular';
import { FindPwdPage } from '../findPwd/findPwd';
import { RegisterPage } from '../register/register';
import { HomePage } from '../home/home';
@Component({
  selector: 'page-otherLogin',
  templateUrl: 'otherLogin.html'
})
export class OtherLoginPage {

    loginName:any;
    password:any;
    key:string;
    picCode:string;
    strImg:string;
    constructor(
            public navCtrl: NavController,
            private navParams: NavParams,
            public commonService: CommonService
        ) {
        this.loadData();

    }

    goToBackPage(){
      if(this.navParams.get('type')!=''&&this.navParams.get('type')!=null&&this.navParams.get('type')=='1'){
          this.navCtrl.push(HomePage);
      }else{
          this.navCtrl.pop();
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

    /*忘记密码*/
    alertPwd(){
        this.navCtrl.push(FindPwdPage);
    }

    /*登录*/
    loginIn(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/login/loginIn',
                data:{
                    loginName:this.loginName.trim(),
                    password:this.password,
                    key:this.key,
                    picCode:this.picCode,
                    registrationId:this.commonService.registrationId
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.token = data.result.token;
                    this.commonService.user = data.result;
                    /*签到*/
                    this.commonService.signedIn();
                    let toast = this.commonService.toast("用户登录成功");
                    localStorage.setItem("token", this.commonService.token);
                    toast.onDidDismiss(() => {
                        this.commonService.loadMsgCount();
                        this.goToBackPage();
                    });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                    this.picCode ='';
                    this.loadData();
                }
            });
        }

    }

    validator(){
        if(!(/^[0-9]*[1-9][0-9]*$/).test(this.loginName)){
            this.commonService.toast("用户名输入格式错误");
            return false;
        }
        if(!this.loginName || this.loginName == ''){
            this.commonService.toast("用户名不能为空");
            return false;
        }
        if(!this.password || this.password == ''){
            this.commonService.toast("密码不能为空");
            return false;
        }
        if(!(/^[0-9a-zA-Z]{4}$/.test(this.picCode))){
            this.commonService.toast("图片验证码输入有误，请重填");
            return false;
        }
        return true;
    }
    gotoRegisterPage(){
        this.navCtrl.push(RegisterPage);
    }

}
