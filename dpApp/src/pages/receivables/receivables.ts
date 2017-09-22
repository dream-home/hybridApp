import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { ScoreInfoPage } from '../scoreInfo/scoreInfo';

@Component({
  selector: 'page-receivables',
  templateUrl: 'receivables.html'
})
export class ReceivablesPage {

    discountEP;
    businessSendEp;
    firstReferrerScale;
    secondReferrerScale;
    storeUserId:string = "";
    thirdReferrerScale;
    payAmount;
    constructor(public navCtrl: NavController,public commonService: CommonService,private navParams: NavParams) {

    }
    /*页面事件*/
    ionViewWillEnter(){
        this.discountEP = this.navParams.get("discountEP");
        this.businessSendEp = this.navParams.get("businessSendEp");
        this.firstReferrerScale =this.navParams.get("firstReferrerScale");
        this.secondReferrerScale =this.navParams.get("secondReferrerScale");
        this.thirdReferrerScale =this.navParams.get("thirdReferrerScale");
        this.payAmount =this.navParams.get("payAmount");
        this.getQrcode();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*收款账单*/
    viewRecord(typeNum){
        this.navCtrl.push(ScoreInfoPage,{typeNum:typeNum});
    }

    base64Img;
    /*面对面扫码-获取商家收款二维码*/
    getQrcode(){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/payDistribution/qrcode',
            data:{
                businessSendEp:this.businessSendEp,
                firstReferrerScale:this.firstReferrerScale,
                discountEP:this.discountEP,
                payAmount:this.payAmount,
                secondReferrerScale:this.secondReferrerScale,
                storeUserId:this.commonService.user.id,
                thirdReferrerScale:this.thirdReferrerScale
            }
        }).then(data=>{
            if(data.code==200){
                this.base64Img = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
}
