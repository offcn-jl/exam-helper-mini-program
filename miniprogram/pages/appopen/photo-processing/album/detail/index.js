// pages/photo-processing/album/detail/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        photo: {},
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        const _this = this;
        this.getOpenerEventChannel().on('acceptDataFromOpenerPage', function (data) {
            _this.setData({ photo: data });
        });
    },

    // 保存照片
    saveImage: function () {
        wx.saveImageToPhotosAlbum({
            filePath: this.data.photo.path,
            success: function (res) {
                wx.showToast({ title: "保存成功，可前往【手机相册】查看", icon: "none", duration: 3e3 });
            },
            fail: function (res) {
                "saveImageToPhotosAlbum:fail cancel" != res.errMsg && wx.showModal({
                    title: "提示",
                    content: "请在设置中打开相册权限哦~",
                    success: function (res) {
                        res.confirm && wx.openSetting();
                    }
                });
            }
        }, this);
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