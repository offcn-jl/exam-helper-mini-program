// pages/index/index.js

Page({
    /**
     * 页面的初始数据
     */
    data: {
        CRMEFSID: "e0f0e4d88d97dfe879206aa84487cbf6", // CRM 活动表单 ID
        CRMRemark: "2023事业单位考试公告订阅 HD202302130055", // CRM 注释
        title: '2023事业单位考试公告订阅', // 标题
        banner: 'https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-index.jpg', // 背景
        imageUrl: 'https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-share.jpg', // 分享图
        type: '事业单位', //服务类型  （国家公务员，吉林公务员，事业单位，医疗招聘，教师招聘，特岗教师，教师资格，银行考试，三支一扶，公选遴选，社会工作，会计取证，军队文职，军人考试，医学考试，农信社，选调生，招警，国企）

        cityList: ["不限", "省直", "长春市", "吉林市", "四平市", "辽源市", "通化市", "白山市", "松原市", "白城市", "延边朝鲜族自治州"], // 地市
        typeList: ["不限", "综合岗", "教师岗", "医疗岗"], // 岗位类别

        cityValue: "未知", // 地市 选中内容
        typeValue: "未知", // 岗位类别 选中内容

        phone: "", // 用户手机号码, 注册函数执行完成后设置, 已经注册的用户在初次打开页面时也会设置
        tipsToSubscribeMessaged: false, // 是否提示过进行消息订阅

        qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-qrcode.jpg", // 二维码地址
    },

    // 监听筛选条件切换
    m_select_touch(e) {
        switch (e.detail.type) {
            case "city": // 地市
                this.setData({ cityValue: this.data.cityList[e.detail.index] })
                break
            case "type": // 岗位类别
                this.setData({ typeValue: this.data.typeList[e.detail.index] })
                break
        }
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        if (this.data.cityValue === "未知") {
            getApp().methods.handleError({
                err: null,
                title: "出错啦",
                content: "请您选择意向报考地市"
            })
            return
        }
        if (this.data.typeValue === "未知") {
            getApp().methods.handleError({
                err: null,
                title: "出错啦",
                content: "请您选择意向报考岗位类别"
            })
            return
        }
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: `${this.data.CRMRemark}，意向报考地市:${this.data.cityValue}，意向报考岗位类别:${this.data.typeValue}`,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                wx.showModal({ title: '提示', content: '注册成功，请您点击“点击登陆”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" });
            },
        });
    },

    // subscribe 订阅
    subscribe() {
        getApp().methods.subscribeSingleExam(this.data.suffix, this.data.type, undefined, () => {
            this.setData({ tipsToSubscribeMessaged: true });
        })
    },

    // 保存二维码
    saveQrCode: function () {
        wx.showLoading({ title: '保存中...' })
        wx.downloadFile({
            url: this.data.qrCodePath,
            success: function (res) {
                if (res.statusCode === 200) {
                    wx.hideLoading()
                    wx.saveImageToPhotosAlbum({
                        filePath: res.tempFilePath,
                        success(res) {
                            wx.showModal({
                                content: '二维码已保存到相册，赶紧打开微信扫一扫扫描识别吧~',
                                showCancel: false,
                                confirmText: '好的',
                                confirmColor: '#333'
                            })
                        },
                        fail: err => {
                            getApp().methods.handleError({ err: err, title: '保存二维码失败', content: err.errMsg, reLaunch: false })
                        }
                    })
                } else {
                    wx.hideLoading()
                    wx.showToast({ icon: 'none', title: '下载二维码失败' })
                }
            },
            fail: err => {
                wx.hideLoading()
                getApp().methods.handleError({ err: err, title: '下载二维码失败', content: err.errMsg, reLaunch: false })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ title: '加载中' });
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
                        // 隐藏 loading
                        wx.hideLoading();
                    },
                });
            }
        }).catch(err => {
            // 隐藏 loading
            wx.hideLoading();
            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取后缀失败', reLaunch: true });
        });

        // 动态设置当前页面的标题
        wx.setNavigationBarTitle({
            title: this.data.title
        })
        // 按照后缀配置对应的二维码
        switch (this.data.suffix.scode) {
            case "lX5VoC": // 长春
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-cc.jpg" })
                break;
            case "dkIirz": // 吉林
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-jls.jpg" })
                break;
            case "cuAqQy": // 松原
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-sy.jpg" })
                break;
            case "h17IWN": // 四平
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-sp.jpg" })
                break;
            case "htGlHB": // 延边
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-yb.jpg" })
                break;
            case "hvEtbX": // 白城
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-bc.jpg" })
                break;
            case "gX25cd": // 辽源
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-ly.jpg" })
                break;
            case "gWw8tb": // 白山
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-bs.jpg" })
                break;
            case "ht54zE": // 通化
                this.setData({ qrCodePath: "https://jl.offcn.com/zt/ty/2023images/subscribe-2023sydw-th.jpg" })
                break;
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