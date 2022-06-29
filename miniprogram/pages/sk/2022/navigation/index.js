// pages/sk/2022/navigation/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        zg99ActID: '49033', // zg99 活动 ID
        cityList: [],
        cityValue: "",
        siteList: [],
        siteValue: "",

        mapInfo: {},

        CRMEFSID: "8b4a6fd347810ead2a99dd6b8edbedf8", // CRM 活动表单 ID
        CRMRemark: "活动编码:HD202206120095,活动表单ID:131166", // CRM 注释  网站专题页-2021年吉林特岗教师笔试六大系统

        phone: '', // 用户手机号码
        openid: '',  // 用户 openid

        suffix: {}, // 后缀
        suffixStr: '', // 后缀 字符串
    },

    // 导航
    open() {
        const latitude = Number(this.data.mapInfo.latitude);
        const longitude = Number(this.data.mapInfo.longitude);
        const name = this.data.siteValue;
        wx.openLocation({
            latitude,
            longitude,
            name,
            scale: 18, // 地图缩放级别,整形值,范围从1~28。默认为最大
        });
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

    // 查询
    search: function () {
        const _this = this;
        // 判断是否选择了筛选条件
        if (this.data.cityValue === "") {
            wx.showToast({ title: '请选择考区', icon: 'none' });
        } else if (this.data.siteValue === "") {
            wx.showToast({ title: '请选择考点', icon: 'none' });
        } else {
            wx.showLoading({ title: '加载中' });
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getfylist?actid=" + _this.data.zg99ActID,
                data: { city: _this.data.cityValue, site: _this.data.siteValue, sstime: new Date().valueOf() },
                success(res) {
                    let list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
                    // 将之前内容清空
                    if (list.status !== 1) {
                        // 如果 status 不等于 1，弹出错误提示
                        wx.hideLoading(); // 隐藏 loading
                        wx.showToast({ title: list.msg, icon: 'none' });
                        return
                    }
                    if (list.lists.length <= 0) {
                        // 如果内容长度小于等于0，弹出无数据提示
                        wx.hideLoading(); // 隐藏 loading
                        wx.showToast({ title: '没有查询到考点信息', icon: 'none' });
                        return
                    }
                    _this.setData({ mapInfo: { latitude: list.lists[0].latitude, longitude: list.lists[0].longitude, markers: [{ latitude: list.lists[0].latitude, longitude: list.lists[0].longitude }] } });
                    wx.hideLoading(); // 隐藏 loading
                },
                fail: err => { // 获取失败后提示
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
                }
            });
        }
    },

    // 监听筛选条件切换 
    m_select_touch(e) {
        const _this = this;
        switch (e.detail.type) {
            case "city":
                _this.setData({ cityValue: _this.data.cityList[e.detail.index] });
                // zg99 二级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.zg99ActID,  //路径
                    data: { level: '2', grfiled: 'city', grtext: _this.data.cityValue, sstime: new Date().valueOf() },  //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let county_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
                        // 将之前内容清空
                        _this.setData({ siteList: [] });
                        for (var i = 0; i < county_list.lists.length; i++) {
                            _this.setData({
                                siteList: _this.data.siteList.concat(county_list.lists[i].site)
                            });
                        }
                    },
                    fail: err => {//获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                });
                break;
            case "site":
                _this.setData({ siteValue: e.detail.text })
                break;
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
                url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + this.data.zg99ActID,
                data: { level: "1", grfiled: '', grtext: '', sstime: new Date().valueOf() },
                success(res) {
                    try {
                        let list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        if (list.status !== 1) {
                            //如果status不等于1，弹出错误提示
                            wx.showToast({ title: list.msg, icon: 'none' });
                            return
                        }
                        if (list.lists.length <= 0) {
                            //如果内容长度小于等于0，弹出无数据提示
                            wx.showToast({ title: '没有更多数据啦', icon: 'none' });
                            return
                        }
                        // 录入地市里的单位，不用提前清空，因为只进行一次获取
                        for (var i = 0; i < list.lists.length; i++) {
                            _this.setData({ cityList: _this.data.cityList.concat(list.lists[i].city) });
                        }

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

                    } catch (err) {//捕获错误并报错
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                },
                fail: err => {//获取失败后提示
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
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {
        return {
            title: "2022吉林省公务员考试考点分布及考点导航",
            imageUrl: "https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/sk/2022/navigation/share.jpg",
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: "2022吉林省公务员考试考点分布及考点导航",
        }
    }
})