import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController ,NavParams,ModalController } from 'ionic-angular';
import { GoodsInfoPage } from '../goodsInfo/goodsInfo';
import { SellerPayPage } from '../sellerPay/sellerPay';
import { LoginPage } from '../login/login';
import { BuyGoodsPage } from '../buyGoods/buyGoods';
import { SellerGoodsInfoPage } from '../sellerGoodsInfo/sellerGoodsInfo';
import { MyRedopenPage } from '../myRedopen/myRedopen';
import { SearchGoodsPage } from '../searchGoods/searchGoods';
@Component({
  selector: 'page-goodLuck',
  templateUrl: 'goodLuck.html'
})
export class GoodLuckPage{
    buttons:any;
    baseUrl;
    datas=[];
    id;
    timeSort=1;
    priceSort=0;
    pageNo:number;
    showScroll:boolean=true;
    goodsName:string='';
    constructor(public navCtrl: NavController, private commonService: CommonService,public params: NavParams,
    public modalCtrl: ModalController) {
        this.baseUrl = commonService.baseUrl;
        this.loadButtons();

    }

    /*页面事件*/
    ionViewWillEnter(){
        /*console.log("Item的数值1"+sessionStorage.getItem("classid"));*/
        this.pageNo = 1;

         /*console.log("Item的数值2"+sessionStorage.getItem("classid"));*/
        /**加载消息**/
        if(this.commonService.token != null && this.commonService.token!= ''){
            this.commonService.loadMsgCount();
            /*签到*/
            this.commonService.signedIn();
            // if((localStorage.getItem(this.commonService.getTodayDate()+this.commonService.user.id)==null || localStorage.getItem(this.commonService.getTodayDate()+this.commonService.user.id)=="false")&&this.commonService.showOpenRed){
                //加载是否显示红包
                this.loadRedInfo();
            // }
        }
        /**加载参数**/
        this.commonService.loadParam();
    }
    //加载签到红包信息
    loadRedInfo(){
        this.commonService.httpGet({
            url:this.baseUrl+'/sign/getSignInInfo',
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

    /*过滤条件*/
    filterData(timeSortTem,priceSortTem){
        this.pageNo = 1;
        if(timeSortTem==1){
            this.priceSort = 0;
            if(this.timeSort==1){
                this.timeSort =2;
            }else if(this.timeSort==2){
                this.timeSort =1;
            }else{
                this.timeSort =1;
            }
        }
        if(priceSortTem==1){
            this.timeSort = 0;
            if(this.priceSort==1){
                this.priceSort =2;
            }else if(this.priceSort==2){
                this.priceSort =1;
            }else{
                this.priceSort =1;
            }
        }
        this.loadData();
    }
    loadData(){
        this.showScroll =true;
        this.commonService.httpGet({
            url:this.baseUrl+'/mall/goods/list',
            data:{
                goodsSortId:this.id,
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
                timeSort:this.timeSort,
                priceSort:this.priceSort

            }
        }).then(data=>{
            if(data.code=='200'){
                this.datas = data.result.rows;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    loadEPData(){
        this.datas = [];
        this.commonService.httpGet({
            url:this.baseUrl+'/mall/goods/eplist',
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize,
            }
        }).then(data=>{
            if(data.code=='200'){
                this.datas = data.result.rows;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    buttonsMap:any = [];
    buttonsMaptem:any = [];
    loadButtons(){
        this.commonService.httpGet({
            url:this.baseUrl+'/mall/goods/sorts',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.buttons = data.result;
                // this.buttons.push({id:'10001',name:'共享e家',icon:'assets/images/epicon.png'});
                //this.id = this.buttons[0].id;

                for(var i=0;i<=this.buttons.length;i++){
                    this.buttonsMaptem.push(this.buttons[i]);
                    if(this.buttonsMaptem.length==10){
                        this.buttonsMap.push(this.buttonsMaptem);
                        this.buttonsMaptem =[];
                    }
                }
                this.buttonsMap.push(this.buttonsMaptem);
                this.loadData();
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }
    /*条件显示不同商品*/
    showGoods(id){
        this.id = id;
        this.pageNo = 1;
        if(id=='10001'){//积分兑换
            this.loadEPData();
        }else{
            this.loadData();
        }
    }
    /*商品详情*/
    gotoGoodsInfo(id,showtype){
        if(showtype=='10001'){
            this.navCtrl.push(GoodsInfoPage,{goodsId:id});
        }else{
            this.navCtrl.push(SellerGoodsInfoPage,{goodsId:id});
        }

    }

    /*斗拍*/
    auction(id,price,event){
        event.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            sessionStorage.setItem("goodsId",id);
            sessionStorage.setItem("integral",price);
            this.navCtrl.push(SellerPayPage);
        }
    }
    /*我要购买*/
    gotobuyGoods(goodsInfo,event,num){
        event.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.navCtrl.push(BuyGoodsPage,{goodsInfo:JSON.stringify(goodsInfo),type:'1001',orderNo:'',num:num});
        }
    }
    /*EP兑换*/
    EPbuyGoods(goodsInfo,event,num){
        event.stopPropagation();
        if(this.commonService.token==null){
            this.navCtrl.push(LoginPage);
        }else{
            this.navCtrl.push(BuyGoodsPage,{goodsInfo:JSON.stringify(goodsInfo),type:'1004',orderNo:'',num:num});
        }
    }
    // 分页
    doInfinite(infiniteScroll) {
        this.pageNo++;
        //if(this.id != null){
            if(this.id=='10001'){//积分兑换
                this.commonService.httpLoad({
                    url:this.commonService.baseUrl+'/mall/goods/eplist',
                    data:{
                        goodsSortId:this.id,
                        pageNo:this.pageNo,
                        pageSize:this.commonService.pageSize,
                        timeSort:this.timeSort,
                        priceSort:this.priceSort
                    }
                }).then(data=>{
                    infiniteScroll.complete();
                    if(data.code==200){
                        let tdata = data.result.rows;
                        this.showScroll =(eval(tdata).length==this.commonService.pageSize);
                        for(var o in tdata){
                            this.datas.push(tdata[o]);
                        }
                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
            }else{
                this.commonService.httpLoad({
                    url:this.commonService.baseUrl+'/mall/goods/list',
                    data:{
                        goodsSortId:this.id,
                        pageNo:this.pageNo,
                        pageSize:this.commonService.pageSize,
                        timeSort:this.timeSort,
                        priceSort:this.priceSort
                    }
                }).then(data=>{
                    infiniteScroll.complete();
                    if(data.code==200){
                        let tdata = data.result.rows;
                        this.showScroll =(eval(tdata).length==this.commonService.pageSize);
                        for(var o in tdata){
                            this.datas.push(tdata[o]);
                        }
                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
            }
        //}



    }
    gotoSearchPage(){
        this.navCtrl.push(SearchGoodsPage,{goodsName:this.goodsName});
    }

}
