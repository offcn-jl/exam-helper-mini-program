Component({
  properties: {
    placeholder: String,
    options: Array,
    text: { type: String, value: "请选择" },
    type: String,
    icon: String
  },
  /**
   * 组件的初始数据
   */
  data: {
    currentOptions: [],
    textColor: "#999999",
    edDetail: true,
    isActive: false
  },
  lifetimes: {
    ready() {
       this.setData({
        currentOptions: this.properties.options
       })
    }
  },
  methods: {
    //控制下拉显示
    showDetail() {
      this.setData({
        edDetail: false
      })
    },
    hideDetail() {
      setTimeout(function () {
        this.setData({
          edDetail: true
        })
      }.bind(this), 100)
    },
    //选择事件
    setText: function (e) {
      this.setData({
        isActive: true,
        textColor: "#d32423",
        text: this.data.currentOptions[e.target.dataset.index]
      })
      this.triggerEvent('m_selectSearch_touch', { text: this.data.currentOptions[e.target.dataset.index], type: this.properties.type });
      this.hideDetail()
    },
    searchList: function (event) {
      this.setData({
        currentOptions: this.properties.options.filter(val => {
          return (new RegExp((event.detail.value).replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, "\\$&"), "i")).test(val);
        })
      })
    }
  }
})