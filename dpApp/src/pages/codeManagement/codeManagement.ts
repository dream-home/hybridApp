import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { MyReceivablesCodePage } from '../myReceivablesCode/myReceivablesCode';

@Component({
    selector: 'page-codeManagement',
    templateUrl: 'codeManagement.html'
})
export class CodeManagementPage {

    marketingShow:boolean=false;
    discountEP;
    businessSendEp;
    firstReferrerScale;
    secondReferrerScale;
    thirdReferrerScale;
    icon:any;
    storeName:string;
    storeProvince:string;
    storeCity:string;
    storeCountry:string;
    storeAddr:string;
    type:number=2;
    constructor(
        private navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {
        this.icon = navParams.get("icon");
        this.storeName = navParams.get("storeName");
        this.storeProvince = navParams.get("storeProvince");
        this.storeCity = navParams.get("storeCity");
        this.storeCountry = navParams.get("storeCountry");
        this.storeAddr = navParams.get("storeAddr");
    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*营销设置*/
    marketingSet(){
        this.marketingShow = true;
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/payDistribution/getByUserId',
            data:{
                type:this.type,
                userid:this.commonService.user.id
            }
        }).then(data=>{
            if(data.code=='200'){
                if(data.result != null){
                    this.businessSendEp = data.result.businessSendEp;
                    this.discountEP = data.result.discountEP;
                    this.firstReferrerScale = data.result.firstReferrerScale;
                    this.secondReferrerScale = data.result.secondReferrerScale;
                    this.thirdReferrerScale = data.result.thirdReferrerScale;
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*营销保存*/
    marketingSave(){
        if(!this.validator()){
            return;
        }
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/payDistribution/update',
            data:{
                businessSendEp:this.businessSendEp,
                discountEP:this.discountEP,
                firstReferrerScale:this.firstReferrerScale,
                secondReferrerScale:this.secondReferrerScale,
                thirdReferrerScale:this.thirdReferrerScale,
                type:this.type
            }
        }).then(data=>{
            if(data.code==200){
                this.marketingShow = false;
                this.commonService.toast("保存成功！");
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*跳转到我的收款码页面*/
    gotoMyCodePage(){
        this.navCtrl.push(MyReceivablesCodePage,{
            storeName:this.storeName,
            storeProvince:this.storeProvince,
            storeCity:this.storeCity,
            storeCountry:this.storeCountry,
            storeAddr:this.storeAddr
        });
    }

    /*数据验证*/
    validator(){
        if(this.discountEP<0 || this.discountEP>100){
            this.commonService.toast("EP优惠比例不能大于100或小于0");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.discountEP+'')){
            this.commonService.toast("EP优惠比例输入有误(小数点只保留两位)");
            return false;
        }

        if(this.businessSendEp<0 || this.businessSendEp>100){
            this.commonService.toast("赠送EP不能大于100或小于0");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.businessSendEp+'')){
            this.commonService.toast("赠送EP比例输入有误(小数点只保留两位)");
            return false;
        }

        if(this.firstReferrerScale<0 || this.firstReferrerScale>100){
            this.commonService.toast("一级分销比例不能大于100或小于0");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.firstReferrerScale+'')){
            this.commonService.toast("一级分销比例输入有误(小数点只保留两位)");
            return false;
        }

        if(this.secondReferrerScale<0 || this.secondReferrerScale>100){
            this.commonService.toast("二级分销比例不能大于100或小于0");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.secondReferrerScale+'')){
            this.commonService.toast("二级分销比例输入有误(小数点只保留两位)");
            return false;
        }

        if(this.thirdReferrerScale<0 || this.thirdReferrerScale>100){
            this.commonService.toast("三级分销比例不能大于100或小于0");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.thirdReferrerScale+'')){
            this.commonService.toast("三级分销比例输入有误(小数点只保留两位)");
            return false;
        }

        let tnum:number = this.firstReferrerScale*1+this.secondReferrerScale*1+this.thirdReferrerScale*1;
        if(tnum > 100 || tnum == 100){
            this.commonService.toast("分销比例总和须小于100");
            return false;
        }

        return true;
    }
}
