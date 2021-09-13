Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:'吉林教师考试-盲盒抽奖',
        CRMEFSID: "ac44909f38e3a6fafd83fb2f66a3fa0b", // CRM 活动表单 ID
        CRMRemark: "活动编码:HD202109130612,活动表单ID:99491", // CRM 注释 小程序-2021年吉林教师招聘盲盒抽奖

        phone: "", // 用户手机号码
        suffix: "", // 推广后缀
    },

    /**
     * 监听页面滚动
     * 用于 显示 header / 隐藏 header
     */
    // onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

    // 隐藏奖品
    hideAward: function () {
        this.setData({ showAward: false })
    },

    // 显示奖品
    showAward: function () {
        this.setData({ showAward: true })
    },

    // 转盘 抽奖并转动转盘
    getLottery: function () {
        const _this = this
        wx.showLoading({ title: '准备中...', mask: true })
        wx.request({
            url: 'https://zg99.offcn.com/index/choujiang/lottery',
            data: {
                timestamp: (new Date()).valueOf(),
                actid: 42302,
                tabnum: 1,
                phone:  this.data.phone,
            },
            success(res) {
                wx.hideLoading() // 隐藏 loading
                try {
                    const response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾（）,转为json对象
                    console.log(response)
                    if (response.msg === '抽奖成功') {
                        // 在奖品列表中查找用户抽中的奖品
                        if (_this.data.awards.findIndex(item => item.name === response.prizename) === -1) {
                            // 在当前项目的奖品列表中没有找到接口返回的奖品, 可能是用户已经参与过其他项目的抽奖
                            getApp().methods.handleError({ err: response, title: '呃..出错啦！', content: '您是否已经参与过抽奖？一位用户仅可参与一次抽奖喔～(如未参与，请重启小程序后再试)' })
                        } else {
                            // 找到了奖品
                            _this.setData({ showAward: true, prizeInfo: _this.data.awards[response.prizeid-1] })
                        }
                    } else if (response.msg === '您已经参与抽奖') {
                        // 在奖品列表中查找用户抽中的奖品
                        if (_this.data.awards.findIndex(item => item.name === response.prizename) === -1) {
                            // 在当前项目的奖品列表中没有找到接口返回的奖品, 可能是用户已经参与过其他项目的抽奖
                            getApp().methods.handleError({ err: response, title: '呃..出错啦！', content: '您是否已经参与过抽奖？一位用户仅可参与一次抽奖喔～(如未参与，请重启小程序后再试)' })
                        } else {
                            // 找到了奖品
                            wx.showToast({ icon: 'none', title: '您已经进行过抽奖, 抽中的奖品是：' + response.prizename, })
                        }
                    } else if (response.msg === '超过奖品设置的数量') {
                        // 返回错误: 超过奖品设置的数量，经过测试，抽奖接口存在奖品尚有余量但是返回这个错误的问题，猜测可能是由于奖品概率设置导致的
                        // 为了保证用户体验，返回这个错误的时候前台展示为抽中“再抽一次”，提示用户重抽 
                        // 转动转盘到再抽一次
                        wx.showToast({ icon: 'none', title: '什么也没抽中喔，再试一次吧～' })
                    } else {
                        // 其他错误, 弹出窗口提示错误内容
                        getApp().methods.handleError({ err: response, content: response.msg })
                    }
                } catch (err) {//捕获错误并报错
                    getApp().methods.handleError({ err, content: '抽奖失败, 请稍后再试～' })
                }
            },
            fail: err => {//获取失败后提示
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, content: '抽奖失败, 请稍后再试～' })
            }
        })
    },

    // 注册 获取手机号码并推送到对应到 CRM 活动中
    signUp: function (e) {
        // 判断是否授权使用手机号
        if (e.detail.errMsg !== 'getPhoneNumber:ok') {
            getApp().methods.handleError({
                err: e.detail.errMsg,
                title: "出错啦",
                content: "需要您同意授权获取手机号码后才能完成登陆～"
            })
            return
        }

        wx.showLoading({ title: '注册中...', mask: true })

        // 提交注册
        getApp().methods.register(e, this.data.suffix, this.data.CRMEFSID, this.data.CRMRemark, phone => {
            wx.hideLoading() // 隐藏 loading
            this.setData({ phone }) // 保存手机号信息
            wx.showToast({ icon: 'none', title: '注册成功, 请点击盲盒开始抽奖～', }) // 弹出提示
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取页面入参中的推广后缀
        if (typeof options.scene !== "undefined") {
            this.setData({
                suffix: options.scene
            })
        }

        // 判断是否是单页模式
        if (wx.getLaunchOptionsSync().scene !== 1154) {
            getApp().methods.login(this.data.CRMEFSID, this.data.suffix, this.data.CRMRemark, phone => this.setData({ phone })) // 登陆
        }
        // 渲染奖品
        const awards = [
            { name: '1980元教育基础知识园丁基础班' },
            { name: '万人易错题（上下册）' },
            { name: '六本套大礼包' },
            { name: '公基：通用知识模拟试卷' },
            { name: '教基+公基+幼儿电子版备考资料' },
            { name: '隐藏版：教育基础知识题6000题（上下两册共四本）' },
            { name: '再试一次', remark: '' },
        ];

        this.setData({ awards });
        // this.formatOptions(awards); // 渲染转盘
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/09/08/share.jpg'
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