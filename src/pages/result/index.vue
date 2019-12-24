<template>
  <div class="result_container">
    <van-search :value="value" placeholder="请输入宝贝名称或者ID" @search="onSearch" @change="changeValue" use-action-slot>
      <view slot="action" @click="onSearch">搜索</view>
    </van-search>
    <div class="van_tabs">
      <!--<van-tabs :active="active" @change="onChange">
        <van-tab title="全部" v-for="(item, index) in tabName" :title="item" :key="index">
          <div class="tabItem">
            <scroll-view :style="{'height': '100%'}" :scroll-y="true" @scrolltolower="scrolltolower">
              <div class="result_item" v-for="(val, idx) in resultArr" :key="idx" @click="godetail(val)">
                <div class="img"><img :src="val.img_url" /></div>
                <div class="content">
                  <div class="title">{{val.name}}</div>
                  <div class="num">宝贝id：{{val.id}}</div>
                  <div class="button_wrap">
                    <button v-if="val.pay_status == 1 && val.state == 2" class="look" @click.stop="goreport">查看报告</button>
                    <button v-if="val.pay_status == 1 && val.state == 1" class="appraisal">鉴定中</button>
                    <button v-if="val.pay_status == 0" class="pay" @click.stop="pay(val)">付款</button>
                  </div>
                </div>
              </div>
              <div class="noData" v-if="noData">目前还没有鉴定的宝贝哦</div>
              <div class="loading" v-if="loadingFlag">
                <van-loading type="spinner" size="18px" /> 加载中
              </div>
              <div class="nomore" v-if="nomore">没有更多数据了~~</div>
            </scroll-view>
          </div>
        </van-tab>
      </van-tabs>-->
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
              <div class="img"><img :src="val.img_url" /></div>
              <div class="content">
                <div class="title">{{val.name}}</div>
                <div class="num">宝贝id：{{val.id}}</div>
                <div class="button_wrap">
                  <button v-if="(val.pay_status == 1 || val.pay_status == 4) && val.state == 2" class="look" @click.stop="goreport(val)">查看报告</button>
                  <button v-if="val.pay_status == 1 && val.state == 1" class="appraisal">鉴定中</button>
                  <button v-if="val.pay_status == 0" class="pay" @click.stop="pay(val)">付款</button>
                </div>
              </div>
            </div>
            <div class="noData" v-if="noData">没有相关宝贝信息哦</div>
            <div class="loading" v-if="loadingFlag">
              <van-loading type="spinner" size="18px" /> 加载中
            </div>
            <div class="nomore" v-if="nomore">这是我的底线</div>
          </scroll-view>
        </div>
      </div>
      <backHome></backHome>
    </div>
  </div>
</template>
<script>
import backHome from '../../components/backhome/backhome'
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
import store from '../../utils/store'
import { llog } from '../../utils/log'
export default {
  data () {
    return {
      value: '',
      active: 0,
      num: 3,
      resultArr: [],
      tabName: ['全部', '鉴定完成', '待鉴定', '待付款'],
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
  components: {backHome},
  methods: {
    getList (item) {
      let page = this
      wxService.request({
        url: api.default.treasureList,
        method: 'post',
        data: {
          'user_id': wx.getStorageSync('user_id'),
          'token': wx.getStorageSync('token'),
          'type': page.active,
          'keyword': page.value,
          'page': page.page,
          'per_page': page.per_page
        },
        success: function (res1) {
          if (res1.code === 0) {
            if (res1.data.list.length > 0) {
              res1.data.list.forEach((v, i) => {
                if (v.img_url.indexOf('http') === -1) {
                  v.img_url = store.imgUrl + v.img_url
                }
              })
              if (item === 'more') {
                page.resultArr = page.resultArr.concat(res1.data.list)
              } else {
                page.resultArr = res1.data.list
              }
              if (page.resultArr.length >= Number(res1.data.pagination.total_count)) {
                page.nomore = true
              }
              page.loadingFlag = false
            } else {
              page.resultArr = []
              page.noData = true
            }
            // page.certifing_count = res1.data.label.certifing_count
            // page.unpaid_count = res1.data.label.unpaid_count
            // this.numArr[2] = res1.data.label.certifing_count
            // this.numArr[3] = res1.data.label.unpaid_count
            page.numArr = ['', '', res1.data.label.certifing_count, res1.data.label.unpaid_count]
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
    goHome () {
      wx.redirectTo({
        url: '../home/main'
      })
    },
    onChange (event) {
      this.active = event.mp.detail.index
      this.page = 1
      this.loadingFlag = false
      this.nomore = false
      this.noData = false
      this.resultArr = []
      this.getList()
    },
    changeValue (event) {
      this.value = event.mp.detail
    },
    onSearch () {
      let vm = this
      this.page = 1
      this.loadingFlag = false
      this.nomore = false
      this.noData = false
      llog({ action_from: '我的鉴定页', action_to: '我的鉴定页', action_type: '搜索', action_status: 1, action_p1: vm.value })
      this.resultArr = []
      this.getList()
    },
    goreport (item) {
      llog({ action_from: '我的鉴定页', action_to: '鉴定报告页', action_type: '浏览', action_status: 1, action_p1: item.id })
      wx.navigateTo({ url: '/pages/share/main?id=' + item.id })
    },
    scrolltolower () {
      if (!this.nomore) {
        this.page++
        this.loadingFlag = true
        this.getList('more')
      }
    },
    pay (val) {
      wx.setStorageSync('treasure_id_nw', val.id)
      wx.setStorageSync('order_id_nw', val.order_id)
      llog({ action_from: '我的鉴定页', action_to: '免责条款页', action_type: '去支付', action_status: 1, action_p1: val.id })
      wx.redirectTo({
        url: '../nonrespons/main'
      })
    },
    openSetting () {
      wx.openSetting({
        success (res) {
          console.log(res)
          wx.hideLoading()
        }
      })
    },
    godetail (item) {
      if (item.pay_status === '1' || item.pay_status === '4') {
        llog({ action_from: '我的鉴定页', action_to: '鉴定详情页', action_type: '浏览', action_status: 1, action_p1: item.id })
        wx.navigateTo({
          url: '../detail/main?id=' + item.id
        })
      } else {
        llog({ action_from: '我的鉴定页', action_to: '鉴定详情页', action_type: '浏览', action_status: 1, action_p1: item.id })
        wx.navigateTo({
          url: '../detailNopay/main?id=' + item.id
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
    .bottom{
      position: fixed;
      bottom:0;
      display: flex;
      flex-direction: row;
      width:100%;
      font-weight: bold;
      border-top:1px solid #f5f5f9;
      div{
        width:50%;
        height:85rpx;
        line-height: 85rpx;
        text-align: center;
        margin:0 auto;
        font-size:32rpx;
        background: #fff;
      }
      .active{
        background: #000;
        color:#fff;
      }
    }
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
  .concact{
    width: 1.1rem;
    height: 1.1rem;
    line-height: 0.35rem;
    border-radius: 50%;
    position:fixed;
    right: 0.25rem;
    bottom: 1.3rem;
    background: linear-gradient(to right , #F1D0A5, #D5AB79);
    color:#fff;
    font-size: 0.28rem;
    box-sizing:border-box;
    padding: 0.2rem 0.2rem;
    text-align:center;
  }
</style>
