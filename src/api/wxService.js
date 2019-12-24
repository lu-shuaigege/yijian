import api from './api.js'
import global from '../utils/global.js'
import store from '../utils/store.js'
let flag = true
export default {
  request (object) {
    if (!object.data) { object.data = {} }

    wx.request({
      url: object.url,
      header: object.header || {
        'content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json,text/plain,*/*'
      },
      data: object.data || {},
      method: object.method || 'GET',
      dataType: object.dataType || 'json',
      success: function (res) {
        if (res.data.code === 40003) {
          if (flag) {
            flag = false
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
                  wx.showToast({
                    title: '网络连接失败，请稍后再试',
                    icon: 'none',
                    duration: 2000
                  })
                  wx.setStorageSync('token', res1.data.data.token)
                  wx.setStorageSync('refresh_token', res1.data.data.refresh_token)
                  global.tokenreg(res1.data.data.token, res1.data.expire_in, res => {
                    flag = true
                  })
                }
              }
            })
          }
        } else {
          if (object.success) { object.success(res.data) }
        }
      },
      fail: function (res) {
        wx.showToast({
          title: res.errMsg,
          icon: 'none'
        })
        if (object.fail) { object.fail(res) }
      },
      complete: function (res) {
        if (res.statusCode !== 200) {
        }
        if (object.complete) { object.complete(res) }
      }
    })
  }
}
