<template>
  <div class="online-container">
      <!--列表start-->
     <div class="online-list" v-for="(item,index) in list" :key="index">
       <img :src="item.img_url" class="online-left-img" @click="toUrl('/pages/fair/pages/marketDetailsPage/main?id='+item.id)"/>
       <div class="online-right">
          <div class="online-right-a" @click="toUrl('/pages/fair/pages/marketDetailsPage/main?id='+item.id)">
            <div class="online-right-title">{{item.name}}</div>
            <div class="online-right-id">宝贝ID: {{item.id}}</div>
            <div class="online-right-rd">热度：{{item.hot}}</div>
          </div>
          <div class="online-right-c">
            <div class="online-x-btn btn-a" v-if="item.auction_status == 0" @click="toUrl('/pages/myCenter/pages/auction/main?id='+item.id)">一键送拍</div>
            <div class="online-x-btn btn-b" v-if="item.auction_status == 1">送拍审核中</div>
            <div class="online-x-btn btn-c" v-if="item.auction_status == 2">已送拍</div>
            <div class="online-x-btn btn-a" v-if="item.auction_status == 3" @click="toUrl('/pages/myCenter/pages/auction/main?id='+item.id)">重新送拍</div>
          </div>
          <div class="online-right-b">
             <div class="online-x-btn" @click="update(index)">下架</div>
          </div>
       </div>
     </div>
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
      <!--列表end-->
      <van-dialog id="van-dialog" confirm-button-color="#D5AC7A"/>
  </div>
</template>
<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  import Dialog from '../../../../../static/vant/dialog/dialog'
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
    methods: {
      showToast (message) {
        wx.showToast({
          title: message,
          icon: 'none',
          duration: 2000
        })
      },
      toUrl (url) {
        wx.navigateTo({url: url})
      },
      getList () {
        let _this = this
        wxService.request({
          url: api.twoapi.goodsMe,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'status': 2,
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
      auction (index) {

      },
      update (index) {
        let _this = this
        Dialog.confirm({
          title: '温馨提示',
          message: '\n' +
            '请确认下架宝贝，下架后需重新审核后上架\n' +
            '同时清零商品热度值及送拍状态\n',
          confirmButtonText: '确认下架',
          cancelButtonText: '取消'
        }).then(() => {
          wxService.request({
            url: api.twoapi.goodsStatus,
            method: 'post',
            data: {
              id: _this.list[index].id,
              token: wx.getStorageSync('token')
            },
            success: function (res) {
              _this.list.splice(index, 1)
              _this.showToast('下架成功')
            }
          })
        }).catch(() => {
          // on cancel
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
          width: 50%;
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
        .online-right-c{
          width: 30%;
          .online-x-btn{
            display: flex;
            align-items: center;
            justify-content: center;
            color:#ffffff;
            font-size: 24rpx;
            width:140rpx;
            height:50rpx;
            border-radius:25rpx;
          }
          .btn-a{
            background: #0099ff;
          }
          .btn-c{
            background: #e1e1e1;
            color: #999;
          }
          .btn-b{
            background: #33cc99;
          }
        }
        .online-right-b{
          width: 20%;
          .online-x-btn{
            display: flex;
            align-items: center;
            justify-content: center;
            color:#ffffff;
            font-size: 24rpx;
            width:100rpx;
            height:50rpx;
            background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
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
