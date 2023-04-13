// pages/sk/2023/hz/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        title:"2023上半年吉林省教师资格-成绩预约查询",// 标题
        banner_bk:"http://jl.offcn.com/zt/ty/2023images/exam-helper-mini/jszgcjcx.jpg",// 背景图片
        imageUrl:"http://jl.offcn.com/zt/ty/2023images/exam-helper-mini/jszgcjcx-share.jpg",// 分享时显示的图片
        CRMEFSID: "14caa782dca7f73863b55af9d67e910c", // CRM 活动表单 ID
        CRMEventID: "HD202304100168", // CRM 注释  2023上半年吉林省教师资格-成绩预约查询
        CRMRemark: "2023上半年吉林省教师资格-成绩预约查询",
    
        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串
        
        phone: "", // 用户手机号码
        openid: "", //openid
   
      },
    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: {
                suffix: this.data.suffix,
                suffixStr: this.data.suffixStr
            },
            remark: this.data.CRMRemark,
            callback: ({
                phone,
                openid
            }) => {
                this.setData({
                    phone,
                    openid
                });
            }
        });
    },

  /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);

            // 判断是否是单页模式
            if (wx.getLaunchOptionsSync().scene !== 1154) {
                // 不是单页模式，进行登陆操作
                // 获取登陆状态
                getApp().methods.SSOCheck({
                    crmEventFormSID: this.data.CRMEFSID,
                    suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
                    remark: this.data.CRMRemark,
                    callback: ({ phone, openid }) => {
                        this.setData({ phone, openid });
                      
                    },
                });
            }
              // 隐藏 loading
              wx.hideLoading();
        }).catch(err => {
            // 隐藏 loading
            wx.hideLoading();
            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取后缀失败', reLaunch: true });
        });

        // 动态设置当前页面的标题
        wx.setNavigationBarTitle({
            title: this.data.title
        })
       
    },
  /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
      /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

       /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },
  /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

       /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.title,
            imageUrl: this.data.shareImages,
        }
    },

   /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: this.data.title,
        }
    }
})