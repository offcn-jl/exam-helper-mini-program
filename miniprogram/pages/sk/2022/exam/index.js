// pages/sk/2022/exam/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        CRMEFSID: "ce154839e56ef19f3dd6f18d4ee1ffab", // CRM 活动表单 ID
        CRMRemark: "2022省考估分", // CRM 注释  小程序-2023银行秋招职位查询

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        phone: "", // 用户手机号码
        openid: "", //openid

        actid: "49629", // zg99id  

        departmentList: [], // 部门 列表
        departmentValue: '', // 部门 已选中值

        positionList: [], // 招考岗位 列表
        positionValue: '', // 招考岗位 已选中值
    },

    // 前往做题
    go: function () {
        if (!this.data.departmentValue) {
            wx.showToast({ icon: 'error', title: '请选择招考单位', });
            return
        }
        if (!this.data.positionValue) {
            wx.showToast({ icon: 'error', title: '请选择招考岗位', });
            return
        }

        wx.navigateTo({ url: `../../../appopen/web-view/index?src=https://jl.offcn.com/zt/22skgf/&phone=${this.data.phone}&department=${encodeURIComponent(this.data.departmentValue)}&position=${encodeURIComponent(this.data.positionValue)}` });
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid }, () => this.go());
            }
        });
    },

    // 监听筛选条件切换(地市做出选择以后，报考职位发生变化)
    m_select_touch(e) {
        var _this = this;
        switch (e.detail.type) {
            case "department": // 年份
                _this.setData({ departmentValue: e.detail.text, positionList: [] });
                // zg99二级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/mokao/getlevel", // 路径
                    data: {
                        actid: _this.data.actid,
                        level: '2',
                        grfiled: 'department',
                        grtext: e.detail.text,
                        sstime: new Date().valueOf()
                    }, // 二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); // 去头尾（）,转为json对象
                        // 现将之前地市选项中报考职位内容清空
                        const list = [];
                        // 将数据添加到已清空的报考职位中
                        for (var i = 0; i < response.lists.length; i++) {
                            list.push(response.lists[i].position);
                        }
                        _this.setData({ positionList: list });
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                })
                break
            case "position": //省份
                _this.setData({ positionValue: e.detail.text });
                break
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const _this = this;
        wx.showLoading({ title: '加载中' });
        // 获取后缀
        getApp().methods.getSuffix(options).then(res => {
            // 保存后缀信息
            this.setData(res);
            // 获取联动数据
            wx.request({
                url: "https://zg99.offcn.com/index/mokao/getlevel",
                data: {
                    actid: this.data.actid,
                    level: "1",
                    grfiled: '',
                    grtext: '',
                    sstime: new Date().valueOf()
                },
                success(res) {
                    try {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        if (response.status !== 1) {
                            // 如果status不等于1，弹出错误提示
                            wx.showToast({ title: response.msg, icon: 'none' });
                            return
                        }
                        if (response.lists.length <= 0) {
                            // 如果内容长度小于等于0，弹出无数据提示
                            wx.showToast({ title: '没有查询到数据', icon: 'none' });
                            return
                        }
                        // 录入年份，不用提前清空，因为只进行一次获取
                        const list = [];
                        for (var i = 0; i < response.lists.length; i++) {
                            list.push(response.lists[i].department)
                        }
                        _this.setData({ departmentList: list });
                        // 判断是否是单页模式
                        if (wx.getLaunchOptionsSync().scene !== 1154) {
                            // 不是单页模式，进行登陆操作
                            // 获取登陆状态
                            getApp().methods.SSOCheck({
                                crmEventFormSID: _this.data.CRMEFSID,
                                suffix: { suffix: _this.data.suffix, suffixStr: _this.data.suffixStr },
                                remark: _this.data.CRMRemark,
                                callback: ({ phone, openid }) => _this.setData({ phone, openid }),
                            });
                            wx.hideLoading(); // 隐藏 loading
                        } else {
                            wx.hideLoading(); // 隐藏 loading
                        }
                    } catch (err) {
                        // 捕获错误并报错
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                },
                fail: err => {
                    // 获取失败后提示
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true });
                }
            });
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
            title: '2022吉林省考笔试在线测评',
            imageUrl: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/sk/2022/exam/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '2022吉林省考笔试在线测评'
        }
    }
})