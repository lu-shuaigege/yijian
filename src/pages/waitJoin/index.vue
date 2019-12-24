<template>
  <div class="signupdetail">
    <div class="activity_item">
      <img v-if="detail.type != 2" mode="scaleToFill" :src="detail.image" />
      <img style="width:300rpx;height:300rpx;display:block;margin:0 auto;" v-if="detail.type == 2" :src="detail.qrcode" />
      <div class="info">
        <div class="title">
          <div class="ellipsis">{{detail.title}}</div>
        </div>
      </div>
    </div>
    <div class="activity_detail">
      <div class="act_info">
        <div>活动名额：{{detail.join_total}}</div>
        <div>活动时间：{{detail.hd_time}}</div>
        <div>活动地址：{{detail.address}}</div>
        <div>报名费用：￥{{detail.bm_amount}}</div>
      </div>
      <div class="roster_info">
        <div class="title">
          <img mode="scaleToFill" src="../../assets/images/infomation.png" />
          <div style="margin-left:10rpx;font-weight:bold;">我的信息</div>
        </div>
        <div class="act_info" style="color:#000;">
          <div>报名姓名：{{detail.fullname}}</div>
          <div>手机号码：{{detail.mobile}}</div>
          <div>报名时间：{{detail.bm_time}}</div>
          <div>支付费用：￥{{detail.pay_amount}}</div>
          <div v-if="detail.type == 3" >报名状态：<span style="color:#666;">{{detail.status}}</span></div>
          <div v-if="detail.type == 2" >报名状态：<span style="color:#d5ab79;">{{detail.status}}</span></div>
          <div v-if="detail.type == 1" >报名状态：{{detail.status}}</div>
          <div>座位号码：{{detail.seat_id}}</div>
        </div>
      </div>
    </div>
    <div class="gohome" v-show="isShare" @click="goHome">首页</div>
  </div>
</template>
<script>
import api from '../../api/api'
import wxService from '../../api/wxService'
import store from '../../utils/store'
export default {
  data () {
    return {
      roster_id: '',
      detail: {},
      isShare: false,
      share_code: ''
    }
  },
  methods: {
    goHome () {
      wx.redirectTo({
        url: '../activity/main'
      })
    },
    /** call api */
    getDetail () {
      let vm = this
      wxService.request({
        url: api.erqi.rosterView,
        method: 'get',
        data: {
          'user_id': wx.getStorageSync('user_id'),
          'token': wx.getStorageSync('token'),
          'roster_id': vm.roster_id
        },
        success: function (res) {
          if (res.code === 0) {
            vm.detail = res.data
          }
        }
      })
    },
    getShareDetail () {
      let vm = this
      wxService.request({
        url: api.erqi.rosterShare,
        method: 'get',
        data: {
          'share_code': vm.share_code
        },
        success: function (res) {
          if (res.code === 0) {
            vm.detail = res.data
          }
        }
      })
    }
  },
  onLoad (options) {
    let vm = this
    if (options.share_code) {
      vm.isShare = true
      vm.share_code = options.share_code
    } else {
      vm.isShare = false
    }
    if (options.id) {
      this.roster_id = options.id
    }
    if (store.flag) {
      if (options.share_code) {
        vm.getShareDetail()
      } else {
        vm.getDetail()
      }
    } else {
      store.callback = function () {
        if (options.share_code) {
          vm.getShareDetail()
        } else {
          vm.getDetail()
        }
      }
    }
  },
  onShow () {
    wx.hideHomeButton()
  },
  onUnload () {
    let vm = this
    vm.roster_id = ''
    vm.detail = {}
    vm.share_code = ''
  },
  onShareAppMessage () {
    let vm = this
    let openid = wx.getStorageSync('userInfo').passport_name
    return {
      title: vm.detail.title,
      imageUrl: vm.detail.image,
      path: `pages/waitJoin/main?share_code=${vm.detail.share_code}&id=${vm.id}&openid=${openid}`
    }
  }
}
</script>
<style lang="scss" scoped>
.signupdetail{
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
      }
      .ellipsis{
        width:100%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .activity_detail{
    .act_info{
      padding:20rpx;
      color:#666;
      font-size:26rpx;
      border-bottom: 30rpx solid #f5f5f9;
      div{
        height:70rpx;
        line-height: 70rpx;
      }
    }
    .roster_info{
      .title{
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size:28rpx;
        padding:30rpx 0;
        margin: 0 30rpx;
        border-bottom: 1px solid #eee;
        img{
          width:40rpx;
          height:40rpx;
        }
      }
    }
  }
  .gohome{
    background: linear-gradient(to left,#D5AB79,#F1D0A5);
    position:fixed;
    bottom:170rpx;
    right:20rpx;
    border-radius:50%;
    width:80rpx;
    padding:10rpx;
    font-size:30rpx;
    text-align: center;
    color:#fff;
    font-weight: bold;
    height: 80rpx;
    line-height: 80rpx;
  }
}
</style>
