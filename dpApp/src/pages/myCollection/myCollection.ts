import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { SellerShopPage } from '../sellerShop/sellerShop';

@Component({
    selector: 'page-myCollection',
    templateUrl: 'myCollection.html'
})
export class MyCollectionPage {

    items: any;
    showScroll: boolean;
    pageNo: number;
    constructor(public navCtrl: NavController, private commonService: CommonService) {
        this.pageNo = 1;
        this.showScroll = true;
    }
    ionViewWillEnter(){
         this.pageNo =1;
        this.showScroll = true;
        this.loadData();
    }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/store/collect/page',
            data:{
                pageNo:1,
                pageSize:10
            }
        }).then(data=>{
            if(data.code==200){
                this.items =data.result.rows;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*进入店铺*/
    gotoShop(id){
        let inviteCode = sessionStorage.getItem(id);
        this.navCtrl.push(SellerShopPage,{id:id,inviteCode:inviteCode});
    }

    remove(id,ev){
        ev.stopPropagation();
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/store/collect/cancel',
            data:{
                storeId:id
            }
        }).then(data=>{
            if(data.code==200){
                let toast = this.commonService.toast("取消收藏成功");
                toast.onDidDismiss(() => {
                    this.loadData();
                });
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url: this.commonService.baseUrl +'/store/collect/page',
                data: {
                    pageNo: this.pageNo,
                    pageSize: this.commonService.pageSize
                }
            }).then(data => {
                infiniteScroll.complete();
                if (data.code == 200) {
                    let tdata = data.result.rows;
                    this.showScroll = (eval(tdata).length == this.commonService.pageSize);
                    for (var o in tdata) {
                        this.items.push(tdata[o]);
                    }
                } else {
                    this.commonService.alert("系统提示", data.msg);
                }
            });
        }, 500);
    }

}
