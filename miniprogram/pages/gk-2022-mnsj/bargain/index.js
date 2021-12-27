const CONFIG = require('../bargain');

Page({
  data: {
    imageUrl:"http://jl.offcn.com/zg/ty/images/exam-helper/zl-2022gk-mnsj/2022gk-mnsj-share.jpg",// 分享时显示的图片
    shareSuccess:false,  // 是否可以领取
    phonelist:["未助力","未助力","未助力"],  // 助力电话列表  
    suffixStr: "", // 后缀
    phone: "", // 用户手机号码
    zcount:0,  // 好友助力进度（0-3）
  },
  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: async function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title:CONFIG.title
    })
    this.setData({
      phone: options.phone,
      suffixStr: 'scode='+options.scode+'&erp='+options.erp+'&erpcity='+options.erpcity+'&misid='+options.misid
      // spid:options.spid,
    });
    this.getyqlist()
  },
  // 获取邀请列表
  getyqlist: function () {
    wx.request({                                   // 网络请求
      url: CONFIG.getyqlistAPI,                    // 获取邀请列表
      data: {
        phone: this.data.phone,
        spid: CONFIG.spid,
        sstime: Math.round(new Date() / 1000),
      },
      success: res => {
        // 转化为数据
        let text = res.data;
        let result_text = text.substring(1, text.length - 1);
        let result = JSON.parse(result_text);
        console.log(result)
        // 写入data里
        if (result.status == 1) {
          let resList = result.lists[0]
          this.setData({
            zcount: resList.zcount,     // 砍价/助力次数和
            endTime: resList.endtime,   // 活动结束时间
          });
          if(this.data.zcount >= 3){
            this.setData({
              shareSuccess:true
            })
          }
          this.getxzlist();
        }
      }
    });
  },
  // 获取协助列表
  getxzlist: function () {
    wx.request({
      url: CONFIG.getxzlistAPI,
      data: {
        phone: this.data.phone,
        spid: CONFIG.spid,
        sstime: Math.round(new Date() / 1000),
      },
      success: res => {
        console.log("协助列表",res)
        let text = res.data;
        let result_text = text.substring(1, text.length - 1);
        let result = JSON.parse(result_text);
        if (result.lists) {
          this.setData({
            xzList: result.lists      
          });
          var list = ["未助力","未助力","未助力"]
          for(let i=0;i<this.data.xzList.length;i++){
            if(i<3){
              list[i]="尾号"+this.data.xzList[i].xzphone.substr(7)
            }
          }
          this.setData({
            phonelist: list
          });
        } else {
          wx.showToast({
            title: result.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    });
  },
  // '领取资料'点击进入
  zlSuccess(){
    wx.navigateTo({
      url: "../success/index"
    });
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
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "我发现了一件好物，快来帮我砍价免费拿吧",
      path: '/pages/gk-2022-mnsj/promote/index?role=1&yqphone=' + this.data.phone + "&" + this.data.suffixStr,
      imageUrl: this.data.imageUrl,
    }
  },

})
