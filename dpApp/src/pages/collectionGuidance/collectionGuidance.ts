import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'page-collectionGuidance',
    templateUrl: 'collectionGuidance.html'
})
export class CollectionGuidancePage {

    constructor(
        private navCtrl: NavController,
        private commonService: CommonService,
        public navParams: NavParams
    ){

    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
}
