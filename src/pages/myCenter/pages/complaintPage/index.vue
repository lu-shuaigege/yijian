<template>
  <div class="complaint-container">
    <div class="complaint-kj">
      <div class="complaint-name">投诉建议内容</div>
      <textarea class="complaint-text" v-model="suggestioncon" placeholder="请注明投诉店铺、宝贝名称、投诉问题等，并留下您的联系电话。" placeholder-style="color:#acacac"></textarea>
    </div>
    <div class="complaint-img-kj">
      <div class="complaint-solid"></div>
      <div class="complaint-tu">图片（选填）</div>
      <div class="upload">
        <div  style="position:relative;display:flex;flex-wrap: wrap;">
          <div class="after_upload" v-for="(item,index) in img_url" :key="index">
            <img class="uploaded" :src="item" @click="userImgclick(index)"/>
            <img class="delete" src="../../../../assets/images/delete.png" @click="transh(index)" />
          </div>
          <div v-if="img_url.length < 9" class="pre_upload" @click="uploadImage(index)">
            <img src="../../../../assets/images/add.png" />
            <div>{{img_url.length}}/9</div>
          </div>
        </div>
      </div>
    </div>

    <div class="complaint-tj" v-if="store.state == 0">
      <div class="complaint-btn" @click="submit">提交</div>
    </div>
    <button v-if="store.state == 1" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
      <div class="complaint-tj">
        <div class="complaint-btn" @click="submit">提交</div>
      </div>
    </button>
    <button v-if="store.state == 2" open-type="getPhoneNumber" @getphonenumber="bindGetPhoneNumber">
      <div class="complaint-tj">
        <div class="complaint-btn" @click="submit">提交</div>
      </div>
    </button>
    <div>
      <van-dialog id="van-dialog" confirm-button-color="#D5AC7A"/>
    </div>
  </div>
</template>

