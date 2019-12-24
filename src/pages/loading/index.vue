<template>
  <div class="loading_container">
    <!--普通loading-->
    <!-- <img mode="aspectFit" src="../../assets/images/loading.gif" /> -->
    <!-- 广告位loading -->
    <img @click="judgeEverything" :src="imgUrl" />
  </div>
</template>

<script>
import store from '../../utils/store'
// import { llog } from '../../utils/log'
import global from '../../utils/global'
import api from '../../api/api'
import wxService from '../../api/wxService'
export default {
  data () {
    let img = store.imgUrl + '/image/ad.png'
    // let img = 'https://yijian.test.csztv.com/image/ad.png'
    return {
      // 为了埋点
      from: '',
      openid: '',
      imgUrl: img
    }
  },
  methods: {
    judgeEverything () {
      console.log('goGuide', store.goGuide, 'state', store.state, 'versionFlag', store.versionFlag)
      if (store.goGuide || store.versionFlag === 2) {
        // 去往引导页的肯定都没有Openid，所以为了埋点去调用userquery接口特地传个openid
        global.buriendPointQuery(this.from, '', this.openid)
        wx.redirectTo({
          url: '../index/main'
        })
      } else {
        // 埋点
        // llog({ action_from: '外部', action_to: 'loading页', action_type: '进入', action_status: 1, enter_mode_param: this.from, action_p3: this.openid })
        wx.redirectTo({
          url: '../homePage/main'
        })
      }
    },
    /** call api */
    getAd () {
      // let vm = this
      wxService.request({
        url: api.default.ad,
        method: 'get',
        success: function (res) {
          if (res.code === 0) {
            console.log(res)
          }
        }
      })
    },
    // 为了埋点
    getOpenid (userid) {
      let vm = this
      wxService.request({
        url: api.default.userToOpenid,
        method: 'post',
        data: {
          uid: userid,
          token: wx.getStorageSync('token')
        },
        success: function (res) {
          console.log(res)
          if (res.code === 0) {
            vm.openid = res.data.data.open_id
          }
        }
      })
    }
  },
  onLoad (option) {
    let vm = this
    // 广告位增加的函数
    // vm.getAd()
    // 埋点加的需求开始
    if (option.from === '1') {
      this.from = option.from
      this.openid = option.openid
    } else if (option.scene) {
      let from = decodeURIComponent(option.scene)
      if (from.indexOf('user_id') !== -1) {
        this.from = from.substring(5, 6)
        vm.getOpenid(from.substring(15, from.length))
      } else {
        this.from = from.substring(5, from.length)
      }
    } else {
      this.from = '0'
    }
    // 埋点加的需求结束，广告位loading的时候下面舍去
    // if (store.flag) {
    //   vm.judgeEverything()
    // } else {
    //   store.callback = function () {
    //     console.log('callback')
    //     vm.judgeEverything()
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.loading_container{
  height:100vh;
  img{
    height:100vh;
    // margin-top:20vh;
    width:100%;
    vertical-align: bottom;
  }
}
</style>