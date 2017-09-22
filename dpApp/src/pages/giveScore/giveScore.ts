import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'page-giveScore',
    templateUrl: 'giveScore.html'
})
export class GiveScorePage {
    isShowPayPw:boolean = false;
    totalScore:string;
    score:string;
    donateTo:string;
    payPwd:string;
    uid:string;
    name:string;
    isDisable:boolean=false;
    title:string = '赠送余额';
    intotype:string='';
    constructor(private navCtrl: NavController,
        private navParams: NavParams,
        private commonService: CommonService) {
        if(navParams.get('intotype')!=null && navParams.get('intotype')!=''){
            this.intotype = navParams.get('intotype');
            if(this.intotype=='myEP'){
                this.title ='赠送EP';
            }
        }
        this.uid = sessionStorage.getItem("uid");
        this.donateTo = this.uid;
        if(this.donateTo != null && this.donateTo!=''){
            this.showName();
        }
        this.loadScore();
    }

    /*返回上一页*/
    goToBackPage(){
        if(this.isShowPayPw){
            this.isShowPayPw = false;
        }else{
            this.navCtrl.pop();
        }
    }

    loadScore(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/score',
            data:{}
        }).then(data=>{
            if(data.code==200){
                if(this.intotype == 'myEP'){
                    this.totalScore = data.result!=null?data.result.exchangeEP:0;
                }else{
                    this.totalScore = data.result!=null?data.result.score:0;
                }

            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    showName(){
        if(this.donateTo != null && this.donateTo !=''){
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+'/wallet/donate/userinfo',
                data:{
                    donateTo:this.donateTo
                }
            }).then(data=>{
                if(data.code==200){
                    this.name = data.result!=null ? data.result.nickName:'';
                    this.name = data.result!=null && data.result.userName != null?data.result.userName:this.name;
                }else{
                    this.name='';
                }
            });
        }
    }

    /*确认赠送*/
    submitData(){
        if(this.validator()){
            this.isShowPayPw = true;
        }
    }

    /*确认支付*/
    submitPay(){
        this.isDisable = true;
        var postdata;
        var tourl = '/wallet/donate';
        if(this.intotype=='myEP'){
            tourl = '/wallet/donateEP'
            postdata = {
                donateTo:this.donateTo,
                payPwd:this.payPwd,
                ep:this.score
            };
        }else{
            postdata = {
                donateTo:this.donateTo,
                payPwd:this.payPwd,
                score:this.score
            };
        }
        this.commonService.httpPost({
            url:this.commonService.baseUrl+tourl,
            data:postdata
        }).then(data=>{
            if(data.code==200){
                if(this.intotype=='myEP'){
                    this.commonService.toast("赠送EP成功");
                }else{
                    this.commonService.toast("赠送余额成功");
                }
                this.goToBackPage();
                this.goToBackPage();

            }else{
                this.isDisable = false;
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    //取消按钮
    cancel(){
        this.payPwd = '';
        this.isShowPayPw = false;
    }

    /*验证*/
    validator(){
        if(!(/^[0-9]{3,20}$/.test(this.donateTo)) || this.name==null ||this.name ==''){
            this.commonService.toast("对方账户输入有误，请重填");
            return false;
        }
        if(!(/^[0-9]*[1-9][0-9]*$/).test(this.score)){
            if(this.intotype=='myEP'){
                this.commonService.toast("赠送EP必须是正整数");
            }else{
                this.commonService.toast("赠送余额必须是正整数");
            }
            return false;
        }
        if(!(/^[0-9]{1,30}$/.test(this.score))){
            if(this.intotype=='myEP'){
                this.commonService.toast("赠送EP输入有误，请重填");
            }else{
                this.commonService.toast("赠送余额输入有误，请重填");
            }
            return false;
        }
        if(Number(this.score) == 0){
            if(this.intotype=='myEP'){
                this.commonService.toast("赠送EP必须大于0");
            }else{
                this.commonService.toast("赠送余额必须大于0");
            }
            return false;
        }
        if(Number(this.score)%100!=0){
            this.commonService.toast("赠送的数量只允许输入100的倍数");
            return false;
        }
        if(this.intotype=='myEP'){
            if(parseFloat(this.score)<this.commonService.params.donateEpMin*1 || parseFloat(this.score)>this.commonService.params.donateEpMax*1){
                this.commonService.toast("赠送EP范围只能在"+this.commonService.params.donateEpMin+"~"+this.commonService.params.donateEpMax);
                return false;
            }
            if(parseFloat(this.score)>parseFloat(this.totalScore)){
                this.commonService.toast("EP不足，请充值或重新填写");
                return false;
            }
        }else{
            if(parseFloat(this.score)<this.commonService.params.donateMin*1 || parseFloat(this.score)>this.commonService.params.donateMax*1){
                this.commonService.toast("赠送余额范围只能在"+this.commonService.params.donateMin+"~"+this.commonService.params.donateMax);
                return false;
            }
            if(parseFloat(this.score)>parseFloat(this.totalScore)){
                this.commonService.toast("余额不足，请充值或重新填写");
                return false;
            }
        }

        return true;
    }


}
