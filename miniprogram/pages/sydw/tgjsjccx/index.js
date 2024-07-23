// pages/wdxt/lnfs-cc/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "", // 活动名称
        imageUrl: "", // 背景图
        shareImages: "", // 分享图
        CRMEFSID: "", // CRM 活动表单 ID
        CRMRemark: "", // CRM 注释  
        actid: "", //zg99id  
        backgroundColor: "",

        yearList: [],
        yearValue: '',

        dsList: [],
        dsValue: '',

        dwList: [],
        dwValue: '',

        gwList: [],
        gwValue: '',

        // 列表展示配置
        listTitle: [], // 标题
        listContent: [], // 内容

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        phone: "", // 用户手机号码
        openid: "", //openid

        result: [],
        count: 0,
        page: 1
    },
    // 监听筛选条件切换(做出选择以后，报考职位发生变化)
    m_select_touch(e) {
        var _this = this
        switch (e.detail.type) {
            case "year": //年份
            _this.setData({
                yearValue: e.detail.text,
                dsList: [],

            })

            // zg99二级联动
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid, //路径
                data: {
                    level: '2',
                    grfiled: 'item01',
                    grtext: e.detail.text,
                    sstime: new Date().valueOf()
                }, //二级联动，上级联动字段名，上级联动参数值
                success(res) {
                    let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                    // 现将之前内容清空
                    const List = []


                    // 将数据添加到已清空的列表中
                    for (var i = 0; i < response.lists.length; i++) {

                        List.push(response.lists[i].item02)
                    }
                    _this.setData({
                        dsList:List 
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

            case "ds": //地市
            _this.setData({
                dsValue: e.detail.text,
                dwList: [],

            })

            // zg99二级联动
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid, //路径
                data: {
                    level: '3',
                    grfiled: 'item02',
                    grtext: e.detail.text,
                    sstime: new Date().valueOf()
                }, //二级联动，上级联动字段名，上级联动参数值
                success(res) {
                    let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                    // 现将之前内容清空
                    const List = []


                    // 将数据添加到已清空的列表中
                    for (var i = 0; i < response.lists.length; i++) {

                        List.push(response.lists[i].item03)
                    }
                    _this.setData({
                        dwList:List 
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


            case "dw": //单位
                _this.setData({
                    dwValue: e.detail.text,
                    gwList: [],

                })

                // zg99二级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/chaxun/getlevel?actid=" + _this.data.actid, //路径
                    data: {
                        level: '4',
                        grfiled: 'item03',
                        grtext: e.detail.text,
                        sstime: new Date().valueOf()
                    }, //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // 现将之前内容清空
                        const List = []


                        // 将数据添加到已清空的列表中
                        for (var i = 0; i < response.lists.length; i++) {

                            List.push(response.lists[i].item04)
                        }
                        _this.setData({
                            gwList:List 
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
        if (!_this.data.yearValue) {
            wx.showToast({
                title: '请输入年份',
                icon: 'error'
            })
            return
        }

        if (!_this.data.dsValue) {
            wx.showToast({
                title: '请输入地市',
                icon: 'error'
            })
            return
        }
        if (!_this.data.dwValue) {
            wx.showToast({
                title: '请输入单位',
                icon: 'error'
            })
            return
        }

        wx.showLoading({
            title: '查询中...',
            mask: true
        })
        wx.request({
            url: "https://zg99.offcn.com/index/chaxun/getfzinfo?actid=" + _this.data.actid,
            data: {
                item01: this.data.yearValue,
                item02: this.data.dsValue,
                item03: this.data.dwValue,
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
                            title: '没有查询到职位',
                            icon: 'none'
                        })
                        return
                    }

                    const result = [];
                    if (list.lists) {
                        list.lists.forEach(valueList => {
                            let same = false;
                            result.forEach(valueResult => {
                                if (valueList.item03 == valueResult.item03) {
                                    same = true;
                                }
                            });
                            if (!same) {
                                result.push(valueList);
                            }
                        })
                    }
                    result.forEach(valueResult => {
                        if (valueResult.item07 == 0) {
                            valueResult.item07 = '暂无';
                        }
                    });

                    //数据导入data.result
                    _this.setData({
                        result: _this.data.result.concat(result), //不替换原数据添加新数据
                        page: (_this.data.result.concat(list.lists).length / 200) + 1, //计算分页页数
                        count: result.length //总数量录入data
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
       
        if (!options.actid) {
            getApp().methods.handleError({
                err: null,
                title: "出错啦",
                content: '缺少活动id',
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
                    actid: options.actid,
                    tabnum: "100",
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
                            actid: options.actid,
                            CRMEFSID: response.lists[0].CRMEFSID,
                            imageUrl: response.lists[0].imageUrl,
                            title: response.lists[0].title,
                            shareImages: response.lists[0].shareImages,
                            backgroundColor: response.lists[0].backgroundColor,
                            CRMRemark: `报名人数，${response.lists[0].title}`,
                            listTitle: response.lists[0].listTitle.split(',').map(item=>{return {name: item.split('|')[0], itemName: item.split('|')[1]}}),
                            listContent: response.lists[0].listContent.split(',').map(item=>{return {name: item.split('|')[0], itemName: item.split('|')[1]}})
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
        if (this.data.yearValue!== "" && this.data.dsValue!== "" && this.data.dsValue !== "" && this.data.gwValue !== "" && this.data.result.length < this.data.count) {
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