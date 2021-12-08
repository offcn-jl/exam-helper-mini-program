// pages/code-2021-ghfls/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"2022吉林省考报名辅助工具汇总",// 标题
    banner_bk:"http://jl.offcn.com/zt/ty/2021images/exam-helper/2022sk/sk-2022-hz-index.jpg",// 背景图片
    imageUrl:"http://jl.offcn.com/zt/ty/2021images/exam-helper/2022sk/sk-2022-hz-share.jpg",// 分享时显示的图片
    CRMEFSID: "56a0de1b86f6a7f301d0c62f7f1597f1", // CRM 活动表单 ID
    CRMEventID: "HD202110251261", // CRM 注释  小程序-2022省考五大系统汇总

    phone: "", // 用户手机号码
    suffixStr:''  // 后缀
  },

  // 点击未开通功能，提示
  btn(){
    wx.showModal({ title: '提示', content: '功能尚未开通', showCancel: false, confirmText: "我知道啦" })
  },
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
  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: async function (options) {
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
      title: this.data.title,
      imageUrl: this.data.imageUrl,
    }
  },
  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.data.title,
    }
  }
})