// pages/photo-processing/cropper/preview/index.js
Page({
    saved: false,

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        img: '',
        config: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        const _this = this;
        this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function (data) {
            _this.setData({ img: data.img, config: data.config });
        });
    },

    // 保存照片
    save: function () {
        const _this = this;
        if (this.saved) {
            wx.showToast({
                title: "不要重复保存哦～",
                icon: "none"
            });
        } else {
            // 保存照片到系统相册
            wx.saveImageToPhotosAlbum({
                filePath: this.data.img,
                success: function (a) {
                    _this.saved = true;
                    // 保存照片到小程序相册
                    require('../../album/tools').savePhoto(_this.data.img, _this.data.config);
                    wx.showModal({
                        title: "提示",
                        content: "保存成功，可前往小程序中的【相册】或【手机相册】中查看",
                        confirmText: "去查看",
                        success: function (res) {
                            res.confirm && wx.navigateTo({
                                url: `../../album/index${_this.data.suffixStr ? `?${_this.data.suffixStr}` : ''}`
                            });
                        }
                    });
                },
                fail: function (a) {
                    "saveImageToPhotosAlbum:fail cancel" != a.errMsg && wx.showModal({
                        title: "提示",
                        content: "请在设置中打开相册权限哦~",
                        success: function (res) {
                            res.confirm && wx.openSetting();
                        }
                    });
                }
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '中公证件照',
            path: '/pages/photo-processing/index/index',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    }
})