var util = require('../../utils/util.js');
const app = getApp()

var oneBusiness = {

  sign1: function (e) {
    var op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      app.onGotUserInfo(e, function () {
        op.refresh();
      });
      return;
    }
    let followerTemplateId = '01EMtrNhQzLgkppeVZf0PtmoOk812HevdmwKDZQqkUE';
    let cardMessageTemplateId = 'uwhiRcacULuqIySAIE8salPOKd3muX8GIAorF4_b8kk';

    app.post("/cooperate/getUnAuthRecordList", {
      card: app.getUserId()
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < 2) {
          //无授权记录
          wx.requestSubscribeMessage({
            tmplIds: [followerTemplateId, cardMessageTemplateId],
            success: (res) => {
              // 如果用户点击允许
              if (res[followerTemplateId] == 'accept') {
                app.post("/cooperate/addOrUpdateFollowerAuthAcceptRecord", {
                  card: app.getUserId()
                }, function (data) {})
              }
              if (res[cardMessageTemplateId] == 'accept') {
                app.post("/cooperate/addOrUpdateCardMessageAuthAcceptRecord", {
                  card: app.getUserId()
                }, function (data) {})
              }
            },
            fail: (res) => {},
            complete: (res) => {
              op.saveFormId1(e);
              app.batchAddFormId(op);
              op.sign2Server1(card);
            }
          })
        } else {
          let authFlag = true;
          for (let i = 0; i < data.length; i++) {
            if (data[i].auth_status == 0) {
              authFlag = false;
            }
          }

          if (!authFlag) {
            //有未授权记录
            wx.requestSubscribeMessage({
              tmplIds: [followerTemplateId, cardMessageTemplateId],
              success: (res) => {
                // 如果用户点击允许
                if (res[followerTemplateId] == 'accept') {
                  app.post("/cooperate/addOrUpdateFollowerAuthAcceptRecord", {
                    card: app.getUserId()
                  }, function (data) {})
                }
                if (res[cardMessageTemplateId] == 'accept') {
                  app.post("/cooperate/addOrUpdateCardMessageAuthAcceptRecord", {
                    card: app.getUserId()
                  }, function (data) {})
                }
              },
              fail: (res) => {},
              complete: (res) => {
                op.saveFormId1(e);
                app.batchAddFormId(op);
                op.sign2Server1(card);
              }
            })
          } else {
            op.saveFormId1(e);
            app.batchAddFormId(op);
            op.sign2Server1(card);
          }
        }
      }
    })
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