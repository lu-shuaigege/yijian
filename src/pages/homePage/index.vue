<template>
  <div class="home-container">
    <!--轮播图start-->
    <div class="home-swiper-kj">
      <swiper indicator-dots autoplay style="height: 100%">
          <swiper-item v-for="(item,index) in imgUrls" :key="index">
            <image style="width: 100%;height: 100%" :src="item.img_banner" @click="bannerUrl(item.img_banner_url,item.open_type)"></image>
          </swiper-item>
      </swiper>
    </div>
    <!--轮播图end-->
    <!--搜索条start-->
    <div class="home-search-kj">
      <p class="home-search-input" @click="searchBady">请输入宝贝名字</p>
    </div>
    <!--搜索条end-->
    <!--广告start-->
    <div class="home-adsense-kj">
      <img src="/static/images/guanggao-m.png"/>
    </div>
    <!--广告end-->
    <!--分类start-->
    <div class="home-class-kj">
      <div class="home-class-item" v-for="(item,index) in iconArr" :key="index" @click="classHref(item.jump_url,item.open_type,item.title)">
        <img :src="item.bg_img_url" class="home-class-img"/>
        <p class="home-class-name">{{item.title}}</p>
      </div>
    </div>
    <!--分类end-->
    <!--每日一鉴start-->
    <div class="home-model-kj">
      <div class="home-model-item home-model-item-a" v-for="(itemDay,indexDay) in bigLan" :key="indexDay" @click="bigPage(itemDay.jump_url,itemDay.open_type)">
        <img :src="itemDay.bg_img_url"/>
      </div>
    </div>
    <!--每日一鉴end-->
    <!--集市start-->
    <div class="home-market-kj">
      <div class="home-market-title">集市宝贝</div>
      <div class="home-market-roll">
        <scroll-view scroll-x="true" style="width: 100%;">
          <view class="home-market-list" :class="selectMenu == 0?'menu-select m-s':''" @click="menuChange('0','')">
            <text>全部</text>
          </view>
          <view class="home-market-list" :class="selectMenu == index+1?'menu-select m-s':''"
                v-for="(item,index) in marketArr" :key="index+1"  @click="menuChange(index+1,item.id)">
            <text>{{item.name}}</text>
          </view>
        </scroll-view>
      </div>
      <div class="home-market-product">
        <div class="home-market-list-d">
          <div class="home-product-list" v-for="(item,index) in marketData" :key="index" @click="lookJiShi(item.id)">
            <div class="home-product-img">
              <img :src="item.img_url"/>
            </div>
            <div class="home-product-name">{{item.name}}</div>
          </div>
          <div class="home-no-bady" v-if="marketData.length === 0">暂无相关宝贝</div>
        </div>
        <div class="home-product-more">
          <div @click="lookMoreJs('1')">查看更多</div>
        </div>
      </div>
    </div>
    <!--集市end-->
    <!--集市店铺start-->
    <div class="home-shop-kj">
      <div class="home-shop-title">集市店铺</div>
      <div class="home-shop-item">
         <div class="home-shop-list" v-for="(item,index) in jiShopData" :key="index" @click="lookShopEdit(item.id)">
           <img :src="item.rec_img_url" class="home-shop-imgs"/>
           <div class="home-shop-right">
             <p class="home-shop-name">{{item.name}}</p>
             <p class="home-shop-desc">{{item.description}}</p>
           </div>
         </div>
        <div class="home-product-more">
          <div @click="lookMoreJs('2')">查看更多</div>
        </div>
      </div>
    </div>
    <!--集市店铺end-->
    <!--底部start-->
    <CardFooter v-bind:changeVallist="0"></CardFooter>
    <!--底部end-->
  </div>
</template>

