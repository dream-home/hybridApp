import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { BuyGoodsPage } from '../buyGoods/buyGoods';

@Component({
    selector: 'page-shoppingCart',
    templateUrl: 'shoppingCart.html'
})
export class ShoppingCartPage {

    nums:number = 1;
    userCarts:any = [];
    myuserCarts ={
        cartsMoney:0,
        shopData:{}
    };
    /*用于全局保存用户在购物车里面的信息*/
    myShopGoodData = {
        storeId:'',
        myShopGoods:[]
    };
    /*购物车里面的商品数组*/
    myShopGoods:any = [];
    /*购物车里面的商品信息*/
    myShopGood = {
        id:'',
        num:0,
        icon:'',
        name:'',
        price:'',
        originalPrice:'',
        businessSendEp:''
    };
    /*底下购物车信息*/
    ShoppingCart = {
      goodsNum:0,
      goodsAllPrice:0,
      goodsAllMoney:0,
      goodsAllEp:0
    }

    myCarGoods:any = [];
    shopId:string;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {


    }

    /*页面事件*/
    ionViewWillEnter(){
        this.shopId = this.navParams.get("storeId");
        let data = localStorage.getItem(this.shopId);
        if(data != null && data != '' && data != 'null'){
            //console.log("data"+data);
            this.myShopGoodData = JSON.parse(data);
            if(this.myShopGoodData!=null){
                this.myShopGoods = this.myShopGoodData.myShopGoods;
                this.saveMyGoodsData();
            }
        }
    }

    goPayForGoods(){
        if(this.ShoppingCart.goodsAllPrice > 99999){
            this.commonService.toast("总金额不能超过99999");
        }else{
            this.navCtrl.push(BuyGoodsPage,{storeId:this.shopId});
        }
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*移除商品*/
    numRemove(ev,numRe){
        ev.stopPropagation();
        if(this.myShopGoods[numRe].num == 0 || this.myShopGoods[numRe].num < 0){

        }else{
            this.myShopGoods[numRe].num=this.myShopGoods[numRe].num- 1
        }
        this.saveMyGoodsData();
    }
    /*添加商品*/
    numAdd(ev,numAd){
        ev.stopPropagation();
        if(this.myShopGoods[numAd].num >= this.myShopGoods[numAd].stock){
            this.commonService.toast("该商品库存不足");
        }else if(this.ShoppingCart.goodsAllPrice > 99999){
            this.commonService.toast("总金额不能超过99999");
        }else{
            this.myShopGoods[numAd].num = this.myShopGoods[numAd].num + 1;
        }
        this.saveMyGoodsData();
    }

    /*清空购物车*/
    clearCart(){
        for(let goods in this.myShopGoodData.myShopGoods){
            this.myShopGoodData.myShopGoods[goods].num = 0;
        }
        this.saveMyGoodsData();
    }

    /*初始化购物车信息*/
    saveMyGoodsData(){
        this.myShopGoodData.storeId = this.shopId;
        this.myShopGoodData.myShopGoods = this.myShopGoods;
        let goodsnum = 0;
        let goodsprice = 0;
        let goodsmoney = 0;
        let goodsep = 0;
        let gnum = 0;
        for(let goods in this.myShopGoodData.myShopGoods){
              //console.log(this.myShopGoodData.myShopGoods[goods]);
              if(this.myShopGoodData.myShopGoods[goods].num*1>0){
                  gnum = this.myShopGoodData.myShopGoods[goods].num*1;
                  goodsnum = goodsnum+gnum;
                  goodsprice = goodsprice + this.myShopGoodData.myShopGoods[goods].price*1*gnum;
                  goodsmoney = goodsmoney + this.myShopGoodData.myShopGoods[goods].originalPrice*1*gnum;
                  goodsep = goodsep + this.myShopGoodData.myShopGoods[goods].businessSendEp*1*gnum;
              }
        }
        this.ShoppingCart.goodsNum = goodsnum;
        this.ShoppingCart.goodsAllPrice = goodsprice;
        this.ShoppingCart.goodsAllMoney = goodsmoney;
        this.ShoppingCart.goodsAllEp = goodsep;
        //console.log(goodsnum+" goodsprice "+goodsprice+" goodsmoney "+goodsmoney+" goodsep "+goodsep+" this.ShoppingCart "+this.ShoppingCart);

        localStorage.setItem(this.shopId,JSON.stringify(this.myShopGoodData));

        let usercart = localStorage.getItem(this.commonService.user.id);
        if(usercart!=null && usercart!='' && usercart!='null'){
            this.userCarts = JSON.parse(usercart);
            for(var i=0;i<this.userCarts.length;i++){
                let shopData =  this.userCarts[i].shopData;
                if(this.userCarts[i].shopData.id==this.shopId){
                    this.myuserCarts.cartsMoney = this.ShoppingCart.goodsAllPrice;
                    this.myuserCarts.shopData = shopData;
                    this.userCarts[i] = this.myuserCarts;
                }
            }
        }
        localStorage.setItem(this.commonService.user.id,JSON.stringify(this.userCarts));
    }

    stopPropagation(ev){
        ev.stopPropagation();
    }
}
