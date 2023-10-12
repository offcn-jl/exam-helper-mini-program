// pages/sydw/2022/yb/shaif/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:"2024国考活动",
        imageUrl: "", // 背景图片
        successimageUrl:"",
        shareImages: "", // 分享时显示的图片
        CRMEFSID: "", // CRM 活动表单 ID
        actid: "54022", //zg99id
        gradeValue: 0, // 成绩

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        phone: "", // 用户手机号码
        openid: "", // openid
        signed: false
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
                title: '请输入数字',
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
        if (!_this.data.gradeValue) {
            wx.showToast({
                title: '请输入数字',
                icon: 'error'
            })
            return
        }
       
        wx.request({
            url: "https://zg99.offcn.com/index/chaxun/writelogs",
            data: {
                actid: this.data.actid,
                isagree: true,
                phone: getApp().globalData.user.username,
                fenshu: this.data.gradeValue,
                sstime: new Date().valueOf()
            },
            success(res) {
        
                try {
                    let registerRes = JSON.parse(res.data.substring(1, res.data.length - 1)) //去头尾（）,转为json对象
                    if (registerRes.status !== 1) { //如果status不等于1，弹出错误提示
                        if(registerRes.msg==="记录失败"){
                            wx.showToast({
                                title: "预测人数已提交",
                            })
                            _this.setData({signed: true });
                            return
                        }
                        wx.showToast({
                            title: registerRes.msg,
                            icon: 'none'
                        })
                        return
                    }
                    _this.setData({signed: true });
                    wx.showToast({
                        title: "提交成功",
                    })
                } catch (err) { //捕获错误并报错
                    getApp().methods.handleError({
                        err,
                        title: "出错啦",
                        content: '提交失败',
                        reLaunch: true
                    })
                }
            },
            fail: err => { //获取失败后提示
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({
                    err: err,
                    title: "出错啦",
                    content: '提交失败',
                    reLaunch: true
                })
            },
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

        // 获取后缀信息
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 获取活动配置
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getfylist",
                data: {
                    actid: _this.data.actid,
                    tabnum: "1",
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
                            CRMEFSID: response.lists[0].CRMEFSID,
                            imageUrl: response.lists[0].imageUrl,
                            shareImages: response.lists[0].shareImages,
                            successimageUrl:response.lists[0].successimageUrl,
                        
                        })
                 
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
            shareImages: this.data.shareImages,
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