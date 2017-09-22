import { Component } from '@angular/core';
import { HomePage } from '../home/home';
import { LeaguesPage } from '../leagues/leagues';
import { GoodLuckPage } from '../goodLuck/goodLuck';
import { MessagePage } from '../message/message';
import { FmyPage } from '../fmy/fmy';
import {CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {
    // this tells the tabs component which Pages
    // should be each tab's root Page
    home: any = HomePage;
    leagues: any = LeaguesPage;
    goodLuck: any = GoodLuckPage; 
    message: any = MessagePage;
    fmy: any = FmyPage;

    public tabId: number;
    constructor(
            public navCtrl: NavController,
            private commonService: CommonService,
            public params: NavParams
        ) {

        let val = localStorage.getItem("token");
        if(val!=null && val !=''){
            this.commonService.token = val;
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+'/user/login/getUser',
                data:{}
            }).then(data=>{
                if(data.code==200){
                    this.commonService.user = data.result;
                }else{
                    this.commonService.token = null;
                    localStorage.removeItem("token");
                }
            });
        }
    }



    /*页面事件*/
    ionViewWillEnter(){

    }

}
