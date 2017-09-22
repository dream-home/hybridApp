import { Component } from '@angular/core';
import { NavController,NavParams} from 'ionic-angular';
import { CommonService } from '../../app/app.base';
import { Area } from '../../app/app.data';
@Component({
  selector: 'page-selectAddress',
  templateUrl: 'selectAddress.html',
  providers:[Area]
})
export class SelectAddressPage {
   public userAddress:any={//保存当前选中的地址
            province:'',//省份
            city:'',//城市
            county:'',//区县
            areaId:''//地区代码，填写最小的
   };
   provinces:any[];//省列表
    citys:any[];//城市列表
    countys:any[];//区县列表
    flag:number=1;//判断当前显示的是什么 1.省份列表 2城市列表 3区县列表

    type:number=1;//判断选择的是什么
   // value:string="";//判断传过来的值是什么
  constructor(public navCtrl: NavController,private commonService: CommonService,public area:Area,public params: NavParams) {
      
      this.type=this.params.get("type");
      this.userAddress=JSON.parse(this.params.get("value"));

        if(this.type==1||this.userAddress.areaId==""){
          this.provinces = this.area.areaColumns[0].options;
        }
       
        if(this.type==2&&this.userAddress.areaId!=""){
          let id=this.area.findIdByProvince(this.userAddress.province);
           this.findCitys(id,this.userAddress.province);
        }

        if(this.type==3&&this.userAddress.areaId!=""){
           let id=this.area.findIdByCity(this.userAddress.city);
           this.findCountys(id,this.userAddress.city);
        }

  }
   

 ionViewWillEnter(){
     
      }


  /*返回上一页*/
    goToBackPage(){
     
        this.navCtrl.pop();
    }

   

    //根据省份查找城市
     findCitys(areaid,areavalue){
        this.citys = this.area.findCityLisByPid(areaid);
        this.flag=2;
        this.userAddress.province=areavalue;
        //console.log(this.citys);
    }
    //根据城市超找区县
     findCountys(areaid,areavalue){
        this.flag=3;
        this.countys = this.area.findAreaLisByPid(areaid);
        this.userAddress.city=areavalue;
        //console.log("区县"+this.countys);
    }
    //选择区县的时候返回上一页
    sureCounty(areaid,areavalue){
      this.userAddress.county=areavalue;
      this.userAddress.areaId=areaid;
      //设置用户地区参数
      var str=JSON.stringify(this.userAddress);
      sessionStorage.setItem("userAddress",str);
      this.navCtrl.pop();
    }
}
