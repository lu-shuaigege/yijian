<template>
  <div class="activity">
    <scroll-view style="height:calc(100vh - 100rpx);" :scroll-y="true" @scrolltolower="scrolltolower">
      <swiper autoplay>
        <swiper-item v-for="(item,index) in imgUrls" :key="index">
          <img @click="imgclick" mode="scaleToFill" :src="item">
        </swiper-item>
      </swiper>
      <div class="activity_item" v-for="(val, index) in activity" :key="index" @click="goDetail(val.id)">
        <img mode="scaleToFill" :src="val.list_image" />
        <div class="info">
          <div class="title">
            <div class="ellipsis">{{val.title}}</div>
            <div class="price">￥{{val.pay_amount}}</div>
          </div>
          <div class="time">{{val.hd_start_time}} {{val.address}}</div>
        </div>
      </div>
      <div class="noData" v-if="noData">暂无活动</div>
      <div class="loading" v-if="loadingFlag">
        <van-loading type="spinner" size="18px" /> 加载中
      </div>
    </scroll-view>
    <div class="bottom">
      <div class="active">活动报名</div>
      <div @click="goAppraisal" style="border-right:1px solid #f5f5f9;">宝贝鉴定</div>
      <div v-if="state != 1" @click="goResult">个人中心</div>
      <button id="myresult" class="result" v-if="state == 1" bindgetuserinfo="onGetUserInfo" open-type="getUserInfo">个人中心</button>
    </div>
  </div>
</template>
<script>
import api from '../../api/api'
import wxService from '../../api/wxService'
import store from '../../utils/store'
import { llog } from '../../utils/log'
export default {
  data () {
    return {
      imgUrls: [],
      imgAddress: '',
      headUrl: '',
      state: '',
      page: 1,
      per_page: 5,
      loadingFlag: false,
      nomore: false,
      noData: false,
      activity: []
    }
  },
  methods: {
    imgclick (index) {
      wx.navigateTo({
        url: this.imgAddress
      })
    },
    goDetail (id) {
      wx.navigateTo({
        url: '../activitydetail/main?id=' + id
      })
    },
    goResult () {
      wx.redirectTo({
        url: '../center/main'
      })
    },
    goAppraisal () {
      wx.redirectTo({
        url: '../home/main'
      })
    },
    scrolltolower () {
      if (!this.nomore) {
        this.page++
        this.loadingFlag = true
        this.getActivityList('more')
      }
    },
    /** call api */
    getActivityList (item) {
      let page = this
      wxService.request({
        url: api.erqi.activityHome,
        method: 'get',
        data: {
          'page': page.page,
          'pageSize': page.per_page,
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.code === 0) {
            page.imgUrls.push(res.data.img_banner)
            page.imgAddress = res.data.img_banner_url
            if (res.data.activity_info.items.length > 0) {
              if (item === 'more') {
                page.activity = page.activity.concat(res.data.activity_info.items)
              } else {
                page.activity = res.data.activity_info.items
              }
              if (page.activity.length >= Number(res.data.activity_info._meta.total_count)) {
                page.nomore = true
              }
              page.loadingFlag = false
            } else {
              page.activity = []
              page.noData = true
            }
          }
        },
        complete: function () {
          page.loadingFlag = false
        }
      })
    }
  },
  onLoad () {
    this.state = store.state
    this.headUrl = store.imgUrl
    this.page = 1
    this.loadingFlag = false
    this.nomore = false
    this.noData = false
    this.getActivityList()
  },
  onUnload () {
    this.imgUrls = []
    this.imgAddress = ''
    this.headUrl = ''
    this.state = ''
    this.page = 1
    this.per_page = 5
    this.loadingFlag = false
    this.nomore = false
    this.noData = false
    this.activity = []
  },
  onGetUserInfo (e) {
    if (e.detail.userInfo) {
      if (e.currentTarget.id === 'myresult') {
        // llog({ action_from: '鉴定首页', action_to: '我的鉴定页', action_type: '授权', action_status: 1 })
        wxService.request({
          url: api.login.getWxUserInfo,
          method: 'get',
          data: {
            token: wx.getStorageSync('token'),
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
          },
          success: function (res) {
            if (res.code === 0) {
              store.state = 2
              wx.setStorageSync('userInfo', res.data)
              wx.redirectTo({
                url: '../center/main'
              })
            }
          }
        })
      } else {
        // llog({ action_from: '鉴定首页', action_to: '鉴定首页', action_type: '授权', action_status: 0 })
      }
    }
  },
  onShareAppMessage () {
    let openid = wx.getStorageSync('userInfo').passport_name
    llog({ action_from: '活动首页', action_to: '外部', action_type: '转发朋友', action_status: 1 })
    return {
      title: '精品活动，敬请参与！',
      imageUrl: this.imgUrls[0],
      path: `pages/loading/main?from=1&openid=${openid}`
    }
  }
}
</script>
<style lang="scss" scoped>
.activity{
  swiper{
    height: 240rpx;
    img{
      width:100%;
      height: 100%;
    }
  }
  .activity_item{
    padding:20rpx 20rpx;
    border-bottom: 10rpx solid #f5f5f9;
    img{
      width: 100%;
      height:400rpx;
    }
    .info{
      margin:10rpx 0rpx;
      .title{
        font-weight: bold;
        font-size:30rpx;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .price{
          font-weight: normal;
          font-size:32rpx;
          color:#b91925;
        }
      }
      .time{
        margin-top:10rpx;
        font-size: 26rpx;
        color:#666;
      }
      .ellipsis{
        width:80%;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp:2;
        -webkit-box-orient: vertical;
      }
    }
  }
  .noData{
    height: 0.5rem;
    line-height: 0.5rem;
    text-align: center;
    font-size: 0.3rem;
    color: #888;
    margin-top: 1rem;
  }
  .loading{
    text-align: center;
    color: #666;
    font-size: 0.3rem;
  }
  .bottom{
    position: fixed;
    bottom:0;
    display: flex;
    flex-direction: row;
    width:100%;
    font-weight: bold;
    div, .result{
      width:50%;
      height:100rpx;
      line-height: 100rpx;
      text-align: center;
      margin:0 auto;
      font-size:28rpx;
      background: #fff;
    }
    .result{
      padding: 0;
      height:100rpx;
      line-height: 100rpx;
      &::after{
        border:none;
      }
    }
    .active{
      background: #000;
      color:#fff;
    }
  }
}
</style>

