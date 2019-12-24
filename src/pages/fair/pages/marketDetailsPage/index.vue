<template>
  <div class="xq-container">
    <div class="dian-que-kj" v-if="noShow">
      <img src="../../../../assets/images/nodianpu.png"/>
      <div class="dian-que-desc">宝贝已下架</div>
    </div>
    <div v-if="!noShow">
    <!--轮播图start-->
    <div class="xq-swiper-kj">
      <swiper indicator-dots autoplay style="height: 100%;">
        <swiper-item v-for="(item,index) in editData.images" :key="index">
          <img mode="aspectFit" :src="item.img_url"  @click="bigLook(item.img_url,index)">
        </swiper-item>
      </swiper>
    </div>
    <!--轮播图end-->
    <!--标题start-->
    <div class="xq-title">{{editData.name}}</div>
    <!--标题end-->
    <!--宝贝描述start-->
    <div class="xq-desc">
      <div class="xq-b-titlle">宝贝介绍</div>
        <div class="xq-b-list">
          <ul>
            <li class="cq-b-li-a">年代<i></i></li>
            <li class="cq-b-li-b">{{editData.times}}</li>
            <li class="cq-b-li-a">尺寸<i></i></li>
            <li class="cq-b-li-b">{{editData.size}}</li>
            <li class="cq-b-li-a">材质<i></i></li>
            <li class="cq-b-li-b">{{editData.material}}</li>
            <li class="cq-b-li-a">所属类别<i></i></li>
            <li class="cq-b-li-b">{{editData.category_name}}</li>
            <li class="cq-b-li-a">说明<i></i></li>
            <li class="cq-b-li-b">{{editData.description}}</li>
          </ul>
        </div>
    </div>
    <div class="xq-r-kj">
      <img :src="icon"  class="xq-r-tou"  @click="lookShopEdit(shop.id)" />
      <div class="xq-r-address"  @click="lookShopEdit(shop.id)" >{{shop.name}}</div>

      <div class="xq-like-icon" v-if="store.state != 1">
        <img src="../../../../assets/images/zan_a_icon.png" class="xq-like-xh" v-if="shop.is_favorite =='0'" @click.stop="getShopLike('1')"/>
        <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh" v-if="shop.is_favorite =='1'"  @click.stop="getShopLike('2')"/>
      </div>
      <button v-if="store.state == 1" open-type="getUserInfo" @getuserinfo="bindGetUserInfoShopLike" style="width: 20%;margin: 0">
        <div class="xq-like-icon">
          <img src="../../../../assets/images/zan_a_icon.png" class="xq-like-xh" v-if="shop.is_favorite =='0'"/>
          <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh" v-if="shop.is_favorite =='1'"/>
        </div>
      </button>
    </div>
    <!--宝贝描述end-->
    <!--相关推荐start-->
    <div class="xq-recomm-kj" v-if="rec_goods.length">
      <div class="xq-recomm-title">相关推荐</div>
      <div class="xq-recomm-item">
        <div class="xq-recomm-list" v-for="(item,index) in rec_goods" :key="index" @click="goodsTj(item.id)">
          <img :src="item.img_url"/>
          <div class="xq-recomm-name">{{item.name}}</div>
        </div>
      </div>
    </div>
    <!--相关推荐end-->
    <!--底部start-->
    <div class="xq-footer-kj">

        <!--投诉-->
        <div v-if="store.state != 1 && store.state != 2" style="width: 20%;margin: 0;padding: 0;"  class="xq-footer-a" @click="toUrl('/pages/myCenter/pages/complaintPage/main')">投诉</div>
        <button v-if="store.state == 1" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" style="width: 20%;margin: 0;padding: 0;"><div class="xq-footer-a" >投诉</div></button>
        <button v-if="store.state == 2" open-type="getPhoneNumber" @getphonenumber="bindGetPhoneNumberSuggestions" style="width: 20%;margin: 0;padding: 0;"><div class="xq-footer-a" >投诉</div></button>

        <!--我也要开店-->
        <div v-if="!editData.has_shop && store.state != 1 && store.state != 2" style="width: 25%;margin: 0;padding: 0;" class="xq-footer-b" @click="openShop" >我也要开店</div>
        <button v-if="!editData.has_shop && store.state == 1" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" style="width: 25%;margin: 0;padding: 0;"><div class="xq-footer-b" >我也要开店</div></button>
        <button v-if="!editData.has_shop && store.state == 2" open-type="getPhoneNumber" @getphonenumber="bindGetPhoneNumberCreateShop" style="width: 25%;margin: 0;padding: 0;"><div class="xq-footer-b">我也要开店</div></button>

        <!--我的店铺-->
        <div v-if="editData.has_shop" class="xq-footer-b" @click="toUrl('/pages/myCenter/pages/myShop/main')" style="width: 25%;margin: 0;padding: 0;">我的店铺</div>

        <!--热度-->
        <div class="xq-footer-c" style="width: 30%;margin: 0;padding: 0;">热度：{{editData.hot}}</div>

        <!--我要看货-->
        <div v-if="store.state != 1 && store.state != 2" class="xq-footer-d" style="width: 25%;margin: 0;padding: 0;"  @click="goodsPoster(0)">我要看货</div>
        <button v-if="store.state == 1" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" style="width: 25%;margin: 0;padding: 0;"><div class="xq-footer-d">我要看货</div></button>
        <button v-if="store.state == 2" open-type="getPhoneNumber" @getphonenumber="bindGetPhoneNumber" style="width: 25%;margin: 0;padding: 0;"><div class="xq-footer-d">我要看货</div></button>

    </div>
    <!--底部end-->
    <van-dialog
      use-slot
      :show="show"
      confirm-button-text="保存图片"
      confirm-button-color="red"
      :show-cancel-button="cancelshow"
      :closeOnClickOverlay="cloasDialog"
      :lockScroll="lockScroll"
      @close="closeDialog"
      @confirm="shareHai"
    >
     <div class="dialog-good-info">
        <div class="good-info-div">
          <img :src="'data:image/jpeg;base64,'+shopInfo.goods_image" alt="" style="display: block" mode="aspectFit"/>
        </div>
       <div class="dialog-good-title">{{shopInfo.goods_name}}</div>
       <div class="dialog-list">
          <div class="dialog-list-left">店主手机</div>
          <div class="dialog-list-right">{{shopInfo.shop_mobile}}</div>
       </div>
       <div class="dialog-list">
         <div class="dialog-list-left">店铺名称</div>
         <div class="dialog-list-right">{{shopInfo.shop_name}}</div>
       </div>
     </div>
    </van-dialog>
      <!--返回首页start-->
        <backHome></backHome>
      <!--返回首页end-->
      <div class="include" v-if="canvasIMgShow">
        <painter class="canvas" @imgOK="onImgOk" :palette="template" :customStyle="customStyle"/>
      </div>
  </div>
  </div>
