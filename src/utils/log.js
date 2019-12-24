import wxService from '../api/wxService'
let utilMd5 = require('./md5.js')
let utils = require('./utils.js')
let api = require('../api/api.js')
let store = require('./store')
const lglobal = function (obj) {
  let now = {
    app_id: store.default.app_id,
    openid: wx.getStorageSync('userInfo').passport_name || '',
    unionid: wx.getStorageSync('userInfo').unionid || '',
    enter_mode: wx.getStorageSync('scene'),
    enter_mode_param: wx.getStorageSync('mode_scene') || '',
    // enter_time: utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss'),
    device_brand: wx.getStorageSync('systemInfo').brand,
    device_model: wx.getStorageSync('systemInfo').model,
    device_type: wx.getStorageSync('systemInfo').platform,
    wechat_version: wx.getStorageSync('systemInfo').version,
    mini_program_version: wx.getStorageSync('version'),
    app_type: '小程序',
    sign: utilMd5.hexMD5(store.default.app_id + utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss'))
  }
  let data = {}
  Object.assign(data, now, obj)
  wxService.request({
    url: api.default.log.global,
    method: 'post',
    data: data,
    success: function (res) {
    }
  })
}
const llog = function (obj) {
  let now = {
    openid: wx.getStorageSync('userInfo').passport_name || '',
    unionid: wx.getStorageSync('userInfo').unionid || '',
    enter_mode: wx.getStorageSync('scene'),
    // enter_mode_param: wx.getStorageSync('mode_scene') || '',
    action_time: utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss'),
    app_id: store.default.app_id,
    app_type: '小程序',
    sign: utilMd5.hexMD5(store.default.app_id + utils.format(new Date(), 'YYYY-MM-DD hh:mm:ss')),
    action_p5: wx.getStorageSync('position') || ''
  }
  let data = {}
  Object.assign(data, now, obj)
  wxService.request({
    url: api.default.log.log,
    method: 'post',
    data: data,
    success: function (res) {
    }
  })
}
export { llog, lglobal }
