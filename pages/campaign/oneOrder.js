var util = require('../../utils/util.js');
const app = getApp()
import orderTemp from '../common/orderTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qinzi: app.qinzi,
    item: {},

  },

  repay: function (event) {
    var op = this;
    var allUrl = util.fillUrlParams('/pages/campaign/order', {
      id: op.data.item.id,
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  callMe: function (event) {
    wx.makePhoneCall({
      phoneNumber: '18913388884',
      success: function () {
        console.log("拨打电话成功！")
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  loadOneOrder(id, type) {
    var op = this;
    // 加载一个商户
    app.post('/getOneOrder', {
      id: id,
      type: type,
    }, function (data) {
      if (app.hasData(data)) {
        if(type == 1){
          data[0].main_image = "/img/1570023532416_WechatIMG4471552391298_.pic.jpg";
        }
        var oneOrder = data[0];
        op.setData({
          item: oneOrder
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var type = options.type;
    this.loadOneOrder(id, type);
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