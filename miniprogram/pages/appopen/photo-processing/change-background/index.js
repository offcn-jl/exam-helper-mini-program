// pages/photo-processing/change-background/index.js

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

        crmRemark: '活动表单SID:9bf5240a5a0d2150e79a08400706f59a;中公证件照;换底色;', // CRM 推送备注
        crmEventFormSid: '9bf5240a5a0d2150e79a08400706f59a', // CRM 活动表单 SID

        openid: '', // 用户 openid
        phone: '', // 用户手机号码

        statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
        src: "",
        color: "",
        colors: ["white", "lightblue", "blue", "red", "gray"],
        selectedPicture: true,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        // 判断是否是单页模式
        if (wx.getLaunchOptionsSync().scene !== 1154) {
            // 获取登陆状态
            getApp().methods.SSOCheck({crmEventFormSID: this.data.crmEventFormSid, suffix: {suffix: this.data.suffix, suffixStr: this.data.suffixStr}, remark: this.data.crmRemark, callback: ({ phone, openid }) => this.setData({ phone, openid })});
        }
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({ crmEventFormSID: this.data.crmEventFormSid, suffix: {suffix: this.data.suffix, suffixStr: this.data.suffixStr}, remark: this.data.crmRemark, callback: ({ phone, openid }) => this.setData({ phone, openid }, this.savePhoto())});
    },

    // 选择照片回调函数
    // 调用云函数获取签名
    // 使用签名调用腾讯云接口进行人像分割
    pickPhoto: function (e) {
        const _this = this;

        wx.getImageInfo({
            src: e.detail,
            success: function (e) {
                const width = e.width, height = e.height;
                _this.originWidth = width;
                _this.originHeight = height;
                (width > height ? width : height) <= 1e3 ? (_this.width = width, _this.height = height) : width > height ? (_this.width = 1e3, _this.height = Math.floor(1e3 / width * height)) : (_this.height = 1e3, _this.width = Math.floor(1e3 / height * width));
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取图片详情失败, 请重新选择图片再试' })
            }
        });

        // 获取签名
        getApp().methods.getTencentCloudSign('bda.tencentcloudapi.com', JSON.stringify({ Image: wx.getFileSystemManager().readFileSync(e.detail, "base64") }), ({ timestamp, authorization }) => {
            // 使用签名调用腾讯云接口进行人像分割
            wx.showLoading({ title: "图片处理中.." })
            wx.request({
                url: 'https://bda.tencentcloudapi.com',
                method: 'POST',
                data: { Image: wx.getFileSystemManager().readFileSync(e.detail, "base64") },
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
                            this.originImg = res.data.Response.ResultImage;
                            this.setData({
                                src: "data:image/png;base64," + res.data.Response.ResultImage,
                                color: this.data.color ? this.data.color : "white"
                            });
                            wx.getStorage({
                                key: "changeBackgroundSelectedPicture",
                                fail: function () {
                                    _this.setData({ selectedPicture: false });
                                    wx.setStorage({ key: "changeBackgroundSelectedPicture", data: true });
                                }
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
    },

    // 关闭重新选择图片的提示
    closeSelectPictureTip: function () {
        this.setData({ selectedPicture: true })
    },

    // 更换颜色
    changeColor: function (e) {
        if (this.data.src) {
            this.setData({ color: e.currentTarget.dataset.color });
        } else {
            wx.showToast({ title: "请先选择照片", icon: "none" });
        }
    },

    // 保存照片
    savePhoto: function () {
        if (!this.data.src) {
            wx.showToast({ title: "请先选择照片", icon: "none" });
            return;
        }
        const _this = this;
        wx.showLoading({ title: "图片合成中...", mask: true });
        const canvasContext = wx.createCanvasContext("change-bg", this);
        // 绘制渐变
        const linearGradient = canvasContext.createLinearGradient(0, 0, 0, this.height);
        linearGradient.addColorStop(0, linearGradientColor[this.data.color][0]);
        linearGradient.addColorStop(1, linearGradientColor[this.data.color][1]);
        canvasContext.setFillStyle(linearGradient);
        canvasContext.fillRect(0, 0, this.width, this.height);

        // 绘制图片
        // 将 BASE64编码的 图片保存到临时文件 用于绘制到 Canvas
        const fs = wx.getFileSystemManager();
        const filePath = `${wx.env.USER_DATA_PATH}/segment-portrait-pic-${Date.now()}.png`;
        fs.writeFile({
            filePath: filePath,
            data: wx.base64ToArrayBuffer(this.data.src.substr(22).replace(/[\r\n]/g, "")),
            encoding: "binary",
            success: function () {
                // 绘制图片
                canvasContext.drawImage(filePath, 0, 0, this.originWidth, this.originHeight, 0, 0, this.width, this.height);
                // 结束绘制
                canvasContext.draw(false, function () {
                    // 删除临时文件
                    fs.unlinkSync(filePath);
                    wx.canvasToTempFilePath({
                        x: 0,
                        y: 0,
                        width: _this.width,
                        height: _this.height,
                        destWidth: _this.width,
                        destHeight: _this.height,
                        canvasId: "change-bg",
                        fileType: "jpg",
                        success: function (res) {
                            wx.saveImageToPhotosAlbum({
                                filePath: res.tempFilePath,
                                success: function () {
                                    wx.hideLoading();
                                    require('../album/tools').savePhoto(res.tempFilePath, { name: '换底色' });
                                    wx.showModal({
                                        title: "提示",
                                        content: "保存成功，可前往小程序中的【相册】或【手机相册】中查看",
                                        confirmText: "去查看",
                                        success: function (res) {
                                            if (res.confirm) wx.navigateTo({ url: `../album/index${_this.data.suffixStr ? `?${_this.data.suffixStr}` : ''}` });
                                        }
                                    });
                                },
                                fail: err => {
                                    wx.hideLoading();
                                    if (err.errMsg !== 'saveImageToPhotosAlbum:fail cancel') {
                                        wx.showModal({
                                            title: "提示",
                                            content: "请在设置中打开相册权限哦~",
                                            success: function (res) {
                                                res.confirm && wx.openSetting();
                                            }
                                        });
                                    }
                                }
                            })
                        },
                        fail: err => {
                            wx.hideLoading(); // 隐藏 loading
                            getApp().methods.handleError({ err: err, title: "出错啦", content: "人像分割出错, 请稍后再试" });
                        }
                    }, this);
                });
            },
            fail: function (err) {
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

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '中公证件照 - 换底色',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '中公证件照 - 换底色'
        }
    }
})