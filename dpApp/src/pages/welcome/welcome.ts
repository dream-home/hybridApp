import { Component,ViewChild } from '@angular/core';
import { NavController, NavParams,Slides } from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { TabsPage } from '../tabs/tabs';
import { Storage } from '@ionic/storage';
/*
  Generated class for the Welcome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {
  @ViewChild(Slides) slides: Slides;
  images:any = [];
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public storage: Storage,
              public commonService: CommonService) {
            console.log("进入欢迎页面!! ");
            this.loadBannerImg();
  }
  /*页面事件*/
  ionViewWillEnter(){
  }

  slideChanged() {
    let currentIndex = this.slides.getActiveIndex();
    if(this.slides.isEnd() && currentIndex == this.slides.length()){
        this.storage.set(localStorage.getItem("welcomevalue"), true);
        this.navCtrl.setRoot(TabsPage);
    }
  }


  /*获取轮播图*/
  loadBannerImg(){
      this.commonService.httpLoad({
          url:this.commonService.baseUrl+'/home/guide',
          data:{
              type:'1',
              version:this.commonService.appVer
          }
      }).then(data=>{
          if(data.code=='200'){
              this.images = data.result.list;
              if(this.images.length==0){
                  this.navCtrl.setRoot(TabsPage);
              }
              localStorage.setItem("welcomevalue",data.result.key);
          }else{
              this.commonService.alert("系统提示",data.msg);
              this.navCtrl.setRoot(TabsPage);
          }
      });
  }
}
