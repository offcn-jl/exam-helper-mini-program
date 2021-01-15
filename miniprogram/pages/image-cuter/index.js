// pages/image-cuter/index.js

import WeCropper from '../../utils/we-cropper/we-cropper.js'
const app = getApp()
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 100) / 2,
        y: (height - 100) / 2,
        width: 100,
        height: 100
      }
    }
  },

  // 画板 触摸开始
  touchStart(e) {
    this.wecropper.touchStart(e)
  },

  // 画板 触摸拖动
  touchMove(e) {
    this.wecropper.touchMove(e)
  },

  // 画板 触摸结束
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },

  // 重选图片
  reset() {
    const _this = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(e) {       
        if (e.tempFilePaths.length > 0) {
          _this.wecropper.pushOrign(e.tempFilePaths[0])
        }else{
          wx.showToast({ icon: 'none', title: '您未选择图片' })
        }
      }
    })
  },

  // 裁剪图片
  cut: function() {
    const eventChannel = this.getOpenerEventChannel()
    this.wecropper.getCropperImage((imageSrc) => {
      if (imageSrc) {
        // 将裁剪后的图片及裁剪配置传回父页面 ( fixme 目前裁剪配置没有使用需求, 所以没有进行实现 )
        eventChannel.emit('acceptDataFromOpenedPage', { imageSrc });
        wx.navigateBack()
      } else {
        console.log('获取图片地址失败，请稍后重试')
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const _this = this
    const eventChannel = this.getOpenerEventChannel()
    
    // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
    // 获取父页面传来的图片路径
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      const { cropperOpt } = _this.data
      cropperOpt.cut.x = (width - data.config.width) / 2;
      cropperOpt.cut.y = (height - data.config.height) / 2;
      cropperOpt.cut.width = data.config.width;
      cropperOpt.cut.height = data.config.height;

      new WeCropper(cropperOpt)
        .on('ready', (ctx) => {
          // console.log(`wecropper 裁剪插件准备就绪!`)
        })
        .on('beforeImageLoad', (ctx) => {
          // console.log(`before picture loaded, i can do something`)
          // console.log(`current canvas context:`, ctx)
          wx.showToast({ title: '加载中...', icon: 'loading', duration: 20000 })
        })
        .on('imageLoad', (ctx) => {
          // console.log(`picture loaded`)
          // console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
        .on('beforeDraw', (ctx, instance) => {
          // console.log(`before canvas draw,i can do something`)
          // console.log(`current canvas context:`, ctx)
        })
        .updateCanvas()

      // 将图片填充入裁剪插件
      _this.wecropper.pushOrign(data.imageSrc)

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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
})