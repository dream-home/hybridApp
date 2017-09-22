import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { Area } from '../../app/app.data';
// import { QuickPayInfoPage } from '../quickPayInfo/quickPayInfo';
import { PayPwSettingPage } from '../payPwSetting/payPwSetting';
import { DeliveryAddressPage } from '../deliveryAddress/deliveryAddress';

declare let Wechat:any;
declare let AliPay: any;
var buyGoodsPage: any;
@Component({
    selector: 'page-buyGoods',
    templateUrl: 'buyGoods.html',
    providers:[Area]
})
export class BuyGoodsPage {

    goodsInfo: any;
    payPwd:string='';
    toUrl:string;
    discountBoolean:boolean = false;
    scorebuy:number;
    goodId:string;
    type:string;
    orderNo:string;
    num:number;
    storeName:string;
    originalPrice:number;
    businessSendEp:number;
    myScore:number;
    myEP:number;
    source:string = "3";
    payTime:string;
    isShowPayPw:boolean = false;
    userData={
        name:'',
        phone:'',
        addr:'',
        province: '',
        city: '',
        county: ''
    };
    provinces:any[];
    citys:any[];
    countys:any[];
    province:string="110000";
    city:string="110100";
    county:string="110101";
    isDisable:boolean=false;//余额支付确定按钮点击后禁用，防止连点
    submitDisabled:boolean=false;//点击提交订单按钮禁用该按钮，防止连点

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
        businessSendEp:'',
        discountEP:''
    };
    /*底下购物车信息*/
    ShoppingCart = {
      goodsNum:0,
      goodsAllPrice:0,
      goodsAllMoney:0,
      goodsAllEp:0,
      discountEP:0
    }
    /*订单商品数据对象*/
    carGood = {
        goodsId:'',
        num:0,
        discountEP:0
    }
    carGoods:any = [];
    shopId:string;
    epDiscountAmount:string="2";
    onePayWay:boolean=false;//是否只能余额支付,在EP抵用券设置为100时
    /*ep折扣总费用*/
    epDiscountNum:number;
    MyUserAddr:any;//收货地址信息
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams,
        public area:Area
    ) {
        buyGoodsPage = this;
        this.goodId = navParams.get('goodsId');

        this.scorebuy = navParams.get('scorebuy');
        this.type = navParams.get('type');
        this.orderNo = navParams.get('orderNo');
        this.num = navParams.get('num');
        this.storeName = navParams.get('storeName');
        this.originalPrice = navParams.get('originalPrice');
        this.businessSendEp = navParams.get('businessSendEp');
        this.checkisinstallwx();
        this.loadAddress();

        // this.loadData();

        this.userData.phone = commonService.user.phone;
        this.userData.name = commonService.user.userName;

        this.provinces = area.areaColumns[0].options;

        if(commonService.user.userAddress != null && commonService.user.userAddress.addr != null){
            this.userData.addr = commonService.user.userAddress.addr;
        }

        if(commonService.user.userAddress != null && commonService.user.userAddress.province != null && commonService.user.userAddress.province != ''){
            this.userData.province = commonService.user.userAddress.province;
            this.province = this.area.findIdByProvince(commonService.user.userAddress.province);
            this.selectProvi({text:commonService.user.userAddress.province});
        }else{
            this.selectProvi({text:'北京市'});
        }

        if(commonService.user.userAddress != null && commonService.user.userAddress.city != null && commonService.user.userAddress.city != ''){
            this.userData.city = commonService.user.userAddress.city;
            this.city = this.area.findIdByCity(commonService.user.userAddress.city);
            this.selectCity({text:commonService.user.userAddress.city});
        }

        if(commonService.user.userAddress != null && commonService.user.userAddress.county != null && commonService.user.userAddress.county != ''){
            this.userData.county = commonService.user.userAddress.county;
            this.county = this.area.findIdByArea(commonService.user.userAddress.county);
        }


        if(this.type=='1001'){
          this.toUrl=this.commonService.baseUrl+'/mall/store/goods/purchase';
        }else if(this.type=='1002'){
          this.toUrl=this.commonService.baseUrl+'/mall/goods/purchase';
        }else if(this.type=='1003'){
          this.toUrl=this.commonService.baseUrl+'/user/goods/win/buy';
        }else if(this.type=='1004'){
          this.toUrl=this.commonService.baseUrl+'/mall/goods/epexchange';
        }

        this.commonService.httpLoad({
             url:this.commonService.baseUrl+'/user/score',
             data:{
             }
         }).then(data=>{
             if(data.code=='200'){
                  this.myScore = data.result.score;
                  this.myEP = data.result.exchangeEP;
             }
         });

    }

    /*是否使用EP兑换券*/
    epDiscount(){
        if(this.discountBoolean){
            this.discountBoolean = false;
            this.onePayWay=false;
            this.saveMyGoodsData();
        }else{
            this.discountBoolean = true;
            this.saveMyGoodsData();
            if(this.ShoppingCart.goodsAllPrice==this.epDiscountNum){
                this.onePayWay=true;
                this.source='3';
            }
        }
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.submitDisabled=false;
        this.shopId = this.navParams.get("storeId");
        let data = localStorage.getItem(this.shopId);
        let goodinfo = this.navParams.get('goodsInfo');
        if(this.shopId != '' && this.shopId !=null){
            if(data != null && data != '' && data != 'null'){
                console.log("data"+data);
                this.myShopGoodData = JSON.parse(data);
                if(this.myShopGoodData!=null){
                    this.myShopGoods = this.myShopGoodData.myShopGoods;
                    this.saveMyGoodsData();
                }
            }
        }else{
            if(goodinfo != '' && goodinfo != null){
                this.myShopGood = JSON.parse(goodinfo);
                this.myShopGood.num = 1;
                this.myShopGoods[0]=this.myShopGood;
                this.saveMyGoodsData();
            }
        }

        var myUserAddr = sessionStorage.getItem("BuyGoodsPage_MyUserAddr");
        if(myUserAddr!=null && myUserAddr!=''){
            this.MyUserAddr =JSON.parse(myUserAddr);
            sessionStorage.removeItem('BuyGoodsPage_MyUserAddr');
        }else{
            this.loadAddress();
        }
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
                buyGoodsPage.ishasewx = true;
            }else{
                console.log("没有安装微信======")
                buyGoodsPage.ishasewx = false;
            }
        },function (reason) {
            this.commonService.alert("系统错误",reason);
            buyGoodsPage.ishasewx = false;
        });
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();

    }

    changeSource(sourceId){
        this.source = sourceId;
    }

    stopPropagation(ev){
        ev.stopPropagation();
    }

    /*移除商品*/
    numRemove(ev,numRe){
        ev.stopPropagation();
        if(this.myShopGoods[numRe].num == 0 || this.myShopGoods[numRe].num < 0){

        }else{
            this.myShopGoods[numRe].num=this.myShopGoods[numRe].num- 1
        }
        this.saveMyGoodsData();
        if(this.ShoppingCart.goodsNum == 0){
            this.navCtrl.pop();
        }
        if(this.ShoppingCart.goodsAllPrice==this.epDiscountNum){
            this.onePayWay=true;
            this.source='3';
        }
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
        if(this.ShoppingCart.goodsAllPrice==this.epDiscountNum){
            this.onePayWay=true;
            this.source='3';
        }
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
        let goodsDiscount = 0;
        for(let goods in this.myShopGoodData.myShopGoods){
              //console.log(this.myShopGoodData.myShopGoods[goods]);
              if(this.myShopGoodData.myShopGoods[goods].num*1>0){
                  gnum = this.myShopGoodData.myShopGoods[goods].num*1;
                  goodsnum = goodsnum+gnum;
                  goodsprice = goodsprice + this.myShopGoodData.myShopGoods[goods].price*1*gnum;
                  goodsmoney = goodsmoney + this.myShopGoodData.myShopGoods[goods].originalPrice*1*gnum;
                  goodsep = goodsep + this.myShopGoodData.myShopGoods[goods].businessSendEp*1*gnum;
                  goodsDiscount = goodsDiscount + (this.myShopGoodData.myShopGoods[goods].discountEP*1/100)*this.myShopGoodData.myShopGoods[goods].price*1*gnum;
              }
        }
        this.num = goodsnum;
        this.ShoppingCart.goodsNum = goodsnum;
        this.ShoppingCart.goodsAllPrice = goodsprice;
        this.ShoppingCart.goodsAllMoney = goodsmoney;
        this.ShoppingCart.goodsAllEp = goodsep;
        this.ShoppingCart.discountEP = goodsDiscount;
        if(this.discountBoolean){
            if(this.ShoppingCart.discountEP>this.myEP){
                this.epDiscountNum = this.myEP;
                // this.ShoppingCart.goodsAllPrice = (this.ShoppingCart.goodsAllPrice - this.myEP);
            }else{
                this.epDiscountNum = this.ShoppingCart.discountEP;
                // this.ShoppingCart.goodsAllPrice = (this.ShoppingCart.goodsAllPrice - this.ShoppingCart.discountEP);
            }
        }else{
            this.epDiscountNum = 0;
        }
        console.log(goodsnum+" goodsprice "+goodsprice+" goodsmoney "+goodsmoney+" goodsep "+goodsep+" this.ShoppingCart "+this.ShoppingCart+" 折扣this.ShoppingCart.discountEP "+this.ShoppingCart.discountEP);
        if(this.shopId!='' && this.shopId!=null){
            localStorage.setItem(this.shopId,JSON.stringify(this.myShopGoodData));
        }
    }

    buyGoods(){
        if(this.validator() && this.source == '3'){
            if((this.scorebuy*1)*(this.num*1) > this.myScore){
                this.commonService.toast('您的余额不足');
            }else{
                this.isShowPayPw = true;
            }
        }
    }
    /*确认购买*/
    submitBuyGoods(){
        if(this.orderNo!=null&&this.orderNo!=''){
            this.submitPay();
        }else{
            // let tempAddr="";
            // if(this.userData.province != null && this.userData.province != ''){
            //     tempAddr +=this.userData.province;
            // }
            // if(this.userData.city != null && this.userData.city != ''){
            //     tempAddr +=this.userData.city;
            // }
            // if(this.userData.county != null && this.userData.county != ''){
            //     tempAddr +=this.userData.county;
            // }
            let tempAddr = this.MyUserAddr.province+this.MyUserAddr.city+this.MyUserAddr.county+this.MyUserAddr.addr;
            this.isDisable = true;
            this.commonService.httpPost({
                url:this.toUrl,
                data:{
                    addr:tempAddr,
                    goodsId:this.myShopGoods[0].id,
                    num:this.myShopGoods[0].num,
                    payPwd:this.payPwd,
                    phone:this.MyUserAddr.receivePhone,
                    userName:this.MyUserAddr.receiveName
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("兑换商品成功");
                    this.goToBackPage();
                }else{
                    this.isDisable = false;
                    this.commonService.alert("系统提示",data.msg);
                }
            });
          }
    }
    /*购物车支付*/
    carPay(){
        if(!this.validator()){
            return;
        }
        if(this.type=='1004'){
          if(this.isShowPayPw == false){
              if(this.ShoppingCart.goodsAllPrice*1 > 99999){
                  this.commonService.toast('EP总金额不能超过99999');
              }else if(this.ShoppingCart.goodsAllPrice*1 > this.myEP*1){
                  this.commonService.toast('您的EP不足');
              }else{
                  this.isShowPayPw = true;
              }
              return;
          }
          this.submitBuyGoods();
        }else {
          if(this.ShoppingCart.goodsAllPrice > 99999){
              this.commonService.toast("总金额不能超过99999");
              return;
          }else if(this.source=='3' && this.isShowPayPw == false){
              if(this.ShoppingCart.goodsAllPrice*1 > this.myScore*1){
                  this.commonService.toast('您的余额不足');
              }else{
                  this.isShowPayPw = true;
                  this.isDisable=false;
              }
              return;
          }
          // let tempAddr="";
          // if(this.userData.province != null && this.userData.province != ''){
          //     tempAddr +=this.userData.province;
          // }
          // if(this.userData.city != null && this.userData.city != ''){
          //     tempAddr +=this.userData.city;
          // }
          // if(this.userData.county != null && this.userData.county != ''){
          //     tempAddr +=this.userData.county;
          // }
          let tempAddr = this.MyUserAddr.province+this.MyUserAddr.city+this.MyUserAddr.county+this.MyUserAddr.addr;
          this.carGoods = [];
          for(var i =0 ; i<this.myShopGoods.length ; i++ ){
              this.carGood = {goodsId:'', num:0 ,discountEP:0};
              if(this.myShopGoods[i].num>0){
                  this.carGood.goodsId = this.myShopGoods[i].id;
                  this.carGood.num = this.myShopGoods[i].num;

                  if(this.discountBoolean){
                       this.carGood.discountEP = this.myShopGoods[i].discountEP;
                  }else{
                      this.carGood.discountEP = 0;
                  }
                  this.carGoods.push(this.carGood);
                  // alert(JSON.stringify(this.carGoods));
              }
          }
          this.submitDisabled=true;
          // if(this.source=='1'){//支付宝
          //     // sessionStorage.setItem("flag","1");
          //     // this.navCtrl.push(QuickPayInfoPage,{tranType:'2',payData:{
          //     //     addr:tempAddr,
          //     //     cartList:this.carGoods,
          //     //     payPwd:this.payPwd,
          //     //     payType:this.source,
          //     //     phone:this.MyUserAddr.receivePhone,
          //     //     userName:this.MyUserAddr.receiveName
          //     // },payUrl:'/order/appPurchase',
          //     // aliCallBackURL:'/order/alipayAppOrder',
          //     // payScore:this.commonService.toDecimal(this.ShoppingCart.goodsAllPrice-this.epDiscountNum),
          //     // storeId:this.shopId});
          // }else{
          this.isDisable=true;
          if(!this.ishasewx && this.source=='2'){
             this.commonService.alert("系统提醒","请先安装微信");
             this.submitDisabled=false;
             return;
          }else{
              this.commonService.httpPost({
                  url:this.commonService.baseUrl+"/order/appPurchase",
                  data:{
                      addr:tempAddr,
                      cartList:this.carGoods,
                      payPwd:this.payPwd,
                      payType:this.source,
                      phone:this.MyUserAddr.receivePhone,
                      userName:this.MyUserAddr.receiveName
                  }
              }).then(data=>{
                  if(data.code==200){
                      this.orderNo = data.result.orderNo;
                      // alert(this.orderNo);
                      this.payTime = data.result.payTime;
                      if(this.source == '2'){//微信
                           var params = {
                                  partnerid: data.result.partnerid, // merchant id
                                  prepayid: data.result.prepayid, // prepay id
                                  noncestr: data.result.noncestr, // nonce
                                  timestamp: data.result.timestamp, // timestamp
                                  sign: data.result.sign, // signed string
                              };
                            let interval = setInterval(()=>{
                              this.submitDisabled=false;clearInterval(interval);//移除对象
                            },2000);
                            Wechat.sendPaymentRequest(params, function () {
                                buyGoodsPage.buyCompleted();
                            }, function (reason) {
                                buyGoodsPage.clearCart();
                                buyGoodsPage.goToBackPage();
                                this.commonService.alert("系统提示",reason);
                            });


                      }else if(this.source == '3'){//余额
                          this.clearCart();
                          this.goToBackPage();
                          this.commonService.toast("购买商品成功");
                      }else if(this.source=='1'){
                          let payInfo  =data.result.orderInfo;
                          console.log("--------------->>>> payInfo  "+payInfo)
                          //第二步：调用支付插件
                          AliPay.pay(payInfo,
                              function success(e){
                                 buyGoodsPage.alipaycallback();
                                // buyGoodsPage.clearCart();
                                // buyGoodsPage.commonService.toast("购买商品成功");
                                // buyGoodsPage.navCtrl.pop();
                              },function error(e){
                                  buyGoodsPage.clearCart();
                                  buyGoodsPage.goToBackPage();
                                 this.commService.alert("系统提醒","支付失败");
                          });
                      }
                  }else{
                      this.isDisable=false;
                      this.submitDisabled=false;
                      this.commonService.alert("系统提示",data.msg);
                      if(data.msg=="请先设置支付密码"){
                          this.navCtrl.push(PayPwSettingPage);
                      }
                  }
              });
          }
          // }

      }
    }

    /*确认支付 积分购买*/
    submitPay(){
        // let tempAddr="";
        // if(this.userData.province != null && this.userData.province != ''){
        //     tempAddr +=this.userData.province;
        // }
        // if(this.userData.city != null && this.userData.city != ''){
        //     tempAddr +=this.userData.city;
        // }
        // if(this.userData.county != null && this.userData.county != ''){
        //     tempAddr +=this.userData.county;
        // }
        let tempAddr = this.MyUserAddr.province+this.MyUserAddr.city+this.MyUserAddr.county+this.MyUserAddr.addr;
        this.isDisable = true;
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/user/goods/win/buy',
            data:{
                addr:tempAddr,
                orderNo:this.orderNo,
                phone:this.MyUserAddr.receivePhone,
                userName:this.MyUserAddr.receiveName,
                payPwd:this.payPwd
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.toast("购买商品成功");
                this.goToBackPage();
            }else{
                this.isDisable = false;
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    validator(){
        if(this.MyUserAddr == null || this.MyUserAddr == ''){
            this.commonService.toast("您还没有设置收货地址，暂时无法提交订单");
            return false;
        }
        if(this.num==null || this.num==0 || this.num<0){
            this.commonService.toast("商品数量不能小于1");
            return false;
        }
        if(this.MyUserAddr.receiveName==null || this.MyUserAddr.receiveName=='' || (/^\s+$/g).test(this.MyUserAddr.receiveName)){
            this.commonService.toast("联系人不能为空");
            return false;
        }
        if(!(/^1[34578]\d{9}$/).test(this.MyUserAddr.receivePhone) && this.MyUserAddr.receivePhone.length > 7){
            this.commonService.toast("收货人电话有误，请重填");
            return false;
        }
        if((/^\s+$/g).test(this.MyUserAddr.receivePhone)){
            this.commonService.toast("联系电话不能为空");
            return false;
        }
        return true;
    }
    alipaycallback(){//支付宝二次回调接口
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/order/alipayAppOrder',
            data:{
                orderNo:this.orderNo
            }
        }).then(data=>{
          if(data.code==200){
              this.clearCart();
              this.commonService.toast("购买商品成功");
              this.navCtrl.pop();
          }else{
              this.commonService.alert("系统提示",data.msg);
          }
        })
    }
    buyCompleted(){
        // this.commonService.httpGet({
        //     url:this.commonService.baseUrl+'/wallet/isPaySuccess',
        //     data:{
        //         orderNo:this.orderNo
        //     }
        // }).then(data=>{
        //     if(data.code==200){
        //         this.commonService.alert("系统提示","支付成功");
        //         this.goToBackPage();
        //     }else{
        //         this.commonService.alert("系统提示",data.msg);
        //     }
        // });

        var temnum =0 ;
        this.commonService.showLoading("提交数据中。。。");
        let interval = setInterval(()=>{
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/order/wxapporder',
                data:{
                    orderNo:this.orderNo
                }
            }).then(data=>{
                if(data.code==200){
                    clearInterval(interval);//移除对象
                    this.commonService.hideLoading();
                    this.commonService.toast("购买商品成功");
                    this.clearCart();
                    this.goToBackPage();
                }else{
                    if(temnum==2){
                        this.commonService.alert("系统提示",data.msg);
                    }
                }
            });
            temnum =temnum+1;
            if(temnum==3){
                this.commonService.hideLoading();
                clearInterval(interval);//移除对象
            }
        },2000);


    }

    selectProvi(itm){
        this.citys = this.area.findCityLisByPid(this.province);
        this.city = this.citys[0].value;
        this.selectCity({text:this.citys[0].text});
        this.userData.province = itm.text;
    }

    selectCity(itm){
        this.countys = this.area.findAreaLisByPid(this.city);
        this.county = this.countys[0].value;
        this.selectCounty({text:this.countys[0].text});
        this.userData.city = itm.text;
    }

    selectCounty(itm){
        this.userData.county = itm.text;
    }

    gotoDeliveryAddress(urlId){
        this.navCtrl.push(DeliveryAddressPage,{fromId:urlId});
    }

    //获取收货地址
    loadAddress(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/address/getUserAddress',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.MyUserAddr = null;
                var userAddrs = data.result;
                if(userAddrs!=null && userAddrs.length>0){
                    for(var o in userAddrs){
                        if(userAddrs[o].isDefault*1  == 1){
                            this.MyUserAddr = userAddrs[o];
                        }
                    }
                    if(this.MyUserAddr==null || this.MyUserAddr ==''){
                        this.MyUserAddr = userAddrs[0];
                    }
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
}
