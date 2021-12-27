const CONFIG = require('../bargain');
Page({
    data: {},
    onLoad: async function (options) {
        wx.setNavigationBarTitle({
          title:CONFIG.title
        })
    }
});