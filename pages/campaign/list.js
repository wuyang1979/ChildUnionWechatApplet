var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    qinzi: app.qinzi,
    campaigns: [],

    start: 0,
    pageSize: 30,
    hasMoreData: true,

  },

  refreshAllCampaign: function () {
    this.setData({
      campaigns: [],
      start: 0,
      hasMoreData: true,
    });
    this.loadAllCampaign();
  },

  loadAllCampaign: function () {
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    var campaigns = this.data.campaigns;
    // 加载商户
    app.post('/campaign/list', {
      id: id,
      start: op.data.start,
      num: op.data.pageSize,
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            campaigns: campaigns.concat(data),
            hasMoreData: false
          });
        } else {
          op.setData({
            campaigns: campaigns.concat(data),
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
    });
  },

  oneCampaign: function (event) {
    app.onGotUserInfo(event, function () {
      var id = event.currentTarget.dataset.id;
      var img = event.currentTarget.dataset.img;
      var deadline = event.currentTarget.dataset.deadline;
      var currency = event.currentTarget.dataset.currency;
      var read = event.currentTarget.dataset.read;
      var like = event.currentTarget.dataset.like;
      var allUrl = util.fillUrlParams('/pages/campaign/oneCampaign', {
        id: id,
        img: img,
        deadline: deadline,
        currency: currency,
        read: read,
        like: like,
      });
      wx.navigateTo({
        url: allUrl
      });
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAllCampaign();
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
    this.refreshAllCampaign();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.loadAllCampaign();
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