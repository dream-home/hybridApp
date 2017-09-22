import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { Device } from 'ionic-native';
import { NavController,ModalController,AlertController } from 'ionic-angular';
import { SearchShopPage } from '../searchShop/searchShop';
import { LoginPage } from '../login/login';
import { SellerShopPage } from '../sellerShop/sellerShop';
import { FindCityPage } from '../findCity/findCity';
import { MyRedopenPage } from '../myRedopen/myRedopen';
declare var AMap; //declare var AMap: any;
var leagues: any;
@Component({
    selector: 'page-leagues',
    templateUrl: 'leagues.html'
})
export class LeaguesPage {
    items: any;
    pageNo:number;
    showScroll:boolean;
    areaName:string="全国";
    shopName:string="";
    deviceUUID:string = "";//设备的唯一id
    latitude:string = '';//纬度
    longitude:string = '';//经度
    amap:any;//高德地图
    isSendLocation:boolean = false;//是否发送经纬度
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        public modalCtrl: ModalController,
        public alertCtrl: AlertController,
    ) {
          leagues = this;
          let cityName = sessionStorage.getItem("cityName");
          if(null != cityName){
              this.areaName = cityName;
          }else{
              if(localStorage.getItem('mapCity')!=null&&localStorage.getItem('mapCity')!=''){
                  this.areaName = localStorage.getItem('mapCity');
              }
          }
          this.deviceUUID = JSON.stringify(Device.uuid);
          console.log('Device UUID is: ' + JSON.stringify(Device.uuid));
          this.pageNo = 1;
          this.showScroll = true;
          this.latitude = sessionStorage.getItem("mylat");
          this.longitude = sessionStorage.getItem("mylng");
          this.loadData();
          /**加载消息**/
          if(this.commonService.token != null && this.commonService.token!= ''){
              this.commonService.loadMsgCount();
              /*签到*/
              this.commonService.signedIn();
          }
          /**加载参数**/
          this.commonService.loadParam();

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.shopName = '';

        if(localStorage.getItem('isSendLocation')!=null&&localStorage.getItem('isSendLocation')!=''){
            this.isSendLocation = true;
        }else{
            this.isSendLocation = false;
        }
        let cityName = sessionStorage.getItem("cityName");
        if(this.commonService.token != null && this.commonService.token!= ''){
            if((localStorage.getItem(this.commonService.getTodayDate()+this.commonService.user.id)==null || localStorage.getItem(this.commonService.getTodayDate()+this.commonService.user.id)=="false")&&this.commonService.showOpenRed){
                //加载是否显示红包
                this.loadRedInfo();
            }
        }
        if(null != cityName){
            this.areaName = cityName;
            this.pageNo = 1;
            this.showScroll = true;
            this.loadData();
        }
        this.commonService.showLoading();
        setInterval(()=>{
            this.commonService.hideLoading();
        },1000);
        this.latitude = sessionStorage.getItem("mylat");
        this.longitude = sessionStorage.getItem("mylng");
        if(this.amap!=null){
            this.loadtude();
        }
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
                      profileModal.present();
                  }else{
                      localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"true");
                  }
              }else{
                 localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"false");
                 let profileModal = this.modalCtrl.create(MyRedopenPage, {isSignInByDoudou: data.result.isSignInByDoudou,isSignInByPartner:data.result.isSignInByPartner});
                 profileModal.present();
              }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    gotoSearchPage(){
        this.navCtrl.push(SearchShopPage,{shopName:this.shopName,areaName:this.areaName});
    }

    addCollection(id,ev){
        ev.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/store/collect/add',
                data:{
                    storeId:id
                }
            }).then(data=>{
                if(data.code==200){
                    let toast = this.commonService.toast("店铺收藏成功");
                    toast.onDidDismiss(() => {
                      /**this.navCtrl.push(MyCollectionPage);**/

                    });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }
     /*取消*/
    removeCollection(id,ev){
     ev.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/store/collect/cancel',
                data:{
                    storeId:id
                }
            }).then(data=>{
                if(data.code==200){
                    let toast = this.commonService.toast("已取消店铺收藏");
                    toast.onDidDismiss(() => {

                    });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }
    loadData(){
      console.log("----------isSendLocation  "+localStorage.getItem('isSendLocation')+" this.isSendLocation "+this.isSendLocation);
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/list',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                address:this.areaName=="全国"?'':this.areaName,
                latitude:this.isSendLocation?this.latitude:"",
                longitude:this.isSendLocation?this.longitude:"",
                serialNumber:this.deviceUUID,
                // apple:'888888'
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result.rows;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    doRefresh(refresher){
        if(this.amap!=null){
            this.loadtude();
        }
        this.pageNo = 1;
        this.showScroll = true;
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/mall/store/list',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                address:this.areaName=="全国"?'':this.areaName,
                latitude:this.isSendLocation?this.latitude:"",
                longitude:this.isSendLocation?this.longitude:"",
                serialNumber:this.deviceUUID,
                // apple:'888888'
            }
        }).then(data=>{
            refresher.complete();
            if(data.code==200){
                this.items = data.result.rows;
            }else{
                this.commonService.alert("系统提示","系统遇到问题，请稍后再试");
            }
        },err=>{
            refresher.complete();
        });
    }

    /*进入店铺*/
    gotoShop(id){/*
        let inviteCode = sessionStorage.getItem(id);*/
        this.navCtrl.push(SellerShopPage,{id:id});
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+'/mall/store/list',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.commonService.pageSize,
                    address:this.areaName=="全国"?'':this.areaName,
                    latitude:this.isSendLocation?this.latitude:"",
                    longitude:this.isSendLocation?this.longitude:"",
                    serialNumber:this.deviceUUID,
                    // apple:'888888'
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
            },err=>{
                infiniteScroll.complete();
                this.showScroll = false;
            });
        }, 500);
    }

    findCity(){
        this.navCtrl.push(FindCityPage,{cityName:this.areaName});
    }


    ionViewDidLoad() {
      console.log('Loading Amap');
      this.latitude = sessionStorage.getItem("mylat");
      this.longitude = sessionStorage.getItem("mylng");
      this.loadMap();
      this.loadToolBar();

    }

    loadToolBar(){
      AMap.plugin('AMap.ToolBar',function(){//异步
        var toolbar = new AMap.ToolBar();
        leagues.amap.plugin(toolbar);
      });
    }

    loadMap() {
        this.amap = new AMap.Map('iCenter');
        if(this.latitude != '' && this.longitude!=''&& this.latitude!=null && this.longitude!=null){

            this.loadcity();
        }
        // this.loadtude();
    }
    //根据IP 精准定位
    loadtude(){
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
            leagues.amap.addControl(geolocation);
            // console.log("进来了吗")
            geolocation.getCurrentPosition(function(status,result){//定位完成之后获取经纬度
                if(status == 'complete'){
                    sessionStorage.setItem("mylng",result.position.lng);
                    sessionStorage.setItem("mylat",result.position.lat);
                    leagues.latitude = result.position.lat;
                    leagues.longitude = result.position.lng;
                }else{

                }
                if(localStorage.getItem("mapCity")==null || localStorage.getItem("mapCity")==''){
                    let confirm = leagues.alertCtrl.create({
                      title: '切换城市',
                      message: '定位到当前城市['+result.addressComponent.city+'],是否切换城市?',
                      enableBackdropDismiss:false,
                      buttons: [
                        {
                          text: '取消',
                          handler: () => {
                              localStorage.setItem("mapCity",'');
                              localStorage.setItem("isSendLocation",'');
                              leagues.isSendLocation = false;
                          }
                        },
                        {
                          text: '切换',
                          handler: () => {
                              leagues.isSendLocation = true;
                              leagues.areaName = result.addressComponent.city;
                              leagues.loadData();
                              localStorage.setItem("mapCity",result.addressComponent.city);
                              console.log("mapCity为空,保存了本次定位"+result.addressComponent.city);
                              confirm.dismiss();
                          }
                        }
                      ]
                    });
                    confirm.present();

                }else{
                    if(localStorage.getItem("mapCity") != result.addressComponent.city){
                        let confirm = leagues.alertCtrl.create({
                          title: '切换城市',
                          message: '定位到当前城市['+result.addressComponent.city+'],是否切换城市?',
                          enableBackdropDismiss:false,
                          buttons: [
                            {
                              text: '取消',
                              handler: () => {
                                  localStorage.setItem("mapCity",'');
                                  localStorage.setItem("isSendLocation",'');
                                  leagues.isSendLocation = false;
                              }
                            },
                            {
                              text: '切换',
                              handler: () => {
                                  leagues.isSendLocation = true;
                                  leagues.areaName = result.addressComponent.city;
                                  leagues.loadData();
                                  localStorage.setItem("mapCity",result.addressComponent.city);
                                  confirm.dismiss();
                              }
                            }
                          ]
                        });
                        confirm.present();
                    }
                }
                // console.log(JSON.stringify(status));
                console.log("精准定位-------result "+JSON.stringify(result));
            });
        });
    }
    //根据IP定位城市
    loadcity(){
        this.amap.plugin('AMap.CitySearch', function () {
            var citySearch = new AMap.CitySearch();
            citySearch.getLocalCity(function(status,result){
                console.log("根据IP定位城市")
                console.log(JSON.stringify(status));
                // leagues.mapData = result;
                // leagues.mapDataStatus = status;
                // if(localStorage.getItem("mapCity")==null || localStorage.getItem("mapCity")==''){
                //     let confirm = leagues.alertCtrl.create({
                //       title: '切换城市',
                //       message: '定位到当前城市['+result.city+'],是否切换城市?',
                //       enableBackdropDismiss:false,
                //       buttons: [
                //         {
                //           text: '取消',
                //           handler: () => {
                //               localStorage.setItem("mapCity",'');
                //               localStorage.setItem("isSendLocation",'');
                //               leagues.isSendLocation = false;
                //           }
                //         },
                //         {
                //           text: '切换',
                //           handler: () => {
                //               leagues.isSendLocation = true;
                //               leagues.areaName = result.city;
                //               leagues.loadData();
                //               localStorage.setItem("mapCity",result.city);
                //               console.log("mapCity为空,保存了本次定位"+result.city);
                //               confirm.dismiss();
                //           }
                //         }
                //       ]
                //     });
                //     confirm.present();
                //
                // }else{
                //     if(localStorage.getItem("mapCity") != result.city){
                //         let confirm = leagues.alertCtrl.create({
                //           title: '切换城市',
                //           message: '定位到当前城市['+result.city+'],是否切换城市?',
                //           enableBackdropDismiss:false,
                //           buttons: [
                //             {
                //               text: '取消',
                //               handler: () => {
                //                   localStorage.setItem("mapCity",'');
                //                   localStorage.setItem("isSendLocation",'');
                //                   leagues.isSendLocation = false;
                //               }
                //             },
                //             {
                //               text: '切换',
                //               handler: () => {
                //                   leagues.isSendLocation = true;
                //                   leagues.areaName = result.city;
                //                   leagues.loadData();
                //                   localStorage.setItem("mapCity",result.city);
                //                   confirm.dismiss();
                //               }
                //             }
                //           ]
                //         });
                //         confirm.present();
                //     }
                // }

            });
        });
    }
    showConfirm(){
        let confirm = this.alertCtrl.create({
          title: '系统提示',
          message: '定位失败，请打开定位权限',
          enableBackdropDismiss:false,
          buttons: [
            {
              text: '确认',
              handler: () => {
              }
            }
          ]
        });
        confirm.present();
    }

}
