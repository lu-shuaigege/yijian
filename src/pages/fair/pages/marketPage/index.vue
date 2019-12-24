<template>
  <div class="js-container">
    <div class="js-top-fixed" id="header">
      <!--搜索条start-->
      <div class="js-search-n">
        <van-search :value="value" :placeholder="placeVal"   @click="onSearch"  use-action-slot class="js-search-input" :readonly="true">
          <view slot="action" class="js-search-btns">搜索</view>
        </van-search>
      </div>
      <!--搜索条end-->
      <!--集市切换start-->
      <div class="js-menu-select">
        <div class="js-select-menu" :class="menuSlect == index?'js-select':''" v-for="(item,index) in menuArr" :key="index" @click="menuChange(index)">{{item.name}}</div>
      </div>
    </div>
     <view v-show="menuSlect === '0'">
       <div class="js-class-kj-a"  :style="{height:heightContent + 'px',marginTop:headerH + 'px'}">
         <div class="js-class-left">
           <div class="js-class-left-list" :class="leftSelect =='-1'?'js-left-select js-bg':''" @click="allBady('-1')">推荐好物</div>
           <div class="js-class-left-list" :class="leftSelect ==indexs?'js-left-select js-bg':''" v-for="(items,indexs) in menuLeft" :key="indexs" @click="leftChange(items.id,indexs)">{{items.name}}</div>
         </div>
         <div class="js-class-right" :style="{height:heightContent + 'px'}">
           <div class="js-class-right-fl">
             <div class="js-class-fl-item" :class="badysort ==='1'?'js-select-bot':''" @click="sortSelect('1')">热度</div>
             <div class="js-class-fl-item" :class="badysort ==='2'?'js-select-bot':''" @click="sortSelect('2')">新品</div>
             <div class="js-class-fl-item" :class="badysort ==='0'?'js-select-bot':''" @click="sortSelect('0')">默认</div>
           </div>
           <div class="js-class-product-data" :style="{height:rightHeight + 'px'}">
             <scroll-view style="height:100%"  :scroll-y="true" @scrolltolower="scrolltolower">
               <div class="js-class-overflow">
                 <div class="js-class-data-list" v-for="(item,index) in leftGoodData" :key="index"  @click="badyEdit(item.id)" :style="index%2==1?'display:none':''">
                   <div class="js-item_content"   v-if="index%2==0">
                     <img :src="item.img_url" mode='widthFix'  class="js-class-data-img"/>
                     <div class="js-class-data-name">{{item.name}}</div>
                   </div>
                 </div>
                 <div class="js-class-data-list" v-for="(item,index) in leftGoodData" :key="index"  @click="badyEdit(item.id)" :style="index%2==0?'display:none':''">
                   <div class="js-item_content" v-if="index%2==1">
                     <img :src="item.img_url" mode='widthFix'  class="js-class-data-img"/>
                     <div class="js-class-data-name">{{item.name}}</div>
                   </div>
                 </div>
                 <div style="position:absolute;bottom:0;left:0;width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center" v-if="badyLoading">
                   <van-loading type="spinner" size="18px" />加载中
                 </div>
                 <div class="js-class-bottom-solid" v-if="badynomore">
                   <van-divider contentPosition="center">这是我的底线</van-divider>
                 </div>
               </div>
             </scroll-view>
             <!--无相关内容start -->
             <div class="dian-que-kj" v-if="noBadyDataStatus">
               <img src="../../../../assets/images/wuneirong.png"/>
               <div class="dian-que-desc">无相关内容</div>
             </div>
             <!--无相关内容end-->
           </div>
         </div>
       </div>
     </view>
    <view  v-show="menuSlect === '1'">
      <div class="js-class-kj-b">
        <div class="js-class-b-change">
          <div class="js-class-b-w" :class="sortVal ==='1'?'js-class-select':''" @click="sortChange('1')">关注度</div>
          <div class="js-class-b-w" :class="sortVal ==='0'?'js-class-select':''" @click="sortChange('0')">默认</div>
        </div>
        <div class="js-class-list" v-for="(item,index) in jiListData" :key="index">
          <div class="xq-r-kj">
            <img v-if="item.icon" :src="item.icon"  class="xq-r-tou"  @click="shopEdit(item.id)"/>
            <img v-if="!item.icon" :src="icon"  class="xq-r-tou"  @click="shopEdit(item.id)"/>
            <div class="xq-r-address"  @click="shopEdit(item.id)">{{item.name}}</div>
            <div class="xq-like-icon">
              <div class="cq-like-div">
                <button v-if="state != 1"  @click="setShopLik(index)">
                  <img src="../../../../assets/images/zan_a_icon.png" class="xq-like-xh" v-if="item.is_favorite==0" />
                  <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh" v-if="item.is_favorite==1" />
                </button>
                <button v-if="state == 1" open-type="getUserInfo" @getuserinfo="bindGetUserInfo" >
                  <img src="../../../../assets/images/zan_a_icon.png" class="xq-like-xh" v-if="item.is_favorite==0" />
                  <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh" v-if="item.is_favorite==1" />
                </button>
                <div class="xq-like-num">{{item.follow_num}}</div>
              </div>
            </div>
          </div>
          <div class="xq-r-content"  @click="shopEdit(item.id)">
            <div class="xq-recomm-item">
              <div class="xq-recomm-list" v-for="(items,indexs) in item.hot_goods" :key="indexs">
                <img :src="items.img_url"/>
                <div class="xq-recomm-name">{{items.name}}</div>
              </div>
            </div>
          </div>
        </div>
        <!--无相关内容start -->
        <div class="dian-que-kj" v-if="noShopDataStatus">
          <img src="../../../../assets/images/wuneirong.png"/>
          <div class="dian-que-desc">无相关内容</div>
        </div>
        <!--无相关内容end-->

        <div style="width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center"  v-if="dpIsLoading">
          <van-loading type="spinner" size="18px" />加载中
        </div>
        <div style="padding: 0 30rpx;" v-if="nomore">
          <van-divider contentPosition="center">这是我的底线</van-divider>
        </div>
      </div>
    </view>
     <!--集市切换end-->
    <!--底部start-->
    <CardFooter v-bind:changeVallist='1' @footerHeight="footerHeight"></CardFooter>
    <!--底部end-->
  </div>
