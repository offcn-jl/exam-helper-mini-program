// pages/event-2021-06-01/index.js

Page({

    /**
     * 页面的初始数据
     */
    data: {
        backgroundAudioStatus: '关闭音效', // 背景音效状态文字

        phone: "", // 用户手机号码
        suffix: "", // 推广后缀
    },

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
            url: 'https://zg99.offcn.com/index/choujiang/mtlottery',
            data: {
                timestamp: (new Date()).valueOf(),
                actid: 38507,
                tabnum: 2,
                phone: this.data.phone,
                type: this.data.awardInfo.project,
            },
            success(res) {
                wx.hideLoading() // 隐藏 loading
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
                            getApp().methods.handleError({ err: response, title: '呃..出错啦！', content: '您是否已经参与过其他考试项目的抽奖？一位用户仅可参与一次抽奖喔～(如未参与，请重启小程序后再试)' })
                        } else {
                            // 找到了奖品
                            // 禁用转盘按钮，配置展示用户已经抽中的奖品，弹出抽奖成功窗口
                            const awardIndex = _this.data.awardInfo.awards.findIndex(item => item.name === response.prizename);
                            _this.setData({ btnDisabled: "disabled", animationData: getRollAnimation(awardIndex, _this.data.awardInfo.awards.length) })
                            setTimeout(() => {
                                _this.setData({ showAward: true, 'awardInfo.prizeInfo': _this.data.awardInfo.awards[awardIndex] })
                            }, 4e3);
                        }
                    } else if (response.msg === '您已经参与抽奖') {
                        // 在奖品列表中查找用户抽中的奖品
                        if (_this.data.awardInfo.awards.findIndex(item => item.name === response.prizename) === -1) {
                            // 在当前项目的奖品列表中没有找到接口返回的奖品, 可能是用户已经参与过其他项目的抽奖
                            getApp().methods.handleError({ err: response, title: '呃..出错啦！', content: '您是否已经参与过其他考试项目的抽奖？一位用户仅可参与一次抽奖喔～(如未参与，请重启小程序后再试)' })
                        } else {
                            // 找到了奖品
                            // 禁用转盘按钮，配置展示用户已经抽中的奖品
                            const awardIndex = _this.data.awardInfo.awards.findIndex(item => item.name === response.prizename);
                            _this.setData({ btnDisabled: "disabled", animationData: getRollAnimation(awardIndex, _this.data.awardInfo.awards.length) })
                            setTimeout(() => {
                                wx.showToast({ icon: 'none', title: '您已经进行过抽奖, 抽中的奖品是：' + _this.data.awardInfo.awards[awardIndex].name, })
                                _this.setData({ 'awardInfo.prizeInfo': _this.data.awardInfo.awards[awardIndex] })
                            }, 4e3);
                        }
                    } else if (response.msg === '超过奖品设置的数量') {
                        // 返回错误: 超过奖品设置的数量，经过测试，抽奖接口存在奖品尚有余量但是返回这个错误的问题，猜测可能是由于奖品概率设置导致的
                        // 为了保证用户体验，返回这个错误的时候前台展示为抽中“再抽一次”，提示用户重抽 
                        // 转动转盘到再抽一次
                        _this.setData({ animationData: getRollAnimation(_this.data.awardInfo.awards.findIndex(item => item.name === '再试一次'), _this.data.awardInfo.awards.length) })
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

        let CRMConfig = null, awards = null;

        switch (e.currentTarget.dataset.project) {
            case 'gwy':
                // 公务员项目
                CRMConfig = {
                    SID: '2ed8c6db4862c5258d6d87e0620ef3f3',
                    Remark: '公务员六一转盘抽奖活动,HD202105281600,87670'
                }
                awards = [
                    { name: '视频VIP会员', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '圈圈机', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '溜溜球', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '再试一次', remark: '' },
                    { name: '入仕计划网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '模拟试卷电子资料', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '公考先飞赢网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                ];
                this.setData({ awardInfo: { project: '公务员', awards } });
                break;
            case 'sydw':
                // 事业单位项目
                CRMConfig = {
                    SID: 'ec252b5ecc9dca0243d93a0b86c2f225',
                    Remark: '事业单位六一转盘抽奖活动,,87632'
                }
                awards = [
                    { name: '视频VIP会员', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '圈圈机', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '溜溜球', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '再试一次', remark: '' },
                    { name: '锦囊备考网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '随身看网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '备考营网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                ];
                this.setData({ awardInfo: { project: '事业单位', awards } });
                break;
            case 'jszp':
                // 教师招聘项目
                CRMConfig = {
                    SID: '3b80ac4a1a037a38279a2c5168931731',
                    Remark: '教师招聘六一转盘抽奖活动,HD202105281612,87673'
                }
                awards = [
                    { name: '视频VIP会员', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '圈圈机', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '溜溜球', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '再试一次', remark: '' },
                    { name: '开年第一讲网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '教育基础知识网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '桃李匠心网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                ];
                this.setData({ awardInfo: { project: '教师招聘', awards } });
                break;
            case 'tgjs':
                // 特岗教师项目
                CRMConfig = {
                    SID: 'daf48c6b5d41b1ecac3a890bf4a03039',
                    Remark: '特岗教师六一转盘抽奖活动,HD202105281623,87675'
                }
                awards = [
                    { name: '视频VIP会员', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '圈圈机', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '溜溜球', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '再试一次', remark: '' },
                    { name: '教基暑期网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '视频课合集', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '备考电子资料', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                ];
                this.setData({ awardInfo: { project: '特岗教师', awards } });
                break;
            case 'jszg':
                // 教师资格项目
                CRMConfig = {
                    SID: '4f7232ec083ea4d43064a84b747005f1',
                    Remark: '教师资格六一转盘抽奖活动,HD202105281619,87674'
                }
                awards = [
                    { name: '视频VIP会员', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '圈圈机', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '溜溜球', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '再试一次', remark: '' },
                    { name: '笔试乐学包', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '笔试宝典电子资料', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '巧学巧记网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                ];
                this.setData({ awardInfo: { project: '教师资格', awards } });
                break;
            case 'ylzp':
                // 医疗招聘项目
                CRMConfig = {
                    SID: '0aa813c497fb99eb6a36849cedce6ec8',
                    Remark: '医疗六一转盘抽奖活动,HD202105281650,87678'
                }
                awards = [
                    { name: '视频VIP会员', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '圈圈机', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '溜溜球', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '再试一次', remark: '' },
                    { name: '医护有道网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '春来焕医网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '医护起航网课', remark: '活动结束后，三个工作日内为您开通课程，使用您参与活动的手机号码登录19课堂->查看我的课程即可。如有疑问可拨打：0431-81239600,0431-81239633。' },
                ];
                this.setData({ awardInfo: { project: '医疗招聘', awards } });
                break;
            case 'jgks':
                // 建工考试项目
                CRMConfig = {
                    SID: '4b8d6e9508119fa1fc8ea5a3154d1f27',
                    Remark: '建工六一转盘抽奖活动,HD202105281646,87677'
                }
                awards = [
                    { name: '视频VIP会员', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '圈圈机', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '溜溜球', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '再试一次', remark: '' },
                    { name: '一建及二建试题', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '一建及二建网课', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                    { name: '一建及二建资料加网课', remark: '活动结束后，三个工作日内将会有工作人员致电您确认领取方式。如有疑问可拨打：0431-81239600,0431-81239633。' },
                ];
                this.setData({ awardInfo: { project: '建工考试', awards } });
                break;
        }

        if (CRMConfig && awards) {
            // 提交注册
            getApp().methods.register(e, this.data.suffix, CRMConfig.SID, CRMConfig.Remark, phone => {
                wx.hideLoading() // 隐藏 loading
                this.setData({ phone }) // 保存手机号信息
                wx.showToast({ icon: 'none', title: '注册成功, 请点击转盘开始抽奖～', }) // 弹出提示
                this.formatOptions(awards); // 切换到转盘
            })
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
    onLoad: function (options) {
        // 获取页面入参中的推广后缀
        if (typeof options.scene !== "undefined") {
            this.setData({
                suffix: options.scene
            })
        }

        // 配置背景音乐相关内容 开始
        const backgroundAudioManager = wx.getBackgroundAudioManager() // 背景音乐播放器实例
        backgroundAudioManager.title = '儿童节快乐！'
        backgroundAudioManager.epname = 'Happy children\'s day!'
        backgroundAudioManager.singer = '中公教育'
        backgroundAudioManager.coverImgUrl = 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/06/01/share.jpg'
        // 设置了 src 之后会自动播放
        backgroundAudioManager.src = 'cloud://release-yum30.7265-release-yum30-1304214848/event/2021/06/01/6093af04a3003.mp3'
        // 监听播放结束, 播放结束后重新开始播放
        backgroundAudioManager.onEnded(() => {
            backgroundAudioManager.src = 'cloud://release-yum30.7265-release-yum30-1304214848/event/2021/06/01/6093af04a3003.mp3'
        })
        // 配置背景音乐相关内容 结束
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '祝各位小朋友和大朋友们节日快乐～',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2021/06/01/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '祝各位小朋友和大朋友们节日快乐～'
        }
    }
})