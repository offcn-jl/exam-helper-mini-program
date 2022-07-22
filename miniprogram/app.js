//app.js
App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                // env 参数说明：
                //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
                //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
                //   如不填则使用默认环境（第一个创建的环境）
                // env: 'my-env-id',
                env: {
                    // 默认环境配置，传入字符串形式的环境 ID 可以指定所有服务的默认环境，传入对象可以分别指定各个服务的默认环境
                    // 为了便于开发和调试, 此处选择了对象形式
                    // 但是原则上不应该在开发的过程中混用环境
                    database: this.globalData.configs.cloudEnvironment,
                    storage: this.globalData.configs.cloudEnvironment,
                    functions: this.globalData.configs.cloudEnvironment
                },
                traceUser: true,
            })
        }
        // 获取用户信息
        if (wx.getStorageSync('sso-token')) {
            this.methods.requsetWithCode({
                path: "/user/sso/info",
                data: { token: wx.getStorageSync('sso-token') },
                callback: res => {
                    if (res.data.code === 0) {
                        this.globalData.user = res.data.data.user;
                        this.globalData.userLoaded = true;
                    } else {
                        // 返回错误代表 token 失效, 直接移除 token
                        wx.removeStorage({ key: 'sso-token' });
                        this.globalData.userLoaded = true;
                    }
                },
            });
        } else {
            this.globalData.userLoaded = true;
        }
    },
    globalData: {
        configs: {
            ...require("./config")
        },
        // 用户信息
        user: {},
        userLoaded: false,
    },
    methods: {
        /**
         * 处理错误
         * @param {Object} err 错误内容
         * @param {String} [ title = "出错啦" ] 标题
         * @param {String} [ content = "请您稍候再试～" ] 提示语
         * @param {String} [ confirmText = "我知道了" ] 确认按钮文字
         * @param {Boolean} [ reLaunch = false ] 是否重启
         */
        handleError({ err, title = "出错啦", content = "请您稍候再试～", confirmText = "我知道了", reLaunch = false } = {}) {
            // 打印错误到控制台
            console.error(err)
            // 震动反馈
            wx.vibrateLong()
            // 弹出弹窗
            wx.showModal({
                title: title,
                content: content,
                confirmText: confirmText,
                showCancel: false,
                success(res) {
                    if (reLaunch) {
                        wx.reLaunch({
                            url: '/pages/index/index'
                        })
                    }
                }
            })
        },

        /**
         * requsetWithCode 公共函数 携带用户 code 发起请求
         * 通常用于需要验证用户身份的接口
         * @param {*} path 请求路径
         * @param {*} method 请求方法
         * @param {*} data 请求要提交的数据 按照 method 自动适应
         * @param {*} queryData 请求 method = post 时, 需额外附加的 query data, 将会自动拼接到 query string 中
         * @param {*} callback 回调函数
         */
        requsetWithCode: ({ path, method = 'GET', data, queryData, callback }) => {
            // 将 queryData 对象转换为 queryString
            let queryString = '';
            if (queryData) {
                for (let key in queryData) {
                    queryString += `&${key}=${queryData[key]}`
                }
            }

            wx.login({
                success(res) {
                    if (res.code) {
                        // 发起网络请求
                        wx.showLoading({ title: '请稍候...', mask: true })
                        wx.request({
                            url: `${getApp().globalData.configs.apis.base}${path}${path.indexOf('?') === -1 ? '?' : '&'}appid=${getApp().globalData.configs.appid}&code=${res.code}${queryString}`,
                            method: method,
                            data: data,
                            success: res => {
                                wx.hideLoading(); // 隐藏 loading
                                if (res.statusCode !== 200 || !res.data.success) {
                                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : `发送请求失败，状态码：${res.statusCode}` });
                                } else {
                                    // 调用回调函数, 返回响应内容
                                    callback && callback(res.data);
                                }
                            },
                            fail: err => {
                                wx.hideLoading() // 隐藏 loading
                                getApp().methods.handleError({ err: err, title: "出错啦", content: '发送请求失败' })
                            }
                        })
                    } else {
                        // 将返回的报错输出到错误提示
                        getApp().methods.handleError({ err: res, title: "登陆失败", content: res.errMsg })
                    }
                }
            })
        },

        /**
         * getSuffix 获取后缀信息
         */
        async getSuffix(options) {
            // options.misid = 3118 // 测试参数
            // options.scode = "rtFbZ" // 测试参数
            // options.owner = 32 // 测试参数

            // 根据入参创建推广后缀对象
            let suffix = {};
            if (options.owner) suffix.owner = options.owner
            if (options.channel) suffix.channel = options.channel
            if (options.orgn) suffix.orgn = options.orgn
            if (options.erp) suffix.erp = options.erp
            if (options.erp) suffix.erpcity = options.erp
            if (options.c2) suffix.c2 = options.c2
            if (options.scode) suffix.scode = options.scode
            if (options.misid) suffix.misid = options.misid
            // 生成推广后缀字符串
            let suffixStr = '';
            for (let key in suffix) {
                suffixStr += `${key}=${suffix[key]}&`;
            }
            suffixStr = suffixStr.substr(0, suffixStr.length - 1); // 裁剪最后一个 &

            // 校验并补全后缀信息
            if (suffixStr !== '') {
                // 发起网络请求
                function check() {
                    return new Promise(resolve => {
                        wx.showLoading({ title: '请稍候...', mask: true })
                        wx.request({
                            url: getApp().globalData.configs.apis.base.replace('wechat/mini-program', 'suffix/check'),
                            data: suffix,
                            success: res => {
                                wx.hideLoading(); // 隐藏 loading
                                if (res.statusCode !== 200 || !res.data.success) {
                                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : `发送请求失败，状态码：${res.statusCode}` });
                                    resolve(false)
                                } else {
                                    // 调用回调函数, 返回响应内容
                                    resolve(res.data.data)
                                }
                            },
                            fail: err => {
                                wx.hideLoading() // 隐藏 loading
                                getApp().methods.handleError({ err: err, title: "出错啦", content: '发送请求失败' })
                                resolve(false)
                            }
                        })
                    })
                }

                const suffixInfo = await check();
                if (suffixInfo) {
                    if (suffixInfo.Erp) suffix.erp = suffixInfo.Erp;
                    if (suffixInfo.Erp) suffix.erpcity = suffixInfo.Erp;
                    if (suffixInfo.MisId) suffix.misid = suffixInfo.MisId;
                    if (suffixInfo.Organization) suffix.orgn = suffixInfo.Organization;
                    if (suffixInfo.Owner) suffix.owner = suffixInfo.Owner;
                    if (suffixInfo.SCode) suffix.scode = suffixInfo.SCode;
                    suffixStr = '';
                    for (let key in suffix) {
                        suffixStr += `${key}=${suffix[key]}&`;
                    }
                    suffixStr = suffixStr.substr(0, suffixStr.length - 1); // 裁剪最后一个 &
                }
            }

            // 保存推广后缀信息
            return { suffix, suffixStr };
        },

        // getContactInformation 获取推广信息
        async getContactInformation(suffixInfo) {
            const requestData = {};
            if (suffixInfo.suffix.owner) {
                requestData.owner = suffixInfo.suffix.owner;
            } else if (suffixInfo.suffix.scode) {
                requestData.scode = suffixInfo.suffix.scode;
            }

            // 发起网络请求
            function sendRequset() {
                return new Promise(resolve => {
                    wx.showLoading({ title: '请稍候...', mask: true })
                    wx.request({
                        url: getApp().globalData.configs.apis.base.replace('wechat/mini-program', 'tools-and-service/contact-information'),
                        data: requestData,
                        success: res => {
                            wx.hideLoading(); // 隐藏 loading
                            if (res.statusCode !== 200 || !res.data.success) {
                                getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : `发送请求失败，状态码：${res.statusCode}` });
                                resolve(false)
                            } else {
                                // 将总部默认的联系方式替换为省内的联系方式
                                if (res.data.data.MisID === 0) {
                                    res.data.data.MisID = 16278;
                                    res.data.data.SobotChannelID = 79;
                                    res.data.data.SobotGroupID = '4b695bc1e2fe45b197ad6ddf1aa2ea7e';
                                    res.data.data.WechatWorkContactMePlugID = 'e1584dea55b27b579dd6e0a479b6faec';
                                    res.data.data.WechatWorkQrCode = 'https://open.work.weixin.qq.com/wwopen/userQRCode?vcode=vcc523b25a56ca8f0b';
                                    res.data.data.ConsultationPhone = '0431-81239600';
                                }
                                // 调用回调函数, 返回响应内容
                                resolve(res.data.data)
                            }
                        },
                        fail: err => {
                            wx.hideLoading() // 隐藏 loading
                            getApp().methods.handleError({ err: err, title: "出错啦", content: '发送请求失败' })
                            resolve(false)
                        }
                    })
                })
            }

            return await sendRequset();
        },

        // push2crm 推送数据到 crm
        push2crm({ phone, crmEventFormSID, suffix, remark }) {
            if (phone && crmEventFormSID) {
                // 推送数据
                wx.request({ url: `https://dc.offcn.com:8443/a.gif?mobile=${phone}&sid=${crmEventFormSID}${remark ? `&remark=${remark}` : ''}`, data: suffix && suffix.suffix ? suffix.suffix : {} })
                // 记录推送日志
                wx.request({ url: `${getApp().globalData.configs.apis.base.replace('wechat/mini-program', 'crm/push/log')}?mobile=${phone}&sid=${crmEventFormSID}${remark ? `&remark=${remark}` : ''}`, data: suffix && suffix.suffix ? suffix.suffix : {} })
            }
        },

        /**
         * newLoginCheck 公共函数 检查登陆状态
         * @param {*} crmEventFormSID CRM 活动表单 SID
         * @param {*} suffix 后缀信息
         * @param {*} remark 备注
         * @param {*} callback 回调函数
         */
        newLoginCheck({ crmEventFormSID, suffix, remark, callback }) {
            getApp().methods.requsetWithCode({
                path: "/user/login/check",
                // 推送 crm 并返回数据
                callback: res => res.errorMessage !== '用户未登录或登陆态已失效' && (getApp().methods.push2crm({ phone: res.data.phone, crmEventFormSID, suffix, remark }) || (callback && callback({ phone: res.data.phone, openid: res.data.openid })))
            });
        },

        /**
         * newLogin 公共函数 登陆
         * @param {*} event 按钮点击事件
         * @param {*} crmEventFormSID CRM 活动表单 SID
         * @param {*} suffix 后缀信息
         * @param {*} remark 备注
         * @param {*} callback 回调函数
         */
        newLogin({ event, crmEventFormSID, suffix, remark, callback }) {
            // 判断是否授权使用手机号
            if (event.detail.errMsg !== 'getPhoneNumber:ok') {
                getApp().methods.handleError({ err: event.detail.errMsg, title: "出错啦", content: "本功能需要您授权登陆后方可使用" })
                return
            }

            getApp().methods.requsetWithCode({
                path: "/user/login",
                method: "POST",
                data: { encryptedData: event.detail.encryptedData, iv: event.detail.iv },
                // 推送 crm 并返回数据
                callback: res => getApp().methods.push2crm({ phone: res.data.phone, crmEventFormSID, suffix, remark }) || (callback && callback({ phone: res.data.phone, openid: res.data.openid }))
            });
        },

        /**
         * 注册
         * 注册信息不会推送到 CRM
         * 注册成功后会执行回调
         * @param {*} event 
         * @param {*} suffix 
         * @param {*} remark 
         */
        registerWithoutPush(event, suffix, remark, callback) {
            // 判断是否授权使用手机号
            if (event.detail.errMsg !== 'getPhoneNumber:ok') {
                getApp().methods.handleError({
                    err: event.detail.errMsg,
                    title: "出错啦",
                    content: "需要您同意授权获取手机号码后才能完成注册～"
                })
                return
            }

            // 弹出 Loading
            wx.showLoading({ title: '注册中...', mask: true })

            // 提交 cloudID, 换取手机号
            wx.cloud.callFunction({
                name: 'register-without-push',
                data: {
                    cloudID: wx.cloud.CloudID(event.detail.cloudID)
                },
                success: cloudFunctionRes => {
                    if (cloudFunctionRes.errMsg === "cloud.callFunction:ok") {
                        if (cloudFunctionRes.result.msg !== "Success") {
                            wx.hideLoading() // 隐藏 loading
                            getApp().methods.handleError({ err: cloudFunctionRes.result, title: "出错啦", content: cloudFunctionRes.result.msg })
                        } else {
                            // 保存注册记录到数据库
                            wx.cloud.database().collection('user').add({
                                data: { phone: cloudFunctionRes.result.phone, createdTime: new Date(), suffix, remark }
                            }).then(collectionAddRes => {
                                if (collectionAddRes.errMsg == 'collection.add:ok') {
                                    wx.hideLoading() // 隐藏 loading
                                    callback(cloudFunctionRes.result.phone) // 操作成功
                                } else {
                                    wx.hideLoading() // 隐藏 loading
                                    getApp().methods.handleError({
                                        err: collectionAddRes,
                                        title: "出错啦",
                                        content: collectionAddRes.errMsg
                                    })
                                }
                            }).catch(err => {
                                wx.hideLoading() // 隐藏 loading
                                getApp().methods.handleError({
                                    err: err,
                                    title: "出错啦",
                                    content: "创建用户失败"
                                })
                            })
                        }
                    } else {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({
                            err: callFunctionRes.result.error,
                            title: "出错啦",
                            content: callFunctionRes.result.error
                        })
                    }
                },
                fail: err => {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: "调用注册云函数出错" })
                }
            })
        },
        /**
         * 注册
         * 注册信息会推送到 CRM
         * 注册成功后会执行回调
         * @param {*} event 
         * @param {*} suffix 
         * @param {*} CRMEFSID 
         * @param {*} remark 
         * @param {*} callback 
         */
        register(event, suffix, CRMEFSID, remark, callback) {
            // 判断是否授权使用手机号
            if (event.detail.errMsg !== 'getPhoneNumber:ok') {
                getApp().methods.handleError({
                    err: event.detail.errMsg,
                    title: "出错啦",
                    content: "需要您同意授权获取手机号码后才能完成注册～"
                })
                return
            }

            // 弹出 Loading
            wx.showLoading({
                title: '注册中...',
                mask: true
            })

            // 提交 cloudID, 换取手机号并推送 CRM
            wx.cloud.callFunction({
                name: 'register',
                data: { cloudID: wx.cloud.CloudID(event.detail.cloudID), environment: getApp().globalData.configs.environment, suffix, CRMEFSID, remark },
                success: cloudFunctionRes => {
                    if (cloudFunctionRes.errMsg === "cloud.callFunction:ok") {
                        if (cloudFunctionRes.result.msg !== "Success") {
                            wx.hideLoading() // 隐藏 loading
                            getApp().methods.handleError({ err: cloudFunctionRes.result, title: "出错啦", content: cloudFunctionRes.result.msg })
                        } else {
                            // 保存注册记录到数据库
                            wx.cloud.database().collection('user').add({
                                data: { phone: cloudFunctionRes.result.phone, createdTime: new Date(), suffix, CRMEFSID, remark }
                            }).then(collectionAddRes => {
                                if (collectionAddRes.errMsg == 'collection.add:ok') {
                                    // 操作成功
                                    wx.hideLoading() // 隐藏 loading
                                    callback(cloudFunctionRes.result.phone)
                                } else {
                                    wx.hideLoading() // 隐藏 loading
                                    getApp().methods.handleError({
                                        err: collectionAddRes, title: "出错啦", content: collectionAddRes.errMsg
                                    })
                                }
                            }).catch(err => {
                                wx.hideLoading() // 隐藏 loading
                                getApp().methods.handleError({ err: err, title: "出错啦", content: "创建用户失败" })
                            })
                        }
                    } else {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: callFunctionRes.result.error, title: "出错啦", content: callFunctionRes.result.error })
                    }
                },
                fail: err => {
                    wx.hideLoading() // 隐藏 loading
                    getApp().methods.handleError({ err: err, title: "出错啦", content: "调用注册云函数出错" })
                }
            })
        },
        /**
         * 登陆 查询数据库获取注册状态
         * 登陆成功后会执行回调
         * @param {*} callback 
         */
        login(CRMEFSID, suffix, remark, callback) {
            // 查询注册状态
            // 弹出 Loading
            wx.showLoading({ title: '登陆中...', mask: true })
            // 查询注册时间为近30天的数据，仅查询手机号码
            wx.cloud.database().collection('user').field({ phone: true, CRMEFSID: true }).where({ createdTime: wx.cloud.database().command.gte(new Date((new Date()).getTime() - 30 * 24 * 60 * 60 * 1000)) }).get({
                success: res => {
                    // 判断是否查询成功
                    if (res.errMsg === "collection.get:ok") {
                        // 判断是否存在数据
                        if (res.data.length > 0) {
                            // 存在数据
                            // 判断是否推送过数据
                            if (CRMEFSID !== "" && res.data[0].CRMEFSID !== CRMEFSID) {
                                // 与注册日志中的记录不符，视为未推送, 进行推送操作
                                wx.request({
                                    url: 'https://scf.tencent.jilinoffcn.com/release/sso/v2/crm/push', //仅为示例，并非真实的接口地址
                                    method: "POST",
                                    data: { CRMSID: CRMEFSID, Suffix: suffix, Phone: res.data[0].phone, Remark: remark },
                                    success(pushRes) {
                                        if (pushRes.data.Code !== 0) {
                                            // 推送失败
                                            // 将返回的报错输出到错误提示
                                            getApp().methods.handleError({ err: pushRes, title: "出错啦", content: '[ ' + pushRes.data.Code + '] ' + pushRes.data.Error })
                                        } else {
                                            // 推送成功
                                            // 调用回调函数, 返回已经注册用户的手机号码
                                            callback(res.data[0].phone)
                                        }
                                    },
                                    fail: err => getApp().methods.handleError({ err, title: "出错啦", content: '推送登陆状态失败' })
                                })
                            } else {
                                // 与注册日志中的记录一致，可以认为已经推送过数据，跳过推送操作
                                // 调用回调函数, 返回已经注册用户的手机号码
                                callback(res.data[0].phone)
                            }
                        }
                        wx.hideLoading() // 隐藏 loading
                    } else {
                        getApp().methods.handleError({ err: res, title: "出错啦", content: res.errMsg })
                        wx.hideLoading() // 隐藏 loading
                    }
                },
                fail: err => {
                    getApp().methods.handleError({ err: err, title: "出错啦", content: '查询注册状态失败' })
                    wx.hideLoading() // 隐藏 loading
                }
            })
        },
        /**
         * 订阅单项考试的考试公告
         * @param {*} suffix 个人后缀
         * @param {*} subscribe 要订阅的考试项目
         * @param {*} tmplIds 订阅消息模板 ID
         */
        subscribeSingleExam(suffix, subscribe, tmplIds = ["Ff-Mi9uy4hb9YxYiYgAwOSlGEXgqTkkoIi5sUsOtaao"], callback) {
            // 获取用户配置
            wx.getSetting({
                withSubscriptions: true,
                success(res) {
                    // 判断订阅消息总开关
                    if (!res.subscriptionsSetting.mainSwitch) {
                        // 订阅消息总开关是关闭的
                        // 提示用户是否打开设置后打开开关
                        openSubscribeMainSwitchTips(res)
                    } else {
                        // 订阅消息的总开关是开启的
                        // 判断有没有勾选不再询问
                        if (!res.subscriptionsSetting.itemSettings) {
                            // 没有勾选不再询问
                            // 弹出授权窗口
                            wx.requestSubscribeMessage({
                                tmplIds,
                                complete: e => {
                                    if (e.errMsg !== "requestSubscribeMessage:ok") {
                                        // 发生错误
                                        getApp().methods.handleError({
                                            err: e,
                                            title: "出错啦",
                                            content: e.errMsg
                                        })
                                    } else {
                                        handelSubscribeSettingItems(e)
                                    }
                                }
                            })
                        } else {
                            // 勾选了不再询问
                            // 判断配置的消息列表中是否有被拒绝的
                            // 存在被拒绝的则弹出提示
                            // 不存在被拒绝的则保存订阅记录
                            handelSubscribeSettingItems(res.subscriptionsSetting)
                        }
                    }
                }
            })

            // openSubscribeMainSwitchTips 提醒用户打开订阅消息开关
            let openSubscribeMainSwitchTips = e => {
                if (!e.subscriptionsSetting.mainSwitch) {
                    // 订阅消息总开关是关闭的
                    // 提示用户是否打开设置后打开开关
                    wx.showModal({
                        title: '提示',
                        content: '您关闭了发送订阅消息功能，是否前往开启？',
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    withSubscriptions: true,
                                    success: res => openSubscribeMainSwitchTips(res)
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '您成功开启了订阅消息功能，请再次点击订阅按钮完成订阅～',
                        showCancel: false,
                        confirmText: "我知道啦"
                    })
                }
            }

            // handelSubscribeSettingItems 检查订阅消息配置列表
            let handelSubscribeSettingItems = items => {
                let reject = false
                for (let i = 0; i < tmplIds.length; i++) {
                    if (items[tmplIds[i]] !== "accept") {
                        reject = true
                        break
                    }
                }
                if (reject) {
                    wx.showModal({
                        title: '订阅失败',
                        content: '获取订阅消息授权失败，可能是您设置了"拒绝并不再询问"？',
                        confirmText: "修改设置",
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    withSubscriptions: true,
                                    success: res => {
                                        console.log(res)
                                        if (typeof res.subscriptionsSetting.itemSettings !== "undefined") {
                                            // 有不再提示的记录，再次进行检查
                                            handelSubscribeSettingItems(res.subscriptionsSetting.itemSettings)
                                        } else {
                                            // 没有不再提示的记录
                                            // 提醒用户打开订阅消息开关
                                            openSubscribeMainSwitchTips(res)
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    // 订阅消息
                    wx.requestSubscribeMessage({ tmplIds })
                    // 保存订阅记录
                    wx.showLoading({ title: '订阅中...', mask: true }) // 弹出 Loading
                    // 判断是否存在订阅记录
                    wx.cloud.database().collection('subscribeExam').get().then(collectionGetRes => {
                        if (collectionGetRes.errMsg == 'collection.get:ok') {
                            // 查询成功
                            if (collectionGetRes.data.length === 0) {
                                // 没有预约记录, 新建预约记录
                                wx.cloud.database().collection('subscribeExam').add({
                                    data: { suffix, subscribe: new Array(subscribe), tmplIds, createdTime: new Date(), updatedTime: new Date() }
                                }).then(collectionAddRes => {
                                    if (collectionAddRes.errMsg == 'collection.add:ok') {
                                        wx.showToast({ title: '订阅成功', icon: 'success' })
                                        if (typeof callback === "function") {
                                            callback()
                                        }
                                    } else {
                                        wx.hideLoading() // 隐藏 loading
                                        getApp().methods.handleError({ err: collectionAddRes, title: "出错啦", content: collectionAddRes.errMsg })
                                    }
                                }).catch(err => {
                                    wx.hideLoading() // 隐藏 loading
                                    getApp().methods.handleError({ err: err, title: "出错啦", content: "保存订阅记录失败" })
                                })
                            } else {
                                // 存在预约记录, 判断是否需要更新预约记录
                                if (collectionGetRes.data[0].suffix === suffix && collectionGetRes.data[0].subscribe.sort().toString() === new Array(subscribe).sort().toString() && collectionGetRes.data[0].tmplIds.sort().toString() === tmplIds.sort().toString()) {
                                    // 预约记录一致, 无需更新
                                    wx.showToast({ title: '订阅成功', icon: 'success' })
                                    if (typeof callback === "function") {
                                        callback()
                                    }
                                } else {
                                    // 预约记录不一致
                                    // 判断预约记录中是否有目标记录
                                    if (collectionGetRes.data[0].subscribe.length !== 0) {
                                        let has = false
                                        for (let i = 0; i < collectionGetRes.data[0].subscribe.length; i++) {
                                            if (collectionGetRes.data[0].subscribe[i] === subscribe) {
                                                has = true
                                                break
                                            }
                                        }
                                        if (!has) {
                                            collectionGetRes.data[0].subscribe.push(subscribe)
                                        }
                                    } else {
                                        collectionGetRes.data[0].subscribe.push(subscribe)
                                    }
                                    wx.cloud.database().collection('subscribeExam').where({ _id: collectionGetRes.data[0]._id }).update({
                                        data: { suffix, subscribe: collectionGetRes.data[0].subscribe, tmplIds, updatedTime: new Date() }
                                    }).then(collectionUpdateRes => {
                                        if (collectionUpdateRes.errMsg == 'collection.update:ok') {
                                            wx.showToast({ title: '订阅成功', icon: 'success' })
                                            if (typeof callback === "function") {
                                                callback()
                                            }
                                        } else {
                                            wx.hideLoading() // 隐藏 loading
                                            getApp().methods.handleError({ err: collectionUpdateRes, title: "出错啦", content: collectionUpdateRes.errMsg })
                                        }
                                    }).catch(err => {
                                        wx.hideLoading() // 隐藏 loading
                                        getApp().methods.handleError({ err: err, title: "出错啦", content: "更新订阅记录失败" })
                                    })
                                }
                            }
                        } else {
                            wx.hideLoading() // 隐藏 loading
                            getApp().methods.handleError({ err: collectionGetRes, title: "出错啦", content: collectionGetRes.errMsg })
                        }
                    }).catch(err => {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: "查询订阅记录失败" })
                    })
                }
            }
        },
        /**
         * 订阅所有考试的考试公告
         * @param {*} suffix 个人后缀
         * @param {*} tmplIds 订阅消息模板 ID
         */
        subscribeAllExam(suffix, tmplIds = ["Ff-Mi9uy4hb9YxYiYgAwOSlGEXgqTkkoIi5sUsOtaao"], callback) {
            // 获取用户配置
            wx.getSetting({
                withSubscriptions: true,
                success(res) {
                    // 判断订阅消息总开关
                    if (!res.subscriptionsSetting.mainSwitch) {
                        // 订阅消息总开关是关闭的
                        // 提示用户是否打开设置后打开开关
                        openSubscribeMainSwitchTips(res)
                    } else {
                        // 订阅消息的总开关是开启的
                        // 判断有没有勾选不再询问
                        if (!res.subscriptionsSetting.itemSettings) {
                            // 没有勾选不再询问
                            // 弹出授权窗口
                            wx.requestSubscribeMessage({
                                tmplIds,
                                complete: e => {
                                    if (e.errMsg !== "requestSubscribeMessage:ok") {
                                        // 发生错误
                                        getApp().methods.handleError({
                                            err: e,
                                            title: "出错啦",
                                            content: e.errMsg
                                        })
                                    } else {
                                        handelSubscribeSettingItems(e)
                                    }
                                }
                            })
                        } else {
                            // 勾选了不再询问
                            // 判断配置的消息列表中是否有被拒绝的
                            // 存在被拒绝的则弹出提示
                            // 不存在被拒绝的则保存订阅记录
                            handelSubscribeSettingItems(res.subscriptionsSetting)
                        }
                    }
                }
            })

            // openSubscribeMainSwitchTips 提醒用户打开订阅消息开关
            let openSubscribeMainSwitchTips = e => {
                if (!e.subscriptionsSetting.mainSwitch) {
                    // 订阅消息总开关是关闭的
                    // 提示用户是否打开设置后打开开关
                    wx.showModal({
                        title: '提示',
                        content: '您关闭了发送订阅消息功能，是否前往开启？',
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    withSubscriptions: true,
                                    success: res => openSubscribeMainSwitchTips(res)
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '您成功开启了订阅消息功能，请再次点击订阅按钮完成订阅～',
                        showCancel: false,
                        confirmText: "我知道啦"
                    })
                }
            }

            // handelSubscribeSettingItems 检查订阅消息配置列表
            let handelSubscribeSettingItems = items => {
                let reject = false
                for (let i = 0; i < tmplIds.length; i++) {
                    if (items[tmplIds[i]] !== "accept") {
                        reject = true
                        break
                    }
                }
                if (reject) {
                    wx.showModal({
                        title: '订阅失败',
                        content: '获取订阅消息授权失败，可能是您设置了"拒绝并不再询问"？',
                        confirmText: "修改设置",
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    withSubscriptions: true,
                                    success: res => {
                                        console.log(res)
                                        if (typeof res.subscriptionsSetting.itemSettings !== "undefined") {
                                            // 有不再提示的记录，再次进行检查
                                            handelSubscribeSettingItems(res.subscriptionsSetting.itemSettings)
                                        } else {
                                            // 没有不再提示的记录
                                            // 提醒用户打开订阅消息开关
                                            openSubscribeMainSwitchTips(res)
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    // 订阅消息
                    wx.requestSubscribeMessage({ tmplIds })
                    // 保存订阅记录
                    wx.showLoading({ title: '订阅中...', mask: true }) // 弹出 Loading
                    // 判断是否存在订阅记录
                    wx.cloud.database().collection('subscribeExam').get().then(collectionGetRes => {
                        if (collectionGetRes.errMsg == 'collection.get:ok') {
                            // 查询成功
                            if (collectionGetRes.data.length === 0) {
                                // 没有预约记录, 新建预约记录
                                wx.cloud.database().collection('subscribeExam').add({
                                    data: {
                                        suffix, subscribe: [
                                            "国家公务员",
                                            "吉林公务员",
                                            "事业单位",
                                            "医疗招聘",
                                            "教师招聘",
                                            "特岗教师",
                                            "教师资格",
                                            "银行考试",
                                            "三支一扶",
                                            "公选遴选",
                                            "社会工作",
                                            "会计取证",
                                            "军队文职",
                                            "军人考试",
                                            "医学考试",
                                            "农信社",
                                            "选调生",
                                            "招警",
                                            "国企"
                                        ], tmplIds, createdTime: new Date(), updatedTime: new Date()
                                    }
                                }).then(collectionAddRes => {
                                    if (collectionAddRes.errMsg == 'collection.add:ok') {
                                        wx.showToast({ title: '订阅成功', icon: 'success' })
                                        if (typeof callback === "function") {
                                            callback()
                                        }
                                    } else {
                                        wx.hideLoading() // 隐藏 loading
                                        getApp().methods.handleError({ err: collectionAddRes, title: "出错啦", content: collectionAddRes.errMsg })
                                    }
                                }).catch(err => {
                                    wx.hideLoading() // 隐藏 loading
                                    getApp().methods.handleError({ err: err, title: "出错啦", content: "保存订阅记录失败" })
                                })
                            } else {
                                // 存在预约记录, 直接更新预约记录
                                wx.cloud.database().collection('subscribeExam').where({ _id: collectionGetRes.data[0]._id }).update({
                                    data: {
                                        suffix, subscribe: [
                                            "国家公务员",
                                            "吉林公务员",
                                            "事业单位",
                                            "医疗招聘",
                                            "教师招聘",
                                            "特岗教师",
                                            "教师资格",
                                            "银行考试",
                                            "三支一扶",
                                            "公选遴选",
                                            "社会工作",
                                            "会计取证",
                                            "军队文职",
                                            "军人考试",
                                            "医学考试",
                                            "农信社",
                                            "选调生",
                                            "招警",
                                            "国企"
                                        ], tmplIds, updatedTime: new Date()
                                    }
                                }).then(collectionUpdateRes => {
                                    if (collectionUpdateRes.errMsg == 'collection.update:ok') {
                                        wx.showToast({ title: '订阅成功', icon: 'success' })
                                        if (typeof callback === "function") {
                                            callback()
                                        }
                                    } else {
                                        wx.hideLoading() // 隐藏 loading
                                        getApp().methods.handleError({ err: collectionUpdateRes, title: "出错啦", content: collectionUpdateRes.errMsg })
                                    }
                                }).catch(err => {
                                    wx.hideLoading() // 隐藏 loading
                                    getApp().methods.handleError({ err: err, title: "出错啦", content: "更新订阅记录失败" })
                                })
                            }
                        } else {
                            wx.hideLoading() // 隐藏 loading
                            getApp().methods.handleError({ err: collectionGetRes, title: "出错啦", content: collectionGetRes.errMsg })
                        }
                    }).catch(err => {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: "查询订阅记录失败" })
                    })
                }
            }
        },
        /**
         * 订阅考试公告
         * @param {*} suffix 个人后缀
         * @param {*} subscribe 要订阅的考试项目
         * @param {*} tmplIds 订阅消息模板 ID
         */
        subscribeExam(suffix, subscribe, tmplIds = ["Ff-Mi9uy4hb9YxYiYgAwOSlGEXgqTkkoIi5sUsOtaao"], callback) {
            // 获取用户配置
            wx.getSetting({
                withSubscriptions: true,
                success(res) {
                    // 判断订阅消息总开关
                    if (!res.subscriptionsSetting.mainSwitch) {
                        // 订阅消息总开关是关闭的
                        // 提示用户是否打开设置后打开开关
                        openSubscribeMainSwitchTips(res)
                    } else {
                        // 订阅消息的总开关是开启的
                        // 判断有没有勾选不再询问
                        if (!res.subscriptionsSetting.itemSettings) {
                            // 没有勾选不再询问
                            // 弹出授权窗口
                            wx.requestSubscribeMessage({
                                tmplIds,
                                complete: e => {
                                    if (e.errMsg !== "requestSubscribeMessage:ok") {
                                        // 发生错误
                                        getApp().methods.handleError({
                                            err: e,
                                            title: "出错啦",
                                            content: e.errMsg
                                        })
                                    } else {
                                        handelSubscribeSettingItems(e)
                                    }
                                }
                            })
                        } else {
                            // 勾选了不再询问
                            // 判断配置的消息列表中是否有被拒绝的
                            // 存在被拒绝的则弹出提示
                            // 不存在被拒绝的则保存订阅记录
                            handelSubscribeSettingItems(res.subscriptionsSetting)
                        }
                    }
                }
            })

            // openSubscribeMainSwitchTips 提醒用户打开订阅消息开关
            let openSubscribeMainSwitchTips = e => {
                if (!e.subscriptionsSetting.mainSwitch) {
                    // 订阅消息总开关是关闭的
                    // 提示用户是否打开设置后打开开关
                    wx.showModal({
                        title: '提示',
                        content: '您关闭了发送订阅消息功能，是否前往开启？',
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    withSubscriptions: true,
                                    success: res => openSubscribeMainSwitchTips(res)
                                })
                            }
                        }
                    })
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '您成功开启了订阅消息功能，请再次点击订阅按钮完成订阅～',
                        showCancel: false,
                        confirmText: "我知道啦"
                    })
                }
            }

            // handelSubscribeSettingItems 检查订阅消息配置列表
            let handelSubscribeSettingItems = items => {
                let reject = false
                for (let i = 0; i < tmplIds.length; i++) {
                    if (items[tmplIds[i]] !== "accept") {
                        reject = true
                        break
                    }
                }
                if (reject) {
                    wx.showModal({
                        title: '订阅失败',
                        content: '获取订阅消息授权失败，可能是您设置了"拒绝并不再询问"？',
                        confirmText: "修改设置",
                        success(res) {
                            if (res.confirm) {
                                wx.openSetting({
                                    withSubscriptions: true,
                                    success: res => {
                                        console.log(res)
                                        if (typeof res.subscriptionsSetting.itemSettings !== "undefined") {
                                            // 有不再提示的记录，再次进行检查
                                            handelSubscribeSettingItems(res.subscriptionsSetting.itemSettings)
                                        } else {
                                            // 没有不再提示的记录
                                            // 提醒用户打开订阅消息开关
                                            openSubscribeMainSwitchTips(res)
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else {
                    // 订阅消息
                    wx.requestSubscribeMessage({ tmplIds })
                    // 保存订阅记录
                    wx.showLoading({ title: '订阅中...', mask: true }) // 弹出 Loading
                    // 判断是否存在订阅记录
                    wx.cloud.database().collection('subscribeExam').get().then(collectionGetRes => {
                        if (collectionGetRes.errMsg == 'collection.get:ok') {
                            // 查询成功
                            if (collectionGetRes.data.length === 0) {
                                // 没有预约记录, 新建预约记录
                                wx.cloud.database().collection('subscribeExam').add({
                                    data: { suffix, subscribe, tmplIds, createdTime: new Date(), updatedTime: new Date() }
                                }).then(collectionAddRes => {
                                    if (collectionAddRes.errMsg == 'collection.add:ok') {
                                        wx.showToast({ title: '订阅成功', icon: 'success' })
                                        if (typeof callback === "function") {
                                            callback()
                                        }
                                    } else {
                                        wx.hideLoading() // 隐藏 loading
                                        getApp().methods.handleError({ err: collectionAddRes, title: "出错啦", content: collectionAddRes.errMsg })
                                    }
                                }).catch(err => {
                                    wx.hideLoading() // 隐藏 loading
                                    getApp().methods.handleError({ err: err, title: "出错啦", content: "保存订阅记录失败" })
                                })
                            } else {
                                // 存在预约记录, 判断是否需要更新预约记录
                                if (collectionGetRes.data[0].suffix === suffix && collectionGetRes.data[0].subscribe.sort().toString() === new Array(subscribe).sort().toString() && collectionGetRes.data[0].tmplIds.sort().toString() === tmplIds.sort().toString()) {
                                    // 预约记录一致, 无需更新
                                    wx.showToast({ title: '订阅成功', icon: 'success' })
                                    if (typeof callback === "function") {
                                        callback()
                                    }
                                } else {
                                    // 预约记录不一致
                                    // 判断预约记录中是否有目标记录
                                    if (collectionGetRes.data[0].subscribe.length !== 0) {
                                        subscribe.forEach(item => {
                                            let has = false
                                            for (let i = 0; i < collectionGetRes.data[0].subscribe.length; i++) {
                                                if (collectionGetRes.data[0].subscribe[i] === item) {
                                                    has = true
                                                    break
                                                }
                                            }
                                            if (!has) {
                                                collectionGetRes.data[0].subscribe.push(item)
                                            }
                                        })
                                    } else {
                                        collectionGetRes.data[0].subscribe.push(subscribe)
                                    }
                                    wx.cloud.database().collection('subscribeExam').where({ _id: collectionGetRes.data[0]._id }).update({
                                        data: { suffix, subscribe: collectionGetRes.data[0].subscribe, tmplIds, updatedTime: new Date() }
                                    }).then(collectionUpdateRes => {
                                        if (collectionUpdateRes.errMsg == 'collection.update:ok') {
                                            wx.showToast({ title: '订阅成功', icon: 'success' })
                                            if (typeof callback === "function") {
                                                callback()
                                            }
                                        } else {
                                            wx.hideLoading() // 隐藏 loading
                                            getApp().methods.handleError({ err: collectionUpdateRes, title: "出错啦", content: collectionUpdateRes.errMsg })
                                        }
                                    }).catch(err => {
                                        wx.hideLoading() // 隐藏 loading
                                        getApp().methods.handleError({ err: err, title: "出错啦", content: "更新订阅记录失败" })
                                    })
                                }
                            }
                        } else {
                            wx.hideLoading() // 隐藏 loading
                            getApp().methods.handleError({ err: collectionGetRes, title: "出错啦", content: collectionGetRes.errMsg })
                        }
                    }).catch(err => {
                        wx.hideLoading() // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: "查询订阅记录失败" })
                    })
                }
            }
        },

        /**
         * 获取腾讯云签名
         * @param {*} host 服务域名
         * @param {*} payload 请求内容
         * @param {*} callback 回调函数
         */
        getTencentCloudSign(host, payload, callback) {
            getApp().methods.requsetWithCode({
                path: "/tencent-cloud/sign",
                data: { host, hashedRequestPayload: require('utils/sha256').sha256_digest(payload) },
                // 推送 crm 并返回数据
                callback: res => {
                    if (!res.success) {
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err: res, title: "出错啦", content: res.errorMessage ? res.errorMessage : '获取签名失败，请稍后再试', reLaunch: true })
                    } else {
                        // 调用回调函数, 返回签名信息
                        callback && callback({ authorizeToOpenid: res.data.authorizeToOpenid, timestamp: res.data.timestamp, authorization: res.data.authorization });
                    }
                }
            });
        },

        /**
           * SSOCheck 公共函数 SSO 检查登陆状态
           * @param {*} crmEventFormSID CRM 活动表单 SID
           * @param {*} suffix 后缀信息
           * @param {*} remark 备注
           * @param {*} callback 回调函数
           */
        SSOCheck({ crmEventFormSID, suffix, remark, callback }) {
            const timer = setInterval(() => {
                if (getApp().globalData.userLoaded) {
                    clearInterval(timer);
                    if (getApp().globalData.user.username) {
                        getApp().methods.push2crm({ phone: getApp().globalData.user.username, crmEventFormSID, suffix, remark });
                        callback && callback({ phone: getApp().globalData.user.username, openid: getApp().globalData.user.openId });
                    }
                }
            }, 50);
        },

        /**
           * loginCheck 公共函数 SSO 检查登陆状态 手动触发
           * @param {*} crmEventFormSID CRM 活动表单 SID
           * @param {*} suffix 后缀信息
           * @param {*} remark 备注
           * @param {*} callback 回调函数
           */
        SSOCheckManual({ crmEventFormSID, suffix, remark, callback }) {
            if (!getApp().globalData.user.username) {
                wx.navigateTo({
                    url: `/pages/appopen/user/register/index${suffix && suffix.suffixStr ? `?${suffix.suffixStr}` : ''}`,
                    events: {
                        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                        finishEvent: function (data) {
                            wx.navigateBack({
                                complete: () => {
                                    getApp().methods.push2crm({ phone: getApp().globalData.user.username, crmEventFormSID, suffix, remark });
                                    callback && callback({ phone: getApp().globalData.user.username, openid: getApp().globalData.user.openId });
                                }
                            });
                        }
                    },
                });
            } else {
                getApp().methods.push2crm({ phone: getApp().globalData.user.username, crmEventFormSID, suffix, remark });
                callback && callback({ phone: getApp().globalData.user.username, openid: getApp().globalData.user.openId });
            }
        },
    },
})
