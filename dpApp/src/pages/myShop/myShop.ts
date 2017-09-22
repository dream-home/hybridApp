import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController, PopoverController, AlertController,ActionSheetController,ModalController } from 'ionic-angular';
import { AddGoodsPage } from '../addGoods/addGoods';
import { EditGoodsPage } from '../editGoods/editGoods';
import { EditShopPage } from '../editShop/editShop';
import { SellerProfitPage } from '../sellerProfit/sellerProfit';
import { ViewImgPage } from '../viewImg/viewImg';
import { SellerGoodsInfoPage } from '../sellerGoodsInfo/sellerGoodsInfo';
import { LoginPage } from '../login/login';
import { ShopCodePage } from '../shopCode/shopCode';

declare let Wechat:any;
let mMyShopPage:MyShopPage;
@Component({
    selector: 'page-myShop',
    templateUrl: 'myShop.html'
})
export class MyShopPage {
    shopData:any;
    items:any;
    icons:any;
    isShow:boolean=false;
    showScroll:boolean=true;
    pageNo:number;
    icon:any;
    storeName:string;
    storeProvince:string;
    storeCity:string;
    storeCountry:string;
    storeAddr:string;
    showButton:boolean=false;

    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        public popoverCtrl: PopoverController,
        public commonService: CommonService,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController
    ) {
        mMyShopPage = this;
        this.checkisinstallwx();
    }

    /*页面事件*/
    ionViewWillEnter(){

       /* if(this.commonService.user.storeId=='' || this.commonService.user.storeId==null || this.commonService.token=='' || this.commonService.token==null){
            this.goToBackPage();
        }else{
            this.icons=null;
            this.pageNo = 1;
            this.loadShopData();
        }*/

        this.icons=null;
        this.pageNo = 1;
        this.loadShopData();

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*跳转商品二维码页面*/
    gotoShopCode(){
        this.navCtrl.push(ShopCodePage,{
            icon:this.shopData.icon,
            storeName:this.shopData.storeName,
            storeProvince:this.shopData.province,
            storeCity:this.shopData.city,
            storeCountry:this.shopData.county,
            storeAddr:this.shopData.addr
        });
    }

    showImg(path){
        let modal = this.modalCtrl.create(ViewImgPage, {imgStr:path});
        modal.present();
    }

    /*商品详情*/
    showGoodsInfo(id,state){
        if(state ==0){
            this.editData(id)
        }else{
            this.navCtrl.push(SellerGoodsInfoPage,{goodsId:id});
        }
    }

    presentPopover(myEvent){
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '编辑店铺',
                icon: 'create',
                handler: () => {
                    this.navCtrl.push(EditShopPage);
                }
            },{
                text: '添加商品',
                icon: 'add-circle',
                handler: () => {
                    if(this.items!=null && this.items.length<this.commonService.params.storeGoodsMax){
                        this.navCtrl.push(AddGoodsPage);
                    }else{
                        this.commonService.toast("发布商品数量达到上限");
                    }
                }
            },{
                text: '我的收益',
                icon: 'stats',
                handler: () => {
                    this.navCtrl.push(SellerProfitPage);
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

    /*添加商品*/
    addGoods(){
        this.navCtrl.push(AddGoodsPage);
    }

    /**/
    addStock(id,count){
        let maxNum = this.commonService.params.storeStockMax - count;
        //添加库存
        let alert = this.alertCtrl.create({
            title: '添加库存',
            inputs: [{
                name: 'stock',
                placeholder: '输入库存数1~'+maxNum,
                type: 'number'
            }],
            buttons: [{
                text: '取消',
                    handler: data => {
                    }
                },{
                text: '确定',
                handler: data => {
                    if (data.stock==null || data.stock <1 || data.stock>maxNum || !(/^[0-9]*$/).test(data.stock)) {
                        this.commonService.toast("库存数输入有误");
                        return false;
                    } else {
                        //添加库存
                        this.commonService.httpPost({
                            url:this.commonService.baseUrl+'/user/goods/addStock',
                            data:{
                                id:id,
                                stock:data.stock
                            }
                        }).then(data=>{
                            if(data.code==200){
                                this.commonService.toast("库存添加成功");
                                this.pageNo = 1;
                                this.loadGoodsLis();
                            }else{
                                this.commonService.alert("系统提示",data.msg);
                            }
                        });
                    }
                }
            }]
        });
        alert.present();
    }

    loadShopData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/store/info',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.shopData = data.result;
                this.icons = this.shopData.icons;
                this.loadGoodsLis();
                this.showButton = true;
                if(this.shopData.latitude==null || this.shopData.longitude==null||this.shopData.latitude=='' || this.shopData.longitude==''){
                    let confirm = this.alertCtrl.create({
                        title: '系统提示',
                        message: '请设置店铺定位',
                        buttons: [
                        {
                            text: '确定',
                            handler: () => {
                                this.navCtrl.push(EditShopPage);
                            }
                        }]
                    });
                    confirm.present();
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    loadGoodsLis(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/goods/page',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                storeId:this.shopData.id
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result!=null?data.result.rows:null;
                this.isShow = this.items==null || this.items.length==0;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*停止斗拍*/
    stopAuction(id){
        let confirm = this.alertCtrl.create({
            title: '确认提示',
            message: '即将下架当前商品',
            buttons: [
            {
                text: '取消',
                handler: () => {}
            },
            {
                text: '确定',
                handler: () => {
                    this.commonService.httpGet({
                        url:this.commonService.baseUrl+'/user/goods/stopDraw',
                        data:{
                            id:id
                        }
                    }).then(data=>{
                        if(data.code==200){
                            let toast = this.commonService.toast("商品下架成功");
                            toast.onDidDismiss(() => {
                                this.pageNo = 1;
                                this.loadGoodsLis();
                            });
                        }else{
                            this.commonService.alert("系统提示",data.msg);
                        }
                    });
                }
            }]
        });
        confirm.present();
    }

    /*编辑数据*/
    editData(id){
        sessionStorage.setItem("id",id);
        this.navCtrl.push(EditGoodsPage);
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/user/goods/page',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                storeId:this.shopData.id
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
    }

 /*分享商品*/
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

    shareWecatFriend(item){
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
            scene: Wechat.Scene.SESSION   // share to Timeline
        }, function () {
            this.commonService.toast("分享成功!");
        }, function (reason) {
            this.commonService.alert("系统提示",reason);
        });
    }

    share2Wecat(item){
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


/*分享店铺*/
    presentPopover1(myEvent,item){
     if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
             let actionSheet = this.actionSheetCtrl.create({
                buttons: [
                {
                    text: '分享店铺到微信好友',
                    icon: 'create',
                    handler: () => {
                        this.shareWecatFriend1(item);
                    }
                },{
                    text: '分享店铺到朋友圈',
                    icon: 'create',
                    handler: () => {
                       this.share2Wecat1(item);
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
                mMyShopPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                mMyShopPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            mMyShopPage.ishasewx = false;
        });
    }
     shareWecatFriend1(item){
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

    share2Wecat1(item){
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
