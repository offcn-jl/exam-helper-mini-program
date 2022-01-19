
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
                actid: 45948,
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
            case 'gwy':
                // 公务员项目
                CRMConfig = {
                    SID: 'abf3f8d863af6db352ac9430bac8b85a',
                    Remark: '小程序-2022吉林省考新年活动,HD202201120903,113227'
                }
                awards = [
                    { name: '多功能小台灯', chance: 10, remark: '恭喜您中奖，获得奖品多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '2022年吉林省考备考思维导图', chance: 20, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '2022年吉林省考公考常识30000条', chance: 30, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '2022年吉林省考-用申论的思维看热点—50条', chance: 40, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                ];
                this.setData({ awardInfo: { project: '公务员', awards } });
                break;
            case 'sydw':
                // 事业单位项目
                CRMConfig = {
                    SID: 'f3663c8f5e81826721088dffa3db1fa2',
                    Remark: '小程序-新年盲盒（事业单位）,HD202201120759,113202'
                }
                awards = [
                    { name: '多功能小台灯', chance: 10, remark: '恭喜您中奖，获得奖品多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '思维导图32页(电子版)', chance: 30, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '新事启闻模考卷3套(电子版)', chance: 30, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '趣学公基录播课程(920分钟)+配套电子版讲义', chance: 30, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                ];
                this.setData({ awardInfo: { project: '事业单位', awards } });
                break;
            case 'jszp':
                // 教师招聘项目
                CRMConfig = {
                    SID: '95c1d582f4fabc885744898919280f1f',
                    Remark: '小程序-2022年教师招聘盲盒,HD202201120829,113209'
                }
                awards = [
                    { name: '多功能小台灯', chance: 5, remark: '恭喜您中奖，获得奖品多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '实物图书', chance: 10, remark: '恭喜您中奖，获得奖品图书一套（教育基础知识6000题/通用知识全真模拟预测卷1本/幼儿易错易混1000题 选其中一套），我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '教基+公基+幼儿思维导图电子版', chance: 20, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '电子版讲义', chance: 20, remark: '恭喜您中奖（650分钟心理学、幼儿心理学、法理学精讲视频课+配套电子版讲义），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '电子版备考知识点', chance: 20, remark: '恭喜您中奖（138页【公基+教基+幼儿】考点集结号电子版资料），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '电子版模考卷', chance: 25, remark: '恭喜您中奖（共9套模考卷：教基3套+公基3套+幼儿3套电子版模考试卷），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                ];
                this.setData({ awardInfo: { project: '教师招聘', awards } });
                break;
            case 'jszg':
                // 教师资格项目
                CRMConfig = {
                    SID: 'bce3046fed32666025e2b42a8f03e5b7',
                    Remark: '小程序-2022年教师资格盲盒,HD202201120834,113211'
                }
                awards = [
                    { name: '多功能小台灯', chance: 5, remark: '恭喜您中奖，获得奖品多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '教师资格备考图书一本', chance: 10, remark: '恭喜您中奖，获得奖品图书一套（综合素质或对应学科科目二），我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '思维导图', chance: 20, remark: '恭喜您中奖（综合素质+各学段科二思维导图电子版），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '视频课+配套电子版讲义', chance: 20, remark: '恭喜您中奖（1600+分钟科一+科二各学段视频课+配套电子版讲义），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '电子版备考知识点', chance: 20, remark: '恭喜您中奖（244页综合素质+各学段科目二+所有学科科三电子版备考知识点），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '电子版模考卷', chance: 25, remark: '恭喜您中奖（共8套模拟试卷：综合素质2套+中小幼各学段科二各2套电子版模考试卷），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                ];
                this.setData({ awardInfo: { project: '教师资格', awards } });
                break;
            case 'tgjs':
                // 特岗教师项目
                CRMConfig = {
                    SID: 'd06fa7a88f4b2664c5eb6a3d8f1834bf',
                    Remark: '小程序-2022年特岗教师盲盒,HD202201120832,113210'
                }
                awards = [
                    { name: '多功能小台灯', chance: 5, remark: '恭喜您中奖，获得奖品多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '特岗教师题库(图书)', chance: 10, remark: '恭喜您中奖，获得奖品特岗教师图书一本，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '思维导图(电子版)', chance: 20, remark: '恭喜您中奖（教基+所有学科思维导图电子版），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '教基教学网课', chance: 20, remark: '恭喜您中奖（260+分钟教基教学部分网校课+配套电子版讲义），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '备考知识宝典(电子版)', chance: 20, remark: '恭喜您中奖（备考知识宝典教基+各学科备考知识宝典），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '模考卷(电子版)', chance: 25, remark: '恭喜您中奖（教基3套+每学科3套电子版模考试卷），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                ];
                this.setData({ awardInfo: { project: '特岗教师', awards } });
                break;
            case 'ylzp':
                // 医疗招聘项目
                CRMConfig = {
                    SID: '7acf191f90328995803cdbb1129be0ec',
                    Remark: '小程序-2022吉林医疗卫生-新年盲盒,HD202201120750,113201'
                }
                awards = [
                    { name: '多功能小台灯', chance: 10, remark: '恭喜您中奖，获得奖品多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '技巧刷题网课', chance: 20, remark: '恭喜您中奖，获得(900分钟)技巧刷题网课，我们会在2月8号起3个工作日之内，为您开通相关课程，请保持电话畅通。' },
                    { name: '思维导图+视频讲解', chance: 30, remark: '恭喜您中奖（(6页)思维导图(电子版)+(500分钟)视频讲解），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '历年考点精粹(电子版)', chance: 40, remark: '恭喜您中奖（102页历年考点精粹(电子版)），我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                ];
                this.setData({ awardInfo: { project: '医疗招聘', awards } });
                break;
            case 'sqzp':
                // 社区招聘项目
                CRMConfig = {
                    SID: '6cac8d3cce569e87500ec8787f412803',
                    Remark: '小程序-2022吉林省社区招聘-新年盲盒,HD202201130500,113314'
                }
                awards = [
                    { name: '多功能小台灯', chance: 10, remark: '恭喜您中奖，获得多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通 。' },
                    { name: '社区知识精讲网课视频', chance: 20, remark: '恭喜您中奖，社区知识精讲网课视频（12课时）,我们会在2月8号起3个工作日之内，电话联系您开通课程，请保持电话畅通。' },
                    { name: '社区思维导图(电子版)', chance: 30, remark: '恭喜您中奖，社区知识思维导图(电子版),我们会在2月8号起3个工作日之内电话联系您开通课程，请保持电话畅通。' },
                    { name: '社区考试专项习题电子版', chance: 40, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内，电话联系您开通课程，请保持电话畅通。' },

                ];
                this.setData({ awardInfo: { project: '社区招聘', awards } });
                break;
            case 'yhzp':
                // 银行招聘项目
                CRMConfig = {
                    SID: '9cb41102f052f22ea6d3bd07c5b05233',
                    Remark: '小程序-新年盲盒（银行）,HD202201130089,113261'
                }
                awards = [
                    { name: '多功能小台灯', chance: 10, remark: '恭喜您中奖，获得奖品多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '备考宝典', chance: 20, remark: '恭喜您中奖，获得五大行简历模板+春招指导手册+速刷300题(附答案)，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通。' },
                    { name: '2980专项班（春招课）', chance: 30, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '协议课程叠加1000元（春招课）', chance: 40, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                ];
                this.setData({ awardInfo: { project: '金融银行', awards } });
                break;
            case 'jdwz':
                // 军队文职 
                CRMConfig = {
                    SID: '32ba36e45a93171b6902c6678d0e7af8',
                    Remark: '小程序-2023吉林省军队文职-新年盲盒,HD202201130509,113315'
                }
                awards = [
                    { name: '多功能小台灯', chance: 10, remark: '恭喜您中奖，获得奖品 多功能小台灯1个，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通 。' },
                    { name: '22军队文职面试提前学线上课程', chance: 20, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内，为您开通课程，请保持电话畅通。' },
                    { name: '23军队文职笔试思维导图(电子版)', chance: 30, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内，为您开通课程，请保持电话畅通。' },
                    { name: '军队文职电子版资料一份', chance: 40, remark: '恭喜您中奖，军队文职笔试专项知识及专业科目电子版资料一份,我们会在2月8号起3个工作日之内，为您开通课程，请保持电话畅通。' },
                ];
                this.setData({ awardInfo: { project: '军队文职', awards } });
                break;
            case 'gqzp':
                // 国企招聘
                CRMConfig = {
                    SID: '1fb18c4d5c69d85636349b80faefc643',
                    Remark: '小程序-新年盲盒活动国企-中国烟草,HD202201120927,113229'
                }
                awards = [
                    { name: '多功能小台灯', chance: 10, remark: '恭喜您中奖，获得多功能小台灯1个，我们会在2月8号起3个工作日之内，电话联系您确认收货地址，请保持电话畅通。' },
                    { name: '2022吉林烟草新版精编模拟卷', chance: 40, remark: '恭喜您中奖，【4套】2022吉林烟草新版精编模拟卷,我们会在2月8号起3个工作日之内，电话联系您发送试卷资料，请保持电话畅通。' },
                    { name: '【2250分钟】2022吉林烟草导学课', chance: 20, remark: '恭喜您中奖，我们会在2月8号起3个工作日之内，电话联系您开通网校课程，请保持电话畅通。' },
                    { name: '烟草课程直降4000元', chance: 30, remark: '恭喜您中奖，烟草课程直降4000元（适用于指定课程）,2月15前报名课程（吉林中烟：OAO中烟智学笔面试直播协议A班；吉林烟草局：OAO吉烟智胜笔面协议A班）可使用。' },

                ];
                this.setData({ awardInfo: { project: '国企', awards } });
                break;
            case 'szyf':
                // 三支一扶项目
                CRMConfig = {
                    SID: '6d781cddb50663a3db5f297f7686af15',
                    Remark: '小程序-2022吉林省三支一扶考试-新年盲盒,HD202201130583,113330'
                }
                awards = [
                    { name: '多功能小台灯', chance: 10, remark: '恭喜您中奖，获得多功能小台灯1台，我们会在2月8号起3个工作日之内，联系您确认收货地址，请保持电话畅通 。' },
                    { name: '三支一扶视频网课', chance: 20, remark: '恭喜您中奖，2022三支一扶笔试备考视频网课,我们会在2月8号起3个工作日之内，为您开通课程，请保持电话畅通。' },
                    { name: '三支一扶思维导图(电子版)', chance: 30, remark: '恭喜您中奖，22三支一扶笔试思维导图(电子版),我们会在2月8号起3个工作日之内联系您，为您开通相关课程，请保持电话畅通。' },
                    { name: '备考电子版资料', chance: 40, remark: '恭喜您中奖，三支一扶笔试备考电子版资料+刷题资料一份,我们会在2月8号起3个工作日之内，为您开通课程，请保持电话畅通。' },

                ];
                this.setData({ awardInfo: { project: '三支一扶', awards } });
                break;
            case 'ky':
                // 吉林考研项目
                CRMConfig = {
                    SID: 'ec96e768f2204d05a08d78a1ff4a0ddc',
                    Remark: '小程序-新年盲盒（吉林考研）,HD202201120725,113206 '
                }
                awards = [
                    { name: '2022考研复试抢先学先导课', chance: 15, remark: '恭喜您中奖了，2022考研复试抢先学先导课（价值599元） 工作人员会在活动结束后电话联系您兑换奖品。如有其他问题可联系客服人员。客服微信号：18684301626。' },
                    { name: '2022考研复试面试精品班', chance: 20, remark: '恭喜您中奖了，2022考研复试面试精品班-2天1晚（价值799元）工作人员会在活动结束后电话联系您兑换奖品。如有其他问题可联系客服人员。客服微信号：18684301626。' },
                    { name: '2023考研图书礼包3册', chance: 20, remark: '恭喜您中奖了，在职人专业热门推荐,在职考研一本通,在职人考研英语入门,工作人员会在活动结束后电话联系您兑换奖品。如有其他问题可联系客服人员。客服微信号：18684301626。' },
                    { name: '考研课程通用可叠加优惠券1000元', chance: 20, remark: '恭喜您中奖了，考研课程通用可叠加优惠券1000元,工作人员会在活动结束后电话联系您兑换奖品。如有其他问题可联系客服人员。客服微信号：18684301626。' },
                    { name: '2023考研0基础备考计划1天', chance: 20, remark: '恭喜您中奖了,工作人员会在活动结束后电话联系您兑换奖品。如有其他问题可联系客服人员。客服微信号：18684301626。' },
                    { name: '多功能小台灯', chance: 5, remark: '恭喜您中奖了,工作人员会在活动结束后电话联系您兑换奖品。如有其他问题可联系客服人员。客服微信号：18684301626。' },

                ];
                this.setData({ awardInfo: { project: '考研', awards } });
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
                    backgroundAudioManager.title = '新年快乐！'
                    backgroundAudioManager.epname = '祝您新年快乐!'
                    backgroundAudioManager.singer = '中公教育'
                    backgroundAudioManager.coverImgUrl = 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2022/01/18/share.jpg'
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
            title: '新年快乐! 一起来抽盲盒～',
            imageUrl: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/event/2022/01/18/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '新年快乐! 一起来抽盲盒～'
        }
    }
})