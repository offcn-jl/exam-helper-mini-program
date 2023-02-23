// pages/exam/cc/index/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        CRMEFSID: "b9d7cb2873cf9b88dc872722204d7845", // CRM 活动表单 ID
        CRMRemark: "刷题", // CRM 注释

        suffix: {}, // 推广后缀 对象
        suffixStr: '', // 推广后缀 字符串

        phone: '', // 用户手机号
        openid: '', // 用户 openid
    },

    // 跳转页面
    goPaper: function () {
        wx.reLaunch({
            url: `../paper/index?${this.data.suffixStr}`,
        })
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                // 直接跳转页面
                this.goPaper();
            },
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 判断是否是单页模式
            if (wx.getLaunchOptionsSync().scene !== 1154) {
                // 隐藏 loading
                wx.hideLoading();
                // 不是单页模式，进行登陆操作
                // 获取登陆状态
                getApp().methods.SSOCheck({
                    crmEventFormSID: this.data.CRMEFSID,
                    suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
                    remark: this.data.CRMRemark,
                    callback: ({ phone, openid }) => {
                        this.setData({ phone, openid });
                    },
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
    onShareAppMessage: function () {
        return {
            title: '每天五分钟，提高通用知识做题正确率',
            imageUrl: 'https://jl.offcn.com/zt/ty/2023images/shuati2023/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '每天五分钟，提高通用知识做题正确率'
        }
    }
})