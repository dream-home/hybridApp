import { Component } from '@angular/core';
import { Platform, NavParams, ViewController,AlertController } from 'ionic-angular';
import { CommonService } from '../../app/app.base';

@Component({
    selector: 'page-myRedopen',
    templateUrl: 'myRedopen.html'
})
export class MyRedopenPage {

    isSignInByPartner:boolean =  false;//斗斗是否可以签到	boolean	true 弹出，false 不弹
    isSignInByDoudou:boolean =  false;//合伙人是否可以签到	boolean	true 弹出，false 不弹

    isShowDDRed:boolean=false;//是否显示斗斗签到红包
    isOpenPartnerRed:boolean=false;//是否打开合伙人签到红包
    isOpenDDRed:boolean=false;//是否打开斗斗签到红包
    SignDouNum:number;//斗斗签到所得金额
    SignPartnerNum:number;//合伙人签到所得金额

    isShowPartnerRed:boolean=false;//是否显示合伙人签到红包
    constructor(
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        public commonService: CommonService,
        public alertCtrl: AlertController
    ){
        this.isSignInByPartner = params.get("isSignInByPartner");
        this.isSignInByDoudou = params.get("isSignInByDoudou");
        if(this.isSignInByPartner == true){
            this.isShowPartnerRed = true;
            this.isShowDDRed = false;
        }else{
            this.isShowPartnerRed = false;
            this.isShowDDRed = true;
        }
    }
    /*页面事件*/
    ionViewWillEnter(){

    }
    dismiss() {
        this.viewCtrl.dismiss();
    }

    partnerRedClose(){
        if(this.isSignInByDoudou == true){
            this.isShowPartnerRed = false;
            this.isShowDDRed = true;
        }else{
            this.isShowDDRed = false;
            this.dismiss();
        }

    }
    //关闭签到红包
    DDRedClose(){
        this.isShowDDRed = false;
        this.dismiss();
    }

    //打开合伙人签到红包
    openPartnerRed(){

        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/signIn',
            data:{
            }
        }).then(data=>{
            if(data.code=='200'){
                if(data.result != null){
                    this.isOpenPartnerRed = true;
                    this.SignPartnerNum = data.result.signEP;
                    if(this.isSignInByDoudou == false){
                        localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"true");
                    }
                }
            }else if(data.code==4){
                let alert = this.alertCtrl.create({
                    title: "系统提示",
                    subTitle: data.msg,
                    buttons: [{
                    text: '确认',
                    role: 'cancel',
                    handler: data => {
                        this.isOpenPartnerRed = true;
                    }
                  }]
                });
                alert.present();
            }else{

                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    //打开斗斗签到红包
    openDouDouRed(){

        this.commonService.httpGet({
            url:this.commonService.baseUrl+"/sign/doudouSignIn",
            data:{
            }
        }).then(data=>{
            if(data.code==200){
                this.SignDouNum = data.result.signDouNum;
                this.isOpenDDRed = true;
                if(this.isShowPartnerRed == false){
                    localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"true");
                }
            }else if(data.code==4){
                let alert = this.alertCtrl.create({
                    title: "系统提示",
                    subTitle: data.msg,
                    buttons: [{
                    text: '确认',
                    role: 'cancel',
                    handler: data => {
                        this.isOpenDDRed = true;
                    }
                  }]
                });
                alert.present();
            }else{

                this.commonService.alert("系统提示",data.msg);
            }
        });
    }




}
