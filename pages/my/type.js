var util = require('../../utils/util.js');
const app = getApp()
import typeTemp from '../common/typeTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    service: [],
    canPushCount: 3,
    btnServiceSelected: [],
    tagMap: {},
    tagList: [],
    tagNameList: [],
    invite: -1
  },

  btnSelect: typeTemp.btnSelect,
  tagClick: typeTemp.tagClick,
  tagCheck: typeTemp.tagCheck,
  loadService: typeTemp.loadService,
  initTagClick: typeTemp.initTagClick,

  nextStep: function (event) {
    if (!this.tagCheck()) return;

    var op = this;
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let prePage = pages[pages.length - 2];

    let tagList = op.data.tagList;
    let tagNameList = [];
    let params;
    let tagName = '';
    if (tagList.length == 1) {
      params = {
        tag1: tagList[0]
      };
    } else if (tagList.length == 2) {
      params = {
        tag1: tagList[0],
        tag2: tagList[1],
      };
    } else if (tagList.length == 3) {
      params = {
        tag1: tagList[0],
        tag2: tagList[1],
        tag3: tagList[2],
      };
    }

    app.post(('/business/getTagNameList'), params, function (data) {
      if (app.hasData(data)) {
        tagNameList = data;

        if (tagNameList.length == 1) {
          tagName = tagNameList[0];
        } else if (tagNameList.length == 2) {
          tagName = tagNameList[0] + "/" + tagNameList[1];
        } else if (tagNameList.length == 3) {
          tagName = tagNameList[0] + "/" + tagNameList[1] + "/" + tagNameList[2];
        }
        prePage.setData({
          tag: op.data.tagList,
          tagName: tagName,
          invite: op.data.invite,
        })
        wx.navigateBack({
          delta: 1,
        })
      }
    })
  },

  loadServiceSet: function () {
    var op = this;
    this.loadService(function () {
      op.loadTagList();
    });
  },

  loadTagList: function () {
    var op = this;
    // 加载一个商户
    if (app.getUserId() == -1) return;
    app.getUrl('/business/tag/' + app.getUserId(), function (data) {
      if (app.hasData(data)) {
        var tags = data;
        var btnServiceSelected = op.data.btnServiceSelected;
        var tagList = [];
        for (var index = 1; index <= 3; index++) {
          var tagId = tags["tag" + index];
          if (!tagId) continue;
          var fullIndex = op.data.tagMap[tagId];
          var parent = fullIndex["parent"];
          var child = fullIndex["index"];
          btnServiceSelected[parent][child] = "click";
          tagList.push(tagId);
        }
        op.setData({
          btnServiceSelected: btnServiceSelected,
          tagList: tagList
        });

      }
    });
  },

  initTagClick: function (data) {
    for (var subIndex = 0; subIndex < data.length; subIndex++) {
      var tagList = data[subIndex]["tagList"];
      var tagArray = [];
      for (var tagIndex = 0; tagIndex < tagList.length; tagIndex++) {
        tagArray.push("not-click");
      }
      subArray.push(tagArray);
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var invite = options.invite;
    if (!!invite) {
      this.setData({
        invite: invite
      });
    }
    this.loadServiceSet();
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