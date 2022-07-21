Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 后缀信息
        suffix: { type: Object },

        // 后缀信息 字符串
        suffixStr: { type: String },

        // 自定义转发
        customShare: { type: Boolean },
    },

    /**
     * 组件的初始数据
     */
    data: {
        // 联系方式信息
        contactInformation: { type: Object },
    },

    lifetimes: {
        ready() {
            // 获取推广信息
            getApp().methods.getContactInformation({ suffix: this.properties.suffix, suffixStr: this.properties.suffixStr }).then(res => {
                // 保存推广信息及后缀信息
                this.setData({ contactInformation: res, suffix: this.properties.suffix, suffixStr: this.properties.suffixStr });
            }).catch(err => {
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取推广信息失败', reLaunch: true });
            });
        },
    },


    /**
     * 组件的方法列表
     */
    methods: {
        // gotoOnlineConsulting 打开在线咨询
        gotoOnlineConsulting: function () {
            wx.navigateTo({ url: `/pages/appopen/sobot/auto${this.data.suffixStr ? `?${this.data.suffixStr}` : ''}` });
        },

        // makePhoneCall 打电话
        makePhoneCall: function () {
            wx.makePhoneCall({
                phoneNumber: this.data.contactInformation.ConsultationPhone
            })
        },

        // onShare 点击转发
        onShare: function () {
            this.triggerEvent('event_share_touch', this);
        },
    }
})
