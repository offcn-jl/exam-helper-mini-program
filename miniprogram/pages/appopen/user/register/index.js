// pages/user/login/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        page: 1, // 当前页面
        agreeAgreementPrivacy: false, // 同意隐私协议
        agreementPrivacyHtmlSnip: "", // 隐私协议内容
        agreementPrivacyVersion: "", // 隐私协议版本

        phoneFocus: false, // 手机号码 获取焦点
        verifyCodeFocus: false, // 验证码 获取焦点
        passwordFocus: false, // 密码 获取焦点
        phoneValue: "", // 手机号码 内容
        verifyCodeValue: "", // 验证码 内容
        passwordValue: "", // 密码 内容
        getVerifyCodeButtonText: "获取验证码", // 获取验证码按钮标题
    },

    // 处理登录结果
    handleResut: function (res, successMessage) {
        if (res.data.code !== 0) {
            getApp().methods.handleError({ err: res, content: `[${res.data.code}]${res.data.msg}` });
        } else {
            wx.showToast({ title: successMessage, icon: "success" });
            getApp().globalData.user = res.data.data.user;
            wx.setStorage({ key: "sso-token", data: res.data.data.user.token });
            // 判断是否需要更新头像
            if (this.data.page !== 6 && res.data.data.user.info.nickName === res.data.data.user.info.phone && res.data.data.user.info.headPortrait === "") {
                this.setData({ page: 6 });
                return
            }

            // 跳过更新用户信息
            this.skipSetUserInfo();
        }
    },

    // 跳过更新用户信息
    skipSetUserInfo: function () {
        // 返回操作成功状态，关闭页面
        const eventChannel = this.getOpenerEventChannel();
        eventChannel.emit('finishEvent', { data: 'success' });
    },

    // 设置头像和昵称
    setUserInfo: function () {
        wx.showLoading({ title: '请稍候...', mask: true })
        wx.getUserProfile({
            desc: '用于进行头像 DIY',
            success: (res) => {
                // 转换头像链接, 修改为高分辨率链接
                res.userInfo.avatarUrl = res.userInfo.avatarUrl.split('/')
                res.userInfo.avatarUrl[res.userInfo.avatarUrl.length - 1] = 0
                res.userInfo.avatarUrl = res.userInfo.avatarUrl.join('/')

                // 调用接口更新用户信息
                getApp().methods.requsetWithCode({
                    path: "/user/sso/info/update",
                    method: 'POST',
                    data: { token: wx.getStorageSync('sso-token'), nickName: res.userInfo.nickName, headPortrait: res.userInfo.avatarUrl },
                    callback: res => this.handleResut(res, '设置成功'),
                });
            },
            fail: err => {
                wx.hideLoading()
                if (err.errMsg === "getUserProfile:fail auth deny") {
                    // 未授权
                    getApp().methods.handleError({ err: err, title: '出错啦', content: "需要您同意授权后方可使用您的头像和昵称", reLaunch: false })
                } else {
                    // 其他错误
                    getApp().methods.handleError({ err: err, title: '出错啦', content: `未知错误，请稍后再试 ${err.errMsg}`, reLaunch: false })
                }
            }
        });
    },

    // 账号密码登录
    byPassword: function () {
        // 校验手机号
        if (this.data.phoneValue === "") {
            wx.showToast({ title: '请输入账号', icon: "none" })
            this.setData({ phoneFocus: true });
            return;
        }
        if (!(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(this.data.phoneValue))) {
            wx.showToast({ title: '请输入正确的账号', icon: "none" })
            this.setData({ phoneFocus: true });
            return;
        }

        // 校验密码
        if (this.data.passwordValue === "") {
            wx.showToast({ title: '请输入密码', icon: "none" });
            this.setData({ passwordFocus: true });
            return;
        }

        getApp().methods.requsetWithCode({
            path: "/user/sso/login/password",
            method: 'POST',
            data: { phone: this.data.phoneValue, password: this.data.passwordValue },
            callback: res => this.handleResut(res, '登录成功'),
        });
    },

    // 验证码登录 ( 注册 )
    byVerifyCode: function (e) {
        // 校验手机号
        if (this.data.phoneValue === "") {
            wx.showToast({ title: '请输入手机号码', icon: "none" });
            this.setData({ phoneFocus: true });
            return;
        }
        if (!(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(this.data.phoneValue))) {
            wx.showToast({ title: '请输入正确的手机号码', icon: "none" });
            this.setData({ phoneFocus: true });
            return;
        }

        // 校验验证码
        if (this.data.verifyCodeValue === "") {
            wx.showToast({ title: '请输入验证码', icon: "none" });
            this.setData({ verifyCodeFocus: true });
            return;
        }
        if (this.data.verifyCodeValue.length !== 6) {
            wx.showToast({ title: '请输入正确的验证码', icon: "none" });
            this.setData({ verifyCodeFocus: true });
            return;
        }

        getApp().methods.requsetWithCode({
            path: "/user/sso/login/verify-code",
            method: 'POST',
            data: { phone: this.data.phoneValue, code: this.data.verifyCodeValue },
            callback: res => this.handleResut(res, `${e.currentTarget.dataset.type}成功`),
        });
    },

    // 获取验证码
    getVerifyCode: function () {
        const _this = this;

        // 校验手机号
        if (this.data.phoneValue === "") {
            wx.showToast({ title: '请输入手机号码', icon: "none" })
            this.setData({ phoneFocus: true });
            return;
        }
        if (!(/^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-7|9])|(?:5[0-3|5-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[1|8|9]))\d{8}$/.test(this.data.phoneValue))) {
            wx.showToast({ title: '请输入正确的手机号码', icon: "none" })
            this.setData({ phoneFocus: true });
            return;
        }

        // 判断是否可以发送验证码
        if (this.data.getVerifyCodeButtonText !== "获取验证码") {
            wx.showToast({ title: `请等待${this.data.getVerifyCodeButtonText}`, icon: "none" });
            return;
        }

        // 调用接口发送验证码
        getApp().methods.requsetWithCode({
            path: "/user/sso/verify-code",
            method: 'POST',
            data: { phone: this.data.phoneValue },
            callback: res => {
                if (res.data.code !== 0) {
                    getApp().methods.handleError({ err: event.detail.errMsg, content: `[${res.data.code}]${res.data.msg}` });
                } else {
                    wx.showToast({ title: '发送验证码成功', icon: "none" })
                    this.setData({ verifyCodeFocus: true, getVerifyCodeButtonText: "120秒后重新获取" });
                    // 倒计时函数
                    function countdown(second) {
                        if (second > 0) {
                            _this.setData({ getVerifyCodeButtonText: `${second}秒后重新获取` });
                            second--;
                            setTimeout(function () {
                                countdown(second)
                            }, 1000);
                        } else {
                            _this.setData({ getVerifyCodeButtonText: "获取验证码" });
                        }
                    }
                    // 开始倒计时
                    countdown(120);
                }
            }
        });
    },

    // 输入 密码
    inputPassword: function (e) {
        this.setData({ passwordValue: e.detail.value });
    },

    // 输入 验证码
    inputVerifyCode: function (e) {
        this.setData({ verifyCodeValue: e.detail.value });
    },

    // 输入 手机号码
    inputPhone: function (e) {
        this.setData({ phoneValue: e.detail.value });
    },

    // 返回 页面 1
    backPage1: function () {
        this.setData({ page: 1 });
    },

    // 短信注册
    goSMSRegister: function () {
        this.setData({ page: 3 });
    },

    // 关联账号
    associatedAccount: function () {
        const _this = this;
        // 弹出选项
        wx.showActionSheet({
            itemList: ['短信验证码登录', '账号密码登录'],
            success(res) {
                if (res.tapIndex === 0) {
                    _this.setData({ page: 4 });
                } else {
                    _this.setData({ page: 5 });
                }
            }
        });
    },


    handleAgreePrivacyAuthorization() {
        // 用户同意隐私协议事件回调
        // 用户点击了同意，之后所有已声明过的隐私接口和组件都可以调用了
        // wx.getUserProfile()
        // wx.chooseMedia()
        // wx.getClipboardData()
        // wx.startRecord()
      },

    // 微信授权快速注册
    registerByWechatAuth: function (event) {
        // 判断是否授权使用手机号
        if (event.detail.errMsg !== 'getPhoneNumber:ok') {
            getApp().methods.handleError({ err: event.detail.errMsg, title: "出错啦", content: "本功能需要您授权登陆后方可使用" })
            return
        }

        getApp().methods.requsetWithCode({
            path: "/user/sso/register-by-wechat-auth",
            method: 'POST',
            data: { encryptedData: event.detail.encryptedData, iv: event.detail.iv },
            callback: res => this.handleResut(res, '注册成功'),
        });
    },

    // 返回
    back: function () {
        if (getCurrentPages().length > 1) {
            wx.navigateBack();
        } else {
            wx.redirectTo({
                url: `/pages/index/index${this.data.suffixStr ? `?${this.data.suffixStr}` : ''}`
            });
        }
    },

    // 提示阅读隐私协议
    tipReadAgreementPrivacy: function () {
        wx.showToast({ title: '注册账号前请您先阅读并同意相关协议', icon: "none" });
        this.setData({ page: 2 });
    },

    // 阅读隐私协议
    readPrivacy: function () {
        this.setData({ page: 2 });
    },

    // 同意隐私协议
    setAgreeAgreementPrivacy: function () {
        this.setData({ agreeAgreementPrivacy: true, page: 1 });
    },

    // 拒绝隐私协议
    setDisagreeAgreementPrivacy: function () {
        this.setData({ agreeAgreementPrivacy: false, page: 1 });
    },

    // 切换隐私协议状态
    tapAgreementPrivacy: function () {
        this.setData({ agreeAgreementPrivacy: !this.data.agreeAgreementPrivacy });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        const _this = this;
        // 获取协议内容
        wx.showLoading({ title: '请稍候...', mask: true })
        wx.request({
            url: `${getApp().globalData.configs.apis.base.replace("/wechat/mini-program", "")}/agreement/privacy?type=json-v2`,
            success: res => {
                wx.hideLoading(); // 隐藏 loading
                if (res.statusCode !== 200 || !res.data.success) {
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取协议失败，请稍后再试', reLaunch: true })
                } else {
                    _this.setData({ agreementPrivacyHtmlSnip: `${res.data.data.content}`, agreementPrivacyVersion: res.data.data.version });
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置详情失败，请稍后再试', reLaunch: true })
            }
        });

        // 强制刷新一次 wx code
        // 避免获取手机号后，重新获取 code 导致 session key 发生变化，而新 session key 不匹配导致的无法解密手机号码信息的问题
        // 其他页面由于在页面加载时会运行 wx.login , 所以没有出现这个问题;
        wx.login({ success: res => console.log(res) });
    },
})