// pages/announcement/simple.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        suffix: {}, // 推广后缀
        suffixStr: '', // 推广后缀字符串

        contactInformation: {}, // 联系方式

        openid: '', // 用户 openid
        phone: '', // 用户手机号码

        config: {}, // 配置

        actionSheet: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: async function (options) {
        if (typeof options.id !== 'string') {
            getApp().methods.handleError({ err: options, title: "出错啦", content: "缺少 id 参数", reLaunch: true });
            return;
        }
        const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
        this.setData(suffixInfo); // 保存后缀信息
        this.setData({ contactInformation: await getApp().methods.getContactInformation(suffixInfo) }); // 获取推广信息

        // 获取配置详情
        wx.showLoading({ title: '获取详情', mask: true })
        wx.request({
            url: `${getApp().globalData.configs.apis.base}/announcement/simple/config/info/${options.id}`,
            data: { appid: getApp().globalData.configs.appid },
            success: res => {
                wx.hideLoading(); // 隐藏 loading
                if (res.statusCode !== 200 || !res.data.success) {
                    getApp().methods.handleError({ err: res, title: "出错啦", content: res.data.errorMessage ? res.data.errorMessage : '获取配置详情失败，请稍后再试', reLaunch: true })
                } else {
                    const config = res.data.data;
                    config.abstract = config.abstract.split(/[(\r\n)\r\n]+/); // 使用换行符对 abstract 进行分割分段
                    this.setData({ config: { ...res.data.data, id: options.id } });
                    // 判断是否是单页模式
                    if (wx.getLaunchOptionsSync().scene !== 1154) {
                        // 不是单页模式，进行登陆操作
                        // 获取登陆状态
                        getApp().methods.SSOCheck({ crmEventFormSID: res.data.data.crmEventFormSid, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单SID:${res.data.data.crmEventFormSid}，简易加推，${res.data.data.name}，${options.id}，`, callback: ({ phone, openid }) => this.setData({ phone, openid }) });
                    }
                }
            },
            fail: err => {
                wx.hideLoading() // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '获取配置详情失败，请稍后再试', reLaunch: true })
            }
        });
    },

    // 跳转到广告
    goAdvertising: function () {
        switch (this.data.config.advertisementConfig.type) {
            case 'webview':
                // 跳转网页
                wx.navigateTo({ url: `../web-view/index?src=${this.data.config.advertisementConfig.link}${this.data.suffixStr ? this.data.config.advertisementConfig.link.indexOf('?') === -1 ? `?${this.data.suffixStr}` : `&${this.data.suffixStr}` : ''}` });
                break;
            case 'mini-program-self':
                // 跳转小程序（ 本小程序内 ）
                wx.navigateTo({ url: `${this.data.config.advertisementConfig.path.substr(0, 1) !== '/' ? '/' : ''}${this.data.config.advertisementConfig.path}${this.data.suffixStr ? this.data.config.advertisementConfig.path.indexOf('?') === -1 ? `?${this.data.suffixStr}` : `&${this.data.suffixStr}` : ''}` });
                break;
            case 'mini-program':
                // 跳转小程序（ 其他小程序 ）
                wx.navigateToMiniProgram({ appId: this.data.config.advertisementConfig.appid, path: `${this.data.config.advertisementConfig.path}${this.data.suffixStr ? this.data.config.advertisementConfig.path.indexOf('?') === -1 ? `?${this.data.suffixStr}` : `&${this.data.suffixStr}` : ''}` });
                break;
            case 'channel-activity':
                // 视频号 - 打开视频
                wx.openChannelsActivity({ finderUserName: this.data.config.advertisementConfig.finderUserName, feedId: this.data.config.advertisementConfig.feedId });
                break;
            case 'channel-reserve-live':
                // 视频号 - 预约直播
                wx.getChannelsLiveNoticeInfo({
                    finderUserName: this.data.config.advertisementConfig.finderUserName,
                    success: res => {
                        if (res.errMsg === 'getChannelsLiveNoticeInfo:ok') {
                            wx.reserveChannelsLive({noticeId: res.noticeId});
                        } else {
                            getApp().methods.handleError({ err: res, title: "出错啦", content: `暂无直播预告 [${res.errMsg}]` });
                        }
                    },
                    fail: err => {
                        getApp().methods.handleError({ err, title: "出错啦", content: `暂无直播预告 [${err.errMsg}]` });
                    }
                });
                break;
            case 'channel-live':
                // 视频号 - 跳转直播间
                wx.openChannelsLive({ finderUserName: this.data.config.advertisementConfig.finderUserName });
                break;
            default:
                wx.showToast({ title: '活动配置有误', icon: 'error' });
        }
    },

    // 登陆后跳转到广告
    goAdvertisingAfterLogin: function (event) {
        getApp().methods.login({
            event, crmEventFormSID: this.data.config.crmEventFormSid, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单SID:${this.data.config.crmEventFormSid}，简易加推，${this.data.config.name}，${this.data.config.id}，`, callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                this.goAdvertising();
            }
        });
    },

    // 查看原文
    view: function () {
        wx.navigateTo({ url: `../web-view/index?src=${this.data.config.originalLink}${this.data.suffixStr ? this.data.config.advertisementConfig.link.indexOf('?') === -1 ? `?${this.data.suffixStr}` : `&${this.data.suffixStr}` : ''}` });
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({ crmEventFormSID: this.data.config.crmEventFormSid, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单SID:${this.data.config.crmEventFormSid}，简易加推，${this.data.config.name}，${this.data.config.id}，`, callback: ({ phone, openid }) => {
                this.setData({ phone, openid })
                this.view();
            }
        });
    },

    // 转发
    // 弹出转发菜单
    showActionSheet: function () {
        this.setData({ actionSheet: true });
    },

    // 转发
    // 隐藏转发菜单
    hideActionSheet: function () {
        this.setData({ actionSheet: false });
    },

    // 生成海报
    makePoster: async function () {
        const _this = this;
        const context = wx.createCanvasContext('mycanvas');
        wx.showLoading({ title: '正在生成' })

        // 下载海报背景
        wx.getImageInfo({
            src: 'https://appopenoss.offcn.com/prod/mini-program/announcement/poster-background.jpg',
            success: function (res) {
                // 绘制海报背景
                context.drawImage(res.path, 0, 0, res.width, res.height);

                // 绘制名称
                context.setFontSize(70);
                context.setTextAlign('left');
                context.setTextBaseline('top');
                const fullName = _this.data.config.name.split('');
                let tempName = '';
                const nameArr = [];
                for (let i = 0; i < fullName.length; i += 1) {
                    if (context.measureText(tempName).width < 760) {
                        tempName += fullName[i];
                    } else {
                        i--;
                        nameArr.push(tempName);
                        tempName = '';
                    }
                }
                nameArr.push(tempName);
                for (let i = 0, y = 200; i < nameArr.length; i += 1) {
                    context.fillText(nameArr[i], 135, y);
                    y += 90;
                }

                // 加载分割线图片
                wx.getImageInfo({
                    src: 'https://appopenoss.offcn.com/prod/mini-program/announcement/poster-split-line.png',
                    success: function (res) {
                        // 绘制分割线
                        context.drawImage(res.path, 93, 341 + 70 * nameArr.length, 901, 27);
                        // 绘制内容
                        context.setFontSize(45);
                        const abstract = _this.data.config.abstract;
                        const abstractArr = [];
                        for (let i = 0; i < abstract.length; i += 1) {
                            let nowAbstract = `　　${abstract[i]}`;
                            let tempAbstract = '';
                            for (let j = 0; j < nowAbstract.length; j += 1) {
                                if (context.measureText(tempAbstract).width < 760) {
                                    tempAbstract += nowAbstract[j];
                                } else {
                                    j--;
                                    abstractArr.push(tempAbstract);
                                    tempAbstract = '';
                                }
                            }
                            abstractArr.push(tempAbstract);
                        }
                        for (let i = 0, y = 341 + 70 * nameArr.length + 60; i < abstractArr.length; i += 1) {
                            context.fillText(abstractArr[i], 135, y);
                            y += 70;
                            if (y > 1500) {
                                context.fillText('·····', 480, y);
                                break;
                            }
                        }

                        // 生成小程序码
                        let url = `https://appopen.offcn.com/wechat/mini-program/handler/?appid=${getApp().globalData.configs.appid}&username=${getApp().globalData.configs.username}&path=pages/announcement/simple&id=${_this.data.config.id}${_this.data.suffixStr ? `&${_this.data.suffixStr}` : ''}`;
                        const QR = require('../../utils/weapp-qrcode.js');
                        var imgData = QR.drawImg(url, {
                            version: 1,
                            errorCorrectLevel: 'M',
                            color: '#af1417', // 支持#000,#000000 或者 rgb(0,0,0)
                            background: '#fff', // 支持#000,#000000 或者 rgb(0,0,0)
                            padding: 0, // 设置padding 为二维码方格的个数 ( 边框 )
                            size: 230
                        })
                        // 将 BASE64编码的 图片保存到临时文件 用于绘制到 Canvas
                        const fs = wx.getFileSystemManager();
                        const filePath = `${wx.env.USER_DATA_PATH}/announcement-pic-${Date.now()}.gif`;
                        fs.writeFile({
                            filePath: filePath,
                            data: wx.base64ToArrayBuffer(imgData.substring(imgData.indexOf(',') + 1)),
                            encoding: "binary",
                            success: function () {
                                // 绘制二维码
                                context.drawImage(filePath, 420, 1600, 230, 230);
                                // 结束绘制
                                context.draw(false, function () {
                                    // 删除临时文件
                                    setTimeout(() => { fs.unlinkSync(filePath) }, 1e3);
                                    // 将 cavas 保存到 临时文件
                                    wx.canvasToTempFilePath({
                                        canvasId: 'mycanvas',
                                        success: function (res) {
                                            // 关闭操作框和 loading
                                            _this.setData({ actionSheet: false });
                                            wx.hideLoading();
                                            // 弹出分享图片窗口
                                            wx.showShareImageMenu({ path: res.tempFilePath });
                                        },
                                        fail: err => {
                                            wx.hideLoading(); // 隐藏 loading
                                            getApp().methods.handleError({ err: err, title: "出错啦", content: '生成海报失败，请稍后再试' });
                                        }
                                    });
                                });
                            },
                            fail: function (err) {
                                // 判断错误类型
                                if (err.errMsg === 'writeFile:fail the maximum size of the file storage limit is exceeded') {
                                    // 错误类型是临时文件大小超过限制
                                    // 进行清理操作
                                    const fs = wx.getFileSystemManager();
                                    fs.readdir({
                                        dirPath: wx.env.USER_DATA_PATH,
                                        success: res => {
                                            res.files.forEach(value => {
                                                try {
                                                    // 清理掉临时文件
                                                    if (value.indexOf('announcement') !== -1) fs.unlinkSync(`${wx.env.USER_DATA_PATH}/${value}`);
                                                } catch (err) {
                                                    console.error(err);
                                                }
                                            })
                                        }
                                    })
                                }
                                wx.hideLoading(); // 隐藏 loading
                                getApp().methods.handleError({ err: err, title: "出错啦", content: "生成海报出错, 请稍后再试" });
                            }
                        });
                    },
                    fail: err => {
                        wx.hideLoading(); // 隐藏 loading
                        getApp().methods.handleError({ err: err, title: "出错啦", content: '生成海报失败，请稍后再试' });
                    }
                });
            },
            fail: err => {
                wx.hideLoading(); // 隐藏 loading
                getApp().methods.handleError({ err: err, title: "出错啦", content: '生成海报失败，请稍后再试' });
            }
        });
    },

    // makePhoneCall 打电话
    makePhoneCall: function () {
        wx.makePhoneCall({
            phoneNumber: this.data.contactInformation.ConsultationPhone
        })
    },

    // gotoOnlineConsulting 打开在线咨询
    gotoOnlineConsulting: function () {
        wx.navigateTo({ url: `/pages/sobot/auto${this.data.suffixStr ? `?${this.data.suffixStr}` : ''}` });
    },
    
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: this.data.config.name,
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: this.data.config.name,
        }
    }
})