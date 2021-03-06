var util = require('../../utils/util.js');
const app = getApp()
import businessTemp from '../common/businessTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    businessList: [],
    id: app.getUserId(),
    followerId: -1,
    formIdArray: [],
  },

  oneBusiness: businessTemp.oneBusiness,
  onGotUserInfo: businessTemp.onGotUserInfo,
  addFollower: businessTemp.addFollower,
  getSeeCardRecord: businessTemp.getSeeCardRecord,
  addSeeCardRecord: businessTemp.addSeeCardRecord,
  auth: businessTemp.auth,

  saveFormId: function (v) {
    app.formIdInput(v, this);
  },


  loadFollower: function () {
    var op = this;
    var id = this.data.followerId;
    // 加载商户
    app.getUrl('/business/my/follower/' + id + "-" + app.getUserId(), function (data) {
      if (app.hasData(data)) {
        op.setData({
          businessList: data,
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.loadFollower();
    var id = options.id;
    this.setData({
      followerId: id
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
    this.loadFollower();
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