<template>
  <div class="openshop">
    <div class="openshop-username">
      <div class="openshop-input">
        <van-field required clearable :border="false" label="真实姓名" @change="bindinputName" :value="shop.owner_name" placeholder="不可修改，请谨慎填写" bind:click-icon="onClickIcon" title-width="160rpx"
                 custom-style="width:720rpx;height: 100rpx;padding:30rpx 40rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
      </div>
      <div class="openshop-upload">
        <div class="openshop-upload-title"><span>*</span>身份证正面</div>
        <div class="upload">
          <div  style="position:relative;">
            <div v-if="idcardFront === ''" class="pre_upload" @click="uploadImage(0)">
              <img src="../../../../assets/images/add.png" />
            </div>
            <div v-else>
              <img class="uploaded" :src="idcardFront" @click="userImgclick(0)"/>
              <img class="delete" src="../../../../assets/images/delete.png" @click="transh(0)" />
            </div>
          </div>
        </div>
      </div>
      <div class="openshop-upload">
        <div class="openshop-upload-title"><span>*</span>身份证反面</div>
        <div class="upload">
          <div  style="position:relative;">
            <div v-if="idcardBack === ''" class="pre_upload" @click="uploadImage(1)">
              <img src="../../../../assets/images/add.png" />
            </div>
            <div v-else>
              <img class="uploaded" :src="idcardBack" @click="userImgclick(1)"/>
              <img class="delete" src="../../../../assets/images/delete.png" @click="transh(1)" />
            </div>
          </div>
        </div>
      </div>
      <div class="openshop-upload">
        <div class="openshop-upload-title"><span>*</span>手持身份证的合影</div>
        <div class="upload">
          <div  style="position:relative;">
            <div v-if="idcardPhoto === ''" class="pre_upload" @click="uploadImage(2)">
              <img src="../../../../assets/images/add.png" />
            </div>
            <div v-else>
              <img class="uploaded" :src="idcardPhoto" @click="userImgclick(2)"/>
              <img class="delete" src="../../../../assets/images/delete.png" @click="transh(2)" />
            </div>
          </div>
        </div>
      </div>
      <div class="openshop-shop">
        <van-field required :border='false' clearable maxlength="20" :error-message="checkshop" error-message-align=right @change="bindinputShopName" :value="shop.name" label="店铺名称" placeholder="请填写店铺名称" @clear="onClickShopIcon" title-width="160rpx"
               custom-style="width:700rpx;min-height: 116rpx;padding:30rpx 40rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
        <span>店铺名称不得超过20字，数字、字母、_、（）可使用</span>
      </div>
      <div class="openshop-input">
        <van-field required :border='false' clearable @change="bindinputPhone" :error-message="checkphone" maxlength="11" type="number" @blur="checkPhone" :value="shop.owner_mobile" label="手 机 号" placeholder="为了买家能够联系到您，请填写准确" @clear="onClickPhoneIcon" title-width="160rpx"
               custom-style="width:700rpx;min-height: 100rpx;padding:30rpx 40rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
      </div>
      <div class="openshop-input">
        <van-field clearable :border='false' @change="bindinputWechat" :value="shop.owner_wechat" label="微 信 号" placeholder="为了买家能够联系到您，请填写准确" bind:click-icon="onClickIcon" title-width="160rpx"
               custom-style="width:700rpx;height: 100rpx;padding:30rpx 40rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
      </div>
        <van-field clearable :border='false' @change="bindinputAddress" :value="shop.address" label="店铺地址" placeholder="请填写正确的店铺地址" bind:click-icon="onClickIcon" title-width="160rpx"
             custom-style="width:700rpx;height: 100rpx;padding:30rpx 40rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
    </div>

    <div class="openshop-button">
      <!--<button @submit="submit">提交开店申请</button>-->
      <form @submit="submit" report-submit="true">
        <button form-type="submit">提交开店申请</button>
      </form>
    </div>
    <div>
      <van-dialog id="van-dialog"  confirm-button-color="#D5AC7A"/>
    </div>
  </div>
