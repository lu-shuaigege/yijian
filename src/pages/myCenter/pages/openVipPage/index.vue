<template>
  <div class="vip-container">
      <div class="vip-top-kj">
         <div class="vip-user-kj">
            <div class="vip-user-span-a"></div>
            <div class="vip-user-span-b"></div>
            <div class="vip-user-span-c">会员权益</div>
         </div>
         <div class="vip-prices">会员365元/年，前100名初始会员，享受拍照特权</div>
      </div>
      <div class="vip-list-kj">
         <div class="vip-list-item">
           <img src="../../../../assets/images/vip_icon_a.png" />
           <div class="vip-right-title">
             可以开店分享自己的收藏，并且可以参加每周线下交流会
           </div>
         </div>
        <div class="vip-list-item">
          <img src="../../../../assets/images/vip_icon_b.png" />
          <div class="vip-right-title">开通会员可以获得两张免费线下课程券</div>
        </div>
        <div class="vip-list-item">
          <img src="../../../../assets/images/vip_icon_c.png" />
          <div class="vip-right-title">开通会员可以获得十张免费鉴定券</div>
        </div>
        <div class="vip-list-item">
          <img src="../../../../assets/images/vip_icon_d.png" />
          <div class="vip-right-title">开通会员可以获得工匠商城会员专享折扣</div>
        </div>
        <div class="vip-list-item">
          <img src="../../../../assets/images/vip_icon_e.png" />
          <div class="vip-right-title">敬请期待</div>
        </div>
      </div>
      <div v-if="!user.is_prime" style="background: #f5f5f9">
        <form v-if="store.state == 0"  @submit="goPay" report-submit="true" class="vip-now-kj">
          <button form-type="submit" class="vip-now-btn" >立即开通会员</button>
        </form>

        <button v-if="store.state == 1" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" style="background: #f5f5f9">
          <form @submit="goPay" report-submit="true" class="vip-now-kj">
            <button form-type="submit" class="vip-now-btn" >立即开通会员</button>
          </form>
        </button>

        <button v-if="store.state == 2" open-type="getPhoneNumber" @getphonenumber="bindGetPhoneNumber" style="background: #f5f5f9">
          <form @submit="goPay" report-submit="true" class="vip-now-kj">
            <button form-type="submit" class="vip-now-btn" >立即开通会员</button>
          </form>
        </button>
      </div>
      <div class="vip-now-desc">
        会员说明：会员有效期为，自开通会员日起，一个自然年为一个会员期，会员到期自动失效，会员期的权益若未使用也一同失效用户可以选择续费或者放弃。
      </div>
    <!--返回首页start-->
    <backHome></backHome>
    <!--返回首页end-->
  </div>
</template>

