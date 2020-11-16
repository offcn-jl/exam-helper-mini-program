// component/select/select.js
Component({
  properties: {
    options: Array,
    text: { type: String, value: "请选择" },
    type: String,
    icon: String
  },
  /**
   * 组件的初始数据
   */
  data: {
    textColor: "#999999",
    edDetail: true,
    isActive: false
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
        text: this.properties.options[e.target.dataset.index]
      })
      this.triggerEvent('m_select_touch', { index: e.target.dataset.index, type: this.properties.type });
      this.hideDetail()
    }
  }
})