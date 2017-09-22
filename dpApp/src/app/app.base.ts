import {Injectable} from '@angular/core';
import { NavController, AlertController,LoadingController, ToastController,App,Loading } from 'ionic-angular';
import { Http, Headers, URLSearchParams, RequestOptions  } from '@angular/http';
import { LoginPage } from '../pages/login/login';
import 'rxjs/Rx';
declare let window:any;
@Injectable()
export class CommonService {
    /**访问路径 */
    // public baseUrl: string = "http://192.168.2.202:8889";//test环境接口
    public baseUrl: string = "http://www.6pyun.com/app";//dev环境接口
    // public baseUrl: string = "http://www.6pyun.com/api";

    // public baseUrl: string = "http://120.24.234.115:8091";

    // public baseUrl: string = "http://doupaimall.com";



    /*分享地址*/
    public shareUrl: string = "http://m.yanbaocoin.cn/wxstore";
    /*支付宝吊起支付地址*/
    // public alipay:string = 'http://120.76.43.39:8090/pay/payAlipaySDK/paymentMoney';
    public alipay:string = 'http://doupaimall.com/pay/payAlipaySDK/paymentMoney';
    /**分页页数 */
    pageSize: number = 10;

    /** token */
    public token: string = null;
    /*消息总记录数*/
    public count: number = 0;
    /*系统参数*/
    public params:any;
    /*极光推送ID*/
    public registrationId: string =null;
    /*app版本号*/
    public appVer: string='1.2.0';
    private loading: Loading;
    private loadRunning: boolean = false;
    /*显示签到红包*/
    public showOpenRed:boolean = true;
    /*七牛上传环境
      doupai-offical-goods 正式环境
      doupai-test-goods 测试环境
    */
    public namespaceUser:string ="doupai-test-user";//doupai-test-user doupai-offical-user
    public namespaceStore:string ="doupai-test-store";//doupai-test-store doupai-offical-store
    public namespaceGoods:string ="doupai-test-goods";//doupai-test-goods doupai-offical-goods

    // public namespaceUser:string ="doupai-offical-user";//doupai-test-user doupai-offical-user
    // public namespaceStore:string ="doupai-offical-store";//doupai-test-store doupai-offical-store
    // public namespaceGoods:string ="doupai-offical-goods";//doupai-test-goods doupai-offical-goods

    public wxappid:string = 'wx1581a2802e11162d';
    public wxappsecret:string ='2f25e5339178db0314b2742cb13605e6';
    /*共享E家店铺ID*/
    public shareEhome:string = 'B0FDE88D106544EE84C87111BF1D1429';

    /*是否开启debug模式*/
    public isOpenDebug:boolean = true;
   public user = {
        account:'',
        areaId:'',
        bankList:[],
        city:'',
        consumeEP:0,
        county:'',
        createTime:'',
        doudou:0,
        email:null,
        exchangeEP:0,
        grade:null,
        headImgUrl:'',
        id:'',
        isBindWeixin:'',
        isCompleteInfo:'',
        isSetPassword:'',
        isSetPayPwd:'',
        key:null,
        loginName:null,
        nickName:'',
        password:'',
        phone:'',
        picCode:'',
        province:'',
        registrationId:'',
        remark:null,
        score:0,
        sex:null,
        signCount:null,
        signEP:null,
        storeId:null,
        token:'',
        uid:'',
        userAddress:null,
        userBankcard:null,
        userName:'',
        vo:null,
        isBindSHWeiXin:'',//深圳微信是否绑定 0：绑定，1：没绑定
        isBindAppOpenId:'' // 0 已经绑定  1未绑定
    };
    public navCtrl: NavController;
    constructor(
        private http: Http,
        public alertCtrl: AlertController,
        public loadingCtrl:LoadingController,
        public toastCtrl: ToastController,
        public app: App
    ) {
        // this.token ="eyJ0aW1lIjoxNDg3OTE0MzMwOTQ0LCJpZCI6IkRFQjU3QkIxNjlCNzRDMDNBQTYyQkM5NkNBOTQ0QUEwIiwibmlja05hbWUiOiJzaGVueW91In0*";

        if(this.isOpenDebug){
          //console.log("首次进来------");
            if(localStorage.getItem('serverips')!=''&&localStorage.getItem('serverips')!=null){
                this.baseUrl =  localStorage.getItem('serverips');
            }
            if(localStorage.getItem('alipayips')!=''&&localStorage.getItem('alipayips')!=null){
                this.alipay =  localStorage.getItem('alipayips');
            }
            //console.log("服务器地址为："+this.baseUrl+" 支付宝地址为："+this.alipay);
        }

        if(this.registrationId==null||this.registrationId==''){
            this.init();
        }
    }

