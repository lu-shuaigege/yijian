<template>
  <div class="dian-container">
    <!--缺省start-->
    <div class="dian-que-kj" v-if="noShow">
      <img src="../../../../assets/images/nodianpu.png"/>
      <div class="dian-que-desc">您关注的店铺不存在</div>
    </div>
    <!--缺省end-->
    <div class="dian-show" v-if="!noShow">
      <!--店铺详情start-->
      <div class="xq-r-kj" >
        <img class="shop_bg" mode="aspectFill" :src="bg_img_url" alt="">
        <img :src="icon"  class="xq-r-tou"/>
        <div class="xq-address-p">
          <div class="xq-r-address">{{editData.name}}</div>
          <div class="xq-r-address-b">
            <div class="xq-r-address-c">店铺地址：</div>
            <div class="xq-r-address-d">{{editData.address}}</div>
          </div>
        </div>
        <div class="xq-like-icon">
          <button v-if="state != 1" @click="shopLike">
            <img src="../../../../assets/images/zan_a_icon.png" class="xq-like-xh" v-if="editData.is_favorite==0" />
            <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh" v-if="editData.is_favorite==1" />
          </button>
          <button v-if="state == 1" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
            <img src="../../../../assets/images/zan_a_icon.png" class="xq-like-xh" v-if="editData.is_favorite==0" />
            <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh" v-if="editData.is_favorite==1" />
          </button>
        </div>
      </div>
      <!--店铺详情end-->
      <!--关注start-->
      <div class="dian-b-kj">
        <div class="dian-b-list">
          宝贝数：<label>{{editData.goods_count}}</label>
        </div>
        <div class="dian-b-list">
          关注度：<label>{{editData.hot}}</label>
        </div>
        <div class="dian-b-list">
          热度：<label>{{editData.goods_hot}}</label>
        </div>
      </div>
      <!--关注end-->
      <!--产品列表start-->
      <div class="dian-product-kj" v-if="goods_list_length">
        <div class="js-class-overflow">
          <div class="js-class-data-list" v-for="(item,index) in goods_list" :key="index" @click="goodsChange(item.id)">
            <div class="js-item_content"  v-if="index%2==0">
              <div class="js-item-img-div">
                <img :src="item.img_url" mode='widthFix' class="js-class-data-img"/>
              </div>
              <div class="js-class-data-name">{{item.name}}</div>
            </div>
          </div>
          <div class="js-class-data-list" v-for="(item,index) in goods_list" :key="index" @click="goodsChange(item.id)">
            <div class="js-item_content"  v-if="index%2==1">
              <div class="js-item-img-div">
                <img :src="item.img_url" mode='widthFix' class="js-class-data-img"/>
              </div>
              <div class="js-class-data-name">{{item.name}}</div>
            </div>
          </div>
        </div>
        <div style="width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center"  v-if="dpIsLoading">
          <van-loading type="spinner" size="18px" />加载中...
        </div>
        <div style="" v-if="nomore">
          <van-divider contentPosition="center">没有更多数据了</van-divider>
        </div>
      </div>
      <!--无相关内容start -->
      <div class="dian-que-kj" v-if="noBadyDataStatus">
        <img src="../../../../assets/images/wuneirong.png"/>
        <div class="dian-que-desc">无相关内容</div>
      </div>
      <!--无相关内容end-->
      <!--产品列表end-->
      <!--回到顶部start-->
      <div class="dianpu-top-header" @click="goTop">
        <img src="../../../../assets/images/back_top.png"/>
      </div>
      <!--回到顶部end-->
      <!--返回首页start-->
      <backHome></backHome>
      <!--返回首页end-->
    </div>
  </div>
</template>

<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  import store from '../../../../utils/store'
  import global from '../../../../utils/global'
  import backHome from '../../../../components/backhome/backhome'
  export default {
    data () {
      return {
        noBadyDataStatus: false,
        page: 1,
        per_page: 10,
        editData: {},
        noShow: false,
        goods_list_length: 0,
        goods_list: [],
        shopId: '',
        icon: '/static/images/defaultphoto.jpeg',
        bg_img_url: '/assets/images/center_bg.png',
        store: store,
        // 加载中
        nomore: false,
        dpIsLoading: false
      }
    },
    components: {backHome},
    onLoad (options) {
      wx.hideHomeButton()
      let _this = this
      _this.shopId = options.id
    },
    onShow () {
      wx.hideHomeButton()
      this.getDianPuEdit(this.shopId)
    },
    methods: {
      shopLike () {
        this.getShopLike(this.editData.is_favorite ? '2' : '1', this.editData.id)
      },
      bindGetUserInfo (e) {
        let _this = this
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
                _this.shopLike()
              }
            }
          })
        }
      },
      // 宝贝详情
      goodsChange (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/marketDetailsPage/main?id=' + id
        })
      },
      // 获取详情
      getDianPuEdit (id, item) {
        let _this = this
        wxService.request({
          url: api.twoapi.marketShopShow,
          method: 'get',
          data: {
            'shop_id': id,
            'page': _this.page,
            'per_page': _this.per_page,
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.code === 0) {
              _this.editData = res.data
              if (res.data.bg_img_url !== '') {
                _this.bg_img_url = _this.editData.bg_img_url
              }
              if (res.data.icon !== '') {
                _this.icon = _this.editData.icon
              }
              _this.noBadyDataStatus = false
              if (res.data.goods_list.length > 0) {
                _this.goods_list_length = res.data.goods_list.length
                if (item === 'more') {
                  _this.goods_list = _this.goods_list.concat(res.data.goods_list)
                } else {
                  _this.goods_list = res.data.goods_list
                }
                if (_this.goods_list.length >= Number(res.data.paginate.total)) {
                  _this.nomore = true
                }
                _this.dpIsLoading = false
              } else {
                _this.goods_list = []
                _this.nomore = false
                _this.noBadyDataStatus = true
              }
            } else if (res.code === 70006) {
              _this.noShow = true
            }
          }
        })
      },
      // 集市店铺关注
      getShopLike (val, id) {
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
                _this.editData.is_favorite = 1
                _this.editData.hot = _this.editData.hot + 1
              } else if (val === '2') {
                _this.editData.is_favorite = 0
                _this.editData.hot = _this.editData.hot - 1
              }
            }
          }
        })
      },
      goTop: function () {
        wx.pageScrollTo({
          scrollTop: 0
        })
      },
      // 加载更多
      couponLoadMore () {
        let _this = this
        if (!_this.nomore) {
          _this.page++
          _this.dpIsLoading = true
          setTimeout(function () {
            _this.getDianPuEdit(_this.shopId, 'more')
          }, 500)
        }
      }
    },
    onShareAppMessage () {
      let _this = this
      return {
        title: _this.editData.name,
        // imageUrl: store.imgUrl + vm.detail.images[0].img_url,
        path: `pages/fair/pages/dianpuDetailPage/main?id=${_this.shopId}&user_id=${wx.getStorageSync('user_id')}&shareStatus=1`
      }
    },
    onReachBottom () { // 到底部加载更多
      this.couponLoadMore()
    },
    onUnload () {
      this.page = 1
      this.nomore = false
      this.dpIsLoading = false
      this.bg_img_url = '/assets/images/center_bg.png'
      this.icon = '/static/images/defaultphoto.jpeg'
    }
  }
