var a = require("../config");

Page({
    data: {
        s3procity: "",
        s3code: "",
        s3paim: "",
        s3sfword: "",
        s3fenshu: "",
        s3cha_fenshu: "",
        s3total: "",
        zprs: "",
        searchData: "",
        userlist: [],
        numlist: [],
        search_result: [],
        redcss: []
    },
    onLoad: function(a) {
        var s = JSON.parse(a.searchData);
        this.setData({
            searchData: s
        }), this.inquire();
    },
    inquire: function() {
        var s = this;
        wx.request({
            url: a.getpaimingAPI,
            data: this.data.searchData,
            method: "GET",
            dataType: "jsonp",
            success: function(t) {
                1 == JSON.parse(t.data.replace(/^(\s|\()+|(\s|\))+$/g, "")).status ? (wx.request({
                    url: a.getfzinfoAPI,
                    data: {
                        pro: s.data.searchData.pro,
                        city: s.data.searchData.city,
                        code: s.data.searchData.code
                    },
                    method: "GET",
                    dataType: "jsonp",
                    success: function(a) {
                        var t = JSON.parse(a.data.replace(/^(\s|\()+|(\s|\))+$/g, ""));
                        1 == t.status ? (s.setData({
                            search_result: t.lists
                        }), s.setData({
                            s3code: "职位代码：" + s.data.search_result[0].zwcode,
                            zprs: s.data.search_result[0].zprs + "人"
                        }), wx.hideLoading()) : console.log("error");
                    }
                }), wx.request({
                    url: a.searchResultAPI,
                    data: {
                        phone:s.data.searchData.phone,
                        pro: s.data.searchData.pro,
                        city: s.data.searchData.city,
                        code: s.data.searchData.code,
                        limits: 50
                    },
                    method: "GET",
                    dataType: "jsonp",
                    success: function(a) {
                        var t = JSON.parse(a.data.replace(/^(\s|\()+|(\s|\))+$/g, ""));
                        if (1 == t.status) {
                            s.setData({
                                numlist: t.lists,
                                userlist: t.users
                            }), s.setData({
                                s3procity: s.data.userlist.city,
                                s3paim: s.data.userlist.dqpaiming,
                                s3sfword: "本岗当前共晒分" + s.data.userlist.total + "人，您的排名为",
                                s3fenshu: s.data.userlist.fenshu,
                                s3cha_fenshu: s.data.userlist.cha_fenshu,
                                s3total: s.data.userlist.total
                            });
                            for (var e = s.data.numlist, r = 0; r < s.data.numlist.length; r++) s.data.userlist.dqpaiming == s.data.numlist[r].paihang ? e[r].redcss = "redcss" : e[r].redcss = "";
                            s.setData({
                                numlist: e
                            }), wx.hideLoading();
                        } else console.log("error");
                    }
                }), wx.hideLoading()) : console.log("error");
            }
        });
    },
    back: function() {
        wx.navigateBack({
            delta: 1
        });
    }
});