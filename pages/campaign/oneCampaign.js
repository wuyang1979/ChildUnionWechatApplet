var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qinzi: app.qinzi,

    addBtnImg: 'classAddNum',
    minusBtnImg: 'classMinusNumDisable',

    id: 0,
    read: 0,
    like: 0,
    img: '',
    oneCampaign: {},
    channel: 0,
    stockNumber: 1,
    allPrice: 0,
    replyList: [],
    message: '',
    isDeadlineExceeded: false,
    currency: 1,
    currencyType: "",
    picList: [],
    deadline: "",
    deadlineTime: "",
  },

  sum: function (count) {
    this.setData({
      allPrice: this.data.channel * count
    });
  },

  loadReply4MessageId: function (message) {
    var op = this;
    // 加载一个商户
    app.getUrl('/cooperate/activeCooperateList/' + message, function (data) {
      if (app.hasData(data)) {
        op.setData({
          replyList: data,
        });
      }
    });
  },

  addStock: function () {
    var current = this.data.stockNumber;
    var max = Number(this.data.oneCampaign.stock);

    if (current == max) return;
    if (current == max - 1) {
      this.setData({
        addBtnImg: 'classAddNumDisable',
        minusBtnImg: 'classMinusNum'
      });
    } else {
      this.setData({
        minusBtnImg: 'classMinusNum',
      });
    }
    this.setData({
      stockNumber: current + 1
    });
    this.sum(this.data.stockNumber);
  },

  previewImage: function (e) {
    let imgArr = [];
    let current = e.currentTarget.dataset.url;
    imgArr.push(current);
    wx.previewImage({
      current: current,
      urls: imgArr,
    })
  },

  minusStock: function () {
    var current = this.data.stockNumber;
    var min = Number(this.data.oneCampaign.limit_stock);
    if (current == min) return;
    if (current == min + 1) {
      this.setData({
        addBtnImg: 'classAddNum',
        minusBtnImg: 'classMinusNumDisable'
      });
    } else {
      this.setData({
        addBtnImg: 'classAddNum',
      });
    }
    this.setData({
      stockNumber: current - 1
    });
    this.sum(this.data.stockNumber);
  },


  goHome: function (event) {
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  goCampaignlist: function (event) {
    wx.switchTab({
      url: '/pages/cooperate/list',
    })
  },

  onGotUserInfo: function (e) {
    var op = this;
    if (op.data.isDeadlineExceeded) {
      return;
    }
    app.onGotUserInfo(e, function () {
      op.goOrder(e);
    });
  },

  goOrder: function (event) {
    var card = wx.getStorageSync('id');
    if (card == '') {
      wx.showToast({
        title: '请先绑定用户',
      });
      return;
    }
    var op = this;
    if (1 == op.data.currency) {
      app.post('/cashOrder/data', {
        cardId: card,
        productId: op.data.id,
        price: op.data.channel,
        num: op.data.stockNumber,
        total: op.data.allPrice,
        body: op.data.oneCampaign.name + '订单',
      }, function (data) {
        if (typeof data == 'number') {
          var allUrl = util.fillUrlParams('/pages/campaign/order', {
            id: data,
            currency: 1,
          });
          wx.navigateTo({
            url: allUrl
          });
        } else {
          wx.showToast({
            title: '订单创建失败',
          })
        }
      });
    } else if (2 == op.data.currency) {
      app.post('/order/data', {
        cardId: card,
        productId: op.data.id,
        price: op.data.channel,
        num: op.data.stockNumber,
        total: op.data.allPrice,
        body: op.data.oneCampaign.name + '订单',
      }, function (data) {
        if (typeof data == 'number') {
          var allUrl = util.fillUrlParams('/pages/campaign/order', {
            id: data,
            currency: 2,
          });
          wx.navigateTo({
            url: allUrl
          });
        } else {
          wx.showToast({
            title: '订单创建失败',
          })
        }
      });
    }
  },

  loadOneCampaign(id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/campaign/' + id, function (data) {
      if (app.hasData(data)) {
        var campaign = data[0];
        op.setData({
          oneCampaign: campaign,
          stockNumber: campaign.limit_stock,
          channel: campaign.channel_price
        });
        op.sum(campaign.limit_stock);
        var card = wx.getStorageSync('id');
        op.isLeaguer(card);
      }
    });
  },

  loadCampaignMessage: function (messageId) {
    var op = this;
    app.getUrl('/cooperate/getMessage/' + messageId, function (data) {
      if (app.hasData(data)) {
        if (data.length == 0) {
          return;
        }
        var message = data[0].message || [];
        op.setData({
          message: message
        });
        op.loadReply4MessageId(op.data.message);
      }
    });
  },

  updateRead: function () {
    var op = this;
    app.getUrl('/campaign/message/read/' + op.data.id, function (data) {
      if (app.hasData(data)) {
        op.setData({
          read: Number(op.data.read) + 1,
        });
        app.globalData.messageDataUpdated = true;
      }
    });
  },

  updateLike: function (e) {
    var op = this;
    app.getUrl('/campaign/message/like/' + op.data.id, function (data) {
      if (app.hasData(data)) {
        op.setData({
          like: Number(op.data.like) + 1,
        });
        app.globalData.messageDataUpdated = true;
      }
    });
  },

  isLeaguer: function (card) {
    let op = this;
    app.post("/knowledge/isLeaguer", {
      id: card
    }, function (data) {
      if (app.hasData(data)) {
        if (data.leaguer == 1) {
          op.setData({
            allPrice: 0
          })
        }

      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // isDeadlineExceeded
    var op = this;
    var id = options.id;
    var img = decodeURI(options.img);
    var read = options.read;
    var like = options.like;
    let deadline = parseInt(options.deadline);
    let currentTime = new Date().getTime();
    let currency = parseInt(options.currency);
    let deadlineTime = util.formatDate(deadline);
    let currencyType;
    if (1 == currency) {
      currencyType = '现价(元)';
    } else if (2 == currency) {
      currencyType = '亲子币';
    }
    this.setData({
      id: id,
      img: img,
      isDeadlineExceeded: currentTime > deadline ? true : false,
      currency: currency,
      currencyType: currencyType,
      read: read,
      like: like,
      deadlineTime: deadlineTime,
      deadline: deadline,
    });
    this.loadOneCampaign(id);
    this.updateRead();
    this.loadCampaignMessage(id);

    app.post('/campaign/picList', {
      id: id,
    }, function (data) {
      if (app.hasData(data)) {
        for (let i = 0; i < data.length; i++) {
          data[i].url = app.qinzi + data[i].url;
        }
        op.setData({
          picList: data || [],
        });
      }
    });

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
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
    this.loadReply4MessageId(this.data.id);
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
    var op = this;
    var allUrl = util.fillUrlParams('/pages/campaign/oneCampaign', {
      id: op.data.id,
      read: op.data.read,
      like: op.data.like,
      img: op.data.img,
      oneCampaign: op.data.oneCampaign,
      channel: op.data.channel,
      stockNumber: op.data.stockNumber,
      allPrice: op.data.allPrice,
      replyList: op.data.replyList,
      message: op.data.message,
      isDeadlineExceeded: op.data.isDeadlineExceeded,
      currency: op.data.currency,
      currencyType: op.data.currencyType,
      picList: op.data.picList,
      deadline: op.data.deadline,
      deadlineTime: op.data.deadlineTime,
    });

    return {
      title: '发布了一条最新活动！',
      path: allUrl,
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})