Page({
  data: {
    title:"历年分数-2021特岗教师历年岗位进面分数查询系统",// 标题
    banner_bk:"http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2021/2021lnfs-tgjs-share.jpg",// 背景图片
    imageUrl:"http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2021/2021lnfs-tgjs-share.jpg",// 分享时显示的图片
    CRMEFSID: "fe244d19fef84bb6edc0e46fc39627dc", // CRM 活动表单 ID
    CRMRemark: "活动编码:HD202104121816,活动表单ID:81568", // CRM 注释  网站专题页-2021年吉林特岗教师笔试六大系统
    actid:"37031", //zg99id  2021特岗教师历年岗位进面分数查询系统

    cityList: [],//地市
    countyList: [],//县（市、区）
    subjectList: [],//申报学科
    cityValue: '', //地市
    countyValue: '', //县（市、区）
    subjectValue: '', //申报学科

    suffix: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: true, // 是否提示过进行消息订阅
  },

  // 监听筛选条件切换(地市做出选择以后，报考职位发生变化)
  m_select_touch(e) {
    var _this=this
    switch (e.detail.type) {
      case "city": //县（市、区）
        _this.setData({ cityValue: _this.data.cityList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '2', grfiled:'city',grtext:_this.data.cityValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
            let county_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
            // 现将之前地市选项中报考职位内容清空
            _this.setData({
              countyList:  [],
              subjectList:  []
            });
            // 将数据添加到已清空的报考职位中
            for( var i=0; i<county_list.lists.length; i++ ){
              _this.setData({
                countyList:  _this.data.countyList.concat(county_list.lists[i].county)
              });
            };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "county": //县（市、区）
        console.log(_this.data.countyList[e.detail.index])
        _this.setData({ countyValue: _this.data.countyList[e.detail.index] })
        // zg99三级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '3', grfiled:'county',grtext:_this.data.countyValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let subject_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              // 现将之前地市选项中报考职位内容清空
              _this.setData({
                subjectList:  []
              });
              // 将数据添加到已清空的报考职位中
              for( var i=0; i<subject_list.lists.length; i++ ){
                _this.setData({
                  subjectList:  _this.data.subjectList.concat(subject_list.lists[i].subject)
                });
              };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "subject": //县（市、区）
        _this.setData({ subjectValue: _this.data.subjectList[e.detail.index] })
        break
    }
  },

  // 搜索
  async seach_result() {
    let url = "result/index?scene=" + this.data.suffix
    if (this.data.cityValue !== "") url += "&city=" + this.data.cityValue
    if (this.data.countyValue !== "") url += "&county=" + this.data.countyValue
    if (this.data.subjectValue !== "") url += "&subject=" + this.data.subjectValue
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
          // console.log(list)
          if (list.status !== 1) {//如果status不等于1，弹出错误提示
            wx.showToast({ title: list.msg, icon: 'none' })
            return  
          }
          if (list.lists.length <= 0) {//如果内容长度小于等于0，弹出无数据提示
            wx.showToast({ title: '没有更多数据啦', icon: 'none' })
            return
          }
          // 录入地市里的单位，不用提前清空，因为只进行一次获取
          for(var i=0; i<list.lists.length; i++ ){
            _this.setData({
              cityList:  _this.data.cityList.concat(list.lists[i].city)
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
