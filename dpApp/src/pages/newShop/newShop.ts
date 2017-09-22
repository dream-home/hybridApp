import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavController, ActionSheetController } from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { Area } from '../../app/app.data';
import { MobileSettingPage } from '../mobileSetting/mobileSetting';
import { ShopAgreementPage } from '../shopAgreement/shopAgreement';
import { UploadAptitudePage } from '../uploadAptitude/uploadAptitude';
import { BaiduMapPage } from '../baiduMap/baiduMap';


@Component({
    selector: 'page-newShop',
    templateUrl: 'newShop.html',
    providers:[Area]
})
export class NewShopPage {

    imgStr: string = "assets/images/shopDefault.png";
    shopData={
        storeName:'',
        detail:'',
        addr:'',
        province:'',
        city:'',
        county:'',
        icons:[],
        icon:'',
        idcardIcons:[],
        licenseIcons:[],
        servicePhone:'',
        provinceCode:'',
        countyCode:'',
        cityCode:'',
        latitude:'',
        longitude:'',
        bucket:'',
        businessScope:'',
        delIcons:[],
        phone:'',
    };
    provinces:any[];
    citys:any[];
    countys:any[];
    province:string='110000';
    city:string;
    county:string;
    accept:boolean=true;
    isDisable:boolean=false;

