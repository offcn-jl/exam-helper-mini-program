// pages/exam/cc/list/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        CRMEFSID: "e0f0e4d88d97dfe879206aa84487cbf6", // CRM 活动表单 ID
        CRMRemark: "刷题 HD202302130055", // CRM 注释

        suffix: {}, // 推广后缀 对象
        suffixStr: '', // 推广后缀 字符串

        phone: '', // 用户手机号
        openid: '', // 用户 openid

        statusBarHeight: wx.getSystemInfoSync().statusBarHeight, // 状态栏高度
    },

    // 补 0
    fix0(num) {
        if (num  < 10) {
            return '0' + num
        }
        return num
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const _this = this;
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
                        // 获取作答记录
                        wx.request({
                            url: 'https://zg99.offcn.com/index/biaodan/getjlinfo',
                            data: {
                                isagree: true,
                                actid: 52122,
                                phone: phone,
                                timestamp: (new Date()).valueOf(),
                            },
                            success(res) {
                                let response = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
                                if (response.status !== 1) {
                                    getApp().methods.handleError({ err: err, title: "出错啦", content: response.msg, reLaunch: true })
                                } else {
                                    _this.setData({
                                        list: response.lists.map(value => {
                                            const date = new Date(value.createtime*1000);
                                            value.cDate = date.getFullYear() + '-' + _this.fix0(date.getMonth() + 1) + '-' + _this.fix0(date.getDate());
                                            value.cTime = _this.fix0(date.getHours()) + ':' + _this.fix0(date.getMinutes()) + ':' + _this.fix0(date.getSeconds());
                                            return value
                                        }).reverse()
                                    })
                                }
                            },
                            fail: err => {//获取失败后提示
                                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取成绩失败', reLaunch: true })
                            }
                        })
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