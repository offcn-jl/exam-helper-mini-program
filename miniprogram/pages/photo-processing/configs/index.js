// pages/photo-processing/configs/index.js
Page({
    inputValue: '',
    currentPage: 1, // 当前页面
    Total: 0, // 总数

    /**
     * 页面的初始数据
     */
    data: {
        suffix: '', // 推广后缀
        statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
        showSearchResults: false,
        configs: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (typeof options.scene !== "undefined") this.setData({ suffix: options.scene }); // 获取后缀
    },

    input: function (e) {
        if (e.detail.value.trim()) {
            // 打开搜索界面 情况搜索结果
            this.setData({ showSearchResults: true, searchResults: [] })
            // 保存搜索条件
            this.inputValue = e.detail.value.trim();
            // 重置指针
            this.currentPage = 1;
            this.Total = 0;
            // 获取配置
            wx.showLoading({ title: '获取配置', mask: true })
            wx.request({
                url: getApp().globalData.configs.apis.gaea + '/services/mini-program/photo-processing/configs/list?page=' + this.currentPage + '&search=' + e.detail.value.trim(),
                success: res => {
                    if (res.statusCode !== 200 || res.data.Message !== "Success") {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.Message ? res.data.Message : '获取配置失败', reLaunch: true })
                    } else {
                        this.currentPage += 1;
                        this.Total = res.data.Total;
                        this.setData({ configs: res.data.Data }, wx.hideLoading());
                    }
                },
                fail: err => {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置失败', reLaunch: true })
                }
            })
        } else {
            // 关闭搜索界面
            this.setData({ showSearchResults: false })
        }
    },

    // 到达页面底端 加载更多配置
    loadMore: function (e) {
        if (this.data.configs.length < this.Total) {
            // 获取配置
            wx.showLoading({ title: '获取配置', mask: true })
            wx.request({
                url: getApp().globalData.configs.apis.gaea + '/services/mini-program/photo-processing/configs/list?page=' + this.currentPage + '&search=' + this.inputValue,
                success: res => {
                    if (res.statusCode !== 200 || res.data.Message !== "Success") {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.Message ? res.data.Message : '获取配置失败', reLaunch: true })
                    } else {
                        this.currentPage += 1;
                        this.Total = res.data.Total;
                        this.setData({ configs: [...this.data.configs, ...res.data.Data] }, wx.hideLoading());
                    }
                },
                fail: err => {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置失败', reLaunch: true })
                }
            })
        } else {
            wx.showToast({ title: '没有更多数据啦', icon: 'none' })
        }
    },
    
    // 跳转到详情页面
    gotoDetail: function (e) {
        wx.navigateTo({ url: '../detail/index?scene=' + this.data.suffix + '*' + e.detail.ID })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '中公证件照',
            path: '/pages/photo-processing/index/index',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    },
})