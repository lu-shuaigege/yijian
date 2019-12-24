<template>
  <div class="center">
    <div class="userinfo">
      <img src="../../assets/images/center_bg.png" alt="" style="width: 100%;height: 100%;position: absolute;left:0;top:0;display: block"/>
      <div class="info-tx">
        <img mode="scaleToFill" :src="user.avatar_url">
        <div>{{user.nickname}}</div>
      </div>
    </div>
    <div class="center-h">
      <div class="center-quan" @click="toUrl('/pages/myCenter/pages/openVipPage/main')">
      <div class="center-left-a" v-if="!user.is_prime">成为会员，享受更多福利</div>
        <div class="center-left-a" v-if="user.is_prime">尊敬的会员您好</div>
      <div class="center-left-b">会员权益</div>
      </div>
    </div>
    <div class="appraisal">
      <div class="item">
        <img class="icon my-jianding" mode="scaleToFill" src="../../assets/images/hammer.png"/>
        <div class="my-jian">我的鉴定</div>
      </div>
      <div class="tab_head">
        <ul>
          <li v-for="(item, index) in tabName" :key="index" @click="goResult(index)">
            <img mode="scaleToFill" style="width:54rpx;height:54rpx;" :src="item.pic"/>
            <div class="line">{{item.name}}
              <span class="num" v-if="numArr[index] != ''">{{numArr[index]}}</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <!--三个模块start-->
    <div class="center-model">

      <!--我的开眼-->
      <div class="center-list" @click="toUrl('/pages/myCenter/pages/myEyesPage/main')">
        <img src="../../assets/images/center-model-a.png" />
      </div>

      <!--我的关注-->
      <div class="center-list" @click="toUrl('/pages/myCenter/pages/followPage/main')">
        <img src="../../assets/images/center-model-b.png" />
      </div>

      <!--我的店铺-->
      <div class="center-list" v-if="!user.has_shop && !user.is_prime" @click="toUrl('/pages/myCenter/pages/openVipPage/main')">
        <img src="../../assets/images/center-model-c.png" />
      </div>
      <div class="center-list" v-if="!user.has_shop && user.is_prime" @click="toUrl('/pages/myCenter/pages/openShopPage/main')">
        <img src="../../assets/images/center-model-c.png" />
      </div>
      <div class="center-list" v-if="user.has_shop" @click="shopMe">
        <img src="../../assets/images/center-model-d.jpeg" />
      </div>

    </div>
    <div class="program">
      <div class="item" v-for="item1 in centernav" :key="item2" v-if="item1.title != '联系我们'" @click="toNavList(item1.jump_url)">
        <img class="icon" mode="scaleToFill" :src="item1.bg_img_url"/>
        <div class="item-left-name">{{item1.title}}</div>
      </div>
      <div class="item" v-for="item1 in centernav" :key="item1" v-if="item1.title == '联系我们'" @click="concactUs">
        <img class="icon" mode="scaleToFill" :src="item1.bg_img_url"/>
        <div class="item-left-name">{{item1.title}}</div>
      </div>
    </div>
    <div class="qrcode_container" v-if="qrcodeFlag">
      <div class="layer" @click="qrcodeClose"></div>
      <div class="qrcode_wrap">
          <div class="close" @click="qrcodeClose">
            <img src="../../assets/images/close.png" alt="">
          </div>
          <div class="code_box">
            <img :src="qrcode" />
          </div>
          <button class="save_img" @click.stop="saveQrcode">保存图片</button>
          <div class="text">点击保存客服二维码</div>
      </div>
    </div>
    <!--底部start-->
    <CardFooter v-bind:changeVallist="4"></CardFooter>
    <!--底部end-->
  </div>
</template>

