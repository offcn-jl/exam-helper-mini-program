Page({
  /**
   * 页面的初始数据
   */
  data: {
    timestamp: new Date().valueOf(),

    suffix: "",
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
      title: '2021吉林省考面试小管家',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/sk/2021/interview/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2021吉林省考面试小管家'
    }
  }
})