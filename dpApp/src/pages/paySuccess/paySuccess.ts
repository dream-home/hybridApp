import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';

@Component({
    selector: 'page-paySuccess',
    templateUrl: 'paySuccess.html'
})
export class PaySuccessPage {

    shopID:string;
    paymentAmount:number;
    shopData:any;
    gotoPage:string;
    discountAmount:number=0;//抵扣ep
    actualPayMent:number = 0;
    constructor(
        private navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams,
        public plt: Platform
    ) {
        this.shopID = navParams.get('shopID');
        this.gotoPage = navParams.get('gotoPage');
        this.paymentAmount = navParams.get('paymentAmount');
         this.discountAmount = navParams.get('discountAmount');
         this.actualPayMent = navParams.get('actualPayMent');
        this.loadData();
    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        if(this.gotoPage=='payMent'){
            this.navCtrl.pop();
            this.navCtrl.pop();
        }else{
            this.navCtrl.pop();
            this.navCtrl.pop();
            this.navCtrl.pop();
        }

    }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/info',
            data:{
                inviteCode:'',
                storeId:this.shopID
            }
        }).then(data=>{
            if(data.code==200){
                this.shopData = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    ISOK(){
        if(this.gotoPage=='payMent'){
            this.navCtrl.pop();
            this.navCtrl.pop();
        }else{
            this.navCtrl.pop();
            this.navCtrl.pop();
            this.navCtrl.pop();
        }
    }
}
