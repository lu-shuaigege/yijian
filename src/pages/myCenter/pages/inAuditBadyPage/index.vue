<template>
  <div class="online-container">
      <!--列表start-->
     <div class="online-list" v-for="(item,index) in list" :key="index">
       <img :src="item.img_url" class="online-left-img" mode="scaleToFill"/>
       <div class="online-right">
          <div class="online-right-a">
            <div class="online-right-title">{{item.name}}</div>
            <div class="online-right-id">宝贝ID: {{item.id}}</div>
          </div>
          <div class="online-right-b">
             <div class="online-x-btn online-x-btn-b">审核中</div>
          </div>
       </div>
     </div>
      <!--列表end-->
    <div style="width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center"  v-if="dpIsLoading">
      <van-loading type="spinner" size="18px" />加载中...
    </div>
    <div style="" v-if="nomore">
      <van-divider contentPosition="center">没有更多数据了</van-divider>
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
        // 列表数据
        list: [],
        page: 1,
        per_page: 10,
        nomore: false,
        dpIsLoading: false
      }
    },
    components: {},
    methods: {
      getList () {
        let _this = this
        wxService.request({
          url: api.twoapi.goodsMe,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'status': 0,
            'page': _this.page,
            'per_page': _this.per_page
          },
          success: function (res) {
            if (res.code === 0) {
              _this.dpIsLoading = false
              _this.nomore = false
              // 添加数据
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
    onLoad () {
    },
    onShow () {
      wx.hideHomeButton()
      this.list = []
      this.page = 1
      this.per_page = 10
      this.nomore = false
      this.dpIsLoading = false
      this.getList()
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
  .online-container{
    .online-list{
      position: relative;
      box-sizing: border-box;
      background-color: #ffffff;
      border-top:1rpx solid #f5f5f5;
      padding:30rpx 30rpx 30rpx 220rpx;
      display: flex;
      flex-direction: row;
      .online-left-img{
        position: absolute;
        top:30rpx;
        left:30rpx;
        width:166rpx;
        height: 166rpx;
      }
      .online-right{
        width: 100%;
        min-height: 166rpx;
        display: flex;
        flex-direction: row;
        .online-right-a{
          width: 80%;
          text-align: left;
          position: relative;
          .online-right-title{
            font-size: 30rpx;
            color:#000000;
          }
          .online-right-id{
            font-size: 28rpx;
            color:#888888;
          }
          .online-right-rd{
            font-size: 28rpx;
            color:#888888;
            position: absolute;
            bottom: 0;
          }
        }
        .online-right-b{
          width: 20%;
          height: 100%;
          position: relative;
          .online-x-btn{
            position: absolute;
            top:0;
            display: flex;
            align-items: center;
            justify-content: center;
            color:#ffffff;
            font-size: 24rpx;
            width:100rpx;
            height:50rpx;
            background:rgba(136,136,136,1);
            opacity:0.5;
            border-radius:25rpx;
          }
        }
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
