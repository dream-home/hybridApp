import { Component } from '@angular/core';

import { NavController,NavParams } from 'ionic-angular';

@Component({
    selector: 'page-shopCondition',
    templateUrl: 'shopCondition.html'
})
export class ShopConditionPage {

    score:number;
    constructor(public navCtrl: NavController,private navParams: NavParams) {
        this.score = navParams.get("createStoreCondition");
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

}
