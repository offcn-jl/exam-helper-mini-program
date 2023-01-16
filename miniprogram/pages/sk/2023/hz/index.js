// pages/sk/2023/hz/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 后缀对象
        suffixStr: "", // 后缀字符串

        countdown: {
            text: '',
            targetTime: {
                year: 2023,
                month: 2,
                day: 25,
                hour: 8,
                minute: 0,
                second: 0
            }
        }
    },

    // makePhoneCall 打电话
    makePhoneCall: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.contactInformation.ConsultationPhone
        })
    },
    makePhoneCall1: function () {
        wx.makePhoneCall({
            phoneNumber: '0431-81239600'
        })
    },
    makePhoneCall2: function () {
        wx.makePhoneCall({
            phoneNumber: '0431-81239633'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取后缀信息
        getApp().methods.getSuffix(options).then(suffixInfo => {
            this.setData(suffixInfo);
            // 获取推广信息
            getApp().methods.getContactInformation(suffixInfo).then(contactInformation => {
                this.setData({contactInformation});
            });
        });

        // 获取倒计时
        wx.request({
            url: 'https://jl.offcn.com/zt/ty/resources/countdown-2023sk.json',
            success: res => {
                this.setData({ countdown: res.data });
                const timer = setInterval(() => {
                    // 工具函数 不足两位补足两位
                    function double(obj) {
                        if (obj < 10) {
                            return '0' + obj
                        } else {
                            return obj
                        }
                    }
                    const nowTime = new Date();
                    const targetTime = new Date(this.data.countdown.targetTime.year,this.data.countdown.targetTime.month-1,this.data.countdown.targetTime.day,this.data.countdown.targetTime.hour,this.data.countdown.targetTime.minute,this.data.countdown.targetTime.second);
                    const countdownTime = Math.floor((targetTime-nowTime))>=0 ? Math.floor((targetTime-nowTime)):0;
                    this.setData({
                        "countdown.countdown": {
                            day: double(Math.floor((countdownTime / 1000 / 3600) / 24)),
                            hour: double(Math.floor(countdownTime / 1000 / 3600 % 24)),
                            minute: double(Math.floor(countdownTime / 1000/3600 % 24)),
                            second: double(Math.floor(countdownTime / 1000 % 3600 % 60))
                        }
                    })
                }, 1e3);
                this.setData({ countdownTimer: timer });
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "省考备考管家",
            imageUrl: "https://jl.offcn.com/zt/ty/2023images/sk-miniprogram/share.jpg",
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: "2023吉林公务员考试备考管家",
        }
    }
})