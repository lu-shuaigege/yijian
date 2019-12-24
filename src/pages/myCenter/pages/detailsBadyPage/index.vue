<template>
  <div class="xq-container">
    <div class="dian-que-kj" v-if="noShow">
      <img src="../../../../assets/images/nodianpu.png"/>
      <div class="dian-que-desc">宝贝已下架</div>
    </div>
    <div v-if="!noShow">
      <!--轮播图start-->
      <div class="xq-swiper-kj">
        <swiper indicator-dots autoplay style="height: 100%;">
          <swiper-item v-for="(item,index) in editData.images" :key="index">
            <img mode="aspectFit" :src="item.img_url"  @click="bigLook(item.img_url)">
          </swiper-item>
        </swiper>
      </div>
      <!--轮播图end-->
      <!--标题start-->
      <div class="xq-title">{{editData.name}}</div>
      <!--标题end-->
      <!--宝贝描述start-->
      <div class="xq-desc">
        <div class="xq-b-titlle">宝贝介绍</div>
        <div class="xq-b-list">
          <ul>
            <li class="cq-b-li-a">年代<i></i></li>
            <li class="cq-b-li-b">{{editData.times}}</li>
            <li class="cq-b-li-a">尺寸<i></i></li>
            <li class="cq-b-li-b">{{editData.size}}</li>
            <li class="cq-b-li-a">材质<i></i></li>
            <li class="cq-b-li-b">{{editData.material}}</li>
            <li class="cq-b-li-a">所属类别<i></i></li>
            <li class="cq-b-li-b">{{editData.category_name}}</li>
            <li class="cq-b-li-a">说明<i></i></li>
            <li class="cq-b-li-b">{{editData.description}}</li>
          </ul>
        </div>
      </div>
      <div class="xq-r-kj" @click="lookShopEdit(editData.shop.id)">
        <img :src="shop.icon"  class="xq-r-tou"/>
        <div class="xq-r-address">{{editData.shop.name}}</div>
        <div class="xq-like-icon">
          <img src="../../../../assets/images/zan_a_icon.png" class="xq-like-xh" v-if="shop.is_favorite =='0'" />
          <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh" v-if="shop.is_favorite =='1'" />
        </div>
      </div>
      <!--宝贝描述end-->
      <!--相关推荐start-->
      <div class="xq-recomm-kj" v-if="editData.rec_goods.length>0">
        <div class="xq-recomm-title">相关推荐</div>
        <div class="xq-recomm-item">
          <div class="xq-recomm-list" v-for="(item,index) in editData.rec_goods" :key="index" @click="goodsTj(item.id)">
            <img :src="item.img_url"/>
            <div class="xq-recomm-name">{{item.name}}</div>
          </div>
        </div>
      </div>
      <!--相关推荐end-->
      <!--&lt;!&ndash;底部start&ndash;&gt;-->
      <!--<div class="xq-footer-kj" v-if="shop.is_owner ===1">-->
        <!--<div class="xq-footer-a" @click="footerChange('1')">投诉</div>-->
        <!--<div class="xq-footer-b" @click="footerChange('2')" v-if="editData.has_shop ===0">我也要开店</div>-->
        <!--<div class="xq-footer-b" @click="footerChange('4',shop.id)" v-if="editData.has_shop ===1">我的店铺</div>-->
        <!--<div class="xq-footer-c">热度：{{editData.hot}}</div>-->
        <!--<div class="xq-footer-d" @click="footerChange('3')">我要看货</div>-->
      <!--</div>-->
      <!--&lt;!&ndash;底部end&ndash;&gt;-->
      <van-dialog
        use-slot
        :show="show"
        confirm-button-text="保存图片"
        confirm-button-color="red"
        :show-cancel-button="cancelshow"
        :closeOnClickOverlay="cloasDialog"
        @close="closeDialog"
        confirm-button-open-type="getUserInfo"
      >
        <div style="width: 100%;height: 740rpx;padding: 10rpx;box-sizing: border-box">
          <img :src="shareImg" style="width: 100%;height:100%" mode='widthFix'/>
        </div>
      </van-dialog>
    </div>
  </div>
</template>

