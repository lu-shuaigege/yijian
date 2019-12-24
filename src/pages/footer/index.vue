<template>
    <div class="footer-kj" id="footer" :style="{height:footerHeight + 'rpx'}">
      <ul class="footer-ul">
        <li v-for="(item,index) in footerArr" :key="index" @click="footerChange(index)">
          <button v-if="authorizeUser[item.id]" open-type="getUserInfo" @getuserinfo="bindGetUserInfo">
            <div class="footer-icon">
              <img :src="item.iconPath" v-if="selectMenu !== index"/>
              <img :src="item.selectedIconPath" v-if="selectMenu === index"/>
            </div>
            <div class="footer-name" :class="selectMenu === index?'selectcol':''">{{item.name}}</div>
          </button>
          <button v-if="!authorizeUser[item.id]" @click="toUrl(index)">
            <div class="footer-icon">
              <img :src="item.iconPath" v-if="selectMenu !== index"/>
              <img :src="item.selectedIconPath" v-if="selectMenu === index"/>
            </div>
            <div class="footer-name" :class="selectMenu === index?'selectcol':''">{{item.name}}</div>
          </button>
        </li>
      </ul>
    </div>
</template>

<script>
import api from '../../api/api.js'
import wxService from '../../api/wxService.js'
import store from '../../utils/store'
import global from '../../utils/global'
export default {
  data () {
    return {
      footerHeight: 0,
      authorizeUser: wx.getStorageSync('authorizeUser'),
      index: -1,
      statussss: true,
      footerArr: [
        {'id': 'home', 'name': '首页', 'iconPath': '/static/images/homea.png', 'selectedIconPath': '/static/images/homeb.png', 'pagePath': '/pages/homePage/main'},
        {'id': 'shop', 'name': '集市', 'iconPath': '/static/images/jishi.png', 'selectedIconPath': '/static/images/jishi-b.png', 'pagePath': '/pages/fair/pages/marketPage/main'},
        {'id': 'evaluate', 'name': '鉴定', 'iconPath': '/static/images/jianding.png', 'selectedIconPath': '/static/images/jianding-b.png', 'pagePath': '/pages/home/main'},
        {'id': 'eye', 'name': '开眼', 'iconPath': '/static/images/kaiyan.png', 'selectedIconPath': '/static/images/kaiyan-b.png', 'pagePath': '/pages/course/coursePage/main'},
        {'id': 'me', 'name': '我的', 'iconPath': '/static/images/wode.png', 'selectedIconPath': '/static/images/wode-b.png', 'pagePath': '/pages/center/main'}
      ],
      selectMenu: this.changeVallist,
      store: store
    }
  },
  props: {
    changeVallist: {
      type: String
    }
  },
  onUnload () {
    let _this = this
    _this.index = -1
    _this.statussss = true
  },
  components: {},
  onShow () {
    wx.hideHomeButton()
  },
  onLoad () {
    let _this = this
    _this.judgeBigScreen()
    let query = wx.createSelectorQuery()
    _this.authorizeUser = wx.getStorageSync('authorizeUser')
    query.select('#footer').boundingClientRect()
    query.exec(function (res) {
      _this.$emit('footerHeight', res[0].height)
    })
  },
  methods: {
    // 判断是否是全面屏
    judgeBigScreen () {
      let result = false
      let res = wx.getSystemInfoSync()
      let rate = res.windowHeight / res.windowWidth
      let limit = res.windowHeight === res.screenHeight ? 1.8 : 1.65
      if (rate > limit) {
        result = true
      }
      if (result) {
        this.footerHeight = 100
      } else {
        this.footerHeight = 80
      }
    },
    bindGetUserInfo (e) {
      let _this = this
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
              _this.authorizeUser = {}
              wx.setStorageSync('authorizeUser', _this.authorizeUser)
              if (_this.authorizeUser[_this.footerArr[_this.index].id] !== '2') {
                _this.authorizeUser[_this.footerArr[_this.index].id] = 0
                delete _this.authorizeUser[_this.footerArr[_this.index].id]
                wx.setStorageSync('authorizeUser', _this.authorizeUser)
                _this.toUrl(_this.index)
              }
            }
          }
        })
      } else {
        if (_this.authorizeUser[_this.footerArr[_this.index].id] !== '2') {
          _this.authorizeUser[_this.footerArr[_this.index].id] = 0
          delete _this.authorizeUser[_this.footerArr[_this.index].id]
          wx.setStorageSync('authorizeUser', _this.authorizeUser)
          _this.toUrl(_this.index)
        }
      }
    },
    toUrl (index) {
      if (this.selectMenu !== index) {
        wx.reLaunch({url: this.footerArr[index].pagePath})
      }
    },
    footerChange (index) {
      this.index = index
    },
    changeFooter (val) {
      this.selectMenu = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer-kj{
    position: fixed;
    bottom:0;
    width: 100%;
    height:100rpx;
    padding-top: 10rpx;
    padding-bottom: 20rpx;
    /*height: 80rpx;*/
    /*padding:10rpx 0 40rpx 0;*/
    background:rgba(255,255,255,1);
    .footer-ul{
      display: flex;
      align-items: center;
      list-style: none;
      li{
        width: 25%;
        display: flex;
        align-items: center;
        flex-direction: column;
        flex-wrap: wrap;
        .footer-icon{
          width:45rpx;
          height:48rpx;
          img{width: 100%;height: 100%;display: block}
        }
        .footer-name{
          font-size: 22rpx;
          color:#000000;
        }
        .selectcol{
          color:#AB8A59;
        }
        button{
          border: none;
          outline-style: none;
          background-color: #fff;
          outline:none;
          margin: 0;
          display: flex;
          align-items: center;
          flex-direction: column;
        }
        button::after {
          border: none;
        }
      }
    }
  }
</style>
