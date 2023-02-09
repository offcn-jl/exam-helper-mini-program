Page({
  data: {
    title:"2023省考职位检索查询",// 标题
    banner_bk:"https://jl.offcn.com/zt/ty/images/sk/2023/zwjs/index.jpg",// 背景图片
    imageUrl:"https://jl.offcn.com/zt/ty/images/sk/2023/zwjs/share.jpg",// 分享时显示的图片
    CRMEFSID: "f170a936bb5d641430b081727d760bb3", // CRM 活动表单 ID
    CRMRemark: "2023省考职位检索", // CRM 注释

    // 职位要求
    cityList: ["省直","长春","吉林市","延边","四平","通化","白城","辽源","松原","白山"], // 地市
    bmxzList: ["中国共产党的机关","参照公务员法管理的事业单位","审判机关","检察机关","行政机关","监察机关","民主党派和工商联的机关","人民代表大会及其常务委员会机关"], // 部门性质
    // 个人条件
    yearList: ["2023","2022","2021","2020"],  // 年份
    xueliList1: ["硕士","本科","大专","高中（中专）","高中（中专）以上学历或我省技师院校高级工和预备技师（技师）班毕业且具有高级工及其以上职业资格证书的毕业生"],       // 学历
    xueliList: ['硕士研究生以上学历','大学本科以上学历','大专以上学历','高中（中专）以上学历','高中（中专）以上学历或我省技师院校高级工和预备技师（技师）班毕业且具有高级工及其以上职业资格证书的毕业生'],       // 学历
    zzmmList1: ['不限','共青团员','中共党员'],   // 政治面貌
    zzmmList: ['不限','中共党员或共青团员+不限','中共党员或共青团员+中共党员+不限'],   // 政治面貌

    cityValue: '',  // 地市
    bmxzValue: '',  // 部门性质
    bmmcValue: '',  // 部门名称
    zwmcValue: '',  // 职位名称
    yearValue: '',  // 年份
    xueliValue: '', // 学历
    zzmmValue: '',  // 政治面貌
    zylbValue: '',  // 专业类别

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
        this.setData({ cityValue: this.data.cityList[e.detail.index] })
        break
      case "bmxz": // 部门性质
        this.setData({ bmxzValue: this.data.bmxzList[e.detail.index] })
        break
      // 个人条件
      case "year": // 年份
        this.setData({ yearValue: this.data.yearList[e.detail.index] })
        break
      case "xueli": // 学历
        this.setData({ xueliValue: this.data.xueliList[e.detail.index] })
        break
      case "zzmm": // 政治面貌
        this.setData({ zzmmValue: this.data.zzmmList[e.detail.index] })
        break
    }
  },
  // 输入框
  bmmc(e){ // 部门名称
    this.setData({
      bmmcValue: e.detail.value
    })
  },
  zwmc(e){ // 职位名称
    this.setData({
      zwmcValue: e.detail.value
    })
  },
  zylb(e){ // 专业类别
    this.setData({
      zylbValue: e.detail.value
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
    url += "&city=" + this.data.cityValue
    url += "&bmxz=" + this.data.bmxzValue
    url += "&bmmc=" + this.data.bmmcValue
    url += "&zwmc=" + this.data.zwmcValue
    wx.reLaunch({ url })
    // wx.navigateTo({ url })   //尝试点击返回可以回到当前页面，但被十层页面栈限制
  },
  async seach_result2() {
    let url = "result/index?year=" + this.data.yearValue
    url += "&city=" + this.data.cityValue
    url += "&xueli=" + this.data.xueliValue
    url += "&zzmm=" + this.data.zzmmValue
    url += "&zylb=" + this.data.zylbValue
    url += this.data.suffixStr ? `&${this.data.suffixStr}` : ''
    wx.reLaunch({ url })
    // wx.navigateTo({ url })   //尝试点击返回可以回到当前页面，但被十层页面栈限制
  },

  // 登陆
  login: function (event) {
    getApp().methods.newLogin({event, crmEventFormSID: this.data.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: this.data.CRMRemark, callback: ({ phone, openid }) => {
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
    // 判断是否是单页模式
    if (wx.getLaunchOptionsSync().scene !== 1154 && this.data.CRMEFSID.length === 32) {
      // 获取登陆状态
      getApp().methods.newLoginCheck({ 
        crmEventFormSID: this.data.CRMEFSID, 
        suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, 
        remark: this.data.CRMRemark, 
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
