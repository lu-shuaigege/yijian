<template>
  <div class="message-container">
      <div class="message-item-list" v-for="(item,index) in list" :key="index">
        <div class="message-title">{{item.date}}</div>
        <div v-for="(items,indexs) in item.list" :key="indexs">
          <van-cell :title="items.content" v-if="items.url" is-link @click="toUrl(items.url)"  />
          <van-cell :title="items.content" v-if="!items.url" />
        </div>
      </div>
      <div style="width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center"  v-if="dpIsLoading">
        <van-loading type="spinner" size="18px" />加载中...
      </div>
      <div style="padding: 0 30rpx;" v-if="nomore">
        <van-divider contentPosition="center">这是我的底线</van-divider>
      </div>
    <div class="dian-que-kj" v-if="!list.length">
      <img src="../../../../assets/images/wuneirong.png"/>
      <div class="dian-que-desc">无相关内容</div>
    </div>
  </div>
</template>
<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  export default {
    data () {
      return {
        list: [],
        page: 1,
        per_page: 10,
        nomore: false,
        dpIsLoading: false
      }
    },
    components: {},
    onLoad () {
      this.list = []
      this.page = 1
      this.per_page = 10
      this.nomore = false
      this.dpIsLoading = false
      this.getList()
    },
    onShow () {
      wx.hideHomeButton()
    },
    methods: {
      toUrl (url) {
        wx.navigateTo({url: url})
      },
      getList () {
        let _this = this
        wxService.request({
          url: api.twoapi.message,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'page': _this.page,
            'per_page': _this.per_page
          },
          success: function (res) {
            if (res.code === 0) {
              _this.dpIsLoading = false
              _this.nomore = false
              _this.list = _this.list.concat(res.data.list)
              // 分页
              if (!res.data.list.length && _this.list.length) {
                _this.nomore = true
              }
            }
          }
        })
      },
      loadMore () {
        let _this = this
        if (!_this.nomore) {
          _this.page++
          _this.dpIsLoading = true
          setTimeout(function () { _this.getList() }, 500)
        }
      }
    },
    onReachBottom () {
      this.loadMore()
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
  }
</style>
<style lang="scss" scoped>
.message-container{
  .message-item-list{

    .message-title{
      height: 80rpx;
      line-height: 80rpx;
      text-align: left;
      font-size: 28rpx;
      padding: 0 30rpx;
    }
  }
  .dian-que-kj{
    width:200rpx;
    position: fixed;
    top:50%;
    left:50%;
    transform: translate(-50%,-50%);
    background-color: #F5F5F9;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    img{
      width:175rpx;
      height:100rpx;
    }
    .dian-que-desc{
      width: 100%;
      margin-top: 30rpx;
      font-size: 32rpx;
      color:#ACACAC;
      text-align: center;
      font-family: PingFangSC-Regular;
    }
  }
}
</style>
