<template>
  <div class="detail_container">
    <div class="detail_content">
      <div class="name">
        <span>宝贝名字：</span>{{detail.name}}
      </div>
      <div class="ID">
        <span>宝贝ID：</span>{{detail.id}}
      </div>
      <div class="flex">
        <div class="textarea" :class=" detail.audio_url == '' ? 'w100' : ''">
          <span>宝贝描述：</span>{{detail.description}}
        </div>
        <!--<div class="novoice" v-if="detail.audio_url == ''">
          暂无录音
        </div>-->
        <div class="play" v-if="detail.audio_url != '' && !isPlay">
          <img src="../../assets/images/bofang.png" @click="play"/>
          <div style="color:#D5AB79;padding:0;font-size:20rpx;font-weight:bold;">点击按钮</div>
          <div style="color:#D5AB79;padding:0;font-size:20rpx;font-weight:bold;">开始播放</div>
        </div>
        <div class="play" v-if="isPlay" @click="stop">
            <img src="../../assets/images/pause.gif"/>
            <div style="color:#D5AB79;padding:0;font-size:20rpx;font-weight:bold;">正在播放</div>
            <div style="color:#D5AB79;padding:0;font-size:20rpx;font-weight:bold;">点击停止</div>
        </div>
      </div>
    </div>
    <div class="upload">
      <div v-for="(item,index) in imgUrls" :key="index" class="upload_item_wrap">
        <div class="upload_item" v-if="item.img !== ''" @click="userImgclick(index)">
          <img :src="item.img" />
          <div class="upload_text">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="btn_wrap">
      <button class="cancel" @click="cancel">取消订单</button>
      <button class="report" @click="goPay">立即支付</button>
    </div>
  </div>