<script>
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
import CardFooter from '../footer/index'
export default {
  data () {
    return {
      userInfo: {nickname: '', avatar_url: ''},
      tabName: [{ name: '全    部', pic: '/static/images/quanbu.png' },
        {name: '鉴定完成', pic: '/static/images/wancheng.png'},
        {name: '待鉴定', pic: '/static/images/wait.png'},
        { name: '待付款', pic: '/static/images/fukuan.png' }],
      numArr: [],
      qrcode: '/static/images/center_code.jpeg',
      qrcodeFlag: false,
      isActivityPoint: false,
      centernav: [],
      check: 0,
      reason: '',
      id: '',
      user: {}
    }
  },
  components: {CardFooter},
  onLoad () {
  },
  onShow () {
    wx.hideHomeButton()
    this.getUserMe()
    this.getNavList()
  },
  onUnload () {
    this.numArr = []
    // this.qrcode = ''
    this.qrcodeFlag = false
  },
  methods: {
    toUrl (url) {
      wx.navigateTo({ url: url })
    },
    toNavList (item) {
      wx.navigateTo({
        url: item
      })
    },
    getNavList () {
      let _this = this
      wxService.request({
        url: api.shopapi.homepageNav,
        method: 'get',
        data: {
          'type': 4
        },
        success: function (res) {
          if (res.code === 0) {
            _this.centernav = res.data.uc_menus
          }
        }
      })
    },
    getUserMe () {
      let _this = this
      wxService.request({
        url: api.shopapi.userMe,
        method: 'get',
        data: {'token': wx.getStorageSync('token')},
        success: function (res) {
          if (res.code === 0) {
            _this.user = res.data
            if (_this.user.nickname === '' || _this.user.avatar_url === '') {
              let userInfo = wx.getStorageSync('userInfo')
              _this.user.nickname = userInfo.nickname
              _this.user.avatar_url = userInfo.avatar_url
            }
            if (res.data.shop_status === 0) {
              _this.check = 0
            } else if (res.data.shop_status === 2) {
              _this.check = 2
              _this.reason = res.data.pass_fail_reason
            } else if (res.data.shop_status === 3) {
              _this.check = 3
            } else if (res.data.shop_status === 4) {
              _this.check = 4
            } else if (res.data.shop_status === 1) {
              _this.check = 1
            }
          }
        }
      })
    },
    shopMe () {
      let vm = this
      wxService.request({
        url: api.twoapi.shopMe,
        method: 'get',
        data: {
          'token': wx.getStorageSync('token')
        },
        success: function (res) {
          if (res.code === 0) {
            vm.shop = res.data
            // 0=待审核 1=已审核通过 2=审核未通过 3=闭店 4=已恢复
            if (vm.shop.pass_status === 0) {
              wx.navigateTo({url: '/pages/myCenter/pages/examinePage/main'})
            }
            if (vm.shop.pass_status === 1) {
              wx.navigateTo({url: '/pages/myCenter/pages/myShop/main'})
            }
            if (vm.shop.pass_status === 2) {
              wx.navigateTo({url: '/pages/myCenter/pages/examinePage/main'})
            }
            if (vm.shop.pass_status === 3) {
              wx.navigateTo({url: '/pages/myCenter/pages/myDianPuPage/main'})
            }
            if (vm.shop.pass_status === 4) {
              wx.navigateTo({url: '/pages/myCenter/pages/shenhePage/main'})
            }
          }
        }
      })
    },
    goResult (index) {
      wx.navigateTo({
        url: '../result/main?tab=' + index
      })
    },
    concactUs () {
      this.qrcodeFlag = true
    },
    openSetting () {
      wx.openSetting({
        success (res) {
          wx.hideLoading()
        }
      })
    },
    saveQrcode () {
      let page = this
      if (!wx.saveImageToPhotosAlbum) {
        wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。',
          showCancel: false
        })
        return
      }
      wx.showLoading({
        title: '正在保存图片',
        mask: false
      })
      wx.getSetting({
        success (res) {
          if (res.authSetting['scope.writePhotosAlbum'] === false) {
            page.openSetting()
          } else {
            wx.saveImageToPhotosAlbum({
              filePath: page.qrcode,
              success: function () {
                wx.showModal({
                  title: '提示',
                  content: '客服二维码保存成功',
                  showCancel: false
                })
              },
              fail: function (e) {
                wx.showModal({
                  title: '图片保存失败',
                  content: '请重试',
                  showCancel: false
                })
              },
              complete: function (e) {
                wx.hideLoading()
              }
            })
          }
        }
      })
    },
    qrcodeClose () {
      this.qrcodeFlag = false
    }
  }
}
</script>
<style lang="scss" scoped>
.center{
  background: #f5f5f9;
  height: 100%;
  padding-bottom: 110rpx;
  .item{
    .icon{
      width:40rpx;
      height:40rpx;
      margin-right:20rpx;
    }
    padding-left:30rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-weight: bold;
    font-size:30rpx;
  }
  .userinfo{
    width: 100%;
    height: 331rpx;
    text-align: center;
    position: relative;
    .info-tx{
      position: absolute;
      z-index: 10;
      left:50%;
      top:60rpx;
      transform: translate(-50%);
      width: 400rpx;
      height: 200rpx;
      img{
        width:120rpx;
        height:120rpx;
        border-radius: 50%;
      }
    }
  }
  .center-h{
    height: 70rpx;
    background-color: #F5F5F9;
    position: relative;
    .center-quan{
      position: absolute;
      bottom: 40rpx;
      width: 690rpx;
      left:50%;
      transform: translate(-50%);
      padding: 20rpx 40rpx;
      background:rgba(255,255,255,1);
      box-shadow:0px 1rpx 10rpx 0px rgba(0, 0, 0, 0.11);
      opacity:0.9;
      border-radius:40rpx;
      font-size: 28rpx;
      box-sizing: border-box;
      display: flex;
      flex-direction: row;
      .center-left-a{
        color:#000000;
        width: 80%;
        text-align: left;
      }
      .center-left-b{
        color:#AB8A59;
        width: 20%;
        text-align: right;
      }
    }
  }
  .appraisal{
    background: #fff;
    padding-top:40rpx;
    .my-jian{
      font-family:PingFang SC;
      font-weight:400;
      color:rgba(0,0,0,1);
      font-size:34rpx;
    }
    .my-jianding{
      width: 33rpx;
      height: 34rpx;
    }
    .tab_head{
      margin: 40rpx 0 0 0;
      padding-bottom: 20rpx;
      height: 120rpx;
      /*border-bottom:20rpx solid #f5f5f9;*/
      ul{
        li{
          float: left;
          width: 25%;
          text-align:center;
          font-size:24rpx;
          .line{
            padding: 0 10rpx;
            margin-top: 10rpx;
            font-weight:400;
            font-family:PingFangSC-Regular;
            color:#000000;
          }
          .num{
            color:#F50002;
            margin-left: -4rpx;
          }
        }
      }
    }
  }
  .center-model{
    padding: 30rpx 15rpx;
    display: flex;
    align-items: center;
    flex-direction: row;
    .center-list{
      width:33.3%;
      height: 122rpx;
      margin: 0 10rpx;
      border-radius: 10rpx;
      img{width: 100%;height: 100%}
    }
  }
  .program{
    background: #fff;
    margin-bottom: 40rpx;
    .item{
      height:120rpx;
      border-bottom: 1px solid #f5f5f9;
      img{
        width: 32rpx;
        height: 35rpx;
      }
      .item-left-name{
        font-size:34rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,1);
      }
    }
  }
  .qrcode_container{
    width: 100%;
    height: 100%;
    position:fixed;
    left:0;
    top:0;
    z-index:9999999;
    .layer{
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.6);
      position:absolute;
      left:0;
      top:0;
    }
    .qrcode_wrap{
      width: 5.18rem;
      height: 6.76rem;
      background: #fff;
      position:absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
      box-sizing:border-box;
      padding: 0.8rem 0.7rem 0;
      .close{
        position:absolute;
        width: 0.5rem;
        height: 0.5rem;
        right: 0.12rem;
        top:0.12rem;
        img{
          display:block;
          width: 0.5rem;
          height: 0.5rem;
        }
      }
      .code_box{
        width:100%;
        height:3.78rem;
        border:1px solid #D5AC7A;
        padding: 0.28rem;
        box-sizing:border-box;
        margin-bottom:0.3rem;
        img{
          display:block;
          width:3.22rem;
          height:3.22rem;
        }
      }
      .save_img{
        width:100%;
        height: 0.8rem;
        line-height:0.8rem;
        text-align:center;
        border-radius: 0.4rem;
        color:#fff;
        font-size:0.3rem;
        background: linear-gradient(to right , #F1D0A5, #D5AB79);
      }
      .text{
        height: 0.7rem;
        line-height: 0.7rem;
        text-align:center;
        color:#000;
        font-size:0.24rem;
      }
    }
  }
  .bottom{
    position: fixed;
    bottom:0;
    display: flex;
    flex-direction: row;
    width:100%;
    font-weight: bold;
    div, .result{
      width:50%;
      height:100rpx;
      line-height: 100rpx;
      text-align: center;
      margin:0 auto;
      font-size:28rpx;
      background: #fff;
    }
    .result{
      padding: 0;
      height:100rpx;
      line-height: 100rpx;
      &::after{
        border:none;
      }
    }
    .active{
      background: #000;
      color:#fff;
    }
  }
}
</style>
