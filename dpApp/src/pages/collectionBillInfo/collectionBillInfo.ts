import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'page-collectionBillInfo',
    templateUrl: 'collectionBillInfo.html'
})
export class CollectionBillInfoPage {

    orderNo;
    details:any;
    storeName:string;
    storeIcon:string;
    constructor(
        private navCtrl: NavController,
        private commonService: CommonService,
        public navParams: NavParams
    ) {
        this.orderNo = navParams.get('orderNo');
        this.loadDetails();
    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    loadDetails(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/wallet/query/codetopaydetails',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
            if(data.code==200){
                this.details = data.result;
                this.storeIcon = data.result.storeInfo.storeIcon;
                this.storeName = data.result.storeInfo.storeName;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
}
