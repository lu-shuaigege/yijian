<template>
    <div v-if="show">
      <div class="back" @click="backIndex">
        <img src="../../assets/images/backhome-icon.png" alt="">
      </div>
    </div>
</template>

<script>
    export default {
      data () {
        return {
          show: false
        }
      },
      onLoad (option) {
        this.show = false
      },
      onShow () {
        this.show = false
        let pagesLength = getCurrentPages().length
        if (pagesLength === 1) {
          this.show = true
        }
      },
      onUnload () {
        this.show = false
      },
      methods: {
        backIndex () {
          wx.redirectTo({
            url: '/pages/homePage/main'
          })
        }
      }
    }
</script>

<style lang="scss" scoped>
.back{
  position: fixed;
  right: 34rpx;
  bottom: 10%;
  width: 80rpx;
  height: 80rpx;
  font-size: 30rpx;
  border-radius: 50%;
  box-sizing: border-box;
  padding: 20rpx;
  background-color: #fff;
  box-shadow: 0 0 20rpx rgba(0, 0, 0, 0.1);
  z-index: 10;
  img{
    width: 100%;
    height: 100%;
  }
}
</style>
