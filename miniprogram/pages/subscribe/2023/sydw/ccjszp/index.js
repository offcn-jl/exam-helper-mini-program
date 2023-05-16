// pages/subscribe/2023/gk/gg/index.js

Page({
    /**
     * 页面的初始数据
     */
    data: {
        CRMEFSID: "3abe5cecb7b5bbe5cdf882f2ec5dd7f2", // CRM 活动表单 ID
        CRMRemark: "2023年长春市教师招聘考试笔试成绩查询预约", // CRM 注释
        title: '2023年长春市教师招聘考试-笔试成绩查询预约', // 标题
        banner: 'https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/xccjscjyy.jpg', // 背景
        imageUrl: 'https://jl.offcn.com/zt/ty/2023images/exam-helper-mini/ccjscjyy-share.jpg', // 分享图
        type: '教师招聘', //服务类型  （国家公务员，吉林公务员，事业单位，医疗招聘，教师招聘，特岗教师，教师资格，银行考试，三支一扶，公选遴选，社会工作，会计取证，军队文职，军人考试，医学考试，农信社，选调生，招警，国企）

        phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
        tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅
    },

    /**
     * 监听页面滚动
     * 用于 显示 header / 隐藏 header
     */
    // onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },

    // 登陆
    login: function (event) {
        getApp().methods.newLogin({
            event, crmEventFormSID: this.data.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: this.data.CRMRemark, callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                wx.showModal({ title: '提示', content: '注册成功，请您点击“点击登陆”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" });
            }
        });
    },


    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                this.subscribe();
            }
        });
    },

    // subscribe 订阅
    subscribe() {
        getApp().methods.subscribeSingleExam(this.data.suffix, this.data.type, undefined, () => {
            this.setData({ tipsToSubscribeMessaged: true });
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // 动态设置当前页面的标题
        wx.setNavigationBarTitle({ title: this.data.title });

        const _this = this;
        // 获取后缀信息
        getApp().methods.getSuffix(options).then(res => {
            // 保存后缀信息
            this.setData(res);
            // 判断是否是单页模式
            if (wx.getLaunchOptionsSync().scene !== 1154) {
                // 不是单页模式，进行登陆操作
                // 获取登陆状态
                getApp().methods.SSOCheck({
                    crmEventFormSID: _this.data.CRMEFSID,
                    suffix: { suffix: _this.data.suffix, suffixStr: _this.data.suffixStr },
                    remark: _this.data.CRMRemark,
                    callback: ({ phone, openid }) => _this.setData({ phone, openid }),
                });
                wx.hideLoading(); // 隐藏 loading
            } else {
                wx.hideLoading(); // 隐藏 loading
            }
        }).catch(err => {
            wx.hideLoading(); // 隐藏 loading
            getApp().methods.handleError({
                err: err,
                title: "出错啦",
                content: '获取后缀失败',
                reLaunch: true
            });
        });

        // 获取后缀
        const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
        this.setData(suffixInfo); // 保存后缀信息
        // 判断是否是单页模式
        if (wx.getLaunchOptionsSync().scene !== 1154 && this.data.CRMEFSID.length === 32) {
            // 获取登陆状态
            getApp().methods.newLoginCheck({
                crmEventFormSID: this.data.CRMEFSID,
                suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
                remark: this.data.CRMRemark,
                callback: ({ phone, openid }) => {
                    this.setData({ phone, openid });
                }
            });


        }

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