import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
import { SellerOrderInfoPage } from '../sellerOrderInfo/sellerOrderInfo';
import { OrderInfoPage } from '../orderInfo/orderInfo';

@Component({
    selector: 'page-businessOrder',
    templateUrl: 'businessOrder.html'
})
export class BusinessOrderPage {

    order:string;
    items:any;
    showScroll:boolean;
    idx:number;
    url:string;
    pageNo:number;
    Pending_num:number;
    constructor(public navCtrl: NavController, private commonService: CommonService,public navParams: NavParams ) {
       /* if(navParams.get('order')!=null){
            this.order=navParams.get('order');
            this.selected(navParams.get('id'));
        }else{
            this.order="process";
            this.selected(1);
        }*/
        if(this.navParams.get('order')!=null){
           this.order=this.navParams.get('order');
           this.selected(this.navParams.get('id'));
       }else if(this.navParams.get('order')=="undefined"){
           this.order="process";
           this.selected(1);
       }else{
            this.order="process";
           this.selected(1);
       }

    }

    /*页面事件*/
    ionViewWillEnter(){
       /* if(2 == this.idx){
            this.selected(this.idx);
        }*/
       this.grtnumber();
        this.selected(this.idx);

    }

     grtnumber(){
         if(this.commonService.token != null && this.commonService.token!= ''){
                //加载数据
                 this.commonService.httpLoad({
                        url:this.commonService.baseUrl+'/order/orderNum',
                        data:{
                         status:"2",
                         storeId:this.commonService.user.storeId
                        }
                    }).then(data=>{
                        if(data.code=='200'){
                             this.Pending_num = data.result.orderNum;
                        }
                    })
        }
     }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    selected(idx){
        this.pageNo = 1;
        this.idx = idx;
        this.items = [];
        this.showScroll = true;
        switch (this.idx) {
            case 0: /*/user/goods/win/buy/page*/
                this.url ="/order/orderlist?status=0&storeId="+this.commonService.user.storeId;//未付款
                break;
            case 1: /*/user/goods/win/buy/page*/
                this.url ="/order/orderlist?status=&storeId="+this.commonService.user.storeId;//全部
                break;
            case 2: /*/user/store/order/page*/
                this.url ="/order/orderlist?status=2&storeId="+this.commonService.user.storeId;//待发未处理
                break;
            case 3:  /*/user/store/order/page*/
                this.url ="/order/orderlist?status=3&storeId="+this.commonService.user.storeId;//已发已处理
                break;
            default:
        }
        this.loadData();

    }

    loadData(){
        console.log(this.commonService.baseUrl+this.url)
        this.commonService.httpGet({
            url:this.commonService.baseUrl+this.url,
            data:{
                pageNo:this.pageNo,
                pageSize:this.commonService.pageSize
            }
        }).then(data=>{
            if(data.code==200){
                this.items = data.result!=null?data.result.rows:[];
            }else if(data.code==1){
                /*this.commonService.toast("没有任何数据");*/
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    /*查看订单*/
    viewOrderInfo1(itm){
        this.navCtrl.push(OrderInfoPage,{goods:itm});
    }

    viewOrderInfo(orderId){/*
        sessionStorage.setItem("orderId",orderId);*/
        this.navCtrl.push(SellerOrderInfoPage,{orderNo:orderId});
    }

    doInfinite(infiniteScroll) {
        this.pageNo++;
        setTimeout(() => {
            this.commonService.httpLoad({
                url:this.commonService.baseUrl+this.url,
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

}
