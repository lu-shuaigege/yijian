<template>
  <div class="coursedetail">
    <div class="coursedetail-video">
      <video src=""></video>
    </div>
    <div class="coursetab-list-p-title">
      <div class="title">
        西汉“嵌贝鹿形青铜镇”，名称显示一排 显示不全的转行显示，最多两行两行
      </div>
      <div class="price">
        <span>¥</span>5000
      </div>
    </div>
    <div class="coursedetail-list">
      <div class="coursedetail-list-p">
        <div class="title">主讲人<i></i></div>
        <div class="detail">杨震华</div>
      </div>
      <div class="coursedetail-list-p">
        <div class="title">课程时长<i></i></div>
        <div class="detail">60分钟</div>
      </div>
      <div class="coursedetail-list-p">
        <div class="title">课程期限<i></i></div>
        <div class="detail">2020.9.7 12:00</div>
      </div>
    </div>
    <div class="coursedetail-detail">
      <img src="../../../../assets/images/course-banner.png" alt="">
      <div>
        西汉出土“嵌贝鹿形青铜镇”，1957年河南陕县后川出 土。西汉出土“嵌贝鹿形青铜镇”，1957年河南陕县后 川出土。。西汉出土
      </div>
    </div>
  </div>
</template>
<script>
// import api from '../../api/api.js'
// import wxService from '../../api/wxService.js'
// import store from '../../utils/store'
// import { llog } from '../../utils/log'
// import Dialog from '../../../../static/vant/dialog/dialog'
export default {
  data () {
    return {
    }
  },
  onLoad (option) {
  },
  onShow () {
    wx.hideHomeButton()
  },
  methods: {
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
      .title{
        width:516rpx;
        height:95rpx;
        font-size:32rpx;
        overflow:hidden;
        text-overflow:ellipsis;
        display:-webkit-box;
        -webkit-box-orient:vertical;
        -webkit-line-clamp:2;
        float: left;
      }
      .price{
        font-size:38rpx;
        color:rgba(245,0,2,1);
        float: right;
        span{
          font-size:24rpx;
        }
      }
    }
    .coursedetail-list{
      margin-top: 30rpx;
      .coursedetail-list-p{
        display: flex;
        height:60rpx;
        .title{
          font-size: 28rpx;
          color:rgba(102,102,102,1);
          text-align: justify;
          width:112rpx;
          display: inline-block;
          margin-left: 30rpx;
          i{
            display:inline-block;
            width:100%;
            height:0;
          }
        }
        .detail{
          display: inline-block;
          width: 400rpx;
          color:rgba(0,0,0,1);
          font-size: 28rpx;
          margin-left: 30rpx;
        }
      }
      .last{
        height: auto;
      }
    }
    .coursedetail-detail{
      text-align: center;
      margin-top: 30rpx;
      img{
        width:690rpx;
        height:386rpx;
        margin: 0 auto;
      }
      div{
        width:691rpx;
        font-size:30rpx;
        color:rgba(26,26,26,1);
        line-height:47rpx;
        margin: 0 auto;
        text-align: left;
        margin-top: 15rpx;
      }
    }
    .coursedetail-arrived{
      width:750rpx;
      height:100rpx;
      background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
      margin-top: 80rpx;
      line-height: 100rpx;
      text-align: center;
      font-size:32rpx;
      color:rgba(0,0,0,1);
    }
    .coursedetail-tobuy{
      width:750rpx;
      height:100rpx;
      display: flex;
      margin-top: 20rpx;
      line-height:100rpx;
      .coursedetail-tobuy-l{
        width:452rpx;
        height:100rpx;
        text-align: center;
        background:rgba(245,245,249,1);
      }
      .coursedetail-tobuy-r{
        width:299rpx;
        height:100rpx;
        text-align: center;
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
      }
    }
    .coursedetail-already{
      width:750rpx;
      height:99rpx;
      background:rgba(245,245,249,1);
      margin-top: 20rpx;
      line-height:100rpx;
      text-align: center;
    }
  }
</style>

