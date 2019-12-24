let store = {
  // 米仓抽奖测试用
  // appid: 'wxe3e273bafe19b9c2',
  // 正式使用
  appid: 'wx7d3f418198d60dd7',
  // 来源 4米仓测试小程序
  // source: 4,
  // 来源 正式使用的测试环境
  source: 9,
  // 下面是一些用户登录等的判断
  // 判断main.js的内容是否走完
  flag: false,
  // 判断是去引导页还是首页
  goGuide: false,
  // 判断用户状态 1需授权 2需手机 0已授权已手机
  state: 1,
  // 对比当前版本与最新版本，0当前版本(ep:1.0.0)，1小版本更新(ep:1.0.1)，2大版本更新(ep:1.1.0,2.1.0)
  versionFlag: 0,
  // onLaunch在onLoad里的回调
  callback: undefined,
  // 给菜单授权逻辑判断的callback回调
  authorizeCallback: undefined,
  // 静态图片的路由地址
  imgUrl: 'https://yijianapi.csztv.com',
  // 测试
  // imgUrl: 'https://interact1.csztv.com',
  // 埋点用app_id
  app_id: '1009'
}
export default store
