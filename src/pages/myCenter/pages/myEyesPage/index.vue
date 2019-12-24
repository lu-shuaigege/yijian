<template>
  <div class="eyes-container">
    <div class="eyes-fixed">
      <div class="search-title">
        <van-search :value="value" placeholder="请输入活动名称"  @search="onSearch" @change="changeValue" use-action-slot class="search-input">
          <view slot="action" @click="onSearch">搜索</view>
        </van-search>
      </div>
      <!--切换start-->
      <div class="search-menu-kj">
        <div class="search-menu-top">
          <div class="search-menu-list" :class="selectMenu ==index?'menu-select':''" v-for="(item,index) in menuArr"
               :key="index" @click="menuChange(index)">
            {{item.name}}
          </div>
        </div>
      </div>
      <!--切换end-->
      <div class="js-class-fixed" v-if="selectMenu === '0'">
        <div class="search-menu-list search-menu-list-two" :class="selectTwoMenu ==index?'menu-select':''" v-for="(item,index) in menuTwoArr"
             :key="index" @click="menuTwoChange(index)">
          {{item.name}}
        </div>
        <div class="num" v-if="numArr[index] != ''">{{numArr[index]}}</div>
      </div>
    </div>
    <!--<div class="search-content-kj">-->
      <!--线下课程start-->
      <div class="js-class-kj-a" v-if="selectMenu =='0'">
        <!--列表start-->
        <!-- <div class="online-list" v-for="(item,index) in listArr" :key="index">
          <img src="../../../../assets/images/banner-m.png" class="online-left-img"/>
          <div class="online-right">
            <div class="online-right-a">
              <div class="online-right-title">{{item.title}}</div>
              <div class="online-right-id">活动时间: {{item.time}}</div>
              <div class="online-right-b">
                <div class="online-x-btn">待参加</div>
                <div v-if="" class="online-x-btn online-x-btn-a">已完成</div>
                <div v-if="" class="online-x-btn online-x-btn-b">未到场</div>
              </div>
            </div>
          </div>
        </div> -->
        <scroll-view :style="{'height': 'calc(100vh - 108rpx - 100rpx - 100rpx)'}" :scroll-y="true" @scrolltolower="scrolltolower">
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
        <!--列表end-->
    </div>
      <!--线下课程end-->
      <!--网络课程start-->
      <div class="js-class-kj-b" v-if="selectMenu =='1'">
        <!-- <div class="search-item-c-list" @click="toUrl('/pages/course/coursedetailPage/main')">
          <div class="search-item-c-img">
            <img src="../../../../assets/images/banner-m.png"/>
          </div>
          <div class="search-title-kj">
            <div class="search-title-left">西汉出土“嵌贝鹿形青铜镇”，1957年河南陕县后川出土，镇放置在席子的</div>
          </div>
          <div class="search-desc">
            <div>2019.6.27 17:00 苏州市广电总台</div>
            <div class="search-look">立即查看</div>
            <div class="search-look search-look-b">已失效</div>
          </div>
        </div> -->
        <div>
          <van-divider contentPosition="center">暂无内容</van-divider>
        </div>
      </div>
      <!--集市店铺end-->
    <!--无相关内容start-->
    <div class="dian-que-kj" v-if="!queShow">
      <img src="../../../../assets/images/wuneirong.png"/>
      <div class="dian-que-desc">无相关内容</div>
    </div>
    <!--无相关内容end-->
  </div>
</template>

