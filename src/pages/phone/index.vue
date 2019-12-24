<template>
  <div class="phone_container">
    <div class="info">为了方便联系您，请留下您的手机号</div>
    <div class="form">
      <div class="flex">
        <img class="phone" src="../../assets/images/phone.png" />
        <input v-model="mobile" placeholder="请输入手机号" placeholder-style="color:#ACACAC;"/>
      </div>
      <div class="flex">
        <img class="mail" src="../../assets/images/mail.png" />
        <input v-model="code" placeholder="请输入验证码" placeholder-style="color:#ACACAC;"/>
        <button class="code" :style="text != '获取验证码'? 'background:#acacac;':'background: #F50002;'" @click="submitCode" :disabled="text != '获取验证码'">{{text}}</button>
      </div>
    </div>
    <button class="sure" @click="bindPhone">确定</button>
    <div class="nosure" @click="goHome">我再想想 >></div>
  </div>
</template>
<script>
import store from '../../utils/store'
import wxService from '../../api/wxService'
import api from '../../api/api'
import { llog } from '../../utils/log'
export default {
  data () {
    return {
      mobile: '',
      code: '',
      text: '获取验证码',
      timeFlag: '',
      from: '',
      id: ''
    }
  },
  methods: {
    goHome () {
      if (this.from === 'activity') {
        wx.reLaunch({
          url: '../activity/main'
        })
      } else {
        llog({ action_from: '绑定手机页', action_to: '我的鉴定页', action_type: '绑定手机', action_status: 0 })
        wx.reLaunch({
          url: '../center/main'
        })
      }
      this.close()
    },
    submitCode () {
      let vm = this
      let phone = this.mobile
      phone = phone.trim()
      if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(phone) || !phone) {
        vm.showToast('请输入正确的手机号')
      } else {
        wxService.request({
          url: api.login.sendCode,
          method: 'get',
          data: {
            source: store.source,
            mobile: phone,
            token: wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.code === 0) {
              vm.showToast('发送成功')
              let time = 60
              clearInterval(vm.timeFlag)
              vm.timeFlag = setInterval(() => {
                time--
                vm.text = time + 's'
                if (time <= 0) {
                  clearInterval(vm.timeFlag)
                  time = 60
                  vm.text = '获取验证码'
                }
              }, 1000)
            } else {
              vm.showToast(res.msg)
            }
          },
          fail: function (err) {
            vm.showToast(err.msg)
          }
        })
      }
    },
    bindPhone () {
      let vm = this
      if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(vm.mobile) || !vm.mobile) {
        vm.showToast('请输入正确的手机号')
        return
      }
      if (!vm.code) {
        vm.showToast('请输入验证码')
        return
      }
      wxService.request({
        url: api.login.bindMobile,
        method: 'get',
        data: {
          source: store.source,
          mobile: vm.mobile,
          code: vm.code,
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.code === 0) {
            let obj = {
              'mobile': vm.mobile
            }
            let objtemp = Object.assign(wx.getStorageSync('userInfo') || {}, obj)
            wx.setStorageSync('userInfo', objtemp)
            llog({ action_from: '绑定手机页', action_to: '支付页', action_type: '绑定手机', action_status: 1 })
            vm.regPhone(vm.mobile)
            store.state = 0
            vm.showToast(res.msg)
            if (vm.from === 'activity') {
              wx.redirectTo({
                url: `../activitydetail/main?id=${vm.id}`
              })
            } else {
              wx.redirectTo({
                url: '../pay/main'
              })
            }
          } else if (res.code === 40003) {
            vm.showToast('登录超时，请稍后再试')
          } else {
            // llog({ action_from: '绑定手机页', action_to: '支付页', action_type: '绑定手机', action_status: 0 })
            vm.showToast(res.msg)
          }
        },
        fail: function (err) {
          vm.showToast(err.msg)
        }
      })
    },
    showToast (message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    },
    close () {
      let vm = this
      clearInterval(vm.timeFlag)
      vm.text = '获取验证码'
      vm.mobile = ''
      vm.code = ''
      vm.timeFlag = ''
      vm.from = ''
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
    }
  },
  onLoad (options) {
    this.from = options.from
    this.id = options.id
  },
  onShow () {
    wx.hideHomeButton()
  },
  onUnload () {
    this.close()
  }
}
</script>
<style lang="scss" scoped>
.phone_container{
  padding:0 60rpx;
  .info{
    margin-top:80rpx;
    font-size: 34rpx;
    color:#1A1A1A;
    font-weight: bold;
  }
  .form{
    font-size:30rpx;
    .flex{
      display: flex;
      flex-direction: row;
      align-items: center;
      margin-top:60rpx;
      border-bottom: 1px solid #EEE;
      height:80rpx;
      line-height: 80rpx;
      .phone{
        width:25rpx;
        height:32rpx;
      }
      .mail{
        width:32rpx;
        height:24rpx;
      }
      input{
        margin-left: 20rpx;
      }
      .code{
        color: #fff;
        font-weight: bold;
        font-size:25rpx;
        padding:0 10rpx;
        min-width:150rpx;
        margin:0;
        margin-left: auto;
        &:after{
          border:none;
        }
      }
    }
  }
  .sure{
    width: 360rpx;
    text-align: center;
    margin:0rpx auto;
    background: linear-gradient(to left,#D5AB79,#F1D0A5);
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    margin-top:80rpx;
    color:#fff;
    font-size: 30rpx;
    font-weight: bold;
    &:after{
      border:none;
    }
  }
  .nosure{
    font-size: 26rpx;
    width:100%;
    text-align: center;
    margin-top:25rpx;
    color:#ACACAC;
  }
}
</style>