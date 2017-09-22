import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { Area } from '../../app/app.data';
declare var AMap; //全局高德地图变量
declare var $;
var findCity: any;
@Component({
    selector: 'page-findCity',
    templateUrl: 'findCity.html',
    providers:[Area]
})
export class FindCityPage {
    amap:any;//高德地图
    cityName:string;
    mapData:any = [];//定位出来的城市数据
    mapDataStatus:string;//定位城市状态
    provinces:any[];
    citys:any[];
    countys:any[];
    countrys:any = [];
    province:string="110000";
    city:string="110100";
    tcn:string;
    showCounties:boolean=false;//显示选择区/县
    idxs:any = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        public area:Area,
        public alertCtrl: AlertController,
        private navParams: NavParams
    ) {
        this.cityName = navParams.get("cityName");
        this.provinces = area.areaColumns[0].options;
        this.city = area.findIdByCity(this.cityName);
        this.tcn = sessionStorage.getItem("tcity");
        this.selectProvi();
        findCity = this;
        // console.log(this.countrys);
    }

    ionViewWillEnter(){
        for(var i=0;i<this.idxs.length;i++){
            this.countrys.push(this.area.findAreaListByIndexs(this.idxs[i]));
        }
        $("#letter li").each(function(){
            $(this).click(function(){
                $("#showLetter").stop(true);
                $("#showLetter").text($(this).find("a").text()).animate({opacity:0.7},300,function(){
                    $(this).animate({opacity:0},500);
                });
            });
        });
        // var letter_top = Math.round($("#letter").offset().top);
        // $('#letter').on('touchmove',function(e) {
        //     var touch = e.originalEvent.targetTouches[0];
        //     var touchY= touch.pageY;
        //     var index = Math.round((touchY-letter_top)/17);
        //     if(touchY<=letter_top){
        //         $("#showLetter").text($("#letter li:first").text());
        //     }else if(touchY>(459+letter_top)){
        //         $("#showLetter").text($("#letter li:last").text());
        //     }else{
        //         var letterText = $("#letter li:eq("+index+")").text();
        //         $("#showLetter").text(letterText).stop().css({"opacity":"0.7"}).animate({opacity:0},700);
        //         console.log(letterText);
        //     }
        // });
    }
    ionViewDidLoad() {
      console.log('Loading Amap');
      console.log("mapCity---"+localStorage.getItem("mapCity"));//mapCity保存上次定位的城市
      this.loadMap();
      this.loadToolBar();
    }

    loadToolBar(){
      AMap.plugin('AMap.ToolBar',function(){//异步
        var toolbar = new AMap.ToolBar();
        findCity.amap.plugin(toolbar);
      });
    }

    loadMap() {
        this.amap = new AMap.Map('iCenter');
        this.amap.plugin('AMap.CitySearch', function () {
            var citySearch = new AMap.CitySearch();
            citySearch.getLocalCity(function(status,result){
                console.log("根据IP定位城市")
                console.log(JSON.stringify(status));
                console.log("-------result "+JSON.stringify(result));
                findCity.mapData = result;
                findCity.mapDataStatus = status;
                // if(localStorage.getItem("mapCity")==null || localStorage.getItem("mapCity")==''){
                //     let confirm = findCity.alertCtrl.create({
                //       title: '切换城市',
                //       message: '定位到当前城市['+result.city+'],是否切换城市?',
                //       enableBackdropDismiss:false,
                //       buttons: [
                //         {
                //           text: '取消',
                //           handler: () => {
                //               localStorage.setItem("mapCity",'');
                //           }
                //         },
                //         {
                //           text: '切换',
                //           handler: () => {
                //               findCity.selectVal(result.city,'');
                //               localStorage.setItem("mapCity",result.city);
                //               console.log("mapCity为空,保存了本次定位"+result.city);
                //               localStorage.setItem("isSendLocation",'true');
                //           }
                //         }
                //       ]
                //     });
                //     confirm.present();
                //
                // }else{
                //     if(localStorage.getItem("mapCity") != result.city){
                //         let confirm = findCity.alertCtrl.create({
                //           title: '切换城市',
                //           message: '定位到当前城市['+result.city+'],是否切换城市?',
                //           enableBackdropDismiss:false,
                //           buttons: [
                //             {
                //               text: '取消',
                //               handler: () => {
                //               }
                //             },
                //             {
                //               text: '切换',
                //               handler: () => {
                //                   findCity.selectVal(result.city,'');
                //                   localStorage.setItem("mapCity",result.city);
                //                   localStorage.setItem("isSendLocation",'true');
                //               }
                //             }
                //           ]
                //         });
                //         confirm.present();
                //     }
                // }

            });
        });


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
            findCity.amap.addControl(geolocation);
            // console.log("进来了吗")
            geolocation.getCurrentPosition(function(status,result){//定位完成之后获取经纬度
                if(status == 'complete'){
                    sessionStorage.setItem("mylng",result.position.lng);
                    sessionStorage.setItem("mylat",result.position.lat);
                }else{
                    findCity.showConfirm();
                }
                // console.log(JSON.stringify(status));
                if(localStorage.getItem("mapCity")==null || localStorage.getItem("mapCity")==''){
                    let confirm = findCity.alertCtrl.create({
                      title: '切换城市',
                      message: '定位到当前城市['+result.addressComponent.city+'],是否切换城市?',
                      enableBackdropDismiss:false,
                      buttons: [
                        {
                          text: '取消',
                          handler: () => {
                              localStorage.setItem("mapCity",'');
                          }
                        },
                        {
                          text: '切换',
                          handler: () => {
                              findCity.selectVal(result.addressComponent.city,'');
                              localStorage.setItem("mapCity",result.addressComponent.city);
                              console.log("mapCity为空,保存了本次定位"+result.addressComponent.city);
                              localStorage.setItem("isSendLocation",'true');
                          }
                        }
                      ]
                    });
                    confirm.present();

                }else{
                    if(localStorage.getItem("mapCity") != result.addressComponent.city){
                        let confirm = findCity.alertCtrl.create({
                          title: '切换城市',
                          message: '定位到当前城市['+result.addressComponent.city+'],是否切换城市?',
                          enableBackdropDismiss:false,
                          buttons: [
                            {
                              text: '取消',
                              handler: () => {
                              }
                            },
                            {
                              text: '切换',
                              handler: () => {
                                  findCity.selectVal(result.addressComponent.city,'');
                                  localStorage.setItem("mapCity",result.addressComponent.city);
                                  localStorage.setItem("isSendLocation",'true');
                              }
                            }
                          ]
                        });
                        confirm.present();
                    }
                }
                console.log("精准定位-------result "+JSON.stringify(result));
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

    //显示区/县
    showCountry(){
        this.countys = this.area.findAreaLisByPid(this.city);
        if(this.showCounties){
            this.showCounties = false;
        }else{
            this.showCounties = true;
        }
        if(this.countys.length == 0){
          this.countys = this.area.findAreaLisByPid(this.area.findAreaListByAreaName(this.cityName));
          console.log(this.countys);
        }
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    selectProvi(){
        this.citys = this.area.findCityLisByPid(this.province);
    }

    selectCity(){
        this.countys = this.area.findAreaLisByPid(this.city);
    }

    selectVal(val,cn){
        sessionStorage.setItem("cityName",val);
        if(cn=='isSendLocation'){
            localStorage.setItem("isSendLocation",'true');
            localStorage.setItem("mapCity",val);
        }else{
            localStorage.setItem("isSendLocation",'');
        }
        sessionStorage.setItem("tcity",cn);
        this.goToBackPage();
    }
}
