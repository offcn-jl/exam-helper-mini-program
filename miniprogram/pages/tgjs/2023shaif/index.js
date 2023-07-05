// pages/tgjs/2022/shaif/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title: "2023年吉林特岗教师晒分系统", // 标题
        banner_bk: "https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/2023tgjsshaif.jpg", // 背景图片
        imageUrl: "https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/2023tgjsshaifshare.jpg", // 分享时显示的图片
        CRMEFSID: "6d9b4ef80502fa25954678f9cbd85622", // CRM 活动表单 ID159626
        CRMRemark: "活动编码:HD202307040157，2023年吉林特岗教师晒分系统", // CRM 注释  小程序-2021吉林省特岗教师晒分系统
        actid: "53319", //zg99id  2022年吉林特岗教师晒分系统

        cityList: [], //地市
        countyList: [], //县区
        jihuaList: [],//计划
        subjectList: [], //学段
        postList: [], //岗位

        cityValue: '', //地市
        countyValue: '', //县区
        jihuaValue: '', //计划
        subjectValue: '', //学段
        postValue: '', //岗位
        gradeValue: 0, //成绩

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
            case "city": //县区
                _this.setData({
                    cityValue: _this.data.cityList[e.detail.index]
                })
                // zg99二级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/shaifen/getlevel?actid=" + _this.data.actid + "&callback=?", //路径
                    data: {
                        level: '2',
                        grfiled: 'city',
                        grtext: _this.data.cityValue,
                        sstime: new Date().valueOf()
                    }, //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let county_list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // 现将之前地市选项中岗位内容清空
                        _this.setData({
                            countyList: [],
                            jihuaList: [],
                            subjectList: [],
                            postList: []
                        });
                        // 将数据添加到已清空的报考职位中
                        for (var i = 0; i < county_list.lists.length; i++) {
                            _this.setData({
                                countyList: _this.data.countyList.concat(county_list.lists[i].county)
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
            case "county": //县区
                _this.setData({
                    countyValue: _this.data.countyList[e.detail.index]
                })
                // zg99三级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/shaifen/getlevel?actid=" + _this.data.actid + "&callback=?", //路径
                    data: {
                        level: '3',
                        grfiled: 'county',
                        grtext: _this.data.countyValue,
                        onefiled:'city',
                        onetext:this.data.cityValue,
                        sstime: new Date().valueOf()
                    }, //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        _this.setData({
                            subjectList: [],
                            postList: []
                        });
                        for (var i = 0; i < list.lists.length; i++) {
                            console.log(list.lists[i].jihua);
                            _this.setData({
                                jihuaList: _this.data.jihuaList.concat(list.lists[i].jihua)
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
            case "jihua": //计划
                _this.setData({
                    jihuaValue: _this.data.jihuaList[e.detail.index]
                })
                // zg99四级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/shaifen/getlevel?actid=" + _this.data.actid + "&callback=?", //路径
                    data: {
                        level: '4',
                        grfiled: 'jihua',
                        grtext: _this.data.jihuaValue,
                        onefiled:'city',
                        onetext:this.data.cityValue,
                        twofiled:'county',
                        twotext:this.data.countyValue,
                        sstime: new Date().valueOf()
                    }, //二级联动，上级联动字段名，上级联动参数值
                    success(res) {
                        let post_list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
                        // 现将之前地市选项中岗位内容清空
                        _this.setData({
                            subjectList: []
                        });
                        for (var i = 0; i < post_list.lists.length; i++) {
                            _this.setData({
                                subjectList: _this.data.subjectList.concat(post_list.lists[i].subject)
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
            case "subject": //学段
                _this.setData({
                    subjectValue: _this.data.subjectList[e.detail.index]
                })
                // zg99四级联动
                wx.request({
                    url: "https://zg99.offcn.com/index/shaifen/getlevel?actid=" + _this.data.actid + "&callback=?", //路径
                    data: {
                        level: '5',
                        grfiled: 'subject',
                        grtext: _this.data.subjectValue,
                        onefiled:'city',
                        onetext:this.data.cityValue,
                        twofiled:'county',
                        twotext:this.data.countyValue,
                        threefiled:'jihua',
                        threetext:this.data.jihuaValue,
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
            case "post": //学科
            _this.setData({
                postValue:_this.data.postList[e.detail.index]
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
        if(!_this.data.cityValue){
            wx.showToast({title: '请选择地市',icon: 'error'})
            return
        }
        if(!_this.data.countyValue){
            wx.showToast({title: '请选择县区',icon: 'error'})
            return
        }
        if(!_this.data.jihuaValue){
            wx.showToast({title: '请选择计划',icon: 'error'})
            return
        }
        if(!_this.data.subjectValue){
            wx.showToast({title: '请选择学段',icon: 'error'})
            return
        }
        if(!_this.data.postValue){
            wx.showToast({title: '请选择学科',icon: 'error'})
            return
        }
        if(!_this.data.gradeValue){
            wx.showToast({title: '请输入成绩',icon: 'error'})
            return
        }

        wx.showLoading({
            title: '查询中...',
            mask: true
        })
   
        wx.request({
            url: "https://zg99.offcn.com/index/shaifen/register",
            data: {
                actid:this.data.actid,
                city: this.data.cityValue,
                county: this.data.countyValue,
                jihua: this.data.jihuaValue,
                subject:this.data.subjectValue,
                post:this.data.postValue,
                isagree:true,
                phone:this.data.phone,
                fenshu:this.data.gradeValue,
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
                            actid:_this.data.actid,
                            phone:_this.data.phone,
                            limits:200,
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
                                    result:getphoneinfoRes.lists,
                                    userspm:getphoneinfoRes.users.dqpaiming
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
                                cityList: _this.data.cityList.concat(list.lists[i].city)
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