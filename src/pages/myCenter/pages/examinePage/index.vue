<template>
  <div class="examine">
    <div class="examine-p">
      <div class="examine-p-status">
        <img v-if="shop.pass_status == 0" src="../../../../assets/images/examine-xiaoxi.png">
        <div v-if="shop.pass_status == 0">审核中</div>

        <img v-if="shop.pass_status ==2" src="../../../../assets/images/examine-fail.png">
        <div v-if="shop.pass_status ==2">您未通过审核</div>
      </div>
      <div class="examine-p-con">
        <div class="examine-p-con-a" v-if="shop.pass_status == 0">
          您已提交开店申请，请耐心等待结果^_^
        </div>
        <div class="examine-p-con-b" v-if="shop.pass_status ==2">
          <p>未通过原因：</p>
          <p>{{shop.pass_fail_reason}}</p>
        </div>
      </div>
      <div class="examine-p-con-ud" v-if="shop.pass_status ==2">
        请点击下方“我的申请”修改后再次提交
      </div>
      <div class="examine-p-con-button" v-if="shop.pass_status ==2" @click="reply">
        我的申请
      </div>

    </div>
  </div>
</template>
<script>
import api from '../../../../api/api.js'
import wxService from '../../../../api/wxService.js'
export default {
  data () {
    return {
      shop: {}
    }
  },
  onLoad (option) {
    let _this = this
    wxService.request({
      url: api.twoapi.shopMe,
      method: 'get',
      data: {'token': wx.getStorageSync('token')},
      success: function (res) {
        if (res.code === 0) {
          _this.shop = res.data
        }
      }
    })
  },
  onShow () {
    wx.hideHomeButton()
  },
  methods: {
    reply () {
      wx.redirectTo({
        url: '/pages/myCenter/pages/setShopPage/main'
      })
    }
  }
}
</script>

<style lang="scss" scoped>

  .examine{
    display: flex;
    align-items: center;
    justify-content: center;
    height:100vh;
    .examine-p{

      .examine-p-status{
        text-align: center;
        img{
          width:120rpx;
          height:120rpx;
        }
        div{
          color:rgba(0,0,0,1);
          margin-top: 49rpx;
          font-size:34rpx;
          font-family:PingFang SC;
          font-weight:500;
          color:rgba(0,0,0,1);
        }
      }
      .examine-p-con{
        .examine-p-con-a{
          font-size:30rpx;
          color:rgba(136,136,136,1);
          text-align: center;
          margin-bottom: 109rpx;
          margin-top: 30rpx;
        }
        .examine-p-con-b{
          line-height: 55rpx;
          font-size:30rpx;
          color:rgba(136,136,136,1);
          margin: 0 auto;
          margin-top: 70rpx;
          width: 80%;
        }

      }
      .examine-p-con-ud{
        margin-top: 109rpx;
        text-align: center;
        font-size:30rpx;
        font-family:PingFang SC;
        font-weight:400;
        color:rgba(0,0,0,1);
      }
      .examine-p-con-button{
        width:380rpx;
        height:80rpx;
        background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
        border-radius:40rpx;
        line-height: 80rpx;
        text-align: center;
        font-size:30rpx;
        font-weight:500;
        color:rgba(255,255,255,1);
        margin: 0 auto;
        margin-top: 50rpx;
      }

    }

  }


</style>