</template>

<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  import store from '../../../../utils/store'
  import global from '../../../../utils/global'
  import backHome from '../../../../components/backhome/backhome'
  import { base64src } from '../../../../utils/base64src.js'
  export default {
    data () {
      return {
        icon: '/static/images/defaultphoto.jpeg',
        shopInfo: {},
        imgBG: '',
        lockScroll: true,
        canvasIMgShow: false,
        customStyle: 'width:630rpx;height:660rpx;left:50%;transform: translate(-50%)',
        template: {},
        cloasDialog: true,
        cancelshow: false,
        show: false,
        shop: {},
        editData: [],
        rec_goods: {},
        shareImg: '',
        goodsId: '',
        reason: '',
        hasClick: false,
        hasAgreeDisclaimer: false,
        store: store
      }
    },
    components: {backHome},
    onLoad (option) {
      wx.hideHomeButton()
      let _this = this
      _this.goodsId = option.id
      if (store.flag) {
        _this.getDianPuEdit()
      } else {
        store.callback = function () {
          _this.getDianPuEdit()
        }
      }
      // 获取
      _this.goodsPoster(1)
    },
    onShow () {
      let _this = this
      let pages = getCurrentPages()
      let currPage = pages[pages.length - 1]
      if (currPage.data && currPage.data.hasAgreeDisclaimer){
        this.hasAgreeDisclaimer = true
        _this.goodsPoster(0)
      }
      wx.hideHomeButton()
    },
    onUnload () {
      let _this = this
      _this.lockScroll = true
      _this.shopInfo = {}
      _this.imgBG = ''
      _this.lockScroll = true
      _this.canvasIMgShow = false
      _this.customStyle = 'width:630rpx;height:660rpx;left:50%;transform: translate(-50%)'
      _this.template = {}
      _this.cloasDialog = true
      _this.cancelshow = false
      _this.show = false
      _this.shop = {}
      _this.editData = []
      _this.rec_goods = {}
      _this.shareImg = ''
      _this.hasAgreeDisclaimer = false
      _this.icon = '/static/images/defaultphoto.jpeg'
    },
    methods: {
      onImgOk (e) {
        this.shareImg = e.mp.detail.path
      },
      // 绘制样式
      save (qrcode, goodName, mobile, shopName) {
        let _this = this
        _this.template = {
          background: '/static/images/white_bg.png',
          width: '630rpx',
          height: '660rpx',
          backgroundRepeat: 'repeat',
          views: [
            {
              type: 'image',
              url: qrcode,
              css: {
                top: '30rpx',
                left: '30rpx',
                width: '570rpx',
                height:'430rpx',
                mode:'scaleToFill'
              }
            },
            {
              type: 'text',
              text: goodName,
              css: {
                color: '#000000',
                top: '490rpx',
                left: '30rpx',
                width: '572rpx',
                height: '35rpx',
                fontSize: '34rpx',
                fontFamily: 'PingFang SC',
                fontWeight: '500'
              }
            },
            {
              type: 'text',
              text: '店铺手机',
              css: {
                color: '#666666',
                top: '540rpx',
                left: '30rpx',
                width: '120rpx',
                height: '35rpx',
                fontSize: '30rpx',
                fontFamily: 'PingFang SC',
                fontWeight: '400'
              }
            },
            {
              type: 'text',
              text: mobile,
              css: {
                color: '#000000',
                top: '540rpx',
                left: '172rpx',
                width: '380rpx',
                height: '35rpx',
                fontSize: '30rpx',
                fontFamily: 'PingFang SC',
                fontWeight: '400'
              }
            },
            {
              type: 'text',
              text: '店铺名称',
              css: {
                color: '#666666',
                top: '580rpx',
                left: '30rpx',
                width: '120rpx',
                height: '35rpx',
                fontSize: '30rpx',
                fontFamily: 'PingFang SC',
                fontWeight: '400'
              }
            },
            {
              type: 'text',
              text: shopName,
              css: {
                color: '#000000',
                top: '580rpx',
                left: '172rpx',
                width: '380rpx',
                height: '35rpx',
                fontSize: '30rpx',
                fontFamily: 'PingFang SC',
                fontWeight: '400'
              }
            }
          ]
        }
      },
      openShop () {
        if (this.editData.is_prime) {
          this.toUrl('/pages/myCenter/pages/openShopPage/main')
        } else {
          this.toUrl('/pages/myCenter/pages/openVipPage/main')
        }
      },
      bindGetUserInfoShopLike (e) {
        if (e.mp.detail.userInfo) {
          store.state = 2
          global.findUserQuery()
          this.getShopLike((this.shop.is_favorite === 0) ? '1' : '2', this.shop.id)
        }
      },
      bindGetPhoneNumberSuggestions (e) {
        let _this = this
        if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') {
          return false
        }
        if (e.mp.detail) {
          wxService.request({
            url: api.login.getWxXcxMobile,
            method: 'get',
            data: {
              token: wx.getStorageSync('token'),
              iv: e.mp.detail.iv,
              encryptedData: e.mp.detail.encryptedData
            },
            success: function (res) {
              if (res.code === 0) {
                store.state = 0
                wx.setStorageSync('userInfo', Object.assign(wx.getStorageSync('userInfo') || {}, {'mobile': res.data.phone}))
                _this.regPhone(res.data.phone)
                global.findUserQuery()
                _this.toUrl('/pages/myCenter/pages/complaintPage/main')
              }
            }
          })
        }
      },
      bindGetPhoneNumberCreateShop (e) {
        let _this = this
        if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') {
          return false
        }
        if (e.mp.detail) {
          wxService.request({
            url: api.login.getWxXcxMobile,
            method: 'get',
            data: {
              token: wx.getStorageSync('token'),
              iv: e.mp.detail.iv,
              encryptedData: e.mp.detail.encryptedData
            },
            success: function (res) {
              if (res.code === 0) {
                store.state = 0
                wx.setStorageSync('userInfo', Object.assign(wx.getStorageSync('userInfo') || {}, {'mobile': res.data.phone}))
                _this.regPhone(res.data.phone)
                global.findUserQuery()
                _this.toUrl('/pages/myCenter/pages/openVipPage/main')
              }
            }
          })
        }
      },
      bindGetUserInfo (e) {
        if (e.mp.detail.userInfo) {
          wxService.request({
            url: api.login.getWxUserInfo,
            method: 'get',
            data: {
              token: wx.getStorageSync('token'),
              iv: e.mp.detail.iv,
              encryptedData: e.mp.detail.encryptedData
            },
            success: function (res) {
              if (res.code === 0) {
                store.state = 2
                global.findUserQuery()
              }
            }
          })
        }
      },
      bindGetPhoneNumber (e) {
        let _this = this
        if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') {
          return false
        }
        if (e.mp.detail) {
          wxService.request({
            url: api.login.getWxXcxMobile,
            method: 'get',
            data: {
              token: wx.getStorageSync('token'),
              iv: e.mp.detail.iv,
              encryptedData: e.mp.detail.encryptedData
            },
            success: function (res) {
              if (res.code === 0) {
                store.state = 0
                wx.setStorageSync('userInfo', Object.assign(wx.getStorageSync('userInfo') || {}, {'mobile': res.data.phone}))
                _this.regPhone(res.data.phone)
                global.findUserQuery()
                _this.goodsPoster(0)
              }
            }
          })
        }
      },
      /** call api */
      regPhone (phone) {
        wxService.request({
          url: api.login.phoneReg,
          method: 'post',
          data: {
            token: wx.getStorageSync('token'),
            user_id: wx.getStorageSync('user_id'),
            mobile: phone
          },
          success: function (res) {
          }
        })
      },
      shareHai () {
        let _this = this
        wx.getSetting({
          success (res) {
            if (res.authSetting['scope.writePhotosAlbum'] === false) {
              wx.openSetting({ success (res) { } })
            } else {
              wx.saveImageToPhotosAlbum({
                filePath: _this.shareImg,
                success: function (res) {
                  wx.showToast({ title: '保存成功', icon: 'success', duration: 1000 })
                }
              })
            }
          }
        })
      },
      bigLook (url, index) {
        let urls = []
        let objkeys = Object.keys(this.editData.images)
        for (let i = 0; i < objkeys.length; i++) {
          if (objkeys.length[i] !== '') {
            urls.push(this.editData.images[i].img_url)
          }
        }
        wx.previewImage({
          current: urls[index],
          urls: urls
        })
      },
      closeDialog () {
        let _this = this
        _this.show = false
      },
      // 店铺详情
      lookShopEdit (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/dianpuDetailPage/main?id=' + id
        })
      },
      // 相关推荐跳转
      goodsTj (id) {
        wx.redirectTo({
          url: '/pages/fair/pages/marketDetailsPage/main?id=' + id
        })
      },
      toUrl (url) {
        wx.navigateTo({ url: url })
      },
      goodsPoster (status = 0) {
        let _this = this
        if (!status) {
          if (!_this.hasAgreeDisclaimer) {
            wx.navigateTo({ url: '/pages/disclaimer/main' })
            return false
          }
        }
        if (_this.hasClick) {
          return false
        }
        _this.hasClick = true
        wxService.request({
          url: api.twoapi.goodsPoster,
          method: 'get',
          data: {
            'id': _this.goodsId,
            'status': status,
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            _this.hasClick = false
            if (res.code === 0) {
              _this.hasAgreeDisclaimer = false
              if (status === 1) {
                _this.canvasIMgShow = true
                base64src('data:image/jpeg;base64,' + res.data.goods_image, rest => {
                  _this.save(rest, res.data.goods_name, res.data.shop_mobile, res.data.shop_name)
                })
              } else {
                _this.editData.hot += 1
                _this.show = true
              }
              // 店铺信息
              _this.shopInfo = res.data
            }
          }
        })
      },
      getShopLike (val) {
        let _this = this
        wxService.request({
          url: api.twoapi.shopBadyLike,
          method: 'post',
          data: {
            'token': wx.getStorageSync('token'),
            'type': '1',
            'act': val,
            'type_id': _this.shop.id
          },
          success: function (res) {
            if (res.code === 0) {
              if (val === '1') {
                _this.shop.is_favorite = '1'
              } else if (val === '2') {
                _this.shop.is_favorite = '0'
              }
            }
          }
        })
      },
      // 获取详情
      getDianPuEdit () {
        let _this = this
        wxService.request({
          url: api.twoapi.marketGoodsShow,
          method: 'get',
          data: {
            'goods_id': _this.goodsId,
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.code === 0) {
              _this.editData = res.data
              _this.rec_goods = res.data.rec_goods
              _this.shop = res.data.shop
              if (_this.shop.icon !== '') {
                _this.icon = _this.shop.icon
              }
            } else {
              _this.noShow = true
            }
          }
        })
      }
    },
    onShareAppMessage () {
      let _this = this
      return {
        title: _this.editData.name,
        imageUrl: _this.editData.images[0].img_url,
        path: `pages/fair/pages/marketDetailsPage/main?id=${_this.goodsId}&user_id=${wx.getStorageSync('user_id')}&shareStatus=1`
      }
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
  }
