// pages/sydw/2022/yb/shaif/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "2023年梅河口教师招聘-晒分数·知分差", // 标题
        banner_bk: "https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/mhksgaif2023.jpg", // 背景图片
        imageUrl: "https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/mhksgaif2023-share", // 分享时显示的图片
        CRMEFSID: "68d7378af673bef07135af0403953dad", // CRM 活动表单 ID
        CRMRemark: "2023年梅河口教师招聘晒分", // CRM 注释
        actid: "52984", //zg99id

        departmentList: [],
        employerList: [],
        postList: [],

        departmentValue: '',
        employerValue: '',
        postValue: '',

        gradeValue: 0, // 成绩

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
        case "department":
                _this.setData({
                    departmentValue: _this.data.departmentList[e.detail.index]
                })
           
                wx.request({
                    url: "https://zg99.offcn.com/index/shaifen/getlevel?actid=" + _this.data.actid + "&callback=?", //路径
                    data: {
                        level: '2',
                        grfiled: 'department',
                        grtext: _this.data.departmentValue,
                        sstime: new Date().valueOf()
                    }, // 二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        _this.setData({
                            employerList: [],
                            postList: []
                        });
                        for (var i = 0; i < list.lists.length; i++) {
                            _this.setData({
                                employerList: _this.data.employerList.concat(list.lists[i].employer)
                            });
                        };
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
        case "employer":
                _this.setData({
                    employerValue: e.detail.text
                })
                // zg99四级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/shaifen/getlevel?actid=" + _this.data.actid + "&callback=?", //路径
                    data: {
                        level: '3',
                        grfiled: 'employer',
                        grtext: e.detail.text,
                        onefiled: 'department',
                        onetext: this.data.departmentValue,
                        twofiled: 'employer',
                        twotext: this.data.employerValue,
                        sstime: new Date().valueOf()
                    }, //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let post_list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // 现将之前地市选项中岗位内容清空
                        _this.setData({
                            postList: []
                        });
                        for (var i = 0; i < post_list.lists.length; i++) {
                            _this.setData({
                                postList: _this.data.postList.concat(post_list.lists[i].post)
                            });
                        };
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
            case "post":
                _this.setData({
                    postValue: _this.data.postList[e.detail.index]
                })
        }
        this.setData({
            result: [],
            count: 0,
            page: 1,
            active: false
        })
    },

    // 监听筛选条件（获取笔试成绩录入表里）
    getInputValue(e) {
        var _this = this
        var regu = /^[0-9]+\.?[0-9]*$/;
        if (e.detail.value == "") {
            _this.setData({
                active: false
            })
        } else if (!regu.test(e.detail.value)) {
            wx.showToast({
                title: '请输入正确的分数',
                icon: 'error'
            })
            _this.setData({
                active: true
            })
        } else {
            _this.setData({
                gradeValue: Number(e.detail.value),
                active: true
            })
        }
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
                this.search()
            }
        });
    },

    //查询
    search() {
        let _this = this //作用域 
       
        if (!_this.data.departmentValue) {
            wx.showToast({ title: '请选择主管部门', icon: 'error' })
            return
        }
        if (!_this.data.employerValue) {
            wx.showToast({ title: '请选择招聘单位', icon: 'error' })
            return
        }
        if (!_this.data.postValue) {
            wx.showToast({ title: '请选择招聘岗位', icon: 'error' })
            return
        }
        if (!_this.data.gradeValue) {
            wx.showToast({ title: '请输入成绩', icon: 'error' })
            return
        }

        wx.showLoading({ title: '查询中...', mask: true })

        wx.request({
            url: "https://zg99.offcn.com/index/shaifen/register",
            data: {
                actid: this.data.actid,

               
                department: this.data.departmentValue,
                employer: this.data.employerValue,
                post: this.data.postValue,
                
                isagree: true,
                phone: this.data.phone,
                fenshu: this.data.gradeValue,
                sstime: new Date().valueOf()
            },
            success(res) {
                // console.log(res);
                try {
                    let registerRes = JSON.parse(res.data.substring(1, res.data.length - 1)) //去头尾（）,转为json对象
                    if (registerRes.status !== 1) { //如果status不等于1，弹出错误提示
                        wx.showToast({
                            title: list.msg,
                            icon: 'none'
                        })
                        return
                    }
                    //获取同岗位晒分信息列表
                    wx.request({
                        url: "https://zg99.offcn.com/index/shaifen/getphoneinfo",
                        data: {
                            actid: _this.data.actid,
                            phone: _this.data.phone,
                            limits: 200,
                            sstime: new Date().valueOf()
                        },
                        success(res) {
                            try {
                                let getphoneinfoRes = JSON.parse(res.data.substring(1, res.data.length - 1)) //去头尾（）,转为json对象

                                if (getphoneinfoRes.status !== 1) { //如果status不等于1，弹出错误提示
                                    wx.showToast({
                                        title: list.msg,
                                        icon: 'none'
                                    })
                                    return
                                }
                                wx.hideLoading() // 隐藏 loading
                                _this.setData({
                                    result: getphoneinfoRes.lists,
                                    userspm: getphoneinfoRes.users.dqpaiming
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
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 获取数据
            wx.request({
                url: "https://zg99.offcn.com/index/shaifen/getlevel?actid=" + _this.data.actid + "&callback=?",
                data: {
                    level: "1",
                    grfiled: '',
                    grtext: '',
                    sstime: new Date().valueOf()
                },
                success(res) {
                    console.log(res)
                    try {
                        let list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // console.log(list)
                        if (list.status !== 1) { //如果status不等于1，弹出错误提示
                            wx.showToast({
                                title: list.msg,
                                icon: 'none'
                            })
                            return
                        }
                        if (list.lists.length <= 0) { //如果内容长度小于等于0，弹出无数据提示
                            wx.showToast({
                                title: '没有更多数据啦',
                                icon: 'none'
                            })
                            return
                        }
                        // 录入地市里的单位，不用提前清空，因为只进行一次获取
                        for (var i = 0; i < list.lists.length; i++) {
                            _this.setData({
                                departmentList: _this.data.departmentList.concat(list.lists[i].department)
                            });
                        };
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
