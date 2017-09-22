import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { LuckyInfoPage } from '../luckyInfo/luckyInfo';
import { MyGoodsPage } from '../myGoods/myGoods';

@Component({
    selector: 'page-beatInfo',
    templateUrl: 'beatInfo.html'
})
export class BeatInfoPage {

    datas;
    beatId;
    beatOrderNo;
    beatType:number = 2;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {
        this.beatId = navParams.get("beatId");
        this.beatOrderNo = navParams.get("beatOrderNo");
        this.loadData();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*加载我的消费记录*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/message/detail/orderNo',
            data:{
                id:this.beatId,
                orderNo:this.beatOrderNo,
                type:this.beatType
            }
        }).then(data=>{
            if(data.code==200){
                this.datas = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*跳转显示幸运排行详情*/
    showLukyInfoPage(){
        this.navCtrl.push(LuckyInfoPage,{issueId:this.datas.issueId});
    }

    openMyGoodsPage(){
        this.navCtrl.push(MyGoodsPage);
    }

}
