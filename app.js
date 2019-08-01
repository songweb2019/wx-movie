//app.js
App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      //如果有二个环境上传失败同学
      //指定云环境
      wx.cloud.init({
        env:"web-song-01-4l34p",//环境id
        traceUser: true,
      })
    }

    this.globalData = {}
  }
})
