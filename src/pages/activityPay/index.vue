<template>
  <div class="pay_container">
    <div class="name">{{activity_info.title}}</div>
    <div class="info">
      <div class="price">
        <span v-if="couponId == '' || couponId == 0">{{activity_info.price}}</span><span v-else>0.00</span>元
      </div>
      <div class="descripation">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;请在10分钟内完成付款。如付款后因个人原因不能参加，系统不支持退款，可将付款信息转让别人参与活动。</div>
    </div>

    <div class="form">
      <div class="warn">
        <span>请确定活动报名人信息</span>
        <span v-if="!isEdit" class="edit" @click="edit">修改</span>
        <span v-if="isEdit" class="edit" @click="save">保存</span>
      </div>
      <div v-if="isEdit" class="change">
        <div class="flex">
          <div class="flex_left">报名人<i></i></div>
          <input class="flex_right" v-model="name" @focus="clearName"/>
        </div>
        <div class="flex">
          <div class="flex_left">联系方式<i></i></div>
          <input class="flex_right" v-model="mobile"/>
        </div>
      </div>
      <div v-if="!isEdit" class="finish">
        <div class="flex">
          <div class="flex_left">鉴定人<i></i></div>
          <div class="flex_right">{{name}}</div>
        </div>
        <div class="flex">
          <div class="flex_left">联系方式<i></i></div>
          <div class="flex_right">{{mobile}}</div>
        </div>
      </div>
    </div>
    <div class="form" style="margin-top:60rpx;">
      <div class="warn">
        <span>优惠券</span>
        <navigator class="edit" url="/pages/appraisalPage/couponPage/main?from=activity">
          <span v-if="couponId == '' || couponId == 0">{{num}}张可用 ></span>
          <span v-else>活动券 ></span>
          </navigator>
      </div>
    </div>
    <form @submit="goPay" report-submit="true">
      <button form-type="submit" :style="isEdit? 'background:#ccc;':''" class="pay">立即支付</button>
    </form>
    <button class="think" @click="goResult">我再考虑下 >></button><!--:disabled="isEdit"  @click="goPay" -->
  </div>
