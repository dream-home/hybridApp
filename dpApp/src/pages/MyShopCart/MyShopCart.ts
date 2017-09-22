import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
@Component({
    selector: 'page-MyShopCart',
    templateUrl: 'MyShopCart.html'
})
export class MyShopCartPage {

    nums:number = 1;

    userCarts:any = [];
    myuserCarts ={
        cartsMoney:0,
        shopData:{}
    };
    allCartMoney:number = 0;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {

    }

    /*页面事件*/
    ionViewWillEnter(){
        let cartdata = localStorage.getItem(this.commonService.user.id);
        if(cartdata!=null && cartdata!='' && cartdata!='null'){
            this.userCarts = JSON.parse(cartdata);
            for(var i=0;i<this.userCarts.length;i++){
                this.allCartMoney +=this.userCarts[i].cartsMoney;
            }
        }else{
            this.allCartMoney = 0;
        }
    }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
    gotoShoppingCart(shopData){
        this.navCtrl.push(ShoppingCartPage,{storeId:shopData.id});
    }
    /*清空购物车*/
    clearCart(){
        for(var i=0;i<this.userCarts.length;i++){
            localStorage.removeItem(this.userCarts[i].shopData.id);
        }
        this.allCartMoney = 0;
        localStorage.removeItem(this.commonService.user.id);
    }
    stopPropagation(ev){
        ev.stopPropagation();
    }
}