</style>
<style lang="scss" scoped>
  .dialog-good-info{
    padding: 30rpx;
    .good-info-div{
      width:100%;
      height:430rpx;
      img{
        width: 100%;
        height: 100%;
      }
    }
    .dialog-good-title{
      font-size:34rpx;
      margin-top: 20rpx;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(0,0,0,1);
    }
    .dialog-list{
      display: flex;
      align-items: center;
      flex-direction: row;
      .dialog-list-left{
        width: 30%;
        font-size:30rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(102,102,102,1);
        line-height:47rpx;
      }
      .dialog-list-right{
        width: 70%;
        font-size:30prx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,1);
        line-height:47rpx;
      }
    }
  }
.xq-container{
  .include{
    position: relative;
    height:10rpx;
    width: 750rpx;
    left:-100vh;
    top:-100vh;
  }
  .canvas{
    width: 100%;
    position: absolute;
  }
  padding-bottom: 120rpx;
  .dian-que-kj{
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img{
      width:141rpx;
      height:109rpx;
    }
    .dian-que-desc{
      width: 100%;
      margin-top: 30rpx;
      font-size: 32rpx;
      color:#ACACAC;
      text-align: center;
      font-family: PingFangSC-Regular;
    }
  }
   .xq-swiper-kj{
     height: 350rpx;
     text-align:center;
     background-color:#fafafa;
     img {
       height: 100%
     }
   }
  .xq-title{
    background-color: #ffffff;
    text-align: left;
    font-size: 34rpx;
    color:#000000;
    padding: 30rpx;
    font-family: PingFangSC-Medium;
    border-bottom: 2rpx solid  rgba(238,238,238,1);
  }
  .xq-desc{
    padding: 30rpx;
    background-color: #ffffff;
    border-bottom: 2rpx solid  rgba(238,238,238,1);
    .xq-b-titlle{
      font-size: 30rpx;
      color:#000000;
      text-align: left;
      margin-bottom: 20rpx;
      font-family: PingFangSC-Medium;
    }
    .xq-b-list{
      ul{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        li{
          margin-bottom: 10rpx;
        }
        li:nth-last-child(1){
          margin-bottom: 0;
        }
        .cq-b-li-a{
          width: 18%;
          color:#666666;
          font-size: 28rpx;
          height: 50rpx;
          text-align: justify;
          margin-right: 30rpx;
          i{
            display:inline-block;
            width:100%;
            height:0;
          }
        }
        .cq-b-li-b{
          width: 74%;
          color: #000000;
          font-size: 28rpx;
          min-height: 50rpx;
        }
      }
    }
  }
  .xq-r-kj{
    padding: 20rpx 30rpx 20rpx 150rpx;
    box-sizing: border-box;
    width:100%;
    background-color: #ffffff;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    button{
      border: none;
      outline-style: none;
      background-color: #fff;
      outline:none;
      display: flex;
      padding: 0;
      border-radius: 0;
      margin: 0;
    }
    button::after {
      border: none;
    }
    .xq-r-tou{
      position: absolute;
      left: 30rpx;
      top: 20rpx;
      width: 100rpx;
      height: 100rpx;
      border-radius: 50%;
    }
    .xq-r-address{
      width: 80%;
      color: #000000;
      font-size:30rpx;
      font-family:PingFang SC;
      font-weight:500;
      color:rgba(0,0,0,1);
      height: 100rpx;
      line-height: 100rpx;
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
    .xq-like-icon{
      width: 100%;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .xq-like-xh{
        width: 44rpx;
        height: 42rpx;
      }
    }
  }
  .xq-recomm-kj{
    margin-top: 20rpx;
    padding: 30rpx;
    background-color: #ffffff;
    .xq-recomm-title{
      font-size: 34rpx;
      color:#000000;
      text-align: center;
      font-family: PingFangSC-Medium;
    }
    .xq-recomm-item{
      display: flex;
      flex-direction: row;
      margin-top: 20rpx;
      .xq-recomm-list{
        width: 32%;
        display: flex;
        flex-direction: column;
        margin-right: 2%;
        border:1rpx solid #DCDCDC;
        img{
          width: 100%;
          height: 163rpx;
        }
        .xq-recomm-name{
          font-size: 24rpx;
          color:#000000;
          text-align: left;
          border-top:1rpx solid #DCDCDC;
          padding: 10rpx;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          box-sizing: border-box;
          width: 100%;
        }
      }
      .xq-recomm-list:nth-last-child(1){
        margin-right: 0;
      }
    }
  }
  .xq-footer-kj{
    width: 100%;
    position: fixed;
    left: 0;
    bottom: 0;
    background-color: #ffffff;
    display: flex;
    flex-direction: row;
    button{
      border: none;
      outline-style: none;
      background-color: #fff;
      outline:none;
      display: flex;
      padding: 0;
      border-radius: 0;
    }
    button::after {
      border: none;
    }
    div{
      height: 100rpx;font-size: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color:#000000;
    }
    .xq-footer-a{
      width: 100%;
      border-right:1rpx solid rgba(245, 245, 249, 1);
    }
    .xq-footer-b{
      width: 100%;
      border-right:1rpx solid rgba(245, 245, 249, 1);
    }
    .xq-footer-c{
      width: 30%;
    }
    .xq-footer-d{
      width:100%;
      background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
    }
  }
}
</style>
