// pages/sk-2021/book/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "45414febb958d2b17e9c66c862f2a240", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202103171721,活动表单ID:77884", // CRM 注释

    phone: "",
    suffix: "",
  },

  // 登陆
  login: function (e) {
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
      this.setData({ phone });
      this.view();
    })
  },

  // 浏览
  view: function () {
    wx.showLoading({ title: '下载中...', mask: true })
    wx.cloud.downloadFile({
      fileID: 'cloud://release-yum30.7265-release-yum30-1304214848/sk/2021/scene/book.pdf',
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
        app.methods.handleError({
          err: res,
          title: "出错啦",
          content: "打开失败, 请您稍后再试"
        })
        wx.hideLoading() // 隐藏 loading
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取后缀
    if (typeof options.scene !== "undefined") {
      this.setData({
        suffix: options.scene
      })
    }

    // 判断是否是单页模式
    if (wx.getLaunchOptionsSync().scene !== 1154) {
      getApp().methods.login(this.data.CRMEFSID, this.data.suffix, this.data.CRMRemark, phone => this.setData({ phone })) // 登陆
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '2021吉林省考白皮书领取',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/sk/2021/book/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2021吉林省考白皮书领取'
    }
  }
})