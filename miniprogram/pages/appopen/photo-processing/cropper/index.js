// pages/photo-processing/clipper/index.js
Page({
    nputValue: '',

    current: 1, // 当前页面
    total: 0, // 总数

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        crmRemark: '活动表单SID:9bf5240a5a0d2150e79a08400706f59a，中公证件照，裁剪照片，', // CRM 推送备注
        crmEventFormSid: '9bf5240a5a0d2150e79a08400706f59a', // CRM 活动表单 SID

        openid: '', // 用户 openid
        phone: '', // 用户手机号码

        src: "", // 图片链接
        selectedPicture: true, // 显示重新上传提示
        showModal: false, // 显示弹窗
        configs: [], // 配置列表
        showSearchResults: false, // 配置搜索结果界面
        searchResults: [], // 搜索结果
        showDetailModal: false, // 配置详情界面
        config: {}, // 当前选中的配置
        showCrop: false, // 裁剪界面
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        // 判断是否是单页模式
        if (wx.getLaunchOptionsSync().scene !== 1154) {
            // 获取登陆状态
            getApp().methods.SSOCheck({ crmEventFormSID: this.data.crmEventFormSid, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: this.data.crmRemark, callback: ({ phone, openid }) => this.setData({ phone, openid }) });
        }
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({ crmEventFormSID: this.data.crmEventFormSid, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: this.data.crmRemark, callback: ({ phone, openid }) => this.setData({ phone, openid }, this.showModal()) });
    },

    // 选择照片
    pickPhoto: function (e) {
        const _this = this;
        this.setData({
            src: e.detail
        })
        // 在第一次选择照片时，弹出重新上传图片的提示
        wx.getStorage({
            key: "cropperSelectedPicture",
            fail: function () {
                _this.setData({ selectedPicture: false });
                wx.setStorage({ key: "cropperSelectedPicture", data: true });
            }
        });
    },

    // 选择照片 关闭提示弹窗
    closeSelectPictureTip: function () {
        this.setData({ selectedPicture: true });
    },

    // 空函数 用于阻止点击事件冒泡
    stopProp: function () { },

    // 显示弹窗
    showModal: function () {
        if (this.data.src) {
            this.setData({ showModal: true });
        } else {
            wx.showToast({ title: "请先上传照片", icon: "none" });
        }
    },

    // 隐藏弹窗
    closeModal: function () {
        this.setData({
            showModal: false,
            showSearchResults: false,
        })
    },

    // 在输入后进行搜索
    input: function (e) {
        if (e.detail.value.trim()) {
            // 打开搜索界面 清空搜索结果
            this.setData({ showSearchResults: true, searchResults: [] })
            // 保存搜索条件
            this.inputValue = e.detail.value.trim();
            // 重置指针
            this.current = 1;
            this.total = 0;
            // 获取配置
            wx.showLoading({ title: '获取规格配置', mask: true })
            wx.request({
                url: `${getApp().globalData.configs.apis.base}/photo-processing/config/list?appid=${getApp().globalData.configs.appid}&current=${this.current}&search=${e.detail.value.trim()}`,
                success: res => {
                    if (res.statusCode !== 200 || !res.data.success) {
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取规格配置失败', reLaunch: true });
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
        } else {
            // 关闭搜索界面
            this.setData({ showSearchResults: false })
        }
    },

    // 到达页面底端 加载更多配置
    loadMore: function (e) {
        if (this.data.configs.length < this.Total) {
            // 获取配置
            wx.showLoading({ title: '获取规格配置', mask: true })
            wx.request({
                url: `${getApp().globalData.configs.apis.base}/photo-processing/config/list?appid=${getApp().globalData.configs.appid}&current=${this.current}&search=${this.inputValue}`,
                success: res => {
                    if (res.statusCode !== 200 || !res.data.success) {
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取规格配置失败', reLaunch: true });
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

    // 选择配置
    chooseConfig: function (e) {
        // 获取配置详情
        wx.showLoading({ title: '获取详情', mask: true })
        wx.request({
            url: `${getApp().globalData.configs.apis.base}/photo-processing/config/info/${e.detail.id}`,
            success: res => {
                if (res.statusCode !== 200 || !res.data.success) {
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取配置详情失败，请稍后再试', reLaunch: true });
                } else {
                    if (res.data.data.backgroundColors) res.data.data.backgroundColors = JSON.parse(res.data.data.backgroundColors);
                    this.setData({
                        showDetailModal: true,
                        config: res.data.data,
                        cropWidth: 260,
                        cropHeight: (260 / res.data.data.pixelWidth * res.data.data.pixelHeight).toFixed(0),
                        exportScale: res.data.data.pixelWidth / 260
                    })
                    wx.hideLoading() // 隐藏 loading
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置详情失败，请稍后再试' })
            }
        })
    },

    // 关闭配置详情弹窗
    closeDetailModal: function () {
        this.setData({ showDetailModal: false })
    },

    // 开始裁剪
    gotoCrop: function () {
        this.setData({
            showModal: false,
            showDetailModal: false,
            showSearchResults: false,
            showCrop: true,
        })
        // 修正图片位置
        this.selectComponent("#image-cropper").imgReset();
    },

    // 裁剪 初始化 ( 暂时无用 )
    cropperload: function (e) {
        console.log("cropper初始化完成");
    },

    // 裁剪 加载图片 ( 暂时无用 )
    loadimage: function (e) {
        console.log("图片加载完成", e.detail)
    },

    // 裁剪 点击取消
    clickCancel: function () {
        this.setData({
            showCrop: false
        });
    },

    // 裁剪 点击裁剪
    clickCrop: function (e) {
        const _this = this;
        wx.navigateTo({
            url: `preview/index${_this.data.suffixStr ? `?${_this.data.suffixStr}` : ''}`,
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', { img: e.detail.url, config: _this.data.config })
            }
        });
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '中公证件照 - 裁剪照片',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '中公证件照 - 裁剪照片'
        }
    }
})