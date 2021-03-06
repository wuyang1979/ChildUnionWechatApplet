Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: "",
  },

  goHome: function (event) {
    wx.switchTab({
      url: '/pages/cooperate/list',
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let type = options.type;
    let message;
    if (type == "1") {
      message = "发布成功！";
    } else if (type == "2") {
      message = "入驻成功";
    } else if (type == '3') {
      message = "入驻成功，待管理员审核";
    } else if (type == '4') {
      message = "发布成功，待管理员审核";
    }

    this.setData({
      message: message,
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

  }
})