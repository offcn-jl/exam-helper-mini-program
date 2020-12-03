// pages/search/search.js

Page({
  data: {
    CRMEFSID: "fbbe14b6de58098447a1253a696c1044", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202011150569,活动表单ID:62475", // CRM 注释

    yearList: ["不限", "2020年", "2019年", "2018年", "2017年", "2016年"],
    addressList: ["不限", "长春", "吉林", "通化", "延吉", "白山", "白城", "四平", "辽源", "松原"],
    levelList: ["不限", "小学", "初中"],
    majorList: ["不限", "语文", "数学", "英语", "物理", "化学", "生物", "科学", "地理", "历史", "道德与法治（品德与社会）", "信息技术", "思想品德", "音乐", "体育", "美术", "其他", "学前教育"],

    yearValue: '',
    addressValue: '',
    levelValue: '',
    majorValue: '',

    suffix: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
  },

  // 监听筛选条件切换
  m_select_touch(e) {
    switch (e.detail.type) {
      case "1":
        this.setData({ yearValue: this.data.yearList[e.detail.index] })
        break
      case "2":
        this.setData({ addressValue: this.data.addressList[e.detail.index] })
        break
      case "3":
        this.setData({ levelValue: this.data.levelList[e.detail.index] })
        break
    }
  },

  // 监听筛选条件切换
  m_selectSearch_touch(e) {
    this.setData({
      majorValue: e.detail.text
    })
  },

  // 登陆
  buttonStart: function (e) {
    getApp().methods.register(e, this.data.suffix, "", "", phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您点击“点击查询”按钮进行查询～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // 提示订阅消息推送
  tipsToSubscribeMessage() {
    let _this = this
    if (!_this.data.tipsToSubscribeMessaged) {
      _this.setData({ tipsToSubscribeMessaged: true })
      wx.showModal({
        title: '提示',
        content: '您是否需要订阅“特岗教师”考试公告？订阅成功后您可以在公告发布时免费获得推送提示～',
        confirmText: "免费订阅",
        success(res) {
          if (res.confirm) {
            getApp().methods.subscribeSingleExam(_this.data.suffix, _this.data.phone, "特岗教师", undefined, () => {
              _this.seach_result() // 订阅成功后执行查询
            })
          } else if (res.cancel) {
            _this.seach_result() // 执行查询
          }
        }
      })
    } else {
      _this.seach_result() // 执行查询
    }
  },

  // 搜索
  async seach_result() {
    let url = "result/index?scene=" + this.data.suffix
    if (this.data.yearValue !== "") url += "&year=" + this.data.yearValue
    if (this.data.addressValue !== "") url += "&address=" + this.data.addressValue
    if (this.data.levelValue !== "") url += "&level=" + this.data.levelValue
    if (this.data.majorValue !== "") url += "&major=" + this.data.majorValue
    wx.reLaunch({ url })
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

    // 判断是否是单页模式 toto 这里要结合登陆使用
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
      title: '特岗教师历年职位筛选',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2020/tgjs/share.1116.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '特岗教师历年职位筛选'
    }
  }
})
