// pages/event-2021-03-29/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "381ae761ed2d7f786df012f1326379d4", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202103291593,活动表单ID:79333", // CRM 注释

    phone: "",
    suffix: "",
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
  },

  // register 注册
  register: function (e) {
    // 判断是否授权使用手机号
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      getApp().methods.handleError({
        err: e.detail.errMsg,
        title: "出错啦",
        content: "需要您同意授权获取手机号码后才能完成登陆～"
      })
      return
    }

    // 提交注册
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '登陆成功，请您点击“点击预约”按钮完成订阅～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // subscribe 订阅
  subscribe() {
    getApp().methods.subscribeSingleExam(this.data.suffix, this.data.phone, "吉林公务员", undefined, ()=>{
      this.setData({tipsToSubscribeMessaged: true});
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取参数中的后缀
    this.setData({
      suffix: options.scene
    })

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
      title: '2021吉林省公务员考试笔试成绩预约服务',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/03/29/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2021吉林省公务员考试笔试成绩预约服务'
    }
  }
})