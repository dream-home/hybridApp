import { Component } from '@angular/core';
import { NavController, Platform, NavParams, ViewController } from 'ionic-angular';
import { CommonService } from '../../app/app.base';

@Component({
    selector: 'page-wedebug',
    templateUrl: 'wedebug.html'
})
export class WedebugPage {
    serverIPs:any =[
        {
            servername:'正式服务器',
            serverip:'https://www.6pyun.com/api'
        },
        {
            servername:'外网测试正式服务器',
            serverip:'http://www.6pyun.com/app'
        },
        {
            servername:'测试服务器外网',
            serverip:'http://120.76.43.39:8090/api'
        },
        {
            servername:'测试环境内网',
            serverip:'http://192.168.2.202:8889/api'
        },
        {
            servername:'开发环境内网',
            serverip:'http://192.168.2.202:8899/api'
        }
    ];
    serverips:string;
    alipayIPs:any = [
        {
            servername:'测试调起支付正式地址',
            serverip:'http://pay.yanbaocoin.cn:8090/pay/payAlipaySDK/paymentMoney'
        },
        {
            servername:'测试调起支付正式地址',
            serverip:'http://doupaimall.com/pay/payAlipaySDK/paymentMoney'
        },
        {
            servername:'支付宝调起支付测试地址',
            serverip:'http://120.76.43.39:8090/pay/payAlipaySDK/paymentMoney'
        }
    ];
    alipayips:string;
    httpserverip:string;
    httpserverport:string;
    constructor(
        public navCtrl: NavController,
        public platform: Platform,
        public params: NavParams,
        public viewCtrl: ViewController,
        public commonService:CommonService
    ){

    }

    submit(){
        if(this.httpserverip!=null&&this.httpserverip!=''){
            // alert(" httpserverip ==== "+this.httpserverip+" httpserverport "+this.httpserverport);
            alert("合成后的http地址为： http://"+this.httpserverip+":"+this.httpserverport);
            this.serverips = "http://"+this.httpserverip+":"+this.httpserverport;

        }
        if(this.serverips==null||this.serverips==''){
            this.commonService.alert("系统提示",'选择服务器地址或者填写服务器地址');
            return;
        }
        if(this.alipayips==null||this.alipayips==''){
            this.commonService.alert("系统提示",'选择支付宝地址或者填写支付宝服务器地址');
            return;
        }
        alert("服务器地址为："+this.serverips+" 支付宝地址： "+this.alipayips);
        localStorage.setItem("serverips",this.serverips);
        localStorage.setItem("alipayips",this.alipayips);
        this.commonService.alert("系统提示",'设置成功，重启app即可生效');
        this.goToBackPage();
    }
    rediobtn(serverips){
        this.serverips = serverips;
    }
    rediobtnalipay(serverips){
        this.alipayips = serverips;
    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }
}
