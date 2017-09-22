import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController ,ModalController,LoadingController} from 'ionic-angular';
import { LoginPage } from '../login/login';
import { IntegroWalletPage } from '../integroWallet/integroWallet';
import { MyGoodsPage } from '../myGoods/myGoods';
import { MyAuctionPage } from '../myAuction/myAuction';
import { MyContactsPage } from '../myContacts/myContacts';
import { MyCollectionPage } from '../myCollection/myCollection';
import { SysSettingPage } from '../sysSetting/sysSetting';
import { UserInfoPage } from '../userInfo/userInfo';
import { MyShopPage } from '../myShop/myShop';
import { ShopConditionPage } from '../shopCondition/shopCondition';
import { NewShopPage } from '../newShop/newShop';
import { ShareFriendPage } from '../shareFriend/shareFriend';
import { ScoreRecordPage } from '../scoreRecord/scoreRecord';
import { SellerOrderPage } from '../sellerOrder/sellerOrder';
import { BusinessOrderPage } from '../businessOrder/businessOrder';
import { EditShopPage } from '../editShop/editShop';
import { MyPartnerPage } from '../myPartner/myPartner';
import { SetAmountPage } from '../setAmount/setAmount';
import { ScanPage } from '../scan/scan';
import { BarcodeScanner } from 'ionic-native';
import { ScoreInfoPage } from '../scoreInfo/scoreInfo';
import { ScoreExchangePage } from '../scoreExchange/scoreExchange';
import { RechargePage } from '../recharge/recharge';
import { PayMentPage } from '../payMent/payMent';
import { MyScorePage } from '../myScore/myScore';
import { MyEPPage } from '../myEP/myEP';
import { MyDouDouPage } from '../myDouDou/myDouDou';
import { MyRedopenPage } from '../myRedopen/myRedopen';
import { AlertController } from 'ionic-angular';

declare let Wechat:any;
var commService:CommonService;
let loader:any;
var fmyPage: any;
@Component({
  selector: 'page-fmy',
  templateUrl: 'fmy.html'
})
export class FmyPage {

    myScore:number;
    myEP:number;
    doudou:number;
    public score: number =0;
    myorderNum:any;
    myPending:number=0;//我的订单待付款
    myPayed:number=0;//我的订单待发货
    constructor(public navCtrl: NavController,public commonService: CommonService,
      public alertCtrl: AlertController,
      public loadingCtrl:LoadingController,
      public modalCtrl: ModalController) {
        fmyPage = this;
        commService = commonService;
        // this.checkisinstallwx();
    }

