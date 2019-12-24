<template>
  <div class="openshop" style="box-sizing: border-box">
    <div class="openshop-username">

      <div class="openshop-upload"  >
        <div class="openshop-upload-title">上传宝贝照片</div>
        <div class="upload">
          <div  style="position:relative;display:flex;flex-wrap: wrap;">
            <div class="after_upload" v-for="(item,index) in images" :key="index">
              <img class="uploaded" :src="item" @click="userImgclick(index)"/>
              <img class="delete" src="../../../../assets/images/delete.png" @click="transh(index)" />
            </div>
            <div v-if="images.length < 9" class="pre_upload" @click="uploadImage()">
              <img src="../../../../assets/images/add.png" />
              <div>{{images.length}}/9</div>
            </div>
          </div>
        </div>
      </div>
      <van-field  clearable label="宝贝名称" :border='false' @change="bindinputName" :value="goods.name" placeholder="请填写宝贝名称" bind:click-icon="onClickIcon"
                  custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>

      <div class="openshop-intro">
        <div class="openshop-intro-title">宝贝介绍</div>
        <div class="openshop-input">
          <van-field  clearable :border='false' label="年  代" @change="bindinputTimes" :value="goods.times" placeholder="如：1765年" bind:click-icon="onClickIcon"
                   custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
        </div>
        <div class="openshop-shop">
          <van-field  clearable :border='false' label="尺  寸" @change="bindinputSize" :value="goods.size" placeholder="如：22x33x11cm " bind:click-icon="onClickIcon"
                     custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
        </div>
        <div class="openshop-input">
          <van-field  clearable :border='false' label="材  质" @change="bindinputMaterial" :value="goods.material" placeholder="请正确填写材质" bind:click-icon="onClickIcon"
                   custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
        </div>
        <div class="openshop-input">
          <van-field clearable :border='false'
                     label="所属类别"
                     @change="bindinputCategory"
                     @click="showModel('category')"
                     :value="goods.category_name"
                     placeholder="请正确填写所属类别"
                     bind:click-icon="onClickIcon"
                     custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#222" :readonly="true"  placeholder-style="color:rgba(172,172,172,1);"/>
        </div>
        <van-field clearable :border='false' label="说  明"
                   @change="bindinputDescription" :value="goods.description" placeholder="说明文字" bind:click-icon="onClickIcon"
                   custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#555555" placeholder-style="color:rgba(172,172,172,1);"/>
      </div>
      <div class="openshop-intro">
        <div class="openshop-intro-title">推荐位</div>
        <div class="openshop-input">
          <van-field icon="arrow" :border='false' clearable
                     @change="bindinputRecommend1"
                     @click="showModel('recommend1')"
                     label="推荐位1" :placeholder="recommend1" bind:click-icon="onClickIcon"
              custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#555555" :readonly="true" placeholder-style="color:rgba(172,172,172,1);"/>
        </div>
        <div class="openshop-input">
          <van-field icon="arrow" :border='false' clearable
                     @change="bindinputRecommend2"
                     @click="showModel('recommend2')"
                     label="推荐位2" :placeholder="recommend2" bind:click-icon="onClickIcon"
                   custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#555555" :readonly="true" placeholder-style="color:rgba(172,172,172,1);"/>
        </div>
        <van-field icon="arrow" :border='false' clearable
                   @change="bindinputRecommend3"
                   @click="showModel('recommend3')"
                   label="推荐位3" :placeholder="recommend3" bind:click-icon="onClickIcon"
                   custom-style="width:690rpx;height: 100rpx;padding:30rpx 20rpx;margin: 0 auto;font-size: 28rpx;color:#555555" :readonly="true" placeholder-style="color:rgba(172,172,172,1);"/>
      </div>
    </div>

    <div class="openshop-button">
      <form @submit="submit" report-submit="true">
        <button v-if="!goods.id" form-type="submit">上传宝贝信息</button>
        <button v-if="goods.id" form-type="submit">提交审核</button>
      </form>
    </div>
    <div>
      <van-dialog id="van-dialog" confirm-button-color="#D5AC7A"/>
    </div>
    <van-popup :show="type ==='recommend1'" position="bottom" @close="hideModel">
      <van-picker :columns="goodsList" value-key="name" @confirm="onRecommend1" @cancel="hideModel" show-toolbar="true"/>
    </van-popup>
    <van-popup :show="type ==='recommend2'" position="bottom" @close="hideModel">
      <van-picker :columns="goodsList" value-key="name" @confirm="onRecommend2" @cancel="hideModel" show-toolbar="true"/>
    </van-popup>
    <van-popup :show="type ==='recommend3'" position="bottom" @close="hideModel">
      <van-picker :columns="goodsList" value-key="name" @confirm="onRecommend3" @cancel="hideModel" show-toolbar="true"/>
    </van-popup>
    <van-popup :show="type ==='category'" position="bottom" @close="hideModel">
      <van-picker :columns="category" value-key="name" @confirm="onChangeCategory" @cancel="hideModel" show-toolbar="true"/>
    </van-popup>
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
      recommend1: '推荐链接',
      recommend2: '推荐链接',
      recommend3: '推荐链接',
      recommendId1: '',
      recommendId2: '',
      recommendId3: '',
      keyList1: [],
      keyList2: [],
      keyList3: [],
      goods: {
        id: '',
        images: '',
        name: '',
        category_id: '',
        category_name: '',
        description: '',
        times: '',
        size: '',
        material: '',
        rec_goods_id1: '',
        rec_goods_id2: '',
        rec_goods_id3: ''
      },
      goodsList: [],
      images: [],
      category: {},
      type: ''
    }
  },
  onLoad (option) {
    let _this = this
    option.id && this.getGoods(option.id)
    _this.getCategory()
    _this.getGoodsList()
    setTimeout(function () {
      if (!_this.goodsList.length) {
        _this.recommend1 = '无相关推荐内容'
        _this.recommend2 = '无相关推荐内容'
        _this.recommend3 = '无相关推荐内容'
      }
    }, 1000)
  },
  onShow () {
    wx.hideHomeButton()
  },
  onUnload () {
    this.recommend1 = '推荐链接'
    this.recommend2 = '推荐链接'
    this.recommend3 = '推荐链接'
    this.recommendId1 = ''
    this.recommendId2 = ''
    this.recommendId3 = ''
    this.keyList1 = ''
    this.keyList2 = ''
    this.keyList3 = ''
    this.goods = {
      id: '',
      images: '',
      name: '',
      category_id: '',
      category_name: '',
      description: '',
      times: '',
      size: '',
      material: '',
      rec_goods_id1: '',
      rec_goods_id2: '',
      rec_goods_id3: ''
    }
    this.goodsList = []
    this.images = []
    this.category = {}
    this.type = ''
  },
  methods: {
    getGoods (id) {
      let _this = this
      wxService.request({
        url: api.twoapi.marketGoodsShow,
        method: 'get',
        data: {'token': wx.getStorageSync('token'), 'goods_id': id},
        success: function (res) {
          if (res.code === 0) {
            _this.goods = res.data
            res.data.images.forEach(function (image) {
              _this.images.push(image.img_url)
            })
            if (res.data.rec_goods[0]) {
              _this.recommendId1 = res.data.rec_goods[0].id
              _this.recommend1 = res.data.rec_goods[0].name
            }
            if (res.data.rec_goods[1]) {
              _this.recommendId2 = res.data.rec_goods[1].id
              _this.recommend2 = res.data.rec_goods[1].name
            }
            if (res.data.rec_goods[2]) {
              _this.recommendId3 = res.data.rec_goods[2].id
              _this.recommend3 = res.data.rec_goods[2].name
            }
          }
        }
      })
    },
    getCategory () {
      let _this = this
      wxService.request({
        url: api.twoapi.goodCategory,
        method: 'get',
        success: function (res) {
          if (res.code === 0) {
            _this.category = res.data.category
          }
        }
      })
    },
    getGoodsList () {
      let _this = this
      wxService.request({
        url: api.twoapi.goodsMe,
        method: 'get',
        data: {
          'token': wx.getStorageSync('token'),
          'status': 2,
          'page': 1,
          'per_page': 999
        },
        success: function (res) {
          if (res.code === 0) {
            _this.goodsList = res.data.list
            if (_this.goodsList.length) {
              _this.goodsList = [{id: '000', name: '请选择'}].concat(_this.goodsList)
            }
          }
        }
      })
    },
    showModel (type) {
      if (type !== 'category') {
        if (!this.goodsList.length) {
          this.type = ''
          return false
        }
      }
      this.type = type
    },
    hideModel () {
      this.type = ''
    },
    onChangeCategory (event) {
      this.goods.category_name = event.mp.detail.value.name
      this.goods.category_id = event.mp.detail.value.id
      this.hideModel()
    },
    onRecommend1 (event) {
      this.recommendId1 = event.mp.detail.value.id
      this.recommend1 = event.mp.detail.value.name
      if (this.recommend1 === '请选择') {
        this.recommend1 = '推荐链接'
      }
      this.hideModel()
    },
    onRecommend2 (event) {
      this.recommendId2 = event.mp.detail.value.id
      this.recommend2 = event.mp.detail.value.name
      if (this.recommend2 === '请选择') {
        this.recommend2 = '推荐链接'
      }
      this.hideModel()
    },
    onRecommend3 (event) {
      this.recommendId3 = event.mp.detail.value.id
      this.recommend3 = event.mp.detail.value.name
      if (this.recommend3 === '请选择') {
        this.recommend3 = '推荐链接'
      }
      this.hideModel()
    },
    showToast (message) {
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    },
    bindinputName (e) {
      this.goods.name = e.mp.detail
    },
    bindinputTimes (e) {
      this.goods.times = e.mp.detail
    },
    bindinputSize (e) {
      this.goods.size = e.mp.detail
    },
    bindinputMaterial (e) {
      this.goods.material = e.mp.detail
    },
    bindinputCategory (e) {
      this.goods.category_id = e.mp.detail
    },
    bindinputDescription (e) {
      this.goods.description = e.mp.detail
    },
    bindinputRecommend1 (e) {
      this.recommend1 = e.mp.detail
    },
    bindinputRecommend2 (e) {
      this.recommend2 = e.mp.detail
    },
    bindinputRecommend3 (e) {
      this.recommend3 = e.mp.detail
    },
    submit (e) {
      let _this = this
      if (_this.category_id === '000') {
        _this.category_id = ''
        _this.showToast('请输入宝贝类别')
        return
      }
      if (_this.recommendId1 === '000') {
        _this.recommendId1 = ''
      }
      if (_this.recommendId2 === '000') {
        _this.recommendId2 = ''
      }
      if (_this.recommendId3 === '000') {
        _this.recommendId3 = ''
      }

      if (_this.images.length === 0) {
        _this.showToast('请上传宝贝图片')
        return
      }
      if (_this.goods.name === '') {
        _this.showToast('请输入宝贝名称')
        return
      }
      if (_this.goods.year === '') {
        _this.showToast('请输入宝贝年代')
        return
      }
      if (_this.goods.size === '') {
        _this.showToast('请输入宝贝尺寸')
        return
      }
      if (_this.goods.material === '') {
        _this.showToast('请输入宝贝材质')
        return
      }
      if (_this.goods.category_id === '') {
        _this.showToast('请输入宝贝类别')
        return
      }
      if (_this.goods.description === '') {
        _this.showToast('请输入宝贝说明')
        return
      }
      Dialog.confirm({
        title: '温馨提示',
        message: '是否确认提交内容',
        confirmButtonText: '确认提交',
        cancelButtonText: '取消'
      }).then(() => {
        let imager = ''
        for (let i = 0; i < _this.images.length; i++) {
          imager = imager + _this.images[i] + ','
        }
        wxService.request({
          url: api.shopapi.goodsSave,
          method: 'post',
          data: {
            'token': wx.getStorageSync('token'),
            'id': _this.goods.id,
            'images': imager,
            'name': _this.goods.name,
            'category_id': _this.goods.category_id,
            'description': _this.goods.description,
            'times': _this.goods.times,
            'size': _this.goods.size,
            'material': _this.goods.material,
            'rec_goods_id1': _this.recommendId1,
            'rec_goods_id2': _this.recommendId2,
            'rec_goods_id3': _this.recommendId3,
            'form_id': e.target.formId
          },
          success: function (res) {
            if (res.code === 0) {
              setTimeout(function () {
                wx.navigateBack({
                  url: '/pages/myCenter/pages/myShop/main'
                })
              }, 500)
            } else if (res.code === 70005) {
              _this.showToast('宝贝总数不能超过30个')
            }
          }
        })
      })
    },
    userImgclick (index) {
      let urls = []
      for (let i = 0; i < this.images.length; i++) {
        if (this.images[i] !== '') {
          urls.push(this.images[i])
        }
      }
      wx.previewImage({
        current: this.images[index],
        urls: urls
      })
    },
    transh (index) {
      this.images.splice(index, 1)
    },
    uploadImage () {
      let _this = this
      wx.chooseImage({
        count: 9 - _this.images.length,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success (res) {
          res.tempFilePaths.forEach(function (file, index) {
            if ((_this.images.length + index) < 9) {
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
                if (_this.images.length <= 9) {
                  _this.images.push(data2.data.water_path)
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
    background: #f5f5f9;
    box-sizing: border-box;
    padding-bottom: 50px;
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
        /*height: 240rpx;*/
        border-bottom: 1px solid rgba(238,238,238,1);
        margin: 0 auto;
        padding:25rpx 30rpx;
        .openshop-upload-title{
          font-size: 28rpx;
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
      }
      .openshop-intro{
        .openshop-intro-title{
          width: 100%;
          height: 86rpx;
          background: #f5f5f9;
          line-height: 86rpx;
          padding-left: 46rpx;
          font-size:28rpx;
          color:#444;
          box-sizing: border-box;
        }
        .openshop-shop{
          position: relative;
          border-bottom: 1px solid rgba(238,238,238,1);
          width:720rpx;
          margin:0 auto;
          span{
            position: absolute;
            z-index:9;
            top: 72rpx;
            left: 230rpx;
            font-size:20rpx;
            color:rgba(102,102,102,1);
          }
        }
        .openshop-input{
          width:720rpx;
          border-bottom: 1px solid rgba(238,238,238,1);
          margin: 0 auto;
        }
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
        border:1px solid #f5f5f9;
      }
    }

  }



</style>

