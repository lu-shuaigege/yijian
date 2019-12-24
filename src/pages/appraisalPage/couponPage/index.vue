<template>
  <div class="coupon">
    <van-radio-group :value="radio" @change="onChange">
      <div class="coupon-list" v-for="(item,index) in resultArr" :key="index">
        <div class="coupon-list-l coupona">
          {{item.name}}
        </div>
        <!-- <div class="coupon-list-l couponb">
          活动券
        </div> -->
        <div class="coupon-list-r">
          有效期：2020.10.30
        </div>
        <van-radio use-icon-slot :name="item.id">
          <img slot="icon" :src=" radio === item.id ? icon.active : icon.normal "/>
        </van-radio>
      </div>
    </van-radio-group>
    <div class="button" @click="beSure">确定</div>
  </div>
</template>
<script>
import api from '../../../api/api.js'
import wxService from '../../../api/wxService.js'
// import store from '../../utils/store'
// import { llog } from '../../utils/log'
export default {
  data () {
    return {
      radio: '0',
      icon: {
        normal: '../../../assets/images/couponnocheck.png',
        active: '../../../assets/images/couponchecked.png'
      },
      checkedlist: [
        {
          title: '活动券',
          id: '1',
          time: '2020.10.30 '
        },
        {
          title: '活动券',
          id: '2',
          time: '2020.10.30 '
        },
        {
          title: '活动券',
          id: '3',
          time: '2020.10.30 '
        },
        {
          title: '活动券',
          id: '4',
          time: '2020.10.30 '
        }
      ],
      scene: '',
      resultArr: []
    }
  },
  onLoad (options) {
    if (options.from === 'appraisal') {
      this.scene = '1'
    } else if (options.from === 'activity') {
      this.scene = '2'
    }
    this.radio = wx.getStorageSync('couponId')
    this.getList()
  },
  onShow () {
    wx.hideHomeButton()
  },
  onUnload () {
    this.scene = ''
    this.resultArr = []
  },
  methods: {
    onChange (event) {
      // console.log(event.mp.detail)
      if (this.radio === event.mp.detail) {
        this.radio = '0'
      } else {
        this.radio = event.mp.detail
      }
    },
    beSure () {
      // console.log(this.radio)
      wx.setStorageSync('couponId', this.radio)
      wx.navigateBack()
    },
    /** call api */
    getList (item) {
      let _this = this
      wxService.request({
        url: api.shopapi.couponIndex,
        method: 'get',
        data: {
          'token': wx.getStorageSync('token'),
          'scene': _this.scene,
          'use_status': 0,
          'page': 1,
          'per_page': 100
        },
        success: function (res) {
          if (res.code === 0) {
            if (res.data.coupon_list.length > 0) {
              if (item === 'more') {
                _this.resultArr = _this.resultArr.concat(res.data.coupon_list)
              } else {
                _this.resultArr = res.data.coupon_list
              }
            } else {
              _this.resultArr = []
            }
          }
        }
      })
    }
  }
}
</script>
<style>
  page{
    background: #f5f5f9;
  }
</style>

<style lang="scss" scoped>

  .coupon{
    padding-top: 10rpx;
    margin-bottom: 92rpx;
    .coupon-list{
      width:690rpx;
      height:100rpx;
      background:rgba(255,255,255,1);
      border-radius:10rpx;
      margin: 0 auto;
      margin-top: 20rpx;
      display: flex;
      line-height: 100rpx;
      .coupon-list-l{
        width:170rpx;
        height:100rpx;
        border-radius:10rpx 0 0 10rpx;
        font-size:30rpx;
        font-weight:500;
        color:rgba(255,255,255,1);
        text-align: center;
      }
      .coupona{
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
       }
      .couponb{
        background:rgba(172,172,172,1);
      }
      .coupon-list-r{
        font-size:30rpx;
        margin-left: 30rpx;
      }
      van-radio{
        right:67rpx;
        position:absolute;
        line-height: 116rpx;
      }
      .van-radio img{
        width:42rpx;
        height:42rpx;
      }
    }
    .button{
      position: fixed;
      bottom:0;
      width:100%;
      text-align: center;
      background: linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
      height:90rpx;
      line-height: 90rpx;
    }
  }


</style>

