<template>
<div class="activitydetail">
  <div class="activity_item">
    <img mode="scaleToFill" :src="detail.image" />
    <div class="info">
      <div class="title">
        <div class="ellipsis">{{detail.title}}</div>
        <div class="price">￥{{detail.pay_amount}}</div>
      </div>
    </div>
  </div>
  <div class="activity_detail">
    <div class="act_info">
      <div>活动名额：{{detail.join_total}}</div>
      <div>活动时间：{{detail.hd_time}}</div>
      <div>活动地址：{{detail.address}}</div>
    </div>
    <div class="rich-text" style="padding-bottom:100rpx;">
      <rich-text :nodes="detail.content"></rich-text>
    </div>
    <div class="bottom">
      <button style="color:#fff;" v-if="detail.status == 1 && state != 1" @click="signup">{{detail.status_msg}}</button>
      <button style="color:#fff;" v-if="detail.status == 1 && state == 1" open-type="getUserInfo" bindgetuserinfo="onGetUserInfo">{{detail.status_msg}}</button>
      <button disabled v-if="detail.status == 2">{{detail.status_msg}}</button>
      <button disabled v-if="detail.status == 3">{{detail.status_msg}}</button>
      <button disabled v-if="detail.status == 4">{{detail.status_msg}}</button>
    </div>
  </div>
<div class="gohome" v-if="is_home" @click="goHome">首页</div>
</div>
</template>

<script>
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
import store from '../../utils/store'
import { llog } from '../../utils/log'
import global from '../../utils/global'
export default {
  data () {
    return {
      state: '',
      id: '',
      detail: {},
      is_home: false
    }
  },
  methods: {
    goHome () {
      wx.redirectTo({
        url: '../activity/main'
      })
    },
    signup () {
      if (store.state === 0) {
        this.signupActivity()
      } else {
        wx.reLaunch({
          url: `../phone/main?from=activity&id=${this.detail.id}`
        })
      }
    },
    /** call api */
    getwxuserInfo (iv, encryptedData) {
      let vm = this
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
            // store.state = 2
            // wx.setStorageSync('userInfo', res.data)
            vm.findUserQuery()
          }
        }
      })
    },
    getDetail () {
      let page = this
      wxService.request({
        url: api.erqi.activityDetail,
        method: 'get',
        data: {
          'token': wx.getStorageSync('token'),
          'id': page.id,
          'user_id': wx.getStorageSync('user_id')
        },
        success: function (res) {
          if (res.code === 0) {
            page.detail = res.data
            page.detail.content = page.detail.content.replace(/<img/gi, '<img style="max-width:100%;height:auto;display:block;" ')
          }
        }
      })
    },
    signupActivity () {
      let vm = this
      wxService.request({
        url: api.erqi.activitySignup,
        method: 'post',
        data: {
          'aid': vm.detail.id,
          'token': wx.getStorageSync('token'),
          'user_id': wx.getStorageSync('user_id')
        },
        success: function (res) {
          if (res.code === 0) {
            wx.setStorageSync('activityorder_nw', {
              order_id: res.data.order_id,
              roster_id: res.data.roster_id,
              price: vm.detail.pay_amount,
              title: vm.detail.title})
            // wx.reLaunch({
            //   url: `../activityPay/main`
            // })
            wx.reLaunch({
              url: `../activitynonresponse/main`
            })
          }
        }
      })
    },
    findUserQuery () {
      let vm = this
      wxService.request({
        url: api.login.userQuery,
        method: 'get',
        data: {
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.code === 0) {
            wx.setStorageSync('userInfo', res.data)
            if (res.data.mobile) {
              store.state = 0
              vm.signupActivity()
            } else {
              store.state = 2
              global.findUserQuery()
              wx.reLaunch({
                url: `../phone/main?from=activity&id=${vm.detail.id}`
              })
            }
          }
        }
      })
    }
  },
  onLoad (options) {
    let vm = this
    this.id = options.id
    // this.getDetail()
    if (store.flag) {
      if (options.openid) {
        vm.is_home = true
        global.buriendPointQuery(3, 'activity', options.openid)
      }
      this.state = store.state
      vm.getDetail()
    } else {
      store.callback = function () {
        console.log('share callback')
        // 埋点
        vm.state = store.state
        if (options.openid) {
          vm.is_home = true
          global.buriendPointQuery(3, 'activity', options.openid)
        }
        vm.getDetail()
      }
    }
  },
  onShow () {
    wx.hideHomeButton()
  },
  onUnload () {
    this.state = ''
    this.id = ''
    this.detail = {}
    this.is_home = false
  },
  onGetUserInfo (e) {
    if (e.detail.userInfo) {
      this.getwxuserInfo(e.detail.iv, e.detail.encryptedData)
    }
  },
  onShareAppMessage () {
    let vm = this
    let openid = wx.getStorageSync('userInfo').passport_name
    llog({ action_from: '活动详情首页', action_to: '外部', action_type: '转发朋友', action_status: 1 })
    return {
      title: vm.detail.title,
      imageUrl: vm.detail.image,
      path: `pages/activitydetail/main?openid=${openid}&id=${vm.id}`
    }
  }
}
</script>

<style lang="scss" scoped>
.activitydetail{
  .activity_item{
    img{
      width: 100%;
      height:300rpx;
    }
    .info{
      padding:30rpx 0;
      margin: 0 30rpx;
      border-bottom: 1px solid #eee;
      .title{
        font-weight: bold;
        font-size:28rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .price{
          font-size:32rpx;
          color:#f50002;
        }
      }
      .ellipsis{
        width:80%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .activity_detail{
    margin-bottom:90rpx;
    .act_info{
      padding:30rpx;
      color:#666;
      font-size:26rpx;
      div{
        height:70rpx;
        line-height: 70rpx;
      }
    }
  }
  .rich-text{
    width:94%;
    margin: auto;
  }
  .bottom{
    position: fixed;
    bottom:0;
    width:100%;
    font-weight: bold;
    button{
      height:100rpx;
      line-height: 100rpx;
      background: linear-gradient(to left,#D5AB79,#F1D0A5);
      border-radius: 0;
    }
    button::after{
      border:none;
    }
  }
  .gohome{
    background: linear-gradient(to left,#D5AB79,#F1D0A5);
    position:fixed;
    bottom:170rpx;
    right:20rpx;
    border-radius:50%;
    width:80rpx;
    height: 80rpx;
    line-height: 80rpx;
    padding:10rpx;
    font-size:30rpx;
    text-align: center;
    color:#fff;
    font-weight: bold;
  }
}
</style>
