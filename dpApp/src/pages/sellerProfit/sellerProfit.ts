import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-sellerProfit',
    templateUrl: 'sellerProfit.html'
})
export class SellerProfitPage {

    items:any;
    total:number = 0;
    totalGoods:number = 0;
    constructor(public navCtrl: NavController, private commonService: CommonService ) {
        this.loadData();
        this.loadGoodsLis();
    }


    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    loadData(){
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/user/store/income',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.total = data.result.store_income+data.result.system_fee;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    loadGoodsLis(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/store/goods/sales',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.items = data.result.goodsTotal;
                this.totalGoods = data.result.total;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }


}
