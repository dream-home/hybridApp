import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { Storage } from '@ionic/storage';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
    rootPage:any;
    welcomevalue:string;
    constructor(platform: Platform, public storage: Storage) {
           this.welcomevalue= localStorage.getItem("welcomevalue");
           this.storage.get(this.welcomevalue).then((result) => {
              if(result){
                this.rootPage = TabsPage;
              }
              else{
                this.rootPage = WelcomePage;
              }
            }
          );
          platform.ready().then(() => {
              // Okay, so the platform is ready and our plugins are available.
              // Here you can do any higher level native things you might need.
              StatusBar.styleDefault();
              Splashscreen.hide();
          });
          // platform.registerBackButtonAction(() => {
          //
          //     return AppMinimize.minimize();//程序最小化
          // }, 1);
    }
  //   initializeApp() {
  //       this.platform.ready().then(() => {
  //         StatusBar.styleDefault();
  //         Splashscreen.hide();
  //         //注册返回按键事件
  //         this.platform.registerBackButtonAction((): any => {
  //           alert("进到监听");
  //           let activeVC = this.nav.getActive();
  //           let page = activeVC.instance;
  //           if (!(page instanceof TabsPage)) {
  //             if (!this.nav.canGoBack()) {
  //                 alert("进到监听1111");
  //               //当前页面为tabs，退出APP
  //               return this.showExit();
  //             }
  //             //当前页面为tabs的子页面，正常返回
  //             return this.nav.pop();
  //           }
  //           let tabs = page.home;
  //           let activeNav = tabs.getSelected();
  //           if (!activeNav.canGoBack()) {
  //               alert("进到监听2222");
  //             //当前页面为tab栏，退出APP
  //             return this.showExit();
  //           }
  //           //当前页面为tab栏的子页面，正常返回
  //           return activeNav.pop();
  //         }, 101);
  //       });
  // }
  // //双击退出提示框，这里使用Ionic2的ToastController
  // showExit() {
  //       if (this.backButtonPressed) this.platform.exitApp();  //当触发标志为true时，即2秒内双击返回按键则退出APP
  //       else {
  //         let toast = this.toastCtrl.create({
  //           message: '再按一次退出应用',
  //           duration: 2000,
  //           position: 'bottom'
  //         });
  //         toast.present();
  //         this.backButtonPressed = true;
  //         //2秒内没有再次点击返回则将触发标志标记为false
  //         setTimeout(() => {
  //           this.backButtonPressed = false;
  //         }, 2000)
  //       }
  // }
}
