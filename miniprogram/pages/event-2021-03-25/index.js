// pages/sk-2021/book/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "dfb03aae15b5c88b175acc6bd453776a", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202103250049,活动表单ID:78922", // CRM 注释

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
      fileID: 'cloud://release-yum30.7265-release-yum30-1304214848/event/2021/03/25/book.pdf',
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
      title: '2022国家公务员考试秒懂知识点 ( 行测 + 申论 )',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/03/25/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2022国家公务员考试秒懂知识点 ( 行测 + 申论 )'
    }
  }
})