    /**
    * 注册极光
    */
    init() {
        //启动极光推送
        if (window.plugins && window.plugins.jPushPlugin) {
            window.plugins.jPushPlugin.init();
            window.plugins.jPushPlugin.getRegistrationID(function(data) {
                  if(data!=null){
                      this.registrationId=data;
                  }
                });
            }
    }

    /**
    *
    * 发送 Http Get 请求
    */
    public httpGet(options){
        this.showLoading();
        let url = options.url;
        let headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("token",this.token);
        let params = new URLSearchParams();
        for(var key in options.data){
            params.set(key, options.data[key]);
        }

        let opt = new RequestOptions({ headers: headers, search: params });
        let resp = this.http.get(url,opt).map(res => res.json()).toPromise();
        // console.log("------GET请求 "+url+" data "+JSON.stringify(opt));
        resp.then(data=>{
            if(data.code=='-1'){
                this.navCtrl = this.app.getActiveNav();
                sessionStorage.clear();
                this.token = null;
                this.navCtrl.push(LoginPage);
            }
            this.hideLoading();
        },err=>{
            this.hideLoading();
            this.toast("网络问题，请检查网络连接");
        });
        return resp;
    }

    /**
    *
    * 发送 Http Get 请求 没有加载中特效
    */
    public httpLoad(options){
        let url = options.url;
        let headers = new Headers();
        headers.append("Accept", "application/json");
        headers.append("token",this.token);
        let params = new URLSearchParams();
        for(var key in options.data){
            params.set(key, options.data[key]);
        }
        let opt = new RequestOptions({ headers: headers, search: params });
        let resp = this.http.get(url,opt).map(res => res.json()).toPromise();
        resp.then(data=>{
            if(data.code=='-1'){
                sessionStorage.clear();
                this.token = null;
                this.count = 0;
            }
        },err=>{
            this.toast("网络问题，请检查网络连接");
        });
        return resp;
    }

    /**
    *
    * 发送 Http Post 请求
    */
    public httpPost(options){
        this.showLoading();
        let url = options.url;
        let headers = new Headers();
        headers.append("Content-Type", "application/json;charset=utf-8");
        headers.append("token",this.token);
        let opt = new RequestOptions({ headers: headers});
        console.log("post 发送--->>data "+JSON.stringify(options.data)+"  url --->> "+url);
        let resp = this.http.post(url, options.data, opt).map(res => res.json()).toPromise();
        resp.then(data=>{
            console.log("post 返回结果--->>data "+JSON.stringify(data));
            this.hideLoading();
        },err=>{
            this.hideLoading();
            this.toast("网络问题，请检查网络连接");
        });
        return resp;
    }

    /**
    *
    *消息提醒框
    */
    public alert(title,subTitle) {
        let alert = this.alertCtrl.create({
            title: title,
            subTitle: subTitle,
            buttons: ['确定']
        });
        alert.present();
    }

    /*消息提醒(ionic)*/
    public toast(msg){
        let toast = this.toastCtrl.create({
            message: msg,
            position: 'bottom',
            duration: 2500,
            cssClass: 'mytoast'
        });
        toast.present();
        return toast;
    }

