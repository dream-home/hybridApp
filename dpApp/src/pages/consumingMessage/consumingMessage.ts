import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { ConsumingInfoPage } from '../consumingInfo/consumingInfo';
import { SystemInfoPage } from '../systemInfo/systemInfo';

@Component({
    selector: 'page-consumingMessage',
    templateUrl: 'consumingMessage.html'
})
export class ConsumingMessagePage {

    items:any;
    pageNo:number;
    showScroll:boolean=true;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService
    ) {

    }

    /*页面事件*/
    ionViewWillEnter(){
        this.pageNo = 1;
        this.loadData();
        this.showScroll = true;
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*加载我的消费记录*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/message/page?type=1&type=3&type=10&type=11&type=13&type=14&type=16',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result.rows;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*跳转显示消费记录详情*/
    showConsumingPage(id,orderNo,type,score){
        if(type=='11' || type=='13' || type=='14'||type =='1'||type =='16'){
            sessionStorage.setItem("systemId",id);
            this.navCtrl.push(SystemInfoPage);
        }else{
            this.navCtrl.push(ConsumingInfoPage,{id:id,orderNo:orderNo,type:type,score:score});
        }

    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/message/page?type=1&type=3&type=10&type=11&type=13&type=14&type=16',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            infiniteScroll.complete();
            if(data.code==200){
                let tdata = data.result.rows;
                this.showScroll =(eval(tdata).length==this.commonService.pageSize);
                for(var o in tdata){
                    this.items.push(tdata[o]);
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }


}
