// pages/header/index.js

// 画板插件
const { Canvas, CanvasItem } = require('../../utils/canvas/canvas.js')

// 画板上下文
let canvasContext = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    suffix: '', // 个人后缀
    isSinglePage: false, // 单页模式 ( 在微信朋友圈中打开 ) 标志
    welcomePage: true, // 欢迎页
    tabBarIndex: 0, // TabBar 中选中的元素下标
    openSelector: false, // 打开选择器
    headerImage: '', // 头像文件
    headerSrc: '', // 最终生成的头像文件路径
    posterPath: '', // 海报文件的路径
    headerWidth: 0, // 头像宽度, 根据容器大小计算
    isLock: true, // 锁定素材
    openUnlock: false, // 打开解锁弹窗
    imageBase: 'https://download.cos.jilinoffcn.com/mini-program/exam-helper/header/images', // 图片保存路径
    // 图片列表
    imageList: [
      {
        icon: "/new-year-2022-1/0.png",
        image: [
          {
            path: "/new-year-2022-1/0.png",
          },
          {
            path: "/new-year-2022-1/1.png",
            lock: true,
          },
          {
            path: "/new-year-2022-1/2.png",
            lock: true,
          },
          {
            path: "/new-year-2022-1/3.png",
            lock: true,
          },
        ],
      },
      {
        icon: "/new-year-2022-2/0.png",
        image: [
          {
            path: "/new-year-2022-2/0.png",
          },
          {
            path: "/new-year-2022-2/1.png",
            lock: true,
          },
          {
            path: "/new-year-2022-2/2.png",
            lock: true,
          },
          {
            path: "/new-year-2022-2/3.png",
            lock: true,
          },
        ],
      },
      {
        icon: "/new-year-2022-3/0.png",
        image: [
          {
            path: "/new-year-2022-3/0.png",
          },
          {
            path: "/new-year-2022-3/1.png",
            lock: true,
          },
        ],
      },
      {
        icon: "/new-year-2022-4/0.png",
        image: [
          {
            path: "/new-year-2022-4/0.png",
          },
          {
            path: "/new-year-2022-4/1.png",
            lock: true,
          },
          {
            path: "/new-year-2022-4/2.png",
            lock: true,
          },
          {
            path: "/new-year-2022-4/3.png",
            lock: true,
          },
          {
            path: "/new-year-2022-4/4.png",
            lock: true,
          },
          {
            path: "/new-year-2022-4/5.png",
            lock: true,
          },
          {
            path: "/new-year-2022-4/6.png",
            lock: true,
          },
        ],
      },
      {
        icon: "/new-year-public-1/0.png",
        image: [
          {
            path: "/new-year-public-1/0.png",
          },
          {
            path: "/new-year-public-1/1.png",
            lock: true,
          },
          {
            path: "/new-year-public-1/2.png",
            lock: true,
          },
          {
            path: "/new-year-public-1/3.png",
            lock: true,
          },
          {
            path: "/new-year-public-1/4.png",
            lock: true,
          },
          {
            path: "/new-year-public-1/5.png",
            lock: true,
          },
          {
            path: "/new-year-public-1/6.png",
            lock: true,
          },
          {
            path: "/new-year-public-1/7.png",
            lock: true,
          },
        ],
      },
      {
        icon: "/new-year-public-2/0.png",
        image: [
          {
            path: "/new-year-public-2/0.png",
          },
          {
            path: "/new-year-public-2/1.png",
            lock: true,
          },
          {
            path: "/new-year-public-2/2.png",
            lock: true,
          },
          {
            path: "/new-year-public-2/3.png",
            lock: true,
          },
          {
            path: "/new-year-public-2/4.png",
            lock: true,
          },
          {
            path: "/new-year-public-2/5.png",
            lock: true,
          },
          {
            path: "/new-year-public-2/6.png",
            lock: true,
          },
          {
            path: "/new-year-public-2/7.png",
            lock: true,
          },
          {
            path: "/new-year-public-2/8.png",
            lock: true,
          },
        ],
      },
      {
        icon: "/mask/0.png",
        image: [
          {
            path: "/mask/0.png",
          },
          {
            path: "/mask/1.png",
          },
          {
            path: "/mask/2.png",
          },
          {
            path: "/mask/3.png",
          },
          {
            path: "/mask/4.png",
          },
          {
            path: "/mask/5.png",
          },
          {
            path: "/mask/6.png",
          },
          {
            path: "/mask/7.png",
          },
          {
            path: "/mask/8.png",
          },
          {
            path: "/mask/9.png",
          },
          {
            path: "/mask/10.png",
          },
          {
            path: "/mask/11.png",
          },
          {
            path: "/mask/12.png",
          },
          {
            path: "/mask/13.png",
          },
          {
            path: "/mask/14.png",
          },
          {
            path: "/mask/15.png",
          },
          {
            path: "/mask/16.png",
          },
          {
            path: "/mask/17.png",
          },
          {
            path: "/mask/18.png",
          },
        ],
      },
      {
        icon: "/public/1.png",
        image: [
          {
            path: "/public/1.png",
          },
          {
            path: "/public/3.png",
          },
          {
            path: "/public/4.png",
          },
          {
            path: "/public/5.png",
          },
          {
            path: "/public/6.png",
          },
          {
            path: "/public/7.png",
          },
        ],
      },
      {
        icon: "/face/0.png",
        image: [
          {
            path: "/face/0.png",
          },
          {
            path: "/face/1.png",
          },
          {
            path: "/face/2.png",
          },
          {
            path: "/face/3.png",
          },
          {
            path: "/face/4.png",
          },
          {
            path: "/face/5.png",
          },
          {
            path: "/face/6.png",
          },
          {
            path: "/face/7.png",
          },
          {
            path: "/face/8.png",
          },
          {
            path: "/face/9.png",
          },
          {
            path: "/face/10.png",
          },
          {
            path: "/face/11.png",
          },
          {
            path: "/face/12.png",
          },
          {
            path: "/face/13.png",
          },
        ],
      },
      {
        icon: "/hat/0.png",
        image: [
          {
            path: "/hat/0.png",
          },
          {
            path: "/hat/1.png",
          },
          {
            path: "/hat/2.png",
          },
          {
            path: "/hat/3.png",
          },
          {
            path: "/hat/4.png",
          },
          {
            path: "/hat/5.png",
          },
          {
            path: "/hat/6.png",
          },
          {
            path: "/hat/7.png",
          },
          {
            path: "/hat/8.png",
          },
          {
            path: "/hat/9.png",
          },
          {
            path: "/hat/10.png",
          },
        ],
      },
      {
        icon: "/christmas/0.png",
        image: [
          {
            path: "/christmas/0.png",
          },
          {
            path: "/christmas/1.png",
          },
          {
            path: "/christmas/2.png",
          },
          {
            path: "/christmas/3.png",
          },
          {
            path: "/christmas/4.png",
          },
          {
            path: "/christmas/5.png",
          },
          {
            path: "/christmas/6.png",
          },
          {
            path: "/christmas/7.png",
          },
          {
            path: "/christmas/8.png",
          },
          {
            path: "/christmas/9.png",
          },
          {
            path: "/christmas/10.png",
          },
          {
            path: "/christmas/11.png",
          },
        ],
      },
    ],
  },

  /**
   * 欢迎页按钮 ( 引导订阅考试公告 )
   */
  welcomePageButton: function () {
    // 兼容单页模式
    if (this.data.isSinglePage) {
      wx.showModal({ title: '提示', content: '请点击下方“前往小程序”按钮继续操作', showCancel: false, confirmText: '我知道啦' })
      return
    }
    // 弹出订阅提示
    let _this = this
    wx.showModal({
      title: '提示',
      content: '您是否需要订阅公职类考试公告？订阅成功后您可以在公告发布时免费获得推送提示～',
      confirmText: "免费订阅",
      success(res) {
        if (res.confirm) {
          getApp().methods.subscribeAllExam(_this.data.suffix, undefined, () => {
            // 跳转页面
            _this.setData({ welcomePage: false })
          })
        } else if (res.cancel) {
          // 跳转页面
          _this.setData({ welcomePage: false })
        }
      }
    })
  },

  /**
   * 切换 TabBar
   */
  changeTabBarIndex: function (e) {
    this.setData({
      tabBarIndex: e.currentTarget.dataset.idx
    })
  },

  /**
   * TabBar 添加图片到画板
   */
  addImage: function (e) {
    if (this.data.headerImage === '') {
      wx.showToast({ icon: 'none', title: '您还未添加头像' })
      return
    }
    wx.showLoading({ title: '下载中...', mask: true })
    const width = this.data.width;
    wx.downloadFile({
      url: this.data.imageBase + e.currentTarget.dataset.item.path,
      success: function (res) {
        wx.hideLoading()
        if (res.statusCode === 200) {
          canvasContext.addList(new CanvasItem({
            url: res.tempFilePath,
            width: width / 4,
            height: width / 4,
            x: width / 2 - width / 4,
            y: width / 2 - width / 4
          }))
          canvasContext.draw()
        } else {
          wx.showToast({ icon: 'none', title: '下载失败' })
        }
      },
      fail: err => {
        wx.hideLoading()
        getApp().methods.handleError({ err: err, title: '下载素材失败', content: err.errMsg, reLaunch: false })
      }
    })
  },

  /**
   * TabBar 解锁图片
   */
  unlock: function () {
    this.setData({
      openUnlock: true
    })
  },

  /**
   * TabBar 解锁图片 关闭
   */
  unlockClose: function () {
    this.setData({
      openUnlock: false
    })
  },

  /**
   * TabBar 解锁图片 成功
   */
  unlockSuccess: function () {
    this.setData({
      isLock: false,
      openUnlock: false
    })
  },

  /**
   * 添加头像 ( 打开选择器 )
   */
  add: function () {
    this.setData({
      openSelector: true
    })
    // 获取头像容器大小
    const query = wx.createSelectorQuery()
    query.select('.select').boundingClientRect((res) => {
      this.data.width = res.width
    }).exec()
  },

  /**
   * 选择器 关闭
   */
  cancel() {
    this.setData({
      openSelector: false
    })
  },

  /**
   * 选择器 从相册选择
   */
  chooseImage() {
    let _this = this
    wx.showLoading({
      title: '选择中...',
    })
    wx.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['compressed'],
      success(e) {
        if (e.tempFilePaths.length > 0) {
          // 裁剪图片
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/image-cuter/index',
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              acceptDataFromOpenedPage: function (data) {
                wx.showLoading({ title: '加载中...' })
                _this.setData({
                  headerImage: data.imageSrc
                })
                setTimeout(() => {
                  _this.initCanvas()
                }, 600)
              }
            },
            success: function (res) {
              // 通过 eventChannel 向被打开页面传送数据
              res.eventChannel.emit('acceptDataFromOpenerPage', { imageSrc: e.tempFilePaths[0], config: { width: 300, height: 300 } })
            }
          })
        } else {
          wx.hideLoading()
          wx.showToast({ icon: 'none', title: '您未选择图片' })
        }
      },
      fail() {
        wx.hideLoading()
        wx.showToast({ icon: 'none', title: '您未选择图片' })
      }
    })
    this.cancel()
  },

  /**
   * 选择器 使用用户头像
   */
  useUserAvatar() {
    wx.showLoading({ title: '请稍候...', mask: true })
    var that = this;
    wx.getUserProfile({
      desc: '用于进行头像 DIY',
      success: (res) => {
        // 转换头像链接, 修改为高分辨率链接
        res.userInfo.avatarUrl = res.userInfo.avatarUrl.split('/')
        res.userInfo.avatarUrl[res.userInfo.avatarUrl.length - 1] = 0
        res.userInfo.avatarUrl = res.userInfo.avatarUrl.join('/')
        wx.downloadFile({
          url: res.userInfo.avatarUrl,
          success: function (res) {
            if (res.statusCode === 200) {
              that.setData({
                headerImage: res.tempFilePath,
              })
              setTimeout(() => {
                that.initCanvas()
              }, 600)
              that.cancel()
              wx.hideLoading()
            }
          },
          fail: err => {
            wx.hideLoading()
            getApp().methods.handleError({ err: err, title: '下载用户头像失败', content: err.errMsg, reLaunch: false })
          }
        })
      },
      fail: err => {
        wx.hideLoading()
        if (err.errMsg === "getUserProfile:fail auth deny") {
          // 未授权
          getApp().methods.handleError({ err: err, title: '出错啦', content: "需要您同意授权后方可使用您的头像进行 DIY", reLaunch: false })
        } else {
          // 其他错误
          getApp().methods.handleError({ err: err, title: '出错啦', content: `未知错误，请稍后再试 ${err.errMsg}`, reLaunch: false })
        }
      }
    })
  },

  /**
   * 初始化画板
   */
  initCanvas() {
    // 初始化画板上下文
    canvasContext = new Canvas('decorate', {
      url: this.data.headerImage,
      width: this.data.width,
      height: this.data.width,
      x: 0,
      y: 0
    })
  },

  /**
   * 画板 触摸开始
   * @param {*} e 
   */
  touchStart(e) {
    const { x, y } = e.touches[0]
    canvasContext.touchStart(x, y)
  },

  /**
   * 画板 触摸拖动
   * @param {*} e 
   */
  touchMove(e) {
    const { x, y } = e.touches[0]
    canvasContext.touchScale(x, y)
  },

  /**
   * 画板 触摸结束
   * @param {*} e 
   */
  touchEnd() {
    canvasContext.touchEnd()
  },

  /**
   * 头像 取消选择
   */
  delete: function () {
    if (this.data.headerImage !== '') {
      this.setData({
        headerImage: ''
      })
    } else {
      wx.showToast({ icon: 'none', title: '您还未选择头像' })
    }
  },

  /**
   * 头像 生成头像
   */
  save: function () {
    const _this = this;
    if (this.data.headerImage === '') {
      wx.showToast({ icon: 'none', title: '您还未选择头像' })
      return
    }

    canvasContext.saveCanvas().then((res) => {
      this.setData({
        headerImage: '',
        headerSrc: res.tempFilePath
      })
      wx.showModal({
        title: '头像已保存',
        content: '可以去炫耀一波啦！',
        showCancel: false,
        success: function (sm) {
          if (sm.confirm) {
            // 创建海报文件
            _this.createPoster();
          } else if (sm.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }).catch((err) => {
      getApp().methods.handleError({ err: err, title: '出错啦', content: "保存失败，请稍后再试", reLaunch: false })
    })
  },

  /**
   * 海报 创建文件
   */
  createPoster: function () {
    wx.showLoading({ title: '生成海报中' })
    const _this = this;

    const posterCanvasContext = wx.createCanvasContext('posterCanvas');
    // 下载海报背景图
    wx.downloadFile({
      url: 'https://download.cos.jilinoffcn.com/mini-program/exam-helper/header/poster-2022.jpg',
      success: function (res) {
        if (res.statusCode === 200) {
          // 绘制海报背景图
          posterCanvasContext.drawImage(res.tempFilePath, 0, 0, 750, 1500);
          // 获取后缀对应的二维码配置
          // 获取配置 
          wx.cloud.database().collection('poserQrCode').where({ suffix: _this.data.suffix }).get({
            success: res => {
              let qrCodePath = 'https://download.cos.jilinoffcn.com/public/qr-code/gh_efcfc9e6fc6c.jpg';
              if (res.data.length === 1) {
                qrCodePath = res.data[0].qrCode;
              }
              // 下载二维码
              wx.downloadFile({
                url: qrCodePath,
                success: function (res) {
                  if (res.statusCode === 200) {
                    // 绘制二维码
                    posterCanvasContext.drawImage(res.tempFilePath, 50, 545, 215, 215);
                    // 绘制头像
                    posterCanvasContext.arc(95, 95, 65, 0, 2 * Math.PI);
                    posterCanvasContext.clip();
                    posterCanvasContext.drawImage(_this.data.headerSrc, 30, 30, 130, 130);
                    // 结束绘制
                    posterCanvasContext.draw();

                    // 将海报保存到临时文件
                    setTimeout(function () {
                      wx.canvasToTempFilePath({
                        canvasId: 'posterCanvas',
                        success: function (res) {
                          _this.setData({
                            posterPath: res.tempFilePath,
                          });
                          wx.hideLoading()
                        },
                        fail: function (err) {
                          if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
                            console.log("打开设置窗口");
                            wx.openSetting({
                              success(settingdata) {
                                if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                                  console.log("获取权限成功，再次点击图片保存到相册")
                                } else {
                                  console.log("获取权限失败")
                                }
                              }
                            })
                          } else {
                            wx.hideLoading() // 隐藏 loading
                            getApp().methods.handleError({ err, title: "出错啦", content: '获取配置失败', reLaunch: true })
                          }
                        }
                      });
                    }, 1000);
                  } else {
                    wx.hideLoading()
                    wx.showToast({ icon: 'none', title: '下载二维码失败' })
                  }
                },
                fail: err => {
                  wx.hideLoading()
                  getApp().methods.handleError({ err: err, title: '下载海报背景图失败', content: err.errMsg, reLaunch: false })
                }
              })
            },
            fail: err => {
              wx.hideLoading() // 隐藏 loading
              getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置失败', reLaunch: true })
            }
          })
        } else {
          wx.hideLoading()
          wx.showToast({ icon: 'none', title: '下载海报背景图失败' })
        }
      },
      fail: err => {
        wx.hideLoading()
        getApp().methods.handleError({ err: err, title: '下载海报背景图失败', content: err.errMsg, reLaunch: false })
      }
    })
  },

  /**
   * 海报 保存文件
   */
  savePoster: function () {
    const _this = this
    wx.saveImageToPhotosAlbum({
      filePath: _this.data.posterPath,
      success(res) {
        wx.showModal({
          content: '海报已保存到相册，赶紧发给朋友吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              // 清空海报路径, 隐藏海报弹窗
              _this.setData({ posterPath: '' })
            }
          }
        })
      },
      fail: err => {
        // 清空海报路径, 隐藏海报弹窗
        _this.setData({ posterPath: '' })
        getApp().methods.handleError({ err: err, title: '保存海报失败', content: err.errMsg, reLaunch: false })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取后缀
    if (typeof options.scene !== "undefined") {
      this.setData({
        suffix: options.scene
      })
    }

    // 判断是否是单页模式
    if (wx.getLaunchOptionsSync().scene === 1154) {
      this.setData({
        isSinglePage: true
      })
    }
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '2022 虎年头像 DIY',
      imageUrl: 'https://download.cos.jilinoffcn.com/mini-program/exam-helper/header/share-2022.jpg'
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: '2022 虎年头像 DIY'
    }
  }
})