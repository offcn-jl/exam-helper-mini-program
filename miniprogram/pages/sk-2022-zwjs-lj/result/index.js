const app = getApp()

Page({
  data: {
    title:"2022辽宁省考历年分数线查询",// 标题
    imageUrl:"http://jl.offcn.com/zt/ty/2022images/exam-helper-mini/sk-2022-zwjs-lj-share.jpg",// 分享时显示的图片
    superiorLink:"/pages/sk-2022-zwjs/index", //上级链接

    suffixStr: "",          // 后缀
    score:[],            // 历年分数线
    query: {             // 查询条件
      zwcode: "ln",      // 地区（吉林省 jl）
      page: 0,           // 页码

      areaname: "",      // 地市
      danwei_name: "",   // 部门名称
      xitong: "",        // 部门性质
      zhiwei_name: "",   // 职位名称

      zwyear: "",        // 年份
      xueli: "",         // 学历
      zzmm: "",          // 政治面貌
      zhuanye: "",       // 专业
      sstimes: new Date().getTime()
    }, 
    zcounts: 0, //最大数据量
    result: [], // 查询结果
    showId: 0,
  },

  // 在页面发生滚动时，计算是否需要切换标题栏样式
  onPageScroll: function (e) {
    this.selectComponent('#navigation').swtichNavigation(e)
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
      url: "https://zw.offcn.com/wechat/zhiwei/search?sign=b4a8b2f7z4d3n6o0hs",
      method: "post",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: _this.data.query,
      success(res) {
        wx.hideLoading() // 隐藏 loading
        try {
          let list = res.data
          console.log("list:",list)
          //数据导入data.result
          _this.setData({
            result: _this.data.result.concat(list.lists),//不替换原数据添加新数据
            "query.page": parseInt(list.page)+1,//计算分页页数
            zcounts: list.total   //总数量录入data
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

  onLoad: async function (options) {
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })
    // 获取后缀
    const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
    this.setData({ suffixInfo }); // 保存后缀信息

    // 配置查询条件
    // 职位要求
    if (options.city !== "undefined"){
      this.setData({ "query.areaname": options.city })
    }
    if (options.bmxz !== "undefined" && options.bmxz){
      this.setData({ "query.xitong": options.bmxz })
    }
    if (options.bmmc !== "undefined" && options.bmmc){
      this.setData({ "query.danwei_name": options.bmmc })
    } 
    if (options.zwmc !== "undefined" && options.zwmc){
      this.setData({ "query.zhiwei_name": options.zwmc })
    } 
    // 个人条件
    if (options.year !== "undefined" && options.year){
      this.setData({ "query.zwyear": options.year })
    }
    if (options.xueli !== "undefined" && options.xueli){
      this.setData({ "query.xueli": options.xueli })
    } 
    if (options.zzmm !== "undefined" && options.zzmm){
      this.setData({ "query.zzmm": options.zzmm })
    } 
    if (options.zylb !== "undefined" && options.zylb){
      this.setData({ "query.zhuanye": options.zylb })
    } 
    this.search();
  },
  // 可收放数据样式
  lnfsx: function (event) {
    this.setData({
      showId: event.currentTarget.dataset.index
    })
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