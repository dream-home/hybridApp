import { Component,ViewChild } from '@angular/core';
import { NavController,Content,Toolbar,ModalController  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { CommonService } from '../../app/app.base';
import { JPushService } from 'ionic2-jpush/dist';
import { SellerOrderPage } from '../sellerOrder/sellerOrder';
import { SellerGoodsInfoPage } from '../sellerGoodsInfo/sellerGoodsInfo';
import { SellerShopPage } from '../sellerShop/sellerShop';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { SearchGoodsPage } from '../searchGoods/searchGoods';
import { MyShopCartPage } from '../MyShopCart/MyShopCart';
import { GoodsInfoPage } from '../goodsInfo/goodsInfo';
import { BuyGoodsPage } from '../buyGoods/buyGoods';
import { SetAmountPage } from '../setAmount/setAmount';
import { IntegroWalletPage } from '../integroWallet/integroWallet';
import { BarcodeScanner } from 'ionic-native';
import { ScanPage } from '../scan/scan';
import { PayMentPage } from '../payMent/payMent';
import { GoodLuckEpPage } from '../goodLuckEp/goodLuckEp';
import { MyGoodsPage } from '../myGoods/myGoods';
import { MyContactsPage } from '../myContacts/myContacts';
import { MyPartnerPage } from '../myPartner/myPartner';
import { MyCollectionPage } from '../myCollection/myCollection';
import { ShareFriendPage } from '../shareFriend/shareFriend';
import { SysSettingPage } from '../sysSetting/sysSetting';
import { SystemMessagePage } from '../systemMessage/systemMessage';
import { BusinessOrderPage } from '../businessOrder/businessOrder';
import { ConsumingMessagePage } from '../consumingMessage/consumingMessage';
import { MyRedopenPage } from '../myRedopen/myRedopen';
declare var AMap; //全局高德地图变量
var myhome: any;
@Component({
    selector: 'page-home',
    templateUrl: 'home.html',
    providers  : [JPushService]
})
export class HomePage {
     @ViewChild(Content) content: Content;
    @ViewChild('myToolBar') myToolBar: Toolbar;
    images = [];
    hotDatas = [];
    newShops =[];
    indexAds = [];
    epBests=[];
    newsgood=[];
    indexBanners = [];
    imgs=[];
    baseUrl;
    myScore:number;
    osType;
    areaName:string="全国";
    shopName:string="";


    totalNum = ['0','0','0','0','0','0','0','0','0','0'];
    dptops;

     buttons:any;

    datas;
    id;
    timeSort=1;
    priceSort=0;
    pageNo:number;
    showScroll:boolean=true;


	/*6张图片*/
	one:string;
	two:string;
	three:string;
	four:string;
	five:string;
	six:string;
	one_id:string;
	two_id:string;
	three_id:string;
	four_id:string;
	five_id:string;
	six_id:string;

    buttonsMap:any = [];
    buttonsMaptem:any = [];
    amap:any;//高德地图
    constructor(
        public navCtrl: NavController,
        public commonService: CommonService,
        private jPushPlugin: JPushService,
        public plt: Platform,
        public alertCtrl: AlertController,
        public modalCtrl: ModalController
         ) {

        myhome = this;
        this.baseUrl = commonService.baseUrl;
        this.loadBannerImg();
        // this.loadHot();
        // this.getindexlist();
        // this.getNewStore();
        this.indexAd();
        this.indexBanner();
        this.jPushPlugin.openNotification()
         .subscribe( res => {
           console.log("打开openNotification"+JSON.stringify(res));
        //    alert(JSON.stringify(res));
           let notifiType='0';
           //我的订单(已发货) 1/商家订单(待发货) 2/消费记录消息 3/系统信息 4
           if (this.plt.is('ios')) {
               // This will only print when on iOS
               console.log("ios 收到的 notifiType "+res.Notifitype);
               notifiType = res.Notifitype;
           }else{
               console.log("android 收到的 notifiType "+res.extras.Notifitype);
               notifiType = res.extras.Notifitype;
           }
           if(this.commonService.token==null){
               this.goToLoginPage();
           }else{
                if(notifiType=='1'){//我的订单(已发货) 1
                    this.navCtrl.push(SellerOrderPage,{id:'3',order:'Alreadyshipped'});
                }else if(notifiType=='2'){//商家订单(待发货) 2
                    this.navCtrl.push(BusinessOrderPage);
                }else if(notifiType=='3'){//消费记录消息 3
                    this.navCtrl.push(ConsumingMessagePage);
                }else if(notifiType=='4'){//系统信息 4
                    this.navCtrl.push(SystemMessagePage);
                }
           }

       });


       this.jPushPlugin.receiveNotification()
         .subscribe( res => {
           console.log('收到通知'+JSON.stringify(res));
       });

       this.jPushPlugin.receiveMessage()
         .subscribe( res => {
           console.log('收到自定义消息'+JSON.stringify(res))
       });

       this.jPushPlugin.backgroundNotification()
         .subscribe( res => {
           console.log('收到后台通知'+JSON.stringify(res))
       });
       if (this.plt.is('ios')) {
           // This will only print when on iOS
           this.osType=1;
       }else{
           this.osType=0;
       }
       if(this.commonService.token == null || this.commonService.token == ''){
           this.getUpdate();
       }
        this.loadButtons();
        this.loadwecomleImg();
    }

    ionViewDidLoad() {
      console.log('Loading Amap');
      this.loadMap();
      this.loadToolBar();
    }

    loadToolBar(){
        AMap.plugin('AMap.ToolBar',function(){//异步
            var toolbar = new AMap.ToolBar();
            myhome.amap.plugin(toolbar);
        });
    }

    loadMap() {
        this.amap = new AMap.Map('iCenter');
        this.amap.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            myhome.amap.addControl(geolocation);
            // console.log("进来了吗")
            geolocation.getCurrentPosition(function(status,result){//定位完成之后获取经纬度
                if(status == 'complete'){
                    sessionStorage.setItem("mylng",result.position.lng);
                    sessionStorage.setItem("mylat",result.position.lat);
                }else{
                  sessionStorage.setItem("mylng","");
                  sessionStorage.setItem("mylat","");
                }
                // console.log(JSON.stringify(status));
                console.log("精准定位-------result "+JSON.stringify(result));
            });
        });
    }
    //加载签到红包信息
    loadRedInfo(){
        this.commonService.httpGet({
            url:this.baseUrl+'/sign/getSignInInfo',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.commonService.showOpenRed = false;
                if(data.result.isSignInByPartner==false){
                  if(data.result.isSignInByDoudou==true){
                      localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"false");
                      let profileModal = this.modalCtrl.create(MyRedopenPage, {isSignInByDoudou: data.result.isSignInByDoudou,isSignInByPartner:data.result.isSignInByPartner});
                      profileModal.onDidDismiss(data => {
                         this.getUpdate();
                       });
                      profileModal.present();
                  }else{
                      this.getUpdate();
                      localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"true");
                  }
                }else{
                     localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"false");
                     let profileModal = this.modalCtrl.create(MyRedopenPage, {isSignInByDoudou: data.result.isSignInByDoudou,isSignInByPartner:data.result.isSignInByPartner});
                     profileModal.onDidDismiss(data => {
                        this.getUpdate();
                      });
                     profileModal.present();
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*页面事件*/
    ionViewWillEnter(){
        /**加载消息**/
        if(this.commonService.token != null && this.commonService.token!= ''){
            this.commonService.loadMsgCount();
            /*签到*/
            this.commonService.signedIn();
            // if((localStorage.getItem(this.commonService.getTodayDate()+this.commonService.user.id)==null || localStorage.getItem(this.commonService.getTodayDate()+this.commonService.user.id)=="false")&&this.commonService.showOpenRed){
                //加载是否显示红包
                this.loadRedInfo();
            // }
        }
        /**加载参数**/
        this.commonService.loadParam();
        this.getxinpin();

    }

    /*获取轮播图*/
    loadwecomleImg(){
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/home/guide',
            data:{
                type:'1',
                version:this.commonService.appVer
            }
        }).then(data=>{
            if(data.code=='200'){
                localStorage.setItem("welcomevalue",data.result.key);
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

   /*首页商品分类跳转*/
   shoppCart(id,name){
   		this.navCtrl.push(GoodLuckEpPage,{"goodsId":id,"name":name});
   }
   /*首页菜单按钮列表*/
    loadButtons(){
        this.commonService.httpGet({
            url:this.baseUrl+'/mall/goods/sorts',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.buttons = data.result;
                for(var i=0;i<this.buttons.length;i++){
                    this.buttonsMaptem.push(this.buttons[i]);
                    if(this.buttonsMaptem.length==10){
                        this.buttonsMap.push(this.buttonsMaptem);
                        this.buttonsMaptem =[];
                    }
                }
                if(this.buttons.length%10!=0){
                   this.buttonsMap.push(this.buttonsMaptem);
                }
                this.loadData();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /**/
 loadData(){
        this.showScroll =true;
        this.commonService.httpGet({
            url:this.baseUrl+'/mall/goods/list',
            data:{
                goodsSortId:this.id,
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                timeSort:this.timeSort,
                priceSort:this.priceSort
            }
        }).then(data=>{
            if(data.code=='200'){
                this.datas = data.result.rows;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    ngAfterViewInit(){
        this.myToolBar;
    }

    /*==========改变header颜色==========*/
    onPageScroll($event){
        let top = $event.scrollTop;
        if(top>=150){
            this.myToolBar._elementRef.nativeElement.style.background = "rgba(244,94,59,1)";
        }else{
            this.myToolBar._elementRef.nativeElement.style.background = "linear-gradient(to top, rgba(0,0,0,0), rgba(0,0,0,0.4))";
        }
    }


	/*首页6张图广告图*/
	indexAd(){
		 this.commonService.httpGet({
            url:this.baseUrl+'/home/indexad',
        }).then(data=>{
            if(data.code=='200'){
                this.indexAds = data.result;
                this.one = this.indexAds[0].adImg;
                this.two = this.indexAds[1].adImg;
                this.three = this.indexAds[2].adImg;
                this.four = this.indexAds[3].adImg;
                this.five = this.indexAds[4].adImg;
                this.six = this.indexAds[5].adImg;

				        this.one_id = this.indexAds[0].id;
                this.two_id = this.indexAds[1].id;
                this.three_id = this.indexAds[2].id;
                this.four_id = this.indexAds[3].id;
                this.five_id = this.indexAds[4].id;
                this.six_id = this.indexAds[5].id;

            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });


	}

	/*首页功能*/
	indexBanner(){
		 this.commonService.httpGet({
            url:this.baseUrl+'/home/banners',
        }).then(data=>{
            if(data.code=='200'){
                this.indexBanners = data.result;

            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });


	}

    /*下拉刷新*/
    doRefresh(refresher){
      setTimeout(() => {
          this.loadHot();
          this.getindexlist();
        //   this.getNewStore();
          refresher.complete();
      }, 2000);
    }

    /*轮播图片*/
    loadBannerImg(){
        this.commonService.httpLoad({
            url:this.baseUrl+'/home/guide',
            data:{
                type:'0'
            }
        }).then(data=>{
            if(data.code=='200'){
                this.images = data.result.list;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }


    /*搜索框跳转*/

    goToLeagues(){
        this.navCtrl.push(SearchGoodsPage,{goodsName:this.shopName,areaName:this.areaName});
    }



    /*最佳人气*/
    loadHot(){
        this.commonService.httpGet({
            url:this.baseUrl+'/home/hot',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.hotDatas = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*新店开业*/
    getNewStore(){
        this.commonService.httpGet({
            url:this.baseUrl+'/mall/store/getNewStore',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.newShops = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /*进入店铺*/
    gotoShop(id){
        let inviteCode = sessionStorage.getItem(id);
        this.navCtrl.push(SellerShopPage,{id:id,inviteCode:inviteCode});
    }

    /*超值EP兑换*/
    getindexlist(){
        this.commonService.httpGet({
            url:this.baseUrl+'/mall/goods/indexlist',
            data:{pageNo:0,pageSize:6}
        }).then(data=>{
            if(data.code=='200'){
                this.epBests = data.result.rows;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*获取最新商品*/
     getxinpin(){
        this.commonService.httpGet({
            url:this.baseUrl+'/mall/goods/getNesGoods',
            data:{"maxRow":10}
        }).then(data=>{
            if(data.code=='200'){
                this.newsgood = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }


    /*累计参与人数*/
    totalCount(){
        this.commonService.httpLoad({
            url:this.baseUrl+'/home/players',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                let str = data.result.total+"";
                for(let i=0;i<str.length;i++){
                    this.totalNum[10-str.length+i] = str.charAt(i);
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*斗拍排行榜*/
    dpTop(){
        this.commonService.httpLoad({
            url:this.baseUrl+'/home/top',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.dptops = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    updateData:any;
    /*获取版本更新*/
    getUpdate(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/system/update',
            data:{
                osType:this.osType
            }
        }).then(data=>{
            if(data.code==200){
                this.updateData=data.result;

                if(this.osType==0){//android
                    if(this.commonService.appVer!=data.result.androidAppVersion && data.result.isAndroidPopup=='1'){
                        this.showConfirm();
                    }
                }else if(this.osType==1){//ios
                    if(this.commonService.appVer!=data.result.iosAppVersion && data.result.isIOSPopup=='1'){
                        this.showConfirm();
                    }
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /*显示更新窗口*/
    showConfirm() {
        let confirm = this.alertCtrl.create({
          title: (this.osType==0?this.updateData.androidAppVersion:this.updateData.iosAppVersion)+"版本更新",
          message: this.osType==0?this.updateData.androidAppDetail:this.updateData.iosAppDetail,
          buttons: [
            {
              text: '取消',
              handler: () => {
                console.log('Disagree clicked');
              }
            },
            {
              text: '前往更新',
              handler: () => {
                //   window.open(this.osType==0?this.updateData.androidAppUrl:this.updateData.iosAppUrl);
                    if(this.osType==1){
                        window.open(this.updateData.iosAppUrl);
                    }else{
                        window.location.href=this.updateData.androidAppUrl;
                    }
              }
            }
          ]
        });
        confirm.present();
  }

    goToLoginPage(){
        this.navCtrl.push(LoginPage);
    }

    /*商品详情*/
    gotoGoodsInfo(id){
        this.navCtrl.push(SellerGoodsInfoPage,{goodsId:id});
    }
    gotoMyShopCart(){
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.navCtrl.push(MyShopCartPage);
        }

    }

    /*商品详情*/
    gotoGoodsInfo2(id,showtype){
        if(showtype=='10001'){
            this.navCtrl.push(GoodsInfoPage,{goodsId:id});
        }else{
            this.navCtrl.push(SellerGoodsInfoPage,{goodsId:id});
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

	 /*首页6张广告图*/
  	gotoIndexAd(id){
    		for(let  i  = 0;i<this.indexAds.length;i++){
      			if(id ==this.indexAds[i].id){
        				if(this.indexAds[i].href==null || this.indexAds[i].href==""){

        					break;
        				}
        				if(this.indexAds[i].type =="0"){
        					this.navCtrl.push(SellerGoodsInfoPage,{goodsId:this.indexAds[i].href});
        				}else  if(this.indexAds[i].type =="1"){
              			this.navCtrl.push(SellerShopPage,{id:this.indexAds[i].href});
        				}else{

        				}
      			}
    		}
  	}

    /*首页功能跳转*/
   gotoBanner(href,remark){

   		if(remark == null || remark =="" ){
   			if(href=="SetAmountPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(SetAmountPage);
		        }
   			}else if(href=="IntegroWalletPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(IntegroWalletPage);
		        }
   			}else if(href=="SellerOrderPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(SellerOrderPage);
		        }
   			}else if(href=="MyShopCartPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(MyShopCartPage);
		        }
   			}else if(href=="MyGoodsPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(MyGoodsPage);
		        }
   			}else if(href=="MyContactsPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(MyContactsPage);
		        }
   			}else if(href=="MyPartnerPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(MyPartnerPage);
		        }
   			}else if(href=="MyCollectionPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(MyCollectionPage);
		        }
   			}else if(href=="ShareFriendPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(ShareFriendPage);
		        }
   			}else if(href=="SysSettingPage"){
   				 if(this.commonService.token==null){
		            this.navCtrl.push(LoginPage);
		        }else{
		            this.navCtrl.push(SysSettingPage);
		        }
   			}else if(href=="GoodLuckPage"){
          this.navCtrl.push(SellerShopPage,{id:'id'});
   			// 	this.navCtrl.push(GoodLuckEpPage,{"goodsId":"10001","name":"共享e家"});
   			}
   		}else{
     			/*if(href=="GoodLuckPage"){
  		          sessionStorage.setItem("classid","10001");
  	        		this.navCtrl.push(TabsPage,{tabId:2});
     			}*/


			if(href=="GoodLuckPage"){
        this.navCtrl.push(SellerShopPage,{id:this.commonService.shareEhome});
				// this.navCtrl.push(GoodLuckEpPage,{"goodsId":"10001","name":"共享e家"});
			}

   		}

   }

    /*扫一扫页面*/
    gotoScanPage(){

        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{

            let storeUserId;
            let storeId;
            BarcodeScanner.scan(
                  {
                      resultDisplayDuration: 0 // Android, display scanned text for X ms. 0 suppresses it entirely, default 1500
                  }).then((barcodeData) => {
                      if(barcodeData.cancelled==0){
                          console.log("barcodeData.text ----->> "+barcodeData.text)
                          if(barcodeData.text.indexOf('type')>=0){
                                  if(barcodeData.text.indexOf('http')>=0){
                                      let tem = barcodeData.text.split('?')[1];
                                      let tems = tem.split('&');
                                      for(var o in tems){
                                          console.log(tems[o]);
                                          let temo = tems[o].split('=');
                                          console.log(temo[0]+" temo[1] "+temo[1]);
                                          if(temo[0]=='storeUserId'){
                                              storeUserId = temo[1];
                                          }
                                          if(temo[0]=='storeId'){
                                              storeId = temo[1];
                                          }
                                      }
                                      this.navCtrl.push(PayMentPage,{storeUserId:storeUserId,storeId:storeId});
                                  }else{
                                        if(barcodeData.text.indexOf('businessSendEp')>=0&& barcodeData.text.indexOf('secondReferrerScale')>=0){
                                            this.navCtrl.push(ScanPage,{text:barcodeData.text});
                                        }else{
                                            this.commonService.toast("扫码失败,请重新扫码");
                                        }
                                  }
                            }
                    }else{
                    }

            }, (err) => {
                // An error occurred
                this.commonService.toast(err);
            });
        }
    }
}
