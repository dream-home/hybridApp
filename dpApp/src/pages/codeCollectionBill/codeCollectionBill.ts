import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { CollectionBillInfoPage } from '../collectionBillInfo/collectionBillInfo';

@Component({
    selector: 'page-codeCollectionBill',
    templateUrl: 'codeCollectionBill.html'
})
export class CodeCollectionBillPage {


    pageNo:number;
    showScroll:boolean;
    items:any;
    constructor(
        private navCtrl: NavController,
        private commonService: CommonService,
        public navParams: NavParams
    ) {
        this.loadData();
    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/wallet/query/codetopaytab',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                status:3
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result!=null?data.result.rows:[];
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*跳转到收款账单详情页面*/
    gotoBillInfoPage(orderNo){
        this.navCtrl.push(CollectionBillInfoPage,{orderNo:orderNo});
    }

    doRefresh(refresher){
        this.pageNo = 1;
        this.showScroll = true;
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/wallet/query/codetopaytab',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                status:3
            }
        }).then(data=>{
            refresher.complete();
            if(data.code==200){
                this.items = data.result.rows;
            }else{

            }
        },err=>{
            refresher.complete();
        });
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+'/wallet/query/codetopaytab',
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.commonService.pageSize,
                    status:3
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
                    // this.commonService.alert("系统提示",data.msg);
                }
            });
        }, 500);
    }
}
