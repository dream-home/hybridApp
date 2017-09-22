import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { SystemInfoPage } from '../systemInfo/systemInfo';

@Component({
    selector: 'page-systemMessage',
    templateUrl: 'systemMessage.html'
})
export class SystemMessagePage {

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

    /*加载我的消费记录*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/message/page?type=0&type=4&type=5&type=6&type=7&type=9',
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

    /*跳转显示系统消息详情*/
    showSystemInfoPage(systemId){
        sessionStorage.setItem("systemId",systemId);
        this.navCtrl.push(SystemInfoPage);
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+'/message/page?type=0&type=4&type=5&type=6&type=7&type=9',
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
