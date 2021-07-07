// pages/photo-processing/components/configs.js
Component({
    currentPage: 1, // 当前页面
    Total: 0, // 总数

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        categories: [
            { id: 1, name: '通用尺寸', icon: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-tycc.png' },
            { id: 2, name: '公务员', icon: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-gwy.png' },
            { id: 3, name: '事业单位', icon: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-sydw.png' },
            { id: 4, name: '教师资格证', icon: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-jszgz.png' },
            { id: 5, name: '特岗教师', icon: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-tgjs.png' },
            { id: 6, name: '其他考试', icon: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-qtks.png' },
        ],
        currentCategory: {},
        configs: [],
    },

    attached: function () {
        // 设置被选中菜单项目为菜单中的第一项
        this.setData({ currentCategory: this.data.categories[0] });
        // 请求第一项菜单中的数据
        // 获取配置
        wx.showLoading({ title: '获取配置', mask: true })
        // 请求 19 课堂接口调用 Sign
        wx.request({
            url: getApp().globalData.configs.apis.gaea + '/services/mini-program/photo-processing/configs/list?page=' + this.currentPage + '&project=' + this.data.categories[0].name,
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
    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 选择类别
        chooseCategory: function (e) {
            this.setData({ currentCategory: e.detail })
            // 重置指针
            this.currentPage = 1;
            this.Total = 0;
            // 获取配置
            wx.showLoading({ title: '获取配置', mask: true })
            // 请求规格数据
            wx.request({
                url: getApp().globalData.configs.apis.gaea + '/services/mini-program/photo-processing/configs/list?page=' + this.currentPage + '&project=' + e.detail.name,
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
        },
        // 到达页面底端 加载更多配置
        loadMore: function (e) {
            if (this.data.configs.length < this.Total) {
                // 获取配置
                wx.showLoading({ title: '获取配置', mask: true })
                wx.request({
                    url: getApp().globalData.configs.apis.gaea + '/services/mini-program/photo-processing/configs/list?page=' + this.currentPage + '&project=' + this.data.currentCategory.name,
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
        // 传递事件
        chooseConfig: function (e) {
            this.triggerEvent("chooseConfig", e.detail);
        }
    }
})
