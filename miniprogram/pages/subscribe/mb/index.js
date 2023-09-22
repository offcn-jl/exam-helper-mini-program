// pages/subscribe/2023/gk/gg/index.js

Page({
    /**
     * 页面的初始数据
     */
    data: {
        title: '', // 标题
        imageUrl: '', // 背景
        shareImages: '', // 分享图
        successImages: '', //分享成功图片
        backgroundColor: "",
        CRMEFSID: "", // CRM 活动表单 ID
        CRMRemark: "", // CRM 注释
        actid: "53950", //zg99id  
        version: "",
        type: '', //服务类型  （国家公务员，吉林公务员，事业单位，医疗招聘，教师招聘，特岗教师，教师资格，银行考试，三支一扶，公选遴选，社会工作，会计取证，军队文职，军人考试，医学考试，农信社，选调生，招警，国企）

        phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
        tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
    },

    /**
     * 监听页面滚动
     * 用于 显示 header / 隐藏 header
     */
    // onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },


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
                this.subscribe();
            }
        });
    },

    // subscribe 订阅
    subscribe() {
        getApp().methods.subscribeSingleExam(this.data.suffix, this.data.type, undefined, () => {
            this.setData({
                tipsToSubscribeMessaged: true
            });
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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
        // 获取后缀信息
        getApp().methods.getSuffix(options).then(res => {
            // 保存后缀信息
            this.setData(res);
            // 获取活动配置
            wx.request({
                url: "https://zg99.offcn.com/index/chaxun/getfzinfo",
                data: {
                    actid: _this.data.actid,
                    version: options.version,
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
                            successImages: response.lists[0].successImages,
                            type: response.lists[0].type,
                        }, function () {
                            // 这里setdata的回调函数，会在设置完数据之后执行

                            // 判断是否是单页模式
                            if (wx.getLaunchOptionsSync().scene !== 1154) {
                                // 不是单页模式，进行登陆操作
                                console.log(_this.data)
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
                        })

                        // 所以我给你把那登录的部分，放到了这个位置，但是放到这里还有一个问题， _this.setData 也是异步的，可能你刚设置完数据，马上用  _this.data.CRMEFSID, 是获取不到的


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
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            imageUrl: this.data.shareImages
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: this.data.title
        }
    }
})