import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams, ActionSheetController } from 'ionic-angular';
import { Area } from '../../app/app.data';

@Component({
    selector: 'page-editAddress',
    templateUrl: 'editAddress.html',
    providers:[Area]
})
export class EditAddressPage {

    subData: any;
    userImg: any;
    provinces:any[];
    citys:any[];
    countys:any[];
    province:string="110000";
    city:string="110100";
    county:string="110101";
    addressName:string;
    addressPhone:string;
    addressInfo:string;
    addressData={
        receiveName:'',
        receivePhone:'',
        addr:'',
        province: '',
        city: '',
        county: '',
        id:'',
        isDefault:''
    };
    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private commonService: CommonService,
        public area:Area,
        private navParams: NavParams
    ) {

        this.addressData = navParams.get("addressData");
        var edprovince = this.addressData.province;
        var edcity = this.addressData.city;
        var edcounty = this.addressData.county;

        this.addressName = this.addressData.receiveName;
        this.addressPhone = this.addressData.receivePhone;
        this.addressInfo = this.addressData.addr;
        var procoede = area.findIdByProvince(edprovince);
        var ctiycode = area.findIdByCity(edcity);
        var Cuncode = area.findIdByArea(edcounty);
        this.province = procoede;
        this.provinces = area.areaColumns[0].options;
        this.selectProvi(procoede);
        this.city = ctiycode;
        this.selectCity(ctiycode);
        this.county = Cuncode;

        this.addressData.city = edcity;
        this.addressData.province = edprovince;
        this.addressData.county = edcounty;
        console.log(this.addressData.province+this.addressData.city+this.addressData.county);
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    selectProvi(itm){
        this.citys = this.area.findCityLisByPid(this.province);
        this.city = this.citys[0].value;
        this.selectCity({text:this.citys[0].text});
        this.addressData.province=itm.text;
    }

    selectCity(itm){
        this.countys = this.area.findAreaLisByPid(this.city);
        this.county = this.countys[0].value;
        this.selectCounty({text:this.countys[0].text});
        this.addressData.city=itm.text;
    }

    selectCounty(itm){
        this.addressData.county=itm.text;
    }

    //保存收货地址
    saveAddress(){
        if(this.validator()){
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/address/updUserAddress',
                data:{
                    addr:this.addressInfo,
                    city:this.addressData.city,
                    county:this.addressData.county,
                    id:this.addressData.id,
                    province:this.addressData.province,
                    receiveName:this.addressName,
                    receivePhone:this.addressPhone
                }
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("修改收货地址成功");
                    this.navCtrl.pop();
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    //默认收货地址
    addDefault(addrId){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/address/setDefaultAddress',
            data:{
                id:addrId
            }
        }).then(data=>{
            if(data.code==200){

            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    //验证
    validator(){
      if(this.addressName == null || this.addressName == ''){
          this.commonService.toast("收货人姓名不能为空");
          return false;
      }
      if(this.addressName.length < 2){
          this.commonService.toast("收货人姓名最少为2个字");
          return false;
      }
      if(!(/^[a-zA-Z0-9 \u4e00-\u9fa5]+$/).test(this.addressName) || (/^[ ]*$/).test(this.addressName)){
          this.commonService.toast("收货人姓名输入有误，请重填");
          return false;
      }
      if(this.addressPhone == null || this.addressPhone == ''){
          this.commonService.toast("收货人电话不能为空");
          return false;
      }
      if(this.addressPhone.length < 7){
          this.commonService.toast("收货人电话最少7位数");
          return false;
      }
      if(!(/^1[34578]\d{9}$/).test(this.addressPhone) && this.addressPhone.length > 7){
          this.commonService.toast("收货人电话有误，请重填");
          return false;
      }
      if(this.isEmojiCharacter(this.addressInfo)){
          this.commonService.toast("详情地址必须是字符");
          return false;
      }
      if(this.addressInfo == null || this.addressInfo == ''){
          this.commonService.toast("详细地址不能为空");
          return false;
      }
      if((/^\d+$/).test(this.addressInfo) || this.addressInfo.length < 5 || this.addressInfo.length > 20){
          this.commonService.toast("详细地址长度为5-15个字，且不能全为数字");
          return false;
      }
      return true;
    }

    isEmojiCharacter(substring) {
        for ( var i = 0; i < substring.length; i++) {
            var hs = substring.charCodeAt(i);
            if (0xd800 <= hs && hs <= 0xdbff) {
                if (substring.length > 1) {
                    var ls = substring.charCodeAt(i + 1);
                    var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
                    if (0x1d000 <= uc && uc <= 0x1f77f) {
                        return true;
                    }
                }
            } else if (substring.length > 1) {
                var ls = substring.charCodeAt(i + 1);
                if (ls == 0x20e3) {
                    return true;
                }
            } else {
                if (0x2100 <= hs && hs <= 0x27ff) {
                    return true;
                } else if (0x2B05 <= hs && hs <= 0x2b07) {
                    return true;
                } else if (0x2934 <= hs && hs <= 0x2935) {
                    return true;
                } else if (0x3297 <= hs && hs <= 0x3299) {
                    return true;
                } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                        || hs == 0x2b50) {
                    return true;
                }
            }
        }
        return false;
    }
}
