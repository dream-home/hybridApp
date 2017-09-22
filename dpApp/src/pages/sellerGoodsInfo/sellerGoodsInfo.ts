import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams,ModalController,ActionSheetController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SellerPayPage } from '../sellerPay/sellerPay';
import { BuyGoodsPage } from '../buyGoods/buyGoods';
import { ViewImgPage } from '../viewImg/viewImg';
import { SellerShopPage } from '../sellerShop/sellerShop';
import { ShoppingCartPage } from '../shoppingCart/shoppingCart';
import { CallNumber } from 'ionic-native';


declare let Wechat:any;
let sellerGoodsInfoPage:SellerGoodsInfoPage;
@Component({
  selector: 'page-sellerGoodsInfo',
  templateUrl: 'sellerGoodsInfo.html'
})
export class SellerGoodsInfoPage {

    id:string;
    shopData:any;
    inviteCode:string;
    goodsInfo:any;
    goodsImages:any;
    pet:string = "info";
    records:any;
    goodsId:string;
    showtype:string;
    pageType:number;
    GoodDetails=[];//商品详情
    shopAddr:string;
    showBack:boolean = false;

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
    goodsIndex:number = -1;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        public actionSheetCtrl: ActionSheetController,
        private navParams: NavParams,
        public modalCtrl: ModalController
    ) {
          sellerGoodsInfoPage = this;
          this.goodsId = this.navParams.get("goodsId");
          this.showtype =this.navParams.get("showtype");
          this.pageType =this.navParams.get("pageType");
          this.loadGoodsInfo();
          this.loadGoodsImages();
          this.getDeailts(this.goodsId);
          this.checkisinstallwx();
    }

    /*页面事件*/
    ionViewWillEnter(){
        let shopId = this.navParams.get("storeId");
        let data = localStorage.getItem(shopId);
        if(data != null && data != '' && data != 'null'){
            this.myShopGoodData = JSON.parse(data);
            if(this.myShopGoodData!=null){

                this.myShopGoods = this.myShopGoodData.myShopGoods;
                for(var ind in this.myShopGoods){
                    if(this.myShopGoods[ind].id == this.goodsId){
                        this.myShopGood = this.myShopGoods[ind];
                        this.goodsIndex = parseInt(ind);
                    }
                }
                this.saveMyGoodsData();
            }
        }


    }


    getDeailts(gid){
          this.commonService.httpPost({
                    url:this.commonService.baseUrl+'/mall/goods/detaillist',

                    data:{
                        goodsId:gid
                    }
                }).then(data=>{

                     if(data.code==200){
                        this.GoodDetails=data.result;
                        }else{
                            this.commonService.alert("系统提示",data.msg);
                        }
                });
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

    addGoods(){
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.myShopGood.num = this.myShopGood.num + 1;
            this.myShopGoods[this.goodsIndex] = this.myShopGood;
            this.saveMyGoodsData();
        }
    }

    goToHomePage(){
        this.navCtrl.pop();
    }
    showImg(path){
        let modal = this.modalCtrl.create(ViewImgPage, {imgStr:path});
        modal.present();
    }

    numRemove(ev){
        ev.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            if(this.myShopGood.num >=1){

                this.myShopGood.num=this.myShopGood.num- 1
            }
            this.myShopGoods[this.goodsIndex] = this.myShopGood;
            this.saveMyGoodsData();
        }
    }

    numAdd(ev){
        ev.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else if(this.myShopGood.num >= this.myShopGoods[this.goodsIndex].stock){
            this.commonService.toast("该商品库存不足");
        }else{
            if(this.ShoppingCart.goodsAllPrice > 99999){
                this.commonService.toast("总金额不能超过99999");
            }else{
                this.myShopGood.num = this.myShopGood.num + 1;
                this.myShopGoods[this.goodsIndex] = this.myShopGood;
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

    /*查询商品信息*/
    loadGoodsInfo(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/goods/info',
            data:{
                goodsId:this.goodsId
            }
        }).then(data=>{
            if(data.code=='200'){
                this.goodsInfo = data.result;
                this.records = data.result.drawUsers;
                this.loadShopCollect();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*查询商品图片*/
    loadGoodsImages(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/icons',
            data:{
                id:this.goodsId,
                type:4
            }
        }).then(data=>{
            if(data.code=='200'){
                this.goodsImages = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
            this.showBack = true;
        });
    }

    /*初始化购物车信息*/
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
        if(this.shopData!=null){
            localStorage.setItem(this.shopData.id,JSON.stringify(this.myShopGoodData));
        }


    }


    /*查询收藏信息*/
    loadShopCollect(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/storeinfo',
            data:{
                storeId:this.goodsInfo.storeId
            }
        }).then(data=>{
            if(data.code==200){
                this.shopData = data.result;
                this.shopAddr = this.shopData.province+this.shopData.city+this.shopData.county+this.shopData.addr;
            }else{
                this.commonService.alert("系统提示",data.msg);
                this.goToHomePage();
            }
        });
    }

    /*收藏*/
    addCollection(){
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/store/collect/add',
                data:{
                    storeId:this.goodsInfo.storeId
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

    /*取消收藏*/
    removeCollection(){
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/store/collect/cancel',
                data:{
                    storeId:this.goodsInfo.storeId
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

    /*立即斗拍*/
    buying(goodsId,integral){
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            sessionStorage.setItem("goodsId",goodsId);
            sessionStorage.setItem("integral",integral);
            this.navCtrl.push(SellerPayPage);
        }
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

    /*进入店铺*/
    gotoShop(id){
        let inviteCode = sessionStorage.getItem(id);
        this.navCtrl.push(SellerShopPage,{id:id,inviteCode:inviteCode});
    }

    loadRecord(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/goods/info',
            data:{
                goodsId:this.goodsId
            }
        }).then(data=>{
            if(data.code=='200'){
                this.records = data.result.drawUsers;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

 /*分享*/
    presentPopover2(myEvent,item){
     if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
         let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '分享商品到微信好友',
                icon: 'create',
                handler: () => {
                    this.shareWecatFriend(item);
                }
            },{
                text: '分享商品到朋友圈',
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

    /*拨打商家电话*/
    callPhone(){
      if(this.shopData.servicePhone!=null && this.shopData.servicePhone!=''){
          CallNumber.callNumber(this.shopData.servicePhone, true)
            .then(() => console.log('Launched dialer!'))
            .catch(() => console.log('Error launching dialer'));
      }


    }

    ishasewx:boolean = false;
    checkisinstallwx(){//判断是否安装微信
        if(typeof Wechat == "undefined"){
            return;
        }
        Wechat.isInstalled(function (installed) {
            console.log("判断是否安装微信======installed  "+installed)
            if(installed){
                sellerGoodsInfoPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                sellerGoodsInfoPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            sellerGoodsInfoPage.ishasewx = false;
        });
    }

    shareWecatFriend(item){
        console.log("item.name  "+item.name+" item.detail "+item.detail+" item.icon "+item.icon+" webpageUrl "+this.commonService.shareUrl+'/user/transition?index=3&goodsId='+item.id+
        '&uid='+this.commonService.user.uid+'&storeId='+item.storeId+'&shareUserId='+this.commonService.user.id)
        if(!this.ishasewx){
           this.commonService.alert("系统提醒","请先安装微信");
           return;
        }
        Wechat.share({
            message: {
                title:item.name,
                description:item.detail,
                thumb:item.icon,
                media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: sellerGoodsInfoPage.commonService.shareUrl+'/user/transition?index=3&goodsId='+item.id+
                '&uid='+sellerGoodsInfoPage.commonService.user.uid+'&storeId='+item.storeId+'&shareUserId='+sellerGoodsInfoPage.commonService.user.id
            }
        },
            scene: Wechat.Scene.SESSION   // share to Timeline
        }, function () {
            sellerGoodsInfoPage.commonService.toast("分享成功!");
        }, function (reason) {
            sellerGoodsInfoPage.commonService.alert("系统提示",reason);
        });
    }

    share2Wecat(item){
      console.log("item.name  "+item.name+" item.detail "+item.detail+" item.icon "+item.icon+" webpageUrl "+this.commonService.shareUrl+'/user/transition?index=3&goodsId='+item.id+
      '&uid='+this.commonService.user.uid+'&storeId='+item.storeId+'&shareUserId='+this.commonService.user.id)
        if(!this.ishasewx){
           this.commonService.alert("系统提醒","请先安装微信");
           return;
        }
        Wechat.share({
            message: {
                title:item.name,
                description:item.detail,
                thumb:item.icon,
                media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: this.commonService.shareUrl+'/user/transition?index=3&goodsId='+item.id+
                '&uid='+this.commonService.user.uid+'&storeId='+item.storeId+'&shareUserId='+this.commonService.user.id
            }
        },
            scene: Wechat.Scene.TIMELINE // share to Timeline
        }, function () {
            this.commonService.toast("分享成功!");
        }, function (reason) {
            this.commonService.alert("系统提示",reason);
        });
    }


}
