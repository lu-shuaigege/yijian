<template>
  <div class="result_container">
    <van-search :value="value" placeholder="请输入活动名称" @search="onSearch" @change="changeValue" use-action-slot>
      <view slot="action" @click="onSearch">搜索</view>
    </van-search>
    <div class="van_tabs">
      <div class="tab_head">
        <ul>
          <li v-for="(item, index) in tabName" :key="index" :class="active == index ? 'active':''" @click="tabChange(index)">
            <div class="line">{{item}}
              <span class="num" v-if="numArr[index] != ''">{{numArr[index]}}</span>
            </div>
          </li>
        </ul>
      </div>
      <div class="tab_body">
        <div class="tabItem">
          <scroll-view :style="{'height': '100%'}" :scroll-y="true" @scrolltolower="scrolltolower">
            <div class="result_item" v-for="(val, idx) in resultArr" :key="idx" @click="godetail(val)">
              <div class="img"><img :src="val.image" /></div>
              <div class="content">
                <div class="title">{{val.title}}</div>
                <div class="num">{{val.hd_time}}</div>
                <div class="button_wrap">
                  <button v-if="val.type == 1" class="look">{{val.status}}</button>
                  <button v-if="val.type == 2" class="appraisal">{{val.status}}</button>
                  <button v-if="val.type == 3" class="gray">{{val.status}}</button>
                </div>
              </div>
            </div>
            <div class="noData" v-if="noData">没有相关报名信息哦</div>
            <div class="loading" v-if="loadingFlag">
              <van-loading type="spinner" size="18px" /> 加载中
            </div>
            <div class="nomore" v-if="nomore">这是我的底线</div>
          </scroll-view>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
// import store from '../../utils/store'
// import { llog } from '../../utils/log'
export default {
  data () {
    return {
      value: '',
      active: 0,
      num: 3,
      resultArr: [],
      tabName: ['全部', '已完成', '待参加', '未到场'],
      numArr: [],
      certifing_count: '',
      unpaid_count: '',
      page: 1,
      per_page: 5,
      loadingFlag: false,
      nomore: false,
      noData: false
    }
  },
  onLoad (option) {
    if (option.tab) {
      this.active = option.tab
    } else {
      this.active = 0
    }
    this.value = ''
    this.page = 1
    this.loadingFlag = false
    this.nomore = false
    this.noData = false
    this.resultArr = []
    this.getList()
  },
  onShow () {
    wx.hideHomeButton()
  },
  methods: {
    getList (item) {
      let page = this
      wxService.request({
        url: api.erqi.rosterList,
        method: 'get',
        data: {
          'user_id': wx.getStorageSync('user_id'),
          'token': wx.getStorageSync('token'),
          'type': page.active,
          'keyword': page.value,
          'page': page.page,
          'pageSize': page.per_page
        },
        success: function (res1) {
          if (res1.code === 0) {
            if (res1.data.items.length > 0) {
              if (item === 'more') {
                page.resultArr = page.resultArr.concat(res1.data.items)
              } else {
                page.resultArr = res1.data.items
              }
              if (page.resultArr.length >= Number(res1.data._meta.total_count)) {
                page.nomore = true
              }
              page.loadingFlag = false
            } else {
              page.resultArr = []
              page.noData = true
            }
            // page.numArr = ['', '', res1.data._meta.dcj_count, res1.data._meta.wdc_count]
            page.numArr = ['', '', res1.data._meta.dcj_count, '']
          }
        },
        complete: function (e) {
          if (e.data.code === 40003) {
            // page.getList()
          }
          page.loadingFlag = false
        }
      })
    },
    changeValue (event) {
      this.value = event.mp.detail
    },
    onSearch () {
      this.page = 1
      this.loadingFlag = false
      this.nomore = false
      this.noData = false
      this.resultArr = []
      this.getList()
    },
    scrolltolower () {
      if (!this.nomore) {
        this.page++
        this.loadingFlag = true
        this.getList('more')
      }
    },
    godetail (item) {
      if (item.type === 2) {
        wx.navigateTo({
          url: '../waitJoin/main?id=' + item.id
        })
      } else {
        wx.navigateTo({
          url: '../signupdetail/main?id=' + item.id
        })
      }
    },
    tabChange (idx) {
      this.active = idx
      this.page = 1
      this.loadingFlag = false
      this.nomore = false
      this.noData = false
      this.resultArr = []
      this.getList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .result_container{
    .result_item{
      height: 2.46rem;
      border-top: 1px solid #f5f5f9;
      padding:0.4rem 0.15rem 0.4rem 0.3rem;
      box-sizing:border-box;
      .img{
        float:left;
        width:1.65rem;
        height:1.65rem;
        display:block;
        margin-right:0.25rem;
        img{
          width:1.65rem;
          height:1.65rem;
          display:block;
        }
      }
      .content{
        float:left;
        width:4.83rem;
        .title{
          height: 0.5rem;
          line-height:0.5rem;
          font-size:0.3rem;
          color:#333;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .num{
          height: 0.5rem;
          line-height:0.5rem;
          font-size:0.28rem;
          color:#888;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-bottom:0.22rem;
        }
        .button_wrap{
          height:0.42rem;
          button{
            width:1.42rem;
            line-height:0.42rem;
            text-align:center;
            color:#fff;
            font-size:0.22rem;
            border-radius:0.21rem;
            padding:0;
            margin:0;
          }
          button::after{
            border:none;
          }
          .look{
            background:#000;
          }
          .appraisal{
            background: linear-gradient(to right , #F1D0A5, #D5AB79);
          }
          .gray{
            background: #acacac;
          }
          .pay{
            background:#F50002;
          }
        }
      }
    }
    .result_item:first-child{
      border-top:0;
    }
  }
  .tab_head{
    height: 92rpx;
    border-bottom:1px solid #f5f5f9;
    ul{
      li{
        float: left;
        width: 25%;
        height: 92rpx;
        line-height: 90rpx;
        text-align:center;
        font-size:30rpx;
        color:#000;
        .line{
          font-weight: bold;
          height: 84rpx;
          line-height: 84rpx;
          padding: 0 10rpx;
          display:inline-block;
        }
        .num{
          color:#F50002;
        }
      }
      li.active .line{
        border-bottom:4px solid #D5AB79;
      }
    }
  }
</style>
<style lang="scss">
  .van-search{
    height:1.08rem;
    padding: 0.2rem 0 0.2rem 0.3rem;
    .van-cell{
      padding: 0.11rem 0.1rem !important;
    }
  }
  .van-tabs--line{
    padding-top:0.92rem !important;
    .van-tabs__wrap{
      height:0.92rem!important;
      scroll-view{
        height:100%;
        .van-tabs__line {
          height:0.08rem;
          border-radius:0.04rem;
          background-color:#D5AB79!important;
        }
        .van-tab--active{
          color:#000;
        }
        .van-tab{
          color:#000;
          font-weight:500;
          font-size:0.3rem;
        }
      }
    }
  }
  .van_tabs{
    .tabItem{
      // height: calc(100vh - 2rem - 0.84rem);
      height: calc(100vh - 2rem - 0.04rem);
      .loading{
        text-align: center;
        color: #666;
        font-size: 0.3rem;
      }
      .nomore{
        height: 0.6rem;
        line-height: 0.6rem;
        text-align: center;
        font-size: 0.25rem;
        color: #666;
        margin-bottom: 0.2rem;
      }
      .noData{
        height: 0.5rem;
        line-height: 0.5rem;
        text-align: center;
        font-size: 0.3rem;
        color: #888;
        margin-top: 1rem;
      }
    }
  }
</style>