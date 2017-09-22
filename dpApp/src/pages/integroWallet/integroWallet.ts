import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
// import { GiveScorePage } from '../giveScore/giveScore';
// import { ScoreExchangePage } from '../scoreExchange/scoreExchange';
// import { RechargePage } from '../recharge/recharge';
import { ScoreRecordPage } from '../scoreRecord/scoreRecord';
import { MyScorePage } from '../myScore/myScore';
import { MyEPPage } from '../myEP/myEP';
import { MyDouDouPage } from '../myDouDou/myDouDou';

@Component({
    selector: 'page-integroWallet',
    templateUrl: 'integroWallet.html'
})
export class IntegroWalletPage {
    /**通用积分*/
    public score: number =0;
    public ep: number =0;
    public doudou: number =0;
    recordData:any;
    items:any;
    pageNo:number;
    showScroll:boolean=true;
    constructor(public navCtrl: NavController,private commonService: CommonService) {
        this.pageNo = 1;
    }
    /*页面事件*/
    ionViewWillEnter(){
        this.loadPersonScore();
        this.loadList();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //获取流水
    loadList(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+"/wallet/record?recordType=0&recordType=1&recordType=2&recordType=3&recordType=4&recordType=5&recordType=6&recordType=7&recordType=8&recordType=9&recordType=10&recordType=11&recordType=13&recordType=19&recordType=20&recordType=22&recordType=23&recordType=24&recordType=26&recordType=27",
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
                url:this.commonService.baseUrl+"/wallet/record?recordType=0&recordType=1&recordType=2&recordType=3&recordType=4&recordType=5&recordType=6&recordType=7&recordType=8&recordType=9&recordType=10&recordType=11&recordType=13&recordType=19&recordType=20&recordType=22&recordType=23&recordType=24&recordType=26&recordType=27",
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
                // this.loadIntegroRecord();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    //跳转到账单记录页面
    gotoScoreRecordPage(){
        this.navCtrl.push(ScoreRecordPage);
    }

    //跳转到我的余额页面
    gotoMyScorePage(){
        this.navCtrl.push(MyScorePage);
    }

    /*跳转到我的EP页面*/
    gotoMyEPPage(){
        this.navCtrl.push(MyEPPage);
    }

    /*跳转到我的斗斗页面*/
    gotoMyDouDouPage(){
        this.navCtrl.push(MyDouDouPage);
    }
}
