import { Component } from '@angular/core';
import { Camera } from 'ionic-native';
import { NavController, ActionSheetController,NavParams } from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { UploadAptitudePage } from '../uploadAptitude/uploadAptitude';
import { BaiduMapPage } from '../baiduMap/baiduMap';
import { Area } from '../../app/app.data';
@Component({
    selector: 'page-editShop',
    templateUrl: 'editShop.html',
    providers:[Area]
})
export class EditShopPage {

    shopData:any;
    idx:number;
    areas:string="";
    subData = {
        icons:[],
        licenseIcons:[]
    };
    idcardIcons:any;
    isDisable:boolean=false;
    /*验证身份证*/
    isChoProject:any[];
    // delPictrue:any = [];
    mapaddr:any;//地图定位返回信息
    procode:string='';
    citycode:string='';
    countycode:string='';
    shopStrut:number = 1;
    constructor(public navCtrl: NavController,
       public actionSheetCtrl: ActionSheetController,
       private commonService: CommonService,
       private navParams: NavParams,
       public area:Area) {
         if(navParams.get("shopStrut")!=null && navParams.get("shopStrut")!=''){
            this.shopStrut = navParams.get("shopStrut");
         }

         this.loadData();
    }
    ionViewWillEnter(){
        var mapaddr1 = sessionStorage.getItem('mapaddr');
        if(mapaddr1!=null&&mapaddr1!=''){
            console.log("地图返回的信息是： "+ mapaddr1);
            this.mapaddr = JSON.parse(mapaddr1);
            this.shopData.province = this.mapaddr.province;
            this.shopData.city = this.mapaddr.city;
            this.shopData.county = this.mapaddr.county;
            //根据省市区 获取 相对应的code
            this.procode = this.area.findValueByProvince(this.mapaddr.province);

            this.citycode = this.area.findCityCodeByCitys(this.area.findCityLisByPid(this.procode),this.mapaddr.city);
            this.countycode = this.area.findCityCodeByCitys(this.area.findAreaLisByPid(this.citycode),this.mapaddr.county);
            console.log("procode"+this.procode+"citycode" +this.citycode+"countycode"+this.countycode);
        }
    }
    /*返回上一页*/
    goToBackPage(){
        this.navCtrl.pop();
        sessionStorage.removeItem("mapaddr");
    }

