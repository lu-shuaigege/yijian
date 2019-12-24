<script>
import global from './utils/global'
import store from './utils/store'
import { lglobal, llog } from './utils/dataCollection.js'
// let utils = require('./utils/utils.js')
export default {
  created () {
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    /* let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({key: 'logs'}).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    } */
  },
  onLaunch (option) {
    // 版本更新
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用',
              success: function (res) {
                updateManager.applyUpdate()
              }
            })
          })
        }
      })
    }
    // 埋点所需的
    option.scene && wx.setStorageSync('scene', option.scene)
    wx.getSystemInfo({
      success: function (res) {
        wx.setStorageSync('systemInfo', res)
      }
    })
    // 地理位置埋点
    wx.getLocation({
      type: 'wgs84',
      success (res) {
        let position = `${res.latitude},${res.longitude}`
        wx.setStorageSync('position', position)
        llog({
          action_from: '外部',
          action_page: '首页',
          pos_id: '1',
          pos_name: '地理位置',
          pos_index: '1',
          action_type: '0',
          action_status: '1',
          action_detail: '',
          ext_data: ''
        })
      }
    })
    // 版本对比+更新
    global.judgeVersion()
    wx.getSetting({
      success (res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权
          global.getUserInfoFromTencent()
        } else {
          // 未授权
          wx.removeStorageSync('userInfo')
          wx.removeStorageSync('token')
          wx.removeStorageSync('refresh_token')
          global.getToken()
          // 此时认为是新用户，即便是老用户也认为新用户
          // 这句放到getToken里去 不然新用户从分享进去拿不到token
          // global.judgeState(1, true, true)
        }
        if (store.flag) {
          if (!wx.getStorageSync('userInfo')) {
            global.findUserQuery()
            if (store.state === 1) {
              wx.setStorageSync('authorizeUser', {
                shop: '1',
                evaluate: '1',
                eye: '1',
                me: '2'
              })
            }
          }
        } else {
          store.authorizeCallback = function () {
            if (!wx.getStorageSync('userInfo')) {
              global.findUserQuery()
              if (store.state === 1) {
                wx.setStorageSync('authorizeUser', {
                  shop: '1',
                  evaluate: '1',
                  eye: '1',
                  me: '2'
                })
              }
            }
          }
        }
      }
    })
  },
  onUnload () {
    // 离开小程序埋点
    // lglobal({ leave_time: utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss') })
    lglobal({
      data: { leave_time: parseInt(new Date().getTime() / 1000) }
    })
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>
