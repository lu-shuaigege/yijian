import api from '../api/api'
import wxService from '../api/wxService'
function uploadImg (callback) {
  wxService.request({
    url: api.default.headuploadImg,
    methods: 'post',
    data: {
      'token': wx.getStorageSync('token')
    },
    success: function (res) {
      if (res.code === 0) {
        let header = {
          'Content-Type': 'multipart/form-data'
        }
        header['x-csztv-access-key'] = (res.data.data.header[0].split(':'))[1]
        header['x-csztv-timestamp'] = (res.data.data.header[1].split(':'))[1]
        header['x-csztv-signature'] = (res.data.data.header[2].split(':'))[1]
        callback(header)
      }
    }
  })
}

export default uploadImg
