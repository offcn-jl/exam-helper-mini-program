// pages/index/index.js

// tmplIds 订阅消息模板 ID 列表
const tmplIds = ["xw2ibPJOY1MUEDWW9mqZT-zP2ZnnLV4GJL2jFnBVXCw"]

Page({
  /**
   * 页面的初始数据
   */
  data: {
    suffix: "", // 后缀
    exams: [
      "国家公务员",
      "吉林公务员",
      "事业单位",
      "医疗招聘",
      "教师招聘",
      "特岗教师",
      "教师资格",
      "银行考试",
      "三支一扶",
      "公选遴选",
      "社会工作",
      "会计取证",
      "军队文职",
      "军人考试",
      "医学考试",
      "农信社",
      "选调生",
      "招警",
      "国企"
    ], // 考试项目
    subscribedExams: [], // 已经预约的考试项目
    checkedExams: [], // 已经选中的考试项目
    phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
    openID: "", // 用户 openID , 预约函数执行完成后哦设置, 已经预约的用户在完成预约后也会设置
  },

  // 监听 选择感兴趣的考试
  checkboxChange: function (e) {
    this.setData({
      checkedExams: e.detail.value
    })
  },

  // 在页面发生滚动时，计算是否需要切换标题栏样式
  onPageScroll: function (e) {
    this.selectComponent('#navigation').swtichNavigation(e)
  },

  // register 注册
  register: function (e) {
    getApp().methods.registerWithoutPush(e, this.data.suffix, "考试公告订阅", phone => {
      this.setData({ phone })
      wx.showModal({ title: '提示', content: '注册成功，请您点击“订阅”按钮完成订阅～', showCancel: false, confirmText: "我知道啦" })
    })
  },

  // subscribe 订阅
  subscribe() {
    let _this = this, suffix = this.data.suffix, phone = this.data.phone, subscribe = this.data.checkedExams/*, tmplIds = tmplIds*/

    // 获取用户配置
    wx.getSetting({
      withSubscriptions: true,
      success(res) {
        // 判断订阅消息总开关
        if (!res.subscriptionsSetting.mainSwitch) {
          // 订阅消息总开关是关闭的
          // 提示用户是否打开设置后打开开关
          openSubscribeMainSwitchTips(res)
        } else {
          // 订阅消息的总开关是开启的
          // 判断有没有勾选不再询问
          if (!res.subscriptionsSetting.itemSettings) {
            // 没有勾选不再询问
            // 弹出授权窗口
            wx.requestSubscribeMessage({
              tmplIds,
              complete: e => {
                if (e.errMsg !== "requestSubscribeMessage:ok") {
                  // 发生错误
                  getApp().methods.handleError({
                    err: e,
                    title: "出错啦",
                    content: e.errMsg
                  })
                } else {
                  handelSubscribeSettingItems(e)
                }
              }
            })
          } else {
            // 勾选了不再询问
            // 判断配置的消息列表中是否有被拒绝的
            // 存在被拒绝的则弹出提示
            // 不存在被拒绝的则保存订阅记录
            handelSubscribeSettingItems(res.subscriptionsSetting)
          }
        }
      }
    })

    // openSubscribeMainSwitchTips 提醒用户打开订阅消息开关
    let openSubscribeMainSwitchTips = e => {
      if (!e.subscriptionsSetting.mainSwitch) {
        // 订阅消息总开关是关闭的
        // 提示用户是否打开设置后打开开关
        wx.showModal({
          title: '提示',
          content: '您关闭了发送订阅消息功能，是否前往开启？',
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                withSubscriptions: true,
                success: res => openSubscribeMainSwitchTips(res)
              })
            }
          }
        })
      } else {
        wx.showModal({
          title: '提示',
          content: '您成功开启了订阅消息功能，请再次点击订阅按钮完成订阅～',
          showCancel: false,
          confirmText: "我知道啦"
        })
      }
    }

    // handelSubscribeSettingItems 检查订阅消息配置列表
    let handelSubscribeSettingItems = items => {
      let reject = false
      for (let i = 0; i < tmplIds.length; i++) {
        if (items[tmplIds[i]] !== "accept") {
          reject = true
          break
        }
      }
      if (reject) {
        wx.showModal({
          title: '订阅失败',
          content: '获取订阅消息授权失败，可能是您设置了"拒绝并不再询问"？',
          confirmText: "修改设置",
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                withSubscriptions: true,
                success: res => {
                  console.log(res)
                  if (typeof res.subscriptionsSetting.itemSettings !== "undefined") {
                    // 有不再提示的记录，再次进行检查
                    handelSubscribeSettingItems(res.subscriptionsSetting.itemSettings)
                  } else {
                    // 没有不再提示的记录
                    // 提醒用户打开订阅消息开关
                    openSubscribeMainSwitchTips(res)
                  }
                }
              })
            }
          }
        })
      } else {
        // 订阅消息
        wx.requestSubscribeMessage({ tmplIds })
        // 保存订阅记录
        wx.showLoading({ title: '订阅中...', mask: true }) // 弹出 Loading
        // 判断是否存在订阅记录
        wx.cloud.database().collection('subscribeExam').get().then(collectionGetRes => {
          if (collectionGetRes.errMsg == 'collection.get:ok') {
            console.log(collectionGetRes)
            // 查询成功
            if (collectionGetRes.data.length === 0) {
              // 没有预约记录, 新建预约记录
              wx.cloud.database().collection('subscribeExam').add({
                data: { suffix, phone, subscribe, tmplIds, createdTime: new Date(), updatedTime: new Date() }
              }).then(collectionAddRes => {
                if (collectionAddRes.errMsg == 'collection.add:ok') {
                  let subscribedExams = []
                  this.data.exams.forEach(exam => {
                    for (let i = 0; i < subscribe.length; i++) {
                      if (exam === subscribe[i]) {
                        subscribedExams.push(true)
                        return
                      }
                    }
                    subscribedExams.push(false)
                  })
                  this.setData({ subscribedExams, openID: "-" })
                  wx.showToast({ title: '订阅成功', icon: 'success' })
                } else {
                  wx.hideLoading() // 隐藏 loading
                  getApp().methods.handleError({ err: collectionAddRes, title: "出错啦", content: collectionAddRes.errMsg })
                }
              }).catch(err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: "保存订阅记录失败" })
              })
            } else {
              // 存在预约记录, 判断是否需要更新预约记录
              if (collectionGetRes.data[0].suffix === suffix && collectionGetRes.data[0].phone === phone && collectionGetRes.data[0].subscribe.sort().toString() === subscribe.sort().toString() && collectionGetRes.data[0].tmplIds.sort().toString() === tmplIds.sort().toString()) {
                // 预约记录一致, 无需更新
                wx.showToast({ title: '成功', icon: 'success' })
              } else {
                wx.cloud.database().collection('subscribeExam').where({ _id: collectionGetRes.data[0]._id }).update({
                  data: { suffix, phone, subscribe, tmplIds, updatedTime: new Date() }
                }).then(collectionUpdateRes => {
                  if (collectionUpdateRes.errMsg == 'collection.update:ok') {
                    _this.setData({ openID: collectionGetRes.data[0]._openid })
                    wx.showToast({ title: '成功', icon: 'success' })
                  } else {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: collectionUpdateRes, title: "出错啦", content: collectionUpdateRes.errMsg })
                  }
                }).catch(err => {
                  wx.hideLoading() // 隐藏 loading
                  getApp().methods.handleError({ err: err, title: "出错啦", content: "更新订阅记录失败" })
                })
              }
            }
          } else {
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: collectionGetRes, title: "出错啦", content: collectionGetRes.errMsg })
          }
        }).catch(err => {
          wx.hideLoading() // 隐藏 loading
          getApp().methods.handleError({ err: err, title: "出错啦", content: "查询订阅记录失败" })
        })
      }
    }
  },

  // unsubscribe 取消订阅, 软取消
  unsubscribe() {
    let _this = this
    wx.showModal({
      title: '提示',
      content: '您确定退订全部考试项目吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({ title: '退订中...', mask: true }) // 弹出 Loading
          wx.cloud.database().collection('subscribeExam').where({ _openid: _this.data.openID }).update({
            data: { suffix: _this.data.suffix, phone: _this.data.phone, subscribe: [], tmplIds: [], updatedTime: new Date() }
          }).then(collectionUpdateRes => {
            if (collectionUpdateRes.errMsg == 'collection.update:ok') {
              // 退订成功
              wx.showToast({ title: '退订成功', icon: 'success' })
              _this.setData({ subscribedExams: [] })
              wx.hideLoading() // 隐藏 loading
            } else {
              wx.hideLoading() // 隐藏 loading
              getApp().methods.handleError({ err: collectionUpdateRes, title: "出错啦", content: collectionUpdateRes.errMsg })
            }
          }).catch(err => {
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: "更新订阅记录失败" })
          })
        }
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

    getApp().methods.login(phone => this.setData({ phone })) // 登陆

    // 弹出 Loading
    wx.showLoading({ title: '加载中...', mask: true })
    // 判断是否存在订阅记录
    wx.cloud.database().collection('subscribeExam').get().then(collectionGetRes => {
      if (collectionGetRes.errMsg == 'collection.get:ok') {
        wx.hideLoading() // 隐藏 loading
        // 查询成功
        if (collectionGetRes.data.length !== 0) {
          // 存在预约记录
          if (collectionGetRes.data[0].subscribe.length !== 0) {
            let subscribedExams = []
            this.data.exams.forEach(exam => {
              for (let i = 0; i < collectionGetRes.data[0].subscribe.length; i++) {
                if (exam === collectionGetRes.data[0].subscribe[i]) {
                  subscribedExams.push(true)
                  return
                }
              }
              subscribedExams.push(false)
            })
            this.setData({ subscribedExams, openID: collectionGetRes.data[0]._openid })
          }
        }
      } else {
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: collectionGetRes, title: "出错啦", content: collectionGetRes.errMsg })
      }
    }).catch(err => {
      wx.hideLoading() // 隐藏 loading
      getApp().methods.handleError({ err: err, title: "出错啦", content: "查询订阅记录失败" })
    })
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
      title: '公告订阅',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/subscribe/summary-page/share.1114.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '免费考试公告订阅服务'
    }
  }
})