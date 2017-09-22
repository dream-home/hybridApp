import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SellerGoodsInfoPage } from '../sellerGoodsInfo/sellerGoodsInfo';
import { BuyGoodsPage } from '../buyGoods/buyGoods';
@Component({
    selector: 'page-searchGoods',
    templateUrl: 'searchGoods.html'
})
export class SearchGoodsPage {

    items: any;
    searchWord:string="";
    flag:number;
    show:string  = "1";
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {
        this.searchWord = this.navParams.get("goodsName");
        if(this.searchWord!=null && this.searchWord!=''){
            this.search();
        }
    }

    /*页面事件*/
    ionViewWillEnter(){
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }



    search(){
        let word=this.searchWord.trim();
        if(word!=""){
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/mall/goods/searchlist ',
                data:{
                    name:this.searchWord.trim(),
                    apple:'12345'
                }
            }).then(data=>{
                if(data.code==200){
                    this.items = data.result.rows;
                    this.flag=data.result.rows.length;
                    this.show = "0";
                    console.log(" this.flag  "+this.flag+" this.show "+this.show);
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }else{
            this.commonService.alert("系统提示","请输入搜索的商品名");
        }

    }
    /*商品详情*/
    gotoGoodsInfo(id,showtype){
        this.navCtrl.push(SellerGoodsInfoPage,{goodsId:id});
    }

    /*进入店铺*/
    gotoShop(id){
        // this.navCtrl.push(SellerShopPage,{id:id,inviteCode:inviteCode});
    }
    /*我要购买*/
    gotobuyGoods(goodsInfo,event,num){
        event.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.navCtrl.push(BuyGoodsPage,{goodsInfo:JSON.stringify(goodsInfo),type:'1001',orderNo:'',num:num});
        }
    }
}
