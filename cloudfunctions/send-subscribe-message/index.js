// 云函数入口文件
const 云开发 = require('wx-server-sdk')

// 测试 test-unokj
// 生产 release-yum30
云开发.init({ env: "test-unokj" })

// 云函数入口函数
exports.main = async () => {
  console.log("开始执行")

  const 数据库 = 云开发.database()

  const 出公告的考试项目 = "银行考试" // 公共配置
  const 小程序页面路径 = "/pages/ad-navigate-19/index?scene=2020111301" // 公共配置
  const 考试名称 = "考试名称" // 公共配置
  const 报名时间 = "2021/10/1 15:01 ~ 2021/11/1 15:01" // 公共配置
  const 备注 = "备注" // 公共配置

  const 招聘人数 = "xxxx人" // 仅一次性模板可用
  const 考试时间 = "2021/10/1 15:01 ~ 2021/11/1 15:01" // 仅一次性模板可用

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
      let 已发送 = false;
      for (let 计数器 = 0; 计数器 < 订阅记录.subscribe.length; 计数器++) {
        if (订阅记录.subscribe[计数器] === 出公告的考试项目) {
          // 发送
          try {
            if (订阅记录.suffix) { 小程序页面路径 += "*" + 订阅记录.suffix }
            let result = null;
            switch (订阅记录.tmplIds[0]) {
              case "r6jJofVAClt9WWoh9XL42bf5z2t7FVUX6DNZvmKuSNY":
                // 一次性订阅模板 - 考试公告发布通知
                result = await 云开发.openapi.subscribeMessage.send({
                  templateId: "r6jJofVAClt9WWoh9XL42bf5z2t7FVUX6DNZvmKuSNY",
                  touser: 订阅记录._openid,
                  page: 小程序页面路径,
                  data: { thing1: { value: 考试名称 }, thing2: { value: 招聘人数 }, time3: { value: 报名时间 }, time4: { value: 考试时间 }, thing5: { value: 备注 } }
                });
                capsule(订阅记录._id, "发送成功", "success");
                console.log("订阅记录: ", 订阅记录);
                console.log("回执: ", result)
                break;
              case "Ff-Mi9uy4hb9YxYiYgAwOSlGEXgqTkkoIi5sUsOtaao":
                // 长期订阅模板 - 报名通知
                result = await 云开发.openapi.subscribeMessage.send({
                  templateId: "Ff-Mi9uy4hb9YxYiYgAwOSlGEXgqTkkoIi5sUsOtaao",
                  touser: 订阅记录._openid,
                  page: 小程序页面路径,
                  data: { thing2: { value: 考试名称 }, date3: { value: 报名时间 }, thing5: { value: 备注 } }
                });
                capsule(订阅记录._id, "发送成功", "success");
                console.log("订阅记录: ", 订阅记录);
                console.log("回执: ", result)
                break;
              default:
                // 未知模板
                capsule(订阅记录._id, "发送失败", "warning");
                console.log("订阅记录: ", 订阅记录);
                break;
            }
            已发送 = true;
            break;
          } catch (err) {
            capsule(订阅记录._id, "发送失败", "danger");
            console.log("订阅记录: ", 订阅记录);
            console.error(err)
            已发送 = true;
          }
        }
      }
      if (!已发送) {
        capsule(订阅记录._id, "未定阅", "primary");
        console.log("订阅记录: ", 订阅记录);
      }
    })
  }
}

function typeColor(type = 'default') {
  let color = ''
  switch (type) {
    case 'default': color = '#35495E'; break
    case 'primary': color = '#3488ff'; break
    case 'success': color = '#43B883'; break
    case 'warning': color = '#e6a23c'; break
    case 'danger': color = '#f56c6c'; break
    default: ; break
  }
  return color
}

function capsule(title, info, type = 'primary') {
  console.log(
    `%c ` + title + ` %c ` + info + ` %c`,
    'background:#35495E; padding: 1px; border-radius: 3px 0 0 3px; color: #fff;',
    `background:` + typeColor(type) + `; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff;`,
    'background:transparent'
  )
}