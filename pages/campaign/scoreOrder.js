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
    toEnterpriseLeaguerFlag: false,
    toGoldEnterpriseLeaguerFlag: false,
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
    if (op.data.toLeaguerFlag || op.data.toEnterpriseLeaguerFlag || op.data.toGoldEnterpriseLeaguerFlag) {
      app.post('/order/leaguePrepay', {
        id: op.data.oneOrder.id,
        card: card,
        body: op.data.oneOrder.name,
        order: op.data.oneOrder.order_no,
        total: op.data.oneOrder.total,
      }, function (data) {
        if (!!data && !!data.status) {
          wx.showToast({
            title: '后台处理失败',
          })
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
              } else if (op.data.toEnterpriseLeaguerFlag) {
                app.post('/order/toEnterpriseLeaguer', {
                  id: card
                }, function (data) {
                  if (app.hasData(data)) {
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
              } else if (op.data.toGoldEnterpriseLeaguerFlag) {
                app.post('/order/toGoldEnterpriseLeaguer', {
                  id: card
                }, function (data) {
                  if (app.hasData(data)) {
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
            'fail': function (res) {}
          })
        }
      });
    } else {
      app.post('/order/prepay', {
        id: op.data.oneOrder.id,
        card: card,
        body: op.data.oneOrder.name,
        order: op.data.oneOrder.order_no,
        total: op.data.oneOrder.total,
      }, function (data) {
        if (!!data && !!data.status) {
          wx.showToast({
            title: '后台处理失败',
          })
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
              } else if (op.data.toEnterpriseLeaguerFlag) {
                app.post('/order/toEnterpriseLeaguer', {
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
              } else if (op.data.toGoldEnterpriseLeaguerFlag) {
                app.post('/order/toGoldEnterpriseLeaguer', {
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
            'fail': function (res) {}
          })
        }
      });
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let op = this;
    let id = options.id;
    let communityIndex = options.communityIndex;
    let type = options.type || 0;
    let activeType = options.activeType || 0;
    let toLeaguerFlag = options.toLeaguerFlag || false;
    let toEnterpriseLeaguerFlag = options.toEnterpriseLeaguerFlag || false;
    let toGoldEnterpriseLeaguerFlag = options.toGoldEnterpriseLeaguerFlag || false;
    op.setData({
      communityIndex: communityIndex,
      type: type,
      activeType: activeType,
      toLeaguerFlag: toLeaguerFlag,
      toEnterpriseLeaguerFlag: toEnterpriseLeaguerFlag,
      toGoldEnterpriseLeaguerFlag: toGoldEnterpriseLeaguerFlag,
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