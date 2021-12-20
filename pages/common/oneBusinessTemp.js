var util = require('../../utils/util.js');
const app = getApp()

var oneBusiness = {

  sign1: function (e) {
    var op = this;
    this.saveFormId1(e);
    app.batchAddFormId(op);
    app.onGotUserInfo(e, function () {
      var id = app.getUserId();
      op.sign2Server1(id);
    });
  },

  saveFormId1: function (v) {
    app.formIdInput(v, this);
  },

  sign2Server1: function (id) {
    var op = this;
    app.getUrl('/business/hasSigned/' + id, function (data) {
      if (app.hasData(data)) {
        if (data == null) return;
        op.data.signCount++;
        if (data == 1) {
          op.setData({
            needSign: false
          });
          if (!op.data.needSign) {
            wx.showToast({
              title: '已签到',
              icon: 'success',
              duration: 2000
            });
          }
        } else {
          op.setData({
            needSign: true
          });
          // 加载一个商户
          app.getUrl('/business/sign/' + id, function (data) {
            if (app.hasData(data)) {
              // op.refresh();
              if (op.data.signCount < 2) {
                if (op.data.needSign) {
                  wx.showToast({
                    title: '亲子币+10',
                    icon: 'success',
                    duration: 2000
                  });
                }
                op.setData({
                  needSign: false
                });
                op.refresh();
              }
            }
          });
        }
      }
    });
  },

  getFollowerById: function (event) {
    var id = event.currentTarget.dataset.id;
    var count = event.currentTarget.dataset.count;
    if (count == 0) return;
    var allUrl = util.fillUrlParams('/pages/business/follower', {
      id: id
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  getFansById: function (event) {
    var id = event.currentTarget.dataset.id;
    var count = event.currentTarget.dataset.count;
    if (count == 0) return;
    var allUrl = util.fillUrlParams('/pages/business/fans', {
      id: id
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  jumpScore: function (event) {
    var allUrl = util.fillUrlParams('/pages/business/score', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  callMe: function (event) {
    var phone = event.currentTarget.dataset.phone;
    wx.makePhoneCall({
      phoneNumber: phone
    })
  },

  setClip: function (event) {
    var weixin = event.currentTarget.dataset.weixin;
    wx.setClipboardData({
      data: weixin,
      success: function (res) {

      }
    });
  }

};

export default oneBusiness;