import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavController, ActionSheetController, AlertController } from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { GoodsDetailPage } from '../goodsDetail/goodsDetail';
@Component({
    selector: 'page-editGoods',
    templateUrl: 'editGoods.html'
})
export class EditGoodsPage {

    subData:any;
    idx:number;
    saveData;
    id:string;
    types:any = [];
    isDisable:boolean=false;
    /*删除*/
    // delPictrue:any = [];
    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private commonService: CommonService,
        public alertCtrl: AlertController
    ) {
        this.id = sessionStorage.getItem("id");
        this.loadShopType();
        this.loadData();


    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/goods/info',
            data:{
                id:this.id
            }
        }).then(data=>{
            if(data.code==200){
                this.subData = data.result;
                this.subData.status==1?true:false;
                this.subData.saleSwitch==1?true:false;
                for(let j=0;j<this.subData.icons.length;j++){
                    if(this.subData.icons[j].path.indexOf('http://')<0){
                        this.base64Toimg(this.subData.icons[j].path,j);
                    }
                }
                for(let i=this.subData.icons.length-1;i<6;i++){
                    this.subData.icons.push({
                        isDefault:'0',
                        path:'assets/images/shopDefault.png'
                    });
                }

            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    base64Toimg(imageData,index){
      let imagetem = imageData;
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
                      this.subData.icons[index].path = values[key][k];
                      // if(this.subData.icons[this.idx].id !=null && this.subData.icons[this.idx].id !=''){
                      //     //修改
                      //     this.subData.icons[this.idx].option='2';
                      // }else{
                      //     //新增
                      //     this.subData.icons[this.idx].option='0';
                      // }
                    }
                }
                // this.deleteImge();
                  /*alert(JSON.stringify(this.GoodDetails));*/
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }

    loadShopType(){
        this.commonService.httpLoad({
            url:this.commonService.baseUrl+'/mall/goods/sorts',
            data:{}
        }).then(data=>{
            if(data.code=='200'){
                this.types = data.result;
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
    }


    /*提交数据*/
    submitData(){
        if(this.validator()){
            let sdata={
                bucket:this.commonService.namespaceGoods,
                detail:this.subData.detail,
                drawNum:this.subData.drawNum,
                goodsSortId:this.subData.goodsSortId,
                delIcons:[],
                icon:this.subData.icons[0].path,
                icons:[],
                id:this.subData.id,
                name:this.subData.name,
                price:this.subData.price,
                originalPrice:this.subData.originalPrice,
                stock:this.subData.stock,
                saleSwitch:this.subData.saleSwitch?'1':'0',
                status:this.subData.status?'1':'0',
                businessSendEp:this.subData.businessSendEp,
                firstReferrerScale:this.subData.firstReferrerScale,
                secondReferrerScale:this.subData.secondReferrerScale,
                thirdReferrerScale:this.subData.thirdReferrerScale,
                discountEP:this.subData.discountEP
            }
            for(let o in this.subData.icons){
                if(this.subData.icons[o].path.indexOf('assets')<0){
                  console.log("----path "+this.subData.icons[o].path);
                    sdata.icons.push(this.subData.icons[o]);
                }
            }
            this.isDisable = true;
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/goods/edit',
                data:sdata
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("编辑商品成功");
                    this.goToBackPage();
                }else{
                    this.isDisable = false;
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }

    }

    /*删除数据*/
    deleteData(){
        let confirm = this.alertCtrl.create({
            title: '确认提示',
            message: '即将删除当前商品',
            buttons: [
            {
                text: '取消',
                handler: () => {}
            },
            {
                text: '确定',
                handler: () => {
                    this.commonService.httpGet({
                        url:this.commonService.baseUrl+'/user/goods/del',
                        data:{
                            id:this.id
                        }
                    }).then(data=>{
                        if(data.code==200){
                            this.commonService.toast("商品删除成功");
                            this.goToBackPage();
                        }else{
                            this.commonService.alert("系统提示",data.msg);
                        }
                    });
                }
            }]
        });
        confirm.present();
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
                    // this.delPictrue.push(this.subData.icons[this.idx].path.split("/")[3]);
                }
            },{
                text: '删除图片',
                handler: () => {
                    this.subData.icons[this.idx].path='assets/images/shopDefault.png';
                    this.subData.icons[this.idx].option='1';
                    // this.delPictrue.push(this.subData.icons[this.idx].path.split("/")[3]);
                    // this.deleteImge();

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
    //             iconList:this.delPictrue
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
            allowEdit: true,
            targetWidth: 720,
            targetHeight: 720,
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
                                if(this.subData.icons[this.idx].id !=null && this.subData.icons[this.idx].id !=''){
                                    //修改
                                    this.subData.icons[this.idx].option='2';
                                }else{
                                    //新增
                                    this.subData.icons[this.idx].option='0';
                                }
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

    countDP(){
       /* this.subData.drawPrice = (this.subData.price/this.subData.drawNum).toFixed(2);*/
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

        if(!(/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/).test(this.subData.price)){
            this.commonService.toast("商品价格输入有误");
            return false;
        }else{
            if((this.subData.originalPrice*1)<(this.subData.price*1)){
                this.commonService.toast("商品购买价不能大于门市价");
                return false;
            }
            if((this.subData.price*1)<(0.5*1)){
                this.commonService.toast("商品价格不能小于0.5");
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
            if((this.subData.originalPrice*1)<(0.5*1)){
                this.commonService.toast("商品门市价格不能小于0.5");
                return false;
            }
        }
       /* if(!(/^[0-9]*$/).test(this.subData.drawNum)){
            this.commonService.toast('斗拍人数输入有误');
            return false;
        }

        if(this.subData.drawNum<this.commonService.params.drawNumMin || this.subData.drawNum>this.commonService.params.drawNumMax){
            this.commonService.toast('斗拍人数必须在'+this.commonService.params.drawNumMin+"~"+this.commonService.params.drawNumMax);
            return false;
        }*/

       /* if(this.subData.drawNum<this.commonService.params.drawNumMin || this.subData.drawNum>this.commonService.params.drawNumMax){
            this.commonService.toast('斗拍人数必须在'+this.commonService.params.drawNumMin+"~"+this.commonService.params.drawNumMax);
            return false;
        }*/

        if(this.subData.firstReferrerScale<0 || this.subData.firstReferrerScale>100){
            this.commonService.toast("一级分销不能小于0或大于100");
            return false;
        }

        if(this.subData.secondReferrerScale<0 || this.subData.secondReferrerScale>100){
            this.commonService.toast("二级分销不能小于0或大于100");
            return false;
        }

        if(this.subData.thirdReferrerScale<0 || this.subData.thirdReferrerScale>100){
            this.commonService.toast("三级分销不能小于0或大于100");
            return false;
        }

        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.subData.firstReferrerScale+'') || !(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.subData.secondReferrerScale+'') || !(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.subData.thirdReferrerScale+'')){
            this.commonService.toast('分销比例只能保留两位小数');
            return false;
        }

        if(this.subData.businessSendEp<0){
            this.commonService.toast('赠送EP不能小于0');
            return false;
        }

        if(this.subData.businessSendEp>this.subData.price*1){
            this.commonService.toast('赠送EP需小于商品价格');
            return false;
        }

        if(!(/^[0-9]+(\.[0-9]{0,2})?$/).test(this.subData.businessSendEp+'')){
            this.commonService.toast('赠送EP只能保留两位小数');
            return false;
        }

        let tnum:number = this.subData.firstReferrerScale*1+this.subData.secondReferrerScale*1+this.subData.thirdReferrerScale*1+(this.subData.businessSendEp/this.subData.price)*100;
        if(tnum>100){
            this.commonService.toast("三级分销比例加上赠送EP已超过商品价格");
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
     gotogoodsDetail(gid){
         this.navCtrl.push(GoodsDetailPage,{goodId:gid});
    }
}
