// components/navigation.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 小程序页面的标题
    title: { type: String, value: '中公考试助手' },
    // 是否展示返回和主页按钮
    hideIcon: Boolean,
    // 标题颜色
    wordColor: { type: String, value: '#000' },
    // 背景颜色
    bgColor: { type: String, value: '#fff' },
  },

  /**
   * 组件的初始数据
   */
  data: {
    hide: false,
    statusBarHeight: 0,
    titleBarHeight: 0,
  },
  
  lifetimes: {
    ready() {
      let that = this
      wx.getSystemInfo({
        success(res) {
          let totalTopHeight = 70
          if (res.model.indexOf('iPhone X') !== -1) {
            totalTopHeight = 98
          } else if (res.model.indexOf('iPhone 11') !== -1) {
            totalTopHeight = 98
          } else if (res.model.indexOf('iPhone') !== -1) {
            totalTopHeight = 70
          }
          that.setData({
            statusBarHeight: res.statusBarHeight,
            titleBarHeight: totalTopHeight - res.statusBarHeight
          });
        },
        failure() {
          that.setData({
            statusBarHeight: 0,
            titleBarHeight: 0
          });
        }
      })
    },
  },


  /**
   * 组件的方法列表
   */
  methods: {
    headerBack() {
      if (getCurrentPages().length > 1) {
        wx.navigateBack({
          delta: 1,
          fail(e) {
            wx.reLaunch({
              url: '/pages/index/index'
            })
          }
        })
      } else {
        wx.reLaunch({
          url: '/pages/index/index'
        })
      }
    },
    headerHome() {
      wx.reLaunch({
        url: '/pages/index/index'
      })
    },
    swtichNavigation(e) {
      if (e.scrollTop >= this.data.titleBarHeight) {
        this.setData({ hide: true })
      } else {
        this.setData({ hide: false })
      }
    }
  }
})
