Page({
  data: {
    title:"吉林特岗历年职位检索系统",// 标题
    banner_bk:"http://news01.offcn.com/jl/2021/1220/20211220014332912.jpg",// 背景图片
    imageUrl:"http://news01.offcn.com/jl/2021/1220/20211220014331327.jpg",// 分享时显示的图片
    CRMEFSID: "827482130ba3f6d973c98a2e8ca38e03", // CRM 活动表单 ID
    CRMEventID: "HD202112160810", // CRM 注释  小程序-吉林特岗历年职位检索系统/110316
    actid:"45167", //zg99id  小程序-2022吉林省公务员考试常见问题查询

    yearList: [],  //年份
    cityList: [],  //地市
    countyList: [],  //县区
    planList: [],  //计划
    stageList: [],  //学段
    subjectList: [],  //学科

    yearValue: '', //年份
    cityValue: '', //地市
    countyValue: [],  //县区
    planValue: [],  //计划
    stageValue: [],  //学段
    subjectValue: [],  //学科

    suffixStr: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: true, // 是否提示过进行消息订阅
  },

  // 监听筛选条件切换(招聘单位名称做出选择以后，报考职位发生变化)
  m_select_touch(e) {
    var _this=this
    switch (e.detail.type) {
      case "year": //年份
        _this.setData({ yearValue: _this.data.yearList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '2', grfiled:'year',grtext:_this.data.yearValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let city_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              console.log(city_list)
              // 现将之前招聘单位名称选项中报考职位内容清空
              _this.setData({
                cityList:  []
              });
              // 将数据添加到已清空的报考职位中
              for( var i=0; i<city_list.lists.length; i++ ){
                _this.setData({
                  cityList:  _this.data.cityList.concat(city_list.lists[i].city)
                });
              };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "city": //地市
        _this.setData({ cityValue: _this.data.cityList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '3', grfiled:'city',grtext:_this.data.cityValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let county_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              console.log(county_list)
              // 现将之前招聘单位名称选项中报考职位内容清空
              _this.setData({
                countyList:  []
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
      case "county": //县区
        _this.setData({ countyValue: _this.data.countyList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '4', grfiled:'county',grtext:_this.data.countyValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let plan_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              console.log(plan_list)
              // 现将之前招聘单位名称选项中报考职位内容清空
              _this.setData({
                planList:  []
              });
              // 将数据添加到已清空的报考职位中
              for( var i=0; i<plan_list.lists.length; i++ ){
                _this.setData({
                  planList:  _this.data.planList.concat(plan_list.lists[i].plan)
                });
              };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "plan": //计划
        _this.setData({ planValue: _this.data.planList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '5', grfiled:'plan',grtext:_this.data.planValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let stage_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              console.log(stage_list)
              // 现将之前招聘单位名称选项中报考职位内容清空
              _this.setData({
                stageList:  []
              });
              // 将数据添加到已清空的报考职位中
              for( var i=0; i<stage_list.lists.length; i++ ){
                _this.setData({
                  stageList:  _this.data.stageList.concat(stage_list.lists[i].stage)
                });
              };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "stage": //学段
        _this.setData({ stageValue: _this.data.stageList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '6', grfiled:'stage',grtext:_this.data.stageValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let subject_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              console.log(subject_list)
              // 现将之前招聘单位名称选项中报考职位内容清空
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
      case "subject": //学科
        _this.setData({ subjectValue: _this.data.subjectList[e.detail.index] })
        break
    }
  },

  // 搜索
  async seach_result() {
    let url = "result/index?" + this.data.suffixStr
    if (this.data.yearValue !== "") url += "&year=" + this.data.yearValue
    if (this.data.cityValue !== "") url += "&city=" + this.data.cityValue
    if (this.data.countyValue !== "") url += "&county=" + this.data.countyValue
    if (this.data.planValue !== "") url += "&plan=" + this.data.planValue
    if (this.data.stageValue !== "") url += "&stage=" + this.data.stageValue
    if (this.data.subjectValue !== "") url += "&subject=" + this.data.subjectValue
    wx.reLaunch({ url })
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
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })
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
          // 录入招聘单位名称里的单位，不用提前清空，因为只进行一次获取
          for(var i=0; i<list.lists.length; i++ ){
            _this.setData({
              yearList:  _this.data.yearList.concat(list.lists[i].year)
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