    /*页面事件*/
    ionViewWillEnter(){
        /**加载消息**/
        if(this.commonService.token != null && this.commonService.token!= ''){

            this.commonService.loadMsgCount();
            /*签到*/
            this.commonService.signedIn();
            //加载数据
                 this.commonService.httpLoad({
                        url:this.commonService.baseUrl+'/order/orderNum',
                        data:{
                         status:""
                        }
                    }).then(data=>{
                        if(data.code=='200'){
                             this.myPending = data.result.pending;
                             this.myPayed = data.result.payed;

                        }
                    });
                 this.commonService.httpLoad({
                    url:this.commonService.baseUrl+'/order/orderNum',
                    data:{
                     status:"",
                     storeId:this.commonService.user.storeId
                    }
                }).then(data=>{
                    if(data.code=='200'){
                         this.myorderNum = data.result;
                    }
                });

                this.getUserScore();
                this.loadRedInfo();
                // if(this.commonService.showOpenRed){
                //     //加载是否显示红包
                //
                // }else{
                //     // this.isBindSHWeiXin();
                // }
        }
        /**加载参数**/
        this.commonService.loadParam();
    }
    /*获取用户余额积分信息*/
    getUserScore(){
      this.commonService.httpLoad({
             url:this.commonService.baseUrl+'/user/score',
             data:{
             }
         }).then(data=>{
             if(data.code=='200'){
                  this.myScore = data.result.score;
                  this.myEP = data.result.exchangeEP;
                  this.doudou = data.result.doudou;
             }
         });
    }
    //加载签到红包信息
    loadRedInfo(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/sign/getSignInInfo',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.commonService.showOpenRed = false;
              if(data.result.isSignInByPartner==false){
                  if(data.result.isSignInByDoudou==true){
                      localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"false");
                      let profileModal = this.modalCtrl.create(MyRedopenPage, {isSignInByDoudou: data.result.isSignInByDoudou,isSignInByPartner:data.result.isSignInByPartner});
                      profileModal.onDidDismiss(data => {
                          this.getUserScore();
                          this.isBindSHWeiXin();
                      });
                      profileModal.present();
                  }else{
                      this.isBindSHWeiXin();
                      localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"true");
                  }
              }else{
                 localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"false");
                 let profileModal = this.modalCtrl.create(MyRedopenPage, {isSignInByDoudou: data.result.isSignInByDoudou,isSignInByPartner:data.result.isSignInByPartner});
                 profileModal.onDidDismiss(data => {
                     this.getUserScore();
                     this.isBindSHWeiXin();
                 });
                 profileModal.present();
              }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /*登录页面*/
    goToLoginPage(){
        this.navCtrl.push(LoginPage);
    }

    /*用户信息*/
    gotoUserInfoPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(UserInfoPage);
        }
    }

    /*积分钱包页面*/
    gotoIntegroWalletPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(IntegroWalletPage);
        }
    }

    /*我要收款设置金额页面*/
    gotoSetAmountPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(SetAmountPage);
        }
    }

    //跳转到我的余额页面
    gotoMyScorePage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MyScorePage);
        }
    }

    /*跳转到我的EP页面*/
    gotoMyEPPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MyEPPage);
        }
    }

    /*跳转到我的斗斗页面*/
    gotoMyDouDouPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MyDouDouPage);
        }
    }

    /*扫一扫页面*/
    gotoScanPage(){
    //   var sancjson = '{"businessSendEp":90,"discountEP":20,"firstReferrerScale":10,"payAmount":10,"secondReferrerScale":10,"storeUserId":"1023FE4D12EF43BD8DAD58D6814D9B69","thirdReferrerScale":10,"type":1}';
    //   if(sancjson.indexOf('businessSendEp')>=0&& sancjson.indexOf('secondReferrerScale')>=0){
    //       this.navCtrl.push(ScanPage,{text:sancjson});
    //   }else{
    //       this.commonService.toast("扫码失败,请重新扫码");
    //   }

    //   let barcode ='http://120.76.43.39/h5test?index=4&storeUserId=1023FE4D12EF43BD8DAD58D6814D9B69&uid=200331&type=2&storeId=FB5937DBB58E45488D38228FC01E4928';
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
          let storeUserId;
          let storeId;
            // console.log("barcodeData.text ----->> "+barcode)
            // if(barcode.indexOf('type')>=0){
            //     if(barcode.indexOf('http')>=0){
            //         let tem = barcode.split('?')[1];
            //         let tems = tem.split('&');
            //         for(var o in tems){
            //             console.log(tems[o]);
            //             let temo = tems[o].split('=');
            //             console.log(temo[0]+" temo[1] "+temo[1]);
            //             if(temo[0]=='storeUserId'){
            //                 storeUserId = temo[1];
            //             }
            //             if(temo[0]=='storeId'){
            //                 storeId = temo[1];
            //             }
            //         }
            //         this.navCtrl.push(PayMentPage,{storeUserId:storeUserId,storeId:storeId});
            //     }
            // }

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

    /*我的商品页面*/
    gotoMyGoodsPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MyGoodsPage);
        }
    }

    /*我的斗拍页面*/
    gotoMyAuctionPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MyAuctionPage);
        }
    }

    /*我的订单页面*/
    gotoMyOrderPage(index,name){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(SellerOrderPage,{id:index,order:name});
        }
    }
    gotoMyOrderPage2(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(SellerOrderPage);

        }
    }
    /*商家订单页面*/
    gotoBusinessOrderPage(index,name){
         if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(BusinessOrderPage,{id:index,order:name});
        }
    }
    gotoBusinessOrderPage2(){
         if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(BusinessOrderPage);
        }
    }
  //(2,'noprocess')
    /*我的联盟页面*/
    gotoMyLeaguesPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            if(this.commonService.user.isCompleteInfo==null || this.commonService.user.isCompleteInfo=='0'){
                    this.commonService.toast("请先完善资料（会员手机号，地址）!");
                    this.navCtrl.push(UserInfoPage);
            }else{
                this.commonService.httpGet({
                    url:this.commonService.baseUrl+'/user/store/status',
                    data:{}
                }).then(data=>{
                    if(data.code==200){
                        let leagues = data.result;
                        if(leagues != null){
                            if(leagues.isCreated==1){
                                //已存在店铺
                                if(leagues.status==0){
                                    //审核中
                                    this.commonService.toast("店铺正在审核中");
                                }else if(leagues.status==1){
                                    //审核通过
                                    this.navCtrl.push(MyShopPage);
                                }else if(leagues.status==2){

                                    //审核不通过
                                    this.navCtrl.push(EditShopPage,{shopStrut:2});
                                }else {
                                    //关闭
                                    this.commonService.toast("店铺已被关闭，请联系管理员");
                                }
                            }else{
                                //没有店铺
                                if(leagues.sumUserDrawScore>=leagues.createStoreCondition){
                                    //可以开店
                                    this.navCtrl.push(NewShopPage);
                                }else{
                                    //不可以开店
                                    this.navCtrl.push(ShopConditionPage,{createStoreCondition:leagues.createStoreCondition});
                                }
                            }
                        }
                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
            }
        }
    }

    /*我的人脉页面*/
    gotoMyContactsPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MyContactsPage);
        }
    }
    /*合伙人*/
    gotoMyPartnerPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MyPartnerPage);
        }
    }

    /*积分记录页面*/
    gotoScoreRecordPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(ScoreRecordPage);
        }
    }

    /*我的收藏页面*/
    gotoMyCollectionPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(MyCollectionPage);
        }
    }

    /*分享好友*/
    gotoShareFriendPage(){
        if(this.commonService.token==null){
            this.goToLoginPage();
        }else{
            this.navCtrl.push(ShareFriendPage);
        }
    }

    /*系统设置页面*/
    gotoSysSettingPage(){
        this.navCtrl.push(SysSettingPage);
    }
    /*ep兑换*/
    viewRecord(typeNum){
        this.navCtrl.push(ScoreInfoPage,{typeNum:typeNum});
    }
     /*充值余额*/
     recharge(){
         if(this.commonService.token==null){
             this.goToLoginPage();
         }else{
             this.navCtrl.push(RechargePage);
        }
    }
    /*积分兑换*/
     exchange(){
         if(this.commonService.token==null){
             this.goToLoginPage();
         }else{
            sessionStorage.setItem("score",this.myScore+"");
            this.navCtrl.push(ScoreExchangePage);
        }
    }

    isBindSHWeiXin(){
        console.log("this.commonService.user.isBindSHWeiXin "+this.commonService.user.isBindSHWeiXin+"  this.ishasewx "+this.ishasewx);
        // if(this.commonService.user.isBindSHWeiXin != '0' && this.ishasewx ==true){
        //     let confirm = this.alertCtrl.create({
        //       title: '系统提示',
        //       message: '帐号升级',
        //       enableBackdropDismiss:true,
        //       buttons: [
        //         {
        //           text: '确认',
        //           handler: () => {
        //               fmyPage.weiXinLogin();
        //           }
        //         }
        //       ]
        //     });
        //     confirm.present();
        // }
    }

    //判断是否安装微信
    ishasewx:boolean = false;
    checkisinstallwx(){
        if(typeof Wechat == "undefined"){
            return;
        }
        Wechat.isInstalled(function (installed) {
            console.log("判断是否安装微信======installed  "+installed)
            if(installed){
                fmyPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                fmyPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            fmyPage.ishasewx = false;
        });
    }

    weiXinLogin(){
        loader = this.loadingCtrl.create({content: "数据加载中..."});

        Wechat.isInstalled(function (installed) {

            if(installed){
                var scope = "snsapi_userinfo",
                state = "_" + (+new Date());
                Wechat.auth(scope, state, function (response) {
                    loader.present();
                    commService.httpGet({
                        url:'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+this.commonService.wxappid+'&secret='+this.commonService.wxappsecret+'&code='+response.code+'&grant_type=authorization_code',
                        data:{}
                    }).then(data=>{
                        console.log("------------->>>>>weiXinLogin data "+JSON.stringify(data));
                        loader.dismiss().catch(()=>{});
                        commService.httpGet({
                            url:'https://api.weixin.qq.com/sns/userinfo?access_token='+data.access_token+'&openid='+data.openid+'&lang=zh_CN',
                            data:{}
                        }).then(data=>{
                            data.inviteCode='';
                            console.log("------------->>>>>weiXinLogineeeeee data "+JSON.stringify(data));
                            fmyPage.bindWX(data);
                        });
                    });
                }, function (reason) {
                    loader.dismiss().catch(()=>{});
                    // commService.alert("系统错误",reason);
                });
            }else{
                loader.dismiss().catch(()=>{});
                commService.alert("系统提醒","请先安装微信");
            }
        }, function (reason) {
            loader.dismiss().catch(()=>{});
            commService.alert("系统错误",reason);
        });
    }

    bindWX(data){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+"/user/bindweixin",
            data:{
                sex:data.sex,
                headImgUrl:data.headimgurl,
                nickName:data.nickname,
                phone:this.commonService.user.phone,
                unionId:data.unionid,
            }
        }).then(data=>{
            if(data.code == '200'){
                this.commonService.toast("绑定成功");
                this.getUserInfo();
                this.commonService.user.isBindSHWeiXin = '0';
            }else{
                commService.alert("系统错误",data.msg);
            }
        });
    }
    //获取用户信息
    getUserInfo(){
         this.commonService.httpGet({
              url:this.commonService.baseUrl+'/user/login/getUser',
              data:{

              }
          }).then(data=>{
              if(data.code==200){
                this.commonService.user=data.result;
              }else{
                  this.commonService.alert("系统提示",data.msg);
              }
          });
    }


}
