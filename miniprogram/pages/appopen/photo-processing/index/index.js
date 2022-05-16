// pages/photo-processing/index/index.js
Page({
    current: 1, // 当前页面
    total: 0, // 总数

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        configs: [], // 照片处理配置
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        // 获取规格配置
        wx.showLoading({ title: '获取规格配置', mask: true })
        wx.request({
            url: `${getApp().globalData.configs.apis.base}/photo-processing/config/list?appid=${getApp().globalData.configs.appid}&current=${this.current}`,
            success: res => {
                if (res.statusCode !== 200 || !res.data.success) {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取规格配置失败', reLaunch: true })
                } else {
                    this.current += 1;
                    this.total = res.data.total;
                    this.setData({ configs: res.data.data }, wx.hideLoading());
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取规格配置失败', reLaunch: true })
            }
        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.configs.length < this.Total) {
            // 获取配置
            wx.showLoading({ title: '获取规格配置', mask: true })
            wx.request({
                url: `${getApp().globalData.configs.apis.base}/photo-processing/config/list?appid=${getApp().globalData.configs.appid}&current=${this.current}`,
                success: res => {
                    if (res.statusCode !== 200 || !res.data.success) {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取规格配置失败', reLaunch: true })
                    } else {
                        this.current += 1;
                        this.total = res.data.total;
                        this.setData({ configs: [...this.data.configs, ...res.data.data] }, wx.hideLoading());
                    }
                },
                fail: err => {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '获取规格配置失败', reLaunch: true })
                }
            })
        } else {
            wx.showToast({ title: '没有更多数据啦', icon: 'none' })
        }
    },

    // 跳转到详情页面
    gotoDetail: function (e) {
        wx.navigateTo({ url: `../detail/index?id=${e.detail.id}${this.data.suffixStr ? `&${this.data.suffixStr}` : ''}` });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '中公证件照',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '中公证件照'
        }
    }
})