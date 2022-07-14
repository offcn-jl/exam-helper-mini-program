// pages/zh/2022/yhqzgwcx/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "", // 活动名称
        imageUrl: "", // 背景图
        shareImages: "", // 分享图
        CRMEFSID: "", // CRM 活动表单 ID
        CRMRemark: "", // CRM 注释  小程序-2023银行秋招职位查询
        actid: "49370", //zg99id  
        backgroundColor:"",
        version:"",

        questionList: [],
        questionValue: '',

        answerList: [],
        answerValue: '',

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
            case "question": //问题
                _this.setData({
                    questionValue: e.detail.text,
                })
                _this.search()
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
        wx.showLoading({
            title: '查询中...',
            mask: true
        })
        wx.request({
            url: "https://zg99.offcn.com/index/chaxun/getfzinfo?actid=" + _this.data.actid,
            data: {
                question: this.data.questionValue,
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
                            title: '没有查询到职位',
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
        //console.log(options);
        if (!options.version) {
            getApp().methods.handleError({
                err: null,
                title: "出错啦",
                content: '缺少版本号',
                reLaunch: true
            });
            return
        }
        const _this = this;
        wx.showLoading({
            title: '加载中'
        });
      
        getApp().methods.getSuffix(options).then(res => {
          
            this.setData(res);
            // 获取活动配置
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getfylist",
                data: {
                    actid: _this.data.actid,
                    version: options.version,
                    tabnum: "2",
                    sstime: new Date().valueOf()
                },
                success(res) {
                    try {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        if (response.status !== 1) {
                            // 如果status不等于1，弹出错误提示
                            getApp().methods.handleError({
                                err: null,
                                title: "出错啦",
                                content: response.msg,
                                reLaunch: true
                            });
                            return
                        }
                        if (response.lists.length <= 0) {
                            // 如果内容长度小于等于0，弹出无数据提示
                            getApp().methods.handleError({
                                err: null,
                                title: "出错啦",
                                content: '没有查询到活动配置',
                                reLaunch: true
                            });
                            return
                        }
                        // 保存活动配置
                        _this.setData({
                            version: options.version,
                            CRMEFSID: response.lists[0].CRMEFSID,
                            imageUrl: response.lists[0].imageUrl,
                            title: response.lists[0].title,
                            shareImages: response.lists[0].shareImages,
                            backgroundColor:response.lists[0].backgroundColor,
                            CRMRemark: `${response.lists[0].title}，${options.version}`
                        })
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
                                    // 录入问题，不用提前清空，因为只进行一次获取
                                    const questionList = [];
                                    for (var i = 0; i < list.lists.length; i++) {
                                        questionList.push(list.lists[i].question)
                                      
                                    }
                                    _this.setData({
                                        questionList
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
                                            }) => _this.setData({phone,openid}),
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
        if (this.data.yearValue !== "" && this.data.bankValue !== "" && this.data.provenceValue !== "" && this.data.cityValue !== "" && this.data.graduatesValue !== "" && this.data.cetValue !== "" && this.data.result.length < this.data.count) {
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