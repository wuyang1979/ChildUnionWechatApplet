var util = require('../../utils/util.js');
const app = getApp()
import businessTemp from '../common/businessTemp';

Page({

  data: {
    businessList: [],
    formIdArray: [],
  },

  oneBusiness: businessTemp.oneBusiness,
  onGotUserInfo: businessTemp.onGotUserInfo,
  addFollower: businessTemp.addFollower,
  
  saveFormId: function (v) {
    app.formIdInput(v, this);
  },


  loadCommendBusiness: function () {
    var op = this;
    var start = Math.floor((Math.random() * 390 + 0));
    var pageSize = 5;
    // 加载商户
    app.getUrl('/business/list/' + app.getUserId() + '-' + start + '-' + pageSize, function (data) {
      if (app.hasData(data)) {
        op.setData({ businessList: data});
      }
    });
  },

  batchAddFollower:function(event){
    var op = this;
    var idList = [];
    for(var index = 0; index < this.data.businessList.length; index ++){
      idList.push(this.data.businessList[index]["id"]);
    }
    var followerList = idList.join(",");
    app.getUrl('/business/batchAddFollower/' + app.getUserId() + '-' + followerList, function (data) {
      if (app.hasData(data)) {
        app.globalData.listDataUpdated = true;

        var businessList = op.data.businessList;
        for (var index = 0; index < businessList.length; index++){
          businessList[index]["isFollow"] = 1
        }
        op.setData({ businessList: businessList});

        var allUrl = util.fillUrlParams('/pages/business/success', {
        });
        wx.navigateTo({
          url: allUrl
        });
      }
    });
  },

  backHome:function(event){
    wx.switchTab({
      url: "/pages/business/list",
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadCommendBusiness();
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