import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams, ActionSheetController } from 'ionic-angular';
import { Area } from '../../app/app.data';

@Component({
    selector: 'page-newAddress',
    templateUrl: 'newAddress.html',
    providers:[Area]
})
export class NewAddressPage {
    addressData:any = {
        receiveName:'',
        receivePhone:'',
        addr:'',
        province:'',
        city: '',
        county: ''
    };
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

    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private commonService: CommonService,
        public area:Area,
        private navParams: NavParams
    ) {
        this.provinces = area.areaColumns[0].options;
        console.log(this.provinces[0].text);
        this.selectProvi(this.province);
        this.selectCity(this.city);
        this.addressData.city = this.citys[0].text;
        this.addressData.province = this.provinces[0].text;
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
            this.addressData.receiveName=this.addressName;
            this.addressData.receivePhone=this.addressPhone;
            this.addressData.addr=this.addressInfo;
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/address/addUserAddress',
                data:this.addressData
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("新增收货地址成功");
                    this.navCtrl.pop();
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

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
}
