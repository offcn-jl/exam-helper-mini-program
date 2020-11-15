// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  // 判断是否可以正确解码 cloudID
  // 使用电脑微信打开时会出现这种情况
  if (typeof event.cloudID.data === "undefined") {
    return { msg: "登陆失败 ! ( 请勿使用电脑微信打开本小程序 )" }
  }

  return { msg: "Success", phone: event.cloudID.data.phoneNumber }
}