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
        backgroundColor: "",
        actid: "",
        version:"",

        fencha:"",
        zhuifen:"",
        bszb:"",
        mszb:"",

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        phone: "", // 用户手机号码
    },

  // 获取分差
  getInputValue(e) {
    var _this = this
    var regu = /^[0-9]+\.?[0-9]*$/;
    if (e.detail.value == "") {
        // _this.setData({
        //     iscount: false
        // })
    } else if (!regu.test(e.detail.value)) {
        wx.showToast({
            title: '请输入正确数字',
            icon: 'error'
        })
       
    } else {
        _this.setData({
            fencha: Number(e.detail.value),
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
            }
        });
    },
    //查询
    search() {
        let _this = this //作用域 
        if (!_this.data.fencha) {
            wx.showToast({
                title: '请输入分差',
                icon: 'error'
            })
            return
        }
        _this.setData({
            //笔试面试占比4:6(2:3)
            zhuifen: Number(((_this.data.fencha*_this.data.bszb)/_this.data.mszb).toFixed(2)),
                            
           
        })
       console.log( this.data.zhuifen);
    },
    showmore: function (event) {
        this.setData({
            showIndex: event.currentTarget.dataset.index
        })
    },
    /**h
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

        getApp().methods.getSuffix(options).then(res => {

            this.setData(res);
            // 获取活动配置
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getfylist",
                data: {
                    actid: options.actid,
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
                            actid: options.actid,
                            CRMEFSID: response.lists[0].CRMEFSID,
                            imageUrl: response.lists[0].imageUrl,
                            title: response.lists[0].title,
                            shareImages: response.lists[0].shareImages,
                            backgroundColor: response.lists[0].backgroundColor,
                            version: response.lists[0].version,
                            bszb:response.lists[0].bszb,
                            mszb:response.lists[0].mszb
                        
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