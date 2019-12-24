<template>
  <div class="guide_container">
    <swiper indicator-dots>
      <block v-for="(item,index) in imgUrls" :key="index">
        <swiper-item>
          <img :src ="headUrl + item" />
          <button v-if="index === imgUrls.length-1 && !isLaunch" bindgetuserinfo="onGetUserInfo" open-type="getUserInfo">欢迎来到<span style="font-weight:bold;">“一鉴 Club” <img src="../../assets/images/arrow.png"></span></button>
          <button v-if="index === imgUrls.length-1 && isLaunch" @click="goHome">欢迎来到<span style="font-weight:bold;">“一鉴 Club” <img src="../../assets/images/arrow.png"></span></button>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
import api from '../../api/api'
import wxService from '../../api/wxService'
import store from '../../utils/store'
import global from '../../utils/global'
import { llog } from '../../utils/log'
export default {
  data () {
    return {
      imgUrls: [],
      headUrl: '',
      isLaunch: false
    }
  },

  components: {},

  methods: {
    guide () {
      let vm = this
      wxService.request({
        url: api.default.guide,
        method: 'get',
        data: {
          version: wx.getStorageSync('version')
        },
        success: function (res) {
          vm.imgUrls = res.data.homepage_image_url
        }
      })
    },
    // 为了埋点加的！！！ 不然版本更新后授权过的埋点还会在埋一次
    goHome () {
      wx.redirectTo({
        url: '../homePage/main'
      })
    },
    getwxuserInfo (iv, encryptedData) {
      wxService.request({
        url: api.login.getWxUserInfo,
        method: 'get',
        data: {
          token: wx.getStorageSync('token'),
          iv: iv,
          encryptedData: encryptedData
        },
        success: function (res) {
          if (res.code === 0) {
            // wx.setStorageSync('userInfo', res.data)
            global.findUserQuery({from: 'launch'})
          }
        }
      })
    }
  },
  onGetUserInfo (e) {
    if (e.detail.userInfo) {
      this.getwxuserInfo(e.detail.iv, e.detail.encryptedData)
    } else {
      llog({ action_from: '引导授权页', action_to: '鉴定首页', action_type: '授权', action_status: 0 })
      wx.redirectTo({
        url: '../homePage/main'
      })
    }
  },
  onLoad () {
    let vm = this
    // 为了埋点加的，具体看onHome
    wx.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权
          vm.isLaunch = true
        } else {
          // 未授权
          vm.isLaunch = false
        }
      }
    })
    this.headUrl = store.imgUrl
    this.guide()
  }
}
</script>

<style lang="scss" scoped>
.guide_container{
  swiper{
    width: 100vw;
    height: 100vh;
    image {
      width: 100vw;
      height:100vh;
    }
    button{
      position: fixed;
      top: 65vh;
      left:0;
      right:0;
      width: 500rpx;
      text-align: center;
      margin: 0 auto;
      background: linear-gradient(to left,#D5AB79,#F1D0A5);
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      &:after{
        border:none;
      }
      img{
        width:30rpx;
        height:30rpx;
      }
    }
  }
}
</style>
