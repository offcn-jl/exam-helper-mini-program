Page({

    /**
     * 页面的初始数据
     */
    data: {
        backgroundAudioStatus: '关闭音效', // 背景音效状态文字

        CRMEFSID: "63e6650fbb036a9db03fcb6273936552", // CRM 活动表单 ID
        CRMRemark: "活动编码:HD202109060600,活动表单ID:98673", // CRM 注释 小程序-周年庆超级礼

        phone: "", // 用户手机号码
        suffix: "", // 推广后缀
    },

    /**
     * 监听页面滚动
     * 用于 显示 header / 隐藏 header
     */
    onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

    // 隐藏奖品
    hideAward: function () {
        this.setData({ showAward: false })
    },

    // 显示奖品
    showAward: function () {
        this.setData({ showAward: true })
    },

    // 转盘 根据选项数量格式化转盘
    formatOptions: function (options) {
        const colors = ["#FD6592", "#FEFFFA"], textColors = ["#FEFFFA", "#FD6592"], t = options.length, i = 360 / t, s = i - 90, r = [], d = 1 / t, single = t == 2 || t % 2 == 1;
        for (let o = 942.47778 / t, g = 0; g < t; g++) {
            let l = colors[0];
            if (!single) {
                l = 1 == g % 2 ? colors[1] : colors[0];
            } else {
                l = colors[1];
            }
            let textColor = textColors[0];
            if (!single) {
                textColor = 1 == g % 2 ? textColors[1] : textColors[0];
            } else {
                textColor = textColors[1];
            }
            r.push({
                k: g,
                itemWidth: o + "px",
                item2BgColor: l,
                itemColor: textColor,
                item2Deg: g * i + 90 - i / 2 + "deg",
                item2Turn: g * d + d / 2 + "turn",
                ttt: "",
                tttSkewX: 4 * t + "deg",
                afterDeg: s + "deg",
                turn: g * d + "turn",
                lineTurn: g * d + d / 2 + "turn",
                award: options[g].name
            });
        }

        this.setData({
            single: single,
            awardsList: r
        });
    },

    // 转盘 抽奖并转动转盘
    getLottery: function () {
        const _this = this
        // 函数 生成旋转动画
        const getRollAnimation = (index, num) => {
            var animation = wx.createAnimation({
                duration: 4e3,
                timingFunction: "ease"
            });
            animation.rotate(_this.data.animationData ? _this.data.animationData.actions[0].animates[0].args[0] + (360 - _this.data.animationData.actions[0].animates[0].args[0] % 360) + 2160 - index * (360 / num) : 2160 - index * (360 / num)).step();
            return animation.export()
        }
        wx.showLoading({ title: '准备中...', mask: true })
        wx.request({
            url: 'https://zg99.offcn.com/index/choujiang/lottery',
            data: {
                timestamp: (new Date()).valueOf(),
                actid: 42205,
                tabnum: 1,
                phone:  this.data.phone,
            },
            success(res) {
                wx.hideLoading() // 隐藏 loading
                try {
                    const response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾（）,转为json对象
                    console.log(response)
                    // index.js? [sm]:84 {status: 1, msg: "抽奖成功", prizeid: 5, prizename: "奖品2"}
                    // index.js? [sm]:84 {status: 2, msg: "您已经参与抽奖", prizeid: 5, prizename: "奖品2"}
                    // index.js? [sm]:84 {status: 4, msg: "超过奖品设置的数量"}
                    if (response.msg === '抽奖成功') {
                        // 在奖品列表中查找用户抽中的奖品
                        if (_this.data.awards.findIndex(item => item.name === response.prizename) === -1) {
                            // 在当前项目的奖品列表中没有找到接口返回的奖品, 可能是用户已经参与过其他项目的抽奖
                            getApp().methods.handleError({ err: response, title: '呃..出错啦！', content: '您是否已经参与过抽奖？一位用户仅可参与一次抽奖喔～(如未参与，请重启小程序后再试)' })
                        } else {
                            // 找到了奖品
                            // 禁用转盘按钮，配置展示用户已经抽中的奖品，弹出抽奖成功窗口
                            const awardIndex = _this.data.awards.findIndex(item => item.name === response.prizename);
                            _this.setData({ btnDisabled: "disabled", animationData: getRollAnimation(awardIndex, _this.data.awards.length) })
                            setTimeout(() => {
                                _this.setData({ showAward: true, prizeInfo: _this.data.awards[awardIndex] })
                            }, 4e3);
                        }
                    } else if (response.msg === '您已经参与抽奖') {
                        // 在奖品列表中查找用户抽中的奖品
                        if (_this.data.awards.findIndex(item => item.name === response.prizename) === -1) {
                            // 在当前项目的奖品列表中没有找到接口返回的奖品, 可能是用户已经参与过其他项目的抽奖
                            getApp().methods.handleError({ err: response, title: '呃..出错啦！', content: '您是否已经参与过抽奖？一位用户仅可参与一次抽奖喔～(如未参与，请重启小程序后再试)' })
                        } else {
                            // 找到了奖品
                            // 禁用转盘按钮，配置展示用户已经抽中的奖品
                            const awardIndex = _this.data.awards.findIndex(item => item.name === response.prizename);
                            _this.setData({ btnDisabled: "disabled", animationData: getRollAnimation(awardIndex, _this.data.awards.length) })
                            setTimeout(() => {
                                wx.showToast({ icon: 'none', title: '您已经进行过抽奖, 抽中的奖品是：' + _this.data.awards[awardIndex].name, })
                                _this.setData({ prizeInfo: _this.data.awards[awardIndex] })
                            }, 4e3);
                        }
                    } else if (response.msg === '超过奖品设置的数量') {
                        // 返回错误: 超过奖品设置的数量，经过测试，抽奖接口存在奖品尚有余量但是返回这个错误的问题，猜测可能是由于奖品概率设置导致的
                        // 为了保证用户体验，返回这个错误的时候前台展示为抽中“再抽一次”，提示用户重抽 
                        // 转动转盘到再抽一次
                        _this.setData({ animationData: getRollAnimation(_this.data.awards.findIndex(item => item.name === '再试一次'), _this.data.awards.length) })
                        setTimeout(() => wx.showToast({ icon: 'none', title: '什么也没抽中喔，再试一次吧～' }), 4e3);
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
        console.log(1)
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
            wx.showToast({ icon: 'none', title: '注册成功, 请点击转盘开始抽奖～', }) // 弹出提示
        })
    },

    // 切换背景音频播放状态
    switchBackgroundAudioStatus: function () {
        const backgroundAudioManager = wx.getBackgroundAudioManager() // 背景音乐播放器实例
        if (backgroundAudioManager.paused) {
            backgroundAudioManager.play()
            this.setData({ backgroundAudioStatus: '关闭音效' })
        } else {
            backgroundAudioManager.pause()
            this.setData({ backgroundAudioStatus: '开启音效' })
        }
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
        // 配置背景音乐相关内容 开始
        const backgroundAudioManager = wx.getBackgroundAudioManager() // 背景音乐播放器实例
        backgroundAudioManager.title = '2022公务员考试宠粉福利'
        backgroundAudioManager.epname = '2022公务员考试宠粉福利'
        backgroundAudioManager.singer = '中公教育'
        backgroundAudioManager.coverImgUrl = 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/09/06/share.jpg'
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = 'cloud://release-yum30.7265-release-yum30-1304214848/event/2021/06/01/6093af04a3003.mp3'
        // 监听播放结束, 播放结束后重新开始播放
        backgroundAudioManager.onEnded(() => {
            backgroundAudioManager.src = 'cloud://release-yum30.7265-release-yum30-1304214848/event/2021/06/01/6093af04a3003.mp3'
        })
        // 配置背景音乐相关内容 结束

        // 判断是否是单页模式
        if (wx.getLaunchOptionsSync().scene !== 1154) {
            getApp().methods.login(this.data.CRMEFSID, this.data.suffix, this.data.CRMRemark, phone => this.setData({ phone })) // 登陆
        }
        // 渲染奖品
        const awards = [
            { name: '一等奖', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
            { name: '二等奖', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
            { name: '三等奖', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
            { name: '四等奖', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
            { name: '五等奖', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
            { name: '六等奖', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
            { name: '七等奖', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
            { name: '八等奖', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
            { name: '再试一次', remark: '' },
        ];

        this.setData({ awards });
        this.formatOptions(awards); // 渲染转盘
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '2022公务员考试宠粉福利',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/09/06/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '2022公务员考试宠粉福利'
        }
    }
})