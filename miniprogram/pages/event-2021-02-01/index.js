// pages/event-2021-02-01/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "e34ae1eb078bf030d48288f200703efb", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202102011553,活动表单ID:72694", // CRM 注释
    
    suffix: "",
    phone: "", // 用户手机号码
  },

  // 注册
  login: function (e) {
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您再次点击进行领取～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  view: function (e) {
    wx.showLoading({ title: '下载中...', mask: true })
    wx.cloud.downloadFile({
      fileID: 'cloud://release-yum30.7265-release-yum30-1304214848/event/2021/01/data/'+(e.currentTarget.dataset.index)+'.pdf', // 文件 ID
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
    return {
      title: '2021吉林公务员考试资料大百科',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/02/01/share-202102011525.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2021吉林公务员考试资料大百科'
    }
  }
})