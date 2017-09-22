import { Component } from '@angular/core';
import { NavController ,ModalController} from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { LoginPage } from '../login/login';
import { ConsumingMessagePage } from '../consumingMessage/consumingMessage';
import { BeatMessagePage } from '../beatMessage/beatMessage';
import { SystemMessagePage } from '../systemMessage/systemMessage';
import { MyRedopenPage } from '../myRedopen/myRedopen';
import { FeedBackPage } from '../feedBack/feedBack';
import { BaiduMapPage } from '../baiduMap/baiduMap';
import { WedebugPage } from '../wedebug/wedebug';
@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {

  datas;
  constructor(public navCtrl: NavController,private commonService: CommonService,
  public modalCtrl: ModalController) {

  }

  /*页面事件*/
  ionViewWillEnter(){
      if(this.commonService.token != null && this.commonService.token!= ''){
          this.loadMsgCount();
          /*签到*/
          this.commonService.signedIn();
          // if((localStorage.getItem(this.commonService.getTodayDate()+this.commonService.user.id)==null || localStorage.getItem(this.commonService.getTodayDate()+this.commonService.user.id)=="false")&&this.commonService.showOpenRed){
              //加载是否显示红包
              this.loadRedInfo();
          // }
      }else{
          this.datas=null;
      }
      /**加载参数**/
      this.commonService.loadParam();
  }

  //加载签到红包信息
  loadRedInfo(){
      this.commonService.httpGet({
          url:this.commonService.baseUrl+'/sign/getSignInInfo',
          data:{}
      }).then(data=>{
          if(data.code=='200'){
                this.commonService.showOpenRed = false;
                if(data.result.isSignInByPartner==false){
                    if(data.result.isSignInByDoudou==true){
                        localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"false");
                        let profileModal = this.modalCtrl.create(MyRedopenPage, {isSignInByDoudou: data.result.isSignInByDoudou,isSignInByPartner:data.result.isSignInByPartner});
                        profileModal.present();
                    }else{
                        localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"true");
                    }
                }else{
                   localStorage.setItem(this.commonService.getTodayDate()+this.commonService.user.id,"false");
                   let profileModal = this.modalCtrl.create(MyRedopenPage, {isSignInByDoudou: data.result.isSignInByDoudou,isSignInByPartner:data.result.isSignInByPartner});
                   profileModal.present();
                }
          }else{
              this.commonService.alert("系统提示",data.msg);
          }
      });
  }
  loadMsgCount(){
      this.commonService.httpLoad({
          url:this.commonService.baseUrl+'/message/unread',
          data:{}
      }).then(data=>{
          if(data.code=='200'){
              this.datas = data.result;
              this.commonService.count = data.result.expense + data.result.system ;//+ data.result.win
          }else{
              this.commonService.alert("系统提示",data.msg);
          }
      });
  }

  /*登录页面*/
  goToLoginPage(){
      this.navCtrl.push(LoginPage);
  }

  doRefresh(refresher){
    if(this.commonService.token != null && this.commonService.token!= ''){
        setTimeout(() => {
            this.loadMsgCount();
            refresher.complete();
        }, 2000);
    }else{
        refresher.complete();
    }
  }

  /*消费记录页面*/
  gotoConsumingPage(){
      if(this.commonService.token==null){
          this.goToLoginPage();
      }else{
          this.navCtrl.push(ConsumingMessagePage);
      }
  }

  /*中拍记录*/
  gotoBeatPage(){
      if(this.commonService.token==null){
          this.goToLoginPage();
      }else{
          this.navCtrl.push(BeatMessagePage);
      }
  }

  /*系统信息*/
  gotoSystemPage(){
      if(this.commonService.token==null){
          this.goToLoginPage();
      }else{
          this.navCtrl.push(SystemMessagePage);
      }
  }

  //跳转到意见反馈页面
  gotoFeedBackPage(){
      if(this.commonService.token==null){
          this.goToLoginPage();
      }else{
          this.navCtrl.push(FeedBackPage);
      }
  }
  gotoBaiduMap(){
      this.navCtrl.push(BaiduMapPage);
  }
  /*测试地址修改页面*/
  gotoWedebug(){
      this.navCtrl.push(WedebugPage);
  }

}
