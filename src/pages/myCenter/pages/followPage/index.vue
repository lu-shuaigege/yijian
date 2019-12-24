<template>
  <div class="search-container">
    <!--切换start-->
    <div class="search-menu-kj">
      <div class="search-menu-top">
        <div class="search-menu-list" :class="selectMenu ==index?'menu-select':''" v-for="(item,index) in menuArr"
             :key="index" @click="menuChange(index)">
          {{item.name}}
        </div>
      </div>
    </div>
    <!--切换end-->
    <div class="search-content-kj">
      <!--集市宝贝start-->
      <div class="js-class-kj-a" v-if="selectMenu ==0">
        <!--列表start-->
        <div class="online-list" v-for="(item,index) in list1" :key="index" @click="toDetail(item.id)">
          <img :src="item.img_url" class="online-left-img" mode="scaleToFill"/>
          <div class="online-right">
            <div class="online-right-a">
              <div class="online-right-title">{{item.name}}</div>
              <div class="online-right-id">宝贝ID: {{item.id}}</div>
              <div class="online-right-rd">热度 : {{item.hot}}</div>
            </div>
          </div>
        </div>
        <!--列表end-->
        <div style="width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center"  v-if="dpIsLoading1">
          <van-loading type="spinner" size="18px" />加载中...
        </div>
        <div style="" v-if="nomore1">
          <van-divider contentPosition="center">没有更多数据了</van-divider>
        </div>

        <div class="dian-que-kj" v-if="!list1.length">
          <img src="../../../../assets/images/wuneirong.png"/>
          <div class="dian-que-desc">无相关内容</div>
        </div>
      </div>
      <!--集市宝贝end-->
      <!--集市店铺start-->
      <div class="js-class-kj-b" v-if="selectMenu ==1">
        <div class="js-class-list" v-for="(item,index) in list2" :key="index" @click="shopEdit(item.id)">
          <div class="xq-r-kj">
            <img v-if="item.icon" :src="item.icon"  class="xq-r-tou"/>
            <img v-if="!item.icon" :src="icon"  class="xq-r-tou"/>
            <div class="xq-r-address">{{item.name}}</div>
            <div class="xq-like-icon">
              <div class="cq-like-div" @click.stop="deletes(index)">
                <img src="../../../../assets/images/zan_b_icon.png" class="xq-like-xh"/>
                <div class="xq-like-num">{{item.follow_num}}</div>
              </div>
            </div>
          </div>
          <div class="xq-r-content">
            <div class="xq-recomm-item">
              <div class="xq-recomm-list" v-for="(items,indexs) in item.hot_goods" :key="indexs">
                <img :src="items.img_url"/>
                <div class="xq-recomm-name">{{items.name}}</div>
              </div>
            </div>
          </div>
        </div>
        <div style="width: 100%;font-size:14px;color:#888888;display: flex;justify-content: center"  v-if="dpIsLoading2">
          <van-loading type="spinner" size="18px" />加载中...
        </div>
        <div style="" v-if="nomore2">
          <van-divider contentPosition="center">没有更多数据了</van-divider>
        </div>
        <div class="dian-que-kj" v-if="!list2.length">
          <img src="../../../../assets/images/wuneirong.png"/>
          <div class="dian-que-desc">无相关内容</div>
        </div>
      </div>
      <van-dialog id="van-dialog" confirm-button-color="#D5AC7A"/>
      <!--集市店铺end-->
    </div>
    <!--无相关内容start-->

    <!--无相关内容end-->
  </div>
</template>

