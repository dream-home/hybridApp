import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController} from 'ionic-angular';

import { SelectAddressPage } from '../selectAddress/selectAddress';
@Component({
    selector: 'page-perfectUserData',
    templateUrl: 'perfectUserData.html'
})

export class PerfectUserDataPage {
    userInfo:any;
    phone:string="";//手机号
    smsCode:string="";//验证码
    loginPassword:string="";//登录密码
    payPassword:string="";//支付密码
    public userAddress:any={//用来接收传过来的地区
            province:'',//省份
            city:'',//城市
            county:'',//区县
            areaId:''//地区代码，填写最小的
    };

    constructor(
        public navCtrl: NavController,
        private commonService: CommonService

    ) {

      console.log(this.commonService.user);
    }


    //页面事件
    ionViewWillEnter(){
         if(sessionStorage.getItem("userAddress")!=null){
            this.userAddress=JSON.parse(sessionStorage.getItem("userAddress"));
        }
        this.getUserInfo();
    }

    //获取用户信息
    getUserInfo(){
         this.commonService.httpGet({
                    url:this.commonService.baseUrl+'/user/login/getUser',
                    data:{

                    }
                }).then(data=>{
                    if(data.code==200){
                      this.userInfo=data.result;

                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
    }
    /*返回上一页*/
    goToBackPage(){
        sessionStorage.removeItem("userAddress")
        this.navCtrl.pop();
    }

    //跳转到地区选择页面
   gotoSelectAddressPage(type){
    var str=JSON.stringify(this.userAddress);
      this.navCtrl.push(SelectAddressPage,{"type":type,"value":str});
   }

   //获取短信验证码
    getSmsCode(){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/common/sms',
            data:{
                phone: this.phone
            }
        }).then(data=>{
            if(data.code==200){
               this.commonService.toast("短信验证码已发送到手机，请查收");
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    //验证数据
     validator(){
        if(this.userInfo.areaId==""||this.userInfo.areaId==null){
            if(!this.userAddress.province || this.userAddress.province == ''){
               this.commonService.toast("地址不能为空");
               return false;
            }
        }
        if(this.userInfo.phone==""||this.userInfo.phone==null){

            if(!this.phone || this.phone == ''){
               this.commonService.toast("手机号码不能为空");
               return false;
            }
            if(!(/0?(1)[0-9]{10}/).test(this.phone)){
                this.commonService.toast("手机号码不存在");
                return false;
            }
             if(!this.smsCode || this.smsCode == ''){
                this.commonService.toast("短信验证码不能为空");
                return false;
            }
        }
         if(this.userInfo.isSetPassword==0){

            if(!this.loginPassword || this.loginPassword == ''){
                this.commonService.toast("登录密码不能为空");
                return false;
            }
            if(!(/^(?![0-9]+$)(?![a-z]+$)(?![A-Z]+$)(?![,\.#%'\+\*\-:;^_`]+$)[,\.#%'\+\*\-:;^_`0-9A-Za-z]{6,20}$/.test(this.loginPassword))){

                  this.commonService.toast("登录密码6-20位，数字、英文、半角符号（至少两种组合，除空格）");
                    return false;
            }
         }

         if(this.userInfo.isSetPayPwd==0){

                if(!this.payPassword || this.payPassword == ''){
                    this.commonService.toast("支付密码不能为空");
                    return false;
                }
               if(!(/^\d{6}$/).test(this.payPassword)){
                    this.commonService.toast("支付密码只能是6位纯数字。");
                    return false;
                }
            }
        return true;
    }

    //保存资料
    saveInfo(){
        if(this.validator()){
            this.commonService.httpPost({
                    url:this.commonService.baseUrl+'/user/completeinfo',
                    data:{
                        areaId:this.userAddress.areaId,
                        city:this.userAddress.city,
                        county:this.userAddress.county,
                        password:this.loginPassword,
                        payPwd:this.payPassword,
                        phone:this.phone,
                        province:this.userAddress.province,
                        smsCode:this.smsCode
                    }
                }).then(data=>{
                    if(data.code==200){
                      this.commonService.user.isCompleteInfo="1";
                       this.commonService.toast("个人信息保存成功");
                       this.commonService.user.isSetPayPwd ='1';
                       this.commonService.user.isSetPassword = '1';
                       this.goToBackPage();
                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
        }
    }
}
