var util = require('../../utils/util.js');
const app = getApp()

var business = {

  oneBusiness: function (event) {
    var op = this;
    op.setData({
      needRefreshFlag: false,
    })
    var id = event.currentTarget.dataset.id;
    var follow = event.currentTarget.dataset.follow;

    var card = wx.getStorageSync('id');
    if (card == '') {
      app.onGotUserInfo(event, function () {
        op.getSeeCardRecord(id, follow);
      });
      return;
    } else {
      op.getSeeCardRecord(id, follow);
    }
  },

  getSeeCardRecord: function (id, follow) {
    let op = this;
    app.post("/business/getSeeCardRecord", {
      seeCardId: app.getUserId(),
      seenCardId: id,
    }, function (data) {
      if (typeof data == 'number' && data == 0) {
        op.addSeeCardRecord(id, follow, 0);
      } else {
        op.addSeeCardRecord(id, follow, 1);
      }
    });
  },

  addSeeCardRecord: function (id, follow, seeContactStatus) {
    app.post("/business/addSeeCardRecord", {
      seeCardId: app.getUserId(),
      seenCardId: id,
      seeContactStatus: seeContactStatus,
    }, function (data) {
      if (typeof data == 'number') {
        var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
          id: id,
          follow: follow
        });
        wx.navigateTo({
          url: allUrl
        });
      }
    });
  },

  onGotUserInfo: function (e) {
    var op = this;
    let card = wx.getStorageSync("id");
    if (card == "") {
      app.onGotUserInfo(e, function () {});
    } else {
      op.auth(e);
    }
  },

  addFollower: function (event) {
    var op = this;
    var userId = app.getUserId();
    var id = event.currentTarget.dataset.id;
    app.getUrl('/business/addFollower/' + userId + '-' + id, function (data) {
      if (app.hasData(data)) {
        app.globalData.listDataUpdated = true;
        //判断是否有打开过页面
        if (getCurrentPages().length != 0) {
          //刷新当前页面的数据
          getCurrentPages()[getCurrentPages().length - 1].onShow()
        }
      }
    });
  },


  auth: function (e) {
    let op = this;
    let templateId = '01EMtrNhQzLgkppeVZf0PtmoOk812HevdmwKDZQqkUE';
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        // 如果用户点击允许
        if (res[templateId] == 'accept') {} else {}
      },
      fail: (res) => {},
      complete: (res) => {
        op.addFollower(e);
        app.batchAddFormId(op);
      }
    })
  },

};

export default business;