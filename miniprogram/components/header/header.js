Component({
    options: {
        styleIsolation: "isolated"
    },
    properties: {
        title: { value: "", type: String },
        background: { value: "#fff", type: String },
        nav: { value: false, type: Boolean },
        fixedTop: { value: true, type: Boolean },
        small: { value: false, type: Boolean },
        showTitle: { value: true, type: Boolean },
        autoGoBack: { value: true, type: Boolean },
        alwaysShow: { value: false, type: Boolean },
        suffixStr: { value: '', type: String },
    },
    data: {
        statusBarHeight: wx.getSystemInfoSync().statusBarHeight,
        canGoBack: false,
        scrollTop: 0, // 页面滚动距离
        show: false, // 是否显示 header
    },
    attached: function () {
        this.setData({ canGoBack: getCurrentPages().length > 1 });
        if (this.properties.alwaysShow) this.setData({ show: true });
    },
    methods: {
        back: function () { this.triggerEvent("back"); }
    },
    observers: {
        /**
         * 监听页面滚动距离 判断是否显示 header
         * 需要配合页面中的 onPageScroll 使用, 例如:
         * onPageScroll: function (e) { this.selectComponent('#header').setData({ scrollTop: e.scrollTop }) },
         * @param {*} scrollTop 
         */
        'scrollTop': function (scrollTop) {
            if (!this.properties.alwaysShow && scrollTop > wx.getSystemInfoSync().statusBarHeight) {
                this.setData({ show: true })
            } else {
                this.setData({ show: false })
            }
        }
    }
});