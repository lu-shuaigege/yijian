<template>
  <div class="shop-container">
      <div class="shop-status-a">请您调整您的店铺重新提交店铺审核</div>
     <div class="shop-status-tj" @click="goOpenShop">重新提交开店申请</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    components: {},
    methods: {
      goOpenShop () {
        wx.redirectTo({
          url: '/pages/myCenter/pages/setShopPage/main'
        })
      }
    },
    onShow () {
      wx.hideHomeButton()
    }
  }
</script>
<style lang="scss" scoped>
  .shop-container{
    .shop-status-a{
      position: absolute;
      left:50%;
      top:50%;
      transform: translate(-50%,-50%);
      width: 80%;
      height: 50rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      color:#888888;
      font-size: 30rpx;
    }
    .shop-status-tj{
      position: absolute;
      top:60%;
      left:50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size:30rpx;
      color:#ffffff;
      transform: translate(-50%,50%);
      width:380rpx;
      height:80rpx;
      background:linear-gradient(90deg,rgba(241,208,165,1),rgba(213,171,121,1));
      border-radius:40rpx;
    }
  }
</style>
