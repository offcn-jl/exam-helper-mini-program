var t = require("config"), e = require("config");

Page({
    data: {
        CRMEFSID: "f696c05399224480ebacc450b91c8b02", // CRM 活动表单 ID
        CRMEventID: "HD202201060274", // CRM 注释  2022银保监会晒分查排名/112358
        department: [ "报考部门" ],
        department_index: 0,
        pro: [ "省份" ],
        pro_index: 0,
        city: [ "招考单位" ],
        city_index: 0,
        code: [ "职位代码" ],
        code_index: 0,
        items: [ {
            value: "是",
            name: "是"
        }, {
            value: "否",
            name: "否"
        } ],
        major_index: 0,
        query_result: [],
        userphone: "",
        isHiddenPhoneAuthModal: !1,
        tgr: "",
        inputValue: "",
        radioValue: "",
        userlist: [],
        numlist: [],
        user_pro: [],
        user_city: "",
        user_code: ""
    },
// 登陆
  login: function (event) {
    getApp().methods.newLogin({event, crmEventFormSID: this.data.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${this.data.CRMEventID}`, callback: ({ phone, openid }) => {
      this.setData({ phone, openid });
        wx.showModal({ title: '提示', content: '注册成功，请您点击“点击登陆”按钮进行登陆～', showCancel: false, confirmText: "我知道啦" });
    }});
  },

    bindPickerDepartment: function(e) {
        var a = this;
        this.setData({
            department_index: e.detail.value,
            pro_index: 0,
            city_index: 0,
            code_index: 0,
            city: [ "招考单位" ],
            code: [ "职位代码" ]
        });
        var s = this.data.department[this.data.department_index];
        wx.request({
            url: t.lianDongAPI,
            data: {
                level: "2",
                grfiled: "department",
                grtext: s
            },
            success: function(t) {
                var e = t.data, s = e.substring(1, e.length - 1), i = JSON.parse(s);
                if (1 == i.status) {
                    for (var n = [ "省份" ], r = 0; r < i.lists.length; r++) n.push(i.lists[r].pro);
                    a.setData({
                        pro: n
                    });
                }
            },
            fail: function() {
                console.log("未知错误");
            }
        });
    },
    bindPickerPro: function(e) {
        var a = this;
        this.setData({
            pro_index: e.detail.value,
            city_index: 0,
            code_index: 0,
            code: [ "职位代码" ]
        });
        var s = this.data.department[this.data.department_index], i = this.data.pro[this.data.pro_index];
        wx.request({
            url: t.lianDongAPI,
            data: {
                level: "3",
                grfiled: "pro",
                grtext: i,
                onefiled: "department",
                onetext: s
            },
            success: function(t) {
                var e = t.data, s = e.substring(1, e.length - 1), i = JSON.parse(s);
                if (1 == i.status) {
                    for (var n = [ "招考单位" ], r = 0; r < i.lists.length; r++) n.push(i.lists[r].city);
                    a.setData({
                        city: n
                    });
                }
            },
            fail: function() {
                console.log("未知错误");
            }
        });
    },
    bindPickerCity: function(e) {
        var a = this;
        this.setData({
            city_index: e.detail.value,
            code_index: 0,
            code: [ "职位代码" ]
        });
        var s = this.data.department[this.data.department_index], i = this.data.pro[this.data.pro_index], n = this.data.city[this.data.city_index];
        wx.request({
            url: t.lianDongAPI,
            data: {
                level: "4",
                grfiled: "city",
                grtext: n,
                onefiled: "department",
                onetext: s,
                twofiled: "pro",
                twotext: i
            },
            success: function(t) {
                var e = t.data, s = e.substring(1, e.length - 1), i = JSON.parse(s);
                if (1 == i.status) {
                    for (var n = [ "职位代码" ], r = 0; r < i.lists.length; r++) n.push(i.lists[r].code);
                    a.setData({
                        code: n,
                        code_index: 0
                    });
                }
            },
            fail: function() {
                console.log("未知错误");
            }
        });
    },
    bindPickerCode: function(t) {
        this.setData({
            code_index: t.detail.value
        });
    },
    bindPickerMajor: function(t) {
        this.setData({
            major_index: t.detail.value
        });
    },
    radioChange: function(t) {
        for (var e = this.data.items, a = 0, s = e.length; a < s; ++a) e[a].checked = e[a].value === t.detail.value;
        this.setData({
            radioValue: t.detail.value
        });
    },
    getInputVal: function(t) {
        this.setData({
            inputValue: t.detail.value
        });
    },
    search: function(t) {
        this.getDataList();
    },
    getDataList: function(t) {
        var e = this.data.pro[this.data.pro_index], a = this.data.city[this.data.city_index], s = this.data.code[this.data.code_index], i = this.data.radioValue, n = this.data.inputValue, r = this.data.tgr;
        if (0 == this.data.pro_index) return wx.showToast({
            title: "请选择省份",
            icon: "none"
        }), !1;
        if (0 == this.data.city_index) return wx.showToast({
            title: "请选择地市",
            icon: "none"
        }), !1;
        if (0 == this.data.code_index) return wx.showToast({
            title: "请选择招考单位",
            icon: "none"
        }), !1;
        if ("" == i) return wx.showToast({
            title: "请选择是否通过考试",
            icon: "none"
        }), !1;
        if ("" == n || n > 100) return wx.showToast({
            title: "请填写正确的笔试分数",
            icon: "none"
        }), !1;
        var d = JSON.stringify({
            phone:this.data.phone ,
            pro: e,
            city: a,
            code: s,
            fenshu: n,
            pass: i,
            tgr: r
        });
        wx.navigateTo({
            url: "/pages/2022tbjhfc/search/search?searchData=" + d
        });
    },
    onLoad: async function(e) {
        const suffixInfo = await getApp().methods.getSuffix(e); // 获取后缀信息
        this.setData(suffixInfo); // 保存后缀信息
        this.setData({ contactInformation: await getApp().methods.getContactInformation(suffixInfo) }); // 获取推广信息
        // 判断是否是单页模式
        if (wx.getLaunchOptionsSync().scene !== 1154 && this.data.CRMEFSID.length === 32) {
        // 获取登陆状态
          getApp().methods.newLoginCheck({ 
            crmEventFormSID: this.data.CRMEFSID, 
            suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, 
            remark: `活动表单ID:${this.data.CRMEventID}`, 
            callback: ({ phone, openid }) => {
              this.setData({ phone, openid }); 
              
            } 
          });
        }

        var a = this;
        if (e.scene) {
            var s = decodeURIComponent(e.scene);
            console.log(s), console.log("扫描二维码"), this.setData({
                tgr: s.split("scode=")[1]
            }), console.log(this.data.tgr);
        }
        wx.request({
            url: t.lianDongAPI,
            data: {
                level: "1",
                grfiled: "",
                grtext: ""
            },
            success: function(t) {
                var e = t.data, s = e.substring(1, e.length - 1), i = JSON.parse(s);
                if (1 != i.status) return wx.showModal({
                    title: i.msg,
                    icon: "none"
                }), !1;
                for (var n = [ "报考部门" ], r = 0; r < i.lists.length; r++) n.push(i.lists[r].department);
                a.setData({
                    department: n
                });
            }
        }), this.data.phone && (this.getuseresult(), this.setData({
            isHiddenPhoneAuthModal: !0
        }));
    },
    getuseresult: function() {
        var e = this;
        wx.request({
            url: t.searchResultAPI,
            data: {
                phone: this.data.phone,
                sstimes: new Date().getTime()
            },
            success: function(a) {
                var s = a.data, i = s.substring(1, s.length - 1), n = JSON.parse(i);
                if (1 == n.status) {
                    e.setData({
                        userlist: n.users,
                        numlist: n.lists,
                        inputValue: n.users.fenshu,
                        user_pro: n.users.pro,
                        user_city: n.users.city,
                        user_code: n.users.code
                    }), "是" == n.users.pass ? (e.data.items[0].checked = !0, e.data.items[1].checked = !1, 
                    e.setData({
                        items: e.data.items,
                        radioValue: "是"
                    })) : (e.data.items[1].checked = !0, e.data.items[0].checked = !1, e.setData({
                        items: e.data.items,
                        radioValue: "否"
                    }));
                    for (var r = 0; r < e.data.department.length; r++) e.data.department[r] == n.users.department && e.setData({
                        department_index: r
                    });
                    wx.request({
                        url: t.lianDongAPI,
                        data: {
                            level: "2",
                            grfiled: "department",
                            grtext: e.data.department[e.data.department_index]
                        },
                        success: function(a) {
                            var s = a.data, i = s.substring(1, s.length - 1), n = JSON.parse(i);
                            if (1 == n.status) {
                                for (var r = [ "省份" ], d = 0; d < n.lists.length; d++) r.push(n.lists[d].pro);
                                e.setData({
                                    pro: r
                                });
                                for (var o = 0; o < e.data.pro.length; o++) e.data.user_pro == e.data.pro[o] && e.setData({
                                    pro_index: o
                                });
                                wx.request({
                                    url: t.lianDongAPI,
                                    data: {
                                        level: "3",
                                        grfiled: "pro",
                                        grtext: e.data.pro[e.data.pro_index],
                                        onefiled: "department",
                                        onetext: e.data.department[e.data.department_index]
                                    },
                                    success: function(a) {
                                        var s = a.data, i = s.substring(1, s.length - 1), n = JSON.parse(i);
                                        if (1 == n.status) {
                                            for (var r = [ "招考单位" ], d = 0; d < n.lists.length; d++) r.push(n.lists[d].city);
                                            e.setData({
                                                city: r
                                            });
                                            for (var o = 0; o < e.data.city.length; o++) e.data.city[o] == e.data.user_city && e.setData({
                                                city_index: o
                                            });
                                            wx.request({
                                                url: t.lianDongAPI,
                                                data: {
                                                    level: "4",
                                                    grfiled: "city",
                                                    grtext: e.data.city[e.data.city_index],
                                                    onefiled: "department",
                                                    onetext: e.data.department[e.data.department_index],
                                                    twofiled: "pro",
                                                    twotext: e.data.pro[e.data.pro_index]
                                                },
                                                success: function(t) {
                                                    var a = t.data, s = a.substring(1, a.length - 1), i = JSON.parse(s);
                                                    if (1 == i.status) {
                                                        for (var n = [ "职位代码" ], r = 0; r < i.lists.length; r++) n.push(i.lists[r].code);
                                                        e.setData({
                                                            code: n
                                                        });
                                                        for (var d = 0; d < e.data.code.length; d++) e.data.code[d] == e.data.user_code && e.setData({
                                                            code_index: d
                                                        });
                                                    }
                                                },
                                                fail: function() {
                                                    console.log("未知错误");
                                                }
                                            });
                                        }
                                    },
                                    fail: function() {
                                        console.log("未知错误");
                                    }
                                });
                            }
                        }
                    });
                }
            }
        });
    },
    getPhoneNumber: function(t) {
        var a = this;
        wx.login({
            success: function(s) {
                s.code && wx.request({
                    url: e.getSesionkeyAPI,
                    data: {
                        code: s.code
                    },
                    success: function(s) {
                        1 == s.data.status ? (wx.showLoading({
                            title: "加载中"
                        }), wx.request({
                            url: e.getUserPhoneAPI,
                            data: {
                                encryptedData: t.detail.encryptedData,
                                iv: t.detail.iv,
                                sessionKey: s.data.session_key
                            },
                            success: function(t) {
                                if (wx.hideLoading(), 1 == t.data.status) {
                                    var e = t.data.phone;
                                    wx.setStorage({
                                        key: "phone",
                                        data: e
                                    }), a.getuseresultA();
                                } else a.setData({
                                    isHiddenPhoneAuthModal: !1
                                }), wx.showToast({
                                    title: "获取手机号失败",
                                    icon: "none",
                                    duration: 1e3
                                });
                            }
                        })) : (wx.hideLoading(), wx.showToast({
                            title: "登录失败！",
                            icon: "none",
                            duration: 1e3
                        }));
                    }
                });
            }
        });
    },
    getuseresultA: function() {
        var t = this, a = this;
        wx.request({
            url: e.getpaimingAPI,
            data: {
                phone: this.data.phone,
                scode: wx.getStorageSync("tgr")
            },
            success: function(e) {
                var s = e.data, i = s.substring(1, s.length - 1);
                1 == JSON.parse(i).status && (t.setData({
                    isHiddenPhoneAuthModal: !0
                }), a.getuseresult());
            }
        });
    }
});