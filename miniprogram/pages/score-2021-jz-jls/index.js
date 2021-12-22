const db = wx.cloud.database()
const cloudid = "score-2021-jz-jls"  //云数据库名，用于云函数调用
Page({
  data: {
    title:"2021年吉林市教师招聘晒分数知分差",// 标题
    banner_bk:"http://news01.offcn.com/jl/2021/1222/20211222040449595.jpg",// 背景图片
    imageUrl:"http://news01.offcn.com/jl/2021/1222/20211222040449595.jpg",// 分享时显示的图片
    CRMEFSID: "78680bf625473c5e0204a8650ca44941", // CRM 活动表单 ID
    CRMEventID: "HD202107270156", // CRM 注释  小程序-2021年吉林市教师招聘晒分数知分差 / 94858
    actid:"40864", //zg99id  2021吉林省特岗教师晒分数系统

    cityList: [],//所属地区
    countyList: [ ],//主管部门
    subjectList: [],//招聘单位名称
    postList: [],//招聘岗位名称

    cityValue: '', //所属地区
    countyValue: '', //主管部门
    subjectValue: '', //招聘单位名称
    postValue: '', //招聘岗位名称
    gradeValue: 0, //成绩

    suffix: "", // 后缀
    phone: "", // 用户手机号码
    openid:"",  //openid
    result:"",  //返回值
    active:false, //判断是否录入笔试成绩，如果录入了，变为true，文字颜色变红
  },
  
  // 监听筛选条件切换(所属地区做出选择以后，招聘岗位名称发生变化)
  m_select_touch(e) {
    var _this=this
    switch (e.detail.type) {
      case "city": //主管部门
        _this.setData({ cityValue: _this.data.cityList[e.detail.index] })
        // zg99二级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '2', grfiled:'city',grtext:_this.data.cityValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
            let county_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
            // 现将之前所属地区选项中招聘岗位名称内容清空
            _this.setData({
              countyList:  [],
              subjectList:  [],
              postList: []
            });
            // 将数据添加到已清空的报考职位中
            for( var i=0; i<county_list.lists.length; i++ ){
              _this.setData({
                countyList:  _this.data.countyList.concat(county_list.lists[i].county)
              });
            };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "county": //主管部门
        _this.setData({ countyValue: _this.data.countyList[e.detail.index] })
        // zg99三级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '3', grfiled:'county',grtext:_this.data.countyValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
            let subject_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
            _this.setData({
              subjectList:  [],
              postList: []
            });
            for( var i=0; i<subject_list.lists.length; i++ ){
              _this.setData({
                subjectList:  _this.data.subjectList.concat(subject_list.lists[i].subject)
              });
            };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "subject": //招聘单位名称
        _this.setData({ subjectValue: _this.data.subjectList[e.detail.index] })
        // zg99四级联动
        wx.request({
          url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",  //路径
          data: {level: '4', grfiled:'subject',grtext:_this.data.subjectValue,sstime: new Date().valueOf()},  //二级联动，上级联动字段名，上级联动参数值
          success(res) {
            let post_list = JSON.parse(res.data.substring(1, res.data.length - 1));  //去头尾（）,转为json对象
            // 现将之前所属地区选项中招聘岗位名称内容清空
            _this.setData({
              postList:  []
            });
            for( var i=0; i<post_list.lists.length; i++ ){
              _this.setData({
                postList:  _this.data.postList.concat(post_list.lists[i].post)
              });
            };
          },
          fail: err => {//获取失败后提示
            wx.hideLoading() // 隐藏 loading
            getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
          }
        })
        break
      case "post": //招聘岗位名称
        _this.setData({ postValue: _this.data.postList[e.detail.index] })
        break
    }
  },
  // 监听筛选条件（获取笔试成绩录入表里）
  getInputValue(e){
    var _this=this
    var regu = /^[0-9]+\.?[0-9]*$/;
    if(e.detail.value == ""){
      _this.setData({ 
        active:false
      })
    }else if(!regu.test(e.detail.value)){
      wx.showToast({ title: '请输入正确的分数', icon: 'none' })
      _this.setData({ 
        gradeValue: e.detail.value,
        active:true
      })
    }else{
      _this.setData({ 
        gradeValue: Number(e.detail.value),
        active:true
      })
    }
  },

  // 搜索
  async seach_result() {
    let url = "result/index?" + this.data.suffixStr
    if (this.data.cityValue !== "") url += "&city=" + this.data.cityValue
    if (this.data.countyValue !== "") url += "&county=" + this.data.countyValue
    if (this.data.subjectValue !== "") url += "&subject=" + this.data.subjectValue
    if (this.data.postValue !== "") url += "&post=" + this.data.postValue
    wx.reLaunch({ url })
  },

  // 注册（录入crm数据）(user未有数据)
  login: function (event) {
    let _this = this
    var regu = /^[0-9]+\.?[0-9]*$/;
    console.log(_this.data.gradeValue)
    // 相应招聘岗位名称数据
    if (_this.data.cityValue==""||_this.data.countyValue==""||_this.data.subjectValue==""||_this.data.postValue==""||_this.data.gradeValue=="") {
      wx.showToast({ title: '请选择或填写相应栏目', icon: 'none' })
    }else if(!regu.test(_this.data.gradeValue)||_this.data.gradeValue<0||_this.data.gradeValue>100){
      wx.showToast({ title: '请输入正确的分数', icon: 'none' })
    }else{
      // 将数据录入user 导出电话号  运行“晒分”函数
      getApp().methods.newLogin({event, crmEventFormSID: this.data.CRMEFSID, suffix: { suffix: this.data.suffix, suffixStr: this.data.suffixStr }, remark: `活动表单ID:${this.data.CRMEventID}`, callback: ({ phone, openid }) => {
        _this.setData({ phone, openid });
        console.log(_this.data.phone)
        wx.cloud.database().collection('user')
        .field({ _openid: true,phone:true })
        .where({ createdTime: wx.cloud.database().command.gte(new Date((new Date()).getTime() - 30 * 24 * 60 * 60 * 1000)) })
        .get({
          success:res=>{
            console.log("注册期间，判断user里数据内容",res)
            // 如果数据长度大于0，表示有数据，提取其中一个，录入data即可；同时在score-2021-jz-jls中判断是否有相同openid的数据
            if(res.data.length > 0){
              _this.setData({
                openid:res.data[0]._openid
              })
              console.log("注册期间，获取openid",_this.data.openid)
              db.collection(cloudid).where({_openid:_this.data.openid}).count({
                success: res =>{
                  console.log(res)
                  _this.setData({
                    result:res.total
                  })
                  console.log("注册期间，判断szyf里是否有对应数据2",_this.data.result)
                  if(_this.data.result == "1"){ //如果result是空，表示openid没有在score-2021-jz-jls里
                    db.collection(cloudid).add({ //将新用户的手机号录入score-2021-jz-jls
                      data:{
                        phone:_this.data.phone, //手机号码
                        city:_this.data.cityValue,
                        county:_this.data.countyValue,
                        subject:_this.data.subjectValue,
                        post:_this.data.postValue,
                        grade:_this.data.gradeValue,
                      },
                    }).then(res=>{
                      _this.seach_result() // 执行查询
                    }).catch(err =>{
                      console.error(err);
                      wx.showToast({
                        title: '数据库调取失败',
                      })
                    })
                  }else{    //如果result有值，或为1，表示score-2021-jz-jls里有这个openid
                    wx.showModal({
                      title: '提示',
                      content: '您已晒过分，仅可查询',
                      success (res) {
                        if (res.confirm) {
                          console.log('用户点击确定')
                          _this.seach_result() // 执行查询
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })
                  }
                },
                fail: res => {
                  console.log('失败',res);
                }
              })
            }
          }
        })
      }});
    }
  },

  // 报名函数运行
  tipsToSubscribeMessage() {
    let _this = this
    var regu = /^[0-9]+\.?[0-9]*$/;
    // 再次判断相应招聘岗位名称数据（上面部分因判断会有隐藏的情况）
    if (_this.data.cityValue==""||_this.data.countyValue==""||_this.data.subjectValue==""||this.data.postValue==""||this.data.gradeValue=="") {
      wx.showToast({ title: '请选择或填写相应栏目', icon: 'none' })
    }else if(!regu.test(this.data.gradeValue) ||_this.data.gradeValue<0||_this.data.gradeValue>100){
      wx.showToast({ title: '请输入正确的分数', icon: 'none' })
    }else{
      if(_this.data.result == ""){ //如果result是空，表示openid没有在score-2021-jz-jls里
        db.collection(cloudid).add({ //将新用户的手机号录入score-2021-jz-jls
          data:{
            phone:_this.data.phone, //手机号码
            city:_this.data.cityValue,
            county:_this.data.countyValue,
            subject:_this.data.subjectValue,
            post:_this.data.postValue,
            grade:_this.data.gradeValue,
          },
        }).then(res=>{
          _this.seach_result() // 执行查询
        }).catch(err =>{
          console.error(err);
          getApp().methods.handleError({
            err: err,
            title: "出错啦",
            content: "创建用户失败"
          })
        })
      }else{    //如果result有值，或为1，表示score-2021-jz-jls里有这个openid
        wx.showModal({
          title: '提示',
          content: '您已晒过分，仅可查询',
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              _this.seach_result() // 执行查询
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
      }
    }
  },
  /**
	 * 生命周期函数--监听页面加载
	 */
  onLoad: async function (options) {
    const suffixInfo = await getApp().methods.getSuffix(options); // 获取后缀信息
    this.setData({suffixInfo}); // 保存后缀信息
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
    // 动态设置当前页面的标题
    wx.setNavigationBarTitle({
      title: this.data.title
    })

    let _this=this
    // 判断是否录入过user表中
    wx.cloud.database().collection('user')
    .field({ _openid: true,phone:true })
    .where({ createdTime: wx.cloud.database().command.gte(new Date((new Date()).getTime() - 30 * 24 * 60 * 60 * 1000)) })
    .get({
      success:res=>{
        console.log("监听页面期间，判断user里数据内容",res)
        // 如果数据长度大于0，表示有数据，提取其中一个，录入data即可；同时在score-2021-jz-jls中判断是否有相同openid的数据
        if(res.data.length > 0){
          _this.setData({
            openid:res.data[0]._openid,
            phone:res.data[0].phone
          })
          db.collection(cloudid).where({_openid:_this.data.openid}).count({
            success: res =>{
              _this.setData({
                result:res.total
              })
              console.log("监听页面期间，判断szyf里是否有对应数据",_this.data.result)
            },
            fail:err =>{
              getApp().methods.handleError({
                err: err,
                title: "出错啦",
                content: "创建用户失败"
              })
            }
          })
        }
      }
    })
    
    // 判断是否是单页模式 toto 这里要结合登陆使用
    if (wx.getLaunchOptionsSync().scene !== 1154) {
      getApp().methods.login(this.data.CRMEFSID, this.data.suffix, this.data.CRMRemark, phone => this.setData({ phone })) // 登陆
    }
    // 获取数据
    wx.request({
      url: "https://zg99.offcn.com/index/chaxun/getlevel?actid="+_this.data.actid+"&callback=?",
      data: {level:"1", grfiled:'',grtext:'',sstime: new Date().valueOf()},
      success(res) {
        console.log(res)
        try {
          let list = JSON.parse(res.data.substring(1, res.data.length - 1)); //去头尾（）,转为json对象
          // console.log(list)
          if (list.status !== 1) {//如果status不等于1，弹出错误提示
            wx.showToast({ title: list.msg, icon: 'none' })
            return  
          }
          if (list.lists.length <= 0) {//如果内容长度小于等于0，弹出无数据提示
            wx.showToast({ title: '没有更多数据啦', icon: 'none' })
            return
          }
          // 录入所属地区里的单位，不用提前清空，因为只进行一次获取
          for(var i=0; i<list.lists.length; i++ ){
            _this.setData({
              cityList:  _this.data.cityList.concat(list.lists[i].city)
            });
          };
        } catch (err) {//捕获错误并报错
          getApp().methods.handleError({ err, title: "出错啦", content: '查询失败', reLaunch: true })
        }
      },
      fail: err => {//获取失败后提示
        wx.hideLoading() // 隐藏 loading
        getApp().methods.handleError({ err: err, title: "出错啦", content: '查询失败', reLaunch: true })
      }
    })
  },

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
  onReady: function () {},

	/**
	 * 生命周期函数--监听页面显示
	 */
  onShow: function () {},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
  onHide: function () {},

	/**
	 * 生命周期函数--监听页面卸载
	 */
  onUnload: function () {},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
  onPullDownRefresh: function () {},

	/**
	 * 页面上拉触底事件的处理函数
	 */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.title,
      imageUrl: this.data.imageUrl,
    }
  },

  /**
   * 用户点击右上角分享 分享到朋友圈
   */
  onShareTimeline: function () {
    return {
      title: this.data.title,
    }
  }
})
