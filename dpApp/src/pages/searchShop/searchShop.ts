import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { SellerShopPage } from '../sellerShop/sellerShop';
import { Device } from 'ionic-native';
@Component({
    selector: 'page-searchShop',
    templateUrl: 'searchShop.html'
})
export class SearchShopPage {

    items: any;
    searchWord:string="";
    areaName:string;
    show:string  = "1";
    flag:number;
    deviceUUID:string = "";//设备的唯一id
    latitude:string = '';//纬度
    longitude:string = '';//经度
    isSendLocation:boolean = false;//是否发送经纬度
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams
    ) {

    }

    /*页面事件*/
    ionViewWillEnter(){
        if(localStorage.getItem('isSendLocation')!=null&&localStorage.getItem('isSendLocation')!=''){
            this.isSendLocation = true;
        }else{
            this.isSendLocation = false;
        }
        this.deviceUUID = JSON.stringify(Device.uuid);
        console.log('Device UUID is: ' + JSON.stringify(Device.uuid));
        this.latitude = sessionStorage.getItem("mylat");
        this.longitude = sessionStorage.getItem("mylng");
        this.areaName = this.navParams.get("areaName");
        if("全国" == this.areaName){
            this.areaName = "";
        }
        this.searchWord = this.navParams.get("shopName");
        if(this.searchWord!=null && this.searchWord!=''){
            this.search();
        }
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    addCollection(id,ev){
        ev.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/store/collect/add',
                data:{
                    storeId:id
                }
            }).then(data=>{
                if(data.code==200){
                    let toast = this.commonService.toast("店铺收藏成功");
                    toast.onDidDismiss(() => {
                        //this.navCtrl.push(MyCollectionPage);
                    });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    search(){
        let word=this.searchWord.trim();
        if(word!=""){
            this.commonService.httpGet({
                url:this.commonService.baseUrl+'/mall/store/search',
                data:{
                    searchWord:this.searchWord.trim(),
                    address:this.areaName,
                    latitude:this.isSendLocation?this.latitude:"",
                    longitude:this.isSendLocation?this.longitude:"",
                    serialNumber:this.deviceUUID
                }
            }).then(data=>{
                if(data.code==200){
                    this.items = data.result;
                    this.flag=data.result.length;
                    this.show = "0";
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }else{
            this.commonService.alert("系统提示","请输入搜索的店铺名");
        }

    }

    /*进入店铺*/
    gotoShop(id){
        let inviteCode = sessionStorage.getItem(id);
        this.navCtrl.push(SellerShopPage,{id:id,inviteCode:inviteCode});
    }

}
