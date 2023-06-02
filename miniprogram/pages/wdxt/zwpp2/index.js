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
        CRMRemark: "", // CRM 注释  长春事业单位历年分数线
        actid: "", //zg99id  
        backgroundColor: "",
        version: "",

        ageList: [],
        ageValue: "",

        educationList: [],
        educationValue: "",

        professionalList: [],
        professionalValue: "",

        search:"",

        // 列表展示配置
        listTitle: [], // 标题
        listContent: [], // 内容

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        phone: "", // 用户手机号码
        openid: "", //openid

        result: [],
        count: 0,
        page: 1,

    },
    // 监听筛选条件切换(地市做出选择以后，报考职位发生变化)
    m_select_touch(e) {
        var _this = this
        switch (e.detail.type) {
            case "age": //地市
                _this.setData({
                    ageValue: _this.data.ageList[e.detail.index],
      

                })
                break
            case "education": 
                _this.setData({
                    educationValue: _this.data.educationList[e.detail.index],
                
                })
          
                break
            case "professional": 
                _this.setData({
                    professionalValue:e.detail.text
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
        const query = {};
        if (this.data.ageValue !== '全部地市') {
            query[this.data.search[0]] = this.data.ageValue;
        }
        if (this.data.educationValue !== '全部学段') {
            query[this.data.search[1]] = this.data.educationValue;
        }
        if (this.data.professionalValue !== '全部学科') {
            query[this.data.search[2]] = this.data.professionalValue;
        }
        wx.request({
            url: "https://zg99.offcn.com/index/chaxun/getfylist?actid=" + _this.data.actid,
            data: {
                ...query,
                tabnum: 2,
                limits: 200,
                page: this.data.page,
                sstime: new Date().valueOf()
            },
            success(res) {
                wx.hideLoading() // 隐藏 loading
                try {
                    let response = JSON.parse(res.data.substring(1, res.data.length - 1)) //去头尾（）,转为json对象
                    if (response.status !== 1) { //如果status不等于1，弹出错误提示
                        wx.showToast({
                            title: response.msg,
                            icon: 'none'
                        })
                        return
                    }
                    if (response.lists.length <= 0) { //如果内容长度小于等于0，弹出无数据提示
                        wx.showToast({
                            title: '没有查询到职位',
                            icon: 'none'
                        })
                        return
                    }

                    //数据导入data.result
                    _this.setData({
                        result: _this.data.result.concat(response.lists), //不替换原数据添加新数据
                        page: (_this.data.result.concat(response.lists).length / 200) + 1, //计算分页页数
                        count: response.zcounts //总数量录入data
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
        // return
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
                            actid: options.actid,
                            CRMEFSID: response.lists[0].CRMEFSID,
                            imageUrl: response.lists[0].imageUrl,
                            title: response.lists[0].title,
                            shareImages: response.lists[0].shareImages,
                            backgroundColor: response.lists[0].backgroundColor,
                            CRMRemark: `特岗专业目录，${response.lists[0].title}，${options.version}`,

                            search:response.lists[0].search.split(','),

                            ageList: ['全部地市',...response.lists[0].age.split(',')],
                            educationList:  ['全部学段',...response.lists[0].education.split(',')],
                            professionalList:  ['全部学科',...response.lists[0].professional.split(',')],

                            listTitle: response.lists[0].listTitle.split(',').map(item=>{return {name: item.split('|')[0], itemName: item.split('|')[1]}}),
                            listContent: response.lists[0].listContent.split(',').map(item=>{return {name: item.split('|')[0], itemName: item.split('|')[1]}})
                        });
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
        if ( this.data.result.length < this.data.count) {
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