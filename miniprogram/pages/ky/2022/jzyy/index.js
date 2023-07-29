// pages/ky/2022/jzyy/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        educationList: ['专科', '本科', '成人高考', '函授本科', '其他'],
        educationValue: '',

        school: '',
        course: '',

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        CRMEFSID: "ed5d0d8808b2fa05e7a45ffce768fe84", // CRM 活动表单 ID 
        
        phone: "", // 用户手机号码
        openid: "", //openid
    },

    // 输入 专业
    inputCourse(e) {
        this.setData({ course: e.detail.value });
    },

    // 输入 学校
    inputSchool(e) {
        this.setData({ school: e.detail.value });
    },

    // 监听筛选条件切换(地市做出选择以后，报考职位发生变化)
    m_select_touch(e) {
        var _this = this
        switch (e.detail.type) {
            case "education":
                _this.setData({
                    educationValue: _this.data.educationList[e.detail.index],
                })
        }
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        if (!this.data.educationValue) {
            wx.showToast({ title: '请选择学历', icon: 'error' });
            return
        }
        if (!this.data.school) {
            wx.showToast({ title: '请填写目标院校', icon: 'error' });
            return
        }
        if (!this.data.course) {
            wx.showToast({ title: '请填写目标专业', icon: 'error' });
            return
        }
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: { ...this.data.suffix, colleage: this.data.school, major: this.data.course }, suffixStr: this.data.suffixStr },
            remark: this.data.educationValue,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                wx.showModal({ title: '预约成功', showCancel: false });
            },
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            wx.hideLoading(); // 隐藏 loading
            this.setData(res);
        }).catch(err => {
            wx.hideLoading(); // 隐藏 loading
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
            title: "考研招生简章预约",
            imageUrl: "https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/ky/jzyy/share.jpg",
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: "考研招生简章预约",
        }
    }
})
