import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { AttendanceRecordPage } from '../attendanceRecord/attendanceRecord';

@Component({
    selector: 'page-myDouDou',
    templateUrl: 'myDouDou.html'
})
export class MyDouDouPage {
    /**通用积分*/
    public score: number =0;
    public ep: number =0;
    public doudou: number;
    items:any;
    doudouOb:any;

    pageNo:number;
    showScroll:boolean=true;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService
    ) {
        this.pageNo = 1;
        this.loadList();
    }
    /*页面事件*/
    ionViewWillEnter(){
        this.loadPersonScore();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*个人积分信息*/
    loadPersonScore(){
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/user/score',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.score = data.result.score;
                this.ep = data.result.exchangeEP;
                this.doudou = data.result.doudou;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    //我的斗斗列表
    loadList(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+"/sign/doudousignlist",
            data:{
                pageNo: this.pageNo,
                pageSize: this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.doudouOb = data.result;
                this.items = data.result!=null?data.result.rows:null;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    doudouSignIn(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+"/sign/doudouSignIn",
            data:{
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.alert("签到成功","获得"+data.result.signDouNum+"余额");
                this.loadPersonScore();
                this.pageNo = 1;
                this.loadList();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+"/sign/doudousignlist",
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

    /*跳转到签到记录页面*/
    gotoAttendanceRecord(){
        this.navCtrl.push(AttendanceRecordPage);
    }
}
