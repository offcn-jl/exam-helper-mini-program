const CONFIG = require('../bargain');
Page({
    data: {
        banner:"http://jl.offcn.com/zg/ty/images/exam-helper/zl-2022gk-mnsj/index2.png", // 背景图
        imageUrl:"http://jl.offcn.com/zg/ty/images/exam-helper/zl-2022gk-mnsj/2022gk-mnsj-share.jpg",// 分享时显示的图片
        suffix: "", // 后缀
        yqphone: "", // 邀请人手机号
        phone:"", // 协助人手机
        success:false, // 成功
    },
    // 登陆
    login: function (event) {
        getApp().methods.newLogin({event, crmEventFormSID: CONFIG.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${CONFIG.CRMEventID}`, callback: ({ phone, openid }) => {
            this.setData({ phone, openid })
            this.showq()
        }});
    },
    /**
	 * 生命周期函数--监听页面加载
	 */
    onLoad: async function(options) {
        const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
        this.setData(suffixInfo); // 保存后缀信息
        this.setData({ contactInformation: await getApp().methods.getContactInformation(suffixInfo) }); // 获取推广信息
         console.log(CONFIG.CRMEFSID.length)
        // 判断是否是单页模式
        if (wx.getLaunchOptionsSync().scene !== 1154 && CONFIG.CRMEFSID.length === 32) {
           // 获取登陆状态
            getApp().methods.newLoginCheck({ 
                crmEventFormSID: CONFIG.CRMEFSID, 
                suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, 
                remark: `活动表单ID:${CONFIG.CRMEventID}`, 
                callback: ({ phone, openid }) => {
                    this.setData({ phone, openid }); 
                } 
            });
        }
        this.setData({
            yqphone:options.yqphone,
            suffixStr: 'scode='+options.scode+'&erp='+options.erp+'&erpcity='+options.erpcity+'&misid='+options.misid
        })
        wx.setNavigationBarTitle({
            title:CONFIG.title
        })
    },
    // 点击助力
    showq: function() {
        wx.request({
            url: CONFIG.writexzAPI,
            data: {
              phone: this.data.yqphone,   //发起邀请人手机号
              xzphone: this.data.phone,     //协助人手机号（本）
              spid: CONFIG.spid,
              sstime: Math.round(new Date() / 1000)
            },
            success: res => {
                let text = res.data;
                let result_text = text.substring(1, text.length - 1);
                let result = JSON.parse(result_text);
                console.log(result)
                // 可以用result.status为1,2,3等来控制页面显示 这里未控制，目的是多收集手机号，无论助力成功与否，都可以去参加活动
                wx.showToast({
                    title: result.msg,
                    icon: 'none',
                    duration: 1000
                }).then(
                    this.setData({
                        success:true
                    })
                )
            }
        });
    },
    // 点击我也要
    receive(){
        wx.navigateTo({
            url: "../index/index?" + this.data.suffixStr + "&phone=" + this.data.phone
        });
    }
});