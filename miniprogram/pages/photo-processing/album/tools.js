// 文件系统相关文档: https://developers.weixin.qq.com/miniprogram/dev/framework/ability/file-system.html
module.exports = {
    savePhoto: function (photo, config, type = '电子版') {
        // 将文件写入临时文件
        wx.saveFile({
            tempFilePath: photo,
            success(res) {
                console.log(res)
                const savedFilePath = res.savedFilePath
                // 获取保的文件信息 主要使用大小信息
                wx.getFileInfo({
                    filePath: savedFilePath,
                    success(res) {
                        // 保存信息到数据缓存
                        wx.setStorage({ key: 'photos', data: [...wx.getStorageSync('photos'), { config, type, path: savedFilePath, size: res.size, time: new Date() }] })
                    }
                })
            }
        })
    }
}