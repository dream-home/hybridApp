import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { ReceivablesPage } from '../receivables/receivables';

@Component({
  selector: 'page-setAmount',
  templateUrl: 'setAmount.html'
})
export class SetAmountPage {

    discountEP;//EP优惠比例
    businessSendEp;//赠送EP比例
    firstReferrerScale;//一级分销比例
    secondReferrerScale;//二级分销比例
    thirdReferrerScale;//三级分销比例
    storeUserId:string = "";
    sum:number;

    payAmount;

    constructor(public navCtrl: NavController,public commonService: CommonService) {
    }
    /*页面事件*/
    ionViewWillEnter(){
        this.getByUserId();
    }

    /*面对面扫码-获取付款分销*/
    getByUserId(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/payDistribution/getByUserId',
            data:{
                type:1,
                userid:this.commonService.user.id
            }
        }).then(data=>{
            if(data.code=='200'){
                if(data.result != null){
                    this.discountEP = data.result.discountEP;
                    this.businessSendEp = data.result.businessSendEp;
                    this.firstReferrerScale = data.result.firstReferrerScale;
                    this.secondReferrerScale = data.result.secondReferrerScale;
                    this.thirdReferrerScale = data.result.thirdReferrerScale;
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*生成面对面收款二维码*/
    getQrcode(){
        if(!this.validator()){
            return;
        }
        this.navCtrl.push(ReceivablesPage,{
            discountEP:this.discountEP,
            businessSendEp:this.businessSendEp,
            firstReferrerScale:this.firstReferrerScale,
            payAmount:this.payAmount,
            secondReferrerScale:this.secondReferrerScale,
            storeUserId:this.commonService.user.id,
            thirdReferrerScale:this.thirdReferrerScale
        });
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*数据验证*/
    validator(){
        if(this.payAmount==null || this.payAmount=='' || parseFloat(this.payAmount)<=0){
            this.commonService.toast("请输入要收款的金额");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.payAmount)){
            this.commonService.toast("收款金额只能输入数字（如有小数只保留2位）");
            return false;
        }
        if(parseFloat(this.payAmount)>=100000){
            this.commonService.toast("最大收款金额不能超过100000");
            return false;
        }

        if(this.discountEP==null || this.businessSendEp==null || this.firstReferrerScale==null || this.secondReferrerScale==null || this.thirdReferrerScale==null){
            this.commonService.toast("比例输入有误，比例不能为空");
            return false;
        }
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
            this.commonService.toast("一级分销不能大于100或小于0");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.firstReferrerScale+'')){
            this.commonService.toast("一级分销比例输入有误(小数点只保留两位)");
            return false;
        }

        if(this.secondReferrerScale<0 || this.secondReferrerScale>100){
            this.commonService.toast("二级分销不能大于100或小于0");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.secondReferrerScale+'')){
            this.commonService.toast("二级分销比例输入有误(小数点只保留两位)");
            return false;
        }

        if(this.thirdReferrerScale<0 || this.thirdReferrerScale>100){
            this.commonService.toast("三级分销不能大于100或小于0");
            return false;
        }
        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.thirdReferrerScale+'')){
            this.commonService.toast("三级分销比例输入有误(小数点只保留两位)");
            return false;
        }

        let tnum:number = this.firstReferrerScale*1+this.secondReferrerScale*1+this.thirdReferrerScale*1;
        if(tnum>100){
            this.commonService.toast("分销比例总和已超过收款金额");
            return false;
        }else if(tnum == 100){
            this.commonService.toast("分销比例总和须小于100");
            return false;
        }

        if((this.discountEP*0.01*this.payAmount)*1<=0.01 && (this.discountEP*0.01*this.payAmount)*1>0){
            this.commonService.toast("EP优惠后金额不能小于0.01");
            return false;
        }
        if((this.businessSendEp*0.01*this.payAmount)*1<=0.01 && (this.businessSendEp*0.01*this.payAmount)*1>0){
            this.commonService.toast("赠送EP后金额不能小于0.01");
            return false;
        }
        if((this.firstReferrerScale*0.01*this.payAmount)*1<=0.01 && (this.firstReferrerScale*0.01*this.payAmount)*1>0){
            this.commonService.toast("一级分销后金额不能小于0.01");
            return false;
        }
        if((this.secondReferrerScale*0.01*this.payAmount)*1<=0.01 && (this.secondReferrerScale*0.01*this.payAmount)*1>0){
            this.commonService.toast("二级分销后金额不能小于0.01");
            return false;
        }
        if((this.thirdReferrerScale*0.01*this.payAmount)*1<=0.01 && (this.thirdReferrerScale*0.01*this.payAmount)*1>0){
            this.commonService.toast("三级分销后金额不能小于0.01");
            return false;
        }

        return true;
    }
}
