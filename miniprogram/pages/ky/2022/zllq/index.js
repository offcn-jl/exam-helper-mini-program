// pages/ky/2022/zllq/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookTypeList: [],
        bookList: [
            { type: "9、英语历年试题集锦（全）", name: '18-22英语（二）试题与答案18-22英语（二）试题与答案案18-22英语（二）试题与答案案18-22英语（二）试题与答案', link: 'https://static.kaoyan365.cn/production/book/doc/1658305744861-82cf18bf-5e12-4628-a5ed-c058464ca5db.pdf' },
            { type: "9、英语历年试题集锦（全）", name: '18-22英语（一）试题与答案', link: '' },
            { type: "8、数学历年试题集锦（全）", name: '2021年数学二试题', link: '' },
            { type: "8、数学历年试题集锦（全）", name: '2021年数学三试题', link: '' },
            { type: "8、数学历年试题集锦（全）", name: '3', link: '' },
            { type: "8、数学历年试题集锦（全）", name: '4', link: '' },
            { type: "8、数学历年试题集锦（全）2", name: '4', link: '' },
            { type: "8、数学历年试题集锦（全）3", name: '4', link: '' },
        ],
        bookList4Show: [],

        scrollItemActiveIndex: 0,

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        CRMEFSID: "24c7164ed31bbad4539d2ecc604335aa", // CRM 活动表单 ID
        CRMRemark: "", // CRM 注释

        phone: "", // 用户手机号码
        openid: "", //openid
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                wx.showToast({ title: '领取成功，点击下方资料即可查看', icon: "none" });
            },
        });
    },

    // 浏览资料
    view(e) {
        if (!this.data.bookList4Show[e.currentTarget.dataset.index].link) {
            wx.showToast({ title: '配置有误', icon: "none" });
            return
        }
        if (!this.data.phone) {
            wx.showToast({ title: '请您先点击上方按钮进行注册', icon: "none" });
            return
        }
        wx.navigateTo({ url: '../../../book/web-view/index?downloadable=false&link=' + this.data.bookList4Show[e.currentTarget.dataset.index].link });
    },

    // 点击切换 菜单
    scrollItemOnClick(e) {
        const bookList4Show = [];
        this.data.bookList.forEach(value => {
            if (value.type == this.data.bookTypeList[e.currentTarget.dataset.index]) {
                bookList4Show.push(value);
            }
        });
        this.setData({ bookList4Show, scrollItemActiveIndex: e.currentTarget.dataset.index });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 初始化数据
        const bookTypeList = [];
        this.data.bookList.forEach(bookListValue => {
            let has = false;
            bookTypeList.forEach(bookTypeListValue => {
                if (bookTypeListValue == bookListValue.type) {
                    has = true;
                }
            })
            if (!has) {
                bookTypeList.push(bookListValue.type);
            }
        });
        const bookList4Show = [];
        this.data.bookList.forEach(value => {
            if (value.type == bookTypeList[0]) {
                bookList4Show.push(value);
            }
        });
        this.setData({ bookTypeList, bookList4Show });

        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 隐藏 loading
            wx.hideLoading();
            // 判断是否是单页模式
            if (wx.getLaunchOptionsSync().scene !== 1154) {
                // 不是单页模式，进行登陆操作
                // 获取登陆状态
                getApp().methods.SSOCheck({
                    crmEventFormSID: this.data.CRMEFSID,
                    suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
                    remark: this.data.CRMRemark,
                    callback: ({ phone, openid }) => this.setData({ phone, openid }),
                });
            }
        }).catch(err => {
            // 隐藏 loading
            wx.hideLoading();
            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取后缀失败', reLaunch: true });
        });
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "2023研究生考试资料领取",
            imageUrl: "https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/ky/zllq/share.jpg",
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: "2023研究生考试资料领取",
        }
    }
})