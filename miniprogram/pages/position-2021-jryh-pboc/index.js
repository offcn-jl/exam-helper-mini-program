// pages/position-2020-jr/index

Page({
  data: {
    CRMEFSID: "41a1f8d2894053015f99d6b8f071d945", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202101130793,活动表单ID:70603", // CRM 注释

    yearList: ["不限","2021","2020"], // 年份
    provinceList: ["不限","上海市","北京市","重庆市","天津市","河北省","山西省","内蒙区","辽宁省","吉林省","黑龙江省","浙江省","福建省","江苏省","安徽省","山东省","河南省","湖北省","湖南省","江西省","广东省","广西区","海南省","四川省","贵州省","云南省","西藏区","陕西省","甘肃省","青海省","宁夏区","新疆区"], // 省份

    yearValue: '', // 年份
    provinceValue: '', // 省份

    suffix: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
  },

  // 监听筛选条件切换
  m_select_touch(e) {
    switch (e.detail.type) {
      case "year": // 年份
        this.setData({ yearValue: this.data.yearList[e.detail.index] })
        break
      case "province": // 省份
        this.setData({ provinceValue: this.data.provinceList[e.detail.index] })
        break
    }
  },

  // 注册（录入crm数据）
  buttonStart: function (e) {
    getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
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
        content: '您是否需要订阅“银行考试”考试公告？订阅成功后您可以在公告发布时免费获得推送提示～',
        confirmText: "免费订阅",
        success(res) {
          if (res.confirm) {
            getApp().methods.subscribeSingleExam(_this.data.suffix, "银行考试", undefined, () => {
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
    if (this.data.provinceValue !== "") url += "&province=" + this.data.provinceValue
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
  onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
  onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
  onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '中国人民银行招聘岗位匹配查询系统',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2021/jryh/share-20210118.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '中国人民银行招聘岗位匹配查询系统'
    }
  }
})
