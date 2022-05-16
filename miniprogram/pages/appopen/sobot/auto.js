// pages/sobot/auto.js
Page({
    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        contactInformation: {}, // 联系方式
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
        this.setData(suffixInfo); // 保存后缀信息
        this.setData({ contactInformation: await getApp().methods.getContactInformation(suffixInfo) }); // 获取推广信息
    }
})