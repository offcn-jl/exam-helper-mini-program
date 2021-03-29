Page({

  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "3f4faa16d01cec19e221d0af0d8d5dc4", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202103031635,活动表单ID:75944", // CRM 注释

    suffix: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
  },

  // 登陆
  login: function (e) {
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您点击“点我登陆后DIY”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // 订阅消息
  subscribe: function (e) {
    let _this = this
    _this.setData({ tipsToSubscribeMessaged: true })
    wx.showModal({
      title: '提示',
      content: '您是否需要订阅公职类考试公告？订阅成功后您可以在公告发布时免费获得推送提示～',
      confirmText: "免费订阅",
      success(res) {
        if (res.confirm) {
          getApp().methods.subscribeAllExam(_this.data.suffix, undefined, () => {
            // 提示
            wx.showModal({ title: '提示', content: '登陆成功，请您点击“点我立即DIY”按钮进行定制～', showCancel: false, confirmText: "我知道啦" })
          })
        } else if (res.cancel) {
            // 提示
            wx.showModal({ title: '提示', content: '登陆成功，请您点击“点我立即DIY”按钮进行定制～', showCancel: false, confirmText: "我知道啦" })
        }
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
      title: '免费定制领取你的专属开学新装备',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/03/04/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '免费定制领取你的专属开学新装备'
    }
  }
})