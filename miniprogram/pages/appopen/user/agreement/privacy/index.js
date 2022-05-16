Page({

    /**
     * 页面的初始数据
     */
    data: {
      src: "", // 隐私协议页面链接
      htmlSnip: "", // html
    },

    webViewPage: function() {
      this.setData({
        src: `${getApp().globalData.configs.apis.base.replace("/wechat/mini-program","")}/agreement/privacy?type=html`
      });
    },

    richText: function() {
      const _this = this;
      // 获取协议内容
      wx.showLoading({ title: '获取详情', mask: true })
      wx.request({
          url: `${getApp().globalData.configs.apis.base.replace("/wechat/mini-program","")}/agreement/privacy?type=json`,
          success: res => {
              wx.hideLoading(); // 隐藏 loading
              if (res.statusCode !== 200 || !res.data.success) {
                  getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取协议失败，请稍后再试', reLaunch: true })
              } else {
                  _this.setData({htmlSnip: res.data.data});
              }
          },
          fail: err => {
              wx.hideLoading() // 隐藏 loading
              getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置详情失败，请稍后再试', reLaunch: true })
          }
      });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

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

    }
})