// pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "29f81dd650e4910ec9501d04bb92a842", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202104200574, 活动表单ID:82860", // CRM 注释

    suffix: "", // 后缀
    phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅

    qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_d19223858ad4.jpg", // 二维码地址
  },
  
  // 在页面发生滚动时，计算是否需要切换标题栏样式
  onPageScroll: function (e) {
    this.selectComponent('#navigation').swtichNavigation(e)
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

    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您点击“订阅”按钮完成订阅～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // subscribe 订阅
  subscribe() {
    getApp().methods.subscribeSingleExam(this.data.suffix, "特岗教师", undefined, ()=>{
      this.setData({tipsToSubscribeMessaged: true});
    })
  },

  // 保存二维码
  saveQrCode: function () {
    wx.showLoading({ title: '保存中...' })
    wx.downloadFile({
      url: this.data.qrCodePath,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.hideLoading()
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showModal({
                content: '二维码已保存到相册，赶紧打开微信扫一扫扫描识别吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333'
              })
            },
            fail: err => {
              getApp().methods.handleError({ err: err, title: '保存二维码失败', content: err.errMsg, reLaunch: false })
            } 
          })
        } else {
          wx.hideLoading()
          wx.showToast({ icon: 'none', title: '下载二维码失败' })
        }
      },
      fail: err => {
        wx.hideLoading()
        getApp().methods.handleError({ err: err, title: '下载二维码失败', content: err.errMsg, reLaunch: false })
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
      title: '免费特岗教师考试公告订阅服务',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/subscribe/2021/tgjs/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '免费特岗教师考试公告订阅服务'
    }
  }
})