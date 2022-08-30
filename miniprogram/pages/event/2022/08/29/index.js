// pages/event/2022/08/29/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串
    },

    // 处理点击事件函数
    view: function (e) {
        wx.openEmbeddedMiniProgram({
            appId: 'wxbb649293a97fa28a',
            path: `pages/index/index?q=${encodeURIComponent(`https://daka.offcn.com/?sid=${e.currentTarget.dataset.sid}&courseid=${e.currentTarget.dataset.courseid}&scancode_time=${Math.round(new Date().valueOf() / 1000)}&${this.data.suffixStr}`)}`,
            fail: (err) => {
                if (err.errMsg && err.errMsg === 'openEmbeddedMiniProgram:fail cancel') {
                    wx.showToast({ icon: 'error', title: '您拒绝了跳转' })
                } else {
                    getApp().methods.handleError({ err, title: '跳转失败', content: '请稍后再试', reLaunch: false });
                }
            }
        });
    },

    /**
     * 监听页面滚动函数
     * 用于 显示 header / 隐藏 header
     */
    onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取后缀
        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            // 保存后缀信息
            this.setData(res);
            wx.hideLoading(); // 隐藏 loading
        }).catch(err => {
            wx.hideLoading(); // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取后缀失败', reLaunch: true });
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})