</template>
<script>
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
import store from '../../utils/store'
import { llog } from '../../utils/log'
export default {
  data () {
    return {
      id: '',
      detail: {},
      imgUrls: [
        {name: '全景', img: ''},
        {name: '正面', img: ''},
        {name: '背面', img: ''},
        {name: '口沿、落款', img: ''},
        {name: '底部、印章', img: ''},
        {name: '细节', img: ''}
      ],
      isPlay: false,
      audioCtx: ''
    }
  },
  onLoad (option) {
    if (option.id) {
      this.id = option.id
      this.getDetail()
    }
  },
  onShow () {
    wx.hideHomeButton()
    let vm = this
    vm.audioCtx = wx.createInnerAudioContext()
    vm.audioCtx.onPlay(() => {
      console.log('开始播放')
      vm.isPlay = true
    })
    vm.audioCtx.onStop(() => {
      console.log('停止播放')
      vm.isPlay = false
    })
    vm.audioCtx.onEnded(() => {
      console.log('自然停止播放')
      vm.isPlay = false
    })
  },
  onHide () {
    this.audioCtx.stop()
    this.isPlay = false
  },
  onUnload () {
    let vm = this
    vm.audioCtx.stop()
    vm.isPlay = false
    vm.audioCtx.destroy()

    vm.id = ''
    vm.detail = {}
    vm.imgUrls = [
      {name: '全景', img: ''},
      {name: '正面', img: ''},
      {name: '背面', img: ''},
      {name: '口沿、落款', img: ''},
      {name: '底部、印章', img: ''},
      {name: '细节', img: ''}
    ]
  },
  methods: {
    userImgclick (index) {
      let urls = []
      for (let i = 0; i < this.imgUrls.length; i++) {
        if (this.imgUrls[i].img !== '') {
          urls.push(this.imgUrls[i].img)
        }
      }
      wx.previewImage({
        current: this.imgUrls[index].img,
        urls: urls
      })
    },
    play () {
      this.audioCtx.src = store.imgUrl + this.detail.audio_url
      this.audioCtx.play()
    },
    stop () {
      this.audioCtx.stop()
    },
    getDetail () {
      let page = this
      wxService.request({
        url: api.default.treasureDetail,
        method: 'post',
        data: {
          'user_id': wx.getStorageSync('user_id'),
          'token': wx.getStorageSync('token'),
          'treasure_id': page.id
        },
        success: function (res1) {
          if (res1.code === 0) {
            if (res1.data.description === '') {
              res1.data.description = '无'
            }
            page.detail = res1.data
            res1.data.images.forEach((v, i) => {
              if (v.img_url.indexOf('http') === -1) {
                page.imgUrls[v.position - 1].img = store.imgUrl + v.img_url
              } else {
                page.imgUrls[v.position - 1].img = v.img_url
              }
            })
            if (res1.data.audio_url.indexOf('http') === -1) {
              page.audioCtx.src = store.imgUrl + res1.data.audio_url
            } else {
              page.audioCtx.src = res1.data.audio_url
            }
          }
        },
        complete: function (e) {
          if (e.data.code === 40003) {
          }
        }
      })
    },
    goHome () {
      wx.redirectTo({
        url: '../index/main'
      })
    },
    goPay () {
      wx.setStorageSync('treasure_id_nw', this.detail.id)
      wx.setStorageSync('order_id_nw', this.detail.order_id)
      llog({ action_from: '鉴定详情页', action_to: '免责条款页', action_type: '去支付', action_status: 1, action_p1: this.detail.id })
      wx.reLaunch({
        url: '../nonrespons/main'
      })
    },
    cancel () {
      let page = this
      wx.showModal({
        title: '提示',
        content: '取消订单后，订单信息将会被删除，是否确定取消订单？',
        confirmColor: '#D5AC7A',
        success (res) {
          if (res.confirm) {
            wxService.request({
              url: api.default.orderCancel,
              method: 'post',
              data: {
                'user_id': wx.getStorageSync('user_id'),
                'token': wx.getStorageSync('token'),
                'order_id': page.detail.order_id
              },
              success: function (res1) {
                if (res1.code === 0) {
                  llog({ action_from: '鉴定详情页', action_to: '我的鉴定页', action_type: '取消订单', action_status: 1, action_p1: page.detail.order_id })
                  wx.showToast({
                    title: '取消成功',
                    icon: 'none',
                    duration: 2000,
                    success: function () {
                      wx.reLaunch({
                        url: '../result/main?tab=3'
                      })
                    }
                  })
                }
              }
            })
          } else if (res.cancel) {
            llog({ action_from: '鉴定详情页', action_to: '鉴定详情页', action_type: '取消订单', action_status: 0, action_p1: page.detail.order_id })
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.detail_container{
  background: #F5F5F9;
  height:100vh;
  .detail_content{
    padding:0 45rpx;
    padding-top:20rpx;
    font-size: 26rpx;
    div{
      background:#fff;
      padding:0 30rpx;
      margin-bottom: 20rpx;
      border-radius: 40rpx;
      span{
        color:#888;
      }
    }
    .name,.ID{
      height:80rpx;
      line-height: 80rpx;
    }
    .flex{
      background: #F5F5F9;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding:0;
      margin-bottom: 0;
      .textarea{
        width:450rpx;
        height:265rpx;
        padding:20rpx 30rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        /*overflow: hidden;
        text-overflow: ellipsis;*/
        overflow-y:scroll;
        margin-bottom: 0;
      }
      .play{
        width:135rpx;
        height:305rpx;
        margin-bottom: 0;
        padding:0;
        img{
          display: block;
          margin:0 auto;
          margin-top:90rpx;
          width:80rpx;
          height:80rpx;
        }
        div{
          color:#ACACAC;
          font-size: 18rpx;
          // width:70rpx;
          margin:0 auto;
          text-align: center;
        }
      }
      .w100{
        width: 100%;
      }
      .novoice{
        width:170rpx;
        height:195rpx;
        margin-bottom: 0;
        padding: 40rpx 50rpx;
        line-height: 58rpx;
        font-size: 30rpx;
        text-align:center;
        color: #999;
        box-sizing:border-box;
      }
    }
  }
  .upload{
    padding:0 45rpx;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    //justify-content: space-between;
    .upload_item_wrap:nth-child(3n){
      .upload_item{
        margin-right: 0;
      }
    }
    .upload_item{
      margin-right: 31rpx;
      position: relative;
      margin-top:20rpx;
      img{
        width:200rpx;
        height:200rpx;
      }
      .upload_text{
        text-align: center;
        font-size: 26rpx;
        height:40rpx;
        line-height: 40rpx;
        position: absolute;
        z-index: 10;
        background: #7F7F7F;
        width:100%;
        bottom:0;
        color:#fff;
      }
    }
  }
  .result{
    background: #fff;
    height:80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    margin:0rpx 45rpx;
    padding:0 50rpx;
    font-size:32rpx;
    align-items: center;
    display: flex;
    flex-direction: row;
    margin-top:20rpx;
    img{
      width:35rpx;
      height:35rpx;
    }
    div{
      margin-left: 20rpx;
    }
  }
  .btn_wrap{
    margin-top: 0.6rem;
    text-align: center;
    .report{
      width: 240rpx;
      text-align: center;
      background: linear-gradient(to left,#D5AB79,#F1D0A5);
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      color:#fff;
      font-size: 30rpx;
      font-weight: bold;
      display:inline-block;
      margin-left: 0.6rem;
      &:after{
        border:none;
      }
    }
    .cancel{
      width: 240rpx;
      text-align: center;
      background: #ccc;
      height: 80rpx;
      line-height: 80rpx;
      border-radius: 40rpx;
      color:#fff;
      font-size: 30rpx;
      font-weight: bold;
      display:inline-block;
      &:after{
        border:none;
      }
    }
  }
  .share{
    background: #000;
    color:#fff;
    height: 100rpx;
    line-height: 100rpx;
    width:100%;
    border-radius: 0;
    position: fixed;
    bottom:0;
    &:after{
      border:none;
    }
  }
}
</style>