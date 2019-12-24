<template>
  <div class="nonrespons_container">
    <div class="title">服务协议</div>
    <scroll-view scroll-y>
      <rich-text :nodes="disclaimer.text"></rich-text>
    </scroll-view>
    <form @submit="goBackAgreeDisclaimer()" report-submit="true">
      <button form-type="submit">同意</button>
    </form>
    <form @submit="goBack" report-submit="true">
      <button class="nosure" form-type="submit">我再看看 >></button>
    </form>
  </div>
</template>
<script>
import api from '../../api/api'
import wxService from '../../api/wxService'
import store from '../../utils/store'
export default {
  data () {
    return {
      store: store,
      disclaimer: {}
    }
  },
  onLoad () {
    this.getDisclaimer()
  },
  onShow () {
    wx.hideHomeButton()
  },
  methods: {
    goBack () {
      let pages = getCurrentPages()
      let prevPage = pages[ pages.length - 2 ]
      prevPage.setData({ hasAgreeDisclaimer:false })
      wx.navigateBack()
    },
    goBackAgreeDisclaimer () {
      let pages = getCurrentPages()
      let prevPage = pages[ pages.length - 2 ]
      prevPage.setData({ hasAgreeDisclaimer:true })
      wx.navigateBack()
    },
    getDisclaimer () {
      let vm = this
      wxService.request({
        url: api.default.disclaimer,
        method: 'get',
        success: function (res) {
          if (res.code === 0) {
            vm.disclaimer = res.data
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.nonrespons_container{
  .title{
    font-size: 34rpx;
    font-weight: bold;
    text-align: center;
    width:100%;
    margin-top:20rpx;
    height:60rpx;
    line-height: 60rpx;
  }
  scroll-view{
    height:calc(100vh - 80rpx - 40rpx - 80rpx - 20rpx - 55rpx);
    font-size:26rpx;
    width:90vw;
    margin:20rpx 5vw;
    letter-spacing: 4rpx;
  }
  button{
    width: 380rpx;
    text-align: center;
    margin: 0 auto;
    background: linear-gradient(to left,#D5AB79,#F1D0A5);
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    margin-bottom: 20rpx;
    font-weight: bold;
    color:#fff;
    &:after{
      border:none;
    }
  }
  .nosure{
    background: transparent;
    height: 30rpx;
    line-height: 30rpx;
    font-size: 26rpx;
    width:100%;
    text-align: center;
    margin-top:25rpx;
    color:#ACACAC;
  }
}
</style>
