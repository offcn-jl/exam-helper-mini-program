Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      src: 'https://static.kaoyan365.cn/book_wechat/pdf_new/web/viewer.html?locale=zh-CN&downloadable=' + options.downloadable + '&file=' + options.link
    })
  },
})