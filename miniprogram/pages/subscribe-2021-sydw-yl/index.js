// pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "e9dad2e82d72265c8ff0b8af659612c4", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202010230390,活动表单ID:74598", // CRM 注释

    cityList: ["不限", "省直", "长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"], // 地市
    cityValue: "未知", // 地市 选中内容

    suffix: "", // 后缀
    phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
  },
  
  // 在页面发生滚动时，计算是否需要切换标题栏样式
  onPageScroll: function (e) {
    this.selectComponent('#navigation').swtichNavigation(e)
  },

  // 监听筛选条件切换
  m_select_touch(e) {
    switch (e.detail.type) {
      case "city": // 地市
        this.setData({ cityValue: this.data.cityList[e.detail.index] })
        break
    }
  },

  // register 注册
  register: function (e) {
    // 判断是否授权使用手机号
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      getApp().methods.handleError({
        err: e.detail.errMsg,
        title: "出错啦",
        content: "需要您同意授权获取手机号码后才能完成注册～"
      })
      return
    }

    if (this.data.cityValue === "未知") {
      getApp().methods.handleError({
        err: e.detail.errMsg,
        title: "出错啦",
        content: "请您选择意向报考地市"
      })
      return
    }

    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, "意向报考地市:" + this.data.cityValue + "," + this.data.CRMRemark, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您点击“订阅”按钮完成订阅～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // subscribe 订阅
  subscribe() {
    getApp().methods.subscribeSingleExam(this.data.suffix, this.data.phone, "医疗招聘", undefined, ()=>{
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
      getApp().methods.login(this.data.CRMEFSID, this.data.suffix, "意向报考地市:" + this.data.cityValue + "," + this.data.CRMRemark, phone => this.setData({ phone })) // 登陆
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
      title: '免费医疗招聘考试公告订阅服务',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/subscribe/2021/sydw-yl/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '免费医疗招聘考试公告订阅服务'
    }
  }
})