const app = getApp()
const db = wx.cloud.database()
Page({
    data: {
        title: "2022特岗教师报名人数查询",// 标题  
        imageUrl: "http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/enroll/2022/tgjs/share.jpg",// 分享时显示的图片
        superiorLink: "/pages/enroll/2022/tgjs/index", //上级链接
        actid: "48863", //zg99id

        suffix: {}, // 后缀
        suffixStr: '', // 后缀 字符串

        showId: 0, // 当前显示的元素的 ID
        query: {},// 查询条件

        zcounts: 0,//最大数据量
        result: 0, // 查询结果（报名人数）
    },

    // 在页面发生滚动时，计算是否需要切换标题栏样式
    onPageScroll: function (e) {
        this.selectComponent('#navigation').swtichNavigation(e)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
        this.search();
    },

    //查询
    search() {
        let _this = this;
        wx.showLoading({ title: '查询中...', mask: true });
        // 查找所有数据总个数
        db.collection("enroll-2022-tgjs").where(_this.data.query).count({
            success: res => {
                _this.setData({
                    result: res.total
                });
                wx.hideLoading(); // 隐藏 loading
                wx.stopPullDownRefresh(); // 停止下拉刷新动画
            }
        })
    },

    onLoad: function (options) {
        // 获取后缀 
        getApp().methods.getSuffix(options).then(res => {
            // 保存后缀信息
            this.setData(res);
        });

        // 配置查询条件
        if (typeof options.city !== "undefined" && options.city !== "不限") this.setData({ "query.city": options.city });
        if (typeof options.county !== "undefined" && options.county !== "不限") this.setData({ "query.county": options.county });
        if (typeof options.subject !== "undefined" && options.subject !== "不限") this.setData({ "query.subject": options.subject });
        this.search();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            path: `${this.data.superiorLink}${this.data.suffixStr ? `&${this.data.suffixStr}` : ''}`,
            imageUrl: this.data.imageUrl
        }
    },
})