<template>
  <div class="share_container">
    <!--<canvas canvas-id="canvas" class="canvas"></canvas>-->
    <div class="include">
      <painter class="canvas" :customStyle="customStyle" @imgOK="onImgOk" @imgErr="onImgErr" :palette="template" />
    </div>
    <div  v-if="!isShare" class="flex">
      <div class="flex_item" style="border-right:1px solid #EAEAEC;" @click="shareCircle">
        <img src="../../assets/images/pengyouquan.png"/>
        <div>分享朋友圈</div>
      </div>
      <button class="flex_item" open-type="share">
        <img src="../../assets/images/weixin.png">
        <div>分享好友</div>
      </button>
    </div>
    <button style="position:fixed;bottom:0;" v-else @click="judgeEverything">我也要鉴定</button>
  </div>
</template>
<script>
import api from '../../api/api'
import wxService from '../../api/wxService'
import store from '../../utils/store'
import { llog } from '../../utils/log'
import global from '../../utils/global'
export default {
  data () {
    return {
      isShare: false,
      id: '',
      detail: {},
      // customStyle: 'width:100%;height:calc(100vh - 100rpx);',
      customStyle: 'width:100%;height:1090rpx;',
      template: {},
      canvas_image: '',
      button_image: '',
      shareImg: '',
      share_code: ''
    }
  },
  methods: {
    judgeEverything () {
      if (store.goGuide || store.versionFlag === 2) {
        wx.reLaunch({
          url: '../index/main'
        })
      } else {
        wx.reLaunch({
          url: '../home/main'
        })
      }
    },
    shareCircle () {
      let vm = this
      wx.getSetting({
        success (res) {
          if (res.authSetting['scope.writePhotosAlbum'] === false) {
            vm.openSetting()
          } else {
            wx.saveImageToPhotosAlbum({
              filePath: vm.shareImg,
              success: res => {
                llog({ action_from: '鉴定报告页', action_to: '外部', action_type: '分享朋友圈', action_status: 1, action_p1: vm.id })
                wx.showModal({
                  title: '分享二维码已保存到系统相册',
                  content: '快去分享给朋友，让更多的朋友发现这里的美好',
                  success: res => console.log(res),
                  error: err => console.log(err)
                })
              },
              fail: err => {
                llog({ action_from: '鉴定报告页', action_to: '鉴定报告页', action_type: '分享朋友圈', action_status: 0, action_p1: vm.id })
                console.log(err)
              }
            })
          }
        }
      })
    },
    onImgOk (e) {
      let vm = this
      vm.shareImg = e.mp.detail.path
    },
    onImgErr (e) {
    },
    save (qrcode) {
      let vm = this
      let css = ''
      if (vm.button_image !== `/image/cert_result_5.png` && vm.button_image !== `/image/cert_result_1.png` && vm.button_image !== `/image/cert_result_2.png` && vm.button_image !== `/image/cert_result_6.png` && vm.button_image !== `/image/cert_result_7.png`) {
        css = {
          top: '420rpx',
          left: '390rpx',
          width: '240rpx',
          height: '90rpx',
          rotate: '-15'
        }
      } else {
        css = {
          top: '390rpx',
          left: '480rpx',
          width: '130rpx',
          height: '120rpx',
          rotate: '-15'
        }
      }
      // 绘制样式
      this.template = {
        background: `${store.imgUrl}/image/cert_background.png?1`,
        width: '750rpx',
        height: '1090rpx',
        views: [
          {
            type: 'image',
            url: `${store.imgUrl}${vm.canvas_image}`,
            css: {
              top: '482rpx',
              left: '247rpx',
              width: '262rpx',
              height: '255rpx'
            }
          },
          {
            type: 'image',
            url: `${store.imgUrl}${qrcode}`,
            css: {
              top: '870rpx',
              left: '274rpx',
              width: '205rpx',
              height: '205rpx'
            }
          },
          {
            type: 'image',
            url: `${store.imgUrl}${vm.button_image}`,
            css: css
          },
          {
            type: 'text',
            text: '尊敬的藏友您好：',
            css: {
              top: '245rpx',
              width: '400rpx',
              left: '120rpx',
              fontWeight: 'normal',
              fontSize: '32rpx',
              fontFamily: 'microsoft yahei'
            }
          },
          {
            type: 'text',
            text: `       ${vm.detail.cert_description}`,
            css: {
              top: '308rpx',
              width: '500rpx',
              left: '120rpx',
              fontWeight: 'normal',
              fontSize: '25rpx',
              lineHeight: '50rpx',
              maxLines: '3',
              fontFamily: 'microsoft yahei'
            }
          }
        ]
      }
    },
    openSetting () {
      wx.openSetting({
        success (res) {
        }
      })
    },
    /** call api */
    getDetail () {
      let vm = this
      wxService.request({
        url: api.default.treasureDetail,
        method: 'post',
        data: {
          user_id: wx.getStorageSync('user_id'),
          token: wx.getStorageSync('token'),
          treasure_id: vm.id
        },
        success: function (res) {
          vm.detail = res.data
          res.data.images.forEach(element => {
            if (element.id === res.data.image_id) {
              vm.canvas_image = element.img_url
              switch (res.data.cert_result) {
                case '0': vm.button_image = `/image/cert_result_1.png`; break
                case '1': vm.button_image = `/image/cert_result_1.png`; break
                case '2': vm.button_image = `/image/cert_result_2.png`; break
                case '3': vm.button_image = `/image/cert_result_3.png`; break
                case '4': vm.button_image = `/image/cert_result_4.png`; break
                case '5': vm.button_image = `/image/cert_result_5.png`; break
                case '6': vm.button_image = `/image/cert_result_6.png`; break
                case '7': vm.button_image = `/image/cert_result_7.png`; break
                case '8': vm.button_image = `/image/cert_result_8.png`; break
              }
              // vm.save()
              vm.getQrcode()
            }
          })
        }
      })
    },
    getShareDetail () {
      let vm = this
      wxService.request({
        url: api.default.shareTreasure,
        method: 'get',
        data: {
          share_code: vm.share_code
        },
        success: function (res) {
          vm.detail = res.data
          res.data.images.forEach(element => {
            if (element.id === res.data.image_id) {
              vm.canvas_image = element.img_url
              switch (res.data.cert_result) {
                case '0': vm.button_image = `/image/cert_result_1.png`; break
                case '1': vm.button_image = `/image/cert_result_1.png`; break
                case '2': vm.button_image = `/image/cert_result_2.png`; break
                case '3': vm.button_image = `/image/cert_result_3.png`; break
                case '4': vm.button_image = `/image/cert_result_4.png`; break
                case '5': vm.button_image = `/image/cert_result_5.png`; break
                case '6': vm.button_image = `/image/cert_result_6.png`; break
                case '7': vm.button_image = `/image/cert_result_7.png`; break
              }
              // vm.save()
              vm.getQrcode()
            }
          })
        }
      })
    },
    getQrcode () {
      let vm = this
      wxService.request({
        url: api.default.qrcode,
        method: 'post',
        data: {
          user_id: wx.getStorageSync('user_id'),
          token: wx.getStorageSync('token'),
          scene: 'from=2&user_id=' + wx.getStorageSync('user_id'),
          path: 'pages/loading/main'
        },
        success: function (res) {
          if (res.code === 0) {
            vm.save(res.data.qrcode_url)
          }
        }
      })
    }
  },
  onLoad (option) {
    let vm = this
    if (option.share_code) {
      vm.isShare = true
      vm.share_code = option.share_code
      // 埋点
      global.buriendPointQuery(3, 'friend', option.openid)
    } else {
      vm.isShare = false
    }
    if (option.id) {
      this.id = option.id
    }
    if (store.flag) {
      if (option.share_code) {
        vm.getShareDetail()
      } else {
        vm.getDetail()
      }
    } else {
      store.callback = function () {
        if (option.share_code) {
          // 埋点
          global.buriendPointQuery(3, 'friend', option.openid)
          vm.getShareDetail()
        } else {
          vm.getDetail()
        }
      }
    }
  },
  onShow () {
    wx.hideHomeButton()
  },
  onUnload () {
    let vm = this
    vm.id = ''
    vm.detail = {}
    vm.template = {}
    vm.canvas_image = ''
    vm.button_image = ''
    vm.shareImg = ''
    vm.share_code = ''
  },
  onShareAppMessage () {
    let vm = this
    let openid = wx.getStorageSync('userInfo').passport_name
    llog({ action_from: '鉴定报告页', action_to: '外部', action_type: '转发朋友', action_status: 1, action_p1: vm.id })
    return {
      title: vm.detail.name,
      imageUrl: store.imgUrl + vm.detail.images[0].img_url,
      path: `pages/share/main?share_code=${vm.detail.share_code}&id=${vm.id}&openid=${openid}`
    }
  }
}
</script>
<style lang="scss" scoped>
.share_container{
  height:100vh;
  background: #17161b;
  .include{
    position: relative;
    height:calc(100vh - 100rpx);
    width: 100%;
  }
  .canvas{
    width:100%;
    // height:calc(100vh - 100rpx);
    height:1090rpx;
    vertical-align: middle;
    position: absolute;
    top:50%;
    transform: translate(0,-50%);
  }
  .flex{
    background: #fff;
    position: fixed;
    bottom: 0;
    padding:20rpx 0;
    height:60rpx;
    line-height: 60rpx;
    width:100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size:32rpx;
    .flex_item{
      width:100%;
      text-align: center;
      background:#fff;
      color:#000;
      font-size: 34rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      div{
        display: inline-block;
      }
      img{
        display: inline-block;
        margin-right: 10rpx;
        width:54rpx;
        height:54rpx;
        line-height: 54rpx;
        vertical-align:middle;
      }
    }
  }
  button{
    background: #000;
    color:#fff;
    height: 100rpx;
    line-height: 100rpx;
    width:100%;
    border-radius: 0;
    &:after{
      border:none;
    }
  }
}
</style>
