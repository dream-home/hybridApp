import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-goodsSell',
    templateUrl: 'goodsSell.html'
})
export class GoodsSellPage {

    goodsInfo: any;
    score:number;
    constructor(public navCtrl: NavController,private commonService: CommonService) {
        this.loadData();
        this.score =  parseFloat(sessionStorage.getItem('score'));
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*加载数据*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/goods/detail',
            data:{
                goodsId: sessionStorage.getItem('goodsId')
            }
        }).then(data=>{
            if(data.code=='200'){
                this.goodsInfo = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    sellGoods(){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/user/goods/win/sale',
            data:{
                orderNo: sessionStorage.getItem('orderNo')
            }
        }).then(data=>{
            if(data.code=='200'){
                let toast = this.commonService.toast("委托出售成功");
                toast.onDidDismiss(() => {
                    this.goToBackPage();
                });
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

}
