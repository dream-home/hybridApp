import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';

@Component({
  selector: 'page-payCompleted',
  templateUrl: 'payCompleted.html'
})
export class PayCompletedPage {

    score:string;
    orderNo:string;
    source:string;
    payWay:string;
    payTime:number;
    discountAmount:number=0;//抵用金额
    actualPayMent:number=0;
    constructor(
        public navCtrl: NavController,
        public commonService: CommonService,
        private navParams: NavParams
    ) {
        this.score = navParams.get('score');
        this.orderNo = navParams.get('orderNo');
        this.source = navParams.get('source');
        this.payTime = navParams.get('payTime');
        this.discountAmount=navParams.get('discountAmount');
        this.actualPayMent=navParams.get('actualPayMent');
        if(this.source == '3'){
            this.payWay = "余额支付";
        }else if(this.source == '2'){
            this.payWay = "微信支付";
            this.weCatCallBack();
        }else{
            this.payWay = "支付宝支付";
        }
    }

    /*页面事件*/
    ionViewWillEnter(){

    }
    weCatCallBack(){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/wallet/query/wxscanorder',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
            if(data.code==200){

            }else{
                // this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*返回我的页面*/
    gotoFmyPage(){
        this.navCtrl.pop();
        this.navCtrl.pop();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
}
