Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 多少秒后关闭
    duration: {
      type: Number,
      value: 3
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isTiptrue: true
  },

  ready: function () {

    // 关闭时间
    setTimeout(() => {
      this.setData({
        isTiptrue: false
      })
    }, this.data.duration * 1000);
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // Page中添加关闭引导
    closeGuide: function (e) {
      wx.setStorage({
        key: 'loadOpen',
        data: 'OpenTwo'
      })
      this.setData({
        isTiptrue: false
      })
    },
  }
})