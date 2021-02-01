// pages/ntalk/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suffix: "",
    settingid: "",
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

    wx.showLoading({ title: '获取配置', mask: true })

    // 获取咨询组配置
    wx.request({
      url: 'https://tsf.tencent.jilinoffcn.com/release/sso/v2/sessions/info/1/' + ( options.scene ? options.scene : '0' ) + '/0',
      success: res => {
        this.setData({
          settingid: res.data.NTalkerGID
        })
        wx.hideLoading() // 隐藏 loading
      },
      fail: err => {
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询配置失败', reLaunch: true })
      }
    })
  }
})