<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  import store from '../../../../utils/store'
  import global from '../../../../utils/global'
  import Dialog from '../../../../../static/vant/dialog/dialog'
  export default {
    data () {
      return {
        img_url: [],
        suggestioncon: '',
        store: store
      }
    },
    components: {},
    onShow () {
      wx.hideHomeButton()
    },
    onLoad () {
      this.img_url = []
      this.suggestioncon = ''
    },
    methods: {
      bindGetUserInfo (e) {
        if (e.mp.detail.userInfo) {
          wxService.request({
            url: api.login.getWxUserInfo,
            method: 'get',
            data: {
              token: wx.getStorageSync('token'),
              iv: e.mp.detail.iv,
              encryptedData: e.mp.detail.encryptedData
            },
            success: function (res) {
              if (res.code === 0) {
                store.state = 2
                global.findUserQuery()
              }
            }
          })
        }
      },
      bindGetPhoneNumber (e) {
        let _this = this
        if (e.mp.detail.errMsg !== 'getPhoneNumber:ok') {
          return false
        }
        wxService.request({
          url: api.login.getWxXcxMobile,
          method: 'get',
          data: {
            token: wx.getStorageSync('token'),
            iv: e.mp.detail.iv,
            encryptedData: e.mp.detail.encryptedData
          },
          success: function (res) {
            if (res.code === 0) {
              store.state = 0
              wx.setStorageSync('userInfo', Object.assign(wx.getStorageSync('userInfo') || {}, {'mobile': res.data.phone}))
              _this.regPhone(res.data.phone)
              global.findUserQuery()
              _this.submit()
            }
          }
        })
      },
      showToast (message) {
        wx.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
      },
      submit (e) {
        let _this = this
        if (_this.suggestioncon === '') {
          _this.showToast('请填写建议')
          return
        }
        Dialog.confirm({
          title: '温馨提示',
          message: '是否确认提交内容',
          confirmButtonText: '确认提交',
          cancelButtonText: '取消'
        }).then(() => {
          let imager = ''
          for (let i = 0; i < _this.img_url.length; i++) {
            imager = imager + _this.img_url[i] + ','
          }
          wxService.request({
            url: api.shopapi.userSuggestionadd,
            method: 'post',
            data: {
              'token': wx.getStorageSync('token'),
              'images': imager,
              'content': _this.suggestioncon
            },
            success: function (res) {
              if (res.code === 0) {
                _this.showToast('提交成功')
                _this.img_url = []
                _this.suggestioncon = ''
              }
            }
          })
        })
      },
      userImgclick (index) {
        let urls = []
        for (let i = 0; i < this.img_url.length; i++) {
          if (this.img_url[i] !== '') {
            urls.push(this.img_url[i])
          }
        }
        wx.previewImage({
          current: this.img_url[index],
          urls: urls
        })
      },
      transh (index) {
        this.img_url.splice(index, 1)
      },
      uploadImage (index) {
        let _this = this
        let _wx = wx
        _wx.chooseImage({
          count: 9 - _this.img_url.length,
          sizeType: ['original', 'compressed'],
          sourceType: ['album', 'camera'],
          success (res) {
            res.tempFilePaths.forEach(function (file, index) {
              if ((_this.img_url.length + index) < 9) {
                _this.upload(file)
              }
            })
          }
        })
      },
      upload (file) {
        let _this = this
        let _wx = wx
        _wx.uploadFile({
          url: api.default.headuploadImg,
          filePath: file,
          name: 'file',
          header: {'Content-Type': 'multipart/form-data'},
          formData: {token: _wx.getStorageSync('token')},
          success: function (res1) {
            let data = JSON.parse(res1.data)
            if (data.code === 0) {
              _this.keyList1 = data.data.data.header[0].split(':')
              _this.keyList2 = data.data.data.header[1].split(':')
              _this.keyList3 = data.data.data.header[2].split(':')
              _wx.uploadFile({
                url: api.sbsmam.yjUpload,
                name: 'file',
                filePath: file,
                method: 'post',
                header: {
                  'Content-Type': 'multipart/form-data',
                  'x-csztv-access-key': _this.keyList1[1],
                  'x-csztv-timestamp': _this.keyList2[1],
                  'x-csztv-signature': _this.keyList3[1]
                },
                success: function (res2) {
                  let data2 = JSON.parse(res2.data)
                  if (_this.img_url.length <= 9) {
                    _this.img_url.push(data2.data.path)
                  }
                }
              })
            } else if (data.code === 40003) {
              _this.showToast('网络连接失败，请重新上传再试')
              _wx.request({
                url: api.login.refreshToken,
                header: {
                  'content-Type': 'application/x-www-form-urlencoded',
                  'Accept': 'application/json,text/plain,*/*'
                },
                data: {
                  appid: store.appid,
                  refresh_token: _wx.getStorageSync('refresh_token')
                },
                method: 'post',
                dataType: 'json',
                success: function (res1) {
                  if (res1.data.code === 0) {
                    _wx.setStorageSync('token', res1.data.data.token)
                    _wx.setStorageSync('refresh_token', res1.data.data.refresh_token)
                    global.tokenreg(res1.data.data.token, res1.data.expire_in)
                  }
                }
              })
            } else if (data.code === 3001) {
              _this.showToast(data.msg)
            }
          }
        })
      }
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
    padding-bottom: 50rpx;
  }
</style>
<style lang="scss" scoped>
  .complaint-container{
    .complaint-kj{
      padding: 30rpx 42rpx;
      margin-top: 20rpx;
      background-color: #ffffff;
      .complaint-name{
        height: 40rpx;
        line-height: 40rpx;
        text-align: left;
        font-size: 28rpx;
        color:#555555;
        font-family: PingFangSC-Regular;
      }
      .complaint-text{
        width: 100%;
        margin-top: 20rpx;
        height:330rpx;
        padding: 30rpx;
        font-size: 26rpx;
        box-sizing: border-box;
        background-color:rgba(245,245,249,1);
      }
    }
    .complaint-img-kj{
      padding: 35rpx 42rpx;
      background-color: #ffffff;
      .complaint-solid{
        height: 1rpx;
        width: 100%;
        margin-bottom: 20rpx;
        background-color: #f5f5f5;
      }
      .complaint-tu{
        font-size: 28rpx;
        color:#555555;
        font-family: PingFangSC-Regular;
      }
      .complaint-upload{
        margin-top: 20rpx;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        .complaint-upload-btn-l{
          width:160rpx;
          height:160rpx;
          margin-bottom: 10rpx;
          margin-right: 10rpx;
          position: relative;
          .complaint-close{
            width: 45rpx;
            height: 45rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            right: 0;
            top:0;
            background-color: #666666;
          }
          img{
            width: 100%;
            height: 100%;
          }
        }
        .complaint-upload-btn{
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          width:159rpx;
          height:159rpx;
          background:rgba(255,255,255,1);
          border:1rpx dashed rgba(210,210,210,1);
          .complaint-upload-num{
            color:#ACACAC;
            font-size: 22rpx;
          }
        }
      }
    }
    .complaint-tj{
      padding-top:40rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      .complaint-btn{
        width:380rpx;
        height:80rpx;
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
        border-radius:40rpx;
        color:#ffffff;
        font-size: 30rpx;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .upload{
      display: flex;
      flex-direction: row;
      flex-wrap:wrap;
      justify-content: space-between;
      /*margin-left: 22rpx;*/
      .pre_upload{
        margin-top:20rpx;
        background: #fff;
        border:1px dashed #d2d2d2;
        width:160rpx;
        height:160rpx;
        color:#ACACAC;
        img{
          width:43rpx;
          height:43rpx;
          display: block;
          margin:0 auto;
          margin-top:59rpx;
        }
        div{
          font-size:22rpx;
          color:rgba(172,172,172,1);
          text-align: center;
          margin-top: 15rpx;
        }
      }
      .after_upload{
        position: relative;
        margin-right: 30rpx;
      }
      .uploaded{
        margin-top:20rpx;
        width:160rpx;
        height: 160rpx;
      }
      .delete{
        width:50rpx;
        height:50rpx;
        background:rgba(0,0,0,0.5);
        position:absolute;
        right: 0;
        top:20rpx;
      }
    }
    button{
      border: none;
      outline-style: none;
      background:none;
      outline:none;
      border-radius: 0;
    }
    button::after {
      border: none;
    }
  }
</style>
