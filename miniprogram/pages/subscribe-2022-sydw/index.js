// pages/index/index.js

Page({
  /**
   * 页面的初始数据
   */
  data: {
    CRMEFSID: "b3f893c2fb99f62bc6fb2a400ec2b695", // CRM 活动表单 ID
    CRMEventID: "HD202112061488", // CRM 注释 网站专题页-2022年公告预约查询/108862
    title:'2022事业单位考试公告订阅', // 标题
    banner:'http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/subscribe-2022sydw-index.jpg', // 背景
    imageUrl:'http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/subscribe-2022sydw-share.jpg', // 分享图
    type:'事业单位', //服务类型  （国家公务员，吉林公务员，事业单位，医疗招聘，教师招聘，特岗教师，教师资格，银行考试，三支一扶，公选遴选，社会工作，会计取证，军队文职，军人考试，医学考试，农信社，选调生，招警，国企）

    cityList: ["不限", "省直", "长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"], // 地市
    typeList: ["不限", "综合岗", "教师岗", "医疗岗"], // 岗位类别

    cityValue: "未知", // 地市 选中内容
    typeValue: "未知", // 岗位类别 选中内容

    phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
    tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅

    qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_f20080360b5c.jpg", // 二维码地址
  },
  
  // 监听筛选条件切换
  m_select_touch(e) {
    switch (e.detail.type) {
      case "city": // 地市
        this.setData({ cityValue: this.data.cityList[e.detail.index] })
        break
      case "type": // 岗位类别
        this.setData({ typeValue: this.data.typeList[e.detail.index] })
        break
    }
  },

  // 登陆
  login: function (event) {
    if (this.data.cityValue === "未知") {
      getApp().methods.handleError({
        err: e.detail.errMsg,
        title: "出错啦",
        content: "请您选择意向报考地市"
      })
      return
    }
    if (this.data.typeValue === "未知") {
      getApp().methods.handleError({
        err: e.detail.errMsg,
        title: "出错啦",
        content: "请您选择意向报考岗位类别"
      })
      return
    }
    getApp().methods.newLogin({event, crmEventFormSID: this.data.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${this.data.CRMEventID}，意向报考地市:${this.data.CRMEventID}，意向报考岗位类别:${this.data.typeValue}`, callback: ({ phone, openid }) => {
      this.setData({ phone, openid });
        wx.showModal({ title: '提示', content: '注册成功，请您点击“点击登陆”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" });
    }});
  },

  // subscribe 订阅
  subscribe() {
    getApp().methods.subscribeSingleExam(this.data.suffix, this.data.type, undefined, ()=>{
      this.setData({tipsToSubscribeMessaged: true});
    })
  },

  // 保存二维码
  saveQrCode: function () {
    wx.showLoading({ title: '保存中...' })
    wx.downloadFile({
      url: this.data.qrCodePath,
      success: function (res) {
        if (res.statusCode === 200) {
          wx.hideLoading()
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              wx.showModal({
                content: '二维码已保存到相册，赶紧打开微信扫一扫扫描识别吧~',
                showCancel: false,
                confirmText: '好的',
                confirmColor: '#333'
              })
            },
            fail: err => {
              getApp().methods.handleError({ err: err, title: '保存二维码失败', content: err.errMsg, reLaunch: false })
            } 
          })
        } else {
          wx.hideLoading()
          wx.showToast({ icon: 'none', title: '下载二维码失败' })
        }
      },
      fail: err => {
        wx.hideLoading()
        getApp().methods.handleError({ err: err, title: '下载二维码失败', content: err.errMsg, reLaunch: false })
      } 
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    console.log(options)
    // 获取后缀
    if (typeof options.scene !== "undefined") {
      this.setData({
        suffix: options.scene
      })
    }
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
    // 获取后缀
    if (typeof options.scode !== "undefined") {
      switch (options.scode) {
        case "lX5VoC": // 长春
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_add46704ba47.jpg"})
          break;
        case "dkIirz": // 吉林
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_7e4d23d6cb71.jpg"})
          break;
        case "cuAqQy": // 松原
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_b8e86c971062.jpg"})
          break;
        case "h17IWN": // 四平
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_d7dbf24608dd.jpg"})
          break;
        case "htGlHB": // 延边
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_32164b3c126f.jpg"})
          break;
        case "hvEtbX": // 白城
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_eddfcd2f2e0e.jpg"})
          break;
        case "gX25cd": // 辽源
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_18c518f90852.jpg"})
          break;
        case "gWw8tb": // 白山
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_590d65e03823.jpg"})
          break;
        case "ht54zE": // 通化
          this.setData({qrCodePath: "https://download.cos.jilinoffcn.com/public/qr-code/gh_10981ab4bd0f.jpg"})
          break;
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      imageUrl: this.data.imageUrl
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.data.title
    }
  }
})