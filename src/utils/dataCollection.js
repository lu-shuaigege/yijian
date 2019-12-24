var globalInfo = require('./globalInfo.js')
var utilMd5 = require('./md5.js')

const lglobal = function (obj) {
  let time = parseInt(new Date().getTime() / 1000)
  let id = globalInfo.source + wx.getStorageSync('userInfo').passport_name + time
  wx.setStorageSync('dataCollectionId', id)
  let systemType = ''
  if (wx.getStorageSync('systemInfo')) {
    if (wx.getStorageSync('systemInfo').system.indexOf('iOS') !== -1) {
      systemType = '2'
    } else if (wx.getStorageSync('systemInfo').system.indexOf('Android') !== -1) {
      systemType = '1'
    } else {
      systemType = '0'
    }
  }
  let position = wx.getStorageSync('position').split(',')

  let object = {
    sign: utilMd5.hexMD5(utilMd5.hexMD5(wx.getStorageSync('userInfo').passport_name)),
    data: {
      id: id,
      openid: wx.getStorageSync('userInfo').passport_name,
      unionid: wx.getStorageSync('userInfo').unionid || '',
      device_brand: wx.getStorageSync('systemInfo').brand,
      device_model: wx.getStorageSync('systemInfo').model,
      client_ip: '',
      system_type: systemType,
      system_ver: wx.getStorageSync('systemInfo').system,
      wechat_ver: wx.getStorageSync('systemInfo').version,
      miniapp_ver: globalInfo.version,
      enter_mode: wx.getStorageSync('scene'),
      param_mode: wx.getStorageSync('mode_scene') || '',
      enter_time: time,
      miniapp_id: globalInfo.source,
      ext_data: '',
      lat: position[0],
      lon: position[1],
      leave_time: ''
    }
  }
  let newObj = {}
  let objData = Object.assign(object.data, obj)
  newObj = {
    sign: object.sign,
    data: objData
  }
  request({
    url: globalInfo.lglobal,
    method: 'POST',
    data: newObj,
    success: function (res) {
    }
  })
}
const llog = function (obj) {
  let time = parseInt(new Date().getTime() / 1000)
  let position = wx.getStorageSync('position').split(',')
  let object = {
    sign: utilMd5.hexMD5(utilMd5.hexMD5(wx.getStorageSync('userInfo').passport_name)),
    data: {
      miniapp_id: globalInfo.source,
      openid: wx.getStorageSync('userInfo').passport_name,
      unionid: wx.getStorageSync('userInfo').unionid || '',
      enter_mode: wx.getStorageSync('scene'),
      param_mode: wx.getStorageSync('mode_scene') || '',
      startup_id: wx.getStorageSync('dataCollectionId'),
      action_time: time,
      lat: position[0],
      lon: position[1]
    }
  }
  let newObj = {}
  let objData = Object.assign(object.data, obj)
  newObj = {
    sign: object.sign,
    data: objData
  }
  request({
    url: globalInfo.llog,
    method: 'POST',
    data: newObj,
    success: function (res) {
    }
  })
}

function request (object) {
  if (!object.data) {
    object.data = {}
  }
  wx.request({
    url: object.url,
    header: object.header || {
      'Content-Type': 'application/json'
    },
    data: object.data || {},
    method: object.method || 'GET',
    dataType: object.dataType || 'json',
    success: function (res) {
      if (object.success) { object.success(res.data) }
    },
    fail: function (res) {
    },
    complete: function (res) {
      if (res.statusCode !== 200) {
      }
      if (object.complete) { object.complete(res) }
    }
  })
}
export { llog, lglobal }
