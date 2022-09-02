//app.js
App({
    onLaunch: function () {
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
         * @param {Object} path 请求路径
         * @param {String} method 请求方法
         * @param {Object} data 请求要提交的数据 按照 method 自动适应
         * @param {Object} queryData 请求 method = post 时, 需额外附加的 query data, 将会自动拼接到 query string 中
         * @param {Function} callback 回调函数
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
         * getSuffix 公共函数 获取后缀信息
         * @param {Object} options 页面 onLoad 函数的 options 参数
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

        /**
         * getContactInformation 获取推广信息
         * @param {Object} suffixInfo 后缀信息 格式为 { suffix: {}, suffixStr: ''}
         */
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

        /**
         * push2crm 推送数据到 crm
         * @param {Object} param0 参数对象 格式为 { phone: '', crmEventFormSID: '', suffix: {}, remark: '' }
         * @param0 {String} phone 手机号码
         * @param0 {String} crmEventFormSID CRM 活动表单 SID
         * @param0 {Object} suffix 后缀信息
         * @param0 {String} remark 备注
         */
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
         * @param {Object} param0 参数对象 格式为 { crmEventFormSID: '', suffix: {}, remark: '', callback: ()=> {} }
         * @param0 {String} crmEventFormSID CRM 活动表单 SID
         * @param0 {String} suffix 后缀信息
         * @param0 {Object} remark 备注
         * @param0 {String} callback 回调函数
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
         * @param {Object} param0 参数对象 格式为 { event: {}, crmEventFormSID: '', suffix: {}, remark: '', callback: ()=> {} }
         * @param0 {Object} event 按钮点击事件
         * @param0 {String} crmEventFormSID CRM 活动表单 SID
         * @param0 {Object} suffix 后缀信息
         * @param0 {String} remark 备注
         * @param0 {Function} callback 回调函数
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
         * 订阅单项考试的考试公告
         * @param {Object} suffix 个人后缀
         * @param {String} subscribe 要订阅的考试项目
         * @param {Array} tmplIds 订阅消息模板 ID
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
                    // 直接尝试注册用户
                    wx.request({
                        url: 'https://zg99.offcn.com/index/chaxun/register',
                        data: {
                            sstime: new Date().valueOf(),
                            actid: 50751,
                            isagree: true,
                            phone: getApp().globalData.user.info.phone,
                            openID: getApp().globalData.user.openId,
                            suffix: typeof suffix === 'object' ? JSON.stringify(suffix) : '{}',
                            tmplID: typeof tmplIds === 'object' ? JSON.stringify(tmplIds) : '[]',
                            subscribe: typeof subscribe === 'string' ? JSON.stringify(new Array(subscribe)) : '[]',
                        },
                        success: (res) => {
                            let response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾, 转为 JSON 对象
                            if (response.status === 1) {
                                // 注册成功 不存在订阅记录
                                wx.showToast({ title: '订阅成功', icon: 'success' });
                                if (typeof callback === "function") {
                                    callback();
                                }
                            } else {
                                // 注册失败 已存在订阅记录 查询已保存的订阅记录
                                wx.request({
                                    url: 'https://zg99.offcn.com/index/chaxun/getuserlist',
                                    data: {
                                        sstime: new Date().valueOf(),
                                        actid: 50751,
                                        phone: getApp().globalData.user.info.phone,
                                        openID: getApp().globalData.user.openId,
                                    },
                                    success: (res) => {
                                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾, 转为 JSON 对象
                                        if (response.status !== 1) { // 如果 status 不等于1，弹出错误提示
                                            // 失败 弹出错误提示
                                            wx.hideLoading() // 隐藏 loading
                                            getApp().methods.handleError({ err: response, title: "出错啦", content: response.msg })
                                        } else {
                                            // 存在预约记录, 判断是否需要更新预约记录
                                            if (response.lists[0].suffix === (typeof suffix === 'object' ? JSON.stringify(suffix) : '{}') && response.lists[0].subscribe === (typeof subscribe === 'string' ? JSON.stringify(new Array(subscribe)) : '[]') && response.lists[0].tmplID === (typeof tmplIds === 'object' ? JSON.stringify(tmplIds) : '[]')) {
                                                // 预约记录一致, 无需更新
                                                wx.showToast({ title: '订阅成功', icon: 'success' })
                                                if (typeof callback === "function") {
                                                    callback()
                                                }
                                            } else {
                                                // 预约记录不一致
                                                // 判断预约记录中是否有目标记录
                                                let currentSubscribe = [];
                                                if (response.lists[0].subscribe !== '[]') {
                                                    currentSubscribe = JSON.parse(response.lists[0].subscribe);
                                                    let has = false
                                                    for (let i = 0; i < currentSubscribe.length; i++) {
                                                        if (currentSubscribe[i] === subscribe) {
                                                            has = true
                                                            break
                                                        }
                                                    }
                                                    if (!has) {
                                                        currentSubscribe.push(subscribe)
                                                    }
                                                } else {
                                                    currentSubscribe.push(subscribe);
                                                }
                                                // 进行订阅记录更新操作
                                                wx.request({
                                                    url: 'https://zg99.offcn.com/index/chaxun/updateuser',
                                                    data: {
                                                        sstime: new Date().valueOf(),
                                                        actid: 50751,
                                                        phone: getApp().globalData.user.info.phone,
                                                        suffix: typeof suffix === 'object' ? JSON.stringify(suffix) : '{}',
                                                        tmplID: typeof tmplIds === 'object' ? JSON.stringify(tmplIds) : '[]',
                                                        subscribe: JSON.stringify(currentSubscribe),
                                                    },
                                                    success: (res) => {
                                                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾, 转为 JSON 对象
                                                        if (response.status !== 1) { // 如果 status 不等于1，弹出错误提示
                                                            // 失败 弹出错误提示
                                                            wx.hideLoading() // 隐藏 loading
                                                            getApp().methods.handleError({ err: response, title: "出错啦", content: response.msg })
                                                        } else {
                                                            wx.showToast({ title: '订阅成功', icon: 'success' })
                                                            if (typeof callback === "function") {
                                                                callback()
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        },

        /**
         * 订阅所有考试的考试公告
         * @param {Object} suffix 个人后缀
         * @param {Array} tmplIds 订阅消息模板 ID
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
                    // 直接尝试注册用户
                    wx.request({
                        url: 'https://zg99.offcn.com/index/chaxun/register',
                        data: {
                            sstime: new Date().valueOf(),
                            actid: 50751,
                            isagree: true,
                            phone: getApp().globalData.user.info.phone,
                            openID: getApp().globalData.user.openId,
                            suffix: typeof suffix === 'object' ? JSON.stringify(suffix) : '{}',
                            tmplID: typeof tmplIds === 'object' ? JSON.stringify(tmplIds) : '[]',
                            subscribe: JSON.stringify([
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
                            ]),
                        },
                        success: (res) => {
                            let response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾, 转为 JSON 对象
                            if (response.status === 1) {
                                // 注册成功 不存在订阅记录
                                wx.showToast({ title: '订阅成功', icon: 'success' });
                                if (typeof callback === "function") {
                                    callback();
                                }
                            } else {
                                // 注册失败 已存在订阅记录 直接更新预约记录
                                wx.request({
                                    url: 'https://zg99.offcn.com/index/chaxun/updateuser',
                                    data: {
                                        sstime: new Date().valueOf(),
                                        actid: 50751,
                                        phone: getApp().globalData.user.info.phone,
                                        suffix: typeof suffix === 'object' ? JSON.stringify(suffix) : '{}',
                                        tmplID: typeof tmplIds === 'object' ? JSON.stringify(tmplIds) : '[]',
                                        subscribe: JSON.stringify([
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
                                        ]),
                                    },
                                    success: (res) => {
                                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾, 转为 JSON 对象
                                        if (response.status !== 1) { // 如果 status 不等于1，弹出错误提示
                                            // 失败 弹出错误提示
                                            wx.hideLoading() // 隐藏 loading
                                            getApp().methods.handleError({ err: response, title: "出错啦", content: response.msg })
                                        } else {
                                            wx.showToast({ title: '订阅成功', icon: 'success' })
                                            if (typeof callback === "function") {
                                                callback()
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        },

        /**
         * 订阅考试公告
         * @param {Object} suffix 个人后缀
         * @param {Array} subscribe 要订阅的考试项目
         * @param {Object} tmplIds 订阅消息模板 ID
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
                    
                    // 直接尝试注册用户
                    wx.request({
                        url: 'https://zg99.offcn.com/index/chaxun/register',
                        data: {
                            sstime: new Date().valueOf(),
                            actid: 50751,
                            isagree: true,
                            phone: getApp().globalData.user.info.phone,
                            openID: getApp().globalData.user.openId,
                            suffix: typeof suffix === 'object' ? JSON.stringify(suffix) : '{}',
                            tmplID: typeof tmplIds === 'object' ? JSON.stringify(tmplIds) : '[]',
                            subscribe: typeof subscribe === 'string' ? JSON.stringify(subscribe) : '[]',
                        },
                        success: (res) => {
                            let response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾, 转为 JSON 对象
                            if (response.status === 1) {
                                // 注册成功 不存在订阅记录
                                wx.showToast({ title: '订阅成功', icon: 'success' });
                                if (typeof callback === "function") {
                                    callback();
                                }
                            } else {
                                // 注册失败 已存在订阅记录 查询已保存的订阅记录
                                wx.request({
                                    url: 'https://zg99.offcn.com/index/chaxun/getuserlist',
                                    data: {
                                        sstime: new Date().valueOf(),
                                        actid: 50751,
                                        phone: getApp().globalData.user.info.phone,
                                        openID: getApp().globalData.user.openId,
                                    },
                                    success: (res) => {
                                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾, 转为 JSON 对象
                                        if (response.status !== 1) { // 如果 status 不等于1，弹出错误提示
                                            // 失败 弹出错误提示
                                            wx.hideLoading() // 隐藏 loading
                                            getApp().methods.handleError({ err: response, title: "出错啦", content: response.msg })
                                        } else {
                                            // 存在预约记录, 判断是否需要更新预约记录
                                            if (response.lists[0].suffix === (typeof suffix === 'object' ? JSON.stringify(suffix) : '{}') && response.lists[0].subscribe === (typeof subscribe === 'string' ? JSON.stringify(new Array(subscribe)) : '[]') && response.lists[0].tmplID === (typeof tmplIds === 'object' ? JSON.stringify(tmplIds) : '[]')) {
                                                // 预约记录一致, 无需更新
                                                wx.showToast({ title: '订阅成功', icon: 'success' })
                                                if (typeof callback === "function") {
                                                    callback()
                                                }
                                            } else {
                                                // 预约记录不一致
                                                // 判断预约记录中是否有目标记录
                                                let currentSubscribe = [];
                                                if (response.lists[0].subscribe !== '[]') {
                                                    currentSubscribe = JSON.parse(response.lists[0].subscribe);
                                                    subscribe.forEach(item => {
                                                        let has = false
                                                        for (let i = 0; i < currentSubscribe.length; i++) {
                                                            if (currentSubscribe[i] === item) {
                                                                has = true
                                                                break
                                                            }
                                                        }
                                                        if (!has) {
                                                            currentSubscribe.push(item)
                                                        }
                                                    })
                                                } else {
                                                    currentSubscribe.push(subscribe);
                                                }
                                                // 进行订阅记录更新操作
                                                wx.request({
                                                    url: 'https://zg99.offcn.com/index/chaxun/updateuser',
                                                    data: {
                                                        sstime: new Date().valueOf(),
                                                        actid: 50751,
                                                        phone: getApp().globalData.user.info.phone,
                                                        suffix: typeof suffix === 'object' ? JSON.stringify(suffix) : '{}',
                                                        tmplID: typeof tmplIds === 'object' ? JSON.stringify(tmplIds) : '[]',
                                                        subscribe: JSON.stringify(currentSubscribe),
                                                    },
                                                    success: (res) => {
                                                        let response = JSON.parse(res.data.substring(1, res.data.length - 1)) // 去头尾, 转为 JSON 对象
                                                        if (response.status !== 1) { // 如果 status 不等于1，弹出错误提示
                                                            // 失败 弹出错误提示
                                                            wx.hideLoading() // 隐藏 loading
                                                            getApp().methods.handleError({ err: response, title: "出错啦", content: response.msg })
                                                        } else {
                                                            wx.showToast({ title: '订阅成功', icon: 'success' })
                                                            if (typeof callback === "function") {
                                                                callback()
                                                            }
                                                        }
                                                    }
                                                })
                                            }
                                        }
                                    }
                                })
                            }
                        }
                    })
                }
            }
        },

        /**
         * 获取腾讯云签名
         * @param {String} host 服务域名
         * @param {Blob} payload 请求内容
         * @param {Function} callback 回调函数
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
           * @param {Object} param0 参数对象 格式为 { crmEventFormSID: '', suffix: {}, remark: '', callback: ()=> {} }
           * @param0 {String} crmEventFormSID CRM 活动表单 SID
           * @param0 {Object} suffix 后缀信息
           * @param0 {String} remark 备注
           * @param0 {Function} callback 回调函数
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
           * @param {Object} param0 参数对象 格式为 { crmEventFormSID: '', suffix: {}, remark: '', callback: ()=> {} }
           * @param0 {String} crmEventFormSID CRM 活动表单 SID
           * @param0 {Object} suffix 后缀信息
           * @param0 {String} remark 备注
           * @param0 {Function} callback 回调函数
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
