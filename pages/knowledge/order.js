var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneOrder: {},
    oneBusiness: {},
    currency: 1,
    currencyType: '',
    url: "",
    knowledgeId: 0,
  },


  loadOneOrder(id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/oneKnowledgeOrder/' + id, function (data) {
      if (app.hasData(data)) {
        var oneOrder = data[0];
        op.setData({
          oneOrder: oneOrder
        });
      }
    });
  },

  loadOneBusiness: function (id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/business/info/' + id, function (data) {
      if (app.hasData(data)) {
        if (data == null || data.length == 0) return;
        op.setData({
          oneBusiness: data[0],
          needShow: true
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
    app.post('/order/payScore', {
      id: op.data.oneOrder.id,
      card: card,
      body: '知识库订单',
      order: op.data.oneOrder.order_no,
      payment: op.data.oneOrder.total,
      total: op.data.oneOrder.total,
    }, function (data) {
      if (!!data && !!data.status) {
        wx.showToast({
          title: '后台处理失败',
        })
        console.log(data);
        return;
      } else {
        app.post("/knowledge/updateBuyCount", {
          knowledgeId: op.data.knowledgeId,
          card: card,
        }, function (data) {
          if (typeof data == 'number') {
            console.log("更新阅读量成功");
            op.previewFile(app.qinzi + op.data.url);
          } else {
            wx.showToast({
              title: '系统正在更新，请稍后再试'
            });
            return;
          }
        });

      }
    });
  },

  // 预览文件
  previewFile(fileLink) {
    if (!fileLink) {
      return false
    }
    util.showLoading()

    // 单次下载允许的最大文件为 200MB
    wx.downloadFile({
      url: fileLink,
      success: function (res) {
        console.log(res, "wx.downloadFile success res")
        if (res.statusCode != 200) {
          util.hideLoadingWithErrorTips()
          return false
        }
        var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
        wx.openDocument({
          filePath: Path,
          showMenu: true,
          success: function (res) {
            console.log('打开成功');
            util.hideLoading()
          }
        })
      },
      fail: function (err) {
        console.log(err, "wx.downloadFile fail err");
        util.hideLoadingWithErrorTips()
      }
    })
  },

  payfor: function (e) {
    var card = wx.getStorageSync('id');
    if (card == '') {
      wx.showToast({
        title: '请先绑定用户',
      });
      return;
    }
    var allUrl = util.fillUrlParams('/pages/campaign/score', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  jumpInvite: function (e) {
    var allUrl = util.fillUrlParams('/pages/my/invite', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var currency = options.currency;
    let url = options.url;
    let currencyType;
    let knowledgeId = options.knowledgeId;

    if (1 == currency) {
      currencyType = '元';
    } else if (2 == currency) {
      currencyType = '亲子币';
    }
    this.setData({
      currency: currency,
      currencyType: currencyType,
      url: url,
      knowledgeId: knowledgeId,
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
    var card = wx.getStorageSync('id');
    this.loadOneBusiness(card);
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