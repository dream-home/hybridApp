import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController ,NavParams} from 'ionic-angular';
import { SellerShopPage } from '../sellerShop/sellerShop';

@Component({
    selector: 'page-sellerOrderInfo',
    templateUrl: 'sellerOrderInfo.html'
})
export class SellerOrderInfoPage {

    orderNo:string;
    info:any;

    constructor(public navCtrl: NavController, private commonService: CommonService, private navParams: NavParams) {
       /* this.orderNo = sessionStorage.getItem("orderId");
        this.loadData();*/
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();

    }
     /*页面事件*/
    ionViewWillEnter(){
       this.orderNo =this.navParams.get("orderNo");
        this.loadData();/*
        alert("跳到商家订单详情");*/
    }


/*进入店铺*/
    gotoShop(id){
       /* let inviteCode = sessionStorage.getItem(id);*/
        this.navCtrl.push(SellerShopPage,{id:id});
    }
    /*发货*/
    delivery(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/store/order/edit',
                data:{
                    orderNo:this.orderNo,
                    expressName:this.info.expressName,
                    expressNo:this.info.expressNo
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("发货成功");
                    this.goToBackPage();
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    loadData(){
        this.commonService.httpGet({/* /user/store/order/info*/
            url:this.commonService.baseUrl+'/order/orderdetail',
            data:{
                orderNo:this.orderNo,
                storeId:this.commonService.user.storeId
            }
        }).then(data=>{
            if(data.code==200){
                this.info = data.result;
                /*for(var index in this.info.orderlist){
                    this.allPrice = this.allPrice+ this.info.orderlist[index].price*this.info.orderlist[index].num;
                }*/
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    validator(){
        if(!this.info.expressName || this.info.expressName==''){
            this.commonService.toast("快递公司不能为空");
            return false;
        }
        if(!this.info.expressNo || this.info.expressNo==''){
            this.commonService.toast("快递单号不能为空");
            return false;
        }
        return true;
    }

}
