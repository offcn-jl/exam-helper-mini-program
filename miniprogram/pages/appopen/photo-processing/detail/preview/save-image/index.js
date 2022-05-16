// pages/photo-processing/detail/preview/save-image/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        image: '',
        photoCompo: '',
        config: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        const _this = this;
        this.setData({ image: decodeURIComponent(options.image), photoCompo: decodeURIComponent(options.photoCompo) });
        this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function (res) { _this.setData({ config: res }); });
    },

    // 保存证件照
    saveImage: function () {
        const _this = this;
        if (this.imageSaved) {
            wx.showToast({ title: "不要重复保存哦～", icon: "none" })
        } else {
            wx.saveImageToPhotosAlbum({
                filePath: this.data.image,
                success: function () {
                    require('../../../album/tools').savePhoto(_this.data.image, _this.data.config);
                    wx.showToast({ title: "保存成功，可前往小程序中的【我的相册】或【手机相册】中查看", icon: "none", duration: 5e3 });
                    _this.imageSaved = true;
                },
                fail: err => {
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
            }, this)
        }
    },

    // 保存冲印照
    savePhotoCompo: function () {
        const _this = this;
        if (this.photoCompoSaved) {
            wx.showToast({ title: "不要重复保存哦～", icon: "none" })
        } else {
            wx.saveImageToPhotosAlbum({
                filePath: this.data.photoCompo,
                success: function () {
                    require('../../../album/tools').savePhoto(_this.data.photoCompo, _this.data.config, '冲印版');
                    wx.showToast({ title: "保存成功，可前往小程序中的【我的相册】或【手机相册】中查看", icon: "none", duration: 5e3 });
                    _this.photoCompoSaved = true;
                },
                fail: err => {
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
            }, this)
        }
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