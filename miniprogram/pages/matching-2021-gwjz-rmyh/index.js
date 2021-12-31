Page({
  data: {
    title:"2023人行职位查询及竞争比",// 标题
    banner_bk:"http://news01.offcn.com/jl/2021/1231/20211231095349583.jpg",// 背景图片
    imageUrl:"http://news01.offcn.com/jl/2021/1231/20211231095348419.jpg",// 分享时显示的图片
    CRMEFSID: "e1cbb8501c54e3d195e1f80f465ecf7d", // CRM 活动表单 ID
    CRMEventID: "HD202108040123", // CRM 注释  小程序-2022人民银行岗位竞争比,活动表单ID:95638

    nfList: ['2021','2020','2019'],//年份
    zyList: ['安全保卫','半导体','材料科学与工程','材料学','财务','财务管理','财务会计','传播','传媒','大数据管理','大数据与区块链','档案管理','电子工程','电子通信','电子信息','电子信息工程','动画','俄语','法律','法律相关','法学','高分子','工程管理','工程造价','工商管理','工商管理。','公共关系学','公共管理','管理','管理科学与工程','管理类','管理学','广播电视编导','广告','广告学','韩语','化工','环境工程','环境科学','会计','会计学','机械电子工程','机械制造','集成电路设计','计量经济学','计算机','计算机技术','计算机科学与技术','计算机相关','建筑学','教育技术','教育学','金融','金融学','经济','经济法','经济金融','经济学','考古（历史）','劳动与社会保障','理工科','历史','历史学','马克思主义理论','马克思主义理论类','蒙古语','密码学','能源动力类','尼泊尔语','平面设计','企业管理','人工智能','人力资源管理','人力资源管理类','软件工程','设计','社会学','审计','审计学','市场营销','市场营销学','视觉传达','数据挖掘','数据挖掘与统计分析','数理统计','数学','思想政治教育学','通信工程','统计','统计学','土木类','网络通信','微电子','新媒体设计','新闻','新闻传播学','新闻学','信息安全','信息管理','信息管理与信息系统','行政管理','印地语','印刷','印刷工程','印刷机械','印刷技术','印刷学','英语','越南语','造纸','哲学','政治学','制浆造纸工程','中文','自动化'],//专业

    nfValue: '', //年份
    zyValue: '', //专业

    suffix: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: true, // 是否提示过进行消息订阅
  },

  // 监听筛选条件切换(年份做出选择以后，报考职位发生变化)
  m_select_touch(e) {
    var _this=this
    switch (e.detail.type) {
      case "nf": //招聘单位
        _this.setData({ nfValue: _this.data.nfList[e.detail.index] })
        break
      case "zy": //招聘单位
        _this.setData({ zyValue: _this.data.zyList[e.detail.index] })
        break
    }
  },

  // 搜索
  async seach_result() {
    let url = "result/index?scene=" + this.data.suffix
    if (this.data.nfValue !== "") url += "&nf=" + this.data.nfValue
    if (this.data.zyValue !== "") url += "&zy=" + this.data.zyValue
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

  // 提示订阅消息推送
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
