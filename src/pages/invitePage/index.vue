<template>
  <div class="invite-container">
     <div class="invite-kj">
          <div class="invite-img">
            <img src="../../assets/images/quesheng.png" mode="scaleToFill"/>
          </div>
          <div class="invite-desc">邀请好友加入一鉴会员<br/>可获得100元电话充值卡一张</div>
          <div class="invite-look">
             <div @click="nowInvite">立即邀请</div>
          </div>
     </div>
    <!--好友分享start-->
    <div class="invite-share-kj" v-if="modelShow">
      <div class="invite-share-item">
        <div class="invite-share-k">
          <img src="../../assets/images/firends_icon.png" @click="downLoadImg"/>
        </div>
      </div>
      <div class="invite-share-item">
        <div class="invite-share-k">
          <button  open-type="share">
            <img src="../../assets/images/wx_firend_icon.png">
          </button>
        </div>
      </div>
    </div>
    <!--好友分享end-->
     <!--遮罩层start-->
     <!--<div class="invite-model-z" v-if="modelShow" @click="modelClose"></div>-->
     <!--遮罩层end-->
    <div class="invite-bg-img" v-if="inviteBg">
      <img src="/static/images/haibao.jpg" mode='aspectFill' class="invite-bg-hb"/>
      <img :src="codeUrl" class="invite-code"/>
    </div>
    <div class="include" v-if="showCan">
      <painter class="canvas" @imgOK="onImgOk" @imgErr="onImgErr" :palette="template" :customStyle="customStyle"/>
    </div>
  </div>
</template>

<script>
  import api from '../../api/api'
  import wxService from '../../api/wxService'
  import { base64src } from '../../utils/base64src.js'
  // import store from '../../utils/store'
  // import global from '../../utils/global'
  export default {
    data () {
      return {
        // loadingStatus: false,
        showCan: false,
        id: '',
        customStyle: 'width:100%;height:100vh-120rpx;',
        shareImg: '',
        detail: {},
        template: {},
        share_code: '',
        codeUrl: '',
        modelShow: false,
        inviteBg: false
      }
    },
    components: {},
    methods: {
      getUserMe () {
        wxService.request({
          url: api.shopapi.userMe,
          method: 'get',
          data: {'token': wx.getStorageSync('token')},
          success: function (res) {
            if (res.code === 0) {
              if (res.data.is_prime !== 1) {
                wx.redirectTo({
                  url: '/pages/myCenter/pages/openVipPage/main'
                })
              }
            }
          }
        })
      },
      downLoadImg () {
        let _this = this
        wx.getSetting({
          success (res) {
            if (res.authSetting['scope.writePhotosAlbum'] === false) {
              _this.openSetting()
            } else {
              wx.saveImageToPhotosAlbum({
                filePath: _this.shareImg,
                success: function (res) {
                  wx.showModal({
                    title: '分享二维码已保存到系统相册',
                    content: '快去分享给朋友，让更多的朋友发现这里的美好',
                    success: res => console.log(res),
                    error: err => console.log(err)
                  })
                },
                fail: err => {
                  console.log(err)
                }
              })
            }
          }
        })
        this.template = {}
      },
      openSetting () {
        wx.openSetting({
          success (res) {
          }
        })
      },
      onImgOk (e) {
        let _this = this
        _this.shareImg = e.mp.detail.path
        if (_this.shareImg !== '') {
          _this.showCan = false
        }
      },
      onImgErr (e) {
      },
      // 绘制样式
      save (code) {
        this.template = {
          background: '/static/images/bg-qp.png',
          width: '750rpx',
          height: '1500rpx',
          backgroundRepeat: 'repeat',
          views: [
            {
              type: 'image',
              url: `/static/images/haibao.jpg`,
              css: {
                top: '250rpx',
                left: '0',
                width: '750rpx',
                height: '1000rpx'
              }
            },
            {
              type: 'image',
              url: code,
              css: {
                bottom: '630rpx',
                left: '260rpx',
                width: '230rpx',
                height: '230rpx'
              }
            }
          ]
        }
      },
      nowInvite () {
        let _this = this
        _this.modelShow = true
        _this.inviteBg = true
      },
      getQrcode () {
        let _this = this
        wxService.request({
          url: api.twoapi.qrcode,
          method: 'get',
          data: {
            token: wx.getStorageSync('token'),
            scene: 'from=2&user_id=' + wx.getStorageSync('user_id'),
            path: 'pages/myCenter/pages/openVipPage/main'
          },
          success: function (res) {
            if (res.code === 0) {
              _this.showCan = true
              base64src('data:image/jpeg;base64,' + res.data, rest => {
                _this.codeUrl = rest
                _this.save(rest)
              })
            }
          }
        })
      }
    },
    onLoad (option) {
      let _this = this
      if (option.id) {
        _this.id = option.id
      }
    },
    onShow () {
      wx.hideHomeButton()
      // 获取二维码
      this.getQrcode()
      this.getUserMe()
    },
    onUnload () {
      let _this = this
      _this.shareImg = ''
      _this.template = {}
      _this.detail = ''
      _this.share_code = ''
      _this.showCan = false
      _this.modelShow = false
      _this.inviteBg = false
    },
    onShareAppMessage () {
      // let _this = this
      return {
        title: '邀请有礼',
        // imageUrl: _this.shareImg,
        path: `pages/myCenter/pages/openVipPage/main?user_id=${wx.getStorageSync('user_id')}&shareStatus=1`
      }
    }
  }
