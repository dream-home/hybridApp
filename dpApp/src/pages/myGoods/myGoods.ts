import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { GoodsSellPage } from '../goodsSell/goodsSell';
import { BuyGoodsPage } from '../buyGoods/buyGoods';
import { SellerGoodsInfoPage } from '../sellerGoodsInfo/sellerGoodsInfo';
import { GoodsInfoPage } from '../goodsInfo/goodsInfo';
@Component({
    selector: 'page-myGoods',
    templateUrl: 'myGoods.html'
})
export class MyGoodsPage {

    items:any;
    pageNo:number;
    showScroll:boolean=true;
    isNull:boolean=false;
    constructor(public navCtrl: NavController,private commonService: CommonService) {

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.pageNo = 1;
        this.loadData();
        this.showScroll = true;
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*加载我的斗拍记录*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/goods/win/page',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result.rows;
                this.isNull = this.items ==null || this.items.length==0;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*委托出售*/
    sellGoods(goodsId,orderNo,score){
        sessionStorage.setItem("goodsId",goodsId);
        sessionStorage.setItem("orderNo",orderNo);
        sessionStorage.setItem("score",score);
        this.navCtrl.push(GoodsSellPage);
    }

    /*购买商品*/
    buyGoods(goodsInfo){
        this.navCtrl.push(BuyGoodsPage,{goodsInfo:JSON.stringify(goodsInfo),type:'1003'});
    }

    /*商品详情*/
    showGoodsInfo(id,storeId){
        if(storeId !=null && storeId.length>0){
            this.navCtrl.push(SellerGoodsInfoPage,{goodsId:id});
        }else{
            this.navCtrl.push(GoodsInfoPage,{goodsId:id});
        }

    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+'/user/goods/win/page',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.commonService.pageSize
                }
            }).then(data=>{
                infiniteScroll.complete();
                if(data.code==200){
                    let tdata = data.result.rows;
                    this.showScroll =(eval(tdata).length==this.commonService.pageSize);
                    for(var o in tdata){
                        this.items.push(tdata[o]);
                    }
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }, 500);
    }


}
