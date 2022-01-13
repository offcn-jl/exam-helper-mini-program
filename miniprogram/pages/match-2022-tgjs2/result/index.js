const app = getApp()

Page({
  data: {
    title:"吉林特岗历年职位检索系统",// 标题  
    imageUrl:"http://news01.offcn.com/jl/2021/1220/20211220014331327.jpg",// 分享时显示的图片
    superiorLink:"/pages/match-2022-tgjs/index", //上级链接
    actid:"45167", //zg99id  和前面的不是一个zg99id了

    suffixStr: "", // 后缀
    showId: 0, // 当前显示的元素的 ID
    query: { // 查询条件
      limits: 20,
      order:0, //正序排列
      sstime: new Date().valueOf(),
    }, 
    zcounts: 0,//最大数据量
    result: [], // 查询结果
  },

  // 在页面发生滚动时，计算是否需要切换标题栏样式
  onPageScroll: function (e) {
    this.selectComponent('#navigation').swtichNavigation(e)
  },

  //可收放数据样式
  more: function (event) {
    this.setData({
      showId: event.currentTarget.dataset.index
    })
  },

  // 上拉刷新
  onReachBottom() {
    if (this.data.result.length >= this.data.zcounts) {
      wx.showToast({ title: '没有更多数据啦', icon: 'none' })
      return
    }
    this.search()
  },

  //查询
  search(){
    let _this = this //作用域 
    wx.showLoading({ title: '查询中...', mask: true })
    wx.request({
      url: "https://zg99.offcn.com/index/chaxun/getfylist?actid="+_this.data.actid+"&callback=?",
      data: _this.data.query,
      success(res) {
        wx.hideLoading() // 隐藏 loading
        try {
          let list = JSON.parse(res.data.substring(1, res.data.length - 1))//去头尾（）,转为json对象
          console.log("list:",list)
          if (list.status !== 1) {//如果status不等于1，弹出错误提示
            wx.showToast({ title: list.msg, icon: 'none' })
            return  
          }
          if (list.lists.length <= 0) {//如果内容长度小于等于0，弹出无数据提示
            wx.showToast({ title: '没有更多数据啦', icon: 'none' })
            return
          }
          //数据导入data.result
          _this.setData({
            result: _this.data.result.concat(list.lists),//不替换原数据添加新数据
            "query.page": (_this.data.result.concat(list.lists).length / _this.data.query.limits)+1,//计算分页页数
            zcounts: list.zcounts   //总数量录入data
          })
        } catch (err) {//捕获错误并报错
          getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true })
        }
      },
      fail: err => {//获取失败后提示
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
      }
    })
  },

  onLoad: function (options) {
    console.log(options)
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    // 获取后缀
    if (typeof options !== "undefined") this.setData({ 
      suffixStr: 'scode='+options.scode+'&erp='+options.erp+'&erpcity='+options.erpcity+'&misid='+options.misid
    })

    // 配置查询条件
    if (typeof options.year !== "undefined" && options.year !== "不限") this.setData({ "query.year": options.year })
    if (typeof options.city !== "undefined" && options.city !== "不限") this.setData({ "query.city": options.city })
    if (typeof options.county !== "undefined" && options.county !== "不限") this.setData({ "query.county": options.county })
    if (typeof options.plan !== "undefined" && options.plan !== "不限") this.setData({ "query.plan": options.plan })
    if (typeof options.stage !== "undefined" && options.stage !== "不限") this.setData({ "query.stage": options.stage })
    if (typeof options.subject !== "undefined" && options.subject !== "不限") this.setData({ "query.subject": options.subject })
    this.search();
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: this.data.superiorLink+"?" + this.data.suffixStr,
      imageUrl: this.data.imageUrl
    }
  },
})