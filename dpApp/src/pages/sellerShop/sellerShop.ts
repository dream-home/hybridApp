import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,ActionSheetController,ModalController,NavParams } from 'ionic-angular';
import { SellerPayPage } from '../sellerPay/sellerPay';
import { SellerGoodsInfoPage } from '../sellerGoodsInfo/sellerGoodsInfo';
import { LoginPage } from '../login/login';
import { BuyGoodsPage } from '../buyGoods/buyGoods';
import { ViewImgPage } from '../viewImg/viewImg';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';


declare let Wechat:any;
let sellerShopPage:SellerShopPage;
@Component({
    selector: 'page-sellerShop',
    templateUrl: 'sellerShop.html'
})
export class SellerShopPage {

    id:string;
    pet:string = "all";
    shopData:any;
    shopImages:any;
    items:any;
    icons:any;
    inviteCode:string = "";
    showCodePanel:boolean = false;
    showScroll:boolean=false;
    pageNo:number;
    showBack:boolean = false;

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
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        public actionSheetCtrl: ActionSheetController,
        public modalCtrl: ModalController,
        private navParams: NavParams
    ) {
        sellerShopPage = this;
        this.id = navParams.get("id");
        this.pageNo = 1;
        this.loadData(false);
        this.loadShopImages();
        this.checkisinstallwx();
        // this.inviteCode = navParams.get("inviteCode");
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.id = this.navParams.get("id");
        let data = localStorage.getItem(this.id);
        if(data != null && data != '' && data != 'null'){
            this.myShopGoodData = JSON.parse(data);
            if(this.myShopGoodData!=null && this.myShopGoodData.myShopGoods.length >0){
                this.myShopGoods = this.myShopGoodData.myShopGoods;
                this.saveMyGoodsData();
                this.pageNo = 1;
                this.loadGoodsLis();
            }else{
                this.pageNo = 1;
                this.loadGoodsLis();
            }
        }else{
            this.pageNo = 1;
            this.loadData(false);
        }
    }

    goPayForGoods(){
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            if(this.ShoppingCart.goodsAllPrice > 99999){
                this.commonService.toast("总金额不能超过99999");
            }else{
                this.navCtrl.push(BuyGoodsPage,{storeId:this.shopData.id});
            }
        }
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    showImg(path){
        let modal = this.modalCtrl.create(ViewImgPage, {imgStr:path});
        modal.present();
    }

    loadData(showMsg){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/info',
            data:{
                storeId:this.id
            }
        }).then(data=>{
            if(data.code==200){
                this.loadGoodsLis();
                this.shopData = data.result;
                this.showCodePanel = false;
                // sessionStorage.setItem(this.id,this.inviteCode);
            }else if(data.code == 3){
                if(showMsg){
                    this.commonService.toast(data.msg);
                }
                this.showCodePanel =true;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*查询店铺图片*/
    loadShopImages(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/icons',
            data:{
                id:this.id,
                type:3
            }
        }).then(data=>{
            if(data.code=='200'){
                this.shopImages = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
            this.showBack = true;
        });
    }

    loadGoodsLis(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/goods/page',
            data:{
                storeId:this.id,
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.showScroll = true;
                this.items = data.result != null ? data.result.rows : null;
                for (var i = 0; i < this.items.length; i++){
                    if (this.myShopGoods[i] != null) {
                        let goodsnum = this.myShopGoods[i].num;
                        this.myShopGood = this.items[i];
                        if(this.items[i].stock=='0'){
                            this.myShopGood.num = 0;
                        }else{
                            if(this.items[i].stock*1<goodsnum && this.items[i].stock*1>0){
                                this.myShopGood.num = this.items[i].stock*1;
                            }else{
                                this.myShopGood.num = goodsnum;
                            }

                        }

                        this.myShopGoods[i] = this.myShopGood;
                    }else{
                        //alert(this.myShopGood);
                        this.myShopGood = this.items[i];
                        this.myShopGood.num = 0;
                        this.myShopGoods[i] = this.myShopGood;
                    }
                }
                this.saveMyGoodsData();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /*移除商品*/
    numRemove(ev,numRe){
        ev.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            if(this.myShopGoods[numRe].num == 0 || this.myShopGoods[numRe].num < 0){

            }else{
                this.myShopGoods[numRe].num=this.myShopGoods[numRe].num- 1
            }
            this.saveMyGoodsData();
        }
    }
    /*添加商品*/
    numAdd(ev,numAd){
        ev.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else if(this.myShopGoods[numAd].num >= this.myShopGoods[numAd].stock){
            this.commonService.toast("该商品库存不足");
        }else{
            if(this.ShoppingCart.goodsAllPrice > 99999){
                this.commonService.toast("总金额不能超过99999");
            }else{
                this.myShopGoods[numAd].num = this.myShopGoods[numAd].num + 1;
            }
            this.saveMyGoodsData();
        }
    }

    stopPropagation(ev){
        ev.stopPropagation();
    }

    // 跳转到购物车页面
    gotoShoppingCart(){
      if(this.commonService.token==null){
          this.navCtrl.push(LoginPage);
      }else{
        this.navCtrl.push(ShoppingCartPage,{storeId:this.shopData.id});
      }
    }

    /*商品详情*/
    showGoodsInfo(id,tp){
        this.navCtrl.push(SellerGoodsInfoPage,{goodsId:id,pageType:tp,storeId:this.shopData.id});
    }

    /*斗拍*/
    auction(id,drawPrice,ev){
        ev.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            sessionStorage.setItem("goodsId",id);
            sessionStorage.setItem("integral",drawPrice);
            this.navCtrl.push(SellerPayPage);
        }
    }

    /*收藏*/
    addCollection(id){
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/store/collect/add',
                data:{
                    storeId:this.id
                }
            }).then(data=>{
                if(data.code==200){
                    this.shopData.isCollect = 1;
                    this.commonService.toast("店铺收藏成功");
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    /*取消*/
    removeCollection(id){
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/store/collect/cancel',
                data:{
                    storeId:this.id
                }
            }).then(data=>{
                if(data.code==200){
                    this.shopData.isCollect = 0;
                    this.commonService.toast("已取消店铺收藏");
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    // submitCodeData(){
    //     if(this.inviteCode !=null && this.inviteCode.length==6){
    //         this.loadData(true);
    //         this.loadShopImages();
    //     }else{
    //         this.commonService.toast("必须输入6位邀请码");
    //     }
    // }
    doInfinite(infiniteScroll) {
        this.pageNo++;
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/mall/store/goods/page',
            data:{
                storeId:this.id,
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            infiniteScroll.complete();
            if(data.code==200){
                let tdata = data.result.rows;
                this.showScroll =(eval(tdata).length==this.commonService.pageSize);
                if(this.items!=null){
                    for(var o in tdata){
                        this.items.push(tdata[o]);
                    }

                    for(var i=0;i<this.items.length;i++){
                        if(this.myShopGoods[i]!=null){
                            let goodsnum = this.myShopGoods[i].num;
                            this.myShopGood = this.items[i];
                            this.myShopGood.num = goodsnum;
                            this.myShopGoods[i] = this.myShopGood;
/*                            console.log(this.myShopGoods[i].name+"  ----   "+this.myShopGoods[i].num);*/
                        }else{
                          //alert(this.myShopGood);
                            this.myShopGood = this.items[i];
                            this.myShopGood.num = 0;
                            this.myShopGoods[i] = this.myShopGood;
                        }

                    }
                }

                this.saveMyGoodsData();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /*保存购物车商品信息*/
    saveMyGoodsData(){
        if(this.shopData!=null){
            this.myShopGoodData.storeId = this.shopData.id;
            this.myShopGoodData.myShopGoods = this.myShopGoods;
        }
        let goodsnum = 0;
        let goodsprice = 0;
        let goodsmoney = 0;
        let goodsep = 0;
        let gnum = 0;

        for(let goods in this.myShopGoodData.myShopGoods){
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
        if(this.shopData!=null&&this.commonService.token!=null){
            localStorage.setItem(this.shopData.id,JSON.stringify(this.myShopGoodData));
            let usercart = localStorage.getItem(this.commonService.user.id);
            if(usercart!=null && usercart!='' && usercart!='null'){
                this.userCarts = JSON.parse(usercart);
                var hasShop = 0;
                for(var i=0;i<this.userCarts.length;i++){
                    // console.log("店铺id ---》》》 "+this.userCarts[i].shopData.id+"店铺 名称 ====》》》 "+this.userCarts[i].shopData.storeName);
                    if(this.userCarts[i].shopData.id==this.shopData.id){
                        this.myuserCarts.cartsMoney = this.ShoppingCart.goodsAllPrice;
                        this.myuserCarts.shopData = this.shopData;
                        this.userCarts[i] = this.myuserCarts;
                        hasShop=hasShop+1;
                    }
                }
                if(hasShop==0){
                    this.myuserCarts.cartsMoney = this.ShoppingCart.goodsAllPrice;
                    this.myuserCarts.shopData = this.shopData;
                    this.userCarts.push(this.myuserCarts);
                }
            }else{
                this.myuserCarts.cartsMoney = this.ShoppingCart.goodsAllPrice;
                this.myuserCarts.shopData = this.shopData;
                this.userCarts.push(this.myuserCarts);
            }
            localStorage.setItem(this.commonService.user.id,JSON.stringify(this.userCarts));
            // userCarts
        }


    }

    /*分享*/
    presentPopover2(myEvent,item){
     if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
         let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '分享店铺到微信好友',
                icon: 'create',
                handler: () => {
                    this.shareWecatFriend(item);
                }
            },{
                text: '分享店铺到朋友圈',
                icon: 'create',
                handler: () => {
                   this.share2Wecat(item);
                }
            },{
                text: '取消',
                role: 'cancel',
                handler: () => {

                }
            }]
        });
        actionSheet.present();
        }

    }

    ishasewx:boolean = false;
    checkisinstallwx(){
        if(typeof Wechat == "undefined"){
            return;
        }
        Wechat.isInstalled(function (installed) {
            console.log("判断是否安装微信======installed  "+installed)
            if(installed){
                sellerShopPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                sellerShopPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            sellerShopPage.ishasewx = false;
        });
    }
    shareWecatFriend(item){
        console.log("========== this.checkisinstallwx() ")
        if(!this.ishasewx){
           this.commonService.alert("系统提醒","请先安装微信");
           return;
        }
        Wechat.share({
            message: {
                title:item.storeName,
                description:item.detail,
                thumb:item.icon,
                media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: this.commonService.shareUrl+'/user/transition?index=2&goodsId=null'+
                '&uid='+this.commonService.user.uid+'&storeId='+item.id+'&shareUserId='+this.commonService.user.id
            }
        },
            scene: Wechat.Scene.SESSION   // share to Timeline
        }, function () {
            this.commonService.toast("分享成功!");
        }, function (reason) {
            this.commonService.alert("系统提示",reason);
        });
    }

    share2Wecat(item){
        console.log("========== this.checkisinstallwx() ")
        if(!this.ishasewx){
           this.commonService.alert("系统提醒","请先安装微信");
           return;
        }
        Wechat.share({
            message: {
                title:item.storeName,
                description:item.detail,
                thumb:item.icon,
                media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: this.commonService.shareUrl+'/user/transition?index=2&goodsId=null'+
                '&uid='+this.commonService.user.uid+'&storeId='+item.id+'&shareUserId='+this.commonService.user.id
            }
        },
            scene: Wechat.Scene.TIMELINE   // share to Timeline
        }, function () {
            this.commonService.toast("分享成功!");
        }, function (reason) {
            this.commonService.alert("系统提示",reason);
        });
    }

}
