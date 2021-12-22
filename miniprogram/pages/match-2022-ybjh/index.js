Page({
  data: {
    title:"2022银保监会进面分数线查询",// 标题
    banner_bk:"http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/2022-ybjh-index.jpg",// 背景图片
    imageUrl:"http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/2022-ybjh-share.jpg",// 分享时显示的图片
    CRMEFSID: "6a1b90a06693db033f7d3954a4a78e4f", // CRM 活动表单 ID
    CRMEventID: "HD202112100630", // CRM 注释  网站专题页-2022银保监会进面分数线查询、109617
    actid:"5458", //zg99id  

    yearList:['2020','2019'], // 年份
    proList: [],//省份
    addressList: [],//招录机构
    areaList: [],//用人司局
    positionList: [],//招考职位

    yearValue:'', // 年份
    proValue: '', //省份
    addressValue: '', //招录机构
    areaValue: '',//用人司局
    positionValue: '',//招考职位

    suffixStr: "", // 后缀
    phone: "", // 用户手机号码
    tipsToSubscribeMessaged: true, // 是否提示过进行消息订阅
  },

  // 监听筛选条件切换(招聘单位名称做出选择以后，报考职位发生变化)
  m_select_touch(e) {
    var _this=this
    switch (e.detail.type) {
      case "pro": //招录机构
        _this.setData({ proValue: _this.data.proList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '2', grfiled:'pro',grtext:_this.data.proValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let address_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              console.log(address_list)
              // 现将之前招聘单位名称选项中报考职位内容清空
              _this.setData({
                addressList:  []
              });
              // 将数据添加到已清空的报考职位中
              for( var i=0; i<address_list.lists.length; i++ ){
                _this.setData({
                  addressList:  _this.data.addressList.concat(address_list.lists[i].address)
                });
              };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "address": //用人司局
        _this.setData({ addressValue: _this.data.addressList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '3', grfiled:'address',grtext:_this.data.addressValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let area_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              console.log(area_list)
              // 现将之前招聘单位名称选项中报考职位内容清空
              _this.setData({
                areaList:  []
              });
              // 将数据添加到已清空的报考职位中
              for( var i=0; i<area_list.lists.length; i++ ){
                _this.setData({
                  areaList:  _this.data.areaList.concat(area_list.lists[i].area)
                });
              };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "area": //招聘岗位名称
        _this.setData({ areaValue: _this.data.areaList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '4', grfiled:'area',grtext:_this.data.areaValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
              let position_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
              console.log(position_list)
              // 现将之前招聘单位名称选项中报考职位内容清空
              _this.setData({
                positionList:  []
              });
              // 将数据添加到已清空的报考职位中
              for( var i=0; i<position_list.lists.length; i++ ){
                _this.setData({
                  positionList:  _this.data.positionList.concat(position_list.lists[i].position)
                });
              };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
    }
  },

  // 搜索
  async seach_result() {
    let url = "result/index?" + this.data.suffixStr
    if (this.data.yearValue !== "") url += "&year=" + this.data.yearValue
    if (this.data.proValue !== "") url += "&pro=" + this.data.proValue
    if (this.data.addressValue !== "") url += "&address=" + this.data.addressValue
    if (this.data.areaValue !== "") url += "&area=" + this.data.areaValue
    if (this.data.positionValue !== "") url += "&position=" + this.data.positionValue
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
              proList:  _this.data.proList.concat(list.lists[i].pro)
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
