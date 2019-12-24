<template>
  <div class="card-container">
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
    <div class="coupon-kj">
      <div class="coupon-list" v-for="item in resultArr" :key="item" v-if="item.use_status == 0">
        <div v-if="item.type == 1" class="coupon-list-l couponc">
          {{item.name}}
        </div>
        <div v-if="item.type == 2" class="coupon-list-l coupona">
          {{item.name}}
        </div>
        <div class="coupon-list-r">
          <div>有效期：{{item.expired_at}}</div>
        </div>
        <div class="coupon-list-rl">
          <div class="coupon-list-btn btn-a" @click="toUse(item.type)">去使用</div>
        </div>
      </div>
      <div class="coupon-list" v-for="item in resultArr" :key="item" v-if="item.use_status != 0">
        <div class="coupon-list-l couponb">
          {{item.name}}
        </div>
        <div class="coupon-list-r coupon-list-r-a" v-if="item.used_at != 0">
          <div>有效期：{{item.expired_at}}</div>
          <div v-if="item.use_status == 1">使用时间：{{item.used_at}}</div>
        </div>
        <div class="coupon-list-r coupon-list-r-a" v-if="item.used_at == 0">
          <div>有效期：{{item.expired_at}}</div>
        </div>
        <div class="coupon-list-rl">
          <div v-if="item.use_status == 1" class="coupon-list-btn btn-b">已使用</div>
          <div v-if="item.use_status == 2" class="coupon-list-btn btn-b">已失效</div>
        </div>
      </div>
      <div style="width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center"  v-if="dpIsLoading">
        <van-loading type="spinner" size="18px" />加载中...
      </div>
      <div style="" v-if="nomore">
        <van-divider contentPosition="center">没有更多数据了</van-divider>
      </div>
      <!--无相关内容start-->
      <div class="dian-que-kj" v-if="!resultArr.length">
        <img src="../../../../assets/images/wuneirong.png"/>
        <div class="dian-que-desc">无相关内容</div>
      </div>
      <!--无相关内容end-->
    </div>
  </div>
</template>

<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  // import store from '../../../sutils/store'
  // import global from '../../utils/global'
  // import { llog } from '../../utils/log'
  export default {
    data () {
      return {
        // 菜单
        menuArr: [
          {name: '待使用'},
          {name: '已使用'},
          {name: '已失效'}
        ],
        selectMenu: '0',
        resultArr: [],
        scene: 0,
        use_status: 0,
        page: 1,
        per_page: 12,
        // 加载中
        nomore: false,
        dpIsLoading: false
      }
    },
    components: {},
    onLoad (options) {
    },
    onUnload () {
      this.selectMenu = 0
      this.use_status = this.selectMenu
    },
    onShow () {
      wx.hideHomeButton()
      this.selectMenu = 0
      this.page = 1
      this.nomore = false
      this.dpIsLoading = false
      this.getList()
    },
    methods: {
      toUse (type) {
        if (type === '1' && this.from === null) {
          wx.reLaunch({
            url: '/pages/home/main'
          })
        } else if (type === '2' && this.from === null) {
          wx.reLaunch({
            url: '/pages/course/coursePage/main'
          })
        }
      },
      menuChange (index) {
        this.selectMenu = index
        this.use_status = this.selectMenu
        this.page = 1
        this.resultArr = []
        this.nomore = false
        this.getList()
      },
      getList (item) {
        let _this = this
        wxService.request({
          url: api.shopapi.couponIndex,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'scene': _this.scene,
            'use_status': _this.use_status,
            'page': _this.page,
            'per_page': _this.per_page
          },
          success: function (res) {
            if (res.code === 0) {
              if (res.data.coupon_list.length > 0) {
                if (item === 'more') {
                  _this.resultArr = _this.resultArr.concat(res.data.coupon_list)
                } else {
                  _this.resultArr = res.data.coupon_list
                }
                if (_this.resultArr.length >= Number(res.data.paginate.total)) {
                  _this.nomore = true
                }
                _this.dpIsLoading = false
              } else {
                _this.resultArr = []
                _this.nomore = false
              }
            }
          },
          complete: function (e) {
            if (e.data.code === 40003) {
              // page.getList()
            }
            _this.dpIsLoading = false
          }
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
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
  }
</style>
<style lang="scss" scoped>
  .card-container{
    .search-menu-kj {
      /*height: 100%;*/
      position: fixed;
      top:0;
      left:0;
      width:100%;
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
          background: linear-gradient(90deg, rgba(241, 208, 165, 1), rgba(213, 171, 121, 1));
          border-radius: 4rpx;
          left:50%;
          transform: translate(-50%);
        }
      }
    }
    .coupon-kj{
      display: flex;
      flex-direction: column;
      padding: 120rpx 30rpx 30rpx 30rpx;
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
    .coupon-list{
      width:100%;
      height:100rpx;
      background:rgba(255,255,255,1);
      border-radius:10rpx;
      display: flex;
      align-items: center;
      margin-bottom: 20rpx;
      padding: 0 30rpx 0 0;
      box-sizing: border-box;
      .coupon-list-l{
        width:24%;
        height:100rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius:10rpx 0 0 10rpx;
        font-size:30rpx;
        font-weight:500;
        color:rgba(255,255,255,1);
        text-align: center;
      }
      .coupona{
        background:linear-gradient(90deg,rgba(141,189,208,1),rgba(111,160,201,1));
      }
      .couponb{
        background:rgba(172,172,172,1);
      }
      .couponc{
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
      }
      .coupon-list-r{
        width: 50%;
        font-size:30rpx;
        margin-left: 30rpx;
      }
      .coupon-list-r-a{
        color:#ACACAC;
      }
      .coupon-list-rl{
        width: 26%;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .coupon-list-btn{
          color:#ffffff;
          font-size: 24rpx;
          height: 50rpx;
          width: 120rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius:25rpx
      }
        .btn-a{
          background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
        }
        .btn-b{
          background-color: rgba(172,172,172,1);
          opacity:0.5;
        }
      }
    }
  }
</style>
