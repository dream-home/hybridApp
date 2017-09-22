import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MyApp } from './app.component';
import { CommonService } from './app.base';
import { LeaguesPage } from '../pages/leagues/leagues';
import { GoodLuckPage } from '../pages/goodLuck/goodLuck';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MessagePage } from '../pages/message/message';
import { FmyPage } from '../pages/fmy/fmy';
import { LoginPage } from '../pages/login/login';
import { GoodsInfoPage } from '../pages/goodsInfo/goodsInfo';
import { IntegroWalletPage } from '../pages/integroWallet/integroWallet';
import { MyAuctionPage } from '../pages/myAuction/myAuction';
import { MyContactsPage } from '../pages/myContacts/myContacts';
import { MyCollectionPage } from '../pages/myCollection/myCollection';
import { SysSettingPage } from '../pages/sysSetting/sysSetting';
import { MobileSettingPage } from '../pages/mobileSetting/mobileSetting';
import { PayPwSettingPage } from '../pages/payPwSetting/payPwSetting';
import { UserInfoPage } from '../pages/userInfo/userInfo';
import { GiveScorePage } from '../pages/giveScore/giveScore';
import { GoodsSellPage } from '../pages/goodsSell/goodsSell';
import { OrderInfoPage } from '../pages/orderInfo/orderInfo';
import { MyShopPage} from '../pages/myShop/myShop';
import { ShopConditionPage } from '../pages/shopCondition/shopCondition';
import { NewShopPage } from '../pages/newShop/newShop';
import { AddGoodsPage } from '../pages/addGoods/addGoods';
import { GoodsDetailPage } from '../pages/goodsDetail/goodsDetail';
import { EditGoodsPage } from '../pages/editGoods/editGoods';
import { EditShopPage } from '../pages/editShop/editShop';
import { SellerShopPage } from '../pages/sellerShop/sellerShop';
import { SellerPayPage } from '../pages/sellerPay/sellerPay';
import { SellerGoodsInfoPage } from '../pages/sellerGoodsInfo/sellerGoodsInfo';
import { SearchShopPage } from '../pages/searchShop/searchShop';
import { ConsumingMessagePage } from '../pages/consumingMessage/consumingMessage';
import { BeatMessagePage } from '../pages/beatMessage/beatMessage';
import { SystemMessagePage } from '../pages/systemMessage/systemMessage';
import { BeatInfoPage } from '../pages/beatInfo/beatInfo';
import { LuckyInfoPage } from '../pages/luckyInfo/luckyInfo';
import { SystemInfoPage } from '../pages/systemInfo/systemInfo';
import { MyGoodsPage } from '../pages/myGoods/myGoods';
import { ShareFriendPage } from '../pages/shareFriend/shareFriend';
import { ScoreRecordPage } from '../pages/scoreRecord/scoreRecord';
import { ScoreInfoPage } from '../pages/scoreInfo/scoreInfo';
import { SellerProfitPage } from '../pages/sellerProfit/sellerProfit';
import { SellerOrderPage } from '../pages/sellerOrder/sellerOrder';
import { BusinessOrderPage } from '../pages/businessOrder/businessOrder';
import { SellerOrderInfoPage } from '../pages/sellerOrderInfo/sellerOrderInfo';
import { ScoreExchangePage } from '../pages/scoreExchange/scoreExchange';
import { RechargePage } from '../pages/recharge/recharge';
import { SellerShopInfoPage } from '../pages/sellerShopInfo/sellerShopInfo';
import { OtherLoginPage } from '../pages/otherLogin/otherLogin';
import { LoginPwdSettingPage } from '../pages/loginPwdSetting/loginPwdSetting';
import { FindPwdPage } from '../pages/findPwd/findPwd';
import { AboutPage } from '../pages/about/about';
import { BuyGoodsPage } from '../pages/buyGoods/buyGoods';
import { ViewImgPage } from '../pages/viewImg/viewImg';
import { QuickPayInfoPage } from '../pages/quickPayInfo/quickPayInfo';
import { ConsumingInfoPage } from '../pages/consumingInfo/consumingInfo';
import { UserAgreementPage } from '../pages/userAgreement/userAgreement';
import { ShopAgreementPage } from '../pages/shopAgreement/shopAgreement';
import { FindCityPage } from '../pages/findCity/findCity';
import { MyPartnerPage } from '../pages/myPartner/myPartner';
import { UpdateMessagePage } from '../pages/updateMessage/updateMessage';
import { ReceivablesPage } from '../pages/receivables/receivables';
import { SetAmountPage } from '../pages/setAmount/setAmount';
import { ScanPage } from '../pages/scan/scan';
import { PayCompletedPage } from '../pages/payCompleted/payCompleted';
import { ShoppingCartPage } from '../pages/shoppingCart/shoppingCart';
import { UploadAptitudePage } from '../pages/uploadAptitude/uploadAptitude';
import { ShopCodePage } from '../pages/shopCode/shopCode';
import { CodeCollectionBillPage } from '../pages/codeCollectionBill/codeCollectionBill';
import { CodeManagementPage } from '../pages/codeManagement/codeManagement';
import { CollectionBillInfoPage } from '../pages/collectionBillInfo/collectionBillInfo';
import { MyReceivablesCodePage } from '../pages/myReceivablesCode/myReceivablesCode';
import { MyShopCartPage } from '../pages/MyShopCart/MyShopCart';
import { PayMentPage } from '../pages/payMent/payMent';
import { PaySuccessPage } from '../pages/paySuccess/paySuccess';
import { GoodLuckEpPage } from '../pages/goodLuckEp/goodLuckEp';
import { ServiceAgreementPage } from '../pages/serviceAgreement/serviceAgreement';
import { CollectionGuidancePage } from '../pages/collectionGuidance/collectionGuidance';
import { MarketingGuidancePage } from '../pages/marketingGuidance/marketingGuidance';
import { WelcomePage } from '../pages/welcome/welcome';
import { MyScorePage } from '../pages/myScore/myScore';
import { MyEPPage } from '../pages/myEP/myEP';
import { MyDouDouPage } from '../pages/myDouDou/myDouDou';
import { AttendanceRecordPage } from '../pages/attendanceRecord/attendanceRecord';
import { MyRedopenPage } from '../pages/myRedopen/myRedopen';
import { FeedBackPage } from '../pages/feedBack/feedBack';
import { FindPayPwdPage } from '../pages/findPayPwd/findPayPwd';
import { WedebugPage } from '../pages/wedebug/wedebug';
import { BaiduMapPage } from '../pages/baiduMap/baiduMap';
import { DeliveryAddressPage } from '../pages/deliveryAddress/deliveryAddress';
import { NewAddressPage } from '../pages/newAddress/newAddress';
import { PerfectUserDataPage } from '../pages/perfectUserData/perfectUserData';
import { SelectAddressPage } from '../pages/selectAddress/selectAddress';
import { ChangeUserNamePage } from '../pages/changeUserName/changeUserName';
import { EditAddressPage } from '../pages/editAddress/editAddress';
import { SearchGoodsPage } from '../pages/searchGoods/searchGoods';
import { RegisterPage } from '../pages/register/register';
@NgModule({
  declarations: [
    MyApp,
    LeaguesPage,
    GoodLuckPage,
    GoodLuckEpPage,
    HomePage,
    TabsPage,
    MessagePage,
    FmyPage,
    LoginPage,
    GoodsInfoPage,
    IntegroWalletPage,
    MyAuctionPage,
    MyContactsPage,
    MyCollectionPage,
    SysSettingPage,
    MobileSettingPage,
    PayPwSettingPage,
    UserInfoPage,
    GiveScorePage,
    GoodsSellPage,
    OrderInfoPage,
    MyShopPage,
    ShopConditionPage,
    NewShopPage,
    AddGoodsPage,
    GoodsDetailPage,
    EditGoodsPage,
    EditShopPage,
    SellerShopPage,
    SellerPayPage,
    SellerGoodsInfoPage,
    SearchShopPage,
    ConsumingMessagePage,
    BeatMessagePage,
    SystemMessagePage,
    BeatInfoPage,
    LuckyInfoPage,
    SystemInfoPage,
    MyGoodsPage,
    ShareFriendPage,
    ScoreRecordPage,
    ScoreInfoPage,
    SellerProfitPage,
    SellerOrderPage,
    BusinessOrderPage,
    SellerOrderInfoPage,
    ScoreExchangePage,
    RechargePage,
    SellerShopInfoPage,
    OtherLoginPage,
    LoginPwdSettingPage,
    FindPwdPage,
    AboutPage,
    BuyGoodsPage,
    ViewImgPage,
    QuickPayInfoPage,
    ConsumingInfoPage,
    UserAgreementPage,
    ShopAgreementPage,
    FindCityPage,
    MyPartnerPage,
    UpdateMessagePage,
    ReceivablesPage,
    SetAmountPage,
    ScanPage,
    PayCompletedPage,
    ShoppingCartPage,
    UploadAptitudePage,
    ShopCodePage,
    CodeCollectionBillPage,
    CodeManagementPage,
    CollectionBillInfoPage,
    MyReceivablesCodePage,
    MyShopCartPage,
    PayMentPage,
    PaySuccessPage,
    ServiceAgreementPage,
    CollectionGuidancePage,
    MarketingGuidancePage,
    WelcomePage,
    MyScorePage,
    MyEPPage,
    MyDouDouPage,
    AttendanceRecordPage,
    MyRedopenPage,
    FeedBackPage,
    FindPayPwdPage,
    WedebugPage,
    BaiduMapPage,
    DeliveryAddressPage,
    PerfectUserDataPage,
    SelectAddressPage,
    ChangeUserNamePage,
    NewAddressPage,
    EditAddressPage,
    SearchGoodsPage,
    RegisterPage
  ],
  imports: [
      IonicModule.forRoot(MyApp,{
          backButtonText: '',
          iconMode: 'ios',
          modalEnter: 'modal-slide-in',
          modalLeave: 'modal-slide-out',
          tabsPlacement: 'bottom',
          pageTransition: 'ios',
          mode: 'ios',
          tabsHideOnSubPages:true
      }, {})
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LeaguesPage,
    GoodLuckPage,
    GoodLuckEpPage,
    HomePage,
    TabsPage,
    MessagePage,
    FmyPage,
    LoginPage,
    GoodsInfoPage,
    IntegroWalletPage,
    MyAuctionPage,
    MyContactsPage,
    MyCollectionPage,
    SysSettingPage,
    MobileSettingPage,
    PayPwSettingPage,
    UserInfoPage,
    GiveScorePage,
    GoodsSellPage,
    OrderInfoPage,
    MyShopPage,
    ShopConditionPage,
    NewShopPage,
    AddGoodsPage,
    GoodsDetailPage,
    EditGoodsPage,
    EditShopPage,
    SellerShopPage,
    SellerPayPage,
    SellerGoodsInfoPage,
    SearchShopPage,
    ConsumingMessagePage,
    BeatMessagePage,
    SystemMessagePage,
    BeatInfoPage,
    LuckyInfoPage,
    SystemInfoPage,
    MyGoodsPage,
    ShareFriendPage,
    ScoreRecordPage,
    ScoreInfoPage,
    SellerProfitPage,
    SellerOrderPage,
    BusinessOrderPage,
    SellerOrderInfoPage,
    ScoreExchangePage,
    RechargePage,
    SellerShopInfoPage,
    OtherLoginPage,
    LoginPwdSettingPage,
    FindPwdPage,
    AboutPage,
    BuyGoodsPage,
    ViewImgPage,
    QuickPayInfoPage,
    ConsumingInfoPage,
    UserAgreementPage,
    ShopAgreementPage,
    FindCityPage,
    MyPartnerPage,
    UpdateMessagePage,
    ReceivablesPage,
    SetAmountPage,
    ScanPage,
    PayCompletedPage,
    ShoppingCartPage,
    UploadAptitudePage,
    ShopCodePage,
    CodeCollectionBillPage,
    CodeManagementPage,
    CollectionBillInfoPage,
    MyReceivablesCodePage,
    MyShopCartPage,
    PayMentPage,
    PaySuccessPage,
    ServiceAgreementPage,
    CollectionGuidancePage,
    MarketingGuidancePage,
    WelcomePage,
    MyScorePage,
    MyEPPage,
    MyDouDouPage,
    AttendanceRecordPage,
    MyRedopenPage,
    FeedBackPage,
    FindPayPwdPage,
    WedebugPage,
    BaiduMapPage,
    DeliveryAddressPage,
    PerfectUserDataPage,
    SelectAddressPage,
    ChangeUserNamePage,
    NewAddressPage,
    EditAddressPage,
    SearchGoodsPage,
    RegisterPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler},CommonService,Storage]
})
export class AppModule {

}
