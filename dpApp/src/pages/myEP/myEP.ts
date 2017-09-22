import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController } from 'ionic-angular';
import { GoodLuckEpPage } from '../goodLuckEp/goodLuckEp';
import { GiveScorePage } from '../giveScore/giveScore';
import { SellerShopPage } from '../sellerShop/sellerShop';
@Component({
    selector: 'page-myEP',
    templateUrl: 'myEP.html'
})
export class MyEPPage {
    /**通用积分*/
    public score: number =0;
    public ep: number =0;
    public doudou: number =0;
    items:any;
    exchangData:any;
    pageNo:number;
    showScroll:boolean=true;
    epNumber:number;
    payPwd:string='';
    isShowPayPw:boolean = false;
    isShow:boolean = false;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService
    ) {

    }
    /*页面事件*/
    ionViewWillEnter(){
        this.loadPersonScore();
        this.pageNo = 1;
        this.loadList();
    }

    //遮挡层点击事件
    backdropclick(e){
        //判断点击的是否为遮罩层，是的话隐藏遮罩层
        if(e.srcElement.className != 'itemClass'){
            this.isShow = false;
        }
        //隐藏滚动条
        this.hiddenscroll();
        e.stopPropagation();
    }

    //弹出下拉框时，取消scroll
    hiddenscroll(){
        //获取当前组件的ID
        let aboutContent = document.querySelector("#aboutContent");
        //获取当前组件下的scroll-content元素
        let scroll:any = aboutContent.querySelector(".scroll-content");
        if(this.isShow){
            scroll.style.overflow='hidden';
        }else {
            scroll.style.overflow='';
        }
    }

    /*返回上一页*/
    goToBackPage(){
        if(this.isShowPayPw){
            this.isShowPayPw = false;
            this.payPwd='';
        }else{
            this.navCtrl.pop();
            this.payPwd='';
        }
    }

    /*个人积分信息*/
    loadPersonScore(){
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/user/score',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.score = data.result.score;
                this.ep = data.result.exchangeEP;
                this.doudou = data.result.doudou;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    //获取流水
    loadList(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+"/eptrade/list?recordType=1&recordType=3&recordType=4&recordType=5&recordType=8&recordType=9&recordType=11&recordType=13&recordType=16&recordType=17&recordType=20",
            data:{
                pageNo: this.pageNo,
                pageSize: this.commonService.pageSize,
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result!=null?data.result.rows:null;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+"/eptrade/list?recordType=1&recordType=3&recordType=4&recordType=5&recordType=8&recordType=9&recordType=11&recordType=13&recordType=16&recordType=20",
                data:{
                    pageNo:this.pageNo,
                    pageSize:this.commonService.pageSize
                }
            }).then(data=>{
                infiniteScroll.complete();
                if(data.code==200){
                    let tdata = data.result.rows;
                    this.showScroll =(eval(tdata).length==this.commonService.pageSize);
                    for(var o in tdata){
                        this.items.push(tdata[o]);
                    }
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }, 500);
    }


    /*跳转到共享E家页面*/
    gotoGoodLuckEpPage(){
        // this.navCtrl.push(GoodLuckEpPage,{"goodsId":"10001","name":"共享e家"});
        this.navCtrl.push(SellerShopPage,{id:this.commonService.shareEhome});
    }

    //兑换斗斗弹窗弹窗
    exchangeDouDou(){
        this.isShow = true;
        this.epNumber = null;
    }

    //关闭窗口
    close(){
        this.isShow = false;
    }

    //限制输入位数
    limit(){
        if(this.epNumber.toString().length>=5){
            this.epNumber=Number(this.epNumber.toString().slice(0,5));
        }
    }

    //提交兑换斗斗
    submitExchang(){
        if(!this.validator()){
            return;
        }else if(!this.isShowPayPw){
            this.close();
            this.isShowPayPw = true;
        }else{
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/sign/epexchange',
                data:{
                    ep:this.epNumber,
                    payPwd:this.payPwd
                }
            }).then(data=>{
                if(data.code==200){
                    this.exchangData = data.result;
                    this.ep = this.exchangData.exchangeEP;
                    this.goToBackPage();
                    this.payPwd='';
                    this.pageNo = 1;
                    this.loadList();
                    this.loadPersonScore();
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }
    }

    validator(){
        if(this.epNumber==null || this.epNumber==0 || this.epNumber<0){
            this.commonService.toast("EP数量不能为空或小于0");
            return false;
        }
        if(!(/^[0-9]*[1-9][0-9]*$/.test((this.epNumber/100).toString()))){
            this.commonService.toast("EP数量只能是100的整数倍");
            return false;
        }
        if(this.epNumber*1 < this.commonService.params.minEPConvertNum*1){
            this.commonService.toast("单次EP兑换斗斗不能小于"+this.commonService.params.minEPConvertNum+"个");
            return false;
        }
        if(this.epNumber*1 > this.ep*1){
            this.commonService.toast("EP数量不足");
            return false;
        }
        if(this.epNumber*1 > this.commonService.params.maxEPConvertNum*1){
            this.commonService.toast("单次EP兑换斗斗不能大于"+this.commonService.params.maxEPConvertNum+"个");
            return false;
        }
        return true;
    }

    /*赠送积分页面*/
    gotoGiveScorePage(){
        sessionStorage.setItem("uid",'');
        this.navCtrl.push(GiveScorePage,{intotype:'myEP'});
    }
}
