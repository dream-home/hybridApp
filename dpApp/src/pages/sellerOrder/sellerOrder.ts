import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { NavController,NavParams } from 'ionic-angular';
/*import { SellerOrderInfoPage } from '../sellerOrderInfo/sellerOrderInfo';*/
import { OrderInfoPage } from '../orderInfo/orderInfo';

@Component({
    selector: 'page-sellerOrder',
    templateUrl: 'sellerOrder.html'
})
export class SellerOrderPage {

    order:string;
    items:any;
    showScroll:boolean;
    idx:number;
    url:string;
    pageNo:number;
    constructor(public navCtrl: NavController, private commonService: CommonService,public navParams: NavParams ) {

    }

    /*页面事件*/
    ionViewWillEnter(){
       /* if(2 == this.idx){
            this.selected(this.idx);
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

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    selected(idx){
        this.pageNo = 1;
        this.idx = Number(idx);
        this.items = [];
        this.showScroll = true;
        switch (this.idx) {
            case 1: /*/user/goods/win/buy/page*/
                this.url ="/order/orderlist?status=";//全部
                break;
            case 2:
                this.url ="/order/orderlist?status=2";//未发货
                break;
            case 3:
                this.url ="/order/orderlist?status=3";//已发
                break;
            case 0:
                this.url ="/order/orderlist?status=0";//待付款
                break;
            default:
        }
        this.loadData();
    }

    loadData(){
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

    viewOrderInfo(orderId){
       // sessionStorage.setItem("orderId",orderId);
        this.navCtrl.push(OrderInfoPage,{orderNo:orderId});

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
