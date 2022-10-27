// pages/gk/2023/enrollments/index.js

Page({
    /**
     * 页面的初始数据
     */
    data: {
        title: "2023国考报名人数查询", // 标题
        banner_bk: "https://jl.offcn.com/zt/ty/images/gk/2023/index202210271040.jpg", // 背景图片
        imageUrl: "https://jl.offcn.com/zt/ty/images/gk/2023/share.jpg", // 分享时显示的图片
        CRMEFSID: "533810449b884acda18411cc7d44f702", // CRM 活动表单 ID
        CRMRemark: "2023国考报名人数查询", // CRM 注释

        gzddList: [],
        gzddValue: '',

        bumenNameList: [],
        bumenNameValue: '',

        zhiweiNameList: [],
        zhiweiNameValue: '',
        zhiweiNameIndex: -1,

        zhiweiList: [],

        showPopUp: false,

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        phone: "", // 用户手机号码
        openid: "", // openid

        result: [],
        count: 0,
        page: 1
    },

    // 监听筛选条件切换(地市做出选择以后，报考职位发生变化)
    m_select_touch(e) {
        var _this = this
        switch (e.detail.type) {
            case "gzdd":
                _this.setData({
                    gzddValue: e.detail.text,
                    bumenNameList: [],
                    zhiweiNameList: []
                });

                wx.showLoading({ title: '请稍候' });
                wx.request({
                    url: "https://zw.offcn.com/zwapi/zhiwei/getzwlevel", // 接口
                    data: {
                        zwcode: 'gj',
                        zwyear: '2023',
                        level: '2',
                        grfiled: 'bumen_name',
                        onefiled: 'gzdd',
                        onetext: e.detail.text,
                        sstime: new Date().valueOf()
                    }, // 二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        const currentList = [];
                        for (var i = 0; i < response.lists.length; i++) {
                            currentList.push(response.lists[i].bumen_name);
                        };
                        _this.setData({ bumenNameList: currentList });
                        wx.hideLoading() // 隐藏 loading
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
                    }
                })
                break
            case "bumen_name":
                _this.setData({
                    bumenNameValue: e.detail.text,
                    zhiweiNameList: []
                })

                wx.showLoading({ title: '请稍候' });
                wx.request({
                    url: "https://zw.offcn.com/zwapi/zhiwei/getzwlevel", // 接口
                    data: {
                        zwcode: 'gj',
                        zwyear: '2023',
                        level: '3',
                        grfiled: 'zhiwei_name',
                        onefiled: 'gzdd',
                        onetext: _this.data.gzddValue,
                        twofiled: 'bumen_name',
                        twotext: e.detail.text,
                        sstime: new Date().valueOf()
                    }, // 二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        const currentList = [];
                        for (var i = 0; i < response.lists.length; i++) {
                            currentList.push(response.lists[i].zhiwei_name);
                        };
                        _this.setData({ zhiweiNameList: currentList, zhiweiList: response.lists });
                        wx.hideLoading() // 隐藏 loading
                    },
                    fail: err => { // 获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
                    }
                })
                break
            case "zhiwei_name":
                _this.setData({
                    zhiweiNameValue: _this.data.zhiweiNameList[e.detail.index],
                    zhiweiNameIndex: e.detail.index
                })
        }
        this.setData({
            result: [],
            count: 0,
            page: 1,
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
                this.search();
            }
        });
    },

    //查询
    search() {
        let _this = this //作用域 

        if (!_this.data.gzddValue) {
            wx.showToast({ title: '请选择工作地点', icon: 'error' })
            return
        }
        if (!_this.data.bumenNameValue) {
            wx.showToast({ title: '请选择部门名称', icon: 'error' })
            return
        }
        if (!_this.data.zhiweiNameValue) {
            wx.showToast({ title: '请选择职位名称', icon: 'error' })
            return
        }

        this.setData({ showPopUp: true });
    },

    bindHidePopUpCloseTap: function (event) {
        this.setData({ showPopUp: false });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ title: '请稍候' });
        const _this = this;
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 获取数据
            wx.request({
                url: "https://zw.offcn.com/zwapi/zhiwei/getzwlevel",
                data: {
                    zwcode: 'gj',
                    zwyear: '2023',
                    level: '1',
                    grfiled: 'gzdd',
                    sstime: new Date().valueOf()
                },
                success(res) {
                    try {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        if (response.status !== 1) { //如果status不等于1，弹出错误提示
                            wx.showToast({ title: response.msg, icon: 'none' })
                            return
                        }
                        if (response.lists.length <= 0) { //如果内容长度小于等于0，弹出无数据提示
                            wx.showToast({ title: '没有更多数据啦', icon: 'none' })
                            return
                        }
                        const currentList = [];
                        for (var i = 0; i < response.lists.length; i++) {
                            if (response.lists[i].gzdd.indexOf('吉林') !== -1) {
                                currentList.unshift(response.lists[i].gzdd);
                            } else {
                                currentList.push(response.lists[i].gzdd);
                            }
                        };
                        // 录入，不用提前清空，因为只进行一次获取
                        _this.setData({ gzddList: currentList });
                        // 判断是否是单页模式
                        if (wx.getLaunchOptionsSync().scene !== 1154) {
                            // 不是单页模式，进行登陆操作
                            // 获取登陆状态
                            getApp().methods.SSOCheck({
                                crmEventFormSID: _this.data.CRMEFSID,
                                suffix: { suffix: _this.data.suffix, suffixStr: _this.data.suffixStr },
                                remark: _this.data.CRMRemark,
                                callback: ({ phone, openid }) => _this.setData({ phone, openid })
                            });
                            wx.hideLoading(); // 隐藏 loading
                        } else {
                            wx.hideLoading(); // 隐藏 loading
                        }
                    } catch (err) { //捕获错误并报错
                        getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true })
                    }
                },
                fail: err => { //获取失败后提示
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
                }
            })
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
        // if (this.data.yearValue !== "" && this.data.bankValue !== "" && this.data.provenceValue !== "" && this.data.cityValue !== "" && this.data.graduatesValue !== "" && this.data.cetValue !== "" && this.data.result.length < this.data.count) {
        //     this.search();
        // }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            imageUrl: this.data.shareImages,
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: this.data.title,
        }
    }
})
