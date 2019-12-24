<template>
  <div class="shops-container">
    <!--店铺详情start-->
    <div class="xq-r-kj" @click.stop="uploadImage(1)">
      <img class="shop_bg" mode="aspectFill" :src="bg_img_url" alt="">
      <div class="xq-r-tou-p" @click.stop="uploadImage(0)">
        <img :src="icon" class="xq-r-tou"/>
        <span>{{text}}</span>
      </div>
      <div class="xq-address-p">
        <div class="xq-r-address">{{ shop.name }}</div>
        <div class="xq-r-address-b">
          <div class="xq-r-address-c">店铺地址：</div>
          <div class="xq-r-address-d">{{ shop.address }}</div>
        </div>
      </div>
      <div class="xq-like-icon" @click.stop="toUrl('/pages/myCenter/pages/setShopPage/main')" >
        <img src="../../../../assets/images/shop_edit_icon.png" class="xq-like-xh"/>
      </div>
      <span class="alter">点击修改背景图片</span>
    </div>
    <!--店铺详情end-->
    <!--列表start-->
    <div class="xq-shop-list">
      <van-cell-group>
        <van-cell is-link title="我的线上宝贝" link-type="navigateTo" url="/pages/myCenter/pages/onlineBadyPage/main" />
        <van-cell is-link title="我的待发布的宝贝" link-type="navigateTo" url="/pages/myCenter/pages/releasedBadyPage/main" />
        <van-cell is-link title="我的审核中的宝贝" link-type="navigateTo" url="/pages/myCenter/pages/inAuditBadyPage/main" />
        <van-cell is-link title="我的未通过审核的宝贝" link-type="navigateTo" url="/pages/myCenter/pages/noinAuditBadyPage/main" />
        <van-cell is-link title="我的下架的宝贝" link-type="navigateTo" url="/pages/myCenter/pages/lowerBadyPage/main" />
      </van-cell-group>
    </div>
    <!--列表end-->
    <!--上传start-->
    <div class="xq-shop-upload" @click="toUrl('/pages/myCenter/pages/uploaddoodsPage/main')" >
       <div class="xq-shop-upload-btn">上传新商品</div>
    </div>
    <!--上传end-->
  </div>
