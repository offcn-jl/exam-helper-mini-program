// pages/wdxt/lnfs-cc/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "2023年吉林特岗教师-面试形式及教材版本查询", // 标题
        imageUrl: "https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/2023tgjsjccx2.jpg", // 背景图片
        shareImages: "https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/2023tgjsjccx2-share.jpg", // 分享时显示的图片
        CRMEFSID: "2d8c8a5afccc596f2faa089bef089757", // CRM 活动表单 ID 159629
        CRMRemark: "活动编码:HD202307240104，2023年吉林特岗教师面试教材版本查询", // CRM 注释  2022年吉林特岗教师面试教材版本查询
        actid: "53318", //zg99id 
        backgroundColor: "#000a45",


        yearList: [],
        yearValue: '',

        cityList: [],
        cityValue: '',

        xdList: [],
        xdValue: '',

        gwList: [],
        gwValue: '',

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        phone: "", // 用户手机号码
        openid: "", //openid

        result: [],
        count: 0,
        page: 1
    },
    // 监听筛选条件切换(地市做出选择以后，报考职位发生变化)
    m_select_touch(e) {
        var _this = this
        switch (e.detail.type) {
            case "year": //年份
                _this.setData({
                    yearValue: _this.data.yearList[e.detail.index],
                    cityList: [],
                    xdList: [],
                    gwList: [],

                })
                // zg99二级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid, //路径
                    data: {
                        level: '2',
                        grfiled: 'item01',
                        grtext: _this.data.yearValue,
                        sstime: new Date().valueOf()
                    }, //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // 现将之前地市选项中报考职位内容清空
                        const List = []

                        // 将数据添加到已清空的报考职位中
                        for (var i = 0; i < response.lists.length; i++) {

                            List.push(response.lists[i].item02)
                        }
                        _this.setData({
                            cityList:List
                        })

                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({
                            err: err,
                            title: "出错啦",
                            content: '查询失败',
                            reLaunch: true
                        })
                    }
                })
                break
            case "city": //单位
                _this.setData({
                    cityValue: e.detail.text,
                    xdList: [],
                    gwList: [],
                })
    
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid, //路径
                    data: {
                        level: '3',
                        grfiled: 'item02',
                        grtext: e.detail.text,
                        onefiled: 'item01',
                        onetext: this.data.yearValue,

                        sstime: new Date().valueOf()
                    }, //上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // console.log(response);
                        // 现将之前地市选项中报考职位内容清空
                        const List = []
                        // 将数据添加到已清空地市
                        for (var i = 0; i < response.lists.length; i++) {
                            List.push(response.lists[i].item03)
                        }
                        _this.setData({
                            xdList: List
                        })
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({
                            err: err,
                            title: "出错啦",
                            content: '查询失败',
                            reLaunch: true
                        })
                    }
                })
                break
            case "xd": //单位
                _this.setData({
                    xdValue: e.detail.text,
                    gwList: [],
                })
    
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid, //路径
                    data: {
                        level: '4',
                        grfiled: 'item03',
                        grtext: e.detail.text,
                        onefiled: 'item01',
                        onetext: this.data.yearValue,
                        twofiled: 'item02',
                        twotext: this.data.cityValue,

                        sstime: new Date().valueOf()
                    }, //上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // console.log(response);
                        // 现将之前地市选项中报考职位内容清空
                        const List = []
                        // 将数据添加到已清空地市
                        for (var i = 0; i < response.lists.length; i++) {
                            List.push(response.lists[i].item04)
                        }
                        _this.setData({
                            gwList: List
                        })
                    },
                    fail: err => { //获取失败后提示
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({
                            err: err,
                            title: "出错啦",
                            content: '查询失败',
                            reLaunch: true
                        })
                    }
                })
                break
            case "gw": //岗位
                _this.setData({
                    gwValue: e.detail.text
                })

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
            suffix: {
                suffix: this.data.suffix,
                suffixStr: this.data.suffixStr
            },
            remark: this.data.CRMRemark,
            callback: ({
                phone,
                openid
            }) => {
                this.setData({
                    phone,
                    openid
                });
            }
        });
    },
    //查询
    search() {
        let _this = this //作用域 
        if(!_this.data.yearValue){
            wx.showToast({title: '请选择年份',icon: 'error'})
            return
        }
        if(!_this.data.cityValue){
            wx.showToast({title: '请选择地市',icon: 'error'})
            return
        }
        if(!_this.data.xdValue){
            wx.showToast({title: '请选学段',icon: 'error'})
            return
        }

        if(!_this.data.gwValue){
            wx.showToast({title: '请选岗位',icon: 'error'})
            return
        }
    
        wx.showLoading({
            title: '查询中...',
            mask: true
        })

        wx.request({
            url: "https://zg99.offcn.com/index/chaxun/getfzinfo",
            data: {
                actid:this.data.actid,
                item01: this.data.yearValue,
                item02: this.data.cityValue,
                item03: this.data.xdValue,
                item04: this.data.gwValue,
                tabnum: 2,
                limits: 200,
                page: this.data.page,
                sstime: new Date().valueOf()
            },
            success(res) {
                console.log(res);
                wx.hideLoading() // 隐藏 loading
                try {
                    let list = JSON.parse(res.data.substring(1, res.data.length - 1)) //去头尾（）,转为json对象
                    console.log("list:", list)
                    if (list.status !== 1) { //如果status不等于1，弹出错误提示
                        wx.showToast({
                            title: list.msg,
                            icon: 'none'
                        })
                        return
                    }
                    if (list.lists.length <= 0) { //如果内容长度小于等于0，弹出无数据提示
                        wx.showToast({
                            title: '没有查询到信息',
                            icon: 'none'
                        })
                        return
                    }

                    //数据导入data.result
                    _this.setData({
                        result: _this.data.result.concat(list.lists), //不替换原数据添加新数据
                        page: (_this.data.result.concat(list.lists).length / 200) + 1, //计算分页页数
                        count: list.total //总数量录入data
                    })
                } catch (err) { //捕获错误并报错
                    getApp().methods.handleError({
                        err,
                        title: "出错啦",
                        content: '查询失败',
                        reLaunch: true
                    })
                }
            },
            fail: err => { //获取失败后提示
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({
                    err: err,
                    title: "出错啦",
                    content: '查询失败',
                    reLaunch: true
                })
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
        wx.showLoading({
            title: '加载中'
        });

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
                        let list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // console.log(list)
                        if (list.status !== 1) {
                            //如果status不等于1，弹出错误提示
                            wx.showToast({
                                title: list.msg,
                                icon: 'none'
                            });
                            return
                        }
                        if (list.lists.length <= 0) {
                            //如果内容长度小于等于0，弹出无数据提示
                            wx.showToast({
                                title: '没有查询到数据',
                                icon: 'none'
                            });
                            return
                        }
                        // 录入年份，不用提前清空，因为只进行一次获取
                        const yearList = [];
                        for (var i = 0; i < list.lists.length; i++) {
                            yearList.push(list.lists[i].item01)

                        }
                        _this.setData({
                            yearList
                        })
                        // 判断是否是单页模式
                        if (wx.getLaunchOptionsSync().scene !== 1154) {
                            // 不是单页模式，进行登陆操作
                            // 获取登陆状态
                            getApp().methods.SSOCheck({
                                crmEventFormSID: _this.data.CRMEFSID,
                                suffix: {
                                    suffix: _this.data.suffix,
                                    suffixStr: _this.data.suffixStr
                                },
                                remark: _this.data.CRMRemark,
                                callback: ({
                                    phone,
                                    openid
                                }) => _this.setData({
                                    phone,
                                    openid
                                }),
                            });
                            wx.hideLoading(); // 隐藏 loading
                        } else {
                            wx.hideLoading(); // 隐藏 loading
                        }
                    } catch (err) { //捕获错误并报错
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({
                            err,
                            title: "出错啦",
                            content: '查询失败',
                            reLaunch: true
                        });
                    }
                },
                fail: err => { //获取失败后提示
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({
                        err: err,
                        title: "出错啦",
                        content: '查询失败',
                        reLaunch: true
                    });
                }
            });

        }).catch(err => {
            wx.hideLoading(); // 隐藏 loading
            getApp().methods.handleError({
                err: err,
                title: "出错啦",
                content: '获取后缀失败',
                reLaunch: true
            });
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
        if (this.data.result.length < this.data.count) {
            this.search();
        }
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