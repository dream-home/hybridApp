import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-userAgreement',
    templateUrl: 'userAgreement.html'
})
export class UserAgreementPage {

    data:any;
    constructor(public navCtrl: NavController, private commonService: CommonService ) {
        this.loadData();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/agreement/about',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.data = data.result!=null?data.result.userAgreement:null;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

}