    public loadMsgCount(){
        this.httpLoad({
            url:this.baseUrl+'/message/unread',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.count = data.result.expense + data.result.system ;//+ data.result.win
            }
        });
    }

    /*系统参数*/
    public loadParam(){
        this.httpLoad({
            url:this.baseUrl+'/system/setting',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.params = data.result;
            }
        });
    }

    /*签到*/
    public signedIn(){
        // this.httpLoad({
        //     url:this.baseUrl+'/user/signIn',
        //     data:{}
        // }).then(data=>{
        //     if(data.code==200){
        //         if(data.result != null){
        //             this.alert("签到成功","已签到"+data.result.signCount+"次,获得"+data.result.signEP+"余额");
        //         }
        //     }
        // });
    }

    /**
     * 统一调用此方法显示loading
     * @param content 显示的内容
     */
    showLoading = (content: string = '') => {
      if (!this.loadRunning) {
        this.loadRunning = true;
        this.loading = this.loadingCtrl.create({
          content: content,
          spinner: 'crescent',
          dismissOnPageChange:false
        });
        this.loading.present().then(()=>{
            setTimeout(() => {//最长显示10秒
                this.hideLoading();
            }, 10000);
        });
      }
    };

    /**
     * 关闭loading
     */
    hideLoading = () => {
      if (this.loadRunning) {
          this.loading.dismiss().then(()=>{
              this.loadRunning = false;
          }).catch(()=>{});
      }
    };


    dateFormatLong(date:number, sFormat: String = 'yyyy-MM-dd'){
        return this.dateFormat(new Date(date),sFormat);
    }

    /**
    * 格式化日期
    * sFormat：日期格式:默认为yyyy-MM-dd     年：y，月：M，日：d，时：h，分：m，秒：s
    * @example  dateFormat(new Date(),'yyyy-MM-dd')   "2017-02-28"
    * @example  dateFormat(new Date(),'yyyy-MM-dd hh:mm:ss')   "2017-02-28 09:24:00"
    * @example  dateFormat(new Date(),'hh:mm')   "09:24"
    * @param date 日期
    * @param sFormat 格式化后的日期字符串
    * @returns {String}
    */
    dateFormat(date: Date, sFormat: String = 'yyyy-MM-dd'): string {
        let time = {
            Year: 0,
            TYear: '0',
            Month: 0,
            TMonth: '0',
            Day: 0,
            TDay: '0',
            Hour: 0,
            THour: '0',
            hour: 0,
            Thour: '0',
            Minute: 0,
            TMinute: '0',
            Second: 0,
            TSecond: '0',
            Millisecond: 0
        };
        time.Year = date.getFullYear();
        time.TYear = String(time.Year).substr(2);
        time.Month = date.getMonth() + 1;
        time.TMonth = time.Month < 10 ? "0" + time.Month : String(time.Month);
        time.Day = date.getDate();
        time.TDay = time.Day < 10 ? "0" + time.Day : String(time.Day);
        time.Hour = date.getHours();
        time.THour = time.Hour < 10 ? "0" + time.Hour : String(time.Hour);
        time.hour = time.Hour < 13 ? time.Hour : time.Hour - 12;
        time.Thour = time.hour < 10 ? "0" + time.hour : String(time.hour);
        time.Minute = date.getMinutes();
        time.TMinute = time.Minute < 10 ? "0" + time.Minute : String(time.Minute);
        time.Second = date.getSeconds();
        time.TSecond = time.Second < 10 ? "0" + time.Second : String(time.Second);
        time.Millisecond = date.getMilliseconds();

        return sFormat.replace(/yyyy/ig, String(time.Year))
            .replace(/yyy/ig, String(time.Year))
            .replace(/yy/ig, time.TYear)
            .replace(/y/ig, time.TYear)
            .replace(/MM/g, time.TMonth)
            .replace(/M/g, String(time.Month))
            .replace(/dd/ig, time.TDay)
            .replace(/d/ig, String(time.Day))
            .replace(/HH/g, time.THour)
            .replace(/H/g, String(time.Hour))
            .replace(/hh/g, time.Thour)
            .replace(/h/g, String(time.hour))
            .replace(/mm/g, time.TMinute)
            .replace(/m/g, String(time.Minute))
            .replace(/ss/ig, time.TSecond)
            .replace(/s/ig, String(time.Second))
            .replace(/fff/ig, String(time.Millisecond))
    }

    toNumber(num:number){
        return num.toFixed(2);
    }

    toDecimal(x) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return;
        }
        f = Math.round(x*100)/100;
        return f;
    }

    getTodayDate(){
        var date = new Date();
        //console.log("ri "+date.getDate()+" yue "+date.getMonth()+" nian "+date.getFullYear()+" 今天的日期为: "+date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate());
        return date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate();
    }

}


@Injectable()
export class GlobalService {
    get(attr) {
        if(typeof this[attr] === 'undefined') return;
        return this[attr];
    }

    set(attr, val) {
        if(typeof val === 'undefined') return;
        this[attr] = val;
        return this[attr];
    }
}
