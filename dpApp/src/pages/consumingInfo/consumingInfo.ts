import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { SellerOrderPage } from '../sellerOrder/sellerOrder';
import { OrderInfoPage } from '../orderInfo/orderInfo';
@Component({
    selector: 'page-consumingInfo',
    templateUrl: 'consumingInfo.html'
})
export class ConsumingInfoPage {

    datas;
    /*消息id*/
    id;
    /*消息类型，默认是1*/
    type:number;
    /*关联订单号*/
    orderNo;
    score;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {
        this.id = navParams.get("id");
        this.type = navParams.get("type");
        this.orderNo = navParams.get("orderNo");
        this.score = navParams.get("score");
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.loadData();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*加载我的消费记录*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/message/detail/orderNo',
            data:{
                id:this.id,
                orderNo:this.orderNo,
                type:this.type
            }
        }).then(data=>{
            if(data.code==200){
                this.datas = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    viewOrder(){
        this.navCtrl.push(SellerOrderPage);
    }

     viewOrderInfo(orderId){
        this.navCtrl.push(OrderInfoPage,{orderNo:orderId});
    
    }
    
}
