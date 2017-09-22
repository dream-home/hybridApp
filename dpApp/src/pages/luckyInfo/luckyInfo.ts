import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'page-luckyInfo',
    templateUrl: 'luckyInfo.html'
})
export class LuckyInfoPage {

    /*商品id*/
    issueId;
    datas;
    isNull:boolean=false;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {
        this.issueId = navParams.get("issueId");
        this.loadData();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*加载我的消费记录*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/draw/detail',
            data:{
                issueId:this.issueId
            }
        }).then(data=>{
            if(data.code==200){
                this.datas = data.result;
                this.isNull = this.datas==null || this.datas.length==0; 
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
}
