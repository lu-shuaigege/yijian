// 正式
// let regUrl = 'https://yijianapi.csztv.com'
// let userUrl = 'https://services.csztv.com'
// 测试
// let regUrl = 'https://interact1.csztv.com'
// let userUrl = 'https://servicecenter.csztv.com'
// 测试二期
// let regUrl = 'https://interact1.csztv.com'
let regUrl = 'https://yijian.test.csztv.com'
let userUrl = 'https://servicecenter.csztv.com'
let sbsmam = 'https://sbsmam.csztv.com'
let apiRoot = '/v1/'
let logUrl = 'https://mall.csztv.com/LOG/api/'
let twoUrl = 'https://yijian.test.csztv.com'
// let twoUrl = 'http://192.168.0.149'

let api = {
  default: {
    guide: `${regUrl}${apiRoot}home`,
    banner: `${regUrl}${apiRoot}banner`,
    // uploadImg: `${regUrl}${apiRoot}upload`,
    // uploadAudio: `${regUrl}${apiRoot}upload/audio`,
    submitTreasure: `${regUrl}${apiRoot}treasure`,
    disclaimer: `${regUrl}${apiRoot}disclaimer`,
    order: `${regUrl}${apiRoot}order`,
    treasureList: `${regUrl}${apiRoot}treasure/list`,
    treasureDetail: `${regUrl}${apiRoot}treasure/view`,
    // submitOrder: `${regUrl}${apiRoot}order/new`,
    orderPay: `${regUrl}${apiRoot}order/pay`,
    getCouponNum: `${twoUrl}${apiRoot}coupon/num`,
    orderCancel: `${regUrl}${apiRoot}order/cancel`,
    shareTreasure: `${regUrl}${apiRoot}share/treasure`,
    qrcode: `${regUrl}${apiRoot}qrcode`,
    userToOpenid: `${regUrl}${apiRoot}user/openid`,
    saveFormId: `${regUrl}${apiRoot}wechat/form-id`,
    ad: `${regUrl}${apiRoot}home/ad`,
    headuploadImg: `${twoUrl}${apiRoot}upload/header`,
    newuploadImg: `${twoUrl}${apiRoot}yj/upload`
  },
  erqi: {
    activityHome: `${regUrl}${apiRoot}baoming/homepage`,
    activityDetail: `${regUrl}${apiRoot}baoming/view`,
    activitySignup: `${regUrl}${apiRoot}baoming/roster/add`,
    activitySubmit: `${regUrl}${apiRoot}baoming/order/new`,
    activityPay: `${regUrl}${apiRoot}baoming/order/pay`,
    rosterList: `${regUrl}${apiRoot}baoming/roster/list`,
    rosterView: `${regUrl}${apiRoot}baoming/roster/view`,
    rosterShare: `${regUrl}${apiRoot}baoming/share/view`,
    rosterClear: `${regUrl}${apiRoot}baoming/order/clear`
  },
  login: {
    tokenReg: `${regUrl}${apiRoot}reg`,
    phoneReg: `${regUrl}${apiRoot}user/reg`,
    editContact: `${regUrl}${apiRoot}user/contact`,
    login: `${userUrl}${apiRoot}user/login`,
    userQuery: `${userUrl}${apiRoot}user/query`,
    refreshToken: `${userUrl}${apiRoot}user/refreshToken`,
    getWxOpenId: `${userUrl}${apiRoot}user/getWxOpenId`,
    getWxUserInfo: `${userUrl}${apiRoot}user/getWxUserInfo`,
    getWxXcxMobile: `${userUrl}${apiRoot}user/getWxXcxMobile`,
    updateWxUserInfo: `${userUrl}${apiRoot}user/updateWxUserInfo`,
    sendCode: `${userUrl}${apiRoot}user/sendCode`,
    bindMobile: `${userUrl}${apiRoot}user/bindMobile`
  },
  log: {
    log: `${logUrl}user/llog`,
    global: `${logUrl}user/lglobal`
  },
  twoapi: {
    homeBanners: `${twoUrl}${apiRoot}homepage/banner`,
    homePageNav: `${twoUrl}${apiRoot}homepage/nav`,
    // 商品类别
    goodCategory: `${twoUrl}${apiRoot}goods_category`,
    // 集市商品列表
    goodsList: `${twoUrl}${apiRoot}market_goods`,
    // 集市店铺列表
    marketShop: `${twoUrl}${apiRoot}market_shop`,
    // 集市店铺详情
    marketShopShow: `${twoUrl}${apiRoot}market_shop/show`,
    // 集市商品详情
    // 集市店铺详情
    marketGoodsShow: `${twoUrl}${apiRoot}market_goods/show`,
    // 店铺/宝贝关注
    shopBadyLike: `${twoUrl}${apiRoot}favorite/follow`,
    shopRecommend: `${twoUrl}${apiRoot}home/shops`,
    goodsPoster: `${twoUrl}${apiRoot}market_goods/poster`,
    shopMe: `${twoUrl}${apiRoot}shop/me`,
    favorite: `${twoUrl}${apiRoot}favorite`,
    message: `${twoUrl}${apiRoot}message`,
    goodsMe: `${twoUrl}${apiRoot}goods/me`,
    goodsStatus: `${twoUrl}${apiRoot}goods/status`,
    goodsRelease: `${twoUrl}${apiRoot}goods/release`,
    primePay: `${twoUrl}${apiRoot}prime/pay`,
    auctionPay: `${twoUrl}${apiRoot}auction/pay`,
    goodsDelete: `${twoUrl}${apiRoot}goods/delete`,
    shopUpdate: `${twoUrl}${apiRoot}shop/update`,
    qrcode: `${twoUrl}${apiRoot}qrcode/show`,
    popularizeStore: `${twoUrl}${apiRoot}popularize/store`
  },
  shopapi: {
    shopStore: `${twoUrl}${apiRoot}shop/store`,
    couponIndex: `${twoUrl}${apiRoot}prime-coupon/index`,
    userMe: `${twoUrl}${apiRoot}user/me`,
    homepageNav: `${twoUrl}${apiRoot}homepage-nav/index`,
    goodsSave: `${twoUrl}${apiRoot}goods/save`,
    shopMe: `${twoUrl}${apiRoot}shop/me`,
    userSuggestionadd: `${twoUrl}${apiRoot}user-suggestion/add`,
    daily: `${twoUrl}${apiRoot}daily`,
    dailyShow: `${twoUrl}${apiRoot}daily/show`,
    shopCheck: `${twoUrl}${apiRoot}shop/check`,
    dailyPaly: `${twoUrl}${apiRoot}daily/paly`
  },
  sbsmam: {
    yjUpload: `${sbsmam}${apiRoot}yj/upload`
  }
}

export default api
