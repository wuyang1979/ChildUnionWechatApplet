var util = require('../../utils/util.js');
const app = getApp()
import orderTemp from '../common/orderTemp';

Page({

  /**
   * 和订单代码类似，先分离出来，后续代码要充值和积分的要有不同的展示
   */

  /**
   * 页面的初始数据
   */
  data: {
    qinzi: app.qinzi,
    rechargeOrderList: [],

    start: 0,
    pageSize: 30,
    hasMoreData: true,

  },

  oneRechargeOrder: orderTemp.oneRechargeOrder,
  loadOrder: orderTemp.loadOrder,

  refreshAllOrder: function () {
    this.setData({
      rechargeOrderList: [],
      start: 0,
      hasMoreData: true,
    });
    this.loadAllOrder();
  },

  loadAllOrder: function () {
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    if (id == -1) return;
    var rechargeOrderList = this.data.rechargeOrderList;
    // 加载商户
    app.post('/rechargeOrder/list', {
      card: id,
      start: op.data.start,
      num: op.data.pageSize,
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            rechargeOrderList: rechargeOrderList.concat(data),
            hasMoreData: false
          });
        } else {
          op.setData({
            rechargeOrderList: rechargeOrderList.concat(data),
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAllOrder();
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
    this.refreshAllOrder();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.loadAllOrder();
    } else {
      wx.showToast({
        title: '没有更多数据',
        duration: 500,
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})