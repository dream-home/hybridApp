import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams,ModalController } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { BuyGoodsPage } from '../buyGoods/buyGoods';
import { ViewImgPage } from '../viewImg/viewImg';
import { DomSanitizer } from '@angular/platform-browser/src/security/dom_sanitization_service';
@Component({
  selector: 'page-goodsInfo',
  templateUrl: 'goodsInfo.html'
})
export class GoodsInfoPage {
    goodsInfo={
        icon:'',
        id:'',
        curIssueNo:'',
        isDraw:'',
        name:'',
        detail:'',
        businessSendEp:0
    };
    goodsId:string;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams,
        private sanitizer: DomSanitizer,
        public modalCtrl: ModalController
    ) {
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.goodsId =this.navParams.get("goodsId");
        this.loadGoodsInfo();
    }

    assembleHTML(strHTML:any) {
      return this.sanitizer.bypassSecurityTrustHtml(strHTML);
    }
    goToHomePage(){
        this.navCtrl.pop();
    }
    showImg(path){
        let modal = this.modalCtrl.create(ViewImgPage, {imgStr:path});
        modal.present();
    }

    /*查询商品信息*/
    loadGoodsInfo(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/mall/goods/detail',
            data:{
                goodsId:this.goodsId
            }
        }).then(data=>{
            if(data.code=='200'){
                this.goodsInfo = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*EP兑换*/
    EPbuyGoods(goodsInfo,event,num){
        event.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            if(goodsInfo.stock<1){
                this.commonService.alert("系统提示","商品库存不足");
            }else{
                this.navCtrl.push(BuyGoodsPage,{goodsInfo:JSON.stringify(goodsInfo),type:'1004',orderNo:'',num:num});
            }
        }
    }



}