</script>
<style lang="scss" scoped>
.invite-container{
  height: 100vh;
  .include{
    position: relative;
    height:calc(100vh - 120rpx);
    width: 100%;
    top:-100%;
    left:-100%;
  }
  .canvas{
    width: 100%;
    position: absolute;
  }
  .invite-bg-img{
    width: 100%;
    height: calc(100vh - 120rpx);
    background-color: #fcf7ef;
    position: relative;
    .invite-bg-hb{
      position: absolute;
      width: 100%;
      height: 1000rpx;
      top:50%;
      transform: translate(0,-50%);
    }
    .invite-code{
      position: absolute;
      top: 50%;
      left: 50%;
      width: 230rpx;
      height: 230rpx;
      transform: translate(-50%,-50%);
    }
  }
  .invite-share-kj{
    position: fixed;
    bottom:0;
    width: 100%;
    height:120rpx;
    background:#fff;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-top: 1rpx solid #f5f5f5;
    .invite-share-item{
      width: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      .invite-share-k{
        display: flex;
        justify-items: center;
        flex-direction: column;
        button{
          border: none;
          outline-style: none;
          background-color: #fff;
          outline:none;
          display: flex;
        }
        button::after {
          border: none;
        }
        img{
          width:80rpx;
          height:80rpx;
          background:rgba(181,222,66,1);
          border-radius:50%;
        }
        .invite-name{
          color:#414141;
          font-size: 23rpx;
          width: 100%;
          text-align: center;
          margin-top: 20rpx;
        }
      }
    }
  }
  .invite-model-z{
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background:rgba(0,0,0,1);
    opacity:0.6;
    z-index: 2;
  }
  .invite-kj{
    width: 60%;
    position: absolute;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    .invite-img{
      text-align: center;
      img{
        width:110rpx;
        height:116rpx;
      }
    }
    .invite-desc{
      margin-top: 50rpx;
      color:#1A1A1A;
      font-size: 34rpx;
      text-align: center;
      line-height:57rpx;
    }
    .invite-look{
      text-align: center;
      margin-top:140rpx;
      div{
        display: inline-block;
        width:380rpx;
        height:80rpx;
        line-height: 80rpx;
        font-size: 30rpx;
        color:#FFFFFF;
        text-align: center;
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
        border-radius:40rpx;
      }
    }
  }
}
</style>
