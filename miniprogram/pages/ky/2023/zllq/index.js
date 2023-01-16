Page({

    /**
     * 页面的初始数据
     */
    data: {
        bookTypeList: [],
        bookList: [
            {
              "type": "复试备考攻略",
              "name": "复试备考攻略",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449960907-4e32b1eb-d391-4b3d-ab37-59fb2427bceb.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-考研30所院校口语真题集锦",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446016302-038c98ea-e49c-42df-81de-97e831ddfdab.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-考研复试英语口试要求",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446113999-868937e4-ae88-48eb-833c-b98d329fde9d.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-考研复试英语口语面试经典60问",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446257827-02646484-0b9d-40b9-8365-f5f32955182c.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-考研复试英语口语模板",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446342802-e55f3d93-629c-4481-866d-b09069a2442d.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-考研复试英语礼貌用语",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446490211-80a06936-435a-4aaa-9f8c-3e2986b64ef0.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-考研复试英语自我介绍范文10篇",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446572470-28595e25-7dfc-4ece-ac5b-bf8b160f9844.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-英语口语常见问题及答案100句",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446636912-d0e685ae-c8ed-4887-991d-ab0573e44a0d.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-英语口语-考目标院校的原因",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446670452-b49b0eb8-081b-421b-a603-f4765e2efec8.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-英语口语-热点话题类面试题型",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446713234-f6481b77-e320-4f4d-8088-d59acda456a5.pdf"
            },
            {
              "type": "考研复试英语资料汇总",
              "name": "2023-英语自我介绍范文20篇",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446752344-10a5eb4e-e0dc-4f70-a5b8-ac97cf62e9a7.pdf"
            },
            {
              "type": "综面考题",
              "name": "2023考研7种方法帮你克服考研复试面试",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446825996-ea0c8b6e-707b-4c72-a19d-4c6e70ca4287.pdf"
            },
            {
              "type": "综面考题",
              "name": "2023考研复试的开放性问题如何应对？",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446870097-c4f75390-6416-4a1e-80c1-6630887eac54.pdf"
            },
            {
              "type": "综面考题",
              "name": "2023考研复试面试陷阱，你能避开几个？",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673446961428-413ae888-96c3-4685-9764-8647c63970ab.pdf"
            },
            {
              "type": "综面考题",
              "name": "2023考研复试如何联系导师",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447009365-9aab9e09-8723-4476-9a7c-4363e8d61955.pdf"
            },
            {
              "type": "综面考题",
              "name": "2023考研专业课复试笔试会考什么？",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447094351-18a1f865-b3a0-48d9-8cb0-481306cb1f3c.pdf"
            },
            {
              "type": "综面考题",
              "name": "初试高分考生复试为什么被刷？两大共性&",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447129811-b47a59af-e300-477b-b80d-4685e033fcae.pdf"
            },
            {
              "type": "综面考题",
              "name": "除了学习专业考试规定的书籍，你还看过哪些",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447180883-e8f960d3-924f-412b-8e78-c4ebabe05808.pdf"
            },
            {
              "type": "综面考题",
              "name": "复试备考11个必须清楚的问题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447222472-229ee9ce-2678-4a21-a86e-ad02c3c91a32.pdf"
            },
            {
              "type": "综面考题",
              "name": "复试简历准备要点",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447355619-c4e1bd35-050c-4135-b852-22be9f61be66.pdf"
            },
            {
              "type": "综面考题",
              "name": "复试综合面试策略",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447638835-fc928e16-32f1-408c-8d17-1e64029ca741.pdf"
            },
            {
              "type": "综面考题",
              "name": "光靠模板怎能拯救英语自我介绍？说点新鲜",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447674019-32f9beed-2071-40e0-a0cb-ddcaf9300d90.pdf"
            },
            {
              "type": "综面考题",
              "name": "考研复试导师常问问题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447709347-5a0426fe-ddb0-4cc9-b4eb-b9d9b975da55.pdf"
            },
            {
              "type": "综面考题",
              "name": "考研复试——你准备好了吗？",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447754084-b3a3f09e-8c14-4c17-a79f-e0547fcc6e3e.pdf"
            },
            {
              "type": "综面考题",
              "name": "考研认知类面试题型-报考动机",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447788878-4a0b6a5d-624f-4c2a-9b5a-696fe1cfa0c5.pdf"
            },
            {
              "type": "综面考题",
              "name": "考研认知类面试题型-学习规划类",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447834253-a73d83fa-007d-4398-81d6-f1a0e862d2d9.pdf"
            },
            {
              "type": "综面考题",
              "name": "男女生关于面试礼仪等8大注意事项",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447880561-91d7feaa-c4c1-46b1-acd3-860d9b7677d8.pdf"
            },
            {
              "type": "综面考题",
              "name": "你选择跨专业读研的理由是什么",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447925064-b52ffdfe-e8fd-43ec-a9dc-7ebcba2de414.pdf"
            },
            {
              "type": "综面考题",
              "name": "请介绍一下你的家乡",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673447963265-7e3726ff-392c-4ee0-b948-03e1c46de156.pdf"
            },
            {
              "type": "综面考题",
              "name": "请介绍一下你所学的专业",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673448017767-5bdf4107-c23e-4c07-8f19-6b430e74b439.pdf"
            },
            {
              "type": "综面考题",
              "name": "请介绍一下你在大学期间所获得的学习奖项",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673448068991-a593c7dd-53d3-4ac4-8415-df4fb37e2588.pdf"
            },
            {
              "type": "综面考题",
              "name": "请介绍自己的兴趣爱好",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673448120171-da987aa5-339e-4507-a973-30eaf24846ae.pdf"
            },
            {
              "type": "综面考题",
              "name": "与应届生相比你认为自己的优势和劣势有哪些",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673448162978-06f38c49-a400-4095-be30-57564a61b8be.pdf"
            },
            {
              "type": "综面考题",
              "name": "专业素质类面试题型-学业情况类",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673448259046-7007ed7a-2538-41c7-a802-41e1572b8d23.pdf"
            },
            {
              "type": "综面考题",
              "name": "自我认知类面试题-书籍阅读类",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673448291515-c7f8c8e0-fff6-4b05-954a-1dd86a403e01.pdf"
            },
            {
              "type": "综面考题",
              "name": "自我认知类面试题型-自我介绍",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673448323618-8b5514ca-aa79-49c5-b9e5-4835499be428.pdf"
            },
            {
              "type": "综面考题",
              "name": "综面面试礼仪介绍",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673448363072-71a629d7-32d2-417b-8dc7-552180115bbe.pdf"
            },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板1",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673448879221-f9134317-8d9c-4a38-bbd8-3da1e7156a02.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板2",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673448975892-0edded84-856b-42d4-8495-04aefc0257bf.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板3",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449008310-8804576b-f7c6-4e40-b41a-4d5147c639c9.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板4",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449044557-302e296b-2c3b-4289-addd-175ea661535b.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板5",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449076749-2c0a0217-f3af-44b3-a722-b77b7512cf03.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板6",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449177784-dedf8133-184c-49e9-ab9e-a0129caa6ee5.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板7",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449205488-fec931e6-3e65-4d77-b957-7c9d8a7538f9.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板8",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449241977-d7be35a5-0cff-4d1d-b387-097a4d139fd7.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "复试简历模板9",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449274806-fa14c9da-e53c-49b1-be77-4ea65e046bab.pdf"
            // },
            // {
            //   "type": "复试简历模板",
            //   "name": "研究生复试简历模板-蓝色",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449303973-696b99ad-5fb4-4ec2-bd3a-d01a469462a9.pdf"
            // },
            // {
            //   "type": "复试调剂模板",
            //   "name": "调剂申请书范文1",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449429392-7f2602dc-367e-4834-95cb-db1ed9606595.pdf"
            // },
            // {
            //   "type": "复试调剂模板",
            //   "name": "调剂申请书范文2",
            //   "link": "https://static.kaoyan365.cn/production/book/doc/1673449456313-2785bd7f-5ab1-4553-a06b-a70b12715ed9.pdf"
            // },
            {
              "type": "专业课复试常见话题",
              "name": "【MPAcc】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449523868-ddbb48dd-28f0-4588-8ef5-3da2cc050b82.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【法学】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449552759-98f275e6-a48f-489d-b01a-848b9b8aad7d.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【管理学】复试必考话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449587912-acec8a05-8f84-427f-8ad2-69a24a33ac93.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【汉语国际教育】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449616261-1d0fb08a-e0ad-4ba1-baad-fa5240e0e0cf.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【计算机】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449642340-e042858f-c2dc-4b32-b2b0-a07d29654dfd.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【教育】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449683148-2cd04235-d56f-4120-b554-3ec0a55f8ef0.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【金融】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449711958-ccab8b13-0425-4a13-ae22-4c98796e1219.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【经济学】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449744604-310e6191-a902-4495-965c-dbb95828e320.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【日语翻译】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449772919-1a3165af-5e2d-4ea8-8027-93b008de0710.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【体育】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449802213-e6b0cc35-6e43-44cd-9fa7-5bf678e4e035.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【心理学】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449829912-d2365811-2f67-4cba-9ec5-85653cb1f8e0.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【医学】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449860041-9a44f3e6-5c48-4bbf-b536-93a9b65f5272.pdf"
            },
            {
              "type": "专业课复试常见话题",
              "name": "【英语翻译】复试常见话题",
              "link": "https://static.kaoyan365.cn/production/book/doc/1673449888345-e269b783-44a9-4158-9629-edb8516a9a7f.pdf"
            }
        ],
        bookList4Show: [],

        scrollItemActiveIndex: 0,

        suffix: {}, // 后缀
        suffixStr: "", // 后缀 字符串

        CRMEFSID: "e96d70c916bc66328319672e2a85eec1", // CRM 活动表单 ID
        CRMRemark: "", // CRM 注释

        phone: "", // 用户手机号码
        openid: "", //openid
    },

    // 手动检查 SSO 登录状态
    SSOCheckManual: function () {
        getApp().methods.SSOCheckManual({
            crmEventFormSID: this.data.CRMEFSID,
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
            remark: this.data.CRMRemark,
            callback: ({ phone, openid }) => {
                this.setData({ phone, openid });
                wx.showToast({ title: '领取成功，点击下方资料即可查看', icon: "none" });
            },
        });
    },

    // 浏览资料
    view(e) {
        if (!this.data.bookList4Show[e.currentTarget.dataset.index].link) {
            wx.showToast({ title: '配置有误', icon: "none" });
            return
        }
        if (!this.data.phone) {
            wx.showToast({ title: '请您先点击上方按钮进行注册', icon: "none" });
            return
        }
        wx.navigateTo({ url: `/pages/appopen/web-view/index?src=https://static.kaoyan365.cn/book_wechat/pdf_new/web/viewer.html&locale=zh-CN&downloadable=false&file=${this.data.bookList4Show[e.currentTarget.dataset.index].link}` });
    },

    // 点击切换 菜单
    scrollItemOnClick(e) {
        const bookList4Show = [];
        this.data.bookList.forEach(value => {
            if (value.type == this.data.bookTypeList[e.currentTarget.dataset.index]) {
                bookList4Show.push(value);
            }
        });
        this.setData({ bookList4Show, scrollItemActiveIndex: e.currentTarget.dataset.index });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 初始化数据
        const bookTypeList = [];
        this.data.bookList.forEach(bookListValue => {
            let has = false;
            bookTypeList.forEach(bookTypeListValue => {
                if (bookTypeListValue == bookListValue.type) {
                    has = true;
                }
            })
            if (!has) {
                bookTypeList.push(bookListValue.type);
            }
        });
        const bookList4Show = [];
        this.data.bookList.forEach(value => {
            if (value.type == bookTypeList[0]) {
                bookList4Show.push(value);
            }
        });
        this.setData({ bookTypeList, bookList4Show });

        wx.showLoading({ title: '加载中' });
        getApp().methods.getSuffix(options).then(res => {
            this.setData(res);
            // 隐藏 loading
            wx.hideLoading();
            // 判断是否是单页模式
            if (wx.getLaunchOptionsSync().scene !== 1154) {
                // 不是单页模式，进行登陆操作
                // 获取登陆状态
                getApp().methods.SSOCheck({
                    crmEventFormSID: this.data.CRMEFSID,
                    suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr },
                    remark: this.data.CRMRemark,
                    callback: ({ phone, openid }) => this.setData({ phone, openid }),
                });
            }
        }).catch(err => {
            // 隐藏 loading
            wx.hideLoading();
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
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        return {
            title: "2023考研复试充电包",
            imageUrl: "https://jl.offcn.com/zt/ty/images/ky/2023/zllq/share.jpg",
        }
    },

    /**
     * 用户点击右上角分享 分享到朋友圈
     */
    onShareTimeline: function () {
        return {
            title: "2023考研复试充电包",
        }
    }
})