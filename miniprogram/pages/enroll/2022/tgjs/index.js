const db = wx.cloud.database()
Page({
    data: {
        title: "2022特岗教师报名人数查询",// 标题
        banner_bk: "http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/enroll/2022/tgjs/header.jpg",// 背景图片
        imageUrl: "http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/enroll/2022/tgjs/share.jpg",// 分享时显示的图片
        CRMEFSID: "8b4a6fd347810ead2a99dd6b8edbedf8", // CRM 活动表单 ID
        CRMRemark: "活动编码:HD202206120095,活动表单ID:131166", // CRM 注释  网站专题页-2021年吉林特岗教师笔试六大系统
        actid: "48863", //zg99id  2021特岗教师职位筛选

        cityList: [],//地市
        countyList: [],//县（市、区）
        subjectList: [],//申报学科
        cityValue: '', //地市
        countyValue: '', //县（市、区）
        subjectValue: '', //申报学科

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        phone: "", // 用户手机号码
        openid: "",  //openid
    },

    // 监听筛选条件切换(地市做出选择以后，报考职位发生变化)
    m_select_touch(e) {
        var _this = this
        switch (e.detail.type) {
            case "city": //县（市、区）
                _this.setData({ cityValue: _this.data.cityList[e.detail.index] })
                // zg99二级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid + "&callback=?",  //路径
                    data: { level: '2', grfiled: 'city', grtext: _this.data.cityValue, sstime: new Date().valueOf() },  //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let county_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
                        // 现将之前地市选项中报考职位内容清空
                        _this.setData({
                            countyList: [],
                            subjectList: []
                        });
                        // 将数据添加到已清空的报考职位中
                        for (var i = 0; i < county_list.lists.length; i++) {
                            _this.setData({
                                countyList: _this.data.countyList.concat(county_list.lists[i].county)
                            });
                        }
                    },
                    fail: err => {//获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
                    }
                })
                break
            case "county": //县（市、区）
                _this.setData({ countyValue: _this.data.countyList[e.detail.index] })
                // zg99三级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid + "&callback=?",  //路径
                    data: { level: '3', grfiled: 'county', grtext: _this.data.countyValue, sstime: new Date().valueOf() },  //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let subject_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
                        // 现将之前地市选项中报考职位内容清空
                        _this.setData({
                            subjectList: []
                        });
                        // 将数据添加到已清空的报考职位中
                        for (var i = 0; i < subject_list.lists.length; i++) {
                            _this.setData({
                                subjectList: _this.data.subjectList.concat(subject_list.lists[i].subject)
                            });
                        }
                    },
                    fail: err => {//获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
                    }
                })
                break
            case "subject": //县（市、区）
                _this.setData({ subjectValue: _this.data.subjectList[e.detail.index] })
                break
        }
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
        // 判断是否选择了筛选条件
        if (this.data.cityValue === "" || this.data.countyValue === "" || this.data.subjectValue === "") {
            wx.showToast({ title: '请选择相应岗位', icon: 'none' });
        } else {
            wx.showLoading({ title: '加载中' });
            db.collection("enroll-2022-tgjs").where({ _openid: this.data.openid }).count({
                success: res => {
                    if (res.errMsg === 'collection.count:ok') {
                        if (!res.total) {
                            // 添加数据
                            db.collection("enroll-2022-tgjs").add({
                                data: {
                                    phone: this.data.phone, //手机号码
                                    city: this.data.cityValue,
                                    county: this.data.countyValue,
                                    subject: this.data.subjectValue,
                                },
                            }).then(res => {
                                // 判断是否成功
                                if (res.errMsg === 'collection.add:ok') {
                                    wx.hideLoading(); // 隐藏 loading
                                    this.doSearch();
                                } else {
                                    wx.hideLoading(); // 隐藏 loading
                                    getApp().methods.handleError({ err: res, title: "出错啦", content: '提交失败' });
                                }
                            }).catch(err => {
                                wx.hideLoading(); // 隐藏 loading
                                getApp().methods.handleError({ err: err, title: "出错啦", content: '提交失败' });
                            })
                        } else {
                            // 对原来数据进行修改
                            db.collection("enroll-2022-tgjs").where({ _openid: this.data.openid }).update({
                                data: {
                                    city: this.data.cityValue,
                                    county: this.data.countyValue,
                                    subject: this.data.subjectValue,
                                }
                            }).then(res => {
                                // 判断是否成功
                                if (res.errMsg === 'collection.update:ok') {
                                    wx.hideLoading(); // 隐藏 loading
                                    this.doSearch();
                                } else {
                                    wx.hideLoading(); // 隐藏 loading
                                    getApp().methods.handleError({ err: res, title: "出错啦", content: '提交失败' });
                                }
                            }).catch(err => {
                                wx.hideLoading(); // 隐藏 loading
                                getApp().methods.handleError({ err: err, title: "出错啦", content: '提交失败' });
                            })
                        }
                    } else {
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err: res, title: "出错啦", content: '提交失败' });
                    }
                },
                fail: err => {
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '提交失败' });
                }
            });
        }
    },

    // 查询 跳转页面
    doSearch: function () {
        let url = "result/index?a=1";
        if (this.data.cityValue !== "") url += "&city=" + this.data.cityValue
        if (this.data.countyValue !== "") url += "&county=" + this.data.countyValue
        if (this.data.subjectValue !== "") url += "&subject=" + this.data.subjectValue
        if (this.data.suffixStr !== "") url += "&" + this.data.suffixStr
        wx.reLaunch({ url });
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
                url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + this.data.actid,
                data: { level: "1", grfiled: '', grtext: '', sstime: new Date().valueOf() },
                success(res) {
                    try {
                        let list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // console.log(list)
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
                    } catch (err) {//捕获错误并报错
                        getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true });
                    }
                },
                fail: err => {//获取失败后提示
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true });
                }
            });
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
                wx.hideLoading(); // 隐藏 loading
            } else {
                wx.hideLoading(); // 隐藏 loading
            }
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
            title: this.data.title,
            imageUrl: this.data.imageUrl,
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
