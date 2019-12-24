<template>
  <div class="home_container">
    <swiper indicator-dots autoplay>
    <swiper-item v-for="(item,index) in imgUrls" :key="index">
      <img mode="scaleToFill" :src="item.img_banner_url" @click="imgclick(index)">
    </swiper-item>
  </swiper>
    <div class="home_content">
      <div class="input">
        <span style="color:#888;font-weight:bold;">宝贝名称</span>
        <input v-model="formInline.name" maxlength=18 placeholder="请输入宝贝名字(18字以内)" placeholder-style="color:#ACACAC;"/>
      </div>
      <div class="row">
        <div class="textarea">
          <span style="color:#888;font-weight:bold;">宝贝描述</span>
          <textarea maxlength=210 v-model="formInline.content" placeholder="请描述宝贝的背景、来源、瑕疵等相关的信息(200字以内)，如果打字不方便可以在右方进行语音描述" placeholder-style="color:#ACACAC;"></textarea>
        </div>
        <div class="record">
          <div v-if="formInline.filepath === '' && !isRecord" @click="record">
            <img src="../../assets/images/luyin.png" />
            <div style="font-weight:bold;">点击录音</div>
            <div style="font-weight:bold;">60秒以内</div>
          </div>
          <div v-if="isRecord" @click="stop">
            <img src="../../assets/images/recording.gif" />
            <div style="font-weight:bold;">{{second}}s</div>
            <div style="color:#D5AB79;font-weight:bold;">正在录音</div>
            <div style="color:#D5AB79;font-weight:bold;">点击停止</div>
          </div>
          <div v-if="formInline.filepath !== '' && !isPlay">
            <img src="../../assets/images/bofang.png" @click="play"/>
            <div style="font-weight:bold;">{{second}}s</div>
            <div style="color:#000;font-size:24rpx;margin-top:20rpx;border-radius:30rpx;color:#fff;background: linear-gradient(to left,#D5AB79,#F1D0A5);" @click="deletemusic">删除</div>
          </div>
          <div v-if="formInline.filepath !== '' && isPlay" @click="stopmusic">
            <img src="../../assets/images/pause.gif"/>
            <div>{{second}}s</div>
            <div style="color:#D5AB79;font-weight:bold;">正在播放</div>
            <div style="color:#D5AB79;font-weight:bold;">点击停止</div>
          </div>
        </div>
      </div>
    </div>
    <div class="home_content info">请按照要求上传5-6张清晰的宝贝照片</div>
    <div class="home_content upload">
      <div v-for="(item,index) in userImg" :key="index" style="position:relative;">
        <div v-if="item.img_url === ''" class="pre_upload" @click="uploadImage(index)">
          <img src="../../assets/images/add.png" />
          <div>上传照片</div>
        </div>
        <div v-else>
          <img class="uploaded" :src="item.img_url" @click="userImgclick(index)"/>
          <img class="delete" src="../../assets/images/delete.png" @click="transh(index)" />
        </div>
        <div class="upload_text">{{item.name}}</div>
      </div>
    </div>
    <button :disabled="isRecord" v-if="state != 1" class="submit" @click="submit">提交鉴定</button>
    <button id="submit" :disabled="isRecord" v-if="state == 1" class="submit" bindgetuserinfo="onGetUserInfo" open-type="getUserInfo">提交鉴定</button>
    <div class="bottom">
      <div @click="goActivity">活动报名</div>
      <div class="active">宝贝鉴定</div>
      <div v-if="state != 1" @click="goResult">个人中心</div>
      <button id="myresult" class="result" v-if="state == 1" bindgetuserinfo="onGetUserInfo" open-type="getUserInfo">个人中心</button>
    </div>
    <!--底部start-->
    <CardFooter v-bind:changeVallist="2"></CardFooter>
    <!--底部end-->
  </div>
</template>

