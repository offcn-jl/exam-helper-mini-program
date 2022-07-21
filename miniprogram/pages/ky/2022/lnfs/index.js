// pages/ky/2022/lnfs/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        actid: "49686", //zg99id  

        yearList: [],
        yearValue: '',

        provinceNameList: [],
        provinceNameValue: '',

        schoolList: [],
        schoolValue: '',

        classNameList: [],
        classNameValue: '',

        facultyList: [],
        facultyValue: '',

        courseNameList: [],
        courseNameValue: '',

        result: [],
        count: 0,
        page: 1,
        
        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        CRMEFSID: "1b5069faf4f02a107cfed4cc0cd33ed4", // CRM 活动表单 ID
        CRMRemark: "", // CRM 注释
        
        phone: "", // 用户手机号码
        openid: "", //openid
    },
    // 监听筛选条件切换(地市做出选择以后，报考职位发生变化)
    m_select_touch(e) {
        var _this = this
        switch (e.detail.type) {
            case "year":
                _this.setData({
                    yearValue: _this.data.yearList[e.detail.index],
                    provinceNameList: [],
                    schoolList: [],
                    classNameList: [],
                    facultyList: [],
                    courseNameList: [],
                })
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel", //路径
                    data: {
                        actid: _this.data.actid,
                        level: '2',
                        grfiled: 'year',
                        grtext: _this.data.yearValue,
                        sstime: new Date().valueOf()
                    },
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // 将之前地市选项中报考职位内容清空
                        const list = [];
                        // 将数据添加到已清空的报考职位中
                        for (var i = 0; i < response.lists.length; i++) {
                            list.push(response.lists[i].province_name)
                        }
                        _this.setData({ provinceNameList: list })
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
                    }
                })
                break
            case "provinceName":
                _this.setData({
                    provinceNameValue: e.detail.text,
                    schoolList: [],
                    classNameList: [],
                    facultyList: [],
                    courseNameList: [],
                })
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel", //路径
                    data: {
                        actid: _this.data.actid,
                        level: '3',
                        grfiled: 'province_name',
                        grtext: e.detail.text,
                        onefiled: 'year',
                        onetext: this.data.yearValue,
                        sstime: new Date().valueOf()
                    },
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        const list = []
                        for (var i = 0; i < response.lists.length; i++) {
                            list.push(response.lists[i].school)
                        }
                        _this.setData({ schoolList: list });
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                })
                break
            case "school":
                _this.setData({
                    schoolValue: e.detail.text,
                    classNameList: [],
                    facultyList: [],
                    courseNameList: [],
                })
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel", //路径
                    data: {
                        actid: _this.data.actid,
                        level: '4',
                        grfiled: 'school',
                        grtext: e.detail.text,
                        onefiled: 'year',
                        onetext: this.data.yearValue,
                        twofiled: 'province_name',
                        twotext: this.data.provinceNameValue,
                        sstime: new Date().valueOf()
                    },
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        const list = []
                        for (var i = 0; i < response.lists.length; i++) {
                            list.push(response.lists[i].class_name)
                        }
                        _this.setData({ classNameList: list });
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                })
                break
            case "className":
                _this.setData({
                    classNameValue: _this.data.classNameList[e.detail.index],
                    facultyList: [],
                    courseNameList: [],
                })
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel", //路径
                    data: {
                        actid: _this.data.actid,
                        level: '5',
                        grfiled: 'class_name',
                        grtext: _this.data.classNameList[e.detail.index],
                        onefiled: 'year',
                        onetext: _this.data.yearValue,
                        twofiled: 'province_name',
                        twotext: _this.data.provinceNameValue,
                        threefiled: 'school',
                        threetext: _this.data.schoolValue,
                        sstime: new Date().valueOf()
                    },
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        const list = []
                        for (var i = 0; i < response.lists.length; i++) {
                            list.push(response.lists[i].faculty)
                        }
                        _this.setData({ facultyList: list });
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                })
                break
            case "faculty":
                _this.setData({
                    facultyValue: _this.data.facultyList[e.detail.index],
                    courseNameList: [],
                })
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel", //路径
                    data: {
                        actid: _this.data.actid,
                        level: '6',
                        grfiled: 'faculty',
                        grtext: _this.data.facultyList[e.detail.index],
                        onefiled: 'year',
                        onetext: _this.data.yearValue,
                        twofiled: 'province_name',
                        twotext: _this.data.provinceNameValue,
                        threefiled: 'school',
                        threetext: _this.data.schoolValue,
                        fourfiled: 'class_name',
                        fourtext: _this.data.classNameValue,
                        sstime: new Date().valueOf()
                    },
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        const list = []
                        for (var i = 0; i < response.lists.length; i++) {
                            list.push(response.lists[i].course_name)
                        }
                        _this.setData({ courseNameList: list });
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                })
                break
            case "courseName":
                _this.setData({
                    courseNameValue: _this.data.courseNameList[e.detail.index],
                })
                break
        }
        this.setData({
            result: [],
            count: 0,
            page: 1
        })
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => { this.setData({ phone, openid }); },
        });
    },

    //查询
    search() {
        if (!this.data.yearValue) {
            wx.showToast({ icon: 'error', title: '请选择年份' });
            return
        }
        if (!this.data.provinceNameValue) {
            wx.showToast({ icon: 'error', title: '请选择省份' });
            return
        }
        if (!this.data.schoolValue) {
            wx.showToast({ icon: 'error', title: '请选择学校' });
            return
        }
        if (!this.data.classNameValue) {
            wx.showToast({ icon: 'error', title: '请选择学科门类' });
            return
        }

        let _this = this //作用域 
        wx.showLoading({ title: '查询中...', mask: true });
        wx.request({
            url: "https://zg99.offcn.com/index/chaxun/getfzinfo",
            data: {
                actid: _this.data.actid,
                year: this.data.yearValue,
                province_name: this.data.provinceNameValue,
                school: this.data.schoolValue,
                class_name: this.data.classNameValue,
                faculty: this.data.facultyValue,
                course_name: this.data.courseNameValue,
                limits: 200,
                page: this.data.page,
                sstime: new Date().valueOf(),
            },
            success(res) {
                wx.hideLoading(); // 隐藏 loading
                try {
                    let response = JSON.parse(res.data.substring(1, res.data.length - 1)) //去头尾（）,转为json对象
                    if (response.status !== 1) {
                        // 如果status不等于1，弹出错误提示
                        wx.showToast({ title: response.msg, icon: 'none' })
                        return
                    }
                    if (response.lists.length <= 0) {
                        // 如果内容长度小于等于0，弹出无数据提示
                        wx.showToast({ title: '没有查询到数据', icon: 'none' })
                        return
                    }

                    //数据导入data.result
                    _this.setData({
                        result: _this.data.result.concat(response.lists), //不替换原数据添加新数据
                        page: (_this.data.result.concat(response.lists).length / 200) + 1, //计算分页页数
                        count: response.total //总数量录入data
                    })
                } catch (err) { //捕获错误并报错
                    getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true })
                }
            },
            fail: err => { //获取失败后提示
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
            }
        })
    },

    showmore: function (event) {
        this.setData({
            showIndex: event.currentTarget.dataset.index
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        const _this = this;
        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 获取一级联动数据
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getlevel",
                data: {
                    actid: _this.data.actid,
                    level: "1",
                    grfiled: '',
                    grtext: '',
                    sstime: new Date().valueOf()
                },
                success(res) {
                    try {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        if (response.status !== 1) {
                            //如果status不等于1，弹出错误提示
                            wx.showToast({ title: response.msg, icon: 'none' });
                            return
                        }
                        if (response.lists.length <= 0) {
                            //如果内容长度小于等于0，弹出无数据提示
                            wx.showToast({ title: '没有查询到数据', icon: 'none' });
                            return
                        }
                        // 录入问题，不用提前清空，因为只进行一次获取
                        const list = [];
                        for (var i = 0; i < response.lists.length; i++) {
                            list.push(response.lists[i].year)
                        }
                        _this.setData({ yearList: list });
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
                    } catch (err) { //捕获错误并报错
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                },
                fail: err => { //获取失败后提示
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
        // fixme
        if (this.data.yearValue !== "" && this.data.bankValue !== "" && this.data.provenceValue !== "" && this.data.cityValue !== "" && this.data.graduatesValue !== "" && this.data.cetValue !== "" && this.data.result.length < this.data.count) {
            this.search();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "考研复试分数线查询",
            imageUrl: "https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/ky/lnfs/share.jpg",
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: "考研复试分数线查询",
        }
    }
})
