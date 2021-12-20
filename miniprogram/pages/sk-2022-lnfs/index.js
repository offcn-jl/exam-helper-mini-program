Page({
  data: {
    title:"2022省考历年分数线查询",// 标题
    banner_bk:"http://jl.offcn.com/zt/ty/2021images/exam-helper/2022sk/sk-2022-lnfs-index.jpg",// 背景图片
    imageUrl:"http://jl.offcn.com/zt/ty/2021images/exam-helper/2022sk/sk-2022-lnfs-share.jpg",// 分享时显示的图片
    CRMEFSID: "56a0de1b86f6a7f301d0c62f7f1597f1", // CRM 活动表单 ID
    CRMEventID: "HD202110251261", // CRM 注释  小程序-2022省考五大系统汇总/103585

    // 职位要求
    cityList: ["省直","长春","吉林市","延边","四平","通化","白城","辽源","松原","白山"], // 地市
    bmxzList: ["公务员法机关","参照公务员法管理的事业单位"], // 部门性质
    // 个人条件
    yearList: ["2022","2021","2020","2019"],  // 年份
    xueliList1: ['本科学历','专科学历','高中（中专）学历'],       // 学历
    xueliList: ['大学本科以上学历+统招大学本科以上学历','大专以上学历+统招大专以上学历','高中（中专）以上学历+高中（中专）以上学历或我省技师院校高级工和预备技师（技师）班毕业且具有高级工及其以上职业资格证书的毕业生'],       // 学历
    zzmmList1: ['不限','共青团员','中共党员'],   // 政治面貌
    zzmmList: ['不限','中共党员或共青团员+不限','中共党员或共青团员+中共党员+不限'],   // 政治面貌

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
          wx.pageScrollTo({ selector: '.doc-title', duration: 1000 });
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
