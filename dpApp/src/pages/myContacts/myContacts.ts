import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { GiveScorePage } from '../giveScore/giveScore';

@Component({
    selector: 'page-myContacts',
    templateUrl: 'myContacts.html'
})
export class MyContactsPage {

    info:any;
    items:any;
    pageNo:number;
    showScroll:boolean=true;
    totalSize:number=0;
    constructor(public navCtrl: NavController, private commonService: CommonService) {
        this.pageNo = 1;
        this.loadInfo();
    }

    loadInfo(){
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/user/contacts/count',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.info = data.result;
                this.loadLis();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    loadLis(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/contacts',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result!=null?data.result.rows:null;
                this.totalSize = data.result!=null?data.result.totalSize:0;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    giveScore(uid){
        sessionStorage.setItem("uid",uid);
        this.navCtrl.push(GiveScorePage);
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/user/contacts',
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