<script>
import api from '../../api/api'
import wxService from '../../api/wxService'
import store from '../../utils/store'
import global from '../../utils/global'
import { llog } from '../../utils/log'
import uploadRules from '../../utils/uploadrules'
import CardFooter from '../footer/index'
const recorderManager = wx.getRecorderManager()
export default {
  data () {
    return {
      imgUrls: [],
      formInline: {
        name: '',
        content: '',
        filepath: '',
        recognize: ''
      },
      userImg: [
        {name: '全景', img_url: ''},
        {name: '正面', img_url: ''},
        {name: '背面', img_url: ''},
        {name: '口沿、落款', img_url: ''},
        {name: '底部、印章', img_url: ''},
        {name: '细节', img_url: ''}
      ],
      isRecord: false,
      isPlay: false,
      second: 0,
      interval: '',
      state: '',
      headUrl: '',
      isUnloadStop: false,
      audioCtx: ''
    }
  },
  components: {CardFooter},
  methods: {
    imgclick (index) {
      let urls = []
      for (let i = 0; i < this.imgUrls.length; i++) {
        urls.push(this.imgUrls[i].img_large_url)
      }
      llog({ action_from: '鉴定首页', action_to: '鉴定首页', action_type: '点击轮播图', action_status: 1 })
      wx.previewImage({
        current: this.imgUrls[index].img_large_url,
        urls: urls
      })
    },
    userImgclick (index) {
      let urls = []
      for (let i = 0; i < this.userImg.length; i++) {
        if (this.userImg[i].img_url !== '') {
          urls.push(this.userImg[i].img_url)
        }
      }
      wx.previewImage({
        current: this.userImg[index].img_url,
        urls: urls
      })
    },
    uploadImage (index) {
      let vm = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          uploadRules(function (rules) {
            wx.uploadFile({
              url: api.sbsmam.yjUpload,
              filePath: res.tempFilePaths[0],
              name: 'file',
              header: rules,
              success: function (res1) {
                let response = JSON.parse(res1.data)
                if (response.code === 200) {
                  vm.userImg[index].img_url = response.data.path
                } else if (response.code === 40003) {
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
                    success: function (res2) {
                      if (res2.data.code === 0) {
                        wx.setStorageSync('token', res2.data.data.token)
                        wx.setStorageSync('refresh_token', res2.data.data.refresh_token)
                        global.tokenreg(res2.data.data.token, res2.data.expire_in)
                      }
                    }
                  })
                } else if (response.code === 3001) {
                  vm.showToast(response.msg)
                }
              }
            })
          })
        }
      })
    },
    transh (index) {
      this.userImg[index].img_url = ''
    },
    record () {
      let vm = this
      wx.getSetting({
        success (res) {
          if (res.authSetting['scope.record'] === false) {
            vm.openSetting()
          } else {
            recorderManager.start({duration: 60000})
          }
        }
      })
    },
    play () {
      let vm = this
      vm.audioCtx.src = store.imgUrl + vm.formInline.filepath
      vm.audioCtx.play()
    },
    stop () {
      recorderManager.stop()
    },
    stopmusic () {
      this.audioCtx.stop()
    },
    deletemusic () {
      this.formInline.filepath = ''
      this.second = 0
    },
    goActivity () {
      let vm = this
      if (vm.formInline.name !== '' || vm.formInline.content !== '' || vm.formInline.filepath !== '') {
        wx.showModal({
          title: '提示',
          content: '您将离开此页面，所填内容即将丢失，是否确定离开？',
          confirmColor: '#D5AC7A',
          success (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../activity/main'
              })
            } else if (res.cancel) {
            }
          }
        })
      } else {
        for (let i = 0; i < vm.userImg.length; i++) {
          if (vm.userImg[i].img_url !== '') {
            wx.showModal({
              title: '提示',
              content: '您将离开此页面，所填内容即将丢失，是否确定离开？',
              confirmColor: '#D5AC7A',
              success (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../activity/main'
                  })
                } else if (res.cancel) {
                }
              }
            })
            break
          }
          if (i === vm.userImg.length - 1) {
            wx.redirectTo({
              url: '../activity/main'
            })
          }
        }
      }
    },
    goResult () {
      let vm = this
      if (vm.formInline.name !== '' || vm.formInline.content !== '' || vm.formInline.filepath !== '') {
        wx.showModal({
          title: '提示',
          content: '您将离开此页面，所填内容即将丢失，是否确定离开？',
          confirmColor: '#D5AC7A',
          success (res) {
            if (res.confirm) {
              wx.redirectTo({
                url: '../center/main'
              })
            } else if (res.cancel) {
            }
          }
        })
      } else {
        for (let i = 0; i < vm.userImg.length; i++) {
          if (vm.userImg[i].img_url !== '') {
            wx.showModal({
              title: '提示',
              content: '您将离开此页面，所填内容即将丢失，是否确定离开？',
              confirmColor: '#D5AC7A',
              success (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../result/main'
                  })
                } else if (res.cancel) {
                }
              }
            })
            break
          }
          if (i === vm.userImg.length - 1) {
            wx.redirectTo({
              url: '../center/main'
            })
          }
        }
      }
    },
    openSetting () {
      wx.openSetting({
        success (res) {
        }
      })
    },
    submit () {
      let vm = this
      if (this.formInline.name === '') {
        this.showToast('请输入宝贝名')
      } else if (this.formInline.content === '' && this.formInline.filepath === '') {
        this.showToast('请输入宝贝描述或者点击录音')
      } else {
        let mounth = 0
        for (let i = 0; i < this.userImg.length; i++) {
          if (this.userImg[i].img_url === '') {
            mounth++
          }
        }
        if (mounth >= 2) {
          this.showToast('请上传5张及以上的图片')
        } else {
          wx.showModal({
            title: '提示',
            content: '提交后不可修改，请确认填写内容后再提交',
            confirmText: '确认提交',
            confirmColor: '#D5AC7A',
            success (res) {
              if (res.confirm) {
                vm.submitTreasure()
              }
            }
          })
          /* wx.redirectTo({
            url: '../nonrespons/main'
          }) */
        }
      }
    },
    showToast (message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    },
    /** call api */
    banner () {
      let vm = this
      wxService.request({
        url: api.default.banner,
        method: 'get',
        success: function (res) {
          if (res.code === 0) {
            vm.imgUrls = res.data.items
            vm.imgUrls.forEach(item => {
              if (item.img_banner_url.indexOf('http') === -1) {
                item.img_banner_url = vm.headUrl + item.img_banner_url
                item.img_large_url = vm.headUrl + item.img_large_url
              }
            })
          }
        }
      })
    },
    uploadAudio (audio) {
      let vm = this
      uploadRules(function (rules) {
        wx.uploadFile({
          url: api.sbsmam.yjUpload,
          filePath: audio,
          name: 'file',
          header: rules,
          success: function (res1) {
            let response = JSON.parse(res1.data)
            if (response.code === 200) {
              vm.formInline.filepath = response.data.path
            } else if (response.code === 40003) {
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
                success: function (res2) {
                  if (res2.data.code === 0) {
                    wx.setStorageSync('token', res2.data.data.token)
                    wx.setStorageSync('refresh_token', res2.data.data.refresh_token)
                    global.tokenreg(res2.data.data.token, res2.data.expire_in)
                  }
                }
              })
            } else if (response.code === 3001) {
              vm.showToast(response.msg)
            }
          }
        })
      })
      // wx.uploadFile({
      //   url: api.default.uploadAudio,
      //   filePath: audio,
      //   name: 'file',
      //   header: {
      //     'Content-Type': 'multipart/form-data'
      //   },
      //   formData: {
      //     token: wx.getStorageSync('token')
      //   },
      //   success: function (res) {
      //     let data = JSON.parse(res.data)
      //     if (data.code === 0) {
      //       vm.formInline.filepath = data.data.url
      //     } else if (data.code === 40003) {
      //       vm.showToast('网络连接失败，请重新上传再试')
      //       wx.request({
      //         url: api.login.refreshToken,
      //         header: {
      //           'content-Type': 'application/x-www-form-urlencoded',
      //           'Accept': 'application/json,text/plain,*/*'
      //         },
      //         data: {
      //           appid: store.appid,
      //           refresh_token: wx.getStorageSync('refresh_token')
      //         },
      //         method: 'post',
      //         dataType: 'json',
      //         success: function (res1) {
      //           if (res1.data.code === 0) {
      //             wx.setStorageSync('token', res1.data.data.token)
      //             wx.setStorageSync('refresh_token', res1.data.data.refresh_token)
      //             global.tokenreg(res1.data.data.token, res1.data.expire_in)
      //           }
      //         }
      //       })
      //     }
      //   }
      // })
    },
    submitTreasure () {
      let vm = this
      let images = []
      for (let i = 0; i < vm.userImg.length; i++) {
        if (vm.userImg[i].img_url !== '') {
          images.push({img_url: vm.userImg[i].img_url, position: i + 1})
        }
      }
      wxService.request({
        url: api.default.submitTreasure,
        method: 'post',
        header: {
          'content-Type': 'application/json',
          'Accept': 'application/json,text/plain,*/*'
        },
        data: {
          user_id: wx.getStorageSync('user_id'),
          token: wx.getStorageSync('token'),
          name: vm.formInline.name,
          description: vm.formInline.content,
          audio_url: vm.formInline.filepath,
          audio_text: vm.formInline.recognize,
          images: images
        },
        success: function (res) {
          if (res.code === 0) {
            wx.setStorageSync('order_id_nw', res.data.order_id)
            wx.setStorageSync('treasure_id_nw', res.data.treasure_id)
            llog({ action_from: '鉴定首页', action_to: '免责条款页', action_type: '下单', action_status: 1, action_p1: res.data.treasure_id })
            wx.redirectTo({
              url: '../nonrespons/main'
            })
          } else {
            vm.showToast(res.msg)
            llog({ action_from: '鉴定首页', action_to: '免责条款页', action_type: '下单', action_status: 0 })
          }
        }
      })
    },
    getwxuserInfo (iv, encryptedData) {
      let vm = this
      wxService.request({
        url: api.login.getWxUserInfo,
        method: 'get',
        data: {
          token: wx.getStorageSync('token'),
          iv: iv,
          encryptedData: encryptedData
        },
        success: function (res) {
          if (res.code === 0) {
            // store.state = 2
            // wx.setStorageSync('userInfo', res.data)
            global.findUserQuery()
            wx.showModal({
              title: '提示',
              content: '提交后不可修改，请确认填写内容后再提交',
              confirmText: '确认提交',
              confirmColor: '#D5AC7A',
              success (res) {
                if (res.confirm) {
                  vm.submitTreasure()
                }
              }
            })
          }
        }
      })
    }
  },
  onShow () {
    let vm = this
    wx.hideHomeButton()
    // 这个flag要在页面重新进来的时候重置为false
    vm.isUnloadStop = false
    vm.audioCtx = wx.createInnerAudioContext()
    recorderManager.onStart(() => {
      vm.isRecord = true
      vm.interval = setInterval(function () {
        vm.second += 1
      }, 1000)
    })
    recorderManager.onPause(() => {
    })
    recorderManager.onStop((res) => {
      vm.isRecord = false
      // vm.formInline.filepath = res.tempFilePath
      if (!vm.isUnloadStop) {
        vm.uploadAudio(res.tempFilePath)
      }
      clearInterval(vm.interval)
    })
    vm.audioCtx.onPlay(() => {
      vm.isPlay = true
    })
    vm.audioCtx.onStop(() => {
      vm.isPlay = false
    })
    vm.audioCtx.onEnded(() => {
      vm.isPlay = false
    })
  },
  onHide () {
    let vm = this
    if (vm.isPlay) {
      vm.audioCtx.stop()
      vm.isPlay = false
    }
    if (vm.isRecord) {
      vm.isRecord = false
      clearInterval(vm.interval)
      recorderManager.stop()
    }
  },
  onUnload () {
    let vm = this
    if (vm.isPlay) {
      vm.audioCtx.stop()
      vm.audioCtx.destroy()
      vm.isPlay = false
    }
    if (vm.isRecord) {
      // 唯有isUnloadStop不能清空数据一定置为true
      vm.isUnloadStop = true
      vm.second = 0
      vm.isRecord = false
      clearInterval(vm.interval)
      recorderManager.stop()
    }
    vm.formInline.name = ''
    vm.formInline.filepath = ''
    vm.formInline.content = ''
    vm.formInline.recognize = ''
    vm.second = 0
    for (let i = 0; i < vm.userImg.length; i++) {
      vm.userImg[i].img_url = ''
    }

    vm.imgUrls = []
    vm.interval = ''
    vm.state = ''
    vm.headUrl = ''
  },
  onLoad () {
    this.state = store.state
    this.headUrl = store.imgUrl
    this.banner()
  },
  onGetUserInfo (e) {
    if (e.detail.userInfo) {
      if (e.currentTarget.id === 'submit') {
        llog({ action_from: '鉴定首页', action_to: '免责条款页', action_type: '授权', action_status: 1 })
        if (this.formInline.name === '') {
          this.showToast('请输入宝贝名')
        } else if (this.formInline.content === '' && this.formInline.filepath === '') {
          this.showToast('请输入宝贝描述或者点击录音')
        } else {
          let mounth = 0
          for (let i = 0; i < this.userImg.length; i++) {
            if (this.userImg[i].img_url === '') {
              mounth++
            }
          }
          if (mounth >= 2) {
            this.showToast('请上传超过5张以上的图片')
          } else {
            this.getwxuserInfo(e.detail.iv, e.detail.encryptedData)
          }
        }
      } else if (e.currentTarget.id === 'myresult') {
        llog({ action_from: '鉴定首页', action_to: '我的鉴定页', action_type: '授权', action_status: 1 })
        wxService.request({
          url: api.login.getWxUserInfo,
          method: 'get',
          data: {
            token: wx.getStorageSync('token'),
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData
          },
          success: function (res) {
            if (res.code === 0) {
              store.state = 2
              wx.setStorageSync('userInfo', res.data)
              wx.showModal({
                title: '提示',
                content: '您将离开此页面，所填内容即将丢失，是否确定离开？',
                confirmColor: '#D5AC7A',
                success (res1) {
                  if (res1.confirm) {
                    wx.redirectTo({
                      url: '../center/main'
                    })
                  } else if (res1.cancel) {
                  }
                }
              })
            }
          }
        })
      }
    } else {
      llog({ action_from: '鉴定首页', action_to: '鉴定首页', action_type: '授权', action_status: 0 })
    }
  },
  onShareAppMessage () {
    let openid = wx.getStorageSync('userInfo').passport_name
    llog({ action_from: '鉴定首页', action_to: '外部', action_type: '转发朋友', action_status: 1 })
    return {
      title: '玩物养志，匠心传承',
      imageUrl: `${store.imgUrl}/image/share.jpg?`,
      path: `pages/loading/main?from=1&openid=${openid}`
    }
  }
}
</script>
<style>
  page{
    padding-bottom: 110rpx;
  }
