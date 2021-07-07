// pages/ad-navigate-19/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    singlePageMode: false, // 单页模式
    suffix: "", // 个人后缀
    background: "http://iph.href.lu/750x1700?text=加载中", // 背景图片
    buttonColor: "", // 按钮颜色
    buttonContentColor: "", // 按钮内容颜色
    buttonContent: "", // 按钮内容
    room: "" // 房间号
  },

  /**
   * 跳转
   */
  navigate() {
    wx.navigateToMiniProgram({
      appId: 'wxca86930ec3e80717',
      path: 'page/course/details?id=' + this.data.room
    })
  },

  /**
   * 生命周期函数--监听页面加载
   * options.scene = "2020111301*cBlzJ8"
   */
  onLoad: function (options) {
    options.scene = "2020111301*cBlzJ8"
    if (typeof options.scene === "undefined") {
      getApp().methods.handleError({ err: options, title: "出错啦", content: '缺少参数, 即将返回首页', reLaunch: true })
      return
    }

    // 获取后缀
    if (typeof options.scene !== "undefined" && options.scene.split("*").length > 1) {
      this.setData({
        suffix: options.scene.split("*")[1]
      })
    }

    // 判断 ID 是否可以转换为数字
    if (isNaN(Number(options.scene.split("*")[0]))) {
      getApp().methods.handleError({ err: options.scene, title: "出错啦", content: '配置 ID 不正确, 即将返回首页', reLaunch: true })
      return
    }

    // 弹出 Loading
    wx.showLoading({ title: '加载中...', mask: true })

    // 获取配置 
    wx.cloud.database().collection('adNavigate19').where({ id: Number(options.scene.split("*")[0]) }).get({
      success: res => {
        wx.hideLoading() // 隐藏 loading
        if (res.data.length !== 1) {
          getApp().methods.handleError({ err: res, title: "出错啦", content: '配置不正确, 即将返回首页', reLaunch: true })
        } else {
          // 保存广告配置
          this.setData({
            background: res.data[0].background,
            buttonColor: res.data[0].button.color,
            buttonContentColor: res.data[0].button.contentColor,
            buttonContent: res.data[0].button.content,
            room: res.data[0].Room
          })
        }
      },
      fail: err => {
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置失败', reLaunch: true })
      }
    })

    // 判断是否是单页模式
    if (wx.getLaunchOptionsSync().scene === 1154) {
      this.setData({
        singlePageMode: true
      })
    }
  },
  /**
   * 监听页面滚动
   * 用于 显示 header / 隐藏 header
   */
  onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '出公告啦',
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '考试公告发布啦，快来看一看!'
    }
  }
})