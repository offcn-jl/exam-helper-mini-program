// pages/sk-2021/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    config: {},
    suffix: ""
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

    // 获取配置
    wx.showLoading({ title: '获取配置', mask: true })
    wx.cloud.database().collection('summary').where({type: "2022-gk", version: wx.cloud.database().command.exists(true)}).orderBy("version","desc").limit(1).get({
      success: res => {
        // 如果直播列表中有数据, 则对直播列表进行遍历，将直播时间格式化
        if (res.data[0].lives && res.data[0].lives.length > 0) {
          res.data[0].lives.forEach((value, index)=>{
            res.data[0].lives[index].timeString = value.time.getDate() + '日' + value.time.getHours() + ":" + (value.time.getMinutes()+"").padStart(2,"0");
          })
        }
        // 处理主 Banner 配置
        if (res.data[0].banner.main.type === 'miniProgram') {
          res.data[0].banner.main.path = res.data[0].banner.main.path.replace('$suffix', this.data.suffix);
        }
        // 处理工具配置
        if (res.data[0].tools && res.data[0].tools.length > 0) {
          res.data[0].tools.forEach((value, index)=>{
            // 判断是否是外部跳转
            if (value.path) {
              // 填充外部跳转路径中的后缀
              res.data[0].tools[index].path = value.path.replace('$suffix', this.data.suffix);
            }
          })
        }
        // 处理 小 Banner 配置
        if (res.data[0].banner.small.length > 0) {
          res.data[0].banner.small.forEach((value, index)=>{
            // 判断是否是外部跳转
            if (value.path) {
              // 填充外部跳转路径中的后缀
              res.data[0].banner.small[index].path = value.path.replace('$suffix', this.data.suffix);
            }
          })
        }
        // 处理底部 Banner 配置
        if (res.data[0].banner.bottom.type === 'miniProgram') {
          res.data[0].banner.bottom.path = res.data[0].banner.bottom.path.replace('$suffix', this.data.suffix);
        }
        // 将配置信息保存
        this.setData({
          config: res.data[0]
        })
        wx.hideLoading() // 隐藏 loading
      },
      fail: err => {
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询配置失败', reLaunch: true })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '2022国家公务员考试备考工具箱',
      imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/summary/2022/gk/share.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2022国家公务员考试备考工具箱'
    }
  }
})