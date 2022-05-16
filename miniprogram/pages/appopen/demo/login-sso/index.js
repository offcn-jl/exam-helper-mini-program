// pages/login-demo/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        openid: '', // 用户 openid
        phone: '', // 用户手机号码

        crmEventFormSID: '123', // crm 活动表单 id
        remark: '123', // crm 备注
    },

    // 检查 SSO 登录状态
    // 调用公共函数 检查 SSO 登录状态，将公共函数返回的登陆信息保存到当前页面的上下文中
    SSOCheckManual: function (event) {
        getApp().methods.SSOCheckManual({ crmEventFormSID: this.data.crmEventFormSID, suffix: {suffix: this.data.suffix, suffixStr: this.data.suffixStr}, remark: this.data.remark, callback: ({ phone, openid }) => this.setData({ phone, openid }) });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息
        getApp().methods.SSOCheck({crmEventFormSID: this.data.crmEventFormSID, suffix: {suffix: this.data.suffix, suffixStr: this.data.suffixStr}, remark: this.data.remark, callback: ({ phone, openid }) => this.setData({ phone, openid })}); // 获取登陆状态
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

    }
})