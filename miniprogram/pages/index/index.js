// pages/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取后缀
        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            // 保存后缀信息
            this.setData(res);
            wx.hideLoading(); // 隐藏 loading
            wx.reLaunch({ url: `/pages/sk/2023/hz/index?${res.suffixStr}` });
        }).catch(err => {
            wx.hideLoading(); // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取后缀失败', reLaunch: true });
        });
        return

        // 获取后缀
        if (typeof options.scene !== "undefined") {
            this.setData({
                suffix: options.scene
            })
        }

        // 获取配置
        wx.showLoading({ title: '获取配置', mask: true })
        wx.cloud.database().collection('index')/*.where({ version: wx.cloud.database().command.exists(true) }).orderBy("version", "desc").limit(1)*/.get({
            success: res => {
                if (res.data.length === 0) {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: res, title: "出错啦", content: '查询配置失败', reLaunch: true })
                } else {
                    // 处理主 Banner 配置
                    if (res.data[0].banner.main.type === 'miniProgram') {
                        res.data[0].banner.main.path = res.data[0].banner.main.path.replace('$suffix', this.data.suffix);
                    }
                    // 处理工具配置
                    if (res.data[0].tools && res.data[0].tools.length > 0) {
                        res.data[0].tools.forEach((value, index) => {
                            // 判断是否是外部跳转
                            if (value.path) {
                                // 填充外部跳转路径中的后缀
                                res.data[0].tools[index].path = value.path.replace('$suffix', this.data.suffix);
                            }
                        })
                    }
                    // 将配置信息保存
                    this.setData({
                        config: res.data[0]
                    })
                    wx.hideLoading() // 隐藏 loading
                    return
                    wx.showLoading({ title: '获取课程列表', mask: true })
                    // 请求 19 课堂接口调用 Sign
                    wx.request({
                        url: getApp().globalData.configs.apis.gaea + '/services/occ/sign?access-token=' + getApp().globalData.configs.token,
                        success: res => {
                            if (res.statusCode !== 200 || res.data.Message !== "Success") {
                                wx.hideLoading() // 隐藏 loading
                                getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.Message ? res.data.Message : '获取课程列表失败', reLaunch: true })
                            } else {
                                // 获取 19 课堂课程列表
                                wx.request({
                                    url: 'https://19.offcn.com/external_system_api/getcourselist/?area=8&numpage=10&page=1&short=1&sign=' + res.data.Data,
                                    success: res => {
                                        if (res.statusCode !== 200 || res.data.msg !== "获取成功") {
                                            wx.hideLoading() // 隐藏 loading
                                            getApp().methods.handleError({ res: err, title: "出错啦", content: res.data.msg ? res.data.msg : '获取课程列表失败', reLaunch: true })
                                        } else {
                                            this.setData({ "config.lives": res.data.list })
                                            wx.hideLoading() // 隐藏 loading
                                        }
                                    },
                                    fail: err => {
                                        wx.hideLoading() // 隐藏 loading
                                        getApp().methods.handleError({ err: err, title: "出错啦", content: '获取课程列表失败', reLaunch: true })
                                    }
                                })
                            }
                        },
                        fail: err => {
                            wx.hideLoading() // 隐藏 loading
                            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取课程列表失败', reLaunch: true })
                        }
                    })
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '查询配置失败', reLaunch: true })
            }
        })
    },

    /**
     * 监听页面滚动
     * 用于 显示 header / 隐藏 header
     */
    onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '为您提供简单好用的考试帮助 :)',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/index/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '中公考试助手'
        }
    }
})