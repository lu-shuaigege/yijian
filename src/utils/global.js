import api from '../api/api'
import wxService from '../api/wxService'
import store from './store'
import { lglobal, llog } from './dataCollection.js'
// let utils = require('./utils.js')
let global = {
  getToken () {
    // let vm = this
    wx.login({
      success (res) {
        if (res.code) {
          wxService.request({
            url: api.login.login,
            method: 'post',
            data: {
              appid: store.appid,
              source: store.source,
              third_platform_token: res.code
            },
            success: function (res1) {
              if (res1.code === 0 && res1.data.token) {
                wx.setStorageSync('token', res1.data.token)
                wx.setStorageSync('refresh_token', res1.data.refresh_token)
                wx.setStorageSync('expire_in', res1.data.expire_in)
                // 进入小程序埋点 新用户
                // lglobal({ enter_time: utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss') })
                lglobal({})
                // 这句换成一段话，不然调用judgeState的时候分享页新用户进来会有问题
                // vm.tokenreg(res1.data.token, res1.data.expire_in)
                wxService.request({
                  url: api.login.tokenReg,
                  method: 'post',
                  data: {
                    token: res1.data.token,
                    expire_in: res1.data.expire_in
                  },
                  success: function (res) {
                    wx.setStorageSync('user_id', res.data[0].user_id)
                    // 此时认为是新用户，即便是老用户也认为新用户
                    global.judgeState(1, true, true)
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  getUserInfoFromTencent () {
    let vm = this
    // 获取腾讯的用户信息并更新到自己的库里
    wx.getUserInfo({
      success (res) {
        let obj = {
          nickname: res.userInfo.nickName,
          avatar_url: res.userInfo.avatarUrl
        }
        if (wx.getStorageSync('userInfo').nickname) {
          // storage里有用户信息，则比对更新到自己库里
          // 在比对更新之前先登录重新刷一遍TOKEN
          wx.login({
            success (res) {
              if (res.code) {
                wxService.request({
                  url: api.login.login,
                  method: 'post',
                  data: {
                    appid: store.appid, source: store.source, third_platform_token: res.code
                  },
                  success: function (res1) {
                    if (res1.code === 0 && res1.data.token) {
                      wx.setStorageSync('token', res1.data.token)
                      wx.setStorageSync('refresh_token', res1.data.refresh_token)
                      wx.setStorageSync('expire_in', res1.data.expire_in)
                      // 进入小程序埋点 老用户
                      // lglobal({ enter_time: utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss') })
                      lglobal({})
                      vm.tokenreg(res1.data.token, res1.data.expire_in)
                      if (wx.getStorageSync('userInfo').nickname !== obj.nickname || wx.getStorageSync('userInfo').avatar_url !== obj.avatar_url) {
                        wxService.request({
                          url: api.login.updateWxUserInfo,
                          method: 'get',
                          data: {
                            token: wx.getStorageSync('token'),
                            nickname: obj.nickname,
                            avatar_url: obj.avatar_url
                          },
                          success: function (res1) {
                            if (res1.code === 0) {
                              let objtemp = Object.assign(wx.getStorageSync('userInfo') || {}, obj)
                              wx.setStorageSync('userInfo', objtemp)
                              if (objtemp.mobile) {
                                vm.judgeState(0, false, true)
                              } else {
                                vm.judgeState(2, false, true)
                              }
                            }
                          }
                        })
                      } else {
                        if (wx.getStorageSync('userInfo').mobile) {
                          vm.judgeState(0, false, true)
                        } else {
                          vm.judgeState(2, false, true)
                        }
                      }
                    }
                  }
                })
              }
            }
          })
        } else {
          // storage里没有用户信息，先去自己系统库里把用户数据拉过来
          vm.getUserInfoFromSystem()
        }
      }
    })
  },
  getUserInfoFromSystem () {
    let vm = this
    // 从自己库里拉用户信息数据
    wx.login({
      success (res) {
        if (res.code) {
          wxService.request({
            url: api.login.login,
            method: 'post',
            data: {
              appid: store.appid,
              source: store.source,
              third_platform_token: res.code
            },
            success: function (res1) {
              if (res1.code === 0 && res1.data.token) {
                wx.setStorageSync('token', res1.data.token)
                wx.setStorageSync('refresh_token', res1.data.refresh_token)
                wx.setStorageSync('expire_in', res1.data.expire_in)
                vm.tokenreg(res1.data.token, res1.data.expire_in)
                wxService.request({
                  url: api.login.userQuery,
                  method: 'get',
                  data: {
                    token: res1.data.token
                  },
                  success: function (res2) {
                    if (res2.code === 0) {
                      wx.setStorageSync('userInfo', res2.data)
                      // 进入小程序埋点 老用户  之所以放这里是为了要openid，所以不放token注册那
                      // lglobal({ enter_time: utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss') })
                      lglobal({})
                      if (res2.data.mobile) {
                        // 有手机state0,走引导页
                        vm.judgeState(0, true, true)
                      } else {
                        // 没手机state2,走引导页
                        vm.judgeState(1, true, true)
                      }
                    }
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  findUserQuery (option) {
    wxService.request({
      url: api.login.userQuery,
      method: 'get',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.code === 0) {
          wx.setStorageSync('userInfo', res.data)
          if (res.data.nickname === '') {
            store.state = 1
          } else if (res.data.mobile) {
            store.state = 0
          } else {
            store.state = 2
          }
          // 为了那个破埋点，破坏了完整性！！！ 有机会删了它 来自index页面的函数
          if (option) {
            llog({ action_from: '引导授权页', action_to: '鉴定首页', action_type: '授权', action_status: 1 })
            wx.redirectTo({
              url: '../homePage/main'
            })
          }
        }
      }
    })
  },
  // 为了埋点，在一开始去拿Openid等用的
  buriendPointQuery (option, from, openid) {
    wxService.request({
      url: api.login.userQuery,
      method: 'get',
      data: {
        token: wx.getStorageSync('token')
      },
      success: function (res) {
        if (res.code === 0) {
          wx.setStorageSync('userInfo', res.data)
          if (from === 'friend') {
            llog({ action_from: '外部', action_to: '鉴定报告页', action_type: '进入', action_status: 1, enter_mode_param: 3, action_p3: openid })
          } else if (from === 'activity') {
            llog({ action_from: '外部', action_to: '活动详情页', action_type: '进入', action_status: 1, enter_mode_param: 3, action_p3: openid })
          } else {
            llog({ action_from: '外部', action_to: 'loading页', action_type: '进入', action_status: 1, enter_mode_param: option, action_p3: openid })
          }
        }
      }
    })
  },
  judgeState (state, goGuide, flag) {
    store.state = state
    store.goGuide = goGuide
    store.flag = flag
    if (store.callback) {
      store.callback()
    }
    if (store.authorizeCallback) {
      store.authorizeCallback()
    }
  },
  judgeVersion () {
    wxService.request({
      url: api.default.guide,
      method: 'get',
      data: {
        version: wx.getStorageSync('version') || ''
      },
      success: function (res) {
        let newVersion = res.data.latest_version
        let version = wx.getStorageSync('version') || ''
        if (version === '') {
          // 新进来没version
          store.versionFlag = 2
          wx.setStorageSync('version', newVersion)
        } else if (newVersion === '') {
          // 客户端为最新版本
          store.versionFlag = 0
        } else {
          let arr = version.split('.')
          let newArr = newVersion.split('.')
          for (let i = 0; i < arr.length; i++) {
            if (parseInt(newArr[i]) > parseInt(arr[i])) {
              if (i === 0 || i === 1) {
                // 大版本
                store.versionFlag = 2
                wx.setStorageSync('version', newVersion)
                break
              } else {
                // 小版本
                store.versionFlag = 1
                wx.setStorageSync('version', newVersion)
              }
            }
          }
        }
      }
    })
  },
  tokenreg (token, expirein, cb) {
    wxService.request({
      url: api.login.tokenReg,
      method: 'post',
      data: {
        token: token || wx.getStorageSync('token'),
        expire_in: expirein || wx.getStorageSync('expire_in')
      },
      success: function (res) {
        wx.setStorageSync('user_id', res.data[0].user_id)
        if (cb) {
          cb()
        }
      }
    })
  }
}
export default global
