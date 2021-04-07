// pages/event-2021-04-07/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "82f750a14d298510152f00a6d8d8b0f2", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202104071003,活动表单ID:80648", // CRM 注释

    phone: "", // 用户手机号码
    suffix: "", // 后缀

    ADClass: "", // 19课堂课程ID 
    ADPictureURL: "", // 广告图
  },

  /**
   * 按钮 开始使用
   */
  buttonStart: function (e) {
    // 判断是否授权使用手机号
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      getApp().methods.handleError({
        err: e.detail.errMsg,
        title: "出错啦",
        content: "需要您使用手机号码进行登陆后才可进行领取～"
      })
      return
    }

    // 弹出 Loading
    wx.showLoading({
      title: '登陆中...',
      mask: true
    })

    // 提交注册
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
      this.setData({ phone })
      this.getAD();
    })
  },

  /**
   * 获取广告设置
   */
  getAD: function () {
    // 获取广告设置
    wx.request({
      url: 'https://tsf.tencent.jilinoffcn.com/release/app/version-control/get/20210402',
      success: (res) => {
        if (res.statusCode === 200) {
          // 保存广告设置
          this.setData({
            ADClass: res.data.Description,
            ADPictureURL: res.data.Download,
          })
        } else {
          // 请求失败
          // 由于获取广告配置不是关键操作，为保障用户体验，不阻止后续跳转操作，不弹出错误提示
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取参数中的后缀
    if (typeof options.scene !== "undefined") {
      this.setData({
        suffix: options.scene
      })
    }

    // 判断是否是单页模式
    if (wx.getLaunchOptionsSync().scene !== 1154) {
      getApp().methods.login(this.data.CRMEFSID, this.data.suffix, this.data.CRMRemark, phone => {this.setData({ phone });this.getAD();}) // 登陆
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '2021 吉林省考面试三页纸',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/04/07/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2021 吉林省考面试三页纸'
    }
  }
})