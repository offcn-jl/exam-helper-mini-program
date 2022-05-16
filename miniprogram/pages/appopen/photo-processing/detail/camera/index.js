// pages/photo-processing/detail/camera/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        devicePosition: "back",
        config: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        const _this = this;
        this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function (res) {
            _this.setData({ config: res });
        });
    },

    // 切换 前置摄像头 / 后置摄像头
    changeDevicePhoto: function () {
        if (this.data.devicePosition === 'back') {
            this.setData({ devicePosition: "front" });
        } else {
            this.setData({ devicePosition: "back" });
        }
    },

    // 取消拍摄
    cancel: function () {
        wx.navigateBack({ delta: 1 });
    },

    // 拍照
    takePhoto: function () {
        const _this = this;
        wx.createCameraContext().takePhoto({
            quality: "normal",
            success: function (res) {
                const tempFilePath = res.tempImagePath;
                // 获取签名
                getApp().methods.getTencentCloudSign('iai.tencentcloudapi.com', JSON.stringify({ Image: wx.getFileSystemManager().readFileSync(tempFilePath, "base64") }), ({ authorizeToOpenid, timestamp, authorization }) => {
                    // 使用签名调用腾讯云接口进行人脸检测与分析
                    wx.showLoading({ title: "图片分析中.." });
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
                                    // 跳转到详情页
                                    wx.navigateTo({
                                        url: `../preview/index?img=${tempFilePath}&faceTop=${res.data.Response.FaceInfos[0].Y}&faceLeft=${res.data.Response.FaceInfos[0].X}&faceWidth=${res.data.Response.FaceInfos[0].Width}&faceHeight=${res.data.Response.FaceInfos[0].Height}${_this.data.suffixStr ? `&${_this.data.suffixStr}` : ''}`,
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: `中公证件照 - ${this.data.config.name}`,
            path: `/pages/photo-processing/detail/index?id=${this.data.config.id}${this.data.suffixStr ? `&${this.data.suffixStr}` : ''}`,
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    }
})