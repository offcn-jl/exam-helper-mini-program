// pages/event-2021-02-18/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "4200637130111ff86673a0f64f524b1f", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202102180475,活动表单ID:73816", // CRM 注释

    suffix: "", // 后缀
    phone: "", // 用户手机号码
  },

  // 登陆
  login: function (e) {
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '登陆成功，请您点击“开始咨询”按钮进行报考咨询～', showCancel: false, confirmText: "我知道啦" })
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
      title: '2021吉林公务员考试1对1在线选岗',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/02/18/share-202102181140.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2021吉林公务员考试1对1在线选岗'
    }
  }
})