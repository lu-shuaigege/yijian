<template>
  <div class="coupon">
    <van-radio-group :value="radio" @change="onChange">
      <div class="coupon-list" v-for="(item,index) in checkedlist">
        <div class="coupon-list-l coupona" v-if="index<2">
          活动券
        </div>
        <div class="coupon-list-l couponb" v-if="index>1">
          活动券
        </div>
        <div class="coupon-list-r">
          有效期：2020.10.30
        </div>
        <van-radio use-icon-slot :name="item.id" :key="index">
          <img slot="icon" :src=" radio === item.id ? icon.active : icon.normal "/>
        </van-radio>
      </div>

    </van-radio-group>
  </div>
</template>
<script>
// import api from '../../api/api.js'
// import wxService from '../../api/wxService.js'
// import store from '../../utils/store'
// import { llog } from '../../utils/log'
export default {
  data () {
    return {
      radio: '0',
      icon: {
        normal: '/assets/images/couponnocheck.png',
        active: '/assets/images/couponchecked.png'
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
        }
      ]
    }
  },
  onLoad (option) {
  },
  onShow () {
    wx.hideHomeButton()
  },
  methods: {
    onChange (event) {
      this.radio = event.mp.detail
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
        background:linear-gradient(90deg,rgba(141,189,208,1),rgba(111,160,201,1));
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
  }


</style>