    loadData(){
        this.commonService.httpGet({
            url:this.commonService.baseUrl+'/user/store/info',
            data:{}
        }).then(data=>{
            if(data.code==200){
                this.shopData = data.result;
                if(data.result.idcardIcons == null || this.shopStrut == 2){
                	 this.idcardIcons = true;
                }else if(data.result.idcardIcons.length == 0){
                	 this.idcardIcons = true;
                }else{
                	 this.idcardIcons = false;
                }
                if(data.result.servicePhone == null){
                	this.shopData.servicePhone   = this.commonService.user.phone;
                }
                this.areas +=data.result.province?data.result.province:"";
                this.areas +=data.result.city?data.result.city:"";
                this.areas +=data.result.county?data.result.county:"";
                for(let j=0;j<this.shopData.icons.length;j++){
                    if(this.shopData.icons[j].path.indexOf('http://')<0){
                        this.base64Toimg(this.shopData.icons[j].path,j);
                    }
                }
                for(let i=this.shopData.icons.length-1;i<4;i++){
                    this.shopData.icons.push({
                        path:'assets/images/shopDefault.png'
                    });
                }

                if(this.shopData.idcardIcons!=''&&this.shopData.idcardIcons!=null){
                    sessionStorage.setItem("idcard",JSON.stringify(this.shopData.idcardIcons));
                    sessionStorage.setItem("idcardicons",'[1,1,1]');
                    this.subData.icons = this.shopData.idcardIcons;
                    sessionStorage.setItem("images",JSON.stringify(this.subData));
                }
                if(this.shopData.licenseIcons!=''&&this.shopData.licenseIcons!=null){
                    sessionStorage.setItem("license",JSON.stringify(this.shopData.licenseIcons));
                    this.subData.licenseIcons = this.shopData.licenseIcons;
                    sessionStorage.setItem("images",JSON.stringify(this.subData));
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
                bucket:this.commonService.namespaceStore,
                icons:imglist
            }
        }).then(data=>{
            if(data.code==200){
                var values=data.result;
                for(var key in values){
                    for(var k in values[key]){
                      this.shopData.icons[index].path = values[key][k];
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
                    // this.delPictrue.push(this.shopData.icons[this.idx].path.split("/")[3]);
                }
            },{
                text: '删除图片',
                handler: () => {
                    if(idx==0){
                        this.commonService.toast("封面图片不能删除");
                    }else{
                        console.log(this.shopData.icons[this.idx].path.split("/")[3])
                        // this.delPictrue.push(this.shopData.icons[this.idx].path.split("/")[3]);
                        // this.deleteImge();
                        this.shopData.icons[this.idx].path='assets/images/shopDefault.png';

                    }
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
    //             bucket:this.commonService.namespaceStore,
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
                                this.shopData.icons[this.idx].path = values[key][k];
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
    /*提交数据*/
    submitData(){
        // this.shopData.icons = JSON.parse('[{"path":"http://oq6gv60qr.bkt.clouddn.com/Fku2l3YYo2NLwXLdv83jlI8D3hsu"},{"path":"http://oq6gv60qr.bkt.clouddn.com/FtZgBy4vQSliZm7h3DGLTLZ4wK2e"},{"path":"http://oq6gv60qr.bkt.clouddn.com/Fpvb7ZeyRc3k_DMsKDM-L-4ca7p6"}]')
        console.log("iocs------->>>>>  "+JSON.stringify(this.shopData.icons))
        if(this.validator()){
            let sdata;
            if(!this.idcardIcons){
	            	sdata={
                  id:this.shopData.id,
                  storeName:this.shopData.storeName,
                  province:this.shopData.province,
                  city:this.shopData.city,
                  county:this.shopData.county,
                  addr:this.shopData.addr,
                  businessScope:this.shopData.businessScope,
                  detail:this.shopData.detail,
                  servicePhone:this.shopData.servicePhone,
                  bucket:this.commonService.namespaceStore,
                  delIcons:[],
                  icon:this.shopData.icons[0].path,
                  icons:[],
                  licenseIcons:this.shopData.licenseIcons,
                  idcardIcons:this.shopData.idcardIcons,

                  provinceCode:(this.procode!=''&&this.procode!=null)?this.procode:this.shopData.provinceCode,
                  countyCode:(this.countycode!=''&&this.countycode!=null)?this.countycode:this.shopData.countyCode,
                  cityCode:(this.citycode!=''&&this.citycode!=null)?this.citycode:this.shopData.cityCode,
                  latitude:(this.shopData.latitude!=''&&this.shopData.latitude!=null)?this.shopData.latitude:this.mapaddr.latitude,
                  longitude:(this.shopData.longitude!=''&&this.shopData.longitude!=null)?this.shopData.longitude:this.mapaddr.longitude
	            };

              for(let o in this.shopData.icons){
                  if(this.shopData.icons[o].path.indexOf('assets')<0){
                    console.log("----path "+this.shopData.icons[o].path);
                      sdata.icons.push(this.shopData.icons[o]);
                  }
              }
          }else{
            		sdata={
                    id:this.shopData.id,
                    storeName:this.shopData.storeName,
                    province:this.shopData.province,
                    city:this.shopData.city,
                    county:this.shopData.county,
                    addr:this.shopData.addr,
                    businessScope:this.shopData.businessScope,
                    detail:this.shopData.detail,
                    servicePhone:this.shopData.servicePhone,
                    bucket:this.commonService.namespaceStore,
                    delIcons:[],
                    icon:this.shopData.icons[0].path,
                    icons:[],
  	                idcardIcons:JSON.parse(sessionStorage.getItem("images")).icons,
    				        licenseIcons:JSON.parse(sessionStorage.getItem("images")).licenseIcons,

                    provinceCode:(this.procode!=''&&this.procode!=null)?this.procode:this.shopData.provinceCode,
                    countyCode:(this.countycode!=''&&this.countycode!=null)?this.countycode:this.shopData.countyCode,
                    cityCode:(this.citycode!=''&&this.citycode!=null)?this.citycode:this.shopData.cityCode,
                    latitude:(this.shopData.latitude!=''&&this.shopData.latitude!=null)?this.shopData.latitude:this.mapaddr.latitude,
                    longitude:(this.shopData.longitude!=''&&this.shopData.longitude!=null)?this.shopData.longitude:this.mapaddr.longitude
		            };
                for(let o in this.shopData.icons){
                    if(this.shopData.icons[o].path.indexOf('assets')<0){
                        sdata.icons.push(this.shopData.icons[o]);
                    }
                }
            }
            this.isDisable = true;
            this.commonService.httpPost({
                url:this.commonService.baseUrl+'/user/store/newedit',
                data:sdata
            }).then(data=>{
                if(data.code==200){
                    this.commonService.toast("修改商铺资料成功");
                    this.goToBackPage();
                    sessionStorage.removeItem("images");
                    sessionStorage.removeItem("icons");
                    sessionStorage.removeItem("licenseIcons");
                    sessionStorage.removeItem("idcardicons");
                }else{
                    this.isDisable = false;
                    this.commonService.alert("系统提示",data.msg);
                }
            });
        }

    }

    /*验证数据*/
    validator(){

        if(this.shopData.storeName==''){
            this.commonService.toast('商铺名称不能为空');
            return false;
        }

        // if(this.shopData.inviteCode!=null && this.shopData.inviteCode!='' && this.shopData.inviteCode.length!=6){
        //     this.commonService.toast('邀请码长度必须为6');
        //     return false;
        // }

        if(this.shopData.detail==''){
            this.commonService.toast('商铺介绍不能为空');
            return false;
        }

        if(this.shopData.detail.length<30){
            this.commonService.toast('商铺介绍不能少于30个字');
            return false;
        }
    		if(this.shopData.servicePhone==''){
    			this.commonService.toast('客服电话不能为空');
    			return false;
    		}
        if(!(/^\d{1,20}$/.test(this.shopData.servicePhone))){
            this.commonService.toast('客服电话格式有误, 请输入数字号码');
            return false;
    		}
    		this.isChoProject = JSON.parse(sessionStorage.getItem("idcardicons"));
    		if(this.idcardIcons){
      			if(this.isChoProject == null){
      				this.commonService.toast('请上传资质照片');
      				return false;
      			}else{
      				if(this.isChoProject[0]==0 || this.isChoProject[1]==0 || this.isChoProject[2]==0){
      		        	this.commonService.toast('请上传资质照片');
      		        	return false;
      		        }
      			}
    		}
        if(this.shopData.latitude==null || this.shopData.longitude==null||this.shopData.latitude=='' || this.shopData.longitude==''){
            if(this.mapaddr==null || this.mapaddr == ''){
                this.commonService.toast('请设置店铺定位');
                return false;
            }
        }

        return true;
    }


    /*上传资质认证*/
    uploadAptitude(){

    	this.navCtrl.push(UploadAptitudePage,{"flag":1});
    }
    gotoBaiduMap(){
        this.navCtrl.push(BaiduMapPage);
    }


}
