<template>
  <div class="result_container">
    <van-search :value="value" placeholder="请输入活动名称" @click="changeValue"  use-action-slot>
      <view slot="action" @click="onSearch">搜索</view><!--@search="onSearch" @change="changeValue"-->
    </van-search>

    <!--头图-->
    <!-- <div class="course-banner">
      <img class="" src="../../../assets/images/course-banner.png" alt="">
    </div> -->
    <swiper autoplay>
      <swiper-item v-for="(item,index) in imgUrls" :key="index">
        <img @click="imgclick" mode="scaleToFill" :src="item">
      </swiper-item>
    </swiper>

    <!--tab切换-->
    <div class="coursetab">
      <div class="js-menu-select">
        <div class="js-select-menu" :class="menuSlect == index?'js-select':''" v-for="(item,index) in menuArr" :key="index" @click="menuChange(index)">{{item.name}}</div>
      </div>

      <div class="coursetab-a" v-if="menuSlect =='0'" style="padding-bottom:0;">
        <!-- <div class="coursetab-list-p" v-for="item in listArr" :key="item" @click="toUrl('/pages/course/coursedetailPage/main')">
          <img class="" :src="item.img" alt="">
          <div class="coursetab-list-p-title">
            <div class="title">
             {{item.name}}
            </div>
            <div class="price">
              <span>¥</span>{{item.price}}
            </div>
          </div>
          <div class="coursetab-list-p-time">{{item.time}}  {{item.belong}}</div>
        </div> -->
        <scroll-view style="height:calc(100vh - 240rpx - 60px - 130rpx - 92rpx);" :scroll-y="true" @scrolltolower="scrolltolower">
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
      </div>

      <div class="coursetab-b" v-if="menuSlect =='1'">
        <!-- <div class="coursetab-list-p" v-for="item in listArr" :key="item" @click="toUrl('/pages/course/coursedetailPage/main')">
          <img class="" :src="item.img" alt="">
          <div class="coursetab-list-p-title">
            <div class="title">
              {{item.name}}
            </div>
            <div class="price">
              <span>¥</span>{{item.price}}
            </div>
          </div>
          <div class="coursetab-list-p-time">{{item.time}}  {{item.belong}}</div>
        </div> -->
        <div style="width:100%;text-align:center;color:#888;margin-top:150rpx;">敬请期待</div>
      </div>
    </div>
    <!--底部start-->
    <CardFooter v-bind:changeVallist="3"></CardFooter>
    <!--底部end-->
  </div>
</template>
<script>
import api from '../../../api/api.js'
import wxService from '../../../api/wxService.js'
import store from '../../../utils/store'
// import { llog } from '../../../utils/log'
import CardFooter from '../../footer/index'
export default {
  data () {
    return {
      value: '',
      active: 0,
      menuSlect: '0',
      menuArr: [
        {name: '大师公开课'},
        {name: '网络课堂'}
      ],
      listArr: [
        {
          name: '西汉出土“嵌贝鹿形青铜镇”，1957年河南陕县后川出土，镇放置在席子的的',
          img: '/assets/images/course-banner.png',
          price: '1000',
          time: '2019.6.27  17:00',
          belong: '苏州市广电总台'
        },
        {
          name: '西汉出土“嵌贝鹿形青铜镇”，1957年河南陕县后川出土，镇放置在席子的的',
          img: '/assets/images/course-banner.png',
          price: '1000',
          time: '2019.6.27  17:00',
          belong: '苏州市广电总台'
        }
      ],
      imgUrls: [],
      imgAddress: '',
      page: 1,
      per_page: 5,
      loadingFlag: false,
      nomore: false,
      noData: false,
      activity: []
    }
  },
  onLoad (option) {
    if (option.tab) {
      this.active = option.tab
    } else {
      this.active = 0
    }
    this.state = store.state
    this.headUrl = store.imgUrl
    this.getActivityList()
  },
  onShow () {
    wx.hideHomeButton()
  },
  onShareAppMessage () {
    return {
      title: '开眼',
      // imageUrl: store.imgUrl + vm.detail.images[0].img_url,
      path: `/pages/course/coursePage/main`
    }
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
  components: {CardFooter},
  methods: {
    imgclick (index) {
      wx.navigateTo({
        url: this.imgAddress
      })
    },
    toUrl (url) {
      wx.navigateTo({url: url})
    },
    // 菜单切换
    menuChange (index) {
      this.menuSlect = index
    },
    changeValue (event) {
      wx.navigateTo({
        url: '/pages/fair/pages/searchPage/main?menuSlect=' + 2
      })
    },
    onSearch () {
    },
    scrolltolower () {
      if (!this.nomore) {
        this.page++
        this.loadingFlag = true
        this.getActivityList('more')
      }
    },
    goDetail (id) {
      wx.navigateTo({
        url: '../../activitydetail/main?id=' + id
      })
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
  }
}
</script>
<style>
  page{
    padding-bottom: 110rpx;
    background-color: #F5F5F9;
  }
</style>
<style lang="scss" scoped>
  .result_container{
    .course-banner{
      width:750rpx;
      height:240rpx;
      img{
        width:750rpx;
        height:240rpx;
      }
    }
    .coursetab{
      display: flex;
      flex-direction: column;
      .js-menu-select{
        display: flex;
        width: 100%;
        flex-direction: row;
        background:rgba(255,255,255,1);
        border-bottom: 1rpx solid #eeeeee;
        .js-select-menu{
          width: 50%;
          height:92rpx;
          font-size: 30rpx;
          color:#000000;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          position: relative;
        }
        .js-select:after{
          content: '';
          position: absolute;
          bottom:8rpx;
          left: 50%;
          transform: translate(-50%);
          width:50rpx;
          height:8rpx;
          background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
          border-radius:4rpx;
        }
      }
      .coursetab-a,.coursetab-b{
        background-color: #f5f5f9;
        padding-bottom: 82rpx;
        .coursetab-list-p{
          width:750rpx;
          height:590rpx;
          background:rgba(255,255,255,1);
          margin-bottom: 20rpx;
          padding-top: 30rpx;
          img{
            display: block;
            width:690rpx;
            height:386rpx;
            margin: 0 auto;

          }
          .coursetab-list-p-title{
            width: 690rpx;
            margin: 0 auto;
            margin-top: 30rpx;
            position: relative;
            height:80rpx;
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
          .coursetab-list-p-time{
            font-size:24rpx;
            color:rgba(102,102,102,1);
            margin-top: 20rpx;
            margin-left: 32rpx;
          }
        }
      }
    }
  }
  swiper{
    height: 240rpx;
    img{
      width:100%;
      height: 100%;
    }
  }
  .activity_item{
    background: #fff;
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
</style>

<style lang="scss">
  .van-search{
    height:1.08rem;
    padding: 0.2rem 0 0.2rem 0.3rem;
    background-color: #F5F5F9 !important;
    .van-cell{
      padding: 0.11rem 0.1rem !important;
    }
  }
  .van-search__content{
    background-color: #ffffff !important;
  }

</style>
