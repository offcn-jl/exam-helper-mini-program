// pages/photo-processing/components/configs.js
Component({
    current: 1, // 当前页面
    total: 0, // 总数

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        // 图标列表
        // 属性名使用 epr 考试项目 id
        // 可以自动匹配到考试项目上
        icons: {
            // '0': 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-tycc.png',
            // '1': 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-gwy.png',
            // '2': 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-sydw.png',
            // '3': 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-jszgz.png',
            // '4': 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-tgjs.png',
            // '5': 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/configs-qtks.png',
        },
        categories: [],
        currentCategory: {},
        configs: [],
    },

    attached: function () {
        // 获取考试项目列表
        wx.showLoading({ title: '获取考试项目列表', mask: true })
        wx.request({
            url: `${getApp().globalData.configs.apis.base}/photo-processing/exam/list?appid=${getApp().globalData.configs.appid}`,
            success: res => {
                if (res.statusCode !== 200 || !res.data.success) {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取规格配置失败', reLaunch: true })
                } else {
                    this.setData({
                        categories: res.data.data.map(node => {
                            return {
                                id: node.ownerErpExamId,
                                name: node.ownerErpExamName,
                                icon: this.data.icons[node.ownerErpExamId] ? this.data.icons[node.ownerErpExamId] : this.data.icons['0'],
                            }
                        })
                    }, () => {
                        // 设置被选中菜单项目为菜单中的第一项
                        this.setData({ currentCategory: this.data.categories[0] });
                        // 请求第一项菜单中的数据
                        // 获取配置
                        wx.showLoading({ title: '获取规格配置', mask: true })
                        wx.request({
                            url: `${getApp().globalData.configs.apis.base}/photo-processing/config/list?appid=${getApp().globalData.configs.appid}&current=${this.current}&ownerErpExamId=${this.data.categories[0].id}`,
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
                    })
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取规格配置失败', reLaunch: true })
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
            this.current = 1;
            this.total = 0;
            // 获取配置
            wx.showLoading({ title: '获取规格配置', mask: true })
            // 请求规格数据
            wx.request({
                url: `${getApp().globalData.configs.apis.base}/photo-processing/config/list?appid=${getApp().globalData.configs.appid}&current=${this.current}&ownerErpExamId=${e.detail.id}`,
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
        // 到达页面底端 加载更多配置
        loadMore: function (e) {
            if (this.data.configs.length < this.Total) {
                // 获取配置
                wx.showLoading({ title: '获取规格配置', mask: true })
                wx.request({
                    url: `${getApp().globalData.configs.apis.base}/photo-processing/config/list?appid=${getApp().globalData.configs.appid}&current=${this.current}&ownerErpExamId=${this.data.currentCategory.name}`,
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
        // 传递事件
        chooseConfig: function (e) {
            this.triggerEvent("chooseConfig", e.detail);
        }
    }
})
