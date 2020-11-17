// 云函数入口文件
const 云开发 = require('wx-server-sdk')

// 测试 test-unokj
// 生产 release-yum30
云开发.init({env: "test-unokj"})

// 云函数入口函数
exports.main = async () => {
  const 数据库 = 云开发.database()
  const 出公告的考试项目 = "吉林公务员"
  const 小程序页面路径 = "/pages/ad-navigate-19/index?scene=2020111301"
  const 考试名称 = "考试名称"
  const 招聘人数 = "xxxx人"
  const 报名时间 = "2021/10/1 15:01 ~ 2021/11/1 15:01"
  const 考试时间 = "2021/10/1 15:01 ~ 2021/11/1 15:01"
  const 备注 = "备注"

  // 获取最大数量
  let 预约记录总数 = await 数据库.collection("subscribeExam").count()
  if (预约记录总数.errMsg !== "collection.count:ok") {
    return "查询最大条数出错"
  }
  预约记录总数 = 预约记录总数.total

  for (let 跳过的记录条数 = 0, 查询结果集数量上限 = 1000; 跳过的记录条数 < 预约记录总数; 跳过的记录条数 += 查询结果集数量上限) {
    let 查询结果 = await 数据库.collection("subscribeExam").skip(跳过的记录条数).limit(查询结果集数量上限).get()
    if (查询结果.errMsg !== "collection.get:ok") { return "查询出错" }
    查询结果.data.forEach(async 订阅记录 => {
      console.group("订阅记录 " + 订阅记录._id)
      console.log("记录: ", 订阅记录)
      let 已发送 = false;
      for (let 计数器 = 0; 计数器 < 订阅记录.subscribe.length; 计数器++) {
        if (订阅记录.subscribe[计数器] === 出公告的考试项目) {
          // 发送
          try {
            if (订阅记录.suffix) { 小程序页面路径 += "*" + 订阅记录.suffix }
            const result = await 云开发.openapi.subscribeMessage.send({
              templateId: "r6jJofVAClt9WWoh9XL42bf5z2t7FVUX6DNZvmKuSNY",
              touser: 订阅记录._openid,
              page: 小程序页面路径,
              data: { thing1: { value: 考试名称 }, thing2: { value: 招聘人数 }, time3: { value: 报名时间 }, time4: { value: 考试时间 }, thing5: { value: 备注 } }
            })
            console.group("%c发送成功", "background: #00AA13; padding: 2px 4px 2px 4px; border-radius: 3px; color: #fff;")
            console.log("回执: ", result)
            console.groupEnd()
            已发送 = true
            break
          } catch (err) {
            console.group("%c发送失败", "background: #C00; padding: 2px 4px 2px 4px; border-radius: 3px; color: #fff;")
            console.log("记录 ID :" + 订阅记录._id)
            console.error(err)
            console.groupEnd()
            已发送 = true
          }
        }
      }
      if (!已发送) {
        console.log("%c未定阅", "background: #D79700; padding: 2px 4px 2px 4px; border-radius: 3px; color: #fff;")
      }
      console.groupEnd()
    })
  }
}