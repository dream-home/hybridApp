import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
@Component({
    selector: 'page-updateMessage',
    templateUrl: 'updateMessage.html'
})
export class UpdateMessagePage {
    osType;
    datas;
    isupdate:boolean=false;
    constructor(public navCtrl: NavController,private commonService: CommonService,public plt: Platform) {
        if (this.plt.is('ios')) {
            // This will only print when on iOS
            this.osType=1;
        }else{
            this.osType=0;
        }
        this.loadData();
    }

    /*页面事件*/
    ionViewWillEnter(){
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*获取版本更新*/
    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/system/update',
            data:{
                osType:this.osType
            }
        }).then(data=>{
            if(data.code==200){
                this.datas = data.result;
                if(this.osType==0){//android
                    if(this.commonService.appVer!=data.result.androidAppVersion&&data.result.isAndroidPopup=='1'){
                        this.isupdate = true;
                    }
                }else if(this.osType==1){//ios
                    if(this.commonService.appVer!=data.result.iosAppVersion&&data.result.isIOSPopup=='1'){
                        this.isupdate = true;
                    }
                }
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
}
