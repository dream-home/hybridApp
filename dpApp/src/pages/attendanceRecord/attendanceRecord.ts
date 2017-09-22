import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';

@Component({
    selector: 'page-attendanceRecord',
    templateUrl: 'attendanceRecord.html'
})
export class AttendanceRecordPage {
    pageNo:number;
    showScroll:boolean=true;
    items:any;
    itemLength:number;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService
    ) {
        this.pageNo = 1;
        this.loadList();
    }
    //我的斗斗列表
    loadList(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+"/sign/commonsignlist",
            data:{
                pageNo: this.pageNo,
                pageSize: this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result!=null?data.result.rows:null;
                this.itemLength = this.items.length;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+"/sign/commonsignlist",
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

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
}
