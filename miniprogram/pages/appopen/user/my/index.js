// pages/user/my/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        openid: '', // 用户 openid
        phone: '', // 用户手机号码

        user: null,

        crmEventFormSid: '5f4bfedb612c4eade11978c81cc1542f',
        remark: `活动表单SID:5f4bfedb612c4eade11978c81cc1542f，综合活动平台，用户主动注册，`,
    },

    logout: function () {
        wx.showLoading({ title: '请稍候...' })
        wx.request({
            url: `${getApp().globalData.configs.apis.base.replace("apis/wechat/mini-program", "")}ssogateway/v1/user/logout?ssoAppId=10020`,
            header: {
                'x-eoffcn-sso-gateway-token': wx.getStorageSync('sso-token')
            },
            success: res => {
                wx.hideLoading(); // 隐藏 loading
                if (res.statusCode !== 200 || res.data.code !== 0) {
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.msg ? res.data.msg : '退出登录失败，请稍后再试'})
                } else {
                    // 退出成功
                    wx.showToast({ title: '退出登录成功' });
                    // 清空缓存的用户信息
                    this.setData({ user: null });
                    getApp().globalData.user = {};
                    // 删除 token
                    wx.removeStorage({ key: 'sso-token' });
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '退出登录失败，请稍后再试' })
            }
        });

    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        // 修正表单
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.crmEventFormSid, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: this.data.remark, callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // 获取后缀信息
        this.setData(await getApp().methods.getSuffix(options));
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
        // 获取登陆状态
        getApp().methods.SSOCheck({
            crmEventFormSID: this.data.crmEventFormSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: this.data.remark, callback: ({ phone, openid }) => {
                this.setData({ phone, openid, user: getApp().globalData.user });
            }
        });
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