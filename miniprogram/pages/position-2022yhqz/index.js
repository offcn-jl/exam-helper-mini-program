Page({
  data: {
    title:"2022银行秋招职位查询系统",// 标题
    banner_bk:"http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2021/2022yhqz/header-0415.jpg",// 背景图片
    imageUrl:"http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2021/2022yhqz/share-0415.jpg",// 分享时显示的图片
    CRMEFSID: "da93326080a205698c5637031e9bfa88", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202104140438,活动表单ID:81907", // CRM 注释  网站专题页-2022银行秋招职位查询
    
    yearList: ["2021", "2020"],//年份
    bankList: ["不限","中国银行","工商银行","建设银行","交通银行","农业银行","邮政储蓄银行","国家开发银行","中国进出口银行","中国农业发展银行","股份制银行"],//银行
    cityList: ["不限", "普通地市", "一线大城市", "普通省会/知名二线城市", "县域城市"],//城市
    majorList: ["不限", "计算机及相关专业"],//专业
    educationList: ["不限", "研究生", "本科", "专科"],//学历
    schoolList: ["不限", "985院校", "211院校", "双一流院校", "重点院校", "一般院校", "专科院校"],//院校级别
    schoolList2: ["不限", "985", "211", "双一流", "重点", "一般", "专科"],//院校级别（搜索）
    levelList: ["不限", "六级", "四级"],//外语等级

    yearValue: '', //年份
    bankValue: '',//银行
    cityValue: '',//城市
    majorValue: '',//专业
    educationValue: '',//学历
    schoolValue: '', //院校级别
    levelValue: '',//外语等级

    suffix: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: true, // 是否提示过进行消息订阅

    // 底部滑动可切换样式
    currentTab:0, //预设当前项的值
  },

  // 监听筛选条件切换
  m_select_touch(e) {
    switch (e.detail.type) {
      case "year": //年份
        this.setData({ yearValue: this.data.yearList[e.detail.index] })
        break
      case "bank"://银行
        this.setData({ bankValue: this.data.bankList[e.detail.index] })
        break
      case "city"://城市
        this.setData({ cityValue: this.data.cityList[e.detail.index] })
        break
      case "major"://专业
        this.setData({ majorValue: this.data.majorList[e.detail.index] })
        break
      case "education"://学历
        this.setData({ educationValue: this.data.educationList[e.detail.index] })
        break
      case "school"://院校级别
        this.setData({ schoolValue: this.data.schoolList2[e.detail.index] })
        break
      case "level"://外语等级
        this.setData({ levelValue: this.data.levelList[e.detail.index] })
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
    if (this.data.schoolValue !== "") url += "&school=" + this.data.schoolValue
    if (this.data.educationValue !== "") url += "&education=" + this.data.educationValue
    if (this.data.majorValue !== "") url += "&major=" + this.data.majorValue
    if (this.data.levelValue !== "") url += "&level=" + this.data.levelValue
    if (this.data.yearValue !== "") url += "&year=" + this.data.yearValue
    if (this.data.cityValue !== "") url += "&city=" + this.data.cityValue
    if (this.data.bankValue !== "") url += "&bank=" + this.data.bankValue
    wx.reLaunch({ url })
  },
  
  // 向左向右点击切换
  // 滚动切换标签样式
  switchTab:function(e){
    this.setData({
        currentTab:e.detail.current
    });
  },
  // 点击标题切换当前页时改变样式
  swichNav:function(e){
    var cur=e.target.dataset.current;
    if(this.data.currentTaB==cur){
      return false;
    }else{
      this.setData({
        currentTab:cur
      })
    }
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
      title: this.data.title,
      imageUrl: this.data.imageUrl,
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.data.imageUrl,
    }
  }
})