</template>
<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  import CardFooter from '../../../footer/index'
  import store from '../../../../utils/store'
  import global from '../../../../utils/global'
  export default {
    data () {
      return {
        isNewOpen: true,
        icon: '/static/images/defaultphoto.jpeg',
        noBadyDataStatus: false,
        noShopDataStatus: false,
        placeVal: '请输入宝贝名称或者ID',
        menuSlect: '0',
        menuArr: [
          {name: '集市宝贝'},
          {name: '集市店铺'}
        ],
        leftGoodData: [],
        leftSelect: '-1',
        jishiGoodId: '',
        menuLeft: [],
        // 关注度-默认
        sortVal: '0',
        // 集市宝贝分页
        badyPage: 1,
        badyPerPage: 10,
        // 加载中
        badyLoading: false,
        // 这是我的底线
        badynomore: false,
        // 集市排序
        badysort: '0',
        // 集市店铺分页
        jiPage: 1,
        jiPer_page: 3,
        // 集市店铺列表数据
        jiListData: [],
        // 加载中
        dpIsLoading: false,
        // 这是我的底线
        nomore: false,
        // 页面高度
        footerH: 0,
        headerH: 0,
        heightContent: 0,
        rightHeight: 0,
        shopLikIndex: 0,
        store: store
      }
    },
    components: {CardFooter},
    methods: {
      setShopLik (index) {
        this.shopLikIndex = index
        let data = this.jiListData[this.shopLikIndex]
        this.getShopLike((data.is_favorite === 0) ? '1' : '2', data.id, this.shopLikIndex)
      },
      bindGetUserInfo (e) {
        if (e.mp.detail.userInfo) {
          wxService.request({
            url: api.login.getWxUserInfo,
            method: 'get',
            data: {
              token: wx.getStorageSync('token'),
              iv: e.mp.detail.iv,
              encryptedData: e.mp.detail.encryptedData
            },
            success: function (res) {
              if (res.code === 0) {
                store.state = 2
                global.findUserQuery()
              }
            }
          })
        }
      },
      // 获取底部高度
      footerHeight (val) {
        let _this = this
        _this.footerH = val
        let query = wx.createSelectorQuery()
        query.select('#header').boundingClientRect()
        query.exec(function (res) {
          _this.headerH = res[0].height
          _this.heightContent = wx.getSystemInfoSync().windowHeight - (_this.footerH + _this.headerH)
          _this.rightHeight = _this.heightContent - 60
        })
      },
      // 搜索
      onSearch () {
        wx.navigateTo({
          url: '/pages/fair/pages/searchPage/main?menuSlect=' + this.menuSlect
        })
      },
      // 集市宝贝-查看详情
      badyEdit (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/marketDetailsPage/main?id=' + id
        })
      },
      // 集市宝贝-右侧下滑刷新
      scrolltolower () {
        let _this = this
        if (!_this.badynomore) {
          _this.badyPage++
          _this.badyLoading = true
          _this.getMarketData('more')
        }
      },
      // 热度-新品-默认
      sortSelect (val) {
        let _this = this
        _this.badysort = val
        _this.badyPage = 1
        _this.badynomore = false
        _this.getMarketData()
      },
      // 菜单切换
      menuChange (index) {
        let _this = this
        _this.menuSlect = index.toString()
        _this.isNewOpen = true
        _this.noBadyDataStatus = false
        _this.noShopDataStatus = false
        if (index === 1 || index === '1') {
          _this.placeVal = '请输入店铺名称或者ID'
        } else if (index === 0 || index === '0') {
          _this.placeVal = '请输入宝贝名称或者ID'
        }
      },
      // 推荐好物
      allBady (val) {
        let _this = this
        _this.leftSelect = val
        _this.noBadyDataStatus = false
        _this.badyPage = 1
        _this.badynomore = false
        _this.jishiGoodId = ''
        _this.getMarketData()
      },
      // 左侧菜单切换
      leftChange (id, index) {
        let _this = this
        _this.leftSelect = index
        _this.noBadyDataStatus = false
        _this.badyPage = 1
        _this.badynomore = false
        _this.jishiGoodId = id
        _this.getMarketData()
      },
      // 关注度-默认切换
      sortChange (val) {
        let _this = this
        _this.sortVal = val
        _this.jiPage = 1
        _this.noBadyDataStatus = false
        _this.getShopList()
      },
      // 查看店铺详情
      shopEdit (id) {
        this.isNewOpen = false
        wx.navigateTo({
          url: '/pages/fair/pages/dianpuDetailPage/main?id=' + id
        })
      },
      // 集市宝贝类别
      getGoodType () {
        let _this = this
        wxService.request({
          url: api.twoapi.goodCategory,
          method: 'get',
          data: {},
          success: function (res) {
            if (res.code === 0) {
              _this.menuLeft = res.data.category
              _this.getMarketData()
              // if (_this.menuSlect === '0' || _this.menuSlect === 0) {
              //   _this.getMarketData()
              // } else if (_this.menuSlect === '1' || _this.menuSlect === 1) {
              //   _this.getShopList()
              // }
            }
          }
        })
      },
      // 获取集市数据
      getMarketData (item) {
        let _this = this
        wxService.request({
          url: api.twoapi.goodsList,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'sort': _this.badysort,
            'category_id': _this.jishiGoodId,
            'page': _this.badyPage,
            'per_page': _this.badyPerPage
          },
          success: function (res) {
            if (res.code === 0) {
              if (res.data.list.length > 0) {
                if (item === 'more') {
                  _this.leftGoodData = _this.leftGoodData.concat(res.data.list)
                } else {
                  if (_this.leftSelect === '-1') {
                    _this.leftGoodData = []
                  }
                  _this.leftGoodData = res.data.list
                }
                if (_this.leftGoodData.length >= Number(res.data.paginate.total)) {
                  _this.badynomore = true
                }
                _this.badyLoading = false
              } else {
                _this.badynomore = false
                if (item !== 'more') {
                  _this.leftGoodData = []
                  _this.noBadyDataStatus = true
                }
              }
            }
          }
        })
      },
      // 集市店铺列表
      getShopList (item) {
        let _this = this
        wxService.request({
          url: api.twoapi.marketShop,
          method: 'get',
          data: {
            'sort': _this.sortVal,
            'page': _this.jiPage,
            'per_page': _this.jiPer_page,
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.code === 0) {
              if (res.data.list.length > 0) {
                if (item === 'more') {
                  _this.jiListData = _this.jiListData.concat(res.data.list)
                } else {
                  _this.jiListData = res.data.list
                }
                if (_this.jiListData.length >= Number(res.data.paginate.total)) {
                  _this.nomore = true
                }
                _this.dpIsLoading = false
              } else {
                _this.nomore = false
                if (item !== 'more') {
                  _this.jiListData = []
                  _this.noShopDataStatus = true
                }
              }
            }
          }
        })
      },
      // 集市店铺关注
      getShopLike (val, id, index) {
        let _this = this
        wxService.request({
          url: api.twoapi.shopBadyLike,
          method: 'post',
          data: {
            'token': wx.getStorageSync('token'),
            'type': '1',
            'act': val,
            'type_id': id
          },
          success: function (res) {
            if (res.code === 0) {
              if (_this.jiListData[index].is_favorite === 0) {
                _this.jiListData[index].is_favorite = 1
                if (_this.jiListData[index].follow_num < 0) {
                  return false
                }
                _this.jiListData[index].follow_num += 1
              } else if (_this.jiListData[index].is_favorite === 1) {
                _this.jiListData[index].is_favorite = 0
                if (_this.jiListData[index].follow_num === 0) {
                  return false
                }
                _this.jiListData[index].follow_num -= 1
              }
            }
          }
        })
      },
      // 集市店铺加载更多
      shopLoadMore () {
        let _this = this
        if (!_this.nomore) {
          _this.jiPage++
          _this.dpIsLoading = true
          setTimeout(function () {
            _this.getShopList('more')
          }, 100)
        }
      }
    },
    onShow () {
      let _this = this
      wx.hideHomeButton()
      if (!_this.isNewOpen) {
        _this.jiPage = 1
        _this.getShopList()
      }
    },
    onReachBottom () { // 到底部加载更多
      let _this = this
      if (_this.menuSlect === '1' || _this.menuSlect === 1) {
        _this.shopLoadMore()
      }
    },
    onUnload () {
      this.noBadyDataStatus = false
      this.noShopDataStatus = false
      this.leftGoodData = []
      this.menuSlect = '0'
      this.leftSelect = '-1'
      this.jishiGoodId = ''
      this.menuLeft = []
      this.sortVal = '0'
      this.badyPage = 1
      this.badyPerPage = 10
      this.badysort = '0'
      this.jiPage = 1
      this.jiPer_page = 10
      this.badyPage = 1
      this.badyPerPage = 10
      this.badyLoading = false
      this.badynomore = false
      this.badysort = '0'
      this.jiListData = []
      this.dpIsLoading = false
      this.nomore = false
      this.isNewOpen = true
      this.placeVal = '请输入宝贝名称或者ID'
    },
    onLoad (option) {
      let _this = this
      // 集市宝贝类别
      if (option.menuselect !== undefined && option.menuselect !== '') {
        _this.menuSlect = option.menuselect.toString()
      }
      // 首页模块过来
      let Id = option.id
      if (Id !== undefined) {
        if (option.id.toString() === '1') {
          _this.menuSlect = '0'
        } else if (option.id.toString() === '0') {
          _this.menuSlect = '1'
        }
      }
      _this.getGoodType()
      _this.getShopList()
    },
    onShareAppMessage () {
      let _this = this
      return {
        title: '集市',
        path: `pages/fair/pages/marketDetailsPage/main?menuselect=${_this.menuSlect}`
      }
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
    padding-bottom: 110rpx;
  }
  .js-search-input .van-search{
    padding-right: 8px;
    background-color: #F5F5F9 !important;
  }
  .js-search-input .van-search__content{
    background-color: #ffffff;
  }
  .js-search-input .js-search-btns{
    font-size: 30rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(0,0,0,1);
  }
  .js-class-bottom-solid .van-divider{
    margin: 0;
  }