</script>
<style>
  page{
    background-color: #fff;
  }
</style>
<style lang="scss" scoped>
  .dian-container{
    height: 100vh;
    .dian-que-kj{
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      img{
        width:141rpx;
        height:109rpx;
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
    .dian-show{
      .xq-r-kj{
        background-size:100%;
        background-position:center;
        padding: 20rpx 30rpx 20rpx 150rpx;
        box-sizing: border-box;
        width:100%;
        height: 190rpx;
        /*background-color: #ffffff;*/
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        .shop_bg{
          position: absolute;
          z-index: -1;
          top: 0;
          left: 0;
          width:100%;
          height:100%;
        }
        .xq-r-tou{
          position: absolute;
          left: 30rpx;
          top: 33rpx;
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
        }
        .xq-address-p{
          width: 80%;
          display: flex;
          flex-direction: column;
          .xq-r-address{
            width: 100%;
            color: #000000;
            font-size: 30rpx;
            height: 50rpx;
            /*line-height: 60rpx;*/
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
            font-family: PingFangSC-Medium;
          }
          .xq-r-address-b{
            font-size: 26rpx;
            color: #000000;
            text-align: left;
            display: flex;
            align-items: center;
            .xq-r-address-c{
              width: 30%;
              height: 60rpx;
            }
            .xq-r-address-d{
              width: 70%;
              line-height: 30rpx;
              padding-top: 2rpx;
              height: 55rpx;
            }
          }
        }
        .xq-like-icon{
          width: 20%;
          height: 100rpx;
          display: flex;
          justify-content: flex-end;
          .xq-like-xh{
            width: 44rpx;
            height: 42rpx;
          }
          button{
            border: none;
            outline-style: none;
            background:none;
            outline:none;
            border-radius: 0;
          }
          button::after {
            border: none;
          }
        }
      }
      .dian-b-kj{
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        font-size: 30rpx;
        padding: 0 30rpx;
        box-sizing: border-box;
        font-family: PingFangSC-Medium;
        border-bottom: 1rpx solid rgba(238,238,238,1);
        background:#fff;
        .dian-b-list{
          /*width: 33.3%;*/
          height:100rpx;
          display: flex;
          align-items: center;
          justify-content: start;
          label{
            color:#AB8A59;
          }
        }
      }
      .dian-product-kj{
        padding: 30rpx;
        height: 100%;
        background-color: #ffffff;
        .js-class-overflow{
          column-count:2;
          column-gap: 10px;
          .js-class-data-list{
            -moz-page-break-inside: avoid;
            -webkit-column-break-inside: avoid;
            break-inside: avoid;
            box-sizing: border-box;
            margin-bottom: 24rpx;
            .js-item_content{
              position: relative;
              border:1rpx solid rgba(220,220,220,1);
              .js-item-img-div{
                width: 100%;
                box-sizing: border-box;
                .js-class-data-img{
                  width: 100%;
                }
              }
              .js-class-data-name{
                font-size:24rpx;
                color:#000000;
                /*height: 70rpx;*/
                overflow: hidden;
                text-overflow:ellipsis;
                white-space: nowrap;
                box-sizing: border-box;
                padding:14rpx 12rpx 12rpx 12rpx;
                /*border:1rpx solid rgba(220,220,220,1);*/
                border-top:1rpx solid gainsboro;
                margin-top:-12rpx;
              }
            }
          }
        }
      }
      .dianpu-top-header{
        position:fixed;
        width: 90rpx;
        height: 90rpx;
        right: 30rpx;
        bottom: 25rpx;
        border-radius: 50%;
        img{
          width: 100%;
          height: 100%;
        }
      }
      .dian-que-kj{
        width:200rpx;
        height: 200rpx;
        position: fixed;
        top:50%;
        left:50%;
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
    button{
      border: none;
      outline-style: none;
      background-color: #fff;
      outline:none;
    }
    button::after {
      border: none;
    }
  }
</style>
