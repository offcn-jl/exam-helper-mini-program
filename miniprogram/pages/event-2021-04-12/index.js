// pages/event-2021-04-12/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suffix: "",
    phone: "",
  },

  /**
   * 用户登陆
   */
  login: function (e) {
    // 判断是否授权使用手机号
    if (e.detail.errMsg !== 'getPhoneNumber:ok') {
      getApp().methods.handleError({ err: e, title: "出错啦", content: "需要您同意授权获取手机号码后才能完成登陆～" })
      return
    }

    // 弹出 Loading
    wx.showLoading({ title: '登陆中...', mask: true })

    // 提交 cloudID, 换取手机号
    wx.cloud.callFunction({
      name: 'register-without-push',
      data: { cloudID: wx.cloud.CloudID(e.detail.cloudID) },
      success: cloudFunctionRes => {
        if (cloudFunctionRes.errMsg === "cloud.callFunction:ok") {
          if (cloudFunctionRes.result.msg !== "Success") {
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: cloudFunctionRes, title: "出错啦", content: cloudFunctionRes.result.msg })
          } else {
            // 保存注册记录到数据库
            wx.cloud.database().collection('user2022gkqh').add({
              data: { phone: cloudFunctionRes.result.phone, createdTime: new Date(), suffix: this.data.suffix }
            }).then(collectionAddRes => {
              wx.hideLoading() // 隐藏 loading
              if (collectionAddRes.errMsg == 'collection.add:ok') {
                this.setData({ phone: cloudFunctionRes.result.phone });
                wx.showModal({
                  title: '提示',
                  content: '登陆成功，请您再次点击页面领取资料～',
                  showCancel: false,
                  confirmText: "我知道啦"
                })
              } else {
                getApp().methods.handleError({ err: collectionAddRes, title: "出错啦", content: collectionAddRes.errMsg })
              }
            }).catch(err => {
              wx.hideLoading() // 隐藏 loading
              getApp().methods.handleError({ err: err, title: "出错啦", content: "创建用户失败" })
            })
          }
        } else {
          wx.hideLoading() // 隐藏 loading
          getApp().methods.handleError({ err: callFunctionRes, title: "出错啦", content: callFunctionRes.result.error })
        }
      },
      fail: err => {
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: "调用云函数出错" })
      }
    })
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '2022国家公务员启航计划',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/04/12/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2022国家公务员启航计划'
    }
  }
})