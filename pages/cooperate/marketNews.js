var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bannerDefault: '/pages/cooperate/banner',
    messageList: [],
    start: 0,
    pageSize: 30,
    hasMoreData: true,
    cooperationScrollTop: 0,
    releaseFlag: false,

    // 轮播URL和图片用来做广告栏
    imgUrls: [],
    // 轮播控制项
    indicatorDots: true,
    autoplay: true,
    interval: 3000, // 轮播间隔
    duration: 1000,
    qinzi: app.qinzi,
    campaigns: [],

  },

  translateMessageType: function (value) {
    return util.translateMessageType(value);
  },

  findContacts: function (e) {
    app.globalData.findContactsFlag = true;
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  findCommunities: function (e) {
    app.globalData.findCommunitiesFlag = true;
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  findCooperations: function (e) {
    //非锚点滚动条转
    const query = wx.createSelectorQuery();
    query.select("#cooperation").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0] && res[1]) {
        wx.pageScrollTo({
          scrollTop: res[0].top + res[1].scrollTop,
          duration: 300,
        })
      }
    });
  },

  findBases: function (e) {
    var allUrl = util.fillUrlParams('/pages/base/list', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  loadBanner: function () {
    var op = this;
    app.getUrl('/banner/list', function (data) {
      if (app.hasData(data)) {
        op.setData({
          imgUrls: data,
        });
      }
    });
  },

  loadMessage: function () {
    var op = this;
    var messageList = this.data.messageList;
    app.post('/cooperate/list', {
      start: op.data.start,
      num: op.data.pageSize,
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            messageList: messageList.concat(data),
            hasMoreData: false
          });
        } else {
          op.setData({
            messageList: messageList.concat(data),
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
    });
  },

  refreshAllMessage: function () {
    this.setData({
      messageList: [],
      start: 0,
      pageSize: 30,
      hasMoreData: true,
    });
    this.loadMessage();
  },

  oneMessage: function (event) {
    var id = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.title;
    var message = event.currentTarget.dataset.message;
    var messageType = event.currentTarget.dataset.type;
    var sourceType = event.currentTarget.dataset.stype;
    var sourcePath = event.currentTarget.dataset.spath;
    var last = event.currentTarget.dataset.last;
    var read = event.currentTarget.dataset.read;
    var like = event.currentTarget.dataset.like;
    var card = event.currentTarget.dataset.card;
    var phone = event.currentTarget.dataset.phone;
    var realname = event.currentTarget.dataset.realname;
    var job = event.currentTarget.dataset.job;
    var company = event.currentTarget.dataset.company;
    var headimgurl = event.currentTarget.dataset.headimgurl;
    for (let i = this.data.messageList.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      let itemAtIndex = this.data.messageList[randomIndex];
      this.data.messageList[randomIndex] = this.data.messageList[i];
      this.data.messageList[i] = itemAtIndex;
    }
    var messageList = JSON.stringify(this.data.messageList);

    var allUrl = util.fillUrlParams('/pages/cooperate/oneMessage', {
      id: id,
      title: title,
      message: message,
      messageType: messageType,
      sourceType: sourceType,
      sourcePath: sourcePath,
      last: last,
      read: read,
      like: like,

      card: card,
      phone: phone,
      realname: realname,
      job: job,
      company: company,
      headimgurl: headimgurl,
      messageList: messageList
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  goMessage: function () {
    wx.navigateTo({
      url: '/pages/cooperate/message'
    });
  },

  onGotUserInfo: function (e) {
    var op = this;
    app.onGotUserInfo(e, function () {
      op.goMessage();
    });
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
    var id = event.currentTarget.dataset.id;
    var img = event.currentTarget.dataset.img;
    var allUrl = util.fillUrlParams('/pages/campaign/oneCampaign', {
      id: id,
      img: img
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.findContactsFlag = false;
    app.globalData.findCommunitiesFlag = false;
    this.loadBanner();
    this.loadMessage();
    this.loadAllCampaign();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 生命周期函数--监听用户滑动页面事件
   */
  onPageScroll: function (e) {
    if (e.scrollTop >= this.data.cooperationScrollTop) {
      this.setData({
        releaseFlag: true,
      })
    } else {
      this.setData({
        releaseFlag: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select("#cooperation").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0] && res[1]) {
        that.setData({
          cooperationScrollTop: res[0].top + res[1].scrollTop + 300,
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.findContactsFlag = false;
    app.globalData.findCommunitiesFlag = false;
    if (app.globalData.messageDataUpdated) {
      this.refreshAllMessage();
      app.globalData.messageDataUpdated = false;
    }
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
    this.refreshAllMessage();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hasMoreData) {
      this.loadMessage();
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