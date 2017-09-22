export class Infoitem {
  constructor(
  	 public rank:number,
  	 public type:number,
    public content:string,
    public imglist=[],
    public model:string,
    public namespace:string,
    public remark:string)
  	{ }
}