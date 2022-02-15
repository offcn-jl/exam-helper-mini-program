Page({
  data: {
    title:"2022辽宁省考职位检索查询",// 标题
    banner_bk:"http://jl.offcn.com/zt/ty/2022images/exam-helper-mini/sk-2022-zwjs-index.jpg",// 背景图片
    imageUrl:"http://jl.offcn.com/zt/ty/2022images/exam-helper-mini/sk-2022-zwjs-lj-share.jpg",// 分享时显示的图片
    CRMEFSID: "6e12d36790d0214564d773000a0d27e8", // CRM 活动表单 ID
    CRMEventID: "HD202202150216", // CRM 注释  小程序-辽宁职位检索	 115628

    // 职位要求
    cityList: ["沈阳","大连","鞍山","抚顺","本溪","铁岭","朝阳","丹东","锦州","营口","阜新","辽阳","盘锦","葫芦岛"], // 地市
    bmxzList: ["街道","区直","省直","市直","市（县）直","县直","乡镇"], // 机构层级
    // 个人条件
    yearList: ["2022","2021","2020","2019"],  // 年份
    xueliList1: ['专科','本科','研究生'],       // 学历
    xueliList: ['大专及以上','本科及以上+大专及以上','研究生+本科及以上+大专及以上'],       // 学历
    zzmmList1: ['不限','中共党员','民革党员'],   // 政治面貌
    zzmmList: ['不限+无限制','中共党员+无限制+不限','民革党员+无限制+不限'],   // 政治面貌

    cityvalue: '',  // 地市
    bmxzvalue: '',  // 部门性质
    bmmcvalue: '',  // 部门名称
    zwmcvalue: '',  // 职位名称
    yearvalue: '',  // 年份
    xuelivalue: '', // 学历
    zzmmvalue: '',  // 政治面貌
    zylbvalue: '',  // 专业类别

    switch:false,  // true 职位要求  false 个人条件

    suffixStr: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: true, // 是否提示过进行消息订阅
  },
  // 监听筛选条件切换
  m_select_touch(e) {
    switch (e.detail.type) {
      // 职位要求
      case "city": // 地市
        this.setData({ cityvalue: this.data.cityList[e.detail.index] })
        break
      case "bmxz": // 部门性质
        this.setData({ bmxzvalue: this.data.bmxzList[e.detail.index] })
        break
      // 个人条件
      case "year": // 年份
        this.setData({ yearvalue: this.data.yearList[e.detail.index] })
        break
      case "xueli": // 学历
        this.setData({ xuelivalue: this.data.xueliList[e.detail.index] })
        break
      case "zzmm": // 政治面貌
        this.setData({ zzmmvalue: this.data.zzmmList[e.detail.index] })
        break
    }
  },
  // 输入框
  bmmc(e){ // 部门名称
    this.setData({
      bmmcvalue: e.detail.value
    })
  },
  zwmc(e){ // 职位名称
    this.setData({
      zwmcvalue: e.detail.value
    })
  },
  zylb(e){ // 专业类别
    this.setData({
      zylbvalue: e.detail.value
    })
  },
  // 切换
  switch1(){  // 职位要求
    this.setData({
      switch: true
    })
  },
  switch2(){  // 个人条件
    this.setData({
      switch: false
    })
  },

  // 搜索
  async seach_result1() {
    let url = "result/index?" + this.data.suffixStr
    url += "&city=" + this.data.cityvalue
    url += "&bmxz=" + this.data.bmxzvalue
    url += "&bmmc=" + this.data.bmmcvalue
    url += "&zwmc=" + this.data.zwmcvalue
    console.log(url)
    wx.reLaunch({ url })
    // wx.navigateTo({ url })   //尝试点击返回可以回到当前页面，但被十层页面栈限制
  },
  async seach_result2() {
    let url = "result/index?" + this.data.suffixStr
    url += "&year=" + this.data.yearvalue
    url += "&city=" + this.data.cityvalue
    url += "&xueli=" + this.data.xuelivalue
    url += "&zzmm=" + this.data.zzmmvalue
    url += "&zylb=" + this.data.zylbvalue
    console.log(url)
    wx.reLaunch({ url })
    // wx.navigateTo({ url })   //尝试点击返回可以回到当前页面，但被十层页面栈限制
  },

  // 登陆
  login: function (event) {
    getApp().methods.newLogin({event, crmEventFormSID: this.data.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${this.data.CRMEventID}`, callback: ({ phone, openid }) => {
      this.setData({ phone, openid });
        wx.showModal({ title: '提示', content: '注册成功，请您点击“点击登陆”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" });
    }});
  },

  // 提示订阅消息推送(OFFCN考试助手暂无使用功能)
  tipsToSubscribeMessage() {
    let _this = this
    if (!_this.data.tipsToSubscribeMessaged) {
      _this.setData({ tipsToSubscribeMessaged: true })
      wx.showModal({
        title: '提示',
        content: '您是否需要订阅“事业单位”考试公告？订阅成功后您可以在公告发布时免费获得推送提示～',
        confirmText: "免费订阅",
        success(res) {
          if (res.confirm) {
            getApp().methods.subscribeSingleExam(_this.data.suffix, "事业单位", undefined, () => {
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
        } 
      });
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
      title: this.data.title,
    }
  }
})
