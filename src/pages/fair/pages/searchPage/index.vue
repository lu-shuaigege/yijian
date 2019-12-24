<template>
  <div class="search-container">
    <div class="search-top-fixed">
      <div class="search-title">
        <van-search :value="keywords" :placeholder="placeVal"  @search="search" @change="changeValue" use-action-slot class="search-input">
          <view slot="action" @click="searchClick" class="js-search-btns">搜索</view>
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
    </div>
    <div class="search-content-kj">
      <!--集市店铺start-->
      <div class="js-class-kj-a" v-if="selectMenu =='0'">
        <div class="js-class-overflow" v-if="leftGoodData.length>0">
          <div class="js-class-data-list" v-for="(item,index) in leftGoodData" :key="index"  @click="badyEdit(item.id)">
            <div class="js-item_content">
              <div>
                <img :src="item.img_url" mode='widthFix' class="js-class-data-img"/>
              </div>
              <div class="js-class-data-name">{{item.name}}</div>
            </div>
          </div>
          <div style="position:absolute;bottom:0;left:0;width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center" v-if="badyLoading">
            <van-loading type="spinner" size="18px" />加载中
          </div>
          <div style="position:absolute;bottom:0;left:0;width: 100%;padding: 0 30rpx;box-sizing: border-box;" v-if="badynomore">
            <van-divider contentPosition="center">这是我的底线</van-divider>
          </div>
        </div>
        <!--搜索历史start-->
        <div class="search-history" v-if="!keywords">
          <div class="search-history-row">
            <div class="search-h-l search-h-l-a">搜索历史</div>
            <div class="search-h-l search-h-l-b" @click="clearHis('0')">清空历史</div>
          </div>
          <div class="search-his-content">
            <div class="search-his-nr" v-for="(item,index) in badySearchHis" :key="index" @click="searchHil(item.name)">{{item.name}}</div>
          </div>
        </div>
        <!--搜索历史end-->
        <!--无相关内容start-->
        <div class="dian-que-kj" v-if="noBadyDataStatus">
          <img src="../../../../assets/images/wuneirong.png"/>
          <div class="dian-que-desc">无相关内容</div>
        </div>
        <!--无相关内容end-->
      </div>
      <div class="js-class-kj-b" v-if="selectMenu =='1'">
        <div class="js-class-b-change" v-if="">
          <div class="js-class-b-w" @click="changeSatus('1')">关注度</div>
          <div class="js-class-b-w" @click="changeSatus('0')">默认</div>
        </div>
        <div class="js-class-list" v-for="(item,index) in shopData" :key="index" @click="lookShopEdit(item.id)">
          <div class="xq-r-kj">
            <img :src="item.icon"  class="xq-r-tou"/>
            <div class="xq-r-address">{{item.name}}</div>
            <div class="xq-like-icon">
              <div class="cq-like-div">
                <img src="../../../../assets/images/zan_a_icon.png" class="xq-like-xh" v-if="item.is_favorite ==0" @click.stop="getShopLike('1',item.id,index)"/>
                <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh" v-if="item.is_favorite ==1" @click.stop="getShopLike('2',item.id,index)"/>
                <div class="xq-like-num">{{item.follow_num}}</div>
              </div>
            </div>
          </div>
          <div class="xq-r-content">
            <div class="xq-recomm-item">
              <div class="xq-recomm-list" v-for="(items,indexs) in item.hot_goods" :key="indexs">
                <img :src="items.img_url"/>
                <div class="xq-recomm-name">{{items.name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div style="position:absolute;bottom:0;left:0;width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center" v-if="jsLoading">
          <van-loading type="spinner" size="18px" />加载中
        </div>
        <div style="position:absolute;bottom:0;left:0;width: 100%;padding: 0 30rpx;box-sizing: border-box;" v-if="jsnomore">
          <van-divider contentPosition="center">这是我的底线</van-divider>
        </div>
        <!--搜索历史start-->
        <div class="search-history" v-if="!keywords">
          <div class="search-history-row">
            <div class="search-h-l search-h-l-a">搜索历史</div>
            <div class="search-h-l search-h-l-b" @click="clearHis('1')">清空历史</div>
          </div>
          <div class="search-his-content">
            <div class="search-his-nr" v-for="(item,index) in shopSearchHis" :key="index" @click="searchHil(item.name)">{{item.name}}</div>
          </div>
        </div>
        <!--搜索历史end-->
        <!--无相关内容start-->
        <div class="dian-que-kj" v-if="noShopDataStatus">
          <img src="../../../../assets/images/wuneirong.png"/>
          <div class="dian-que-desc">无相关内容</div>
        </div>
        <!--无相关内容end-->
      </div>
      <!--集市店铺end-->
      <!--开眼start-->
      <div class="search-item-c" v-if="selectMenu =='2'">
        <div class="search-item-c-list" v-for="(item,index) in openEyesData" :key="index">
          <div class="search-item-c-img">
            <img src="../../../../assets/images/banner-m.png"/>
          </div>
          <div class="search-title-kj">
            <div class="search-title-left">西汉出土“嵌贝鹿形青铜镇”，1957年河南陕县后川出土，镇放置在席子的</div>
            <div class="search-title-right">
              <p>
                <span class="search-fh">¥</span>
                <span>300</span>
              </p>
            </div>
          </div>
          <div class="search-desc">2019.6.27 17:00 苏州市广电总台</div>
        </div>
        <!--搜索历史start-->
        <div class="search-history" v-if="!keywords">
          <div class="search-history-row">
            <div class="search-h-l search-h-l-a">搜索历史</div>
            <div class="search-h-l search-h-l-b" @click="clearHis('2')">清空历史</div>
          </div>
          <div class="search-his-content">
            <div class="search-his-nr" v-for="(item,index) in eyesSearchHis" :key="index">{{item.name}}</div>
          </div>
        </div>
        <!--搜索历史end-->
        <!--无相关内容start-->
        <div class="dian-que-kj" v-if="noKaiyanDataStatus">
          <img src="../../../../assets/images/wuneirong.png"/>
          <div class="dian-que-desc">无相关内容</div>
        </div>
        <!--无相关内容end-->
      </div>
      <!--开眼end-->
    </div>
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
        noBadyDataStatus: false,
        noShopDataStatus: false,
        noKaiyanDataStatus: false,
        placeVal: '请输入宝贝名称或者ID',
        keywords: '',
        // 菜单
        menuArr: [
          {name: '集市宝贝'},
          {name: '集市店铺'},
          {name: '开眼'}
        ],
        selectMenu: '0',
        // 集市宝贝搜索历史
        badySearchHis: [],
        // 集市宝贝数据
        leftGoodData: [],
        // 集市宝贝历史记录状态
        historyShowA: true,
        // 集市宝贝分页
        badyPage: 1,
        badyPerPage: 10,
        badyLoading: false,
        badynomore: false,
        // 集市店铺排序
        shopSort: '0',
        // 集市店铺搜索历史
        shopSearchHis: [],
        // 集市店铺历史记录状态
        historyShowB: true,
        // 集市店铺分页
        jsPage: 1,
        jsPerPage: 10,
        jsLoading: false,
        jsnomore: false,
        shopShow: false,
        // 集市店铺数据
        shopData: [],
        // 开眼数据
        openEyesData: [],
        // 开眼分页
        kyPage: 1,
        kyPerPage: 2,
        kyLoading: false,
        kynomore: false,
        eyesSearchHis: []
      }
    },
    components: {},
    methods: {
      // 搜索调用
      searchHil (val) {
        let _this = this
        _this.keywords = val
        _this.searchClick()
      },
      // 清空历史
      clearHis (val) {
        let _this = this
        switch (val) {
          case '0':
            _this.badySearchHis = []
            wx.removeStorageSync('searchHistoryA')
            break
          case '1':
            _this.shopSearchHis = []
            wx.removeStorageSync('searchHistoryB')
            break
          case '2':
            _this.eyesSearchHis = []
            wx.removeStorageSync('searchHistoryC')
            break
        }
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
              if (val === '1') {
                _this.shopData[index].is_favorite = '1'
                _this.shopData[index].follow_num += 1
              } else if (val === '2') {
                _this.shopData[index].is_favorite = '0'
                _this.shopData[index].follow_num -= 1
              }
            }
          }
        })
      },
      // 集市宝贝详情查看
      badyEdit (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/marketDetailsPage/main?id=' + id
        })
      },
      // 集市店铺详情查看
      lookShopEdit (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/dianpuDetailPage/main?id=' + id
        })
      },
      // 关注度-默认
      changeSatus (val) {
        let _this = this
        _this.shopSort = val
        _this.getShopData()
      },
      // 搜索
      changeValue (event) {
        let _this = this
        _this.keywords = event.mp.detail
        if (_this.keywords === '') {
          _this.noBadyDataStatus = false
          _this.noShopDataStatus = false
          _this.noKaiyanDataStatus = false
          _this.badynomore = false
          _this.jsnomore = false
          _this.leftGoodData = []
          _this.badyPage = 1
          _this.shopData = []
          _this.jsPage = 1
          _this.openEyesData = []
          _this.kyPage = 1
        }
      },
      searchClick () {
        let _this = this
        _this.leftGoodData = []
        _this.badyPage = 1
        _this.badynomore = false
        _this.shopData = []
        _this.jsPage = 1
        _this.jsnomore = false
        _this.openEyesData = []
        _this.kyPage = 1
        _this.kynomore = false
        _this.search()
      },
      search () {
        let _this = this
        let val = _this.selectMenu.toString()
        if (_this.keywords !== '') {
          switch (val) {
            case '0':
              _this.getMarketData()
              for (let i = 0; i < _this.badySearchHis.length; i++) {
                if (_this.keywords === _this.badySearchHis[i]['name']) {
                  return false
                }
              }
              // 搜索历史
              if (_this.badySearchHis.length <= 9) {
                let searchCon = {
                  'name': _this.keywords
                }
                _this.badySearchHis.unshift(searchCon)
                wx.setStorageSync('searchHistoryA', _this.badySearchHis)
              } else {
                _this.badySearchHis.splice(9, 1)
                let searchCon = {
                  'name': _this.keywords
                }
                _this.badySearchHis.unshift(searchCon)
              }
              break
            case '1':
              _this.getShopData()
              for (let i = 0; i < _this.shopSearchHis.length; i++) {
                if (_this.keywords === _this.shopSearchHis[i]['name']) {
                  return false
                }
              }
              // 搜索历史
              if (_this.shopSearchHis.length <= 9) {
                let searchCon = {
                  'name': _this.keywords
                }
                _this.shopSearchHis.unshift(searchCon)
                wx.setStorageSync('searchHistoryB', _this.shopSearchHis)
              } else {
                _this.shopSearchHis.splice(9, 1)
                let searchCon = {
                  'name': _this.keywords
                }
                _this.shopSearchHis.unshift(searchCon)
              }
              break
            case '2':
              _this.getOpenData()
              for (let i = 0; i < _this.eyesSearchHis.length; i++) {
                if (_this.keywords === _this.eyesSearchHis[i]['name']) {
                  return false
                }
              }
              // 搜索历史
              if (_this.eyesSearchHis.length <= 9) {
                let searchCon = {
                  'name': _this.keywords
                }
                _this.eyesSearchHis.unshift(searchCon)
                wx.setStorageSync('searchHistoryC', _this.eyesSearchHis)
              } else {
                _this.eyesSearchHis.splice(9, 1)
                let searchCon = {
                  'name': _this.keywords
                }
                _this.eyesSearchHis.unshift(searchCon)
              }
              break
          }
        } else {
          // 判断切换的时候搜索条是否是空修改为搜索历史
          switch (_this.selectMenu) {
            case '0':
              _this.historyShowA = true
              _this.leftGoodData = []
              break
            case '1':
              _this.historyShowB = true
              _this.shopData = []
              _this.jsnomore = false
              break
            case '2':
              _this.openEyesData = []
              break
          }
        }
      },
      // 菜单切换
      menuChange (index) {
        let _this = this
        _this.selectMenu = index.toString()
        switch (_this.selectMenu) {
          case '0':
            _this.placeVal = '请输入宝贝名称或者ID'
            break
          case '1':
            _this.placeVal = '请输入店铺名称或者ID'
            break
          case '2':
            _this.placeVal = '请输入开眼名称'
            break
        }
        wx.pageScrollTo({
          scrollTop: 0
        })
        _this.search()
      },
      // 获取集市宝贝数据
      getMarketData (item) {
        let _this = this
        if (item !== 'more' && _this.leftGoodData.length !== 0) {
          return false
        }
        wxService.request({
          url: api.twoapi.goodsList,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'keywords': _this.keywords,
            'page': _this.badyPage,
            'per_page': _this.badyPerPage
          },
          success: function (res) {
            if (res.code === 0) {
              if (res.data.list.length > 0) {
                if (item === 'more') {
                  _this.leftGoodData = _this.leftGoodData.concat(res.data.list)
                } else {
                  _this.leftGoodData = res.data.list
                }
                if (_this.leftGoodData.length >= Number(res.data.paginate.total)) {
                  _this.badynomore = true
                }
                _this.badyLoading = false
                _this.noBadyDataStatus = false
              } else {
                _this.badynomore = false
                _this.noBadyDataStatus = true
              }
            }
          }
        })
      },
      // 获取集市店铺
      getShopData (item) {
        let _this = this
        if (item !== 'more' && _this.shopData.length !== 0) {
          return false
        }
        wxService.request({
          url: api.twoapi.marketShop,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'keywords': _this.keywords,
            'sort': _this.shopSort,
            'page': _this.jsPage,
            'per_page': _this.jsPerPage
          },
          success: function (res) {
            if (res.code === 0) {
              if (res.data.list.length > 0) {
                if (item === 'more') {
                  _this.shopData = _this.shopData.concat(res.data.list)
                } else {
                  _this.shopData = res.data.list
                }
                if (_this.shopData.length >= Number(res.data.paginate.total)) {
                  _this.jsnomore = true
                }
                _this.jsLoading = false
                _this.noShopDataStatus = false
              } else {
                _this.jsnomore = false
                _this.noShopDataStatus = true
              }
            }
          }
        })
      },
      // 获取开眼
      getOpenData (item) {
        let _this = this
        if (item !== 'more' && _this.openEyesData.length !== 0) {
          return false
        }
        wxService.request({
          url: api.twoapi.marketShop,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'keywords': _this.keywords,
            'sort': _this.shopSort,
            'page': _this.kyPage,
            'per_page': _this.kyPerPage
          },
          success: function (res) {
            if (res.code === 0) {
              if (res.data.list.length > 0) {
                if (item === 'more') {
                  _this.openEyesData = _this.openEyesData.concat(res.data.list)
                } else {
                  _this.openEyesData = res.data.list
                }
                if (_this.openEyesData.length >= Number(res.data.paginate.total)) {
                  _this.kynomore = true
                }
                _this.kyLoading = false
                _this.noKaiyanDataStatus = false
              } else {
                _this.kynomore = false
                _this.noKaiyanDataStatus = true
              }
            }
          }
        })
      },
      // 集市店铺加载更多
      shopLoadMore () {
        let _this = this
        switch (_this.selectMenu) {
          case '0':
            if (!_this.badynomore) {
              _this.badyPage++
              _this.badyLoading = true
              setTimeout(function () {
                _this.getMarketData('more')
              }, 500)
            }
            break
          case '1':
            if (!_this.jsnomore) {
              _this.jsPage++
              _this.jsLoading = true
              setTimeout(function () {
                _this.getShopData('more')
              }, 500)
            }
            break
          case '2':
            if (!_this.kynomore) {
              _this.kyPage++
              _this.kyLoading = true
              setTimeout(function () {
                _this.getOpenData('more')
              }, 500)
            }
            break
        }
      }
    },
    onReachBottom () { // 到底部加载更多
      this.shopLoadMore()
    },
    onShow () {
      wx.hideHomeButton()
      let _this = this
      // 获取搜索历史
      let historyA = wx.getStorageSync('searchHistoryA')
      let historyB = wx.getStorageSync('searchHistoryB')
      let historyC = wx.getStorageSync('searchHistoryC')
      if (historyA !== undefined && historyA !== '') {
        _this.badySearchHis = historyA
      }
      if (historyB !== undefined && historyB !== '') {
        _this.shopSearchHis = historyB
      }
      if (historyC !== undefined && historyC !== '') {
        _this.eyesSearchHis = historyC
      }
    },
    onUnload () {
      let _this = this
      _this.noBadyDataStatus = false
      _this.noShopDataStatus = false
      _this.noKaiyanDataStatus = false
      _this.placeVal = '请输入宝贝名称或者ID'
      _this.keywords = ''
      _this.menuArr = [
        {name: '集市宝贝'},
        {name: '集市店铺'},
        {name: '开眼'}
      ]
      _this.selectMenu = '0'
      _this.badySearchHis = []
      _this.leftGoodData = []
      _this.historyShowA = true
      _this.badyPage = 1
      _this.badyPerPage = 10
      _this.badyLoading = false
      _this.badynomore = false
      _this.shopSort = '0'
      _this.shopSearchHis = []
      _this.historyShowB = true
      _this.jsPage = 1
      _this.jsPerPage = 2
      _this.jsLoading = false
      _this.jsnomore = false
      _this.shopShow = false
      _this.shopData = []
      _this.openEyesData = []
      _this.kyPage = 1
      _this.kyPerPage = 10
      _this.kyLoading = false
      _this.kynomore = false
      _this.eyesSearchHis = []
    },
    onLoad (option) {
      let _this = this
      if (option.menuSlect !== undefined) {
        _this.selectMenu = option.menuSlect
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
  .search-input .js-search-btns{
    font-size: 30rpx;
    font-family:PingFang SC;
    font-weight:400;
    color:rgba(0,0,0,1);
  }
</style>
<style lang="scss" scoped>
  .search-container {
    height: 100%;
    .search-top-fixed{
      position: fixed;
      width: 100%;
      left:0;
      top:0;
      z-index: 10;
      background-color: #fff;
      .search-menu-kj {
        /*height: 100%;*/
        background-color: #ffffff;
        .search-menu-top {
          display: flex;
          align-items: center;
          flex-direction: row;
          border-bottom: 2rpx solid #EEEEEE;
          .search-menu-list {
            position: relative;
            width: 33.3%;
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
            left:50%;
            transform: translate(-50%);
            background: linear-gradient(90deg, rgba(241, 208, 165, 1), rgba(213, 171, 121, 1));
            border-radius: 4rpx;
          }
        }
      }
    }
    .search-title {
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
    .search-content-kj {
      padding-top: 194rpx;
      .js-class-kj-a{
        .search-history{
          .search-history-row{
            display: flex;
            align-items: center;
            margin-top: 40rpx;
            position: relative;
            height:28rpx;
            .search-h-l{
              display: flex;
              align-items: center;
              font-size:30rpx;
              font-family:PingFang SC;
              font-weight:300;
              color:rgba(136,136,136,1);
              height: 100%;
            }
            .search-h-l-a{
              text-align: left;
              position: absolute;
              left:34rpx;
            }
            .search-h-l-b{
              text-align: right;
              position: absolute;
              right:34rpx;
            }
          }
          .search-his-content{
            margin-top: 60rpx;
            /*padding: 0 34rpx 0 34rpx;*/
            display: flex;
            align-items: center;
            flex-direction: row;
            flex-wrap: wrap;
            .search-his-nr{
              font-size: 27rpx;
              color:#000000;
              padding: 10rpx 34rpx;
              box-sizing: border-box;
              font-family:PingFang SC;
            }
          }
        }
        .js-class-overflow{
          position: relative;
          column-count:2;
          column-gap: 10px;
          padding: 30rpx 30rpx 90rpx 30rpx;
          background-color: #ffffff;
          .js-class-data-list{
            -moz-page-break-inside: avoid;
            -webkit-column-break-inside: avoid;
            break-inside: avoid;
            box-sizing: border-box;
            padding-bottom: 24rpx;
            .js-item_content{
              /*border:2rpx solid rgba(220,220,220,1);*/
              .js-class-data-img{
                width: 100%;
              }
              .js-class-data-name{
                text-align: left;
                font-size:24rpx;
                font-family:PingFang SC;
                font-weight:400;
                color:rgba(0,0,0,1);
                box-sizing: border-box;
                padding: 14rpx 12rpx;
                border:1rpx solid rgba(220,220,220,1);
                border-top:none;
                margin-top: -10rpx;
              }
            }
          }
        }
      }
      .js-class-kj-b{
        position: relative;
        padding-bottom: 70rpx;
        .search-history{
          .search-history-row{
            display: flex;
            align-items: center;
            margin-top: 42rpx;
            position: relative;
            height:28rpx;
            .search-h-l{
              display: flex;
              align-items: center;
              font-size: 30rpx;
              color:#888888;
              height: 100%;
              font-family:PingFang SC;
            }
            .search-h-l-a{
              text-align: left;
              position: absolute;
              left:34rpx;
            }
            .search-h-l-b{
              text-align: right;
              position: absolute;
              right:34rpx;
            }
          }
          .search-his-content{
            margin-top: 60rpx;
            /*padding: 0 34rpx 0 34rpx;*/
            display: flex;
            align-items: center;
            flex-direction: row;
            flex-wrap: wrap;
            .search-his-nr{
              font-size: 27rpx;
              color:#000000;
              padding: 10rpx 34rpx;
              box-sizing: border-box;
              font-family:PingFang SC;
            }
          }
        }
        .js-class-b-change{
          display: flex;
          align-items: center;
          padding: 10rpx 30rpx 10rpx 70%;
          .js-class-b-w{
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 60rpx;
            color:#1A1A1A;
            font-size: 28rpx;
          }
        }
        .js-class-list{
          padding: 30rpx;
          background-color: #ffffff;
          margin-bottom: 30rpx;
          /*box-sizing: border-box;*/
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
              margin-left: 120rpx;
              color: #000000;
              font-size: 30rpx;
              height: 100rpx;
              line-height: 100rpx;
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
                .xq-like-num{
                  font-size: 20rpx;
                  color:#000000;
                  text-align: center;
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
              margin-top: 30rpx;
              .xq-recomm-list{
                width: 32%;
                display: flex;
                flex-direction: column;
                margin-right: 2%;
                img{
                  width: 100%;
                  height: 163rpx;
                }
                .xq-recomm-name{
                  font-size: 24rpx;
                  color:#000000;
                  text-align: left;
                  border:1rpx solid #DCDCDC;
                  border-top:none;
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
      }
      .search-item-c {
        .search-history{
          .search-history-row{
            display: flex;
            align-items: center;
            margin-top: 42rpx;
            position: relative;
            height:28rpx;
            .search-h-l{
              display: flex;
              align-items: center;
              font-size: 30rpx;
              color:#888888;
              height: 100%;
              font-family:PingFang SC;
            }
            .search-h-l-a{
              text-align: left;
              position: absolute;
              left:34rpx;
            }
            .search-h-l-b{
              text-align: right;
              position: absolute;
              right:34rpx;
            }
          }
          .search-his-content{
            margin-top: 60rpx;
            /*padding: 0 34rpx 0 34rpx;*/
            display: flex;
            align-items: center;
            flex-direction: row;
            flex-wrap: wrap;
            .search-his-nr{
              font-size: 27rpx;
              color:#000000;
              padding: 10rpx 34rpx;
              box-sizing: border-box;
              font-family:PingFang SC;
            }
          }
        }
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
              width: 75%;
              height: 85rpx;
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
            .search-title-right {
              width: 25%;
              height: 80rpx;
              font-size: 38rpx;
              color: #F50002;
              text-align: right;
              .search-fh {
                font-size: 24rpx;
              }
            }
          }
          .search-desc {
            text-align: left;
            color: #666666;
            font-size: 24rpx;
            padding-top: 24rpx;
          }
        }
      }
    }
  }
</style>
