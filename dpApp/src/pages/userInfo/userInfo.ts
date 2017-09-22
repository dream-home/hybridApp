import { Component } from '@angular/core';
import { Camera} from 'ionic-native';
import { CommonService } from '../../app/app.base';
import { NavController, ActionSheetController  } from 'ionic-angular';
import { MobileSettingPage } from '../mobileSetting/mobileSetting';
import { Area } from '../../app/app.data';
import { PayPwSettingPage } from '../payPwSetting/payPwSetting';
import { LoginPwdSettingPage } from '../loginPwdSetting/loginPwdSetting';
import { PerfectUserDataPage } from '../perfectUserData/perfectUserData';
import { ChangeUserNamePage } from '../changeUserName/changeUserName';
declare let cordova: any;
@Component({
    selector: 'page-userInfo',
    templateUrl: 'userInfo.html',
    providers:[Area]
})

export class UserInfoPage {
    userInfo:any;//用户信息
    subData: any;
    userImg: any;
    provinces:any[];
    citys:any[];
    countys:any[];
    province:string="110000";
    city:string="110100";
    county:string="110101";
    show:boolean=false;
    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private commonService: CommonService,
        public area:Area
    ) {

       /* this.subData = {
            nickName: commonService.user.nickName,
            userName: commonService.user.userName,
            userAddress:{
                province: '北京',
                city: '北京市',
                county: '东城区',
                addr: ''
            },
            userBankcard:{
                bankId: '',
                bankName: '',
                cardNo: ''
            }
        }*/
       /* this.provinces = area.areaColumns[0].options;
        if(commonService.user.userAddress != null && commonService.user.userAddress.addr != null){
            this.subData.userAddress.addr = commonService.user.userAddress.addr;
        }

        if(commonService.user.userAddress != null && commonService.user.userAddress.province != null && commonService.user.userAddress.province != ''){
            this.subData.userAddress.province = commonService.user.userAddress.province;
            this.province = this.area.findIdByProvince(this.subData.userAddress.province);
            this.selectProvi({text:this.subData.userAddress.province});
        }else{
            this.selectProvi({text:'北京'});
        }

        if(commonService.user.userAddress != null && commonService.user.userAddress.city != null && commonService.user.userAddress.city != ''){
            this.subData.userAddress.city = commonService.user.userAddress.city;
            this.city = this.area.findIdByCity(this.subData.userAddress.city);
            this.selectCity({text:this.subData.userAddress.city});
        }

        if(commonService.user.userAddress != null && commonService.user.userAddress.county != null && commonService.user.userAddress.county != ''){
            this.subData.userAddress.county = commonService.user.userAddress.county;
            this.county = this.area.findIdByArea(this.subData.userAddress.county);
        }

        if(commonService.user.userBankcard != null ){
            if(commonService.user.userBankcard.bankId != null){
                this.subData.userBankcard.bankId = commonService.user.userBankcard.bankId;
            }

            if(commonService.user.userBankcard.bankName != null){
                this.subData.userBankcard.bankName = commonService.user.userBankcard.bankName;
            }

            if(commonService.user.userBankcard.cardNo != null){
                this.subData.userBankcard.cardNo = commonService.user.userBankcard.cardNo;
            }

        }

        if(this.subData.userBankcard.bankId ==null || this.subData.userBankcard.bankId ==''){
            if(commonService.user.bankList.length>0){
                this.subData.userBankcard.bankId = commonService.user.bankList[0].id;
                this.subData.userBankcard.bankName = commonService.user.bankList[0].name;
            }
        }*/

    }

     //页面事件
    ionViewWillEnter(){
          this.getUserInfo();
    }

    // 支付密码
    settingPayPw(){

            this.navCtrl.push(PayPwSettingPage);

    }
    //设置登录密码
    settingLoginPw(){

            this.navCtrl.push(LoginPwdSettingPage);

    }
    //跳转到完善资料页面
    gotoPerfectUserDataPage(){
        this.navCtrl.push(PerfectUserDataPage);
    }
    changeImg(){
        // console.log("  点击到了 dataDirectory");
        // console.log(cordova.file.dataDirectory);
        // File.checkDir(cordova.file.dataDirectory, 'doupai')
        // .then(data =>{
        //     console.log('Directory exists');
        // })
        // .catch(err =>{
        //     console.log('Directory doesnt exist');
        // });
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '手机拍照',
                handler: () => {
                    this.takePicture(Camera.PictureSourceType.CAMERA);
                }
            },{
                text: '相册选择图片',
                handler: () => {
                    this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
                }
            },{
                text: '取消',
                role: 'cancel',
                handler: () => {

                }
            }]
        });
        actionSheet.present();
    }

    takePicture(sourceType){
        var options = {
            quality: 85,
            sourceType: sourceType,
            destinationType: 0,
            targetHeight:720,
            targetWidth:720,
            allowEdit: true,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };
        Camera.getPicture(options).then((imageData) => {
            if(imageData.length>410000){
                this.commonService.toast('选择图片太大');
            }else{
                let image = 'data:image/jpeg;base64,' + imageData;
                var imglist=[];
                imglist.push(image);
                 this.commonService.httpPost({
                        url:this.commonService.baseUrl+'/common/uploadFileWithBase64',
                        data:{
                            bucket:this.commonService.namespaceUser,
                            icons:imglist
                        }
                    }).then(data=>{
                        if(data.code==200){
                            var values=data.result;
                            for(var key in values){
                                for(var k in values[key]){
                                    this.userImg = values[key][k];
                                    this.saveheadImg();
                                }
                            }
                            /*alert(JSON.stringify(this.GoodDetails));*/
                        }else{
                            this.commonService.alert("系统提示",data.msg);
                        }
                    });

            }
        }, (err) => {
        });
    }
    /*保存头像地址*/
    saveheadImg(){
        this.commonService.httpPost({
            url:this.commonService.baseUrl+'/user/edit/headImg',
            data:{
                path:this.userImg
            }
        }).then(data=>{
            if(data.code==200){
                this.commonService.toast("用户头像编辑成功");
                this.userInfo.headImgUrl= this.userImg;
                this.commonService.user.headImgUrl= this.userImg;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        },err=>{
            this.commonService.alert("系统异常",err);
        });
    }


    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*提交数据*/
    submitData(){
        if(this.validator()){
            this.subData.userBankcard.bankName = this.findName(this.subData.userBankcard.bankId);
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/edit',
                data:this.subData
            }).then(data=>{
                if(data.code==200){
                    let toast = this.commonService.toast("用户信息编辑成功");
                    this.commonService.user.nickName = this.subData.nickName;
                    this.commonService.user.userName = this.subData.userName;
                    this.commonService.user.userAddress = this.subData.userAddress;
                    this.commonService.user.userBankcard = this.subData.userBankcard;
                    toast.onDidDismiss(() => {
                        this.goToBackPage();
                    });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            },err=>{
                this.commonService.alert("系统异常",err);
            });
        }
    }

    /*绑定手机号*/
    bindMobile(){
        this.navCtrl.push(MobileSettingPage);
    }

    /*数据验证*/
    validator(){
        if(this.subData.userName=='' || this.subData.userName==null){
            this.commonService.toast("真实姓名不能为空");
            return false;
        }
        if(this.subData.nickName=='' || this.subData.nickName==null){
            this.commonService.toast("昵称不能为空");
            return false;
        }
        if(this.subData.userBankcard.bankId==''){
            this.commonService.toast("银行不能为空");
            return false;
        }
        if(this.subData.userBankcard.cardNo==''){
            this.commonService.toast("银行卡号不能为空");
            return false;
        }

        if(!(/^[0-9]{15,19}$/.test(this.subData.userBankcard.cardNo))){
            this.commonService.toast("银行卡号输入有误");
            return false;
        }
        if(this.subData.userAddress.addr==''){
            this.commonService.toast("具体地址不能为空");
            return false;
        }
        return true;
    }

    findName(id){
        for(var o in this.commonService.user.bankList){
            if(this.commonService.user.bankList[o].id == id){
                return this.commonService.user.bankList[o].name;
            }
        }
        return '';
    }

    selectProvi(itm){
        this.citys = this.area.findCityLisByPid(this.province);
        this.city = this.citys[0].value;
        this.selectCity({text:this.citys[0].text});
        this.subData.userAddress.province = itm.text;
    }

    selectCity(itm){
        this.countys = this.area.findAreaLisByPid(this.city);
        this.county = this.countys[0].value;
        this.selectCounty({text:this.countys[0].text});
        this.subData.userAddress.city = itm.text;
    }

    selectCounty(itm){
        this.subData.userAddress.county = itm.text;
    }

    //获取用户信息
    getUserInfo(){
         this.commonService.httpGet({
                    url:this.commonService.baseUrl+'/user/login/getUser',
                    data:{

                    }
                }).then(data=>{
                    if(data.code==200){
                      this.userInfo=data.result;
                      if(this.userInfo.areaId==null ||this.userInfo.areaId=='' ||this.userInfo.isSetPassword==0||this.userInfo.isSetPayPwd==0||this.userInfo.phone==null ||this.userInfo.phone==""){
                          this.show=true;
                      }else{
                          this.show=false;
                      }
                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });
    }

    //跳转到修改昵称页面
    gotoChangeUserNamePage(){
        this.navCtrl.push(ChangeUserNamePage);
    }
}
