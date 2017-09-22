import { Component} from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
declare var AMap; //declare var AMap: any;
declare var AMapUI;
var baiduMap: any;
@Component({
  selector: 'page-baiduMap',
  templateUrl: 'baiduMap.html'
})
export class BaiduMapPage {
  map:any;
  mapposition:any ={
      latitude:'',
      longitude:'',
      addr:'',
      positionaddr:'',
      province:'',
      city:'',
      county:''
  };
  constructor(public navCtrl: NavController,
     public navParams: NavParams,
     public alertCtrl: AlertController,) {
      baiduMap = this;

      // Geolocation.getCurrentPosition().then((resp) => {
      //  // resp.coords.latitude
      //  // resp.coords.longitude
      //  console.log("插件获取定位"+JSON.stringify(resp));
      // }).catch((error) => {
      //   console.log('Error getting location', error);
      // });

      
  }
  ionViewDidLoad() {
    console.log('Loading Amap');
    this.loadMap();
    this.loadToolBar();
  }

  loadToolBar(){
    AMap.plugin('AMap.ToolBar',function(){//异步
      var toolbar = new AMap.ToolBar();
      baiduMap.map.plugin(toolbar);
    });
  }
  latitude:string = '116.397703';
  longitude:string = '39.917642';
  loadMap() {
    let lat = sessionStorage.getItem("mylat");
    if(lat!=''&&lat!=null){
        this.latitude = lat;
    }
    let lng = sessionStorage.getItem("mylng");
    if(lng!=''&&lng!=null){
        this.longitude = lng;
    }

    sessionStorage.getItem("mylng");
    this.map = new AMap.Map('container', {
      resizeEnable: true,
      //mapStyle:'normal',  地图类型: normal  dark  blue_night  fresh  light
      zoom: 14,
      center: [baiduMap.latitude,baiduMap.longitude] //[116.39,39.9] center: [116.397428, 39.90923]
    });
    this.map.plugin('AMap.Geolocation', function () {
      var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,//是否使用高精度定位，默认:true
            timeout: 10000,          //超过10秒后停止定位，默认：无穷大
            maximumAge: 0,           //定位结果缓存0毫秒，默认：0
            convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
            showButton: true,        //显示定位按钮，默认：true
            buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
            buttonOffset: new AMap.Pixel(10, 10),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
            showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
            panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
            zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        });
        baiduMap.map.addControl(geolocation);
        // console.log("进来了吗")
        geolocation.getCurrentPosition(function(status,result){//定位完成之后获取经纬度
            if(status == 'complete'){
                // baiduMap.mapMarker();
            }else{
                baiduMap.showConfirm();
            }
            // console.log(JSON.stringify(status));
            console.log("精准定位-------result "+JSON.stringify(result)+" status "+status);
        });
    });

    this.map.plugin('AMap.CitySearch', function () {
        var citySearch = new AMap.CitySearch();
        citySearch.getLocalCity(function(status,result){
          console.log("根据IP定位城市")
          // console.log(JSON.stringify(status));
          // console.log("-------result "+JSON.stringify(result));
        });
    });
    this.mapMarker();

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
                this.goToBackPage();
            }
          }
        ]
      });
      confirm.present();
  }
  mapMarker(){
      //加载PositionPicker，loadUI的路径参数为模块名中 'ui/' 之后的部分
      AMapUI.loadUI(['misc/PositionPicker'], function(PositionPicker) {

          var positionPicker = new PositionPicker({
              mode:'dragMap',//设定为拖拽地图模式，可选'dragMap'、'dragMarker'，默认为'dragMap'
              map:baiduMap.map//依赖地图对象
          });
          console.log("选地址进来了")
          positionPicker.setMode('dragMap');
          //TODO:事件绑定、结果处理等
          positionPicker.on('success', function(positionResult) {
              console.log("正常选址成功后返回地址 "+JSON.stringify(positionResult));
              baiduMap.mapposition.latitude = positionResult.position.lat;
              baiduMap.mapposition.longitude = positionResult.position.lng;
              baiduMap.mapposition.addr = positionResult.address;
              baiduMap.mapposition.positionaddr = positionResult.nearestPOI;
              if(positionResult.regeocode.addressComponent!=null && positionResult.regeocode.addressComponent!=''){
                  baiduMap.mapposition.province = positionResult.regeocode.addressComponent.province;
                  baiduMap.mapposition.city = positionResult.regeocode.addressComponent.city;
                  baiduMap.mapposition.county = positionResult.regeocode.addressComponent.district;
                  if(positionResult.regeocode.addressComponent.province == '北京市'){
                      baiduMap.mapposition.province ='北京';
                      baiduMap.mapposition.city = '北京市';
                  }
                  if(positionResult.regeocode.addressComponent.province == '天津市'){
                      baiduMap.mapposition.province ='天津';
                      baiduMap.mapposition.city = '天津市';
                  }
                  if(positionResult.regeocode.addressComponent.province == '上海市'){
                      baiduMap.mapposition.province ='上海';
                      baiduMap.mapposition.city = '上海市';
                  }
                  if(positionResult.regeocode.addressComponent.province == '重庆市'){
                      baiduMap.mapposition.province ='重庆';
                      baiduMap.mapposition.city = '重庆市';
                  }

              }
          });
          positionPicker.on('fail', function(positionResult) {
              // console.log("异常选址成功后返回地址 "+JSON.stringify(positionResult));
          });
          positionPicker.start();
          baiduMap.map.panBy(0, 1);

          baiduMap.map.addControl(new AMap.ToolBar({
              liteStyle: true
          }))
      });
  }
  confirmAddr(){
      console.log("地址选择成功！！！ "+JSON.stringify(this.mapposition))
      sessionStorage.setItem('mapaddr',JSON.stringify(this.mapposition));
      this.navCtrl.pop();
  }

  /*返回上一页*/
  goToBackPage(){
      this.navCtrl.pop();
  }

}