</style>
<style lang="scss" scoped>
.home_container{
  background: #F5F5F9;
  // height: 100vh;
  padding-bottom: 85rpx;
  swiper{
    height: 240rpx;
    img{
      width:100%;
      height: 100%;
    }
  }
  .home_content{
    padding:0 45rpx;
    font-size:26rpx;
    .row{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .input{
      display: flex;
      flex-direction: row;
      margin-top:20rpx;
      background: #fff;
      height:70rpx;
      line-height: 70rpx;
      border-radius: 40rpx;
      padding-left: 30rpx;
      span{
        color:#888888;
      }
      input{
        padding-left:20rpx;
        height:70rpx;
        line-height: 70rpx;
        padding-left: 20rpx;
        width:500rpx;
      }
    }
    .textarea{
      margin-top:20rpx;
      background: #fff;
      width: 430rpx;
      height:170rpx;
      padding:15rpx 30rpx;
      border-radius: 30rpx;
      textarea{
        width:430rpx;
        height:130rpx;
      }
    }
    .record{
      margin-top:20rpx;
      width:140rpx;
      height:200rpx;
      background:#fff;
      border-radius: 30rpx;
      img{
        display: block;
        margin:0 auto;
        margin-top:30rpx;
        width:80rpx;
        height:80rpx;
      }
      div{
        color:#ACACAC;
        font-size: 20rpx;
        width:90rpx;
        margin:0 auto;
        text-align: center;
      }
    }
    &.info{
      margin-top:14rpx;
      //color:#F50002;
      color:#D5AB79;
      font-size:22rpx;
      font-weight: bold;
    }
    &.upload{
      display: flex;
      flex-direction: row;
      flex-wrap:wrap;
      justify-content: space-between;
      .pre_upload{
        margin-top:20rpx;
        background: #fff;
        border:1px dashed #d2d2d2;
        width:180rpx;
        height:190rpx;
        color:#ACACAC;
        img{
          width:53rpx;
          height:53rpx;
          display: block;
          margin:0 auto;
          margin-top:40rpx;
        }
        div{
          width:100%;
          text-align: center;
          margin-top:5rpx;
        }
      }
      .uploaded{
        margin-top:20rpx;
        width:180rpx;
        height: 180rpx;
      }
      .delete{
        width:50rpx;
        height:50rpx;
        background:rgba(0,0,0,0.5);
        position:absolute;
        right: 0;
        top:20rpx;
      }
      .upload_text{
        position: absolute;
        bottom: 0;
        background: #7F7F7F;
        color:#fff;
        text-align: center;
        width: 100%;
        z-index: 10;
        height:40rpx;
        line-height: 40rpx;
      }
    }
  }
  .submit{
      width: 360rpx;
      text-align: center;
      margin:20rpx auto;
      background: linear-gradient(to left,#D5AB79,#F1D0A5);
      height: 65rpx;
      line-height: 65rpx;
      border-radius: 40rpx;
      color:#fff;
      font-size: 30rpx;
      font-weight: bold;
      &:after{
        border:none;
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
<style lang="scss">
page {
  background: #F5F5F9;
}
</style>
