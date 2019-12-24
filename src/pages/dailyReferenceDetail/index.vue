<template>
  <div class="coursedetail">
    <div class="coursedetail-video">
      <video :src="list.url" @play="play"></video>
    </div>
    <div class="coursetab-list-p-title">
      <div class="title">
        {{list.name}}播放次数播放次数播放次数播放次数播放次数播放次数播放次数播放次数播放次数播放次数
      </div>
      <!--<div class="search-title-click">播放次数：{{list.click}}</div>-->
    </div>
    <div class="tip">
      {{list.remark}}
    </div>
    <!--返回首页start-->
    <backHome></backHome>
    <!--返回首页end-->
  </div>
</template>
<script>
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
import backHome from '../../components/backhome/backhome'
export default {
  data () {
    return {
      id: '',
      list: [],
      hasPlay: 0
    }
  },
  onLoad (option) {
    this.id = option.id
    this.getDetail()
  },
  onShow () {
    wx.hideHomeButton()
    this.hasPlay = 0
  },
  components: {backHome},
  methods: {
    play () {
      let _this = this
      if (_this.hasPlay !== 0) {
        return false
      }
      wxService.request({
        url: api.shopapi.dailyPaly,
        method: 'post',
        data: {
          'id': _this.id
        },
        success: function (res) {
          if (res.code !== 0) {
            _this.showToast('系统异常')
            return false
          }
          _this.hasPlay = 1
          _this.list.click = Number(_this.list.click) + 1
        }
      })
    },
    getDetail () {
      let _this = this
      wxService.request({
        url: api.shopapi.dailyShow,
        method: 'get',
        data: {
          'id': _this.id
        },
        success: function (res) {
          if (res.code === 0) {
            _this.list = res.data
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
    }
  },
  onShareAppMessage () {
    return {
      title: '每日一鉴',
      // imageUrl: store.imgUrl + vm.detail.images[0].img_url,
      path: `/pages/dailyReferenceDetail/main?id=` + this.id
    }
  }
}
</script>

<style lang="scss" scoped>
  page{
    background: #f5f5f9;

  }
  .coursedetail{
    padding-bottom: 30rpx;
    .coursedetail-video{
      width:750rpx;
      height:563rpx;
      background:rgba(20,20,20,1);
      video{
        width:750rpx;
        height:563rpx;
      }
    }
    .coursetab-list-p-title{
      width: 690rpx;
      margin: 0 auto;
      margin-top: 50rpx;
      position: relative;
      height:120rpx;
      border-bottom: 1px solid rgba(238,238,238,1);
      display: flex;
      justify-content: space-between;
      .title{
        width:750rpx;
        height:95rpx;
        font-size:32rpx;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        float: left;
      }
      .search-title-click{
        font-size: 28rpx;
        color: #666;
      }
    }
    .tip{
      font-size: 24rpx;
      color: #666;
      padding:20rpx 40rpx;
    }
  }
</style>

