<template>
  <div class="shop-container">
      <div class="shop-status-a">您的店铺涉及违纪，请耐心等待工作人员联系</div>
  </div>
</template>

<script>
  export default {
    data () {
      return {

      }
    },
    components: {},
    onShow () {
      wx.hideHomeButton()
    },
    methods: {

    }
  }
</script>
<style lang="scss" scoped>
  .shop-container{
    display: flex;
    align-items: center;
    justify-content: center;
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
  }
</style>
