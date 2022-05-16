// pages/photo-processing/album/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        photos: [],
        moreIndex: -1,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        this.setData(await getApp().methods.getSuffix(options)); // 获取后缀信息

        wx.getStorageSync('photos') && this.setData({ photos: wx.getStorageSync('photos') });
    },

    // 更多操作
    more: function (e) {
        this.setData({ moreIndex: e.currentTarget.dataset.index });
    },

    // 点击页面时关闭更多操作
    tapPage: function () {
        this.setData({ moreIndex: -1 });
    },

    // 删除照片
    deletePhoto: function (e) {
        const _this = this;
        // 关闭更多操作弹窗
        this.setData({ moreIndex: -1 });
        // 定义保存照片列表的临时变量
        const photos = this.data.photos;
        // 从缓存文件文件中删除照片
        wx.removeSavedFile({
            filePath: this.data.photos[e.currentTarget.dataset.index].path,
            complete(res) {
                // console.log(res) // index.js? [sm]:41 {errMsg: "removeSavedFile:ok"}
                if (res.errMsg === 'removeSavedFile:ok') {
                    // 从列表中删除照片
                    photos.splice(e.currentTarget.dataset.index, 1);
                    // 将新的列表保存到数据缓存中
                    wx.setStorage({ key: 'photos', data: photos });
                    // 更新页面
                    _this.setData({ photos });
                } else {
                    getApp().methods.handleError({ err: res, title: "出错啦", content: '删除照片失败', reLaunch: true })
                }
            }
        })

    },

    // 前往照片详情
    gotoDetail: function(e) {
        const _this = this;
        wx.navigateTo({
            url: `detail/index${_this.data.suffixStr ? `?${_this.data.suffixStr}` : ''}`,
            success: function(res) {
              // 通过 eventChannel 向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', _this.data.photos[e.currentTarget.dataset.index])
            }
        });
    },
    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '中公证件照',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/photo-processing/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '中公证件照'
        }
    }
})