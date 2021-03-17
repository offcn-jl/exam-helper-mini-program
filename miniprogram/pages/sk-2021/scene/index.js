// pages/sk-2021-scene/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    suffix: "",
    phone: "",
  },

  // 登陆
  signIn: function (e) {
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
            wx.cloud.database().collection('user2021SKScene').add({
              data: { phone: cloudFunctionRes.result.phone, createdTime: new Date(), suffix: this.data.suffix }
            }).then(collectionAddRes => {
              wx.hideLoading() // 隐藏 loading
              if (collectionAddRes.errMsg == 'collection.add:ok') {
                this.setData({ phone: cloudFunctionRes.result.phone });
                wx.showToast({ icon: "none", title: '登陆成功' });
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

  // 浏览
  view: function (e) {
    if (e.currentTarget.dataset.book && typeof e.currentTarget.dataset.book === "string") {
      wx.showLoading({ title: '下载中...', mask: true })
      wx.cloud.downloadFile({
        fileID: 'cloud://release-yum30.7265-release-yum30-1304214848/sk/2021/scene/' + e.currentTarget.dataset.book + '.pdf',
        success: res => {
          const filePath = res.tempFilePath
          wx.openDocument({
            filePath: filePath,
            success: function (res) {
              console.log('打开文档成功')
            }
          })
          wx.hideLoading() // 隐藏 loading
        },
        fail: res => {
          app.methods.handleError({
            err: res,
            title: "出错啦",
            content: "打开失败, 请您稍后再试"
          })
          wx.hideLoading() // 隐藏 loading
        }
      })
    } else {
      wx.showToast({ icon: "none", title: '参数错误' });
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

    // 判断是否是单页模式
    if (wx.getLaunchOptionsSync().scene !== 1154) {
      // 如果不是的话则获取登陆状态
      // 弹出 Loading
      wx.showLoading({ title: '获取登陆状态', mask: true })
      // 查询手机号码
      wx.cloud.database().collection('user2021SKScene').field({ phone: true }).get({
        success: res => {
          // 判断是否查询成功
          if (res.errMsg === "collection.get:ok") {
            wx.hideLoading() // 隐藏 loading
            // 判断是否存在数据
            if (res.data.length > 0) {
              // 存在数据
              this.setData({ phone: res.data[0].phone })
              wx.showToast({ icon: "none", title: '已登陆' });
            }
          } else {
            getApp().methods.handleError({ err: res, title: "出错啦", content: res.errMsg })
            wx.hideLoading() // 隐藏 loading
          }
        },
        fail: err => {
          getApp().methods.handleError({ err: err, title: "出错啦", content: '查询注册状态失败' })
          wx.hideLoading() // 隐藏 loading
        }
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '2021吉林省考白皮书领取+试题解析峰会',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/sk/2021/scene/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2021吉林省考白皮书领取+试题解析峰会'
    }
  }
})