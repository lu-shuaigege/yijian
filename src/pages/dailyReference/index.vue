<template>
  <div class="eyes-container">
    <div class="eyes-fixed">
      <div class="search-title">
        <van-search :value="keywords" placeholder="请输入搜索名称"  use-action-slot class="search-input" @change="changeValue">
          <view slot="action" @click="saerchData">搜索</view>
        </van-search>
      </div>
    </div>
      <div class="js-class-kj-b">
        <div class="search-item-c-list" v-for="item in list" :key="item" @click="toDetail(item.id)">
          <div class="search-item-c-img">
            <img :src="item.cover_img_url"/>
          </div>
          <div class="search-title-kj">
            <div class="search-title-left">{{item.name}}播放次数播放次数播放次数播放次数播放次数播放次数播放次数播放次数</div>
            <!--<div class="search-title-click">播放次数：{{item.click}}</div>-->
          </div>
        </div>
        <div style="width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center"  v-if="dpIsLoading">
          <van-loading type="spinner" size="18px" />加载中...
        </div>
        <div style="" v-if="nomore">
          <van-divider contentPosition="center">没有更多数据了</van-divider>
        </div>
        <!--无相关内容start-->
        <div class="dian-que-kj" v-if="!list.length">
          <img src="../../assets/images/wuneirong.png"/>
          <div class="dian-que-desc">无相关内容</div>
        </div>
        <!--无相关内容end-->
      </div>
    <!--返回首页start-->
    <backHome></backHome>
    <!--返回首页end-->
  </div>
</template>

<script>
  import api from '../../api/api'
  import wxService from '../../api/wxService'
  import backHome from '../../components/backhome/backhome'
  export default {
    data () {
      return {
        keywords: '',
        page: 1,
        per_page: 10,
        nomore: false,
        dpIsLoading: false,
        list: []
      }
    },
    components: {backHome},
    onLoad () {
      wx.hideHomeButton()
    },
    onShow () {
      wx.hideHomeButton()
      this.queShow = false
      this.keywords = ''
      this.page = 1
      this.per_page = 10
      this.nomore = false
      this.dpIsLoading = false
      this.list = []
      this.getList()
    },
    methods: {
      saerchData () {
        let _this = this
        _this.nomore = false
        _this.list = []
        wx.pageScrollTo({
          scrollTop: 0
        })
        _this.page = 1
        _this.getList('more')
        console.log(_this.list.length)
      },
      getList (item) {
        let _this = this
        wxService.request({
          url: api.shopapi.daily,
          method: 'get',
          data: {
            'keywords': _this.keywords,
            'page': _this.page,
            'per_page': _this.per_page
          },
          success: function (res) {
            if (res.code === 0) {
              if (res.data.list.length > 0) {
                if (item === 'more') {
                  _this.list = _this.list.concat(res.data.list)
                } else {
                  _this.list = res.data.list
                }
                if (_this.list.length >= Number(res.data.paginate.total)) {
                  _this.nomore = true
                }
                _this.dpIsLoading = false
              } else {
                _this.list = []
                _this.nomore = false
              }
            }
          }
        })
      },
      // 搜索
      changeValue (event) {
        let _this = this
        _this.keywords = event.mp.detail
      },
      toDetail (id) {
        wx.navigateTo({
          url: '/pages/dailyReferenceDetail/main?id=' + id
        })
      },
      // 加载更多
      couponLoadMore () {
        let _this = this
        if (!_this.nomore) {
          _this.page++
          _this.dpIsLoading = true
          setTimeout(function () {
            _this.getList('more')
          }, 500)
        }
      }
    },
    onReachBottom () { // 到底部加载更多
      this.couponLoadMore()
    },
    onUnload () {
    },
    onShareAppMessage () {
      return {
        title: '每日一鉴',
        // imageUrl: store.imgUrl + vm.detail.images[0].img_url,
        path: `/pages/dailyReference/main`
      }
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
  }
  .search-input .van-search{
    padding-right: 8px;
    background-color: #F5F5F9 !important;
  }
  .search-input .van-search__content{
    background-color: #ffffff;
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
      background-color: #F5F5F9;
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
      .js-class-kj-b{
        margin-top: 104rpx;
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
            justify-content: space-between;
            padding-top: 30rpx;
            padding-bottom: 10rpx;
            .search-title-left {
              width: 100%;
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
            .search-title-click{
              font-size: 28rpx;
              color: #666;
              text-align: right;
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
      }
    /*}*/
  }
</style>
