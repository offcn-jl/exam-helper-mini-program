const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    title:"2021年吉林市教师招聘晒分数知分差",// 标题  
    imageUrl:"http://jl.offcn.com/zt/ty/2021images/exam-helper-mini/subscribe-2022-ylws-index.jpg",// 分享时显示的图片
    superiorLink:"/pages/score-2021-jz-jls/index", //上级链接
    actid:"40864", //zg99id
    cloudid:"score-2021-jz-jls",//云数据库名，用于云函数调用

    suffix: "", // 后缀
    showId: 0, // 当前显示的元素的 ID
    query: {},  // 查询条件
     
    zcounts: 0,//最大数据量
    recruits:0,//招聘人数
    result: [], // 查询结果（报名人数）
  },

  // 在页面发生滚动时，计算是否需要切换标题栏样式
  onPageScroll: function (e) {
    this.selectComponent('#navigation').swtichNavigation(e)
  },

  //可收放数据样式
  // more: function (event) {
  //   this.setData({
  //     showId: event.currentTarget.dataset.index
  //   })
  // },

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
    console.log(_this.data.result)
    let len= _this.data.result.length//获取列表的数组长度
    wx.cloud.callFunction({//调用云函数，传给len值
      name:"score",
      data:{
        id:_this.data.cloudid,
        list:_this.data.query,
        len:len
      }
    }).then(res => {
      console.log("云函数调用",res)
      _this.setData({
        result:_this.data.result.concat(res.result.Data.list.list)
      })
      wx.hideLoading()
    })
  },

  onLoad: function (options) {
    // 获取后缀
    if (typeof options.scene !== "undefined") this.setData({ suffix: options.scene })
    // 配置查询条件
    if (typeof options.city !== "undefined" && options.city !== "不限") this.setData({ "query.city": options.city })
    if (typeof options.county !== "undefined" && options.county !== "不限") this.setData({ "query.county": options.county })
    if (typeof options.subject !== "undefined" && options.subject !== "不限") this.setData({ "query.subject": options.subject })
    if (typeof options.post !== "undefined" && options.post !== "不限") this.setData({ "query.post": options.post })
    this.search();
    console.log("_this.data.result",this.data.result)
    if(this.data.result == []){
      this.setData({
        "result.city":无
      })
    }
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
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function () {
    let _this=this
    _this.search()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      path: this.data.superiorLink+"?scene=" + this.data.suffix,
      imageUrl: this.data.imageUrl
    }
  },
})