    /*验证身份证*/
    isChoProject:any[];
    mapaddr:any;//地图定位返回信息
    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private commonService: CommonService,
        public area:Area
    ) {
        this.provinces = area.areaColumns[0].options
        this.selectProvi({text:'北京'});
        this.shopData.servicePhone  =    commonService.user.phone;
        this.shopData.phone = commonService.user.phone;
        this.shopData.bucket = commonService.namespaceStore;
        this.getUserInfo();
    }

    ionViewWillEnter(){
        var mapaddr1 = sessionStorage.getItem('mapaddr');
        if(mapaddr1!=null&&mapaddr1!=''){
            console.log("地图返回的信息是： "+ mapaddr1);
            this.mapaddr = JSON.parse(mapaddr1);
            this.shopData.province = this.mapaddr.province;
            this.shopData.city = this.mapaddr.city;
            this.shopData.county = this.mapaddr.county;
            //根据省市区 获取 相对应的code
            this.shopData.provinceCode = this.area.findValueByProvince(this.mapaddr.province);
            // this.shopData.cityCode = this.area.findIdByCity(this.mapaddr.city);
            // this.shopData.countyCode = this.area.findIdByArea(this.mapaddr.county);
            this.shopData.cityCode = this.area.findCityCodeByCitys(this.area.findCityLisByPid(this.shopData.provinceCode),this.mapaddr.city);
            this.shopData.countyCode = this.area.findCityCodeByCitys(this.area.findAreaLisByPid(this.shopData.cityCode),this.mapaddr.county);
            console.log("procode"+this.shopData.provinceCode+"citycode" +this.shopData.cityCode+"countycode"+this.shopData.countyCode)
        }
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
        sessionStorage.removeItem("mapaddr");
    }

    /*绑定手机号*/
    bindMobile(){
        this.navCtrl.push(MobileSettingPage);
    }

    uploadImg(){
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '手机拍照',
                handler: () => {
                    this.takePicture(Camera.PictureSourceType.CAMERA);
                }
            },{
                text: '相册选择图片',
                handler: () => {
                    this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
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

    takePicture(sourceType){
        var options = {
            quality: 85,
            sourceType: sourceType,
            destinationType: 0,
            allowEdit: true,
            targetWidth: 720,
            targetHeight: 720,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        Camera.getPicture(options).then((imageData) => {
            if(imageData.length>410000){
                this.commonService.toast('选择图片太大');
            }else{
                let imagetem = 'data:image/jpeg;base64,' + imageData;
                var imglist=[];
                imglist.push(imagetem);
                this.commonService.httpPost({
                      url:this.commonService.baseUrl+'/common/uploadFileWithBase64',
                      data:{
                          bucket:this.commonService.namespaceStore,
                          icons:imglist
                      }
                  }).then(data=>{
                      if(data.code==200){
                          var values=data.result;
                          for(var key in values){
                              for(var k in values[key]){
                                  this.imgStr = values[key][k];
                              }
                          }
                            /*alert(JSON.stringify(this.GoodDetails));*/
                      }else{
                          this.commonService.alert("系统提示",data.msg);
                      }
                  });


            }
        }, (err) => {
        });
    }

    // loadCode(){
    //     this.commonService.httpGet({
    //         url:this.commonService.baseUrl+'/user/store/inviteCode',
    //         data:{}
    //     }).then(data=>{
    //         if(data.code==200){
    //             this.shopData.inviteCode = data.result;
    //         }else{
    //             this.commonService.alert("系统提示",data.msg);
    //         }
    //     });
    // }

    /*提交数据*/
    submitData(){
      // this.imgStr = 'http://oq6gv60qr.bkt.clouddn.com/FiSXeVdfgqOduYJFKzvYMKfPG6ll';
        if(this.validator()){
            this.shopData.icons = [{
                path:this.imgStr

            }];
            this.shopData.icon = this.imgStr;
            this.shopData.idcardIcons = JSON.parse(sessionStorage.getItem("images")).icons;
            this.shopData.licenseIcons =  JSON.parse(sessionStorage.getItem("images")).licenseIcons;
            this.shopData.latitude = this.mapaddr.latitude;
            this.shopData.longitude = this.mapaddr.longitude;
            this.isDisable = true;
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/store/newapply',
                data:this.shopData
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("创建店铺申请成功,等待审核");
                    sessionStorage.removeItem("images");
                    sessionStorage.removeItem("icons");
                    sessionStorage.removeItem("licenseIcons");
                    sessionStorage.removeItem("idcardicons");
                    this.goToBackPage();

                }else{
                    this.isDisable = false;
                    this.commonService.alert("系统提示",data.msg);
                }

            });
        }

    }

    /*验证数据*/
    validator(){
      // alert(this.shopData.provinceCode+"---"+this.shopData.cityCode+"---"+this.shopData.countyCode);
          if(this.imgStr.length<50){
              this.commonService.toast('商铺图片不能为空');
              return false;
          }

          if(this.shopData.storeName==''){
              this.commonService.toast('商铺名称不能为空');
              return false;
          }

          if(this.shopData.province == null || this.shopData.province == ''){
              this.commonService.toast('省份不能为空');
              return false;
          }

          if(this.shopData.city == null || this.shopData.city == ''){
              this.commonService.toast('城市不能为空');
              return false;
          }

          if(this.shopData.county == null || this.shopData.county == ''){
              this.commonService.toast('区域不能为空');
              return false;
          }

          if(this.shopData.addr==''){
              this.commonService.toast('商铺地址不能为空');
              return false;
          }

          // if(this.shopData.inviteCode!=null && this.shopData.inviteCode.length>0 && this.shopData.inviteCode.length!=6){
          //     this.commonService.toast('邀请码长度必须为6');
          //     return false;
          // }

          if(this.shopData.detail==''){
              this.commonService.toast('商铺介绍不能为空');
              return false;
          }
          if(this.shopData.detail.length<30){
              this.commonService.toast('商铺介绍不能少于30个字');
              return false;
          }

          if(this.shopData.servicePhone==""){
              this.commonService.toast('客服电话不能为空');
              return false;
          }

          if(/^\d{1,20}$/.test(this.shopData.servicePhone)){
      		}else{
      			this.commonService.toast('客服电话格式有误, 请输入数字号码');
      			return false;
      		}

        this.isChoProject = JSON.parse(sessionStorage.getItem("idcardicons"));
       // console.log("idcardicons-----  "+sessionStorage.getItem("idcardicons"));
        if(this.isChoProject == null){
            this.commonService.toast('请上传资质照片');
            return false;
        }else{
            if(this.isChoProject[0]==0 || this.isChoProject[1]==0 || this.isChoProject[2]==0){
                  this.commonService.toast('请上传资质照片');
                  return false;
            }
        }
        if(this.mapaddr==null || this.mapaddr == ''){
            this.commonService.toast('请设置店铺定位');
            return false;
        }
        return true;
    }

    selectProvi(itm){
        this.citys = this.area.findCityLisByPid(this.province);
        this.city = this.citys[0].value;
        this.selectCity({text:this.citys[0].text});
        this.shopData.province = itm.text;
        this.shopData.provinceCode = this.province;
    }

    selectCity(itm){
        this.countys = this.area.findAreaLisByPid(this.city);
        this.county = this.countys[0].value;
        this.selectCounty({text:this.countys[0].text});
        this.shopData.city = itm.text;
        this.shopData.cityCode = this.city;
    }

    selectCounty(itm){
        this.shopData.county = itm.text;
        this.shopData.countyCode = this.county;
    }

    showAgreement(){
        this.navCtrl.push(ShopAgreementPage);
    }

    uploadAptitude(){
    	this.navCtrl.push(UploadAptitudePage);
    }

    gotoBaiduMap(){
        this.navCtrl.push(BaiduMapPage);
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
