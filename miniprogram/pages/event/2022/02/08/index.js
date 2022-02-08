
Page({

    /**
     * 页面的初始数据
     */
    data: {
        backgroundAudioStatus: '关闭音效', // 背景音效状态文字
        enableBackgroundAudio: false,

        init: true,
    },

    // 隐藏奖品
    hideAward: function () {
        this.setData({ showAward: false })
    },

    // 显示奖品
    showAward: function () {
        this.setData({ showAward: true })
    },

    // 转盘 抽奖并转动转盘
    getLottery: function (e) {
        const _this = this
        // 开始盲盒动画
        this.setData({ dj_active: e.currentTarget.dataset.index });
        const time = new Date().getTime();

        // 请求接口进行抽奖
        wx.request({
            url: 'https://zg99.offcn.com/index/choujiang/mtlottery',
            data: {
                timestamp: (new Date()).valueOf(),
                actid: 46201,
                tabnum: 1,
                phone: this.data.phone,
                type: this.data.awardInfo.project,
            },
            success(res) {
                // 停止盲盒动画
                try {
                    const response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾（）,转为json对象
                    // console.log(response)
                    // index.js? [sm]:84 {status: 1, msg: "抽奖成功", prizeid: 5, prizename: "奖品2"}
                    // index.js? [sm]:84 {status: 2, msg: "您已经参与抽奖", prizeid: 5, prizename: "奖品2"}
                    // index.js? [sm]:84 {status: 4, msg: "超过奖品设置的数量"}
                    if (response.msg === '抽奖成功') {
                        // 在奖品列表中查找用户抽中的奖品
                        if (_this.data.awardInfo.awards.findIndex(item => item.name === response.prizename) === -1) {
                            // 在当前项目的奖品列表中没有找到接口返回的奖品, 可能是用户已经参与过其他项目的抽奖
                            const timer = setInterval(() => {
                                if ((new Date()).getTime() - time > 1600) {
                                    clearInterval(timer);
                                    _this.setData({ dj_active: -1 });
                                    getApp().methods.handleError({ err: response, title: '呃..出错啦！', content: '您是否已经参与过其他考试项目的抽奖？一位用户仅可参与一次抽奖喔～(如未参与，请重启小程序后再试)' })
                                }
                            }, 50);
                        } else {
                            // 找到了奖品
                            const awardIndex = _this.data.awardInfo.awards.findIndex(item => item.name === response.prizename);
                            const timer = setInterval(() => {
                                if ((new Date()).getTime() - time > 1600) {
                                    clearInterval(timer);
                                    _this.setData({ dj_active: -1, showAward: true, 'awardInfo.prizeInfo': _this.data.awardInfo.awards[awardIndex] })

                                }
                            }, 50);
                        }
                    } else if (response.msg === '您已经参与抽奖') {
                        // 在奖品列表中查找用户抽中的奖品
                        if (_this.data.awardInfo.awards.findIndex(item => item.name === response.prizename) === -1) {
                            // 在当前项目的奖品列表中没有找到接口返回的奖品, 可能是用户已经参与过其他项目的抽奖
                            const timer = setInterval(() => {
                                if ((new Date()).getTime() - time > 1600) {
                                    clearInterval(timer);
                                    _this.setData({ dj_active: -1 });
                                    getApp().methods.handleError({ err: response, title: '呃..出错啦！', content: '您是否已经参与过其他考试项目的抽奖？一位用户仅可参与一次抽奖喔～(如未参与，请重启小程序后再试)' })
                                }
                            }, 50);
                        } else {
                            // 找到了奖品
                            const awardIndex = _this.data.awardInfo.awards.findIndex(item => item.name === response.prizename);
                            const timer = setInterval(() => {
                                if ((new Date()).getTime() - time > 1600) {
                                    clearInterval(timer);
                                    wx.showToast({ icon: 'none', title: '您已经进行过抽奖, 抽中的奖品是：' + _this.data.awardInfo.awards[awardIndex].name, })
                                    _this.setData({ dj_active: -1, 'awardInfo.prizeInfo': _this.data.awardInfo.awards[awardIndex] })
                                }
                            }, 50);
                        }
                    } else if (response.msg === '超过奖品设置的数量') {
                        // 返回错误: 超过奖品设置的数量，经过测试，抽奖接口存在奖品尚有余量但是返回这个错误的问题，猜测可能是由于奖品概率设置导致的
                        // 为了保证用户体验，返回这个错误的时候前台展示为抽中“再抽一次”，提示用户重抽 
                        const timer = setInterval(() => {
                            if ((new Date()).getTime() - time > 1600) {
                                clearInterval(timer);
                                _this.setData({ dj_active: -1 });
                                setTimeout(() => wx.showToast({ icon: 'none', title: '什么也没抽中喔，再试一次吧～' }), 4e3);
                            }
                        }, 50);
                    } else {
                        // 其他错误, 弹出窗口提示错误内容
                        const timer = setInterval(() => {
                            if ((new Date()).getTime() - time > 1600) {
                                clearInterval(timer);
                                _this.setData({ dj_active: -1 });
                                getApp().methods.handleError({ err: response, content: response.msg })
                            }
                        }, 50);
                    }
                } catch (err) {//捕获错误并报错
                    getApp().methods.handleError({ err, content: '抽奖失败, 请稍后再试～' })
                }
            },
            fail: err => {//获取失败后提示
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, content: '抽奖失败, 请稍后再试～' })
            }
        });
    },

    // 注册 获取手机号码并推送到对应到 CRM 活动中
    signUp: function (event) {
        let CRMConfig = null, awards = null;

        switch (event.currentTarget.dataset.project) {
        
            case 'sydw':
                // 事业单位项目
                CRMConfig = {
                    SID: '65dce64d5e2b3dd6dab77be76afcb861',
                    Remark: '小程序-元宵节盲盒抽奖,HD202202070130,114633'
                }
                awards = [
                    { name: '考点精题班网课', chance: 33.3, remark: '恭喜您中奖，获得奖品:考点精题班网课，我们会在2月21号起3个工作日之内，为您开通课程，请注意查收。' },
                    { name: '公基精研360题', chance: 33.3, remark: '恭喜您中奖，获得奖品:公基精研360题，我们会在2月21号起3个工作日之内，为您开通课程，请注意查收。。' },
                    { name: '精编模拟卷2套', chance: 33.3, remark: '恭喜您中奖，获得奖品:精编模拟卷2套，我们会在2月21号起3个工作日之内，为您开通课程，请注意查收。' },
                

                ];
                this.setData({ awardInfo: { project: '事业单位', awards } });
                break;
           
        }

        if (CRMConfig && awards) {
            if (!this.data.phone) {
                // 登录
                getApp().methods.newLogin({
                    event, crmEventFormSID: CRMConfig.SID, suffix: this.data.suffixInfo, remark: CRMConfig.Remark, callback: ({ phone, openid }) => {
                        this.setData({ phone, openid, init: false });
                    }
                });
            } else {
                // 推送数据到 crm
                getApp().methods.push2crm({ phone: this.data.phone, crmEventFormSID: CRMConfig.SID, suffix: this.data.suffixInfo, remark: CRMConfig.Remark });
                this.setData({ init: false });
            }
        } else {
            wx.hideLoading() // 隐藏 loading
            wx.showToast({ icon: 'error', title: '出错啦！请稍后再试～' })
        }
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
    onLoad: async function (options) {
        const _this = this;
        // 获取页面入参中的推广后缀
        if (typeof options.scene !== "undefined") {
            this.setData({
                suffix: options.scene
            })
        }

        const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
        this.setData({ suffixInfo }); // 保存后缀信息

        getApp().methods.requsetWithCode({
            path: "/user/login/check",
            // 推送 crm 并返回数据
            callback: res => res.errorMessage !== '用户未登录或登陆态已失效' && this.setData({ phone: res.data.phone, openid: res.data.openid })
        });

        wx.showModal({
            title: '是否开启背景音乐',
            success(res) {
                if (res.confirm) {
                    _this.setData({ enableBackgroundAudio: true });
                    // 配置背景音乐相关内容 开始
                    const backgroundAudioManager = wx.getBackgroundAudioManager() // 背景音乐播放器实例
                    backgroundAudioManager.title = '元宵节快乐！'
                    backgroundAudioManager.epname = '祝您新年快乐!'
                    backgroundAudioManager.singer = '中公教育'
                    backgroundAudioManager.coverImgUrl = 'http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/event20220208share.jpg'
                    // 设置了 src 之后会自动播放
                    backgroundAudioManager.src = 'cloud://release-yum30.7265-release-yum30-1304214848/event/2022/01/18/5c2985282d9ee.mp3'
                    // 监听播放结束, 播放结束后重新开始播放
                    backgroundAudioManager.onEnded(() => {
                        backgroundAudioManager.src = 'cloud://release-yum30.7265-release-yum30-1304214848/event/2022/01/18/5c2985282d9ee.mp3'
                    })
                    // 配置背景音乐相关内容 结束
                }
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '元宵节快乐！一起来抽福袋~',
            imageUrl: 'http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/event20220208share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '元宵节快乐！一起来抽福袋~'
        }
    }
})