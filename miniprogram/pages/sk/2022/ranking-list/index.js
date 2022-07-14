const app = getApp()

Page({
    /**
     * 页面的初始数据
     */
    data: {
        CRMEFSID: "f577517a0eacf2704fa03e9e59cfbe8e", // CRM 活动表单 ID
        CRMRemark: "活动编码:HD202207140249,活动表单ID:136242", // CRM 注释 小程序-2022吉林省考面试晒分系统

        phone: '', // 用户手机号码
        openid: '',  // 用户 openid

        suffix: {}, // 后缀
        suffixStr: '', // 后缀 字符串

        Step: 0, // 当前步骤 0, 欢迎页
        NowYear: 2022, // 接口参数 当前年份
        SearchArea: [], // 检索选项 地区
        SearchAreaIndex: -1, // 检索选项 地区 被选中的选项下标
        SearchDepartmentAttribute: [], // 检索选项 部门属性
        SearchDepartmentAttributeIndex: -1, // 检索选项 部门属性 被选中的选项下标
        SearchDepartmentName: "", // 检索选项 部门名称
        SearchPositionName: "", // 检索选项 职位名称
        SearchData: {}, // 检索条件 对象 点击检索按钮后缓存 用于后续上拉刷新使用 避免切换条件后上拉刷新造成数据不一致的问题
        PositionData: {}, // 职位列表数据
        DetailData: {}, // 预约详情数据
        XCScore: 0, // 用户输入的晒分成绩
        SLScore: 0, // 用户输入的晒分成绩
        GAScore: 0, // 用户输入的晒分成绩
        Score: 0, // 用户输入的晒分成绩
        SinglePageMode: false, // 单页模式打开
        ADClass: "", // 19课堂课程ID 
        ADPictureURL: "", // 广告图 
        OpenCalculator: false, // 计算器 是否打开
        CalculatorMyScore: -1, // 计算器 我的分数
        CalculatorOtherScore: -1, // 计算器 对方分数
        CalculatorScore: -1, // 计算器 需追分差
    },

    /**
     * 按钮 开始使用
     */
    buttonStart: function () {
        let that = this
        wx.showModal({
            title: "提示",
            content: "本系统中所显示的排行榜、成绩信息、晒分人数及竞争比等数据仅代表使用本系统进行晒分的考生情况，内容仅供参考。",
            confirmText: "我了解",
            showCancel: false,
            success(res) {
                if (res.confirm) {
                    // 弹出 Loading
                    wx.showLoading({ title: '加载中...', mask: true });
                    // 获取检索条件
                    wx.request({
                        url: 'https://app.offcn.com/zwsk/wechat/zhiwei/index',
                        data: {
                            zwcode: "jl",
                            zwyear: that.data.NowYear,
                            sign: "b4a8b2f7z4d3n6o0hs",
                        },
                        success: (res) => {
                            if (res.statusCode === 200) {
                                // 判断是否取回数据
                                if (res.data.msg) {
                                    wx.hideLoading(); // 隐藏 loading
                                    app.methods.handleError({
                                        err: res,
                                        title: "出错啦",
                                        content: res.data.msg
                                    })
                                    return
                                }
                                // 解码检索条件
                                // 部门属性 
                                let departmentAttribute = []
                                for (let key in res.data.zwtjarr) {
                                    if (res.data.zwtjarr[key].name[0] === "xitong") {
                                        departmentAttribute = res.data.zwtjarr[key].xiala[0]
                                    }
                                }
                                // 配置检索条件并切换页面
                                that.setData({
                                    Step: 1,
                                    SearchArea: Object.keys(res.data.areaarr),
                                    SearchDepartmentAttribute: departmentAttribute
                                })
                                // 切换导航栏
                                wx.setNavigationBarColor({
                                    frontColor: '#000000',
                                    backgroundColor: '#ffffff',
                                    animation: {
                                        duration: 400,
                                        timingFunc: 'easeIn'
                                    }
                                })
                                wx.hideLoading(); // 隐藏 loading
                            } else {
                                app.methods.handleError({
                                    err: res,
                                    title: "出错啦",
                                    content: "获取检索条件失败, 请您稍后再试"
                                })
                            }
                        }
                    })
                }
            }
        })
    },

    /**
     * 监听 地区
     */
    bindSearchAreaPickerChange: function (e) {
        this.setData({
            SearchAreaIndex: e.detail.value
        })
    },

    /**
     * 监听 部门属性
     */
    bindSearchDepartmentAttributePickerChange: function (e) {
        this.setData({
            SearchDepartmentAttributeIndex: e.detail.value
        })
    },

    /**
     * 监听 部门名称
     */
    bindSearchDepartmentNameInput: function (e) {
        this.setData({
            SearchDepartmentName: e.detail.value
        })
    },

    /**
     * 监听 职位名称
     */
    bindSearchPositionNameInput: function (e) {
        this.setData({
            SearchPositionName: e.detail.value
        })
    },


    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                // 调用检索功能
                this.buttonSearchStart()
            }
        });
    },

    /**
     * 按钮 职位检索 检索
     */
    buttonSearchStart: function () {
        // 弹出 Loading
        wx.showLoading({ title: '加载中...', mask: true });
        // 检索职位
        wx.request({
            url: 'https://app.offcn.com/zwsk/wechat/zhiwei/search',
            data: {
                zwcode: "jl",
                zwyear: this.data.NowYear,
                areaname: this.data.SearchAreaIndex === -1 ? "" : this.data.SearchArea[this.data.SearchAreaIndex],
                xitong: this.data.SearchDepartmentAttributeIndex === -1 ? "" : this.data.SearchDepartmentAttribute[this.data.SearchDepartmentAttributeIndex],
                danwei_name: this.data.SearchDepartmentName,
                zhiwei_name: this.data.SearchPositionName,
                sign: "b4a8b2f7z4d3n6o0hs",
            },
            success: (res) => {
                wx.hideLoading(); // 隐藏 loading
                // 判断是否取回数据
                if (res.data.msg) {
                    app.methods.handleError({
                        err: res,
                        title: "出错啦",
                        content: res.data.msg
                    })
                    return
                }
                // 缓存搜索条件 用于后续上拉刷新使用 避免切换条件后上拉刷新造成数据不一致的问题
                this.setData({
                    SearchData: {
                        zwcode: "jl",
                        zwyear: this.data.NowYear,
                        areaname: this.data.SearchAreaIndex === -1 ? "" : this.data.SearchArea[this.data.SearchAreaIndex],
                        xitong: this.data.SearchDepartmentAttributeIndex === -1 ? "" : this.data.SearchDepartmentAttribute[this.data.SearchDepartmentAttributeIndex],
                        danwei_name: this.data.SearchDepartmentName,
                        zhiwei_name: this.data.SearchPositionName
                    }
                })
                if (res.statusCode === 200) {
                    this.setData({
                        PositionData: res.data
                    })
                } else {
                    app.methods.handleError({
                        err: res,
                        title: "出错啦",
                        content: "检索失败, 请您稍后再试"
                    })
                }
            }
        })
    },

    /**
     * 监听 页面滚动
     * 当滚动出一定距离后 显示回到顶部按钮
     */
    onPageScroll: function (e) {
        this.setData({
            backTopValue: e.scrollTop > 500 ? true : false
        })
    },

    /**
     * 滚动到顶部
     * https://www.cnblogs.com/wesky/p/9067069.html
     */
    backTop: function () {
        // 控制滚动
        wx.pageScrollTo({
            scrollTop: 0
        })
    },

    /**
     * 监听 显示详情
     */
    bindShowDetailTap: async function (e) {
        // 弹出 Loading
        wx.showLoading({
            title: '努力加载中...',
            mask: true
        })

        const db = wx.cloud.database()

        // 获取当前用户已经晒分的岗位
        let myScore = await db.collection("RankingListScore2022SK").where({
            Phone: this.data.phone
        }).get()
        if (myScore.errMsg !== "collection.get:ok") {
            app.methods.handleError({
                err: myScore.errMsg,
                title: "出错啦",
                content: "查询出错, 请您稍后再试～ (" + myScore.errMsg + ")"
            })
            wx.hideLoading() // 隐藏 loading
            return
        }

        if (myScore.data.length !== 0) {
            // 如果已经晒分，则获取当前岗位的晒分详情
            this.setData({
                "DetailData.Score.My": { // 报名数据
                    Department: myScore.data[myScore.data.length - 1].Department,
                    Position: myScore.data[myScore.data.length - 1].Position,
                    Score: myScore.data[myScore.data.length - 1].Score,
                },
            })
            await this.getDetail(this.data.PositionData.lists[e.currentTarget.dataset.index].danwei_code, this.data.PositionData.lists[e.currentTarget.dataset.index].zhiwei_code);
        } else {
            // 如果没有晒分，则设置本人成绩信息为空
            this.setData({
                "DetailData.Score.My": null,
            })
        }

        this.setData({
            "DetailData.Position": this.data.PositionData.lists[e.currentTarget.dataset.index] // 职位详情 同时作为前台的加载完成标志使用
        })

        wx.hideLoading() // 隐藏 loading
    },

    /**
     * 辅助函数 获取晒分详情
     */
    getDetail: async function (department, position) {
        console.log(department)
        const db = wx.cloud.database()

        // 获取当前用户已经晒分的岗位
        let listData = await db.collection("RankingListScore2022SK").where({
            Department: department,
            Position: position
        }).orderBy('Score', 'desc').get()
        if (listData.errMsg !== "collection.get:ok") {
            app.methods.handleError({
                err: myScore.errMsg,
                title: "出错啦",
                content: "查询出错, 请您稍后再试～ (" + listData.errMsg + ")"
            })
            return
        }

        if (listData.data.length !== 0) {
            // 获取到列表
            let max = 0; // 将最高分设置为成绩的地板值, 用于后续计算
            let min = 300; // 将最低分设置为成绩的封顶值, 用于后续计算
            let sum = 0;
            // 遍历成绩
            listData.data.forEach(item => {
                // 删除无用的字段
                delete item.Department;
                delete item.Position;
                delete item._id;
                delete item._openid;
                // 设置是否为本人的标志
                if (item.Phone == this.data.phone) {
                    item.Self = true
                } else {
                    item.Self = false
                }
                // 隐藏手机号中间四位
                let reg = /^(\d{3})\d{4}(\d{4})$/;
                item.Phone = item.Phone.replace(reg, "$1****$2");
                // 计算总分
                sum += item.Score;
                // 计算最高分
                if (item.Score > max) {
                    max = item.Score
                }
                // 计算最低分
                if (item.Score < min) {
                    min = item.Score
                }
            })
            this.setData({
                "DetailData.Score.Max": max,
                "DetailData.Score.Avg": sum / listData.data.length,
                "DetailData.Score.Min": min,
                "DetailData.Score.List": listData.data,
            })
        } else {
            // 获取到列表
            this.setData({
                "DetailData.Score.Max": "-",
                "DetailData.Score.Avg": "-",
                "DetailData.Score.Min": "-",
                "DetailData.Score.List": [],
            })
        }
    },

    /**
     * 监听 隐藏详情
     */
    bindHideDetailCloseTap: function () {
        this.setData({
            DetailData: {},
            XCScore: 0,
            SLScore: 0,
            GAScore: 0,
            Score: 0,
        })
    },

    /**
     * 监听 输入成绩 行测
     */
    bindXCScoreInput: function (e) {
        if (isNaN(Number(e.detail.value))) {
            this.setData({
                XCScore: 999
            })
        } else {
            this.setData({
                XCScore: Number(e.detail.value),
                Score: Number(e.detail.value) + this.data.SLScore + this.data.GAScore
            })
        }
    },

    /**
     * 监听 输入成绩 申论
     */
    bindSLScoreInput: function (e) {
        if (isNaN(Number(e.detail.value))) {
            this.setData({
                SLScore: 999
            })
        } else {
            this.setData({
                SLScore: Number(e.detail.value),
                Score: this.data.XCScore + Number(e.detail.value) + this.data.GAScore
            })
        }
    },

    /**
     * 监听 输入成绩 公安
     */
    bindGAScoreInput: function (e) {
        if (isNaN(Number(e.detail.value))) {
            this.setData({
                GAScore: 999
            })
        } else {
            this.setData({
                GAScore: Number(e.detail.value),
                Score: this.data.XCScore + this.data.SLScore + Number(e.detail.value)
            })
        }
    },

    /**
     * 监听 按钮 晒分
     */
    buttonPostRank: function () {
        // 判断成绩是否合规
        if (this.data.XCScore === "" || this.data.XCScore === 0) {
            app.methods.handleError({
                err: null,
                title: "出错啦",
                content: "请填写行测成绩！"
            })
            return
        }
        if (this.data.SLScore === "" || this.data.SLScore === 0) {
            app.methods.handleError({
                err: null,
                title: "出错啦",
                content: "请填写申论成绩！"
            })
            return
        }
        if (this.data.Score > 300) {
            app.methods.handleError({
                err: null,
                title: "出错啦",
                content: "总成绩应当小于 300 分!"
            })
            return
        }

        // 判断是否已经报名过其他职位
        if (this.data.DetailData.Score.My !== null) {
            // 已经进行过晒分操作, 判断晒分记录中的岗位是否未本岗位
            if (this.data.DetailData.Score.My.Department === this.data.DetailData.Position.danwei_code && this.data.DetailData.Score.My.Position === this.data.DetailData.Position.zhiwei_code) {
                wx.showModal({
                    title: "提示",
                    content: "您已经提交过本岗位的晒分记录!",
                    confirmText: "我知道了",
                    showCancel: false
                })
            } else {
                let that = this
                wx.showModal({
                    title: "提示",
                    content: "您已经于部门 " + this.data.DetailData.Score.My.Department + " ( 部门代码 ) 的职位 " + this.data.DetailData.Score.My.Position + " ( 职位代码 ) 进行过晒分, 确认要修改为 " + this.data.DetailData.Position.danwei_code + " ( 部门代码 ) 的职位 " + this.data.DetailData.Position.zhiwei_code + " ( 职位代码 )吗？",
                    confirmText: "修改",
                    success(res) {
                        if (res.confirm) {
                            that.postRank()
                            // 更新晒分信息
                            setTimeout(async () => {
                                // 弹出 Loading
                                wx.showLoading({
                                    title: '更新晒分情况...',
                                    mask: true
                                })
                                await that.getDetail(that.data.DetailData.Position.danwei_code, that.data.DetailData.Position.zhiwei_code)
                                that.setData({
                                    "DetailData.Score.My": { // 报名数据
                                        Department: that.data.DetailData.Position.danwei_code,
                                        Position: that.data.DetailData.Position.zhiwei_code,
                                        Score: that.data.Score,
                                    },
                                })
                                wx.hideLoading() // 隐藏 loading
                            }, 1000)
                        }
                    }
                })
            }
        } else {
            // 未进行过晒分, 直接提交晒分信息
            this.postRank()
            // 更新晒分信息
            setTimeout(async () => {
                // 弹出 Loading
                wx.showLoading({
                    title: '重新获取晒分情况...',
                    mask: true
                })
                await this.getDetail(this.data.DetailData.Position.danwei_code, this.data.DetailData.Position.zhiwei_code)
                this.setData({
                    "DetailData.Score.My": { // 报名数据
                        Department: this.data.DetailData.Position.danwei_code,
                        Position: this.data.DetailData.Position.zhiwei_code,
                        Score: this.data.Score,
                    },
                })
                wx.hideLoading() // 隐藏 loading
            }, 1000)
        }
    },

    /**
     * 辅助函数 按钮 报名本岗位 todo
     */
    postRank: function () {
        // 弹出 Loading
        wx.showLoading({
            title: '正在提交...',
            mask: true
        })

        // 提交报名信息
        const db = wx.cloud.database()
        db.collection("RankingListScore2022SK").where({
            Phone: this.data.phone
        }).get()
            .then(res => {
                if (res.errMsg !== "collection.get:ok") {
                    wx.hideLoading() // 隐藏 loading
                    app.methods.handleError({
                        err: res.errMsg,
                        title: "出错啦",
                        content: "提交出错, 请您稍后再试～ (" + res.errMsg + ")"
                    })
                } else {
                    // 判断是否提交过晒分信息
                    if (res.data.length > 0) {
                        // 提交过, 进行更新操作
                        db.collection("RankingListScore2022SK").where({
                            Phone: this.data.phone
                        }).update({
                            data: {
                                Phone: this.data.phone,
                                Department: this.data.DetailData.Position.danwei_code,
                                Position: this.data.DetailData.Position.zhiwei_code,
                                Score: this.data.Score,
                            }
                        })
                            .then(res => {
                                if (res.errMsg !== "collection.update:ok") {
                                    wx.hideLoading() // 隐藏 loading
                                    app.methods.handleError({
                                        err: res.errMsg,
                                        title: "出错啦",
                                        content: "提交出错, 请您稍后再试～ (" + res.errMsg + ")"
                                    })
                                } else {
                                    wx.hideLoading() // 隐藏 loading
                                    // todo 更新晒分详情
                                }
                            })
                            .catch(err => {
                                app.methods.handleError({
                                    err,
                                    title: "出错啦",
                                    content: "提交出错, 请您稍后再试～ (" + err + ")"
                                })
                                wx.hideLoading() // 隐藏 loading
                            })
                    } else {
                        // 没有提交过, 进行插入操作
                        db.collection('RankingListScore2022SK').add({
                            data: {
                                Phone: this.data.phone,
                                Department: this.data.DetailData.Position.danwei_code,
                                Position: this.data.DetailData.Position.zhiwei_code,
                                Score: this.data.Score,
                            }
                        })
                            .then(res => {
                                if (res.errMsg !== "collection.add:ok") {
                                    wx.hideLoading() // 隐藏 loading
                                    app.methods.handleError({
                                        err: res.errMsg,
                                        title: "出错啦",
                                        content: "提交出错, 请您稍后再试～ (" + res.errMsg + ")"
                                    })
                                } else {
                                    wx.hideLoading() // 隐藏 loading
                                    // todo 更新晒分详情
                                }
                            })
                            .catch(err => {
                                app.methods.handleError({
                                    err,
                                    title: "出错啦",
                                    content: "提交出错, 请您稍后再试～ (" + err + ")"
                                })
                                wx.hideLoading() // 隐藏 loading
                            })
                    }
                    wx.hideLoading() // 隐藏 loading
                }
            })
            .catch(err => {
                app.methods.handleError({
                    err,
                    title: "出错啦",
                    content: "提交出错, 请您稍后再试～ (" + err + ")"
                })
                wx.hideLoading() // 隐藏 loading
            })
    },

    /**
     * 监听 按钮 打开计算器
     */
    buttonOpenCalculator: function () {
        this.setData({
            OpenCalculator: true
        })
    },

    /**
     * 监听 按钮 关闭计算器
     */
    buttonCloseCalculator: function () {
        this.setData({
            OpenCalculator: false
        })
    },

    /**
     * 监听 输入成绩 逆袭计算器 本人成绩
     */
    bindCalculatorMyScoreInput: function (e) {
        if (isNaN(Number(e.detail.value))) {
            this.setData({
                CalculatorMyScore: 999
            })
        } else {
            this.setData({
                CalculatorMyScore: Number(e.detail.value),
            })
        }
    },

    /**
     * 监听 输入成绩 逆袭计算器 对手成绩
     */
    bindCalculatorOtherScoreInput: function (e) {
        if (isNaN(Number(e.detail.value))) {
            this.setData({
                CalculatorOtherScore: 999
            })
        } else {
            this.setData({
                CalculatorOtherScore: Number(e.detail.value),
            })
        }
    },

    /**
     * 监听 按钮 计算面试需追分差
     */
    buttonDoCalculator: function () {
        if (this.data.CalculatorMyScore == -1) {
            app.methods.handleError({
                err: null,
                title: "出错啦",
                content: "请填写您的成绩！"
            })
            return
        }
        if (this.data.CalculatorMyScore > 300) {
            app.methods.handleError({
                err: null,
                title: "出错啦",
                content: "您的成绩应当小于300分！"
            })
            return
        }
        if (this.data.CalculatorOtherScore == -1) {
            app.methods.handleError({
                err: null,
                title: "出错啦",
                content: "请填写对手成绩！"
            })
            return
        }
        if (this.data.CalculatorOtherScore > 300) {
            app.methods.handleError({
                err: null,
                title: "出错啦",
                content: "对手成绩应当小于300分！"
            })
            return
        }
        this.setData({
            CalculatorScore: (this.data.CalculatorOtherScore - this.data.CalculatorMyScore) * 0.75
        })
    },

    /**
     * 生命周期函数--监听页面加载
     * 获取参数中的后缀并进行保存
     */
    onLoad: function (options) {
        const _this = this;
        wx.showLoading({ title: '加载中' });
        // 获取后缀
        getApp().methods.getSuffix(options).then(res => {
            // 保存后缀信息
            this.setData(res);
            // 判断是否是单页模式
            if (wx.getLaunchOptionsSync().scene !== 1154) {
                // 不是单页模式，进行登陆操作
                // 获取登陆状态
                getApp().methods.SSOCheck({
                    crmEventFormSID: _this.data.CRMEFSID,
                    suffix: { suffix: _this.data.suffix, suffixStr: _this.data.suffixStr },
                    remark: _this.data.CRMRemark,
                    callback: ({ phone, openid }) => _this.setData({ phone, openid }),
                });
                wx.hideLoading(); // 隐藏 loading
            } else {
                _this.setData({ SinglePageMode: true });
                wx.hideLoading(); // 隐藏 loading
            }
        }).catch(err => {
            wx.hideLoading(); // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '获取后缀失败', reLaunch: true });
        });
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
     * 上拉刷新
     */
    onReachBottom: function () {
        // 没有配置搜索条件
        if (!this.data.SearchData.hasOwnProperty("zwcode")) {
            return
        }
        // 已经加载全部数据
        if (this.data.PositionData.total < this.data.PositionData.page * 15) {
            return
        }
        // 弹出 Loading
        wx.showLoading({
            title: '努力检索中...',
            mask: true
        })
        wx.request({
            url: 'https://app.offcn.com/zwsk/wechat/zhiwei/search',
            data: {
                ...this.data.SearchData,
                page: Number(this.data.PositionData.page) + 1,
                sign: "b4a8b2f7z4d3n6o0hs",
            },
            success: (res) => {
                if (res.statusCode === 200) {
                    res.data.lists = this.data.PositionData.lists.concat(res.data.lists),
                        this.setData({
                            PositionData: res.data
                        })
                } else {
                    app.methods.handleError({
                        err: res,
                        title: "出错啦",
                        content: "检索失败, 请您稍后再试"
                    })
                }
                wx.hideLoading() // 隐藏 loading
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: '省考晒分知分差',
            imageUrl: 'http://jl.offcn.com/zg/ty/images/exam-helper-mini-program/sk/2022/ranking-list/share.jpg'
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: '2022年吉林省公务员考试晒分知分差'
        }
    }
})