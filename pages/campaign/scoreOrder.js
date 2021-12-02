var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneOrder: {},
    communityIndex: "",
    type: 0,
    activeType: 0,
    toLeaguerFlag: false,
  },


  loadOneOrder(id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/rechargeOrder/' + id, function (data) {
      if (app.hasData(data)) {
        var oneOrder = data[0];
        op.setData({
          oneOrder: oneOrder
        });
      }
    });
  },



  prepay: function (event) {
    var card = wx.getStorageSync('id');
    if (card == '') {
      wx.showToast({
        title: '请先绑定用户',
      });
      return;
    }
    var op = this;
    app.post('/order/prepay', {
      id: op.data.oneOrder.id,
      card: card,
      body: op.data.oneOrder.name + '订单',
      order: op.data.oneOrder.order_no,
      total: op.data.oneOrder.total,
    }, function (data) {
      if (!!data && !!data.status) {
        wx.showToast({
          title: '后台处理失败',
        })
        console.log(data);
        return;
      }
      if (app.hasData(data)) {
        // 发起微信支付
        wx.requestPayment({
          'timeStamp': data.timeStamp,
          'nonceStr': data.nonceStr,
          'package': data.package,
          'signType': data.signType,
          'paySign': data.paySign,
          'success': function (res) {
            console.log(res);
            if (op.data.toLeaguerFlag) {
              app.post('/order/toLeaguer', {
                id: card
              }, function (data) {
                if (data.result == 1) {
                  var allUrl = util.fillUrlParams('/pages/campaign/success', {
                    id: op.data.oneOrder.id,
                    type: op.data.type,
                    communityIndex: op.data.communityIndex,
                    activeType: op.data.activeType,
                  });
                  wx.navigateTo({
                    url: allUrl
                  });
                }
              });
            } else {
              var allUrl = util.fillUrlParams('/pages/campaign/success', {
                id: op.data.oneOrder.id,
                type: op.data.type,
                communityIndex: op.data.communityIndex,
                activeType: op.data.activeType,
              });
              wx.navigateTo({
                url: allUrl
              });
            }

          },
          'fail': function (res) {
            console.log(res.errMsg)
          }
        })
      }
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let op = this;
    var id = options.id;
    var communityIndex = options.communityIndex;
    var type = options.type || 0;
    var activeType = options.activeType || 0;
    var toLeaguerFlag = options.toLeaguerFlag || false;
    op.setData({
      communityIndex: communityIndex,
      type: type,
      activeType: activeType,
      toLeaguerFlag: toLeaguerFlag,
    })
    this.loadOneOrder(id);
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