// pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "9a578092aca1f09ac7fd200627af5ac6", // CRM 活动表单 ID
    CRMEventID: "HD202112030880", // CRM 注释 /108218
    title:'2022国考成绩查询预约提醒服务', // 标题
    banner:'http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/subscribe-2022gk-index.jpg', // 背景
    imageUrl:'http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/subscribe-2022gk-share.jpg', // 分享图

    suffix: "", // 后缀
    phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
  },

  /**
   * 监听页面滚动
   * 用于 显示 header / 隐藏 header
   */
  // onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

  // 登陆
  login: function (event) {
    getApp().methods.newLogin({event, crmEventFormSID: this.data.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${this.data.CRMEventID}`, callback: ({ phone, openid }) => {
      this.setData({ phone, openid });
      if ( this.data.configs.Subscribe.length > 0 ) {
        wx.showModal({ title: '提示', content: '注册成功，请您点击“点击登陆”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" });
      } else {
        wx.pageScrollTo({ selector: '.doc-title', duration: 1000 });
      }
    }});
  },

  // subscribe 订阅
  subscribe() {
    getApp().methods.subscribeSingleExam(this.data.suffix, "吉林公务员", undefined, ()=>{
      this.setData({tipsToSubscribeMessaged: true});
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取后缀
    if (typeof options.scene !== "undefined") {
      this.setData({
        suffix: options.scene
      })
    }
    const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
    this.setData(suffixInfo); // 保存后缀信息
    this.setData({ contactInformation: await getApp().methods.getContactInformation(suffixInfo) }); // 获取推广信息
    // 判断是否是单页模式
    if (wx.getLaunchOptionsSync().scene !== 1154 && this.data.CRMEFSID.length === 32) {
      // 获取登陆状态
      getApp().methods.newLoginCheck({ 
        crmEventFormSID: this.data.CRMEFSID, 
        suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, 
        remark: `活动表单ID:${this.data.CRMEventID}`, 
        callback: ({ phone, openid }) => {
          this.setData({ phone, openid }); 
          wx.pageScrollTo({ selector: '.doc-title', duration: 1000 });
        } 
      });
    }
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      imageUrl: this.data.imageUrl
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title:  this.data.title
    }
  }
})