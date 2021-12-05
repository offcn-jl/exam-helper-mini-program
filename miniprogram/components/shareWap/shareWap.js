const app = getApp()
Component({
  properties: {
    contactInformation:{
      type: 1,
      value:[]
    }
  },
  methods: {
    // makePhoneCall 打电话
    makePhoneCall: function () {
      console.log("asd",this.properties)
      wx.makePhoneCall({
        phoneNumber: this.properties.contactInformation.ConsultationPhone
      })
    },
    // gotoOnlineConsulting 打开在线咨询
    gotoOnlineConsulting: function () {
      wx.navigateToMiniProgram({ appId: 'wxb04ce8efcd61db65', path: `/pages/sobot/auto${this.properties.suffixStr ? `?${this.properties.suffixStr}` : ''}` })
    },
  }
})