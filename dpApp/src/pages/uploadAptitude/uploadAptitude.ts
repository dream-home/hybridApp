import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavController, ActionSheetController } from 'ionic-angular';
import { CommonService } from '../../app/app.base';

@Component({
    selector: 'page-uploadAptitude',
    templateUrl: 'uploadAptitude.html'
})
export class UploadAptitudePage {

      subData = {
          icons:[
              {
                  path:'assets/images/shopDefault.png'
              },
              {
                  path:'assets/images/shopDefault.png'
              },
              {
                  path:'assets/images/shopDefault.png'
              }
          ],
          licenseIcons:[
          	 {
                  path:'assets/images/shopDefault.png',
              },
              {
                  path:'assets/images/shopDefault.png'
              },
              {
                  path:'assets/images/shopDefault.png'
              }

          ]
      };

    idx:number;
    types:any[];
      /*判断是否有点击上传*/
  	isUpload = {
  		icons:[0,0,0],
  		licenseIcons:[0,0,0]
  	}
    isDisable:boolean=false;
    constructor(
        public navCtrl: NavController,
        public actionSheetCtrl: ActionSheetController,
        private commonService: CommonService
    ) {

    }

    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
    }

    /*页面事件*/
    ionViewWillEnter(){
        let images = sessionStorage.getItem("images");
        if(images!=null && images!=''){
            this.subData = JSON.parse(images);
        }
        let idcardicons = sessionStorage.getItem("idcardicons");
        if(idcardicons!=null && idcardicons!=''){
            this.isUpload.icons = JSON.parse(idcardicons);
        }
        let idcard = sessionStorage.getItem("idcard");
        let license = sessionStorage.getItem("license");
        if(idcard!=null && idcard!=''){
            this.subData.icons = JSON.parse(idcard);
        }
        if(license!=null && license!=''){
            this.subData.licenseIcons = JSON.parse(license);
        }
        console.log("----------->>>>images "+images+" idcardicons "+idcardicons);


    }
    /*提交数据*/
    uploadImg(idx,picType){
        this.idx = idx;
        let actionSheet = this.actionSheetCtrl.create({
            buttons: [
            {
                text: '手机拍照',
                handler: () => {
                    this.takePicture(Camera.PictureSourceType.CAMERA,picType);
                }
            },{
                text: '相册选择图片',
                handler: () => {
                    this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY,picType);
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

	/*身份证上传*/
    takePicture(sourceType,picType){
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
                        bucket:this.commonService.namespaceStore,
                        icons:imglist
                    }
                }).then(data=>{
                    if(data.code==200){
                        var values=data.result;
                        for(var key in values){
                            for(var k in values[key]){
                              if(picType=='idimg'){
                                  this.subData.icons[this.idx].path = values[key][k];
                                  this.isUpload.icons[this.idx] = 1;
                              }else if(picType=='licimg'){
                                  this.subData.licenseIcons[this.idx].path = values[key][k];
                                  this.isUpload.licenseIcons[this.idx] = 1;
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

    /*点击完成*/
    uploadImage(){
      // this.subData = JSON.parse('{"icons":[{"path":"http://oq6gv60qr.bkt.clouddn.com/Fku2l3YYo2NLwXLdv83jlI8D3hsu"},{"path":"http://oq6gv60qr.bkt.clouddn.com/FtZgBy4vQSliZm7h3DGLTLZ4wK2e"},{"path":"http://oq6gv60qr.bkt.clouddn.com/Fpvb7ZeyRc3k_DMsKDM-L-4ca7p6"}],"licenseIcons":[{"path":"http://oq6gv60qr.bkt.clouddn.com/Fpvb7ZeyRc3k_DMsKDM-L-4ca7p6"},{"path":"http://oq6gv60qr.bkt.clouddn.com/Fpvb7ZeyRc3k_DMsKDM-L-4ca7p6"},{"path":"http://oq6gv60qr.bkt.clouddn.com/FiSXeVdfgqOduYJFKzvYMKfPG6ll"}]}');
      for(var i in this.subData.licenseIcons){
          console.log("-----------22222 处理过后的 json 进来了吗"+this.subData.licenseIcons[i].path+" -----"+this.subData.licenseIcons[i].path.indexOf("shopDefault"))
          if(this.subData.licenseIcons[i].path.indexOf("shopDefault")>0){

              this.subData.licenseIcons[i].path = "";
              console.log("----------- 处理过后的 json 进来了吗"+this.subData.licenseIcons[i].path)
          }
      }
      console.log("----------- 处理过后的 json "+JSON.stringify(this.subData.licenseIcons))
      for(var i in this.subData.icons){
          if(this.subData.icons[i].path.indexOf("shopDefault")>0){
              this.subData.icons[i].path = "";
          }
      }
    	sessionStorage.setItem("images",JSON.stringify(this.subData));
      // sessionStorage.setItem("idcardicons",'[1,1,1]');
    	// sessionStorage.setItem("licenseIcons",'[1,1,1]');
    	sessionStorage.setItem("idcardicons",JSON.stringify(this.isUpload.icons));
    	sessionStorage.setItem("licenseIcons",JSON.stringify(this.isUpload.licenseIcons));
    	this.navCtrl.pop();
    }

}
