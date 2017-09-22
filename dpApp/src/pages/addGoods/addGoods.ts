import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavController, ActionSheetController,NavParams } from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { GoodsDetailPage } from '../goodsDetail/goodsDetail';
@Component({
    selector: 'page-addGoods',
    templateUrl: 'addGoods.html'
})
export class AddGoodsPage {
    subData = {
        icons:[
            {
                isDefault:'1',
                path:'assets/images/shopDefault.png'
            },
            {
                isDefault:'0',
                path:'assets/images/shopDefault.png'
            },
            {
                isDefault:'0',
                path:'assets/images/shopDefault.png'
            },
            {
                isDefault:'0',
                path:'assets/images/shopDefault.png'
            },
            {
                isDefault:'0',
                path:'assets/images/shopDefault.png'
            },
            {
                isDefault:'0',
                path:'assets/images/shopDefault.png'
            }
        ],
        name:null,
        price:null,
        originalPrice:null,
        drawNum:1,
        drawPrice:null,
        stock:null,
        saleSwitch:true,
        status:true,
        detail:'',
        firstReferrerScale:0,
        secondReferrerScale:0,
        thirdReferrerScale:0,
        goodsSortId:'',
        businessSendEp:0,
        discountEP:0
    };
    delIcons:any = [];
    idx:number;
    saveData;
    types:any[];
    isDisable:boolean=false;
    goodDetails=[];
    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private commonService: CommonService,
        public params: NavParams
    ) {
        this.loadShopType();


    }
     ionViewWillEnter(){
         var str=sessionStorage.getItem("goodDetails");
         this.goodDetails=JSON.parse(str);
    }

    /*返回上一页*/
    goToBackPage(){
        sessionStorage.removeItem("goodDetails");

        this.navCtrl.pop();
    }

    /*提交数据*/
    submitData(){
        if(this.validator()){
            // let sdata ='{"icon":"http://oq6gv60qr.bkt.clouddn.com/FmeoG52HS5RbrC0b1u-46SdkkWSE","icons":[{"isDefault":"1","path":"http://oq6gv60qr.bkt.clouddn.com/FmeoG52HS5RbrC0b1u-46SdkkWSE"},{"isDefault":"0","path":"http://oq6gv60qr.bkt.clouddn.com/Fpvb7ZeyRc3k_DMsKDM-L-4ca7p6"},{"isDefault":"0","path":"http://oq6gv60qr.bkt.clouddn.com/FiSXeVdfgqOduYJFKzvYMKfPG6ll"}],"name":"Jfjfjd","price":"19","originalPrice":"20","drawNum":"2","stock":"1","saleSwitch":"1","status":"1","detail":"Shdjdjdjrjdjdjdfffffgggggggggggghh","firstReferrerScale":0,"secondReferrerScale":0,"thirdReferrerScale":0,"goodsSortId":"064EFD2813B14E54A2B248EF6E43A5DA","businessSendEp":0,"bucket":"doupai-test-goods","discountEP":0}'
            let sdata={
                bucket:this.commonService.namespaceGoods,
                businessSendEp:this.subData.businessSendEp,
                detail:this.subData.detail,
                drawNum:this.subData.drawNum,
                firstReferrerScale:this.subData.firstReferrerScale,
                secondReferrerScale:this.subData.secondReferrerScale,
                thirdReferrerScale:this.subData.thirdReferrerScale,
                goodsSortId:this.subData.goodsSortId,
                delIcons:[],
                icon:this.subData.icons[0].path,
                icons:[],
                name:this.subData.name,
                price:this.subData.price,
                originalPrice:this.subData.originalPrice,
                stock:this.subData.stock,
                saleSwitch:this.subData.saleSwitch?'1':'0',
                status:this.subData.status?'1':'0',
                discountEP:this.subData.discountEP
            }
            for(let o in this.subData.icons){
                if(this.subData.icons[o].path.indexOf('assets')<0){
                    sdata.icons.push(this.subData.icons[o]);
                }
            }
            this.isDisable = true;
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/goods/add',
                data:sdata
            }).then(data=>{
                if(data.code==200){
                    if(this.goodDetails!=null){

                         this.commonService.httpPost({
                            url:this.commonService.baseUrl+'/mall/goods/addorupdate',
                            data:{
                                goodsDetail:this.goodDetails,
                                goodsId:data.result.goodsid
                            }
                        }).then(data=>{
                            if(data.code==200){
                            sessionStorage.removeItem("goodDetails");
                            let toast = this.commonService.toast("发布商品成功");
                            // this.deleteImge();
                            toast.onDidDismiss(() => {
                                this.goToBackPage();
                            });

                            }else{
                                this.commonService.alert("系统提示",data.msg);
                            }
                        });

                    }else{
                         sessionStorage.removeItem("goodDetails");
                        let toast = this.commonService.toast("发布商品成功");
                         toast.onDidDismiss(() => {
                            this.goToBackPage();
                        });

                    }
                }else{
                    this.isDisable = false;
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }

    }

    uploadImg(idx){
        this.idx = idx;
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
                    this.delIcons.push(this.subData.icons[this.idx].path.split("/")[3]);
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

    // deleteImge(){
    //     this.commonService.httpPost({
    //         url:this.commonService.baseUrl+'/common/delupimg',
    //         data:{
    //             bucket:this.commonService.namespaceGoods,
    //             iconList:this.delIcons
    //         }
    //     }).then(data=>{
    //         if(data.code==200){
    //
    //         }else{
    //             this.commonService.alert("系统提示",data.msg);
    //         }
    //     });
    // }

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
              let imagetem = 'data:image/jpeg;base64,' + imageData;
              var imglist=[];
              imglist.push(imagetem);
              this.commonService.httpPost({
                    url:this.commonService.baseUrl+'/common/uploadFileWithBase64',
                    data:{
                        bucket:this.commonService.namespaceGoods,
                        icons:imglist
                    }
                }).then(data=>{
                    if(data.code==200){
                        var values=data.result;
                        for(var key in values){
                            for(var k in values[key]){
                                this.subData.icons[this.idx].path = values[key][k];
                            }
                        }
                        // this.deleteImge();
                          /*alert(JSON.stringify(this.GoodDetails));*/
                    }else{
                        this.commonService.alert("系统提示",data.msg);
                    }
                });


            }
        }, (err) => {
        });
    }

    loadShopType(){
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/mall/goods/sorts',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.types = data.result;
                this.types.unshift({name:"选择商品类型"});
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    countDP(){
        /*this.subData.drawPrice = (this.subData.price/this.subData.drawNum).toFixed(2);*/
    }

    /*数据验证*/
    validator(){

       if(this.subData.icons[0].path.indexOf('assets')>=0){
            this.commonService.toast('第一张图片不允许为空');
            return false;
        }

        if(this.subData.name==null || this.subData.name==''){
            this.commonService.toast('商品名称不允许为空');
            return false;
        }

        if(this.subData.goodsSortId == "" || this.subData.goodsSortId == null){
            this.commonService.toast('请选择商品类型');
            return false;
        }

        if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(this.subData.price)){
            this.commonService.toast("商品价格输入有误");
            return false;
        }else{
            if((this.subData.originalPrice*1)<(this.subData.price*1)){
                this.commonService.toast("商品购买价不能大于门市价");
                return false;
            }
        }

        if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(this.subData.originalPrice)){
            this.commonService.toast("商品门市价格输入有误");
            return false;
        }else{
            if((this.subData.originalPrice*1)<(this.subData.price*1)){
                this.commonService.toast("商品购买价不能大于门市价");
                return false;
            }
        }


        /*if(!(/^[0-9]*$/).test(this.subData.drawNum)){
            this.commonService.toast('斗拍人数输入有误');
            return false;
        }

        if(this.subData.drawNum<this.commonService.params.drawNumMin || this.subData.drawNum>this.commonService.params.drawNumMax){
            this.commonService.toast('斗拍人数必须在'+this.commonService.params.drawNumMin+"~"+this.commonService.params.drawNumMax);
            return false;
        }*/

        if(!(/^[0-9]*$/).test(this.subData.firstReferrerScale+'') || this.subData.firstReferrerScale<0 || this.subData.firstReferrerScale>100){
            this.commonService.toast("一级分销只能输入0～100的整数");
            return false;
        }

        if(!(/^[0-9]*$/).test(this.subData.secondReferrerScale+'') || this.subData.secondReferrerScale<0 || this.subData.secondReferrerScale>100){
            this.commonService.toast("二级分销只能输入0～100的整数");
            return false;
        }

        if(!(/^[0-9]*$/).test(this.subData.thirdReferrerScale+'') || this.subData.thirdReferrerScale<0 || this.subData.thirdReferrerScale>100){
            this.commonService.toast("三级分销只能输入0～100的整数");
            return false;
        }

        if(!(/^[0-9]*$/).test(this.subData.discountEP+'') || this.subData.discountEP<0 || this.subData.discountEP>100){
            this.commonService.toast("EP优惠比例只能输入0～100的整数");
            return false;
        }

        if(this.subData.businessSendEp<0 || this.subData.businessSendEp>(this.subData.price*1) || !(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.subData.businessSendEp+'')){
            this.commonService.toast('赠送EP输入有误');
            return false;
        }

        let tnum:number = this.subData.firstReferrerScale*1+this.subData.secondReferrerScale*1+this.subData.thirdReferrerScale*1+this.subData.discountEP*1+(this.subData.businessSendEp/this.subData.price)*100;

        if(tnum>100){
            this.commonService.toast("比例总和已超过商品价格");
            return false;
        }

        if(!(/^[0-9]*$/).test(this.subData.stock)){
            this.commonService.toast('商品库存输入有误');
            return false;
        }

        if(this.subData.stock<1 || this.subData.stock>this.commonService.params.storeStockMax){
            this.commonService.toast('商品库存必须在1~'+this.commonService.params.storeStockMax);
            return false;
        }

        return true;
    }
    gotogoodsDetail(){
         this.navCtrl.push(GoodsDetailPage);
    }

}
