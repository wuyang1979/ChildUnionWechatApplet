var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: -1,
    value: 798,
    num: 1,
    businessList: [],
    start: 0,
    pageSize: 100,
    searchValue: "",
    tag: -1,
    cityCode: -1,
    randomBusinessList: []
  },

  bindValue: function (e) {
    this.setData({
      value: e.detail.value
    });
  },

  more: function (e) {
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  oneBusiness: function (event) {
    var id = event.currentTarget.dataset.id;
    var follow = event.currentTarget.dataset.follow;
    var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
      id: id,
      follow: follow
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  prepay: function (event) {
    var card = wx.getStorageSync('id');
    if (card == '') {

      app.onGotUserInfo(event, function () {
        var id = app.getUserId();
        op.setData({
          id: id
        });
      });
      return;
    }
    var op = this;
    app.post('/rechargeOrder/data', {
      cardId: card,
      price: op.data.value,
      num: op.data.num,
      total: op.data.value,
      body: '充值订单',
    }, function (data) {
      if (typeof data == 'number') {
        var allUrl = util.fillUrlParams('/pages/campaign/scoreOrder', {
          id: data,
          type: 4,
          activeType: 4,
          toLeaguerFlag: true,
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

  },

  loadAllBusiness: function () {
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    var businessList = this.data.businessList;
    // 加载商户
    app.post('/business/list', {
      id: id,
      start: op.data.start,
      num: op.data.pageSize,
      search: op.data.searchValue,
      tag: op.data.tag,
      city: op.data.cityCode
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            businessList: businessList.concat(data),
            hasMoreData: false
          });
        } else {
          op.setData({
            businessList: businessList.concat(data),
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
      let randomBusinessList = op.data.businessList;
      for (let i = randomBusinessList.length - 1; i > 0; i--) {
        let randomIndex = Math.floor(Math.random() * (i + 1));
        let itemAtIndex = randomBusinessList[randomIndex];
        randomBusinessList[randomIndex] = randomBusinessList[i];
        randomBusinessList[i] = itemAtIndex;
      }
      op.setData({
        randomBusinessList: randomBusinessList
      })
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAllBusiness();
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