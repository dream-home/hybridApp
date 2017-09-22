import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams} from 'ionic-angular';
import { SellerOrderPage } from '../sellerOrder/sellerOrder';
import { DomSanitizer } from '@angular/platform-browser/src/security/dom_sanitization_service';

import { SellerOrderInfoPage } from '../sellerOrderInfo/sellerOrderInfo';
import { OrderInfoPage } from '../orderInfo/orderInfo';
@Component({
    selector: 'page-systemInfo',
    templateUrl: 'systemInfo.html'
})
export class SystemInfoPage {

    datas;
    systemId;
    systemType:number = 0;
    constructor(public navCtrl: NavController,private commonService: CommonService,private sanitizer: DomSanitizer,public navParams: NavParams) {
		this.datas = navParams.data;
    }

	assembleHTML(strHTML:any) {
      return this.sanitizer.bypassSecurityTrustHtml(strHTML);
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.systemId = sessionStorage.getItem("systemId");
        this.loadData();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*加载我的消费记录*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/message/detail',
            data:{
                id:this.systemId,
                type:this.systemType
            }
        }).then(data=>{
            if(data.code==200){
                this.datas = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    viewOrder(str,orderid){
        
        if(str=="订单处理"){
            
            this.navCtrl.push(SellerOrderInfoPage,{orderNo:orderid});
        }else if(str=="发货通知"){
             this.navCtrl.push(OrderInfoPage,{orderNo:orderid});
        }else{
            this.navCtrl.push(SellerOrderPage);
        }
    }
}
