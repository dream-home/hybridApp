import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { LuckyInfoPage } from '../luckyInfo/luckyInfo';

@Component({
    selector: 'page-myAuction',
    templateUrl: 'myAuction.html'
})
export class MyAuctionPage {

    items:any;
    pageNo:number;
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

    /*加载我的斗拍*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/draw/page',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result!=null?data.result.rows:null;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*跳转显示幸运排行详情*/
    showLukyInfoPage(id){
        this.navCtrl.push(LuckyInfoPage,{issueId:id});
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+'/user/draw/page',
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
        }, 500);
    }


}
