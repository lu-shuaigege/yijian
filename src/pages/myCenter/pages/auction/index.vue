<template>
  <div class="pay_container">
    <div class="name">{{goods.name}}</div>
    <div class="descripation">宝贝送拍报名</div>
    <div class="info">
      <div class="price"><span>9.90</span>元</div>
      <div class="descripation">一周内出送拍结果</div>
    </div>

    <div class="form">
      <div class="warn">
        <span>请确认送拍人信息</span>
        <span v-if="!isEdit" class="edit" @click="edit">修改</span>
        <span v-if="isEdit" class="edit" @click="save">保存</span>
      </div>
      <div v-if="isEdit" class="change">
        <div class="flex">
          <div class="flex_left">鉴定人<i></i></div>
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
    <form @submit="goPay" report-submit="true">
      <button form-type="submit" :style="isEdit? 'background:#ccc;':''" class="pay">支付送拍费用</button>
    </form>
    <button class="think" @click="goBack">我再想想 >></button>
  </div>
</template>
<script>
import api from '../../../../api/api.js'
import wxService from '../../../../api/wxService.js'
export default {
  data () {
    return {
      goods: {},
      name: '',
      mobile: '',
      hasClick: false,
      hasAgreeDisclaimer: false,
      isEdit: false
    }
  },
  onLoad (options) {
    this.getMarketGoodsShow(options.id)
    this.name = wx.getStorageSync('userInfo').nickname
    this.mobile = wx.getStorageSync('userInfo').mobile
    this.isEdit = false
    if (!this.name || !this.mobile) {
      this.isEdit = true
    }
  },
  onShow () {
    let pages = getCurrentPages()
    let currPage = pages[pages.length - 1]
    if (currPage.data && currPage.data.hasAgreeDisclaimer){
      this.hasAgreeDisclaimer = true
    }
    wx.hideHomeButton()
  },
  onUnload () {
    this.isEdit = false
    this.name = ''
    this.mobile = ''
  },
  methods: {
    goBack () {
      wx.navigateBack()
    },
    getMarketGoodsShow (id = 0) {
      let _this = this
      wxService.request({
        url: api.twoapi.marketGoodsShow,
        method: 'get',
        data: {
          'goods_id': id,
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.code === 0) {
            _this.goods = res.data
          }
        }
      })
    },
    edit () {
      this.isEdit = true
    },
    save () {
      if (!this.name.trim()) {
        this.showToast('请输入送拍人')
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
      this.isEdit = false
    },
    goPay (e) {
      let _this = this
      if (!_this.hasAgreeDisclaimer) {
        wx.navigateTo({ url: '/pages/disclaimer/main' })
        return false
      }
      if (_this.hasClick) {
        return false
      }
      _this.hasClick = true
      wxService.request({
        url: api.twoapi.auctionPay,
        method: 'post',
        data: {
          'user_id': wx.getStorageSync('user_id'),
          'token': wx.getStorageSync('token'),
          'id': _this.goods.id,
          'username': _this.name,
          'mobile': _this.mobile,
          'form_id': e.target.formId
        },
        success: function (res) {
          _this.hasClick = false
          if (res.code === 0) {
            wx.requestPayment({
              timeStamp: res.data.open_data.timeStamp,
              nonceStr: res.data.open_data.nonce_str,
              package: res.data.open_data.package,
              signType: res.data.open_data.signType,
              paySign: res.data.open_data.paySign,
              success: function (e) {
                if (e.errMsg === 'requestPayment:ok') {
                  wx.navigateBack()
                }
              }
            })
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
  .descripation{
    padding: 0 60rpx;
    text-align: left;
    font-size: 26rpx;
    color:#ACACAC;
    text-align: center;
    margin-top: 20rpx;
  }
  .name{
    padding: 0 60rpx;
    font-weight: bold;
    font-size: 34rpx;
    letter-spacing: 4rpx;
    text-align: center;
    margin-top:140rpx;
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
      text-align: center;
      margin-top: 20rpx;
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
