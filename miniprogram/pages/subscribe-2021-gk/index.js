// pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "6e255671c36305423015294f15c6c17a", // CRM 活动表单 ID
    CRMRemark: "HD202105110114/85279", // CRM 注释

    suffix: "", // 后缀
    phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
  },

  /**
   * 监听页面滚动
   * 用于 显示 header / 隐藏 header
   */
  onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

  // register 注册
  register: function (e) {
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您点击“订阅”按钮完成订阅～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // subscribe 订阅
  subscribe() {
    getApp().methods.subscribeSingleExam(this.data.suffix, "国家公务员", undefined, ()=>{
      this.setData({tipsToSubscribeMessaged: true});
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
      title: '公告订阅',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/subscribe/2021/gk/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '免费考试公告订阅服务'
    }
  }
})