<script>
  // import store from '../../utils/store'
  import api from '../../api/api'
  import wxService from '../../api/wxService'
  import CardFooter from '../footer/index'
  export default {
    data () {
      return {
        // vals: '0',
        // 首页轮播图
        imgUrls: [],
        // 课程
        iconArr: [],
        // 大栏位
        bigLan: [],
        // 集市
        marketArr: [],
        marketData: [],
        goodId: '',
        // 集市选择
        selectMenu: '0',
        // 集市店铺
        jiShopData: [],
        isprime: 0
      }
    },
    components: {CardFooter},
    methods: {
      // 获取会员状态
      getDetail () {
        let _this = this
        wxService.request({
          url: api.shopapi.userMe,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.code === 0) {
              if (res.data.is_prime === 0) {
                _this.isprime = 0
              } else {
                _this.isprime = 1
              }
            }
          }
        })
      },
      // 轮播图跳转
      bannerUrl (url, type) {
        if (type === 'navigate') {
          wx.navigateTo({
            url: url
          })
        } else {
          wx.reLaunch({url: url})
        }
      },
      // 查看集市店铺
      lookShopEdit (id) {
        wx.navigateTo({
          url: '../fair/pages/dianpuDetailPage/main?id=' + id
        })
      },
      // 集市查看详情
      lookJiShi (id) {
        wx.navigateTo({
          url: '../fair/pages/marketDetailsPage/main?id=' + id
        })
      },
      // 集市查看更多
      lookMoreJs (val) {
        if (val === '1') {
          wx.reLaunch({
            url: '../fair/pages/marketPage/main'
          })
        } else {
          wx.reLaunch({
            url: '../fair/pages/marketPage/main?menuselect=' + '1'
          })
        }
      },
      // 搜索跳转
      searchBady () {
        wx.navigateTo({
          url: '../fair/pages/searchPage/main'
        })
      },
      // 菜单跳转
      classHref (url, type, title) {
        let _this = this
        if (type === 'switchTab') {
          wx.reLaunch({url: url})
        } else {
          switch (title) {
            case '一鉴会员':
              wx.navigateTo({
                url: url + 'isprime=' + _this.isprime
              })
              break
            case '邀请有礼':
              if (_this.isprime === 0) {
                wx.navigateTo({
                  url: '/pages/myCenter/pages/openVipPage/main'
                })
                return false
              }
              break
          }
          if (title !== '一鉴会员') {
            wx.navigateTo({
              url: url
            })
          }
        }
      },
      // 大栏位跳转
      bigPage (url, type) {
        if (type === 'switchTab') {
          wx.reLaunch({url: url})
        } else {
          wx.navigateTo({
            url: url
          })
        }
      },
      // 集市菜单切换
      menuChange (index, id) {
        let _this = this
        _this.selectMenu = index
        _this.goodId = id
        _this.getMarketData()
      },
      // 获取集市推荐数据
      getMarketData () {
        let _this = this
        let data = {
          'category_id': _this.goodId,
          'page': '1',
          'token': wx.getStorageSync('token')
        }
        if (_this.selectMenu !== '0') {
          data.per_page = '8'
        }
        if (_this.selectMenu === '0') {
          data.is_rec = '1'
        }
        wxService.request({
          url: api.twoapi.goodsList,
          method: 'get',
          data: data,
          success: function (res) {
            if (res.code === 0) {
              _this.marketData = res.data.list
            }
          }
        })
      },
      // // 获取集市数据
      // getMarketData2 () {
      //   let _this = this
      //   wxService.request({
      //     url: api.twoapi.goodsList,
      //     method: 'get',
      //     data: {
      //       'token': wx.getStorageSync('token'),
      //       'sort': 0,
      //       'category_id': _this.goodId,
      //       'page': '1',
      //       'per_page': 8
      //     },
      //     success: function (res) {
      //       if (res.code === 0) {
      //         _this.marketData = res.data.list
      //       }
      //     }
      //   })
      // },
      // 获取集市店铺
      getRecommendData () {
        let _this = this
        wxService.request({
          url: api.twoapi.shopRecommend,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.code === 0) {
              _this.jiShopData = res.data
            }
          }
        })
      },
      // 轮播图
      homeBanner () {
        let _this = this
        wxService.request({
          url: api.twoapi.homeBanners,
          method: 'get',
          data: {},
          success: function (res) {
            if (res.code === 0) {
              _this.imgUrls = res.data.banners
            }
          }
        })
      },
      // 菜单
      homeMenuPageNav () {
        let _this = this
        wxService.request({
          url: api.twoapi.homePageNav,
          method: 'get',
          data: {},
          success: function (res) {
            if (res.code === 0) {
              _this.iconArr = res.data.crumbs
              _this.bigLan = res.data.menus
            }
          }
        })
      },
      // 集市
      homeShop () {
        let _this = this
        wxService.request({
          url: api.twoapi.goodCategory,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.code === 0) {
              _this.marketArr = res.data.category
              _this.getMarketData()
            }
          }
        })
      }
    },
    onShow () {
      wx.hideHomeButton()
      let _this = this
      // 首页轮播图
      _this.homeBanner()
      // 菜单
      _this.homeMenuPageNav()
      // 集市
      _this.homeShop()
      // 集市店铺
      _this.getRecommendData()
      // 会员状态
      _this.getDetail()
    },
    onLoad () {
    },
    onUnload () {
      let _this = this
      _this.imgUrls = []
      _this.iconArr = []
      _this.bigLan = []
      _this.marketArr = []
      _this.marketData = []
      _this.goodId = ''
      _this.selectMenu = '0'
      _this.jiShopData = []
    },
    onShareAppMessage () {
      // let _this = this
      // let openid = wx.getStorageSync('userInfo').passport_name
      // llog({ action_from: '鉴定报告页', action_to: '外部', action_type: '转发朋友', action_status: 1, action_p1: vm.id })
      return {
        title: '一鉴Club',
        // imageUrl: store.imgUrl + vm.detail.images[0].img_url,
        path: `pages/homePage/main`
      }
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
  }
