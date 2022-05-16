// pages/photo-processing/detail/index.js
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
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        // options.id = "1"; // 测试参数
        // 判断参数是否完整
        if (typeof options.id !== 'string') {
            getApp().methods.handleError({ err: options, title: "出错啦", content: "缺少 id 参数", reLaunch: true })
            return
        }
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息
        // 获取配置详情
        wx.showLoading({ title: '获取详情', mask: true })
        wx.request({
            url: `${getApp().globalData.configs.apis.base}/photo-processing/config/info/${options.id}`,
            success: res => {
                if (res.statusCode !== 200 || !res.data.success) {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取配置详情失败，请稍后再试', reLaunch: true })
                } else {
                    if (res.data.data.backgroundColors) res.data.data.backgroundColors = JSON.parse(res.data.data.backgroundColors);
                    this.setData({ config: { ...res.data.data, id: options.id } });
                    wx.hideLoading(); // 隐藏 loading
                    // 判断是否是单页模式
                    if (wx.getLaunchOptionsSync().scene !== 1154) {
                        // 不是单页模式，进行登陆操作
                        // 获取登陆状态
                        getApp().methods.SSOCheck({crmEventFormSID: res.data.data.crmEventFormSid, suffix: {suffix: this.data.suffix, suffixStr: this.data.suffixStr}, remark: `活动表单SID:${res.data.data.crmEventFormSid}，中公证件照，${res.data.data.name}，${options.id}，`, callback: ({ phone, openid }) => this.setData({ phone, openid })});
                    }
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置详情失败，请稍后再试', reLaunch: true })
            }
        });
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function (event) {
        getApp().methods.SSOCheckManual({ crmEventFormSID: this.data.config.crmEventFormSid, suffix: {suffix: this.data.suffix, suffixStr: this.data.suffixStr}, remark: `活动表单SID:${this.data.config.crmEventFormSid}，中公证件照，${this.data.config.name}，${this.data.config.id}，`, callback: ({ phone, openid }) => {
            this.setData({ phone, openid });
            if (event.currentTarget.dataset.bindtap === 'album') {
                this.album();
            } else {
                this.camera();
            }
        }});
    },

    // 选择照片
    album: function () {
        const _this = this;
        wx.chooseImage({
            count: 1,
            sizeType: ["original"],
            sourceType: ["album"],
            success: function (res) {
                wx.showLoading({ title: "图片分析中.." });
                const tempFilePath = res.tempFilePaths[0];
                // 获取签名
                getApp().methods.getTencentCloudSign('iai.tencentcloudapi.com', JSON.stringify({ Image: wx.getFileSystemManager().readFileSync(tempFilePath, "base64") }), ({ authorizeToOpenid, timestamp, authorization }) => {
                    // 使用签名调用腾讯云接口进行人脸检测与分析
                    wx.request({
                        url: 'https://iai.tencentcloudapi.com',
                        method: 'POST',
                        data: { Image: wx.getFileSystemManager().readFileSync(tempFilePath, "base64") },
                        header: {
                            'Content-Type': 'application/json; charset=utf-8',
                            'X-TC-Action': 'DetectFace',
                            'X-TC-Version': '2020-03-03',
                            'Authorization': authorization,
                            'X-TC-Timestamp': timestamp,
                            'X-TC-Region': 'ap-beijing'
                        },
                        success: res => {
                            if (res.statusCode !== 200) {
                                wx.hideLoading() // 隐藏 loading
                                getApp().methods.handleError({ err: res, title: '出错啦', content: '人脸检测与分析出错, 请稍后再试' })
                            } else {
                                wx.hideLoading() // 隐藏 loading
                                if (res.data.Response.Error) {
                                    getApp().methods.handleError({ err: res, title: '出错啦', content: res.data.Response.Error.Message })
                                } else {
                                    // 跳转到详情页 fixme 此处的跳转需要修改
                                    wx.navigateTo({
                                        url: `preview/index?img=${tempFilePath}&faceTop=${res.data.Response.FaceInfos[0].Y}&faceLeft=${res.data.Response.FaceInfos[0].X}&faceWidth=${res.data.Response.FaceInfos[0].Width}&faceHeight=${res.data.Response.FaceInfos[0].Height}${_this.data.suffixStr ? `&${_this.data.suffixStr}` : ''}`,
                                        success: function (res) {
                                            // 通过 eventChannel 向被打开页面传送数据
                                            res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.config)
                                        }
                                    });
                                }
                            }
                        },
                        fail: err => {
                            wx.hideLoading(); // 隐藏 loading
                            getApp().methods.handleError({ err: err, title: "出错啦", content: "人脸检测与分析出错, 请稍后再试" });
                        }
                    });
                });
            }
        });
    },

    // 拍摄照片
    camera: function () {
        const _this = this;
        wx.navigateTo({
            url: `camera/index${this.data.suffixStr ? `?${this.data.suffixStr}` : ''}`,
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.config)
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: `中公证件照 - ${this.data.config.name}`,
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: `中公证件照 - ${this.data.config.name}`
        }
    }
})