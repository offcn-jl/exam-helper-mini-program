# 手动推送订阅消息
## 使用“本地调试”的方式进行调用即可
1. 请求方式 修改为 手动触发
1. 模拟 修改为 从小程序端调用 ( 如果使用 从其他云函数调用 方式触发，会出现 Error: errCode: -501007 invalid parameters | errMsg: subscribeMessage.send:fail Invalid request param
    at callGeneralOpenAPI )
1. 自定义超时 修改为 0 ，不设置超时时间