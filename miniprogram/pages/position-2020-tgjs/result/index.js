const app = getApp()

Page({
  data: {
    suffix: "", // 后缀
    showId: -1, // 当前显示的元素的 ID

    query: {}, // 查询条件
    skip: 0, // 跳过的条数
    total: 0, // 结果总数
    result: [], // 查询结果
  },

  // 在页面发生滚动时，计算是否需要切换标题栏样式
  onPageScroll: function (e) {
    this.selectComponent('#navigation').swtichNavigation(e)
  },

  more: function (event) {
    this.setData({
      showId: event.currentTarget.dataset.index
    })
  },

  // 上拉刷新
  onReachBottom() {
    if (this.data.skip >= this.data.total) {
      wx.showToast({ title: '没有更多数据啦', icon: 'none' })
      return
    }

    // 查询最大数量
    wx.showLoading({ title: '查询中...', mask: true })
    wx.cloud.database().collection('position2020TGJS').where(this.data.query).get({
      success: res => {
        console.log(res)
        wx.hideLoading() // 隐藏 loading
        if (res.errMsg !== "collection.get:ok") {
          getApp().methods.handleError({ err: res, title: "出错啦", content: res.errMsg, reLaunch: true })
        } else {
          this.setData({ skip: this.data.skip + res.data.length, result: this.data.result.concat(res.data) })
        }
      },
      fail: err => {
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询结果数量失败', reLaunch: true })
      }
    })
  },

  onLoad: function (options) {
    // 获取后缀
    if (typeof options.scene !== "undefined") this.setData({ suffix: options.scene })

    // 配置查询条件
    if (typeof options.year !== "undefined" && options.year !== "不限") this.setData({ "query.year": options.year })
    if (typeof options.address !== "undefined" && options.address !== "不限") this.setData({ "query.address": options.address })
    if (typeof options.level !== "undefined" && options.level !== "不限") this.setData({ "query.level": options.level })
    if (typeof options.major !== "undefined" && options.major !== "不限") this.setData({ "query.major": options.major })

    // 查询最大数量
    wx.showLoading({ title: '查询数量...', mask: true })
    wx.cloud.database().collection('position2020TGJS').where(this.data.query).count({
      success: res => {
        wx.hideLoading() // 隐藏 loading
        if (res.errMsg !== "collection.count:ok") {
          getApp().methods.handleError({ err: res, title: "出错啦", content: res.errMsg, reLaunch: true })
        } else {
          this.setData({ total: res.total })
          // 执行查询
          this.onReachBottom()
        }
      },
      fail: err => {
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询结果数量失败', reLaunch: true })
      }
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '特岗教师历年职位筛选',
      path: "/pages/position-2020-tgjs/index?scene=" + this.data.suffix,
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/position/2020/tgjs/share.1116.jpg'
    }
  },
})