</template>
<script>
import api from '../../../../api/api'
import wxService from '../../../../api/wxService'
import store from '../../../../utils/store'
import global from '../../../../utils/global'
// import { llog } from '../../utils/log'
import Dialog from '../../../../../static/vant/dialog/dialog'
export default {
  data () {
    return {
      checkshop: '',
      checkphone: '',
      shop: {
        name: '',
        owner_name: '',
        owner_mobile: '',
        owner_wechat: '',
        address: ''
      },
      idcardFront: '',
      idcardBack: '',
      idcardPhoto: '',
      keyList1: [],
      keyList2: [],
      keyList3: []
    }
  },
  onLoad (option) {
  },
  onShow () {
    wx.hideHomeButton()
  },
  onUnload () {
    this.checkshop = ''
    this.checkphone = ''
    this.idcardFront = ''
    this.idcardBack = ''
    this.idcardPhoto = ''
    this.shop = {
      name: '',
      owner_name: '',
      owner_mobile: '',
      owner_wechat: '',
      address: ''
    }
  },
  methods: {
    // 判断手机号
    checkPhone (e) {
      let _this = this
      _this.shop.owner_mobile = e.mp.detail.value
      _this.checkphone = ''
      if (!(/^1[3456789]\d{9}$/.test(_this.shop.owner_mobile)) || _this.shop.owner_mobile.length < 11) {
        _this.checkphone = '请输入正确的手机号'
      }
    },
    // 清空输入店铺
    onClickShopIcon () {
      this.checkshop = ''
    },
    // 清空输入手机号
    onClickPhoneIcon () {
      this.checkphone = ''
    },
    showToast (message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    },
    bindinputName (e) {
      this.shop.owner_name = e.mp.detail
    },
    bindinputShopName (e) {
      let _this = this
      _this.shop.name = e.mp.detail
      if (_this.shop.name) {
        wxService.request({
          url: api.shopapi.shopCheck,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'name': _this.shop.name
          },
          success: function (res) {
            if (res.code === 70008) {
              _this.checkshop = '店铺名称不能重复'
            } else {
              _this.checkshop = ''
            }
          }
        })
      }
    },
    bindinputPhone (e) {
      this.shop.owner_mobile = e.mp.detail
    },
    bindinputWechat (e) {
      this.shop.owner_wechat = e.mp.detail
    },
    bindinputAddress (e) {
      this.shop.address = e.mp.detail
    },
    submit (e) {
      let _this = this
      if (_this.shop.owner_name === '') {
        _this.showToast('请输入真实姓名')
        return
      }
      if (_this.idcardFront === '') {
        _this.showToast('请输入身份证正面')
        return
      }
      if (_this.idcardBack === '') {
        _this.showToast('请输入身份证反面')
        return
      }
      if (_this.idcardPhoto === '') {
        _this.showToast('请输入手持身份证的合影')
        return
      }
      if (_this.shop.name === '') {
        _this.showToast('请输入店铺名称')
        return
      }
      if (_this.shop.owner_mobile === '') {
        _this.showToast('请输入手机号')
        return
      }
      if (!/^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(_this.shop.owner_mobile) || !_this.shop.owner_mobile) {
        _this.checkphone = '请输入正确的手机号'
        return
      }
      Dialog.confirm({
        title: '温馨提示',
        message: '请确认是否提交内容',
        confirmButtonText: '确认提交',
        cancelButtonText: '取消'
      }).then(() => {
        wxService.request({
          url: api.shopapi.shopStore,
          method: 'post',
          data: {
            'token': wx.getStorageSync('token'),
            'name': _this.shop.name,
            'owner_name': _this.shop.owner_name,
            'owner_mobile': _this.shop.owner_mobile,
            'owner_wechat': _this.shop.owner_wechat,
            'id_card_1': _this.idcardFront,
            'id_card_2': _this.idcardBack,
            'id_card_3': _this.idcardPhoto,
            'address': _this.shop.address,
            'form_id': e.target.formId
          },
          success: function (res) {
            if (res.code === 0) {
              wx.redirectTo({
                url: '/pages/myCenter/pages/examinePage/main'
              })
            } else if (res.code === 70008) {
              wx.showToast({
                title: '店铺名称不可重复',
                icon: 'none',
                duration: 2000
              })
            }
          }
        })
      }).catch(() => {
        // on cancel
      })
    },
    userImgclick (index) {
      let _this = this
      let urls = [_this.idcardFront, _this.idcardBack, _this.idcardPhoto]
      if (index === 0) {
        wx.previewImage({
          current: _this.idcardFront,
          urls: urls
        })
      } else if (index === 1) {
        wx.previewImage({
          current: _this.idcardBack,
          urls: urls
        })
      } else {
        wx.previewImage({
          current: _this.idcardPhoto,
          urls: urls
        })
      }
    },
    transh (index) {
      if (index === 0) {
        this.idcardFront = ''
      } else if (index === 1) {
        this.idcardBack = ''
      } else {
        this.idcardPhoto = ''
      }
    },
    uploadImage (index) {
      let vm = this
      wx.chooseImage({
        count: 1,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          wx.uploadFile({
            url: api.default.headuploadImg,
            filePath: res.tempFilePaths[0],
            name: 'file',
            header: {
              'Content-Type': 'multipart/form-data'
            },
            formData: {
              token: wx.getStorageSync('token')
            },
            success: function (res1) {
              let data = JSON.parse(res1.data)
              if (data.code === 0) {
                vm.keyList1 = data.data.data.header[0].split(':')
                vm.keyList2 = data.data.data.header[1].split(':')
                vm.keyList3 = data.data.data.header[2].split(':')
                wx.uploadFile({
                  url: api.sbsmam.yjUpload,
                  name: 'file',
                  filePath: res.tempFilePaths[0],
                  method: 'post',
                  header: {
                    'Content-Type': 'multipart/form-data',
                    'x-csztv-access-key': vm.keyList1[1],
                    'x-csztv-timestamp': vm.keyList2[1],
                    'x-csztv-signature': vm.keyList3[1]
                  },
                  formData: {
                    // "user": "test",
                  },
                  success: function (res2) {
                    let data2 = JSON.parse(res2.data)
                    if (index === 0) {
                      vm.idcardFront = data2.data.path
                    } else if (index === 1) {
                      vm.idcardBack = data2.data.path
                    } else {
                      vm.idcardPhoto = data2.data.path
                    }
                  }
                })
              } else if (data.code === 40003) {
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
                  success: function (res1) {
                    if (res1.data.code === 0) {
                      wx.setStorageSync('token', res1.data.data.token)
                      wx.setStorageSync('refresh_token', res1.data.data.refresh_token)
                      global.tokenreg(res1.data.data.token, res1.data.expire_in)
                    }
                  }
                })
              } else if (data.code === 3001) {
                vm.showToast(data.msg)
              }
            }
          })
        }
      })
    }
  }
}
</script>

