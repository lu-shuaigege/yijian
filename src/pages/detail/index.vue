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
      <div class="upload_item_wrap" v-for="(item,index) in imgUrls" :key="index">
        <div class="upload_item" v-if="item.img !== ''" @click="userImgclick(index)">
          <img :src="item.img" />
          <div class="upload_text">{{item.name}}</div>
        </div>
      </div>
    </div>
    <div class="result">
      <img src="../../assets/images/jianding.png" />
      <div>专家回复：{{cert_status_text}}</div>
    </div>
    <!--<button v-if="detail.cert_result !== '0' && !isShare" class="sharepage" open-type="share">分享好友</button>-->
    <button class="report" :class="detail.cert_result == '0'? 'disabled':''" :disabled="detail.cert_result == '0'" @click="goShare">查看报告</button>
    <button v-if="isShare" class="share" @click="goHome">我也要鉴定</button>
  </div>
</template>
<script>
import api from '../../api/api'
import wxService from '../../api/wxService'
import store from '../../utils/store'
import { llog } from '../../utils/log'
export default {
  data () {
    return {
      imgUrls: [
        {name: '全景', img: ''},
        {name: '正面', img: ''},
        {name: '背面', img: ''},
        {name: '口沿、落款', img: ''},
        {name: '底部、印章', img: ''},
        {name: '细节', img: ''}
      ],
      detail: {},
      isPlay: false,
      isShare: false,
      audioCtx: '',
      id: '',
      cert_status_text: '',
      share_code: ''
    }
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
    goShare () {
      let vm = this
      llog({ action_from: '鉴定详情页', action_to: '鉴定报告页', action_type: '浏览', action_status: 1, action_p1: vm.id })
      wx.navigateTo({
        url: `../share/main?share_code=${vm.share_code}&id=${vm.id}`
      })
    },
    goHome () {
      this.judgeEverything()
    },
    play () {
      this.audioCtx.src = store.imgUrl + this.detail.audio_url
      this.audioCtx.play()
    },
    stop () {
      this.audioCtx.stop()
    },
    judgeEverything () {
      if (store.goGuide || store.versionFlag === 2) {
        wx.redirectTo({
          url: '../index/main'
        })
      } else {
        wx.reLaunch({
          url: '../home/main'
        })
      }
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
          if (res.data.description === '') {
            res.data.description = '无'
          }
          vm.detail = res.data
          for (let i = 0; i < res.data.images.length; i++) {
            vm.imgUrls[(parseInt(res.data.images[i].position) - 1)].img = res.data.images[i].img_url
          }
          // vm.audioCtx.src = store.imgUrl + res.data.audio_url
          switch (res.data.cert_result) {
            case '0': vm.cert_status_text = '鉴定中，请稍后再查询'; break
            case '1': vm.cert_status_text = '老货'; break
            case '2': vm.cert_status_text = '新仿'; break
            case '3': vm.cert_status_text = '上节目'; break
            case '4': vm.cert_status_text = '无法确定'; break
            case '5': vm.cert_status_text = '恶搞'; break
            case '6': vm.cert_status_text = '真'; break
            case '7': vm.cert_status_text = '假'; break
            case '8': vm.cert_status_text = '海选'; break
          }
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
          for (let i = 0; i < res.data.images.length; i++) {
            if (res.data.images[i].img_url.indexOf('http') === -1) {
              vm.imgUrls[(parseInt(res.data.images[i].position) - 1)].img = store.imgUrl + res.data.images[i].img_url
            } else {
              vm.imgUrls[(parseInt(res.data.images[i].position) - 1)].img = res.data.images[i].img_url
            }
          }
          // vm.audioCtx.src = store.imgUrl + res.data.audio_url
          switch (res.data.cert_result) {
            case '0': vm.cert_status_text = '鉴定中，请稍后再查询'; break
            case '1': vm.cert_status_text = '老货'; break
            case '2': vm.cert_status_text = '新仿'; break
            case '3': vm.cert_status_text = '上节目'; break
            case '4': vm.cert_status_text = '无法确定'; break
            case '5': vm.cert_status_text = '恶搞'; break
            case '6': vm.cert_status_text = '真'; break
            case '7': vm.cert_status_text = '假'; break
            case '8': vm.cert_status_text = '海选'; break
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
    } else {
      vm.isShare = false
    }
    if (option.id) {
      vm.id = option.id
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
          vm.getShareDetail()
        } else {
          vm.getDetail()
        }
      }
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

    vm.imgUrls = [
      {name: '全景', img: ''},
      {name: '正面', img: ''},
      {name: '背面', img: ''},
      {name: '口沿、落款', img: ''},
      {name: '底部、印章', img: ''},
      {name: '细节', img: ''}
    ]
    vm.detail = {}
    vm.isShare = false
    vm.id = ''
    vm.cert_status_text = ''
    vm.share_code = ''
  }
  /* onShareAppMessage () {
    let vm = this
    return {
      title: vm.detail.name,
      imageUrl: vm.headUrl + vm.imgUrls[0].img,
      path: `pages/detail/main?share_code=${vm.detail.share_code}&id=${vm.id}`
    }
  } */
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
        height:240rpx;
        padding:20rpx 30rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 5;
        /*overflow: hidden;
        text-overflow: ellipsis;*/
        overflow-y: scroll;
        margin-bottom: 0;
        &.w100{
          width: 100%;
        }
      }
      .play{
        width:135rpx;
        height:280rpx;
        margin-bottom: 0;
        padding: 0;
        img{
          display: block;
          margin:0 auto;
          margin-top:80rpx;
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
  .sharepage{
    width: 1.1rem;
    height: 1.1rem;
    line-height: 0.35rem;
    border-radius: 50%;
    position:fixed;
    right: 0.25rem;
    bottom: 1.3rem;
    background: linear-gradient(to right , #F1D0A5, #D5AB79);
    color:#fff;
    font-size: 0.28rem;
    box-sizing:border-box;
    padding: 0.2rem 0.2rem;
    text-align:center;
  }
  .report{
    width: 360rpx;
    text-align: center;
    margin:20rpx auto;
    background: linear-gradient(to left,#D5AB79,#F1D0A5);
    height: 80rpx;
    line-height: 80rpx;
    border-radius: 40rpx;
    color:#fff;
    font-size: 30rpx;
    font-weight: bold;
    margin-top:30rpx;
    &:after{
      border:none;
    }
    &.disabled{
      //color:#ACACAC;
      background: #ccc;
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
