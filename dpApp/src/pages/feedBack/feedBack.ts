import { Component } from '@angular/core';
import { CommonService } from '../../app/app.base';
import { Camera } from 'ionic-native';
import { NavController,NavParams, ActionSheetController } from 'ionic-angular';
// import { Infoitem } from './addinfo';

@Component({
    selector: 'page-feedBack',
    templateUrl: 'feedBack.html'
})
export class FeedBackPage {

    feedBackImgs:any = [];//问题截图
    deleteImgs:any = [];//要删除的图片
    isShowAdd:boolean = true;//显示添加图片按钮
    namespace:string;//命名空间
    feedBackType:number;//问题类型
    feedBackTypeName:string;//问题类型标题
    feedBackDetail:string = '';//问题描述
    feedBackDetailLength:number = 0;//问题描述字符长度
    submitDisabled:boolean = true;//提交按钮是否能提交(true为不能提交,false为能提交)
    userId:string;
    constructor(
        public navCtrl: NavController,
        private commonService: CommonService,
        private navParams: NavParams,
        public actionSheetCtrl: ActionSheetController
    ) {
        this.namespace = commonService.namespaceUser;
        this.userId = commonService.user.id;
    }

    /*页面事件*/
    ionViewWillEnter(){

    }

    //选择反馈问题类型
    feedBackChoiceType(idx,typeName){
        //点击反馈问题类型切换样式
        var aLinks=document.getElementsByClassName('feedBackChoice')[0].getElementsByTagName('span');
        for(var i=0;i<aLinks.length;i++){
            var oldClass=aLinks[i].className; //获得现在的样式
            aLinks[i].className=oldClass.split(' ')[0];//删除聚焦样式
            //或者 aLinks[i].className=oldClass.replace('spanChoice','');
        }
        aLinks[idx].className+=" spanChoice";//给当前应该聚焦的添加上聚焦

        this.feedBackType = idx;
        this.feedBackTypeName = typeName;
        // /<!/[^\s]+/.test(this.feedBackDetail)判断是否输入的全为空格，true为不全是空格，false为全是空格
        if(this.feedBackDetailLength < 5 || !/[^\s]+/.test(this.feedBackDetail)){
            this.submitDisabled = true;
        }else{
            this.submitDisabled = false;
        }
   }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    //删除图片
    removeImg(index){
        //添加要删除的图片
        this.deleteImgs.push(this.feedBackImgs[index].split("/")[3]);//截取获取图片名
        this.feedBackImgs.splice(index,1);
        this.isShowAdd = true;
    }

    //监听问题描述输入的长度
    checkLength(){
        this.feedBackDetailLength=this.feedBackDetail.length;
        // /<!/[^\s]+/.test(this.feedBackDetail)判断是否输入的全为空格，true为不全是空格，false为全是空格
        if(this.feedBackDetailLength < 5 || !/[^\s]+/.test(this.feedBackDetail) || isNaN(this.feedBackType)){
            this.submitDisabled = true;
        }else{
            this.submitDisabled = false;
        }
    }

    //添加图片
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
                        //  alert(" ------values "+values);
                           for(var k in values[key]){
                              // alert(" ------- values[key][k] "+values[key][k]);
                              //  this.feedBackImgs.splice(index-1,0,new Infoitem(null,2,values[key][k],[],null,this.namespace,k));
                               this.feedBackImgs.push(values[key][k]);
                               if(this.feedBackImgs.length == 3){
                                   this.isShowAdd = false;
                               }
                           }
                       }
                   }else{
                       this.commonService.alert("系统提示",data.msg);
                   }
               });
           }
       }, (err) => {
       });
   }

   //提交反馈
   submitFeedBack(){
       this.commonService.httpPost({
            url:this.commonService.baseUrl+'/system/feedback',
            data:{
                bucket:this.namespace,
                delIcons:this.deleteImgs,
                detail:this.feedBackDetail,
                icons:this.feedBackImgs,
                title:this.feedBackTypeName,
                type:this.feedBackType,
                userId:this.userId
            }
        }).then(data=>{
            if(data.code==200){
                let toast = this.commonService.toast("意见反馈成功");
                this.submitDisabled = true;
                toast.onDidDismiss(() => {
                    this.goToBackPage();
                });
            }else{
                this.commonService.alert("系统提示",data.msg);
            }
        });
   }
}
