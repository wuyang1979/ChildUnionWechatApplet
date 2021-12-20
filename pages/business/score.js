var util = require('../../utils/util.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  jumpInvite: function (e) {
    var allUrl = util.fillUrlParams('/pages/my/invite', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  payfor:function(e){
    var card = wx.getStorageSync('id');
    if (card == '') {
        app.onGotUserInfo(e, function () {
            var id = app.getUserId();
            op.setData({
                id: id
            });
        });
        return;
    }
    var allUrl = util.fillUrlParams('/pages/business/recharge', {
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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