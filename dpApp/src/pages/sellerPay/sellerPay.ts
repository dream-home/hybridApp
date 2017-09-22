import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-sellerPay',
    templateUrl: 'sellerPay.html'
})
export class SellerPayPage {
    goodsId;
    integral;
    payPwd;
    isDisable:boolean=false;
    constructor(public navCtrl: NavController,private commonService: CommonService) {
        this.goodsId = sessionStorage.getItem("goodsId");
        this.integral = sessionStorage.getItem("integral");
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*确认支付*/
    submitPay(){
        this.isDisable = true;
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/mall/store/goods/draw',
            data:{
                goodsId:this.goodsId,
                payPwd:this.payPwd
            }
        }).then(data=>{
            if(data.code==200){
                let toast = this.commonService.toast("商品已成功斗拍");
                toast.onDidDismiss(() => {
                    this.goToBackPage();
                });
            }else{
                this.isDisable = false
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

}