<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  // import store from '../../utils/store'
  // import global from '../../../utils/global'
  // import { llog } from '../../../utils/log'
  // import Dialog from '../../../../static/vant/dialog/dialog'
  export default {
    data () {
      return {
        cloasDialog: true,
        cancelshow: false,
        show: false,
        shop: {},
        editData: [],
        shareImg: ''
      }
    },
    methods: {
      bigLook (url) {
        let urls = []
        let objkeys = Object.keys(this.editData.images)
        for (let i = 0; i < objkeys.length; i++) {
          if (objkeys.length[i] !== '') {
            urls.push(this.editData.images[i].img_url)
          }
        }
        wx.previewImage({
          current: 'url',
          urls: urls
        })
      },
      closeDialog () {
        let _this = this
        _this.show = false
      },
      // 店铺详情
      lookShopEdit (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/dianpuDetailPage/main?id=' + id
        })
      },
      // 相关推荐跳转
      goodsTj (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/marketDetailsPage/main?id=' + id
        })
      },
      // 底部点击
      footerChange (val, id) {
        let _this = this
        switch (val) {
          case '1':
            wx.navigateTo({
              url: '/pages/myCenter/pages/complaintPage/main'
            })
            break
          case '2':
            wx.navigateTo({
              url: '/pages/myCenter/pages/openShopPage/main'
            })
            break
          case '3':
            wxService.request({
              url: api.twoapi.goodsPoster,
              method: 'get',
              data: {
                'id': '1'
              },
              success: function (res) {
                if (res.code === 0) {
                  _this.show = true
                  _this.shareImg = 'data:image/png;base64,' + res.data
                }
              }
            })
            break
          case '4':
            wx.navigateTo({
              url: '/pages/myCenter/pages/myShop/main?id=' + id
            })
            break
        }
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
                _this.shop.is_favorite = '1'
              } else if (val === '2') {
                _this.shop.is_favorite = '0'
              }
            }
          }
        })
      },
      // 获取详情
      getDianPuEdit (id) {
        let _this = this
        wxService.request({
          url: api.twoapi.marketGoodsShow,
          method: 'get',
          data: {
            'goods_id': id,
            'token': wx.getStorageSync('token')
          },
          success: function (res) {
            if (res.code === 0) {
              _this.editData = res.data
              _this.shop = res.data.shop
            } else {
              _this.noShow = true
            }
          }
        })
      }
    },
    onLoad (options) {
      let id = options.id
      this.getDianPuEdit(id)
    },
    onShow () {
      wx.hideHomeButton()
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
  }
</style>
<style lang="scss" scoped>
  .xq-container{
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
    .xq-swiper-kj{
      height: 350rpx;
      text-align:center;
      background-color:#fafafa;
      img {
        height: 100%
      }
    }
    .xq-title{
      background-color: #ffffff;
      text-align: left;
      font-size: 34rpx;
      color:#000000;
      padding: 30rpx;
      font-family: PingFangSC-Medium;
      border-bottom: 2rpx solid  rgba(238,238,238,1);
    }
    .xq-desc{
      padding: 30rpx;
      background-color: #ffffff;
      border-bottom: 2rpx solid  rgba(238,238,238,1);
      .xq-b-titlle{
        font-size: 30rpx;
        color:#000000;
        text-align: left;
        margin-bottom: 20rpx;
        font-family: PingFangSC-Medium;
      }
      .xq-b-list{
        ul{
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          li{
            margin-bottom: 10rpx;
          }
          li:nth-last-child(1){
            margin-bottom: 0;
          }
          .cq-b-li-a{
            width: 18%;
            color:#666666;
            font-size: 28rpx;
            height: 50rpx;
            text-align: justify;
            margin-right: 30rpx;
            i{
              display:inline-block;
              width:100%;
              height:0;
            }
          }
          .cq-b-li-b{
            width: 74%;
            color: #000000;
            font-size: 28rpx;
            min-height: 50rpx;
          }
        }
      }
    }
    .xq-r-kj{
      padding: 20rpx 30rpx 20rpx 150rpx;
      box-sizing: border-box;
      width:100%;
      background-color: #ffffff;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      .xq-r-tou{
        position: absolute;
        left: 30rpx;
        top: 20rpx;
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
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
        font-family: PingFangSC-Medium;
      }
      .xq-like-icon{
        width: 20%;
        height: 100rpx;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        .xq-like-xh{
          width: 44rpx;
          height: 42rpx;
        }
      }
    }
    .xq-recomm-kj{
      margin-top: 20rpx;
      margin-bottom: 120rpx;
      padding: 30rpx;
      background-color: #ffffff;
      .xq-recomm-title{
        font-size: 34rpx;
        color:#000000;
        text-align: center;
        font-family: PingFangSC-Medium;
      }
      .xq-recomm-item{
        display: flex;
        flex-direction: row;
        margin-top: 20rpx;
        .xq-recomm-list{
          width: 32%;
          display: flex;
          flex-direction: column;
          margin-right: 2%;
          border:1rpx solid #DCDCDC;
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
    .xq-footer-kj{
      width: 100%;
      position: fixed;
      left: 0;
      bottom: 0;
      background-color: #ffffff;
      display: flex;
      flex-direction: row;
      div{
        height: 100rpx;font-size: 32rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        color:#000000;
      }
      .xq-footer-a{
        width: 17%;
        border-right:1rpx solid rgba(245, 245, 249, 1);
      }
      .xq-footer-b{
        width: 28%;
        border-right:1rpx solid rgba(245, 245, 249, 1);
      }
      .xq-footer-c{
        width: 30%;
      }
      .xq-footer-d{
        width:25%;
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
      }
    }
  }
</style>
