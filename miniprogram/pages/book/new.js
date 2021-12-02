// pages/book/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suffix: {}, // 推广后缀
    suffixStr: '', // 推广后缀字符串

    contactInformation: {}, // 联系方式

    bookID: -1, // 白皮书配置 ID ( 哈士齐营销平台内部 ID )
    configs: {}, // 配置信息
    phone: "", // 用户手机号
    tipsToSubscribeMessaged: false, // 是已经否提示订阅考试信息
  },
  
  // makePhoneCall 打电话
  makePhoneCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.contactInformation.ConsultationPhone
    })
  },

  // gotoOnlineConsulting 打开在线咨询
  gotoOnlineConsulting: function () {
    wx.navigateToMiniProgram({ appId: 'wxb04ce8efcd61db65', path: `/pages/sobot/auto${this.data.suffixStr ? `?${this.data.suffixStr}` : ''}` })
  },

  // 浏览
  view: function (e) {
    if (!e.currentTarget.dataset.link) {
      wx.showToast({ title: '配置有误', icon: "none" })
      return
    }
    if (!this.data.phone && this.data.configs.CRMEventFormSID.length === 32 ) {
      wx.showToast({ title: '请您先点击上方按钮进行注册', icon: "none" })
      return
    }
    if (!this.data.tipsToSubscribeMessaged && this.data.configs.Subscribe.length > 0) {
      wx.showToast({ title: '请您先点击上方按钮进行登陆', icon: "none" })
      return
    }
    wx.navigateTo({ url: 'web-view/index?downloadable='+this.data.configs.Downloadable+'&link='+e.currentTarget.dataset.link })
  },

  // 登陆
  login: function (event) {
    getApp().methods.newLogin({event, crmEventFormSID: this.data.configs.CRMEventFormSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${this.data.configs.CRMEventID};白皮书-新;${this.data.configs.Name};${this.data.bookID};`, callback: ({ phone, openid }) => {
      this.setData({ phone, openid });
      if ( this.data.configs.Subscribe.length > 0 ) {
        wx.showModal({ title: '提示', content: '注册成功，请您点击“点击登陆”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" });
      } else {
        wx.pageScrollTo({ selector: '.doc-title', duration: 1000 });
      }
    }});
  },

  // 订阅消息
  subscribe: function (e) {
    let _this = this
    _this.setData({ tipsToSubscribeMessaged: true })
    wx.showModal({
      title: '提示',
      content: '您是否需要订阅 ' + this.data.configs.Subscribe.join("、") + ' 考试公告？订阅成功后您可以在公告发布时免费获得推送提示～',
      confirmText: "免费订阅",
      success(res) {
        if (res.confirm) {
          getApp().methods.subscribeExam(_this.data.suffix, _this.data.configs.Subscribe, undefined, () => {
            // 提示
            wx.showModal({ title: '提示', content: '登陆成功，请您点击下方资料进行阅读～', showCancel: false, confirmText: "我知道啦" })
            wx.pageScrollTo({ selector: '.doc-title', duration: 1000 })
          })
        } else if (res.cancel) {
          // 提示
          wx.showModal({ title: '提示', content: '登陆成功，请您点击下方资料进行阅读～', showCancel: false, confirmText: "我知道啦" })
          wx.pageScrollTo({ selector: '.doc-title', duration: 1000 })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
    this.setData(suffixInfo); // 保存后缀信息
    this.setData({ contactInformation: await getApp().methods.getContactInformation(suffixInfo) }); // 获取推广信息

    // 判断参数是否完整
    if (typeof options.id === 'undefined') {
      getApp().methods.handleError({ err: options, title: "出错啦", content: "参数不正确", reLaunch: true })
    }
    // 保存参数
    this.setData({ bookID: options.id })

    // 获取配置
    wx.showLoading({ title: '加载中...', mask: true })
    wx.request({
      url: (getApp().globalData.configs.apis.gaea.replace("offcn.ltd", "chaos.jilinoffcn.com")) + '/events/internal-tools/book-pro/info/' + options.id,
      complete: res => {
        wx.hideLoading() // 隐藏 loading
        if (res.statusCode !== 200) {
          getApp().methods.handleError({ err: res, title: "出错啦", content: "获取配置失败, 响应状态码: " + res.statusCode, reLaunch: true })
        } else if (res.data.Code !== 0) {
          getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.Error ? res.data.Error : "获取配置失败, 错误代码: " + res.data.Code, reLaunch: true })
        } else {
          try {
            res.data.Data.CoverConfig = JSON.parse(res.data.Data.CoverConfig)
          }
          catch (err) {
            console.log("反序列化 CoverConfig")
            console.log(err)
          }
          try {
            res.data.Data.ShareConfig = JSON.parse(res.data.Data.ShareConfig)
          }
          catch (err) {
            console.log("反序列化 ShareConfig")
            console.log(err)
          }
          try {
            res.data.Data.Subscribe = JSON.parse(res.data.Data.Subscribe)
          }
          catch (err) {
            console.log("反序列化 Subscribe")
            console.log(err)
          }
          this.setData({ configs: res.data.Data }) // 保存配置
          wx.setNavigationBarTitle({ title: res.data.Data.Name })// 修改标题
          // 判断是否是单页模式
          if (wx.getLaunchOptionsSync().scene !== 1154 && res.data.Data.CRMEventFormSID.length === 32) {
            // 获取登陆状态
            getApp().methods.newLoginCheck({ crmEventFormSID: this.data.configs.CRMEventFormSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${this.data.configs.CRMEventID};白皮书-新;${this.data.configs.Name};${options.id};`, callback: ({ phone, openid }) => {this.setData({ phone, openid }); wx.pageScrollTo({ selector: '.doc-title', duration: 1000 });} });
          }
          if ( res.data.Data.CRMEventFormSID.length !== 32 && res.data.Data.Subscribe.length === 0 ) {
            setTimeout(()=> {wx.pageScrollTo({ selector: '.doc-title', duration: 1000 })}, 1000)
          }
        }
      }
    })
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: this.data.configs.Name ? this.data.configs.Name : "考前白皮书",
      imageUrl: this.data.configs.ShareConfig.shareImage ? this.data.configs.ShareConfig.shareImage : "https://static.kaoyan365.cn/production/book/doc/1604289311438-13a9e8f3-b69f-4bdc-a8b7-d5aab817e1b6.jpg"
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.data.configs.Name ? this.data.configs.Name : "考前白皮书"
    }
  }
})