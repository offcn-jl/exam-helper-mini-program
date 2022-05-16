// pages/web-view/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: "",
    suffix: {}, // 推广后缀
    suffixStr: '', // 推广后缀字符串
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息
 
    // 将页面收到的参数和后缀信息合并
    let currentSuffix = {...this.data.suffix, ...options};
    delete currentSuffix.src;

    // 把参数对象转换为字符串
    let currentSuffixStr = '';
    for (let key in currentSuffix) {
      currentSuffixStr += `${key}=${currentSuffix[key]}&`;
    }
    currentSuffixStr = currentSuffixStr.substr(0, currentSuffixStr.length - 1); // 裁剪最后一个 &

    if (options.src) {
      this.setData({ src: `${options.src}${currentSuffixStr ? `?${currentSuffixStr}` : ''}` })
    } else {
      this.setData({ src: "https://www.offcn.com" })
    }
    
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
})