<script>
  import api from '../../../../api/api'
  import wxService from '../../../../api/wxService'
  import Dialog from '../../../../../static/vant/dialog/dialog'
  export default {
    data () {
      return {
        icon: '/static/images/defaultphoto.jpeg',
        // 菜单
        menuArr: [
          {name: '集市宝贝'},
          {name: '集市店铺'}
        ],
        value: '',
        selectMenu: 0,
        // 列表数据
        list1: [],
        page1: 1,
        per_page1: 10,
        nomore1: false,
        dpIsLoading1: false,
        list2: [],
        page2: 1,
        per_page2: 10,
        nomore2: false,
        dpIsLoading2: false
      }
    },
    components: {},
    onUnload () {
      this.selectMenu = 0
    },
    methods: {
      // 宝贝-查看详情
      toDetail (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/marketDetailsPage/main?id=' + id
        })
      },
      // 查看店铺详情
      shopEdit (id) {
        wx.navigateTo({
          url: '/pages/fair/pages/dianpuDetailPage/main?id=' + id
        })
      },
      menuChange (index) {
        this.selectMenu = index
      },
      getList1 () {
        let _this = this
        wxService.request({
          url: api.twoapi.favorite,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'type': 0,
            'page': _this.page1,
            'per_page': _this.per_page1
          },
          success: function (res) {
            if (res.code === 0) {
              _this.dpIsLoading1 = false
              _this.nomore1 = false
              _this.list1 = _this.list1.concat(res.data.list)
              if (!res.data.list.length && _this.list1.length) {
                _this.nomore1 = true
              }
            }
          }
        })
      },
      getList2 () {
        let _this = this
        wxService.request({
          url: api.twoapi.favorite,
          method: 'get',
          data: {
            'token': wx.getStorageSync('token'),
            'type': 1,
            'page': _this.page2,
            'per_page': _this.per_page2
          },
          success: function (res) {
            if (res.code === 0) {
              _this.dpIsLoading2 = false
              // 分页
              _this.nomore2 = false
              _this.list2 = _this.list2.concat(res.data.list)
              if (!res.data.list.length && _this.list2.length) {
                _this.nomore2 = true
              }
            }
          }
        })
      },
      deletes (index) {
        let _this = this
        Dialog.confirm({
          message: '\n' +
            '确认取消关注宝贝',
          confirmButtonText: '确认',
          cancelButtonText: '取消'
        }).then(() => {
          wxService.request({
            url: api.twoapi.shopBadyLike,
            method: 'post',
            data: {
              type: 1,
              type_id: _this.list2[index].id,
              act: 2,
              token: wx.getStorageSync('token')
            },
            success: function (res) {
              _this.list2.splice(index, 1)
            }
          })
        }).catch(() => {
          // on cancel
        })
      },
      loadMore () {
        let _this = this
        if (_this.selectMenu === 1) {
          if (!_this.nomore2) {
            _this.page2++
            _this.dpIsLoading2 = true
            setTimeout(function () { _this.getList2() }, 500)
          }
        } else {
          if (!_this.nomore1) {
            _this.page1++
            _this.dpIsLoading1 = true
            setTimeout(function () { _this.getList1() }, 500)
          }
        }
      }
    },
    onLoad () {
    },
    onShow () {
      wx.hideHomeButton()
      this.nomore = false
      this.page1 = 1
      this.page2 = 1
      this.list1 = []
      this.list2 = []
      this.getList1()
      this.getList2()
    },
    onReachBottom () {
      this.loadMore()
    }
  }
</script>
<style>
  page{
    background-color: #F5F5F9;
    padding-bottom: 50rpx;
  }
  .search-input .van-search{
    background-color: #F5F5F9 !important;
  }