</template>
<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  import store from '../../../../utils/store'
  export default {
    data () {
      return {
        shop: {},
        icon: '/static/images/defaultphoto.jpeg',
        bg_img_url: '/assets/images/center_bg.png',
        text: '上传头像'
      }
    },
    components: {},
    onLoad () {
    },
    onShow () {
      wx.hideHomeButton()
      this.shopMe()
    },
    methods: {
      toUrl (url) {
        wx.navigateTo({url: url})
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
                wx.redirectTo({url: '/pages/myCenter/pages/examinePage/main'})
              }
              if (vm.shop.pass_status === 1) {
                if (res.data.icon !== '') {
                  vm.icon = res.data.icon
                  vm.text = '修改头像'
                }
                if (res.data.bg_img_url !== '') {
                  vm.bg_img_url = res.data.bg_img_url
                }
              }
              if (vm.shop.pass_status === 2) {
                wx.redirectTo({url: '/pages/myCenter/pages/examinePage/main'})
              }
              if (vm.shop.pass_status === 3) {
                wx.redirectTo({url: '/pages/myCenter/pages/myDianPuPage/main'})
              }
              if (vm.shop.pass_status === 4) {
                wx.redirectTo({url: '/pages/myCenter/pages/shenhePage/main'})
              }
            }
          }
        })
      },
      uploadImage (index) {
        let vm = this
        wx.chooseImage({
          count: 1,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success (res) {
            wx.uploadFile({
              url: api.default.headuploadImg,
              filePath: res.tempFilePaths[0],
              name: 'file',
              header: {
                'Content-Type': 'multipart/form-data'
              },
              formData: {
                token: wx.getStorageSync('token')
              },
              success: function (res1) {
                let data = JSON.parse(res1.data)
                if (data.code === 0) {
                  vm.keyList1 = data.data.data.header[0].split(':')
                  vm.keyList2 = data.data.data.header[1].split(':')
                  vm.keyList3 = data.data.data.header[2].split(':')
                  // let _this = this
                  wx.uploadFile({
                    url: api.sbsmam.yjUpload,
                    name: 'file',
                    filePath: res.tempFilePaths[0],
                    method: 'post',
                    header: {
                      'Content-Type': 'multipart/form-data',
                      'x-csztv-access-key': vm.keyList1[1],
                      'x-csztv-timestamp': vm.keyList2[1],
                      'x-csztv-signature': vm.keyList3[1]
                    },
                    formData: {
                      // "user": "test",
                    },
                    success: function (res2) {
                      let data2 = JSON.parse(res2.data)
                      // vm.photolist[index].photo = data2.data.path
                      if (index === 0) {
                        vm.icon = data2.data.path
                        vm.text = '修改头像'
                      } else {
                        vm.bg_img_url = data2.data.path
                      }
                      wxService.request({
                        url: api.twoapi.shopUpdate,
                        method: 'POST',
                        data: {
                          'token': wx.getStorageSync('token'),
                          'icon': vm.icon,
                          'bg_img_url': vm.bg_img_url
                        },
                        success: function (res) {
                          if (res.code === 0) {
                            if (res.data.id_card_1) {
                              vm.idcardedit = false
                            }
                          }
                        }
                      })
                    }
                  })
                } else if (data.code === 40003) {
                  vm.showToast('网络连接失败，请重新上传再试')
                  wx.request({
                    url: api.login.refreshToken,
                    header: {
                      'content-Type': 'application/x-www-form-urlencoded',
                      'Accept': 'application/json,text/plain,*/*'
                    },
                    data: {
                      appid: store.appid,
                      refresh_token: wx.getStorageSync('refresh_token')
                    },
                    method: 'post',
                    dataType: 'json',
                    success: function (res1) {
                      if (res1.data.code === 0) {
                        wx.setStorageSync('token', res1.data.data.token)
                        wx.setStorageSync('refresh_token', res1.data.data.refresh_token)
                        global.tokenreg(res1.data.data.token, res1.data.expire_in)
                      }
                    }
                  })
                } else if (data.code === 3001) {
                  vm.showToast(data.msg)
                }
              }
            })
          }
        })
      }
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
  }
  .xq-shop-list .van-cell{
    padding: 10px 15px 10px 44rpx;
  }
</style>
<style lang="scss" scoped>
  .shops-container{
    .xq-r-kj{
      background-size:100%;
      background-position:center;
      padding: 20rpx 30rpx 20rpx 50rpx;
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
      .xq-r-tou-p{
        position: relative;
        margin-right: 50rpx;
        .xq-r-tou{
          width: 100rpx;
          height: 100rpx;
          border-radius: 50%;
        }
        span{
          width: 100rpx;
          height: 30rpx;
          line-height: 30rpx;
          background: rgba(0, 0, 0, 0.71);
          color: #fff;
          font-size: 20rpx;
          display: block;
          border-radius: 8rpx;
          position: absolute;
          bottom:-4rpx;
          text-align: center;
        }
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
          color:#888888;
          text-align: left;
          display: flex;
          align-items: center;
          .xq-r-address-c{
            width: 33%;
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
          width: 40rpx;
          height: 40rpx;
        }
      }
      .alter{
        font-size:18rpx;
        color:rgba(136,136,136,1);
        position: absolute;
        right: 34rpx;
        bottom: 15rpx;
      }
    }
    .xq-shop-list{
      margin-top: 20rpx;
      background-color: #ffffff;
    }
    .xq-shop-upload{
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 40rpx;
      .xq-shop-upload-btn{
        width:380rpx;
        height:80rpx;
        color:#ffffff;
        font-size:30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
        border-radius:40rpx;
      }
    }
  }
</style>
