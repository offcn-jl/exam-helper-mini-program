// pages/exam/cc/paper/index.js

let timer = 0;
let timer1 = 0;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        CRMEFSID: "b9d7cb2873cf9b88dc872722204d7845", // CRM 活动表单 ID
        CRMRemark: "刷题", // CRM 注释

        suffix: {}, // 推广后缀 对象
        suffixStr: '', // 推广后缀 字符串

        phone: '', // 用户手机号
        openid: '', // 用户 openid

        statusBarHeight: wx.getSystemInfoSync().statusBarHeight, // 状态栏高度

        list: [], // 试题列表
        currentIndex: 0, // 当前的试题
        choicesTextList: ['A', 'B', 'C', 'D', 'E', 'F'],
        rightIndex: 1, // 正确答案
        easyWrongIndex: 2, // 易错
        answerIndex: -1, // 当前选择的答案

        useTime: 0, // 做题时间
        useTime1: 0, // 做题时间 本题
        seeExplanation: false, // 看解析

        doCount: 0, // 作答次数
        doRightCount: 0, // 作答正确次数
    },

    // 选择
    choice(e) {
        const _this = this;
        if (this.data.seeExplanation) {
            return
        }
        if (this.data.answerIndex != -1) {
            return
        }
        clearInterval(timer1);
        this.setData({ answerIndex: e.currentTarget.dataset.index, seeExplanation: true, doCount: this.data.doCount + 1 });
        if (e.currentTarget.dataset.index == this.data.rightIndex) {
            // 回答正确
            this.setData({ doRightCount: this.data.doRightCount + 1 });
            wx.showToast({ title: '回答正确', icon: 'none', duration: 6e2 })
            setTimeout(() => {
                // 判断是否已经是最后一题
                if (this.data.currentIndex < this.data.list.length - 1) {
                    // 获取正确答案
                    this.getRightIndex(this.data.currentIndex + 1);
                    // 切换下一套题
                    this.setData({ seeExplanation: false, useTime1: 0, answerIndex: -1, currentIndex: this.data.currentIndex + 1 });
                    this.startTime1();
                } else {
                    wx.showToast({
                        title: '作答完成',
                    })
                    // 提交成绩并切换页面
                    wx.request({
                        url: 'https://zg99.offcn.com/index/biaodan/register',
                        data: {
                            isagree: true,
                            actid: 52122,
                            phone: this.data.phone,
                            doCount: this.data.doCount,
                            doRightCount: this.data.doRightCount,
                            useTime: this.data.useTime,
                        },
                        success(res) {
                            let response = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
                            if (response.status !== 1) {
                                getApp().methods.handleError({ err: err, title: "出错啦", content: response.msg, reLaunch: true })
                            } else {
                                wx.reLaunch({
                                    url: `../list/index?${_this.data.suffixStr}`,
                                })
                            }
                        },
                        fail: err => {//获取失败后提示
                            getApp().methods.handleError({ err: err, title: "出错啦", content: '提交成绩失败', reLaunch: true })
                        }
                    })
                }
            }, 5e2);
        }
    },

    // 获取正确答案
    getRightIndex(currentIndex) {
        this.data.list[currentIndex].choices.forEach((value, index) => {
            if (value.is_correct) {
                this.setData({ rightIndex: index })
            }
        })
    },

    // 重做本题
    redo() {
        this.setData({ seeExplanation: false, useTime1: 0, answerIndex: -1 });
        this.startTime1();
    },

    // 看解析
    seeExplanation() {
        clearInterval(timer1);
        this.setData({ seeExplanation: true, useTime1: 0, });
    },

    // 计时器 答题时间 本题用时
    startTime1() {
        this.setData({ useTime1: 0 });
        timer1 = setInterval(() => {
            this.setData({ useTime1: this.data.useTime1 + 1 });
        }, 1e3);
    },

    // 计时器 答题时间 总用时
    startTime() {
        this.setData({ useTime: 0 });
        timer = setInterval(() => {
            this.setData({ useTime: this.data.useTime + 1 });
        }, 1e3);
    },

    // 知识点
    knowledge(e) {
        wx.showModal({
            title: '知识点',
            content: e.currentTarget.dataset.path,
            showCancel: false,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 判断是否是单页模式
            if (wx.getLaunchOptionsSync().scene !== 1154) {
                // 不是单页模式，进行登陆操作
                // 获取登陆状态
                getApp().methods.SSOCheck({
                    crmEventFormSID: this.data.CRMEFSID,
                    suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
                    remark: this.data.CRMRemark,
                    callback: ({ phone, openid }) => {
                        this.setData({ phone, openid });
                    },
                });
            }
        }).catch(err => {
            // 隐藏 loading
            wx.hideLoading();
            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取后缀失败', reLaunch: true });
        });

        let tempTimer = setInterval(() => {
            if (!this.data.phone) {
                clearInterval(tempTimer);
                wx.showModal({
                    title: '请先登录',
                    confirmText: '我知道了',
                    showCancel: false,
                    complete: () => {
                        wx.reLaunch({
                            url: `../index/index?${this.data.suffixStr}`,
                        })
                    }
                })
            }
        }, 2e3)

        // 获取 tiku token
        wx.request({
            url: 'https://tiku.eoffcn.com/apiv3/external/user/login',
            method: 'POST',
            header: {
                "content-type": "application/x-www-form-urlencoded",
            },
            data: {
                phone: 17887109896,
                sso_id: 12127125,
                appid: 'wangxiao_applet',
                sign: require('../../../../utils/md5').create_sign({ phone: '17887109896', sso_id: '12127125', appid: 'wangxiao_applet' }, 'cbd123456789axy'),
            },
            success: res => {
                if (res.statusCode !== 200) {
                    getApp().methods.handleError({ err: res, title: "出错啦", content: '获取 tiku token 失败，请稍后再试', reLaunch: true })
                } else {
                    if (res.data.retcode !== 0) {
                        getApp().methods.handleError({ err: res, title: res.data.message, content: '获取 tiku token 失败，请稍后再试', reLaunch: true })
                    } else {
                        // 获取试题
                        wx.request({
                            url: 'https://tiku.eoffcn.com/apiv3/workbook/practicequestion/getPracticequestion',
                            method: 'POST',
                            header: {
                                "content-type": "application/x-www-form-urlencoded",
                                Authorization: res.data.data.token
                            },
                            data: {
                                // cate_id: 670241,
                                // exam_id: 67,
                                // practice_id: 6764,
                                // type: 'level3',
                                // user_id: 4065176,
                                // channel: 2,

                                // cate_id: 670241,
                                exam_id: 4254,
                                // practice_id: 5919,
                                practice_id: 13580,
                                // type: 'level3',
                                user_id: 4065176,
                                channel: 15,

                                appid: 'wangxiao_applet',
                                sign: require('../../../../utils/md5').create_sign({ cate_id: 670241, exam_id: 67, practice_id: 6764, type: 'level3', user_id: 4065176, channel: 2, appid: 'wangxiao_applet', }, 'cbd123456789axy'),
                            },
                            success: res => {
                                if (res.statusCode !== 200) {
                                    getApp().methods.handleError({ err: res, title: "出错啦", content: '获取试题失败，请稍后再试', reLaunch: true })
                                } else {
                                    if (res.data.retcode !== 0) {
                                        getApp().methods.handleError({ err: res, title: res.data.message, content: '获取试题失败，请稍后再试', reLaunch: true })
                                    } else {
                                        // 获取试题成功
                                        this.setData({
                                            list: res.data.data.list.map(item => {
                                                item.analysis = item.analysis.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n');
                                                item.explanation = item.explanation.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n');
                                                item.stem = item.stem.replace(/<br>/g, '\n').replace(/<br\/>/g, '\n');
                                                item.accuracy = item.accuracy.replace('%', '');
                                                return item;
                                            })
                                        });
                                        this.getRightIndex(0);
                                        this.startTime();
                                        this.startTime1();
                                        wx.showModal({
                                            title: '作答正确后自动跳转下一题',
                                            confirmText: '我知道了',
                                            showCancel: false,
                                        })
                                    }
                                }
                            },
                            error: err => { //捕获错误并报错
                                getApp().methods.handleError({ err, title: "出错啦", content: '获取试题失败，请稍后再试', reLaunch: true })
                            }
                        });
                    }
                }
            },
            error: err => { //捕获错误并报错
                getApp().methods.handleError({ err, title: "出错啦", content: '获取 tiku token 失败，请稍后再试', reLaunch: true })
            }
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },
})