<style>
  page{
    background: #f5f5f9;
    padding-bottom: 50rpx;
  }
  .van-field__error-message {
    margin-top:15rpx;
  }

</style>

<style lang="scss" scoped>
  .openshop{
    .openshop-username{
      margin-top: 20rpx;
      background: #fff;
      van-field{
        font-size:28rpx;
      }
      .openshop-upload{
        width:660rpx;
        height: 240rpx;
        border-bottom: 1px solid rgba(238,238,238,1);
        margin: 0 auto;
        padding:25rpx 30rpx;
        .openshop-upload-title{
          font-size: 28rpx;
          margin-left:-18rpx;
          color:#555555;
          span{
            color:red;
            margin-right: 8rpx;
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
      }
      .openshop-shop{
        position: relative;
        border-bottom: 1px solid rgba(238,238,238,1);
        width:720rpx;
        margin:0 auto;
        span{
          position:absolute;
          z-index:9;
          top:72rpx;
          left:211rpx;
          font-size:20rpx;
          color:#888;
        }
      }
      .openshop-input{
        width:720rpx;
        border-bottom: 1px solid rgba(238,238,238,1);
        margin: 0 auto;
      }
    }
    .openshop-button{
      margin: 50rpx auto;
      button{
        width:380rpx;
        height:80rpx;
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
        border-radius:40rpx;
        font-size:30rpx;
        font-weight:500;
        color:rgba(255,255,255,1);
      }
    }

  }



</style>

