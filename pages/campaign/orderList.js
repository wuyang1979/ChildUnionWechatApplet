var util = require('../../utils/util.js');
const app = getApp()
import orderTemp from '../common/orderTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qinzi: app.qinzi,
    orderList: [],

    start: 0,
    pageSize: 30,
    hasMoreData: true,

  },

  oneOrder: orderTemp.oneOrder,
  loadOrder: orderTemp.loadOrder,

  refreshAllOrder: function () {
    this.setData({
      orderList: [],
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

    //加载所有订单
    app.post('/order/allList', {
      card: id,
      start: op.data.start,
      num: op.data.pageSize,
    }, function (res) {
      if (app.hasData(res)) {
        let allList = res;
        let productList = [];
        // 加载商户,获取产品订单
        app.post('/order/list', {
          card: id,
          start: op.data.start,
          num: op.data.pageSize,
        }, function (data) {
          if (app.hasData(data)) {
            productList = data;
            for (let i = 0; i < productList.length; i++) {
              for (let j = 0; j < allList.length; j++) {
                if (productList[i].id == allList[j].id) {
                  allList[j] = productList[i];
                }
              }
            }

            for (let k = 0; k < allList.length; k++) {
              if (!app.hasData(allList[k].main_image)) {
                allList[k].main_image = "/img/1570023532416_WechatIMG4471552391298_.pic.jpg";
                //0:活动订单-1:非活动订单
                allList[k].type = 1;
              }
            }
            op.setData({
              orderList: allList,
            });
          } else {}
        });
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