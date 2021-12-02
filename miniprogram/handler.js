// 获取页面路径
const getPath = function (url) {
    // 判断是否存在页面路径参数
    if (url.indexOf('path=') !== -1) {
        // 暂存页面路径参数
        let path = url.substr(url.indexOf('path=') + 5);
        // 判断页面路径后是否存在更多的参数 ( 通常是推广后缀 )
        if (path.indexOf('&') !== -1) {
            // 将参数与路径中间的 & 符号替换为 ?, 以便携带参数进行跳转
            return path.substr(0, path.indexOf('&')) + '?' + path.substr(path.indexOf('&')+1);
        } else {
            // 返回路径
            return path;
        }
    } else {
        // 入参中不存在页面路径
        return false;
    }
}

Page({
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ title: '跳转中' });
        if (options.q !== undefined) {
            const scanURL = decodeURIComponent(options.q);
            if (getPath(scanURL)) {
                // 跳转
                wx.redirectTo({ url: getPath(scanURL) });
            } else {
                // 报错并跳转到首页
                wx.hideLoading();
                wx.showModal({
                    title: '出错啦',
                    content: '参数不正确',
                    confirmText: '返回首页',
                    showCancel: false,
                    success() {
                        wx.redirectTo({ url: 'pages/index/index' });
                    }
                })
            }
        } else {
            // 报错并跳转到首页
            wx.hideLoading();
            wx.showModal({
                title: '出错啦',
                content: '参数不正确',
                confirmText: '返回首页',
                showCancel: false,
                success() {
                    wx.redirectTo({ url: 'pages/index/index' });
                }
            })
        }
    }
})