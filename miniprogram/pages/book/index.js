// pages/book/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suffix: "", // 后缀
    bookID: -1, // 白皮书配置 ID ( 哈士齐营销平台内部 ID )
    configs: {}, // 配置信息
    phone: "", // 用户手机号
    tipsToSubscribeMessaged: false, // 是已经否提示订阅考试信息
  },

  // 浏览
  view: function (e) {
    if (!e.currentTarget.dataset.link) {
      wx.showToast({ title: '配置有误', icon: "none" })
      return
    }
    if (!this.data.phone && this.data.configs.CRMEventFormSID.length === 32 ) {
      wx.showToast({ title: '请您先点击上方按钮进行注册', icon: "none" })
      return
    }
    if (!this.data.tipsToSubscribeMessaged && this.data.configs.Subscribe.length > 0) {
      wx.showToast({ title: '请您先点击上方按钮进行登陆', icon: "none" })
      return
    }
    wx.showLoading({ title: '下载中...', mask: true })
    wx.downloadFile({
      url: e.currentTarget.dataset.link,
      success: res => {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
        wx.hideLoading() // 隐藏 loading
      },
      fail: res => {
        getApp().methods.handleError({
          err: res,
          title: "出错啦",
          content: "打开失败, 请您稍后再试"
        })
        wx.hideLoading() // 隐藏 loading
      }
    })
  },

  // 登陆
  login: function (e) {
    getApp().methods.register(e, this.data.suffix, this.data.configs.CRMEventFormSID, "活动编码: " + this.data.configs.CRMEventID + ", 活动表单 ID: " + this.data.configs.CRMEventFormID, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您点击“点击登陆”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // 订阅消息
  subscribe: function (e) {
    let _this = this
    _this.setData({ tipsToSubscribeMessaged: true })
    wx.showModal({
      title: '提示',
      content: '您是否需要订阅 ' + this.data.configs.Subscribe.join("、") + ' 考试公告？订阅成功后您可以在公告发布时免费获得推送提示～',
      confirmText: "免费订阅",
      success(res) {
        if (res.confirm) {
          getApp().methods.subscribeExam(_this.data.suffix, _this.data.phone, _this.data.configs.Subscribe, undefined, () => {
            // 提示
            wx.showModal({ title: '提示', content: '登陆成功，请您点击下方资料进行阅读～', showCancel: false, confirmText: "我知道啦" })
          })
        } else if (res.cancel) {
          // 提示
          wx.showModal({ title: '提示', content: '登陆成功，请您点击下方资料进行阅读～', showCancel: false, confirmText: "我知道啦" })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options.scene = "suffix#1" // fixme 测试

    // 判断参数是否完整
    if (options.scene.split("#").length !== 2) {
      getApp().methods.handleError({ err: options, title: "出错啦", content: "参数不正确", reLaunch: true })
    }
    // 保存参数
    this.setData({ suffix: options.scene.split("#")[0], bookID: options.scene.split("#")[1] })

    // 获取配置
    wx.showLoading({ title: '加载中...', mask: true })
    wx.request({
      url: (getApp().globalData.configs.apis.gaea.replace(".gaea.", ".chaos.")) + '/events/internal-tools/book-pro/info/' + options.scene.split("#")[1],
      complete: res => {
        console.log(res)
        wx.hideLoading() // 隐藏 loading
        if (res.statusCode !== 200) {
          getApp().methods.handleError({ err: res, title: "出错啦", content: "获取配置失败, 响应状态码: " + res.statusCode, reLaunch: true })
        } else if (res.data.Code !== 0) {
          getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.Error ? res.data.Error : "获取配置失败, 错误代码: " + res.data.Code, reLaunch: true })
        } else {
          try {
            res.data.Data.CoverConfig = JSON.parse(res.data.Data.CoverConfig)
          }
          catch (err) {
            console.log("反序列化 CoverConfig")
            console.log(err)
          }
          try {
            res.data.Data.ShareConfig = JSON.parse(res.data.Data.ShareConfig)
          }
          catch (err) {
            console.log("反序列化 ShareConfig")
            console.log(err)
          }
          try {
            res.data.Data.Subscribe = JSON.parse(res.data.Data.Subscribe)
          }
          catch (err) {
            console.log("反序列化 Subscribe")
            console.log(err)
          }
          this.setData({ configs: res.data.Data }) // 保存配置
          wx.setNavigationBarTitle({ title: res.data.Data.Name })// 修改标题
          // 判断是否是单页模式
          if (wx.getLaunchOptionsSync().scene !== 1154 && res.data.Data.CRMEventFormSID.length === 32) {
            getApp().methods.login(this.data.configs.CRMEventFormSID, this.data.suffix, "活动编码: " + this.data.configs.CRMEventID + ", 活动表单 ID: " + this.data.configs.CRMEventFormID, phone => this.setData({ phone })) // 登陆
          }
        }
      }
    })
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: this.data.configs.Name ? this.data.configs.Name : "考前白皮书",
      imageUrl: this.data.configs.ShareConfig.shareImage ? this.data.configs.ShareConfig.shareImage : "https://static.kaoyan365.cn/production/book/doc/1604289311438-13a9e8f3-b69f-4bdc-a8b7-d5aab817e1b6.jpg"
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.data.configs.Name ? this.data.configs.Name : "考前白皮书"
    }
  }
})