</style>
<style lang="scss" scoped>
.js-container{
  .js-top-fixed{
    position: fixed;
    top:0;
    left: 0;
    width: 100%;
    z-index: 10;
      background-color: #ffffff;
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
        position: relative;
        font-family:PingFang SC;
        font-weight:500;
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
  }
  .js-search-n{
    /*height: 100rpx;*/
    width: 100%;
  }
  .js-class-kj-a{
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    min-height: 200rpx;
    /*margin-top: 187rpx;*/
    /*position: fixed;*/
    /*top: 193rpx;*/
    /*bottom: 110rpx;*/
    .js-class-left{
      width: 200rpx;
      overflow-y: auto;
      height: 100%;
      .js-class-left-list{
        font-size: 28rpx;
        color:rgba(26,26,26,1);
        height:100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background:rgba(245,245,249,1);
        position: relative;
        font-family:PingFang SC;
        font-weight:400;
      }
      .js-left-select:after{
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 8rpx;
        height: 100%;
        background:linear-gradient(180deg,rgba(241,208,165,1),rgba(213,171,121,1));
      }
      .js-bg{
        background-color: #ffffff;
        font-family:PingFang SC;
        font-weight:500;
        color:rgba(26,26,26,1);
      }
    }
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
    .js-class-right{
      width: 550rpx;
      padding: 0 20rpx;
      height: 100%;
      box-sizing: border-box;
      background-color: #ffffff;
      position: relative;
      .js-class-right-fl{
        padding-left: 50%;
        width: 100%;
        height: 100rpx;
        display: flex;
        align-items: center;
        flex-direction: row;
        box-sizing: border-box;
        position: relative;
        .js-class-fl-item{
          width: 33.3%;
          height: 5vh;
          line-height: 5vh;
          color: #1A1A1A;
          font-size: 28rpx;
          margin: 20rpx 0;
          font-family:PingFang SC;
          font-weight:400;
          color:rgba(26,26,26,1);
          position: relative;
        }
        .js-select-bot:after{
          content: "";
          position: absolute;
          bottom: -3rpx;
          width: 45rpx;
          height: 8rpx;
          left: 35%;
          box-sizing: border-box;
          transform: translate(-50%);
          background: linear-gradient(90deg, #f1d0a5, #d5ab79);
          border-radius: 4rpx;
        }
      }
      .js-class-product-data{
        width: 100%;
        height: 100%;
        .js-class-overflow{
          position: relative;
          column-count:2;
          column-gap: 20rpx;
          padding-bottom:50rpx;
          width: 100%;
          .js-class-bottom-solid{
            position:absolute;
            left:0;
            bottom:0;
            width: 100%;box-sizing: border-box;
          }
        .js-class-data-list{
          display: inline-block;
          justify-content: center;
          flex-direction: column;
          align-items: center;
          -moz-page-break-inside: avoid;
          -webkit-column-break-inside: avoid;
          break-inside: avoid;
          box-sizing: border-box;
          margin-top: 10rpx;
          width: 100%;
          padding:2rpx;
          .js-item_content{
            border:2rpx solid rgba(220,220,220,1);
            .js-class-data-img{
              width: 100%;
              display: block;
            }
            .js-class-data-name{
              text-align: left;
              color:rgba(0,0,0,1);
              font-size:24rpx;
              box-sizing: border-box;
              padding: 14rpx 12rpx;
              font-family:PingFang SC;
              border-top:1rpx solid rgba(220,220,220,1);
              width: 100%;
            }
          }
        }
      }
      .dian-que-kj{
        width:200rpx;
        position: fixed;
        top:50%;
        left:63%;
        transform: translate(-50%,-50%);
        background-color: #fff;
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
    ::-webkit-scrollbar {
      width: 0;
      height: 0;
      color: transparent;
    }
  }
}
.js-class-kj-b{
  margin-top: 193rpx;
  .js-class-b-change{
    display: flex;
    align-items: center;
    padding: 10rpx 30rpx 10rpx 70%;
    .js-class-b-w{
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 60rpx;
      color:#1A1A1A;
      font-size: 28rpx;
      position: relative;
    }
    .js-class-select:after{
      content: "";
      position: absolute;
      bottom: -3rpx;
      width: 45rpx;
      height: 8rpx;
      right: 50%;
      box-sizing: border-box;
      transform: translate(50%);
      background: linear-gradient(90deg, #f1d0a5, #d5ab79);
      border-radius: 4rpx;
    }
  }
  .js-class-list{
    padding: 30rpx;
    background-color: #ffffff;
    margin-bottom: 30rpx;
    .xq-r-kj{
      box-sizing: border-box;
      width:100%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      .xq-r-tou{
        position: absolute;
        left: 0;
        top: 0;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
      }
      .xq-r-address{
        width: 80%;
        color: #000000;
        font-size: 30rpx;
        height: 100rpx;
        line-height: 100rpx;
        margin-left: 125rpx;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-family: PingFangSC-Medium;
      }
      .xq-like-icon{
        width: 20%;
        height: 100rpx;
        display: flex;
        align-items: flex-end;
        justify-content: flex-end;
        flex-direction: column;
        flex-wrap: wrap;
        position: relative;
        .cq-like-div{
          position: absolute;
          top: 10rpx;
          button{
            border: none;
            outline-style: none;
            background-color: #fff;
            outline:none;
            display: flex;
            padding: 0;
            border-radius: 0;
          }
          button::after {
            border: none;
          }
          .xq-like-num{
            text-align: center;
            font-size: 20rpx;
            color:#000000;
          }
          .xq-like-xh{
            width: 44rpx;
            height: 42rpx;
          }
        }
      }
    }
    .xq-r-content{
      .xq-recomm-item{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        margin-top: 30rpx;
        .xq-recomm-list{
          width: 32%;
          display: flex;
          flex-direction: column;
          margin-right: 1%;
          border:2rpx solid gainsboro;
          img{
            width: 100%;
            height: 163rpx;
          }
          .xq-recomm-name{
            font-size: 24rpx;
            color:#000000;
            text-align: left;
            border-top:1rpx solid #DCDCDC;
            padding: 10rpx;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            box-sizing: border-box;
            width: 100%;
          }
        }
        .xq-recomm-list:nth-last-child(1){
          margin-right: 0;
        }
      }
    }
  }
  .dian-que-kj{
    width:200rpx;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    background-color: #f5f5f9;
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
}
</style>
