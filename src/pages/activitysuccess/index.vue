<template>
  <div class="success_container">
    <img src="../../assets/images/right.png">
    <div class="success">报名成功</div>
    <div class="info">
      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;您已成功支付"{{detail.title}}"活动的报名费用。请于规定时间到指定地点参加活动，如要查询活动报名信息请点击"个人中心"到我的活动内查看。
      <!--<div style="font-weight:bold;text-align:center;margin-top:40rpx;">无论意见如何，请继续珍藏您的藏品</div>-->
    </div>

    <button @click="goResult">个人中心</button>
  </div>
</template>
<script>
// import api from '../../api/api.js'
// import wxService from '../../api/wxService.js'
export default {
  data () {
    return {
      detail: {}
    }
  },
  onLoad () {
    this.detail = wx.getStorageSync('activityorder_nw')
  },
  onShow () {
    wx.hideHomeButton()
  },
  methods: {
    goResult () {
      wx.redirectTo({
        url: '../center/main'
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