var util = require('../../utils/util.js');
const app = getApp()
import typeTemp from '../common/typeTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: [],
    canPushCount: 1,
    btnServiceSelected: [],
    tagMap: {},
    tagList: [],
    tagNameList: [],
  },

  btnSelect: typeTemp.btnSelect,
  tagClick: typeTemp.tagClick,
  tagCheck: typeTemp.tagCheck,
  loadService: typeTemp.loadService,
  initTagClick: typeTemp.initTagClick,

  loadTagList:function(tagId){

    var tagList= this.data.tagList;
    var btnServiceSelected = this.data.btnServiceSelected;

    var fullIndex = this.data.tagMap[tagId];
    var parent = fullIndex["parent"];
    var child = fullIndex["index"];
    tagList.push(tagId);
    btnServiceSelected[parent][child] = "click";

    this.setData({
      btnServiceSelected: btnServiceSelected,
      tagList: tagList
    });
  },

  confirm:function(event){
    if (!this.tagCheck()) return;
    var op = this;
    var tag = op.data.tagList[0];
    var name = op.data.tagNameList[0];

    // 回退无法拿到值
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];
    prevPage.setData({
      tag: tag,
      selectTxt:name
    });
    app.globalData.listDataUpdated = true;
    var allUrl = util.fillUrlParams('./list', {
      tagId: tag,
      tagName: name
    });
    wx.switchTab({
      url: allUrl,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var op = this;
    var tagId = Number(options.tagId);
    this.loadService(function () {
      if (tagId != -1){
        //op.loadTagList(tagId);
      }  
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