import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams,AlertController } from 'ionic-angular';
import { NewAddressPage } from '../newAddress/newAddress';
import { EditAddressPage } from '../editAddress/editAddress';

@Component({
    selector: 'page-deliveryAddress',
    templateUrl: 'deliveryAddress.html',
})
export class DeliveryAddressPage {

    fromId:number;
    userAddress:any;
    defaultAddress:boolean=false;//默认地址
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        public alertCtrl: AlertController,
        private navParams: NavParams
    ) {

        this.fromId = this.navParams.get("fromId");
    }

    ionViewWillEnter(){
        this.loadAddress();
    }

    //获取收货地址
    loadAddress(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/address/getUserAddress',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.userAddress = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    //删除收货地址
    removeAddress(ev,id){
        ev.stopPropagation();
        let confirm = this.alertCtrl.create({
          title: '系统提示',
          message: '确定要删除该地址吗？',
          enableBackdropDismiss:false,
          buttons: [
            {
              text: '确认',
              handler: () => {
                this.commonService.httpPost({
                    url:this.commonService.baseUrl+'/address/delUserAddress',
                    data:{
                        id:id
                    }
                }).then(data=>{
                    if(data.code==200){
                        this.loadAddress();
                        this.commonService.toast("删除收货地址成功");
                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
              }
            },
            {
              text: '取消',
              handler: () => {

              }
            }
          ]
        });
        confirm.present();


    }

    //默认收货地址
    addDefault(addrId){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/address/setDefaultAddress',
            data:{
                id:addrId
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.toast("设置默认收货地址成功");
                this.loadAddress();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    //修改收货地址
    editAddress(ev,itms){
        ev.stopPropagation();
        if(this.fromId == 1){
            sessionStorage.setItem("BuyGoodsPage_MyUserAddr",JSON.stringify(itms));
            this.goToBackPage();
        }else{
            this.navCtrl.push(EditAddressPage,{addressData:itms});
        }

    }
    //修改收货地址
    gotoeditAddress(ev,itms){
        ev.stopPropagation();
        this.navCtrl.push(EditAddressPage,{addressData:itms});
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    gotoAddAddress(){
        this.navCtrl.push(NewAddressPage);
    }
}
