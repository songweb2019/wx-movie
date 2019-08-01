// pages/home/home.js
Page({
  data: {
    //3:保存数据
    list: []
  },
  jumpArea:function(e){
     wx.navigateTo({
       url: '/pages/area/area',
     })
  },
  jumpComment: function (e) {
    //功能:用户点击详情按钮后跳转详情组件
    //保留并且跳转,特点允许回退
    //获取自定义属性
    var id = e.target.dataset.id;
    wx.navigateTo({
      url: '/pages/comment/comment?id=' + id,
    });
  },

  loadMore: function () {
    //console.log(123);
    //1:调用云函数movielist3
    wx.cloud.callFunction({ //调用云函数
      name: "movielist3",    //函数名
      data: {
        start: this.data.list.length,
        count: 10
      }//参数  10:00
    }).then(res => {          //调用成功
      //console.log(res)    //结果
      //问题:res.result 查询结果字符串
      //解决:将字符串转js对象
      var obj = JSON.parse(res.result);
      //保存电影列表 subjects 电影列表
      //功能:保存上一页电影列表
      //1.10:保存电影列表数据
      var rows = obj.subjects;
      //1.11:将电影列表数组拼接操作
      rows = this.data.list.concat(rows);
      //1.12:将拼接后结果保存起来
      this.setData({
        list: rows
      });
    }).catch(err => {         //调用失败
      console.log(err);   //失败原因
    })
    //2:将返回结果保存

  },
  onLoad: function (options) {
    this.loadMore();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log(123);
    //发送请求下载下一页数据
    this.loadMore();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})