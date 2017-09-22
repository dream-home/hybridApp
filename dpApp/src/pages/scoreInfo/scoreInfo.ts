import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'page-scoreInfo',
    templateUrl: 'scoreInfo.html'
})
export class ScoreInfoPage {
    typeNum:any;
    title:string;
    items:any;
    showScroll:boolean=true;
    url:string;
    pageNo:number;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {
        this.pageNo = 1;
        this.typeNum = navParams.get("typeNum");
        switch (this.typeNum) {
            case 0:
                this.url = '/wallet/record?recordType=0';
                this.title = '充值记录';
                break;
            case 1:
                this.url = '/wallet/record?recordType=1&recordType=18';
                this.title = '兑换记录';
                break;
            case 2:
                this.url = '/wallet/record?recordType=2&recordType=4&recordType=8&recordType=9&recordType=12&recordType=13&recordType=21&recordType=25&recordType=27';
                this.title = '获赠记录';
                break;
            case 3:
                this.url = '/wallet/record?recordType=3';
                this.title = '斗拍消费';
                break;
            case 5:
                this.url = '/wallet/record?recordType=5';
                this.title = '委托出售';
                break;
            case 6:
                this.url = '/wallet/record?recordType=6&recordType=11&recordType=20';
                this.title = '购买记录';
                break;
            case 7:
                this.url = '/wallet/record?recordType=7';
                this.title = '退款记录';
                break;
            case 14:
                this.url = '/wallet/record?recordType=14&recordType=18';
                this.title = 'EP兑换记录';
                break;
            case 19:
                this.url = '/wallet/record?recordType=19';
                this.title = '收款账单';
                break;
            case -1:
                this.url = '/wallet/record';
                this.title = '流水记录';
                break;
            default:
                this.title = '';
        }
        this.loadLis();
    }

    loadLis(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+this.url,
            data:{
                pageNo: this.pageNo,
                pageSize: this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result!=null?data.result.rows:null;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+this.url,
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

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
}
