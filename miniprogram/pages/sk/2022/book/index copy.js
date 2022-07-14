// pages/sk/2022/book/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        configs: {
            Name: '2022吉林省考考前白皮书',
            Cover: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/sk/2022/book/cover.jpg?2',
            Docs: [
                {
                    Link: 'https://static.kaoyan365.cn/production/book/doc/1656985247086-8b22ac85-6e29-446e-9dab-dc3f9bfbc122.pdf',
                    Cover: 'https://static.kaoyan365.cn/production/book/doc/1657011371173-ca4e0e50-aa15-432c-aed3-583ee65a8aaa.jpg',
                    Name: '吉林省考白皮书',
                },
                {
                    Link: 'https://static.kaoyan365.cn/production/book/doc/1657174957645-b06ce98f-d5c7-49a2-8fe6-b799859d5d12.pdf',
                    Cover: 'https://static.kaoyan365.cn/production/book/doc/1657011418508-ad0f26a4-61c0-4d23-bc85-5887060cf470.jpg',
                    Name: '吉林省考蓝皮书',
                }
            ],
            ShareConfig: {
                shareImage: 'https://jl.offcn.com/zg/ty/images/exam-helper-mini-program/sk/2022/book/share.png'
            },
            Downloadable: false,
        },

        CRMEFSID: "", // CRM 活动表单 ID
        CRMRemark: "", // CRM 注释  网站专题页-2021年吉林特岗教师笔试六大系统

        phone: '', // 用户手机号码
        openid: '',  // 用户 openid

        suffix: '',
    },

    // 浏览
    view: function (e) {
        if (!e.currentTarget.dataset.link) {
            wx.showToast({ title: '配置有误', icon: "none" })
            return
        }
        if (!this.data.phone) {
            wx.showToast({ title: '请您先点击上方按钮进行注册', icon: "none" })
            return
        }
        wx.navigateTo({ url: '../../../book/web-view/index?downloadable=' + this.data.configs.Downloadable + '&link=' + e.currentTarget.dataset.link })
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                // 弹出 Loading
                wx.showLoading({ title: '请稍候...', mask: true });
                // 保存注册记录到数据库
                wx.cloud.database().collection('user2022sk').add({
                    data: { phone, openid, suffix: this.data.suffix, createdTime: new Date() }
                }).then(collectionAddRes => {
                    if (collectionAddRes.errMsg == 'collection.add:ok') {
                        // 操作成功
                        wx.hideLoading(); // 隐藏 loading
                        wx.pageScrollTo({ selector: '.doc-title', duration: 1000 });
                        wx.showToast({ title: '点击封面即可阅读资料', icon: "none" });
                    } else {
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err: collectionAddRes, title: "出错啦", content: collectionAddRes.errMsg });
                    }
                }).catch(err => {
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: "创建用户失败" });
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({ suffix: options.scene });
        const _this = this;
        // 判断是否是单页模式
        if (wx.getLaunchOptionsSync().scene !== 1154) {
            // 不是单页模式，进行登陆操作
            // 获取登陆状态
            getApp().methods.SSOCheck({
                crmEventFormSID: '',
                suffix: {},
                remark: '',
                callback: ({ phone, openid }) => {
                    _this.setData({ phone, openid });
                    setTimeout(() => { wx.pageScrollTo({ selector: '.doc-title', duration: 1000 }) }, 1000);

                    // 弹出 Loading
                    wx.showLoading({ title: '请稍候...', mask: true });
                    // 保存注册记录到数据库
                    wx.cloud.database().collection('user2022sk').add({
                        data: { phone, openid, suffix: options.scene, createdTime: new Date() }
                    }).then(collectionAddRes => {
                        if (collectionAddRes.errMsg == 'collection.add:ok') {
                            // 操作成功
                            wx.hideLoading(); // 隐藏 loading
                        } else {
                            wx.hideLoading(); // 隐藏 loading
                            getApp().methods.handleError({ err: collectionAddRes, title: "出错啦", content: collectionAddRes.errMsg });
                        }
                    }).catch(err => {
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: "创建用户失败" });
                    });
                },
            });
        }
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

    },

    /**
  * 用户点击右上角分享
  */
    onShareAppMessage: function () {
        return {
            title: this.data.configs.Name ? this.data.configs.Name : "考前白皮书",
            imageUrl: this.data.configs.ShareConfig.shareImage ? this.data.configs.ShareConfig.shareImage : "https://static.kaoyan365.cn/production/book/doc/1604289311438-13a9e8f3-b69f-4bdc-a8b7-d5aab817e1b6.jpg"
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: this.data.configs.Name ? this.data.configs.Name : "考前白皮书"
        }
    }
})