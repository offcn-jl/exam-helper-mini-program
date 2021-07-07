// pages/photo-processing/detail/index.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        suffix: '', // 推广后缀
        phone: '', // 用户手机号码

        ID: '',
        config: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // options.scene = 'suffix*9' // 调试语句
        // 判断参数是否完整
        if (typeof options.scene === 'undefined' || options.scene.split("*").length !== 2) getApp().methods.handleError({ err: options, title: "出错啦", content: "参数不正确", reLaunch: true });
        // 保存参数
        this.setData({ suffix: options.scene.split("*")[0], ID: options.scene.split("*")[1] })
        // 获取配置详情
        wx.showLoading({ title: '获取详情', mask: true })
        wx.request({
            url: getApp().globalData.configs.apis.gaea + '/services/mini-program/photo-processing/config/' + options.scene.split("*")[1],
            success: res => {
                if (res.statusCode !== 200 || res.data.Message !== "Success") {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.Message ? res.data.Message : '获取配置详情失败，请稍后再试', reLaunch: true })
                } else {
                    if (res.data.Data.BackgroundColors) res.data.Data.BackgroundColors = JSON.parse(res.data.Data.BackgroundColors);
                    this.setData({ config: {...res.data.Data, ID: options.scene.split("*")[1]} });
                    wx.hideLoading(); // 隐藏 loading
                    // 判断是否是单页模式
                    if (wx.getLaunchOptionsSync().scene !== 1154) {
                        // 不是单页模式，进行登陆操作
                        getApp().methods.login(res.data.Data.CRMEventFormSID, this.data.suffix, `活动表单ID:${res.data.Data.CRMEventFormID};中公证件照;${res.data.Data.Name};${options.scene.split("*")[1]};`, phone => this.setData({ phone }))
                    }
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置详情失败，请稍后再试', reLaunch: true })
            }
        });
    },

    // 注册
    signUp: function (e) {
        getApp().methods.register(e, this.data.suffix, this.data.config.CRMEventFormSID, `活动表单ID:${this.data.config.CRMEventFormID};中公证件照;${this.data.config.Name};${this.data.config.ID};`, phone => {
            this.setData({ phone })
            if (e.currentTarget.dataset.bindtap === 'album') {
                this.album();
            } else {
                this.camera();
            }
        })
    },

    // 选择照片
    album: function () {
        const _this = this;
        wx.chooseImage({
            count: 1,
            sizeType: ["original"],
            sourceType: ["album"],
            success: function (res) {
                wx.showLoading({ title: "照片分析中.." });
                const tempFilePath = res.tempFilePaths[0];
                // 获取签名
                wx.cloud.callFunction({
                    name: 'get-tencent-cloud-sign',
                    data: {
                        endpoint: 'iai.tencentcloudapi.com',
                        hashedRequestPayload: require('../../../utils/sha256').sha256_digest(JSON.stringify({ Image: wx.getFileSystemManager().readFileSync(tempFilePath, "base64") })),
                    },
                    success: res => {
                        // 使用签名调用腾讯云接口进行人脸检测与分析
                        if (res.errMsg === 'cloud.callFunction:ok' && res.result != null) {
                            wx.request({
                                url: 'https://iai.tencentcloudapi.com',
                                method: 'POST',
                                data: { Image: wx.getFileSystemManager().readFileSync(tempFilePath, "base64") },
                                header: {
                                    'Content-Type': 'application/json; charset=utf-8',
                                    'X-TC-Action': 'DetectFace',
                                    'X-TC-Version': '2020-03-03',
                                    'Authorization': res.result.authorization,
                                    'X-TC-Timestamp': res.result.timestamp,
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
                                            // 跳转到详情页
                                            wx.navigateTo({
                                                url: `preview/index?img=${tempFilePath}&faceTop=${res.data.Response.FaceInfos[0].Y}&faceLeft=${res.data.Response.FaceInfos[0].X}&faceWidth=${res.data.Response.FaceInfos[0].Width}&faceHeight=${res.data.Response.FaceInfos[0].Height}${_this.data.suffix?`&scene=${_this.data.suffix}`:''}`,
                                                success: function (res) {
                                                    // 通过eventChannel向被打开页面传送数据
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
                            })
                        } else {
                            wx.hideLoading(); // 隐藏 loading
                            getApp().methods.handleError({ err: res, title: "出错啦", content: `获取签名出错, 请稍后再试 [${res.errMsg}]` });
                        }
                    },
                    fail: err => {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: "获取签名出错, 请稍后再试" })
                    }
                })
            }
        });
    },

    // 拍摄照片
    camera: function () {
        const _this = this;
        wx.navigateTo({
            url: `camera/index${_this.data.suffix?`?scene=${_this.data.suffix}`:''}`,
            success: function (res) {
                // 通过eventChannel向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.config)
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: `中公证件照 - ${this.data.config.Name}`,
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: `中公证件照 - ${this.data.config.Name}`
        }
    }
})