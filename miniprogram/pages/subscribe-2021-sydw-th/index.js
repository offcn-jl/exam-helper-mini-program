// pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "aa25ba78cd2ebe8653c92026a193e643", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202109020399,活动表单ID:98276", // CRM 注释 小程序-通化事业单位公告预约

    // cityList: ["不限", "省直", "长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"], // 地市
    typeList: ["不限", "综合岗", "教师岗", "医疗岗"], // 岗位类别

    // cityValue: "未知", // 地市 选中内容
    typeValue: "未知", // 岗位类别 选中内容

    suffix: "", // 后缀
    phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅

    qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_add46704ba47.jpg", // 二维码地址
  },
  
  /**
   * 监听页面滚动
   * 用于 显示 header / 隐藏 header
   */
  onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

  // 监听筛选条件切换
  m_select_touch(e) {
    switch (e.detail.type) {
      // case "city": // 地市
      //   this.setData({ cityValue: this.data.cityList[e.detail.index] })
      //   break
      case "type": // 岗位类别
        this.setData({ typeValue: this.data.typeList[e.detail.index] })
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

    // if (this.data.cityValue === "未知") {
    //   getApp().methods.handleError({
    //     err: e.detail.errMsg,
    //     title: "出错啦",
    //     content: "请您选择意向报考地市"
    //   })
    //   return
    // }

    if (this.data.typeValue === "未知") {
      getApp().methods.handleError({
        err: e.detail.errMsg,
        title: "出错啦",
        content: "请您选择意向报考岗位类别"
      })
      return
    }
    // "意向报考地市:" + this.data.cityValue + 
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, ",意向报考岗位类别:" + this.data.typeValue + "," + this.data.CRMRemark, phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您点击“订阅”按钮完成订阅～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // subscribe 订阅
  subscribe() {
    if(this.data.typeValue != "未知"){
      getApp().methods.subscribeSingleExam(this.data.suffix, "事业单位", undefined, ()=>{
        this.setData({tipsToSubscribeMessaged: true});
      })
    }else{
      wx.showModal({ title: '提示', content: '请先选择报考岗位哦～', showCancel: false, confirmText: "我知道啦" })
    }
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
      // switch (options.scene) {
      //   case "lX5VoC": // 长春
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_add46704ba47.jpg"})
      //     break;
      //   case "dkIirz": // 吉林
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_7e4d23d6cb71.jpg"})
      //     break;
      //   case "cuAqQy": // 松原
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_b8e86c971062.jpg"})
      //     break;
      //   case "h17IWN": // 四平
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_d7dbf24608dd.jpg"})
      //     break;
      //   case "htGlHB": // 延边
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_32164b3c126f.jpg"})
      //     break;
      //   case "hvEtbX": // 白城
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_eddfcd2f2e0e.jpg"})
      //     break;
      //   case "gX25cd": // 辽源
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_18c518f90852.jpg"})
      //     break;
      //   case "gWw8tb": // 白山
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_590d65e03823.jpg"})
      //     break;
      //   case "ht54zE": // 通化
      //     this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_10981ab4bd0f.jpg"})
      //     break;
      // }
    }
    
    // 判断是否是单页模式
    // "意向报考地市:" + this.data.cityValue + 
    if (wx.getLaunchOptionsSync().scene !== 1154) {
      getApp().methods.login(this.data.CRMEFSID, this.data.suffix, ",意向报考岗位类别:" + this.data.typeValue + "," + this.data.CRMRemark, phone => this.setData({ phone })) // 登陆
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
      title: '通化事业单位公告预约订阅服务',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/subscribe/2021/sydw-th/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '通化事业单位公告预约订阅服务'
    }
  }
})