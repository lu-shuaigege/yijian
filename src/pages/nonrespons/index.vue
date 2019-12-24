<template>
  <div class="nonrespons_container">
    <div class="title">服务协议</div>
    <scroll-view scroll-y>
      <rich-text :nodes="text"></rich-text>
      <!--<div>{{text}}</div>-->
    </scroll-view>
    <form @submit="goPay" report-submit="true">
      <button form-type="submit">同意</button>
    </form>
    <form @submit="goHome" report-submit="true">
      <button class="nosure" form-type="submit">我再看看 >></button>
    </form>
    <!--<div class="nosure" @click="goHome">我再看看 >></div>-->
  </div>
</template>
<script>
import api from '../../api/api'
import wxService from '../../api/wxService'
import store from '../../utils/store'
export default {
  data () {
    return {
      text: ''
    }
  },
  methods: {
    goPay (e) {
      // let vm = this
      wxService.request({
        url: api.default.saveFormId,
        method: 'post',
        data: {
          form_id: e.target.formId,
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.code === 0) {
            if (store.state === 0) {
              wx.reLaunch({
                url: '../pay/main'
              })
            } else {
              wx.reLaunch({
                url: '../phone/main'
              })
            }
          }
        }
      })
    },
    goHome (e) {
      // let vm = this
      wxService.request({
        url: api.default.saveFormId,
        method: 'post',
        data: {
          form_id: e.target.formId,
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.code === 0) {
            wx.reLaunch({
              url: '../center/main'
            })
          }
        }
      })
    },
    /** call api */
    getNonrespons () {
      let vm = this
      wxService.request({
        url: api.default.disclaimer,
        method: 'get',
        success: function (res) {
          if (res.code === 0) {
            vm.text = res.data.text
          }
        }
      })
    }
  },
  onLoad () {
    this.getNonrespons()
  },
  onShow () {
    wx.hideHomeButton()
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
