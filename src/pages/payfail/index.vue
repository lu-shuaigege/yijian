<template>
  <div class="fail_container">
    <img src="../../assets/images/error.png">
    <div class="fail">付款失败</div>
    <div class="info">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您的宝贝"{{detail.name}}"未能成功付款，点击下方"我的鉴定"查看未付款订单。
    </div>
    

    <button @click="goResult">我的鉴定</button>
  </div>
</template>
<script>
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
export default {
  data () {
    return {
      detail: {}
    }
  },
  onLoad () {
    this.getDetail()
  },
  onShow () {
    wx.hideHomeButton()
  },
  methods: {
    getDetail () {
      let vm = this
      if (wx.getStorageSync('treasure_id_nw')) {
        wxService.request({
          url: api.default.treasureDetail,
          method: 'post',
          data: {
            user_id: wx.getStorageSync('user_id'),
            token: wx.getStorageSync('token'),
            treasure_id: wx.getStorageSync('treasure_id_nw')
          },
          success: function (res) {
            vm.detail = res.data
          }
        })
      }
    },
    goResult () {
      wx.redirectTo({
        url: '../result/main?tab=3'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.fail_container{
  img{
    display: block;
    width:120rpx;
    height:120rpx;
    margin:0 auto;
    margin-top:160rpx;
  }
  .fail{
    margin-top:50rpx;
    width:100%;
    text-align: center;
    font-size: 34rpx;
    font-weight: bold;
  }
  .info{
    padding:0rpx 70rpx;
    margin:0 auto;
    margin-top:118rpx;
    font-size:28rpx;
    width: 620rpx;
    word-break: break-all;
    line-height: 45rpx;
  }
  button{
    text-align: center;
    background: linear-gradient(to left,#D5AB79,#F1D0A5);
    width:380rpx;
    border-radius: 40rpx;
    font-size: 32rpx;
    font-weight: bold;
    height:80rpx;
    line-height: 80rpx;
    margin-top:140rpx;
    color:#fff;
    &:after{
      border:none;
    }
  }
}
</style>