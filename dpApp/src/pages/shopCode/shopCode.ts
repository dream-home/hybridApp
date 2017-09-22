import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { CodeCollectionBillPage } from '../codeCollectionBill/codeCollectionBill';
import { CodeManagementPage } from '../codeManagement/codeManagement';
import { ScoreExchangePage } from '../scoreExchange/scoreExchange';CollectionGuidancePage
import { CollectionGuidancePage } from '../collectionGuidance/collectionGuidance';
import { MarketingGuidancePage } from '../marketingGuidance/marketingGuidance';

@Component({
    selector: 'page-shopCode',
    templateUrl: 'shopCode.html'
})
export class ShopCodePage {

      icon:any;
      shopData:any;
      storeName:string;
      storeProvince:string;
      storeCity:string;
      storeCountry:string;
      storeAddr:string;
      amountSum:any;
      public score: number =0;
      public ep: number =0;
    constructor(
        private navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {

    }

    /*页面事件*/
    ionViewWillEnter(){
          this.icon = this.navParams.get("icon");
          this.storeName = this.navParams.get("storeName");
          this.storeProvince = this.navParams.get("storeProvince");
          this.storeCity = this.navParams.get("storeCity");
          this.storeCountry = this.navParams.get("storeCountry");
          this.storeAddr = this.navParams.get("storeAddr");
          this.loadPersonScore();
          this.loadAmountSum();

          if(this.commonService.user.storeId=='' || this.commonService.user.storeId==null || this.commonService.token=='' || this.commonService.token==null){
              this.goToBackPage();
          }
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
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    loadAmountSum(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/wallet/query/statistics',
            data:{
                status:3
            }
        }).then(data=>{
            if(data.code==200){
                this.amountSum = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*跳转到二维码收款账单*/
    gotoCollectionBillPage(){
        this.navCtrl.push(CodeCollectionBillPage);
    }

    /*跳转到二维码管理页面*/
    gotoCodeManagementPage(){
        this.navCtrl.push(CodeManagementPage,{
            icon:this.icon,
            storeName:this.storeName,
            storeProvince:this.storeProvince,
            storeCity:this.storeCity,
            storeCountry:this.storeCountry,
            storeAddr:this.storeAddr
        });
    }

    /*跳转到余额提现页面*/
    gotoExchang(){
        sessionStorage.setItem("score",this.score+"");
        this.navCtrl.push(ScoreExchangePage);
    }

    /*跳转到收款码使用指导页面*/
    collectionGuidancePage(){
        this.navCtrl.push(CollectionGuidancePage);
    }

    /*跳转到营销分成设置指导页面*/
    marketingGuidancePage(){
        this.navCtrl.push(MarketingGuidancePage);
    }
}
