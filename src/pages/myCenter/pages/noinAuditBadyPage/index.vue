<template>
  <div class="online-container">
      <!--列表start-->
     <div class="online-list" v-for="(item,index) in list" :key="index">
       <div class="online-close-btn" @click="deletes(index)">
         <img src="../../../../assets/images/closegood_icon.png"/>
       </div>
       <img :src="item.img_url" class="online-left-img" mode="scaleToFill" @click="toUrl('/pages/myCenter/pages/detailsBadyPage/main?id='+item.id)"/>
       <div class="online-right">
          <div class="online-right-a" @click="toUrl('/pages/myCenter/pages/detailsBadyPage/main?id='+item.id)">
            <div class="online-right-title">{{item.name}}</div>
            <div class="online-right-id">宝贝ID: {{item.id}}</div>
            <div class="online-right-rd">热度：{{item.hot}}</div>
          </div>
          <div class="online-right-b">
             <div class="online-x-edit" @click="toUrl('/pages/myCenter/pages/uploaddoodsPage/main?id='+item.id)">
               <img src="../../../../assets/images/bady_edit_icon.png" mode="scaleToFill"/>
             </div>
             <div class="online-x-btn" @click="view(item.pass_fail_reason)">查看原因</div>
          </div>
       </div>
     </div>
      <!--列表end-->
      <van-dialog id="van-dialog" confirm-button-color="#D5AC7A"/>
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
  import Dialog from '../../../../../static/vant/dialog/dialog'
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
            'status': 4,
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
      deletes (index) {
        let _this = this
        Dialog.confirm({
          message: '\n' +
            '请确认删除宝贝',
          confirmButtonText: '确认删除',
          cancelButtonText: '取消'
        }).then(() => {
          wxService.request({
            url: api.twoapi.goodsDelete,
            method: 'post',
            data: {
              id: _this.list[index].id,
              token: wx.getStorageSync('token')
            },
            success: function (res) {
              _this.list.splice(index, 1)
              _this.showToast('删除成功')
            }
          })
        }).catch(() => {
          // on cancel
        })
      },
      // 发布
      view (msg) {
        Dialog.confirm({
          title: '温馨提示',
          message: '\n' + msg,
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          // on confirm
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
      .online-close-btn{
        width:52rpx;
        height:52rpx;
        position: absolute;
        left:30rpx;
        top:30rpx;
        z-index: 3;
        img{
          width: 100%;height: 100%;
        }
      }
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
          width: 72%;
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
          width: 28%;
          height: 100%;
          position: relative;
          .online-x-edit{
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            left:50%;
            transform: translate(-50%);
            top:0;
            img{
              width: 100%;
              height: 100%;
            }
          }
          .online-x-btn{
            position: absolute;
            bottom:0;
            display: flex;
            align-items: center;
            justify-content: center;
            color:#ffffff;
            font-size: 24rpx;
            width:100%;
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
