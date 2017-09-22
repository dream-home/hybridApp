import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
    selector: 'page-myReceivablesCode',
    templateUrl: 'myReceivablesCode.html'
})
export class MyReceivablesCodePage {

    info:any;
    marketingShow:boolean=false;
    storeName:string;
    storeProvince:string;
    storeCity:string;
    storeCountry:string;
    storeAddr:string;
    constructor(
        private navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams,
        public alertCtrl: AlertController
    ) {
        // this.showStoreCode();
        this.storeName = navParams.get("storeName");
        this.storeProvince = navParams.get("storeProvince");
        this.storeCity = navParams.get("storeCity");
        this.storeCountry = navParams.get("storeCountry");
        this.storeAddr = navParams.get("storeAddr");
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.showStoreCode();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    showStoreCode(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/store/qrcode',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.info = data.result;
            }else{
                let confirm = this.alertCtrl.create({
                  title: '系统提示',
                  message: '您未进行营销分成设置',
                  enableBackdropDismiss:false,
                  buttons: [
                    {
                      text: '确定',
                      handler: () => {
                          this.navCtrl.pop();
                      }
                    },
                    {
                      text: '取消',
                      handler: () => {
                          this.navCtrl.pop();
                      }
                    }
                  ]
                });
                confirm.present();
            }
        });
    }

    saveCode(){

    }
}