</style>
<style lang="scss" scoped>
  .home-container {
    height: 100%;
    padding-bottom: 120rpx;
    .home-swiper-kj {
      height: 350rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .home-search-kj {
      padding: 28rpx 30rpx;
      box-sizing: border-box;
      background-color: #ffffff;
      .home-search-input {
        display: flex;
        align-items: center;
        width: 100%;
        height: 80rpx;
        background: rgba(245, 245, 249, 1);
        border-radius: 40rpx;
        font-size: 26rpx;
        color: #888888;
        padding-left: 35rpx;
        box-sizing: border-box;
      }
    }
    .home-adsense-kj {
      height: 169rpx;
      padding: 0 30rpx;
      background-color: #ffffff;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .home-class-kj {
      display: flex;
      align-items: center;
      flex-direction: row;
      flex-wrap: wrap;
      padding: 30rpx;
      box-sizing: border-box;
      background-color: #ffffff;
      .home-class-item {
        width: 25%;
        height: 150rpx;
        display: flex;
        align-items: center;
        flex-direction: column;
        .home-class-img {
          width: 80rpx;
          height: 80rpx;
        }
        .home-class-name {
          color: #888888;
          padding-top: 10rpx;
          font-size:24rpx;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(136,136,136,1);
        }
      }
    }
    .home-model-kj {
      display: flex;
      box-sizing: border-box;
      /*padding: 25rpx;*/
      background-color: #F5F5F9;
      flex-wrap: wrap;
      flex-direction: row;
      .home-model-item {
        width: 50%;
        height: 239rpx;
        border-radius: 5rpx;
        box-sizing: border-box;
        padding: 28rpx 20rpx;
        img {
          width: 100%;
          height: 100%
        }
      }
    }
    .home-market-kj {
      padding: 30rpx;
      box-sizing: border-box;
      background-color: #ffffff;
      .home-market-title {
        width: 100%;
        color: #000000;
        font-size: 34rpx;
        text-align: center;
        padding: 20rpx 0 30rpx 0;
      }
      ::-webkit-scrollbar {
        width: 0;
        height: 0;
        color: transparent;
      }
      .home-market-roll {
        width: 100%;
        height: 70rpx;
        box-sizing: border-box;
        display: flex;
        white-space: nowrap;
        .home-market-list {
          color:#888888;
          font-size: 26rpx;
          margin-right: 40rpx;
          height: 100%;
          display: inline-block;
          position: relative;
          font-weight:400;
          font-family:PingFangSC-Regular;
        }
        .menu-select:after{
          content: "";
          position: absolute;
          bottom: 15rpx;
          width: 80%;
          height: 8rpx;
          left: 50%;
          box-sizing: border-box;
          transform: translate(-50%);
          background: linear-gradient(90deg, rgba(241, 208, 165, 1), rgba(213, 171, 121, 1));
          border-radius: 4rpx;
        }
        .m-s{
          color:#000000;
        }
      }
      .home-market-product{
        .home-market-list-d{
          width: 100%;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          .home-no-bady{
            width: 100%;
            font-weight: 400;
            color: #888888;
            font-size: 26rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 80rpx;
          }
          .home-product-list{
            width: 50%;
            margin-top: 20rpx;
            box-sizing: border-box;
            .home-product-img{
              width: 100%;
              height:270rpx;
              border:2rpx solid gainsboro;
              border-bottom: none;
              box-sizing: border-box;
              img{width: 100%;height: 100%;display: block}
            }
            .home-product-name{
              height:72rpx;
              line-height: 72rpx;
              padding: 0 10rpx;
              font-size: 28rpx;
              color:#000000;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              border:1rpx solid rgba(220,220,220,1);
              /*border-top:0;*/
              background:rgba(255,255,255,1);
              box-sizing: border-box;
            }
          }
          .home-product-list:nth-child(2n+1){
            padding-right: 12rpx;
          }
          .home-product-list:nth-child(2n){
            padding-left: 12rpx;
          }
        }
        .home-product-more{
          width: 100%;
          height: 100%;
          margin-top: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          div{
            display: flex;
            width: 150rpx;
            border:1rpx solid rgba(191,191,191,1);
            border-radius: 22rpx;
            color: #888888;
            font-size: 28rpx;
            align-items: center;
            justify-content: center;
            font-weight: 300;
            font-family: PingFangSC-Light;
          }
        }
      }
    }
    .home-shop-kj{
      padding: 30rpx;
      box-sizing: border-box;
      background-color: #ffffff;
      margin-top: 20rpx;
      margin-bottom: 20rpx;
      .home-shop-title {
        width: 100%;
        color: #000000;
        font-size: 34rpx;
        text-align: center;
        padding: 20rpx 0 0 0;
      }
      .home-shop-item{
        display: flex;
        flex-direction: column;
        .home-product-more{
          width: 100%;
          height: 100%;
          margin-top: 30rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          div{
            display: flex;
            width: 150rpx;
            border: 1rpx solid rgba(191,191,191,1);
            border-radius: 22rpx;
            color: #888888;
            font-size: 28rpx;
            align-items: center;
            justify-content: center;
            font-weight: 300;
            font-family: PingFangSC-Light;
          }
        }
        .home-shop-list{
          padding: 30rpx 30rpx 30rpx 185rpx;
          width: 100%;
          height: 245rpx;
          box-sizing: border-box;
          position: relative;
          .home-shop-imgs{
            width:166rpx;
            height:166rpx;
            position: absolute;
            top: 30rpx;
            left: 0;
          }
          .home-shop-right{
            height: 100rpx;
            margin-top:-6rpx;
            .home-shop-name{
              font-size: 30rpx;
              color:#000000;
              text-align: left;
              height: 40rpx;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
            }
            .home-shop-desc{
              padding-top: 10rpx;
              color:#888888;
              font-size: 28rpx;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              line-height:40rpx;
            }
          }
        }
      }
    }
  }
</style>
