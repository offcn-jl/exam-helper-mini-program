// pages/simple-help-event/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        openid: '', // 用户 openid
        phone: '', // 用户手机号码

        config: {},

        page: 'index', // 当前页面
        inviter: '', // 邀请者
        log: [], // 邀请记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // options.id = "1"; // 测试参数 fixme 移除
        // options.inviter = "17866668888"; // 测试参数 fixme 移除
        // 判断参数是否完整
        if (typeof options.id !== 'string') {
            getApp().methods.handleError({ err: options, title: "出错啦", content: "缺少 id 参数", reLaunch: true });
            return;
        }
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        // 获取配置详情
        wx.showLoading({ title: '获取详情', mask: true })
        wx.request({
            url: `${getApp().globalData.configs.apis.base}/simple-help-event/config/info/${options.id}`,
            success: res => {
                wx.hideLoading(); // 隐藏 loading
                if (res.statusCode !== 200 || !res.data.success) {
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取配置详情失败，请稍后再试', reLaunch: true })
                } else {
                    if (res.data.data.reward) res.data.data.reward = JSON.parse(res.data.data.reward);
                    this.setData({ config: { ...res.data.data, id: options.id } });
                    // 判断是否是单页模式
                    if (wx.getLaunchOptionsSync().scene !== 1154) {
                        // 不是单页模式，进行登陆操作
                        // 获取登陆状态
                        getApp().methods.SSOCheck({
                            crmEventFormSID: res.data.data.crmEventFormSid, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单SID:${res.data.data.crmEventFormSid}，简易助力活动，${res.data.data.name}，${options.id}，`, callback: ({ phone, openid }) => {
                                this.setData({ phone, openid });
                                // 判断当前是新参与用户还是被邀请用户，并转到对应的页面
                                // 如果邀请人是当前用户，则不进行跳转
                                if (typeof options.inviter !== 'undefined' && options.inviter !== this.data.phone) {
                                    // 被邀请用户, 转到邀请页面
                                    this.setData({ page: 'invite', inviter: options.inviter });
                                } else {
                                    // 新参与用户
                                    // 获取当前登陆用户是否已有邀请记录
                                    wx.showLoading({ title: '获取邀请记录', mask: true })
                                    wx.request({
                                        url: `${getApp().globalData.configs.apis.base}/simple-help-event/log/${options.id}`,
                                        data: { inviter: phone },
                                        success: res => {
                                            wx.hideLoading() // 隐藏 loading
                                            if (res.statusCode !== 200 || !res.data.success) {
                                                getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取获取邀请记录失败，请稍后再试', reLaunch: true })
                                            } else {
                                                if (res.data.data) {
                                                    // 已有邀请记录，跳转到详情页面
                                                    this.setData({ page: 'detail', log: res.data.data });
                                                }
                                                // 没有邀请记录，不执行其他操作，继续展示当前页面
                                            }
                                        },
                                        fail: err => {
                                            wx.hideLoading() // 隐藏 loading
                                            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取获取邀请记录失败，请稍后再试', reLaunch: true })
                                        }
                                    });
                                }
                            }
                        });
                    }
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置详情失败，请稍后再试', reLaunch: true })
            }
        });
    },

    /**
    * 监听页面滚动
    * 用于 显示 header / 隐藏 header
    */
    onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.config.crmEventFormSid, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单SID:${this.data.config.crmEventFormSid}，简易助力活动，${this.data.config.name}，${this.data.config.id}，`, callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                if (event.currentTarget.dataset.bindtap === 'join') {
                    // join
                    // 跳转到详情页面
                    this.setData({ page: 'detail' });
                } else {
                    // doHelp
                    // 提交助力记录
                    getApp().methods.requsetWithCode({
                        path: `/simple-help-event/do-help/${this.data.config.id}`,
                        method: 'POST',
                        queryData: { inviter: this.data.inviter, invitee: phone },
                        // 助力成功后，弹出提示，待提示消失后，跳转到首页引导用户参与活动
                        callback: res => wx.showToast({ title: res.errorMessage, icon: 'none' }) && setTimeout(() => { wx.redirectTo({ url: `index?id=${this.data.config.id}${this.data.suffixStr ? `&${this.data.suffixStr}` : ''}` }) }, 3e3),
                    });
                }
            }
        });
    },

    // 切换页面
    switchPage: function (event) {
        if (event.currentTarget.dataset.bindtap === 'join') {
            // join
            // 跳转到详情页面
            this.setData({ page: 'detail' });
        } else {
            // doHelp
            // 提交助力记录
            getApp().methods.requsetWithCode({
                path: `/simple-help-event/do-help/${this.data.config.id}`,
                method: 'POST',
                queryData: { inviter: this.data.inviter, invitee: this.data.phone },
                // 助力成功后，弹出提示，待提示消失后，跳转到首页引导用户参与活动
                callback: res => wx.showToast({ title: res.errorMessage, icon: 'none' }) && setTimeout(() => { wx.redirectTo({ url: `index?id=${this.data.config.id}${this.data.suffixStr ? `&${this.data.suffixStr}` : ''}` }) }, 3e3),
            });
        }
    },

    // 领取奖品
    getReward: function () {
        switch (this.data.config.reward.type) {
            case 'modal':
                // 弹窗
                wx.showModal({ content: this.data.config.reward.content, showCancel: false });
                break;
            case 'picture':
                // 图片
                this.setData({ page: 'reward-picture' });
                break;
            case 'webview':
                // 跳转网页
                wx.navigateTo({ url: `/pages/web-view/index?src=${this.data.config.reward.link}${this.data.suffixStr ? this.data.config.reward.link.indexOf('?') === -1 ? `?${this.data.suffixStr}` : `&${this.data.suffixStr}` : ''}` });
                break;
            case 'mini-program-self':
                // 跳转小程序（ 本小程序内 ）
                wx.navigateTo({ url: `${this.data.config.reward.path.substr(0, 1) !== '/' ? '/' : ''}${this.data.config.reward.path}${this.data.suffixStr ? this.data.config.reward.path.indexOf('?') === -1 ? `?${this.data.suffixStr}` : `&${this.data.suffixStr}` : ''}` });
                break;
            case 'mini-program':
                // 跳转小程序（ 其他小程序 ）
                wx.navigateToMiniProgram({ appId: this.data.config.reward.appid, path: `${this.data.config.reward.path}${this.data.suffixStr ? this.data.config.reward.path.indexOf('?') === -1 ? `?${this.data.suffixStr}` : `&${this.data.suffixStr}` : ''}` });
                break;
            default:
                wx.showToast({ title: '活动配置有误', icon: 'error' });
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
        if (!this.data.phone) return
        wx.showLoading({ title: '获取邀请记录', mask: true })
        wx.request({
            url: `${getApp().globalData.configs.apis.base}/simple-help-event/log/${this.data.config.id}`,
            data: { inviter: this.data.phone },
            success: res => {
                wx.hideLoading() // 隐藏 loading
                if (res.statusCode !== 200 || !res.data.success) {
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取获取邀请记录失败，请稍后再试', reLaunch: true })
                } else {
                    this.setData({ log: res.data.data ? res.data.data : [] });
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取获取邀请记录失败，请稍后再试', reLaunch: true })
            }
        });
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
            title: this.data.config.shareContent,
            imageUrl: this.data.config.shareImage,
            // 页面参数 尤其是邀请的参数
            path: `/pages/simple-help-event/index?id=${this.data.config.id}${this.data.phone ? `&inviter=${this.data.phone}` : ''}${this.data.suffixStr ? `&${this.data.suffixStr}` : ''}`,
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: this.data.config.shareContent,
            // 页面参数 尤其是邀请的参数
            query: `?id=${this.data.config.id}${this.data.phone ? `&inviter=${this.data.phone}` : ''}${this.data.suffixStr ? `&${this.data.suffixStr}` : ''}`,
        }
    }
})