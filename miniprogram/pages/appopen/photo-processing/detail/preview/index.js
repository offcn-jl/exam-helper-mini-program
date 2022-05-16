// pages/photo-processing/detail/preview/index.js

const linearGradientColor = {
    white: ["#FFFFFF", "#FFFFFF"],
    lightblue: ["#8EC5E9", "#AFD7F0"],
    blue: ["#1A8AE4", "#4EA4ED"],
    red: ["#C40C20", "#D5284A"],
    gray: ["#818892", "#A7AFB7"]
}

Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
        edit: '',
        whitening: '',
        buffing: '',
        color: '',

        config: {},

        img: '',
        faceHeight: 0,
        faceWidth: 0,
        faceTop: 0,
        faceLeft: 0,
        colors: [],
        color: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        const _this = this;
        this.setData({
            img: decodeURIComponent(options.img),
            faceHeight: parseInt(options.faceHeight),
            faceWidth: parseInt(options.faceWidth),
            faceTop: parseInt(options.faceTop),
            faceLeft: parseInt(options.faceLeft),
        }, () => {
            this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function (res) {
                _this.setData({
                    config: res,
                    colors: res.backgroundColors,
                    color: res.backgroundColors[0]
                });
                wx.showLoading({ title: "图片处理中...", mask: true });
                const canvasContext = wx.createCanvasContext("preview-canvas", _this);
                canvasContext.drawImage(_this.data.img, _this.data.faceLeft - _this.data.faceWidth / 2, _this.data.faceTop - _this.data.faceHeight / 2, 2 * _this.data.faceWidth, (2 * _this.data.faceWidth) / _this.data.config.pixelWidth * _this.data.config.pixelHeight, 0, 0, _this.data.config.pixelWidth, _this.data.config.pixelHeight);
                canvasContext.draw(false, function () {
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: _this.data.config.pixelWidth,
                        height: _this.data.config.pixelHeight,
                        destWidth: 2 * _this.data.config.pixelWidth,
                        destHeight: 2 * _this.data.config.pixelHeight,
                        canvasId: "preview-canvas",
                        fileType: "jpg",
                        success: function (res) {
                            const tempFilePath = res.tempFilePath;
                            // 获取签名
                            getApp().methods.getTencentCloudSign('bda.tencentcloudapi.com', JSON.stringify({ Image: wx.getFileSystemManager().readFileSync(tempFilePath, "base64") }), ({ timestamp, authorization }) => {
                                // 使用签名调用腾讯云接口进行人像分割
                                wx.showLoading({ title: "图片处理中...", mask: true });
                                wx.request({
                                    url: 'https://bda.tencentcloudapi.com',
                                    method: 'POST',
                                    data: { Image: wx.getFileSystemManager().readFileSync(tempFilePath, "base64") },
                                    header: {
                                        'Content-Type': 'application/json; charset=utf-8',
                                        'X-TC-Action': 'SegmentPortraitPic',
                                        'X-TC-Version': '2020-03-24',
                                        'Authorization': authorization,
                                        'X-TC-Timestamp': timestamp,
                                        'X-TC-Region': 'ap-beijing'
                                    },
                                    success: res => {
                                        if (res.statusCode !== 200) {
                                            wx.hideLoading() // 隐藏 loading
                                            getApp().methods.handleError({ err: res, title: '出错啦', content: '人像分割出错, 请稍后再试' })
                                        } else {
                                            wx.hideLoading() // 隐藏 loading
                                            if (res.data.Response.Error) {
                                                getApp().methods.handleError({ err: res, title: '出错啦', content: res.data.Response.Error.Message })
                                            } else {
                                                _this.originImg = res.data.Response.ResultImage;
                                                _this.setData({
                                                    img: "data:image/png;base64," + res.data.Response.ResultImage
                                                });
                                            }
                                        }
                                    },
                                    fail: err => {
                                        wx.hideLoading(); // 隐藏 loading
                                        getApp().methods.handleError({ err: err, title: "出错啦", content: "人像分割出错, 请稍后再试" });
                                    }
                                })
                            });
                        }
                    }, _this);
                });
            });
        });
    },

    // 打开编辑框
    openEditModal: function (res) {
        const edit = res.currentTarget.dataset.edit;
        if (edit === 'changeBg') {
            this.lastBg = this.data.color;
        } else if (edit === 'whitening') {
            this.lastWhitening = this.data.whitening;
            this.lastImg = this.data.img;
        } else {
            this.lastBuffing = this.data.buffing;
            this.lastImg = this.data.img;
        }
        this.setData({ edit: res.currentTarget.dataset.edit });
    },

    // 取消操作
    cancelEdit: function () {
        if (this.data.edit === 'changeBg') {
            this.setData({ color: this.lastBg });
        } else if (this.data.edit === 'whitening') {
            this.setData({ whitening: this.lastWhitening, img: this.lastImg });
        } else {
            this.setData({ buffing: this.lastBuffing, img: this.lastImg });
        }
        this.setData({ edit: "" });
    },

    // 美白
    whitening: function (res) {
        this.setData({ whitening: res.detail.value });
    },

    // 磨皮
    buffing: function (res) {
        this.setData({ buffing: res.detail.value });
    },

    // 换底色
    changeColor: function (res) {
        this.setData({ color: res.currentTarget.dataset.color });
    },

    // 保存修改
    saveEdit: function () {
        if (this.data.edit !== 'changeBg') this.beautify();
        this.setData({ edit: "" });
    },

    // 美化照片
    beautify: function () {
        const _this = this;
        // 获取签名
        getApp().methods.getTencentCloudSign('fmu.tencentcloudapi.com', JSON.stringify({ Image: this.originImg, Whitening: 20 * this.data.whitening, Smoothing: 20 * this.data.buffing, FaceLifting: 1, EyeEnlarging: 1 }), ({ timestamp, authorization }) => {
            // 使用签名调用腾讯云接口进行人脸美颜
            wx.showLoading({ title: "图片处理中..." });
            wx.request({
                url: 'https://fmu.tencentcloudapi.com',
                method: 'POST',
                data: { Image: this.originImg, Whitening: 20 * this.data.whitening, Smoothing: 20 * this.data.buffing, FaceLifting: 1, EyeEnlarging: 1 },
                header: {
                    'Content-Type': 'application/json; charset=utf-8',
                    'X-TC-Action': 'BeautifyPic',
                    'X-TC-Version': '2019-12-13',
                    'Authorization': authorization,
                    'X-TC-Timestamp': timestamp,
                    'X-TC-Region': 'ap-beijing'
                },
                success: res => {
                    if (res.statusCode !== 200) {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: res, title: '出错啦', content: '人脸美颜出错, 请稍后再试' })
                    } else {
                        wx.hideLoading() // 隐藏 loading
                        if (res.data.Response.Error) {
                            getApp().methods.handleError({ err: res, title: '出错啦', content: res.data.Response.Error.Message })
                        } else {
                            _this.setData({
                                img: "data:image/png;base64," + res.data.Response.ResultImage
                            });
                        }
                    }
                },
                fail: err => {
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: "人脸美颜出错, 请稍后再试" });
                }
            })
        });
    },

    // 保存照片
    save: function () {
        const _this = this;
        // 将 BASE64编码的 图片保存到临时文件 用于绘制到 Canvas
        const fs = wx.getFileSystemManager();
        const filePath = `${wx.env.USER_DATA_PATH}/segment-portrait-pic-${Date.now()}.png`;
        fs.writeFile({
            filePath: filePath,
            data: wx.base64ToArrayBuffer(_this.data.img.substr(22).replace(/[\r\n]/g, "")),
            encoding: "binary",
            success: function () {
                const canvasContext = wx.createCanvasContext("preview-canvas", _this);
                if (_this.data.config.pixelHeight < 540) {
                    if (_this.data.config.pixelWidth < 300) {
                        _this.photoCompo(canvasContext, Math.floor((1205 - 2 * _this.data.config.pixelHeight - 30) / 2), Math.floor((1795 - 4 * _this.data.config.pixelWidth - 90) / 2), 8, filePath);
                    } else {
                        _this.photoCompo(canvasContext, Math.floor((1205 - 2 * _this.data.config.pixelHeight - 30) / 2), Math.floor((1795 - 3 * _this.data.config.pixelWidth - 60) / 2), 6, filePath);
                    }
                } else {
                    canvasContext.translate(0, 1205);
                    canvasContext.rotate(-Math.PI / 2);
                    _this.photoCompo(canvasContext, Math.floor((1795 - 2 * _this.data.config.pixelHeight - 30) / 2), Math.floor((1205 - 2 * _this.data.config.pixelWidth - 30) / 2), 4, filePath);
                }
                canvasContext.draw(false, function () {
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: 1795,
                        height: 1205,
                        destWidth: 1795,
                        destHeight: 1205,
                        canvasId: "preview-canvas",
                        fileType: "jpg",
                        success: function (res) {
                            const tempFilePath = res.tempFilePath;
                            if (_this.data.config.pixelHeight >= 540) canvasContext.restore();
                            _this.drawImage(canvasContext, 0, 0, _this.data.config.pixelWidth, _this.data.config.pixelHeight, _this.data.color, filePath);
                            canvasContext.draw(false, function () {
                                wx.canvasToTempFilePath({
                                    x: 0,
                                    y: 0,
                                    width: _this.data.config.pixelWidth,
                                    height: _this.data.config.pixelHeight,
                                    destWidth: _this.data.config.pixelWidth,
                                    destHeight: _this.data.config.pixelHeight,
                                    canvasId: "preview-canvas",
                                    fileType: "jpg",
                                    success: function (res) {
                                        fs.unlinkSync(filePath); // 删除临时文件
                                        wx.hideLoading();
                                        wx.navigateTo({
                                            url: `save-image/index?photoCompo=${tempFilePath}&image=${res.tempFilePath}${_this.data.suffixStr ? `&${_this.data.suffixStr}` : ''}`,
                                            success: function (res) {
                                                // 通过 eventChannel 向被打开页面传送数据
                                                res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.config)
                                            }
                                        });
                                    },
                                    fail: err => {
                                        fs.unlinkSync(filePath); // 删除临时文件
                                        wx.hideLoading(); // 隐藏 loading
                                        getApp().methods.handleError({ err: err, title: "出错啦", content: "保存图片出错, 请稍后再试" });
                                    }
                                }, _this);
                            });
                        },
                        fail: err => {
                            fs.unlinkSync(filePath); // 删除临时文件
                            wx.hideLoading(); // 隐藏 loading
                            getApp().methods.handleError({ err: err, title: "出错啦", content: "保存图片出错, 请稍后再试" });
                        }
                    }, _this);
                });
            },
            fail: function (e) {
                // 判断错误类型
                if (err.errMsg === 'writeFile:fail the maximum size of the file storage limit is exceeded') {
                    // 错误类型是临时文件大小超过限制
                    // 进行清理操作
                    const fs = wx.getFileSystemManager();
                    fs.readdir({
                        dirPath: wx.env.USER_DATA_PATH,
                        success: res => {
                            res.files.forEach(value => {
                                try {
                                    // 清理掉临时文件
                                    if (value.indexOf('segment-portrait-pic') !== -1) fs.unlinkSync(`${wx.env.USER_DATA_PATH}/${value}`);
                                } catch (err) {
                                    console.error(err);
                                }
                            })
                            // 再次尝试保存
                            _this.savePhoto();
                        }
                    })
                } else {
                    wx.hideLoading(); // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: "保存照片出错, 请稍后再试" });
                }
            }
        });
    },

    photoCompo: function (canvasContext, t, a, i, e) {
        var s = this.data.color, n = this.data.config.pixelWidth, o = this.data.config.pixelHeight;
        canvasContext.setFillStyle("#ffffff"), canvasContext.fillRect(0, 0, 1795, 1795);
        for (var h = 0; h < i / 2; h++) {
            var d = a + h * (30 + n);
            this.drawImage(canvasContext, t, d, n, o, s, e);
            this.drawImage(canvasContext, t + o + 30, d, n, o, s, e);
            if (s === 'white') {
                canvasContext.setLineWidth(2);
                canvasContext.rect(d, t, n, o);
                canvasContext.setStrokeStyle("#D8D9DF");
                canvasContext.stroke();
                canvasContext.rect(d, t + o + 30, n, o);
                canvasContext.setStrokeStyle("#D8D9DF");
                canvasContext.stroke();
            }
        }

    },

    drawImage: function (canvasContext, t, a, i, e, color, o) {
        const linearGradient = canvasContext.createLinearGradient(0, t, 0, t + e);
        linearGradient.addColorStop(0, linearGradientColor[color][0]);
        linearGradient.addColorStop(1, linearGradientColor[color][1]);
        canvasContext.setFillStyle(linearGradient);
        canvasContext.fillRect(a, t, i, e);
        canvasContext.drawImage(o, 0, 0, 2 * i, 2 * e, a, t, i, e);
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