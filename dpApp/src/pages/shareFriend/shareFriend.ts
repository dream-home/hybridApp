import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,ActionSheetController } from 'ionic-angular';


import { MyContactsPage } from '../myContacts/myContacts';

declare let Wechat:any;
@Component({
    selector: 'page-shareFriend',
    templateUrl: 'shareFriend.html'
})

export class ShareFriendPage {

    info:any;
    groupType:any;
    constructor(public navCtrl: NavController,public actionSheetCtrl: ActionSheetController, private commonService: CommonService ) {
        this.loadData();
        this.changeCode(1);
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    changeCode(idx){
        switch (idx) {
            case 1:
                this.groupType = 'A';break;
            case 2:
                this.groupType = 'B';break;
            case 3:
                this.groupType = 'C';break;
        }
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/share/qrcode',
            data:{
                groupType:this.groupType,
                uid:this.commonService.user.uid
            }
        }).then(data=>{
            if(data.code==200){
                this.info = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    presentPopover(myEvent){
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '分享到微信好友',
                icon: 'create',
                handler: () => {
                  this.shareWecatFriend(this.groupType);
                }
            },{
                text: '分享到朋友圈',
                icon: 'create',
                handler: () => {
                  this.share2Wecat(this.groupType);
                }
            },{
                text: '取消',
                role: 'cancel',
                handler: () => {

                }
            }]
        });
        actionSheet.present();
    }

    shareWecatFriend(gt){
        if(gt==null || gt==''){
            gt='A';
        }
        Wechat.share({
            message: {
                title: this.commonService.params.shareTitle,
                description: this.commonService.params.shareMessage,
                thumb: "www/assets/images/dp.png",
                media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: this.commonService.baseUrl+'/user/share?uid='+this.commonService.user.uid+'&groupType='+gt
            }
        },
            scene: Wechat.Scene.SESSION   // share to Timeline
        }, function () {
            this.commonService.toast("分享成功!");
        }, function (reason) {
            this.commonService.alert("系统提示",reason);
        });
    }

    share2Wecat(gt){
        if(gt==null || gt==''){
            gt='A';
        }
        Wechat.share({
            message: {
                title: "斗拍",
                description: "斗拍好友分享",
                thumb: "www/assets/images/dp.png",
                media: {
                type: Wechat.Type.WEBPAGE,
                webpageUrl: this.commonService.baseUrl+'/user/share?uid='+this.commonService.user.uid+'&groupType='+gt
            }
        },
            scene: Wechat.Scene.TIMELINE   // share to Timeline
        }, function () {
            this.commonService.toast("分享成功!");
        }, function (reason) {
            this.commonService.alert("系统提示",reason);
        });
    }
     /*我的人脉页面*/
        gotoMyContactsPage(){

                this.navCtrl.push(MyContactsPage);

        }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/share/qrcode',
            data:{
                uid:this.commonService.user.uid
            }
        }).then(data=>{
            if(data.code==200){
                this.info = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }



}
