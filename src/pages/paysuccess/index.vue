<template>
  <div class="success_container">
    <img src="../../assets/images/right.png">
    <div class="success">付款成功</div>
    <div class="info">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您已成功支付宝贝"{{detail.name}}"的报名鉴定费用。专家团将于七个工作日内给出反馈意见。
      <div style="font-weight:bold;text-align:center;margin-top:40rpx;">无论意见如何，请继续珍藏您的藏品</div>
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
        url: '../result/main'
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.success_container{
  img{
    display: block;
    width:120rpx;
    height:120rpx;
    margin:0 auto;
    margin-top:160rpx;
  }
  .success{
    margin-top:50rpx;
    width:100%;
    text-align: center;
    font-size: 34rpx;
    font-weight: bold;
  }
  .info{
    padding:0rpx 70rpx;
    margin-top:118rpx;
    font-size:28rpx;
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