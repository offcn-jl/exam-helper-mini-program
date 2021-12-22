// pages/sk-2022/index.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:'2022吉林省公务员考试备考工具箱', // 标题
    banner:'http://news01.offcn.com/jl/2021/1220/20211220102838974.jpg', // 背景
    imageUrl:'http://news01.offcn.com/jl/2021/1220/20211220102838974.jpg', // 分享图

    config: {},
    suffixStr: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // 获取后缀
    if (typeof options !== "undefined") this.setData({ 
      suffixStr: 'scode='+options.scode+'&erp='+options.erp+'&erpcity='+options.erpcity+'&misid='+options.misid
    })
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    // // 获取后缀
    // if (typeof options.scene !== "undefined") {
    //   this.setData({
    //     suffixStr: options.scene
    //   })
    // }
    const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
    this.setData(suffixInfo); // 保存后缀信息
    this.setData({ contactInformation: await getApp().methods.getContactInformation(suffixInfo) }); // 获取推广信息

    // 获取配置
    wx.showLoading({ title: '获取配置', mask: true })
    wx.cloud.database().collection('summary').where({type: "2022-sk", version: wx.cloud.database().command.exists(true)}).orderBy("version","desc").limit(1).get({
      success: res => {
        // 如果直播列表中有数据, 则对直播列表进行遍历，将直播时间格式化
        if (res.data[0].lives && res.data[0].lives.length > 0) {
          res.data[0].lives.forEach((value, index)=>{
            res.data[0].lives[index].timeString = value.time.getDate() + '日' + value.time.getHours() + ":" + (value.time.getMinutes()+"").padStart(2,"0");
          })
        }
        // 处理主 Banner 配置
        if (res.data[0].banner.main.type === 'miniProgram') {
          res.data[0].banner.main.path = res.data[0].banner.main.path.replace('$suffix', this.data.suffixStr);
        }
        // 处理工具配置
        if (res.data[0].tools && res.data[0].tools.length > 0) {
          res.data[0].tools.forEach((value, index)=>{
            // 判断是否是外部跳转
            if (value.path) {
              // 填充外部跳转路径中的后缀
              res.data[0].tools[index].path = value.path.replace('$suffix', this.data.suffixStr);
            }
          })
        }
        // 处理 小 Banner 配置
        if (res.data[0].banner.small.length > 0) {
          res.data[0].banner.small.forEach((value, index)=>{
            // 判断是否是外部跳转
            if (value.path) {
              // 填充外部跳转路径中的后缀
              res.data[0].banner.small[index].path = value.path.replace('$suffix', this.data.suffixStr);
            }
          })
        }
        // 处理底部 Banner 配置
        if (res.data[0].banner.bottom.type === 'miniProgram') {
          res.data[0].banner.bottom.path = res.data[0].banner.bottom.path.replace('$suffix', this.data.suffixStr);
        }
        // 将配置信息保存
        this.setData({
          config: res.data[0]
        })
        wx.hideLoading() // 隐藏 loading
      },
      fail: err => {
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询配置失败', reLaunch: true })
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      imageUrl: this.data.imageUrl
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.data.title
    }
  }
})