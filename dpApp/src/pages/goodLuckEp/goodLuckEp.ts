import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController ,NavParams} from 'ionic-angular';
import { GoodsInfoPage } from '../goodsInfo/goodsInfo';
import { SellerPayPage } from '../sellerPay/sellerPay';
import { LoginPage } from '../login/login';
import { BuyGoodsPage } from '../buyGoods/buyGoods';
import { SellerGoodsInfoPage } from '../sellerGoodsInfo/sellerGoodsInfo';
@Component({
  selector: 'page-goodLuckEp',
  templateUrl: 'goodLuckEp.html'
})
export class GoodLuckEpPage{
    buttons:any;
    baseUrl;
    datas;
    pageSize:number = 12;
    id:string = '10001';
    name:string = "共享e家";
    timeSort=1;
    priceSort=0;
    pageNo:number;
    showScroll:boolean=true;
    myEP:number;
    constructor(public navCtrl: NavController, private commonService: CommonService,public params: NavParams) {
        this.baseUrl = commonService.baseUrl;
		this.id = this.params.get("goodsId");
        this.name =this.params.get("name");
        if(this.id =='10001'){
        	this.loadEPData();
        }else{
        	this.loadData();
        }
    }

    /*页面事件*/
    ionViewWillEnter(){
        this.pageNo = 1;
        /**加载消息**/
        if(this.commonService.token != null && this.commonService.token!= ''){
            this.commonService.loadMsgCount();
            /*签到*/
            this.commonService.signedIn();
        }
        /**加载参数**/
        this.commonService.loadParam();
        this.commonService.httpLoad({
                    url:this.commonService.baseUrl+'/user/score',
                    data:{
                    }
                }).then(data=>{
                    if(data.code=='200'){
                         this.myEP = data.result.exchangeEP;
                    }
                });


    }


   	goToBackPage(){
        this.navCtrl.pop();
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
                pageSize:this.pageSize,
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


    /*条件显示不同商品*/
    showGoods(id){
        this.id = id;
        this.pageNo = 1;
        if(id=='10001'){//积分兑换
            this.loadEPData();
        }else{

        }
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
            if(goodsInfo.stock<1){
                this.commonService.alert("系统提示","商品库存不足");
            }else{
                this.navCtrl.push(BuyGoodsPage,{goodsInfo:JSON.stringify(goodsInfo),type:'1001',orderNo:'',num:num});
            }
        }
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
    // 分页
    doInfinite(infiniteScroll) {
        this.pageNo++;

        //if(this.id != null){
            if(this.id == '10001'){//积分兑换
                this.commonService.httpLoad({
                    url:this.commonService.baseUrl+'/mall/goods/eplist',
                    data:{
                        /*goodsSortId:this.id,*/
                        pageNo:this.pageNo,
                        pageSize:this.pageSize,
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

}
