import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController ,NavParams} from 'ionic-angular';

@Component({
    selector: 'page-sellerShopInfo',
    templateUrl: 'sellerShopInfo.html'
})
export class SellerShopInfoPage {

    id:string;
    shopData:any;
    icons:any;
    inviteCode:string;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
     ) {
        this.id = navParams.get("id");
        this.inviteCode = sessionStorage.getItem(this.id);
        this.loadData();
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/store/info',
            data:{
                storeId:this.id,
                inviteCode:this.inviteCode
            }
        }).then(data=>{
            if(data.code==200){
                this.shopData = data.result;
                this.icons = data.result.icons;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

}
