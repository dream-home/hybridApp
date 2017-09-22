import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { ScoreInfoPage } from '../scoreInfo/scoreInfo';

@Component({
    selector: 'page-scoreRecord',
    templateUrl: 'scoreRecord.html'
})
export class ScoreRecordPage {

    constructor(public navCtrl: NavController, private commonService: CommonService ) {
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    viewRecord(typeNum){
        this.navCtrl.push(ScoreInfoPage,{typeNum:typeNum});
    }

}
