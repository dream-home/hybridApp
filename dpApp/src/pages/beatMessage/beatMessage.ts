import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { BeatInfoPage } from '../beatInfo/beatInfo';

@Component({
    selector: 'page-beatMessage',
    templateUrl: 'beatMessage.html'
})
export class BeatMessagePage {

    items:any;
    pageNo:number;
    type:number = 2;
    showScroll:boolean=true;
    constructor(public navCtrl: NavController,private commonService: CommonService) {
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
            url:this.commonService.baseUrl+'/message/page',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                type:this.type
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result.rows;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*跳转显示中拍记录详情*/
    showBeatInfoPage(beatId,beatOrderNo){
        this.navCtrl.push(BeatInfoPage,{beatId:beatId,beatOrderNo:beatOrderNo});
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+'/message/page',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.commonService.pageSize,
                    type:this.type
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
        }, 500);
    }

}
