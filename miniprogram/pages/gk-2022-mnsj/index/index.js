const CONFIG = require('../bargain');   // 调取zg99表中数据的链接
Page({
  data: {
    banner:'http://jl.offcn.com/zg/ty/images/exam-helper/zl-2022gk-mnsj/index1.jpg', // 背景
  },
  // 登陆
  login: function (event) {
    getApp().methods.newLogin({event, crmEventFormSID: CONFIG.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${CONFIG.CRMEventID}`, callback: ({ phone, openid }) => {
      this.setData({ phone, openid });
      this.getUserProfile()
    }});
  },
  // 点击领取
  getUserProfile(res) {
    // 点击时录入zg99表单中，成功后跳转到邀请页面
    wx.request({
      url: CONFIG.registAPI,
      data: {
        phone: this.data.phone,
      },
      success: res => {
        this.writeyqAPI()
      }
    });
  },
  // 录入邀请表 writeyqAPI
  writeyqAPI(){
    wx.request({                                      // 网络请求
      url: CONFIG.writeyqAPI,                         // 写入邀请列表
      data: {
        phone: this.data.phone,                       // 手机号
        spid: CONFIG.spid,                                   // 获取spid
        suffix:this.data.suffixStr,                      // 后缀
        sstime: Math.round(new Date() / 1000),        // 时间
      },
      success: res => {
        let text = res.data;
        let result_text = text.substring(1, text.length - 1);
        let result = JSON.parse(result_text);          // json转换为字符串数组
        console.log(result)
        if (result.status == 1 || result.status == 2) {
          wx.navigateTo({
            url: "../bargain/index?" + this.data.suffixStr + "&phone=" + this.data.phone
          })
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    });
  },
  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: async function (options) {
    const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
    this.setData({suffixInfo}); // 保存后缀信息
    this.setData({ contactInformation: await getApp().methods.getContactInformation(suffixInfo) }); // 获取推广信息
    // 判断是否是单页模式
    if (wx.getLaunchOptionsSync().scene !== 1154 && CONFIG.CRMEFSID.length === 32) {
      // 获取登陆状态
      getApp().methods.newLoginCheck({ 
        crmEventFormSID: CONFIG.CRMEFSID, 
        suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, 
        remark: `活动表单ID:${CONFIG.CRMEventID}`, 
        callback: ({ phone, openid }) => {
          this.setData({ phone, openid }); 
        } 
      });
    }
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title:CONFIG.title
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

  // 第一页，禁止分享
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return {
  //     title: this.data.title,
  //     imageUrl: this.data.imageUrl,
  //   }
  // },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  // onShareTimeline: function () {
  //   return {
  //     title: this.data.title,
  //   }
  // }
})
