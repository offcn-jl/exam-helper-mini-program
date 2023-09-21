// pages/subscribe/2023/gk/gg/index.js
var util = require('../../../../../utils/utils');
Page({
    /**
     * 页面的初始数据
     */
    data: {
        title:"现场签到",
        banner: 'https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/qdbj.jpg', // 背景
        imageUrl: 'https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/qdbj-share.jpg', // 分享图

        actid: "53942", //zg99id
        ds:"",
        namecode:"",
        day:"",
        hour:"",
        signed: false
    },

    /**
     * 监听页面滚动
     * 用于 显示 header / 隐藏 header
     */
    // onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        const _this=this
        if (!getApp().globalData.user.username) {
            wx.navigateTo({
                url: `/pages/appopen/user/register/index`,
                events: {
                    // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                    finishEvent: function (data) {
                        // 提交数据
                        wx.navigateBack({
                            complete: () => {
                                _this.submit()
                            }
                        });
                    }
                },
            });
        } else {
            // 直接提交数据
           _this.submit()
        }
    },

    submit: function () {
        const _this=this
        wx.request({
            url: "https://zg99.offcn.com/index/biaodan/writelogs",
            data: {
                actid: this.data.actid,
                isagree: true,
                phone: getApp().globalData.user.username,
                ds:this.data.ds,
                namecode:this.data.namecode,
                shouji1: getApp().globalData.user.username.substring(0,7),
                shouji2: getApp().globalData.user.username.substring(7),
                day:util.formatTime(new Date()),
                hour: new Date().getHours(),
                sstime: new Date().valueOf()

            },
            success(res) {
                //console.log(registerRes);
                try {
                    let registerRes = JSON.parse(res.data.substring(1, res.data.length - 1)) //去头尾（）,转为json对象
                    if (registerRes.status !== 1) { //如果status不等于1，弹出错误提示
                        if(registerRes.msg==="记录失败"){
                            wx.showToast({
                                title: "您已成功签到",
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
                        title: "签到成功",
                    })
                } catch (err) { //捕获错误并报错
                    getApp().methods.handleError({
                        err,
                        title: "出错啦",
                        content: '签到失败',
                        reLaunch: true
                    })
                }
            },
            fail: err => { //获取失败后提示
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({
                    err: err,
                    title: "出错啦",
                    content: '签到失败',
                    reLaunch: true
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        
        this.setData({
            ds: options.ds ,
            namecode:options.namecode,
        })
    },

    /**
    * 用户点击右上角分享
    */
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            imageUrl: this.data.imageUrl
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