<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  import store from '../../../../utils/store'
  import global from '../../../../utils/global'
  import backHome from '../../../../components/backhome/backhome'
  export default {
    data () {
      return {
        store: store,
        hasClick: false,
        hasAgreeDisclaimer: false,
        user: {}
      }
    },
    components: {backHome},
    onLoad (option) {
      wx.hideHomeButton()
      this.userMe()
      if (option.user_id) {
        wx.setStorageSync('recommend_user_id', option.user_id)
        wxService.request({
          url: api.twoapi.popularizeStore,
          method: 'post',
          data: {
            'token': wx.getStorageSync('token'),
            'share_id': option.user_id
          },
          success: function (res) {
          }
        })
      }
    },
    onShow () {
      this.hasAgreeDisclaimer = false
      let pages = getCurrentPages()
      let currPage = pages[pages.length - 1]
      if (currPage.data && currPage.data.hasAgreeDisclaimer){
        this.hasAgreeDisclaimer = true
      }
      wx.hideHomeButton()
      this.userMe()
    },
    methods: {
      backIndex () {
        wx.redirectTo({
          url: '/pages/homePage/main'
        })
      },
      bindGetUserInfo (e) {
        let _this = this
        if (_this.hasClick) {
          return false
        }
        _this.hasClick = true
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
              _this.hasClick = false
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
        if (_this.hasClick) {
          return false
        }
        _this.hasClick = true
        if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') {
          _this.hasClick = false
          return false
        }
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
              if (!_this.hasAgreeDisclaimer) {
                wx.navigateTo({ url: '/pages/disclaimer/main' })
                return false
              }
              wxService.request({
                url: api.twoapi.primePay,
                method: 'post',
                data: {
                  'user_id': wx.getStorageSync('user_id'),
                  'token': wx.getStorageSync('token'),
                  'share_id': wx.getStorageSync('recommend_user_id'),
                  'form_id': e.target.formId
                },
                success: function (res1) {
                  _this.hasClick = false
                  if (res1.code === 0) {
                    wx.requestPayment({
                      timeStamp: res1.data.open_data.timeStamp,
                      nonceStr: res1.data.open_data.nonce_str,
                      package: res1.data.open_data.package,
                      signType: res1.data.open_data.signType,
                      paySign: res1.data.open_data.paySign,
                      success: function (e) {
                        if (e.errMsg === 'requestPayment:ok') {
                          _this.user.is_prime = 1
                          wx.redirectTo({ url: '/pages/invitePage/main' })
                        }
                      }
                    })
                  }
                }
              })

              wx.setStorageSync('userInfo', Object.assign(wx.getStorageSync('userInfo') || {}, {'mobile': res.data.phone}))
              _this.regPhone(res.data.phone)
              global.findUserQuery()
            }
          }
        })
      },
      userMe () {
        let _this = this
        wxService.request({
          url: api.shopapi.userMe,
          method: 'get',
          data: {'token': wx.getStorageSync('token')},
          success: function (res) {
            if (res.code === 0) {
              _this.user = res.data
            }
          }
        })
      },
      goPay (e) {
        let _this = this
        if (!_this.hasAgreeDisclaimer) {
          wx.navigateTo({ url: '/pages/disclaimer/main' })
          return false
        }
        if (_this.hasClick) {
          return false
        }
        _this.hasClick = true
        wxService.request({
          url: api.twoapi.primePay,
          method: 'post',
          data: {
            'user_id': wx.getStorageSync('user_id'),
            'token': wx.getStorageSync('token'),
            'share_id': wx.getStorageSync('recommend_user_id'),
            'form_id': e.target.formId
          },
          success: function (res1) {
            _this.hasClick = false
            if (res1.code === 0) {
              wx.requestPayment({
                timeStamp: res1.data.open_data.timeStamp,
                nonceStr: res1.data.open_data.nonce_str,
                package: res1.data.open_data.package,
                signType: res1.data.open_data.signType,
                paySign: res1.data.open_data.paySign,
                success: function (e) {
                  if (e.errMsg === 'requestPayment:ok') {
                    _this.user.is_prime = 1
                    wx.redirectTo({ url: '/pages/invitePage/main' })
                  }
                }
              })
            }
          }
        })
      },
      showToast (message) {
        wx.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
      }
    },
    onShareAppMessage () {
      return {
        title: '会员权益',
        path: `pages/myCenter/pages/openVipPage/main?shareStatus=1`
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
  .back{
    position: fixed;
    right: 34rpx;
    bottom: 10%;
    width: 80rpx;
    height: 80rpx;
    font-size: 30rpx;
    border-radius: 50%;
    box-sizing: border-box;
    padding: 20rpx;
    background-color: #fff;
    box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
    z-index: 10;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .vip-container{
    padding: 30rpx;
    button{
      border: none;
      outline-style: none;
      background-color: #fff;
      outline:none;
      display: flex;
      padding: 0;
      border-radius: 0;
      line-height: 0;
      form{
        width: 100%;
      }
    }
    button::after {
      border: none;
    }
    .vip-top-kj{
      width:100%;
      padding:40rpx 30rpx;
      box-sizing: border-box;
      background:rgba(255,255,255,1);
      border-radius:10rpx;
      .vip-user-kj{
        position: relative;
        height: 50rpx;
        .vip-user-span-a{
          position: absolute;
          left: 10rpx;
          width: 35%;
          height: 3.8rpx;
          font-family: PingFangSC-Medium;
          background-color: #BBA17A;
        }
        .vip-user-span-b{
          position: absolute;
          right: 10rpx;
          width: 35%;
          height: 3.8rpx;
          font-family: PingFangSC-Medium;
          background-color: #BBA17A;
        }
        .vip-user-span-c{
          font-size:34rpx;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(187,161,122,1);
          position: absolute;
          left:50%;
          top:-24rpx;
          transform: translate(-50%);
        }
      }
      .vip-prices{
        font-family:PingFang SC;
        font-weight:300;
        color:rgba(136,136,136,1);
        font-size: 28rpx;
        text-align: center;
      }
    }
    .vip-list-kj{
      padding: 60rpx 30rpx 20rpx 30rpx;
      background-color: #ffffff;
      border-radius: 10rpx;
      margin-top: 20rpx;
      .vip-list-item{
        display: flex;
        position: relative;
        padding-left: 125rpx;
        margin-bottom: 40rpx;
        img{
          width: 100rpx;
          height: 100rpx;
          position: absolute;
          left:0;
          top:0;
        }
        .vip-right-title{
          display: flex;
          width: 100%;
          align-items: center;
          font-size: 28rpx;
          color:#000000;
          height: 100rpx;
          font-weight:300;
        }
      }
    }
    .vip-now-kj{
      padding-top: 35rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .vip-now-btn{
        display: inline-block;
        width:380rpx;
        height:80rpx;
        line-height: 80rpx;
        color:#ffffff;
        text-align: center;
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
        border-radius:40rpx;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
    }
    .vip-now-desc{
      margin-top: 27rpx;
      font-size: 26rpx;
      color:#ACACAC;
      text-align: left;
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(172,172,172,1);
    }
  }
</style>