<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  // import store from '../../utils/store'
  // import global from '../../utils/global'
  // import { llog } from '../../utils/log'
  export default {
    data () {
      return {
        value: '',
        // 菜单
        menuArr: [
          {name: '线下课程'},
          {name: '网络课程'}
        ],
        // 二级菜单
        menuTwoArr: [
          {name: '全部'},
          {name: '已完成'},
          {name: '待参加'},
          {name: '未到场'}
        ],
        // 线上课程
        listArr: [
          {title: '这里是活动的标题标题', time: '2019.10.22'},
          {title: '这里是活动的标题标题', time: '2019.10.22'},
          {title: '这里是活动的标题标题', time: '2019.10.22'},
          {title: '这里是活动的标题标题', time: '2019.10.22'},
          {title: '这里是活动的标题标题', time: '2019.10.22'},
          {title: '这里是活动的标题标题', time: '2019.10.22'},
          {title: '这里是活动的标题标题', time: '2019.10.22'},
          {title: '这里是活动的标题标题', time: '2019.10.22'}
        ],
        selectMenu: '0',
        selectTwoMenu: '0',
        queShow: true,
        page: 1,
        per_page: 5,
        loadingFlag: false,
        nomore: false,
        noData: false,
        resultArr: [],
        numArr: []
      }
    },
    components: {},
    methods: {
      toUrl (url) {
        wx.navigateTo({url: url})
      },
      menuChange (index) {
        this.selectMenu = index.toString()
      },
      menuTwoChange (index) {
        this.selectTwoMenu = index
        this.page = 1
        this.loadingFlag = false
        this.nomore = false
        this.noData = false
        this.resultArr = []
        this.getList()
      },
      onSearch () {
        console.log(this.value)
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
      /** call api */
      getList (item) {
        let page = this
        wxService.request({
          url: api.erqi.rosterList,
          method: 'get',
          data: {
            'user_id': wx.getStorageSync('user_id'),
            'token': wx.getStorageSync('token'),
            'type': page.selectTwoMenu,
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
      }
    },
    onLoad () {
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
      this.selectMenu = '0'
      this.selectTwoMenu = '0'
      this.queShow = true
    },
    onUnload () {
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
    /*padding-bottom: 110rpx;*/
  }
  .search-input .van-search{
    background-color: #F5F5F9 !important;
  }
  .van-search__content{
    background-color: #ffffff !important;
  }
</style>
<style lang="scss" scoped>
  .eyes-container{
    .eyes-fixed{
      position: fixed;
      top:0;
      left: 0;
      width: 100%;
      z-index: 10;
      background-color: #fff;
    }
    .search-title {
      width: 100%;
      color: #000000;
      font-size: 30rpx;
      height: 100rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .search-input{
        width: 100%;
      }
    }
    .js-class-fixed{
      /*position: fixed;*/
      /*top:222rpx;*/
      /*left: 0;*/
      width: 100%;
      /*z-index: 10;*/
      display: flex;
      align-items: center;
      flex-direction: row;
      background-color: #ffffff;
      border-bottom: 1rpx solid #EEEEEE;
      .num{
        position: absolute;
        color: #F50002;
        font-size:30rpx;
        left:69%;
        font-weight:500;

      }
      .search-menu-list {
        position: relative;
        height: 92rpx;
        color: #000000;
        font-size: 30rpx;
        font-weight: bold;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .search-menu-list-two{
        width: 25%;
      }
      .menu-select:after {
        content: "";
        position: absolute;
        bottom: 8rpx;
        width: 50rpx;
        height: 8rpx;
        background: linear-gradient(90deg, rgba(241, 208, 165, 1), rgba(213, 171, 121, 1));
        border-radius: 4rpx;
        left:50%;
        transform: translate(-50%);
      }
    }
    .search-menu-kj {
      height: 100rpx;
      width: 100%;
      background-color: #ffffff;
      .search-menu-top {
        display: flex;
        align-items: center;
        flex-direction: row;
        border-bottom: 2rpx solid #EEEEEE;
        .search-menu-list {
          position: relative;
          width: 50%;
          height: 92rpx;
          color: #000000;
          font-size: 30rpx;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .menu-select:after {
          content: "";
          position: absolute;
          bottom: 8rpx;
          width: 50rpx;
          height: 8rpx;
          background: linear-gradient(90deg, rgba(241, 208, 165, 1), rgba(213, 171, 121, 1));
          border-radius: 4rpx;
          left:50%;
          transform: translate(-50%);
        }
      }
    }
    .dian-que-kj{
      width:200rpx;
      position: fixed;
      top:50%;
      left:50%;
      transform: translate(-50%,-50%);
      background-color: #F5F5F9;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img{
        width:175rpx;
        height:100rpx;
      }
      .dian-que-desc{
        width: 100%;
        margin-top: 30rpx;
        font-size: 32rpx;
        color:#ACACAC;
        text-align: center;
        font-family: PingFangSC-Regular;
      }
    }
    /*.search-content-kj {*/
      /*margin-top: 290rpx;*/
      .js-class-kj-a{
        padding-top: 293rpx;
        .online-list{
          position: relative;
          box-sizing: border-box;
          background-color: #ffffff;
          border-top:1rpx solid #f5f5f5;
          padding:30rpx 30rpx 30rpx 220rpx;
          display: flex;
          flex-direction: row;
          .online-left-img{
            position: absolute;
            top:30rpx;
            left:30rpx;
            width:166rpx;
            height: 166rpx;
          }
          .online-right{
            width: 100%;
            min-height: 166rpx;
            display: flex;
            flex-direction: row;
            .online-right-a{
              width: 80%;
              text-align: left;
              position: relative;
              .online-right-title{
                font-size: 30rpx;
                color:#000000;
              }
              .online-right-id{
                font-size: 28rpx;
                color:#888888;
                margin-top: 5rpx;
              }
              .online-right-rd{
                font-size: 28rpx;
                color:#888888;
                position: absolute;
                bottom: 0;
              }
            }
            .online-right-b{
              width: 30%;
              margin-top: 40rpx;
              .online-x-btn{
                display: flex;
                align-items: center;
                justify-content: center;
                color:rgba(245,245,249,1);
                font-size: 24rpx;
                width:142rpx;
                height:42rpx;
                background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
                border-radius:25rpx;
              }
              .online-x-btn-a{
                background:rgba(0,0,0,1);
              }
              .online-x-btn-b{
                background:rgba(172,172,172,1);
              }
            }
          }
        }
      }
      .js-class-kj-b{
        margin-top: 194rpx;
        .search-item-c-list {
          width: 100%;
          padding: 30rpx;
          box-sizing: border-box;
          background-color: #ffffff;
          margin-bottom: 20rpx;
          .search-item-c-img {
            height: 386rpx;
            img {
              width: 100%;
              height: 100%
            }
          }
          .search-title-kj {
            display: flex;
            align-items: center;
            padding-top: 30rpx;
            .search-title-left {
              width: 100%;
              height: 95rpx;
              font-size: 32rpx;
              color: #000000;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
          .search-desc {
            text-align: left;
            color: #666666;
            font-size: 24rpx;
            padding-top: 24rpx;
            position: relative;
            .search-look{
              position: absolute;
              right: 0;
              bottom:0;
              width:142rpx;
              height:50rpx;
              color:#ffffff;
              display: flex;
              align-items: center;
              justify-content: center;
              background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
              border-radius:25rpx;
            }
            .search-look-b{
              background:rgba(136,136,136,1);
              opacity:0.5;
            }
          }
        }
      }
    /*}*/
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
</style>
