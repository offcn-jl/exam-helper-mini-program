Page({
  data: {
    title:"2021年吉林三支一扶历年职位筛选",// 标题
    banner_bk:"http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2021/2021zwsx-szyf-header.jpg",// 背景图片
    imageUrl:"http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2021/2021zwsx-szyf-share.jpg",// 分享时显示的图片
    CRMEFSID: "78f154caf5bb4055755fa0982bccfff5", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202105120300,活动表单ID:85453", // CRM 注释  网站专题页-五大系统查询
    actid:"37695", //zg99id  2021年吉林三支一扶历年职位筛选
       
    yearList: ["2020","2019","2018","2017"], //年份
    cityList: ["长春","吉林","四平","辽源","通化","白山","松原","白城","延边","梅河口","公主岭"], //地市
    gwlbList: ["支农","支教","就业与社会保障","扶贫","支医","水利","专业技术","初级中学"], //岗位类别
    xlList: ["本科","大专"], //学历
    xlList2: ["本科","专"], //学历筛选条件
    majorList: [], //专业

    yearValue: '', //年份
    cityValue: '', //地市
    gwlbValue: '', //岗位类别
    xlValue: '', //学历
    majorValue: '', //专业

    suffix: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: true, // 是否提示过进行消息订阅
  },

  // 监听筛选条件切换
  m_selectSearch_touch(e) {
    this.setData({
      majorValue: e.detail.text
    })
  },
  m_select_touch(e) {
    switch (e.detail.type) {
      case "year"://年份
        this.setData({ yearValue: this.data.yearList[e.detail.index] })
        break
      case "city"://地市
        this.setData({ cityValue: this.data.cityList[e.detail.index] })
        break
      case "gwlb"://岗位类别
        this.setData({ gwlbValue: this.data.gwlbList[e.detail.index] })
        break
      case "xl"://学历
        this.setData({ xlValue: this.data.xlList2[e.detail.index] })
        break
    }
  },

  // 搜索
  async seach_result() {
    console.log(this.data.xlValue)
    let url = "result/index?scene=" + this.data.suffix
    if (this.data.yearValue !== "") url += "&year=" + this.data.yearValue
    if (this.data.cityValue !== "") url += "&city=" + this.data.cityValue
    if (this.data.gwlbValue !== "") url += "&gwlb=" + this.data.gwlbValue
    if (this.data.xlValue !== "") url += "&xl=" + this.data.xlValue
    if (this.data.majorValue !== "") url += "&major=" + this.data.majorValue
    wx.reLaunch({ url })
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
    var _this=this;
    // 获取数据
    wx.request({
      url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",
      data: {level:"1", grfiled:'',grtext:'',sstime: new Date().valueOf()},
      success(res) {
        try {
          let list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
          console.log(list)
          if (list.status !== 1) {//如果status不等于1，弹出错误提示
            wx.showToast({ title: list.msg, icon: 'none' })
            return  
          }
          if (list.lists.length <= 0) {//如果内容长度小于等于0，弹出无数据提示
            wx.showToast({ title: '没有更多数据啦', icon: 'none' })
            return
          }
          // 录入专业里，不用提前清空，因为只进行一次获取
          for(var i=0; i<list.lists.length-1; i++ ){
            _this.setData({
              majorList:  _this.data.majorList.concat(list.lists[i].obj)
            });
          };
        } catch (err) {//捕获错误并报错
          getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true })
        }
      },
      fail: err => {//获取失败后提示
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
      }
    })
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
