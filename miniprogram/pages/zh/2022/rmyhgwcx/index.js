// pages/zh/2022/yhqzgwcx/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:"小程序-2023人民银行秋招职位查询",
        imageUrl:"http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/zh/rmyh/rmyh-share.jpg",
        CRMEFSID: "269b2e867b8d1fc937c02a5f0a3f9132", // CRM 活动表单 ID
        CRMRemark: "活动编码:HD202206270657,活动表单ID:133471", // CRM 注释  小程序-2023人民银行秋招职位查询
        actid: "48986", //zg99id  

        yearList: [],
        yearValue: '',

        provenceList: [],
        provenceValue: '',

        
        danweiList: [],
        danweiValue: '',

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
                    provenceValue: [],
                    danweiList: []
                })
                // zg99二级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid, //路径
                    data: {
                        level: '2',
                        grfiled: 'item1',
                        grtext: _this.data.yearValue,
                        sstime: new Date().valueOf()
                    }, //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // 现将之前地市选项中报考职位内容清空
                        const List = []
            
                        // 将数据添加到已清空的报考职位中
                        for (var i = 0; i < response.lists.length; i++) {
                            List.push(response.lists[i].item2)
                        }
                        _this.setData({
                            provenceList:List
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
            case "provence": //省份
                _this.setData({
                    provenceValue: e.detail.text,
                    danweiList: []
                })
                // zg99四级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid, //路径
                    data: {
                        level: '3',
                        grfiled: 'item2',
                        grtext: e.detail.text,
                        onefiled:'item1',
                        onetext:this.data.yearValue,
                        sstime: new Date().valueOf()
                    }, //四级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // console.log(response);
                        // 现将之前地市选项中报考职位内容清空
                        const List = []
                        // 将数据添加到已清空地市
                        for (var i = 0; i < response.lists.length; i++) {
                            List.push(response.lists[i].item3)
                        }
                        _this.setData({
                            danweiList: List
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
            case "danwei": //应届
                _this.setData({
                    danweiValue: e.detail.text,
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
                this.search();
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
                item1: this.data.yearValue,
                item2: this.data.provenceValue,
                item3: this.data.danweiValue,
                limits: 200,
                page: this.data.page
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
        const _this = this;
        wx.showLoading({
            title: '加载中'
        });
        // 获取后缀
        getApp().methods.getSuffix(options).then(res => {
            // 保存后缀信息
            this.setData(res);
            // 获取联动数据
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + this.data.actid,
                data: {
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
                            yearList.push(list.lists[i].item1)
                            // _this.setData({ yearList: _this.data.yearList.concat(list.lists[i].item1) });
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
        if (this.data.yearValue !== "" && this.data.provenceValue !== "" && this.data.danweiValue !== ""&& this.data.result.length < this.data.count) {
            this.search();
        }
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