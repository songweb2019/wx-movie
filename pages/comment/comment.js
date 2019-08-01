// pages/comment/comment.js
//6.1：初始化数据库
const db = wx.cloud.database({
  env:"web-song-01-4l34p"
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value:"",   //输入框中用户输入内容
    score:5,    //打分默认 5分（默认）
    movieid:0,  //保存电影id
    datail:{},  //组件创建成功调用
    images:[],  //保存选中图片
    fileIDS:[]  //上传成功保存fileID
  },

  mysubmit:function(){
    //console.log(123);
    //功能1：将选中图片上传云存储中
    //功能2：将云存储中fileID一次性存储云数据库中
    // 1：在data添加属性fileIDS:[]
    // 2：显示加载动画提示框 "正在提交中"
    wx.showLoading({
      title: '正在提交中...',
    })
    // 3：上传到云存储
    // 3.1：创建 promise 数组[保存promise对象]
    var promiseArr = [];
    // 3.2：创建一个循环遍历选中图片
    for(var i=0;i<this.data.images.length;i++){
      // 3.3：创建promise对象
      //peomise负责完成上传一张图片任务，并且将图片 fileID保存数组中
       promiseArr.push(new Promise((resolve,reject)=>{
        // 3.3.1：获取当前图片
        var item = this.data.images[i];
        // 3.3.2：创建正则表达式折分文件后缀名 .jpg .png .gif
        var suffix= /\.\w+$/.exec(item)[0];
        // 3.3.3：上传图片并且将dileID保存到数组
        // 3.3.4：为图片创建新文件名
        var newFile = new Date().getTime()+Math.floor(Math.random()*9999)+suffix;
        wx.cloud.uploadFile({
          cloudPath:newFile,
          filePath:item,
          success:res=>{  //上传成功
            // 3.3.5：上传成功拼接fileID
            var fid = res.fileID;
            var ids = this.data.fileIDS.concat(fid);
            this.setData({ fileIDS: ids })
            // 3.3.6：将当前promise追加任务列表中
            resolve();
            // 3.3.7：上传失败输出错误消息
          },
          fail:err=>{  //上传失败
            console.log(err);
          }
        })
      }));//promise end
    }//for end  

    //功能2:将云存储中fileID一次性存储云数据库集中
    //4:在云数据库中添加集合 comment
    //  此集合用于保存评论内容与文件id
    //5:等待数组中所有Promise任务执行结束
    Promise.all(promiseArr).then(res=>{
      //6:回调函数中
      //6.1:在程序最顶端初始数据库
      //7:将评论内容 分数 电影id 上传图片所有id
      //  添加集合中
      db.collection("comment")  //指定集合
      .add({  //添加记录
        data:{  //数据
          content:this.data.value,   //评论的内容
          score:this.data.score,     //评论的分数
          movieid:this.data.movieid,   //电影的id
          fileIds:this.data.fileIDS    //图片fileID
        }
      })
      .then(res=>{
        //8:隐藏加载提示框    
        wx.hideLoading();
        //9:显示提示框 "发表成功 
        wx.showToast({title:"发表成功"})
      })
      .catch(err=>{
        //10:添加集合失败 
        //11:隐藏加载提示框
        wx.hideLoading();
        //12:显示提示框"评论失败"
        wx.showToast({ title: "发表失败"})
      })

    })
  },

  //选择上传图片
  selectImgs:function(){
    //功能：请用户选中图片 最多九张 并且保存在data中
    //1：在data添加数组属性 images
    wx.chooseImage({
      count:9,
      sizeType:["original","compressed"],
      sourceType:["album","camera"],
      success:(res)=>{ 
        var files  =res.tempFilePaths;
        //2：调用wx.chooseImage 选中图片
        //3：将选中的图片保存 images 中
        this.setData({
          images:files
        })
      },
    })
  },

  loadMore(){
    //功能：发送请求获取云函数返回数据
    // console.log(123);
    //1：接收电影列表传递参数id
    var id = this.data.movieid;
    //console.log(id);
    //2：显示数据加载显示框
    wx.showLoading({
      title:'加载中...',
    })
    //3：调用云函数
    wx.cloud.callFunction({
      name:"getDetail3", //云函数名字
      data:{id:id}
    }).then(res=>{
      //console.log(res);
      //4：获取云函数返回结果
        //4.1：将云函数返回字符串转js对象
        var obj = JSON.parse(res.result);
        //console.log(obj);
        //4.2：js对象保存detail
        this.setData({
          detail:obj
        })
        //4.3：隐藏加载提示框
        wx.hideLoading();  
    }).catch(err=>{
      console.log(err);
    })
  },

  onScoreChange: function (e) {
    //用户打分对应事件处理函数
    //1.获取用户现在输入分数
    console.log(e.detail);
    //2.将用户输入新分数赋值操作
    this.setData({
      score: e.detail
    })
  },

  onContentChange:function(e){ //e事件对象
    //输入框事件对象
    //用户输入内容
    //console.log(e.detail);
    this.setData({
      value:e.detail //保存用户评论内容
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options);
    this.setData({
      movieid: options.id
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})