</style>
<style lang="scss" scoped>
  .search-container {
    .search-menu-kj {
      position: fixed;
      top:0;
      left:0;
      width: 100%;
      z-index: 3;
      background-color: #ffffff;
      .search-menu-top {
        display: flex;
        align-items: center;
        flex-direction: row;
        border-bottom: 2rpx solid #EEEEEE;
        .search-menu-list {
          position: relative;
          width:50%;
          height: 92rpx;
          color: #000000;
          font-size: 30rpx;
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .menu-select:after {
          content: "";
          position: absolute;
          bottom: 8rpx;
          width: 50rpx;
          height: 8rpx;
          background: linear-gradient(90deg, rgba(241, 208, 165, 1), rgba(213, 171, 121, 1));
          border-radius: 4rpx;
          left:50%;
          transform: translate(-50%);
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
    .search-content-kj {
      margin-top: 110rpx;
      .js-class-kj-a{
        .online-list{
          position: relative;
          box-sizing: border-box;
          background-color: #ffffff;
          border-bottom:1rpx solid #f5f5f5;
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
                width:100rpx;
                height:50rpx;
                background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
                border-radius:25rpx;
              }
            }
          }
        }
      }
      .js-class-kj-b{
        .js-class-b-change{
          display: flex;
          align-items: center;
          padding: 10rpx 30rpx 10rpx 70%;
          .js-class-b-w{
            width: 50%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            height: 60rpx;
            color:#1A1A1A;
            font-size: 28rpx;
          }
        }
        .js-class-list{
          padding: 30rpx;
          background-color: #ffffff;
          margin-bottom: 20rpx;
          /*box-sizing: border-box;*/
          .xq-r-kj{
            box-sizing: border-box;
            width:100%;
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            .xq-r-tou{
              position: absolute;
              left: 0;
              top: 0;
              width: 100rpx;
              height: 100rpx;
              border-radius: 50%;
            }
            .xq-r-address{
              width: 80%;
              color: #000000;
              font-size: 30rpx;
              height: 100rpx;
              line-height: 100rpx;
              overflow: hidden;
              text-overflow:ellipsis;
              white-space: nowrap;
              font-family: PingFangSC-Medium;
              margin-left: 120rpx;
            }
            .xq-like-icon{
              width: 20%;
              height: 100rpx;
              display: flex;
              align-items: flex-end;
              justify-content: flex-end;
              flex-direction: column;
              flex-wrap: wrap;
              position: relative;
              .cq-like-div{
                position: absolute;
                top: 10rpx;
                .xq-like-num{
                  text-align: center;
                  font-size: 20rpx;
                  color:#000000;
                }
                .xq-like-xh{
                  width: 44rpx;
                  height: 42rpx;
                }
              }
            }
          }
          .xq-r-content{
            .xq-recomm-item{
              display: flex;
              flex-direction: row;
              margin-top: 30rpx;
              .xq-recomm-list{
                width: 32%;
                display: flex;
                flex-direction: column;
                margin-right: 2%;
                img{
                  width: 100%;
                  height: 163rpx;
                }
                .xq-recomm-name{
                  font-size: 24rpx;
                  color:#000000;
                  text-align: left;
                  border:1rpx solid #DCDCDC;
                  border-top:none;
                  padding: 10rpx;
                  overflow: hidden;
                  text-overflow:ellipsis;
                  white-space: nowrap;
                  box-sizing: border-box;
                  width: 100%;
                }
              }
              .xq-recomm-list:nth-last-child(1){
                margin-right: 0;
              }
            }
          }
        }
      }
      .search-item-c {
        .search-item-c-list {
          width: 100%;
          padding: 30rpx;
          box-sizing: border-box;
          background-color: #ffffff;
          margin-bottom: 20rpx;
          .search-item-c-img {
            height: 386rpx;
            img {
              width: 100%;
              height: 100%
            }
          }
          .search-title-kj {
            display: flex;
            align-items: center;
            padding-top: 30rpx;
            .search-title-left {
              width: 75%;
              height: 80rpx;
              font-size: 32rpx;
              color: #000000;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              line-clamp: 2;
              -webkit-box-orient: vertical;
            }
            .search-title-right {
              width: 25%;
              height: 80rpx;
              font-size: 38rpx;
              color: #F50002;
              text-align: right;
              .search-fh {
                font-size: 24rpx;
              }
            }
          }
          .search-desc {
            text-align: left;
            color: #666666;
            font-size: 24rpx;
            padding-top: 24rpx;
          }
        }
      }
    }
  }
</style>