</template>
<script>
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
// import { llog } from '../../utils/log'
export default {
  data () {
    return {
      isEdit: false,
      name: '',
      mobile: '',
      activity_info: {},
      couponId: '',
      num: ''
    }
  },
  onLoad () {
    this.activity_info = wx.getStorageSync('activityorder_nw')
    if (wx.getStorageSync('userInfo1') && wx.getStorageSync('userInfo1').nickname) {
      this.name = wx.getStorageSync('userInfo1').nickname
      this.mobile = wx.getStorageSync('userInfo1').mobile
      this.isEdit = false
    } else {
      if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').nickname) {
        this.name = wx.getStorageSync('userInfo').nickname
      } else {
        this.isEdit = true
      }
      if (wx.getStorageSync('userInfo') && wx.getStorageSync('userInfo').mobile) {
        this.mobile = wx.getStorageSync('userInfo').mobile
      } else {
        this.isEdit = true
      }
    }
  },
  onUnload () {
    this.isEdit = false
    this.name = ''
    this.mobile = ''
    this.activity_info = {}
    this.couponId = ''
    this.num = ''
  },
  onShow () {
    wx.hideHomeButton()
    this.getCouponNum()
    if (wx.getStorageSync('couponId')) {
      this.couponId = wx.getStorageSync('couponId')
    }
  },
  methods: {
    edit () {
      this.isEdit = true
    },
    save () {
      if (!this.name.trim()) {
        this.showToast('请输入报名人')
        return
      }
      if (!this.mobile.trim()) {
        this.showToast('请输入联系方式')
        return
      }
      let checkPhone = /^[1][3,4,5,7,8][0-9]{9}$/
      if (this.mobile.length === 11 && !this.mobile.match(checkPhone)) {
        this.showToast('请输入正确的手机号')
        return
      }
      if (this.mobile.length < 11) {
        this.showToast('请输入正确的联系方式')
        return
      }
      wx.setStorageSync('userInfo1', {
        nickname: this.name.trim(),
        mobile: this.mobile.trim()
      })
      this.isEdit = false
    },
    goResult () {
      if (this.isEdit) {
        wx.showToast({
          title: '请保存当前用户信息',
          icon: 'none',
          duration: 2000
        })
      } else {
        // wx.redirectTo({
        //   url: '../activityfail/main'
        // })
        wx.removeStorageSync('couponId')
        this.cancleOrder()
      }
    },
    cancleOrder () {
      let vm = this
      wxService.request({
        url: api.erqi.rosterClear,
        method: 'post',
        data: {
          'user_id': wx.getStorageSync('user_id'),
          'token': wx.getStorageSync('token'),
          'order_id': vm.activity_info.order_id
        },
        success: function (res) {
          if (res.code === 0) {
            wx.redirectTo({
              url: '../activityfail/main'
            })
          }
        }
      })
    },
    goPay (e) {
      let vm = this
      if (this.isEdit) {
        wx.showToast({
          title: '请保存当前用户信息',
          icon: 'none',
          duration: 2000
        })
      } else {
        wxService.request({
          url: api.erqi.activityPay,
          method: 'post',
          data: {
            'user_id': wx.getStorageSync('user_id'),
            'token': wx.getStorageSync('token'),
            'roster_id': vm.activity_info.roster_id,
            'order_id': vm.activity_info.order_id,
            'form_id': e.target.formId,
            'fullname': vm.name,
            'mobile': vm.mobile,
            'coupon_id': vm.couponId
          },
          success: function (res1) {
            if (res1.code === 0) {
              wx.removeStorageSync('couponId')
              if (res1.data.open_data) {
                wx.requestPayment({
                  timeStamp: res1.data.open_data.timeStamp,
                  nonceStr: res1.data.open_data.nonce_str,
                  package: res1.data.open_data.package,
                  signType: res1.data.open_data.signType,
                  paySign: res1.data.open_data.paySign,
                  success: function (e) {
                    wx.redirectTo({
                      url: '../activitysuccess/main'
                    })
                  },
                  fail: function (e) {
                  },
                  complete: function (e) {
                    if (e.errMsg === 'requestPayment:fail' || e.errMsg === 'requestPayment:fail cancel') {
                      /* wx.redirectTo({
                        url: '../activityfail/main'
                      }) */
                      vm.cancleOrder()
                    }
                    if (e.errMsg === 'requestPayment:ok') {
                      wx.redirectTo({
                        url: '../activitysuccess/main'
                      })
                    }
                  }
                })
              } else {
                wx.redirectTo({
                  url: '../activitysuccess/main'
                })
              }
            }
          },
          complete: function (e) {
          }
        })
      }
    },
    getCouponNum () {
      let vm = this
      wxService.request({
        url: api.default.getCouponNum,
        method: 'get',
        data: {
          token: wx.getStorageSync('token'),
          scene: 2
        },
        success: function (res) {
          if (res.code === 0) {
            vm.num = res.data.num
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
    },
    clearName () {
      this.name = ''
    }
  }
}
</script>
<style lang="scss" scoped>
.pay_container{
  .name{
    padding: 0 60rpx;
    font-weight: bold;
    font-size: 34rpx;
    letter-spacing: 4rpx;
    text-align: center;
    margin-top:100rpx;
  }
  .info{
    margin-top:70rpx;
    width:100%;
    text-align: center;
    .price{
      font-size:26rpx;
      span{
        color:#D5AC7A;
        font-size: 60rpx;
      }
    }
    .descripation{
      padding: 0 60rpx;
      text-align: left;
      font-size: 26rpx;
      color:#ACACAC;
    }
  }
  .form{
    font-size:30rpx;
    padding:0rpx 60rpx;
    margin-top:130rpx;
    .warn{
      font-weight: bold;
      .edit{
        color:#D5AC7A;
        float:right;
      }
    }
    .change,.finish{
      margin-top:40rpx;
    }
    .flex{
      display: flex;
      flex-direction: row;
      align-items: center;
      border-bottom: 1px solid #eee;
      height: 100rpx;
      line-height: 100rpx;
      .flex_left{
        padding-top: 100rpx;
        color:#888;
        text-align: justify;
        width:120rpx;
		    i{
			    display:inline-block;
			    width:100%;
			    height:0;
        }
      }
      .flex_right{
        margin-left: 20rpx;
      }
      input{
        color:#ACACAC;
      }
    }
  }
  .think{
    /*border: 1px solid #D5AB79;
    width:380rpx;
    height:80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    color:#D5AC7A;
    background:#fff;
    margin-top: 80rpx;*/
    width:380rpx;
    font-size:26rpx;
    color:#ACACAC;
    background-color: #fff;
    &:after{
      border:none;
    }
  }
  .pay{
    /*position: fixed;
    bottom:0;
    text-align: center;
    background: linear-gradient(to left,#D5AB79,#F1D0A5);
    width:100%;
    border-radius: 0;
    font-size: 32rpx;
    font-weight: bold;
    height:100rpx;
    line-height: 100rpx;
    color:#fff;
    &:after{
      border:none;
    }*/
    background: linear-gradient(to left,#D5AB79,#F1D0A5);
    //border: 1px solid #D5AB79;
    width:380rpx;
    height:80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    font-size: 30rpx;
    color:#fff;
    font-weight: bold;
    margin-top: 80rpx;
    &:after{
      border:none;
    }
  }
}
</style>