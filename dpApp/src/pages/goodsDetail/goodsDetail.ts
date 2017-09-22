import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
/*import { ImagePicker} from 'ionic-native';*/
import { NavController, ActionSheetController ,NavParams} from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { Infoitem } from './addinfo';
/*import { AddGoodsPage } from '../addGoods/addGoods';*/
@Component({
    selector: 'GoodsDetailPage',
    templateUrl: 'goodsDetail.html'
})
export class GoodsDetailPage {
    show:number;
    preGoodDetail=[];
    GoodDetails = [];
    goodId:string;
    namespace:string;
    deleteImgs:Infoitem;
    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private commonService: CommonService,
        public params: NavParams
    ) {

        // pubilc rank:number;    /*排序号   number*/
        //pubilc type:number /*    类型(1:内容 or 2:图片*/
        //pubilc content:string;  /*模块内容*/
        //pubilc imglist:any; /*需要删除的图片数组*/
        //pubilc model:string;    /*模块名称  string  */
       // pubilc namespace:string; /*图片上传命名空间  string  */
       // pubilc remark:string;/* 备注  string  */
         //
        /*this.GoodDetails=[
            new Infoitem(0,1,"刘芳瑜222",null,null,null,null),
            new Infoitem(1,2,"assets/images/shopDefault.png",null,null,null,null),
        ]*/
         this.namespace=this.commonService.namespaceGoods;//doupai-test-goods doupai-offical-goods
         this.deleteImgs=new Infoitem(1,2,null,[],null,this.namespace,null);
    }

ionViewWillEnter(){
    this.goodId=this.params.data.goodId;

        if(this.params.data.goodId!=null){

            this.getDeailts();
        }else{

            var str=sessionStorage.getItem("goodDetails");
             var s=JSON.parse(str);
             if(s!=null){
                this.GoodDetails=s;
            }else{
                this.show=1;
            }

        }
}
//获取商品详情信息

getDeailts(){
      this.commonService.httpPost({
                url:this.commonService.baseUrl+'/mall/goods/detaillist',
                data:{
                    goodsId:this.goodId
                }
            }).then(data=>{
                if(data.code==200){
                   for(var i in data.result){
                        this.GoodDetails.push(
                            new Infoitem(data.result[i].rank,data.result[i].type,data.result[i].content,data.result[i].imglist,null,this.namespace,data.result[i].remark)
                            );
                   }
                 if(data.result.length==0){
                        this.show=1;
                    }else{
                        this.show=0;
                    }
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
}

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }


    showRoHide(){
        this.show=0;
    }

    addWord(){
        this.GoodDetails.push(new Infoitem(null,1,null,[],null,this.namespace,null));
    }

    upTop(index){
        if(index>0){
            var preItem=this.GoodDetails[index-1];
            this.GoodDetails[index-1]=this.GoodDetails[index];
             this.GoodDetails[index]=preItem;
        }

    }

    afterAdd(index){
        this.GoodDetails.splice(index+1,0,new Infoitem(null,1,null,[],null,this.namespace,null));
    }

    deleteItem(index,type){
        if(type==2){
           this.deleteImgs.imglist.push(this.GoodDetails[index].remark);
        }
         this.GoodDetails.splice(index,1);

    }

    addImages(index){
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '手机拍照',
                handler: () => {
                    this.takePicture(Camera.PictureSourceType.CAMERA,index);
                }
            },{
                text: '相册选择图片',
                handler: () => {
                    this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY,index);
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

     takePicture(sourceType,index){
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

                var imgstrbase64='data:image/jpeg;base64,' + imageData;
                var imglist=[];
                imglist.push(imgstrbase64);
                 this.commonService.httpPost({
                        url:this.commonService.baseUrl+'/common/uploadFileWithBase64',
                        data:{
                            bucket:this.namespace,
                            icons:imglist
                        }
                    }).then(data=>{
                        if(data.code==200){
                            var values=data.result;
                            for(var key in values){
                                    for(var k in values[key]){

                                     if(index<0){
                                            this.GoodDetails.push(new Infoitem(null,2,values[key][k],[],null,this.namespace,k));
                                        }else{
                                            this.GoodDetails.splice(index+1,0,new Infoitem(null,2,values[key][k],[],null,this.namespace,k));
                                        }
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


    //提交数据
    submitData(){
        //添加要删除的图片
        this.GoodDetails.push(this.deleteImgs);
        //给数组加编号
        for(var i in this.GoodDetails){
            this.GoodDetails[i].rank=i;
        }
        if(this.goodId!=null){
         this.commonService.httpPost({
                url:this.commonService.baseUrl+'/mall/goods/addorupdate',
                data:{
                    goodsDetail:this.GoodDetails,
                    goodsId:this.goodId
                }
            }).then(data=>{
                if(data.code==200){
                  let toast = this.commonService.toast("编辑商品详情成功");
                        toast.onDidDismiss(() => {
                            this.goToBackPage();
                        });
                }else{
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }else{

            var str=JSON.stringify(this.GoodDetails);
            sessionStorage.setItem("goodDetails",str);
            //this.navCtrl.push(AddGoodsPage,{GoodDetails:this.GoodDetails});
             this.goToBackPage();
        }

    }

   /* test(index){
        var imgstrbase64='data:image/jpeg;base64,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';
                var imglist=[];
                imglist.push(imgstrbase64);
                 this.commonService.httpPost({
                        url:this.commonService.baseUrl+'/common/uploadFileWithBase64',
                        data:{
                            bucket:this.namespace,
                            icons:imglist
                        }
                    }).then(data=>{
                        if(data.code==200){
                            var values=data.result;
                            for(var key in values){
                                    for(var k in values[key]){

                                     if(index<0){
                                            this.GoodDetails.push(new Infoitem(null,2,values[key][k],null,null,this.namespace,k));
                                        }else{
                                            this.GoodDetails.splice(index+1,0,new Infoitem(null,2,values[key][k],null,null,this.namespace,k));
                                        }
                                         alert("图片名称："+k);
                                         alert("图片路径："+values[key][k]);
                                    }
                                }
                        }else{
                            this.commonService.alert("系统提示",data.msg);
                        }
                    });
    }*/

}
