var util = require('../../utils/util.js');
const app = getApp()
import oneBusinessTemp from '../common/oneBusinessTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneBusiness: {},
    isMyPage: true,
    needShow: false,
    id: -1,
    imageIndex: 1,
    isLeaguer: true,
    formIdArray: [],
    isOneSelf: true,
    payFlag: false,
    isIos: false,
    isBaseAdministrator: false,
    isEnterpriseAdministrator: false,
    baseList: [],
    signCount: 0,
    needSign: true,
    enterpriseOrderUnreadNum: 0,
    baseReserveUnreadNum: 0,

    establishmentAdminName: "",
    establishmentBtnName: "",
    isEstablishmentAdministrator: 0,
  },

  getFollowerById: oneBusinessTemp.getFollowerById,
  getFansById: oneBusinessTemp.getFansById,
  jumpScore: oneBusinessTemp.jumpScore,
  callMe: oneBusinessTemp.callMe,
  sign1: oneBusinessTemp.sign1,
  saveFormId1: oneBusinessTemp.saveFormId1,
  sign2Server1: oneBusinessTemp.sign2Server1,

  modifyCard: function (event) {
    var card = wx.getStorageSync('id');
    if (card == '') {
      return;
    }
    var allUrl = util.fillUrlParams('/pages/my/info', {});
    wx.navigateTo({
      url: allUrl,
    })
  },

  previewImage: function (e) {
    let imgArr = [];
    let current = e.currentTarget.dataset.src;
    imgArr.push(current);
    wx.previewImage({
      current: current,
      urls: imgArr,
    })
  },

  welfare: function (e) {
    var allUrl = util.fillUrlParams('/pages/resource/resource', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  onGotUserInfo: function (e) {
    var op = this;
    app.onGotUserInfo(e, function () {
      op.refresh();
    });
  },

  saveFormId: function (v) {
    app.formIdInput(v, this);
  },

  // sign: function (e) {
  //   var op = this;
  //   this.saveFormId(e);
  //   app.batchAddFormId(op);
  //   // 不等服务端返回,先限制
  //   this.setData({
  //     needSign: false
  //   });
  //   wx.showToast({
  //     title: '亲子币+10',
  //     icon: 'success',
  //     duration: 2000
  //   });
  //   app.onGotUserInfo(e, function () {
  //     op.sign2Server(op.data.id);
  //   });
  // },

  payfor: function (e) {
    let op = this;

    var card = wx.getStorageSync('id');
    if (card == '') {

      app.onGotUserInfo(e, function () {
        var id = app.getUserId();
        op.setData({
          id: id
        });
        op.refresh();
      });
      return;
    }
    var allUrl = util.fillUrlParams('/pages/campaign/score', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  closeFloat: function (e) {
    let op = this;
    op.setData({
      payFlag: false,
    });
  },

  jumpInvite: function (e) {
    var allUrl = util.fillUrlParams('/pages/my/invite', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  jumpRechargeOrderList: function () {
    var allUrl = util.fillUrlParams('/pages/campaign/rechargeOrderList', {});
    wx.navigateTo({
      url: allUrl
    });
  },


  jumpOrderList: function (e) {
    let op = this;
    var card = wx.getStorageSync('id');
    if (card == '') {
      app.onGotUserInfo(e, function () {
        var allUrl = util.fillUrlParams('/pages/campaign/orderList', {});
        wx.navigateTo({
          url: allUrl
        });
      });
      return;
    } else {
      var allUrl = util.fillUrlParams('/pages/campaign/orderList', {});
      wx.navigateTo({
        url: allUrl
      });
    }
  },

  myEstablishment: function (e) {
    let op = this;
    var card = wx.getStorageSync('id');
    if (card == '') {
      app.onGotUserInfo(e, function () {
        op.refresh()
      });
      return;
    } else {
      if (op.data.isEstablishmentAdministrator == 1) {
        var allUrl = util.fillUrlParams('/pages/establishment/settle', {
          companyId: op.data.oneBusiness.companyId || -1,
          company: op.data.oneBusiness.company,
          introduce: op.data.oneBusiness.introduce,
          workaddress: op.data.oneBusiness.workaddress,
          cardName: op.data.oneBusiness.realname,
        });
        wx.navigateTo({
          url: allUrl,
        })
      } else if (op.data.isEstablishmentAdministrator == 0) {
        let id = op.data.oneBusiness.companyId;
        app.post("/establishment/getEstablishmentInfoById", {
          establishmentId: id
        }, function (data) {
          if (app.hasData(data)) {
            let leaguetype = data[0].leaguetype;
            let companydesc = data[0].companydesc;
            let company = data[0].company;
            let logopic = data[0].logopic;
            if (logopic.indexOf('http') == -1) {
              logopic = app.qinzi + logopic;
            }

            let members = data[0].members;
            let companyaddr = data[0].companyaddr;
            let companytel = data[0].companytel;
            let companyweb = data[0].companyweb;
            let industry = data[0].industry;
            let mainbussiness = data[0].mainbussiness;
            let maindemand = data[0].maindemand;
            let licensepic = data[0].licensepic;
            let contactname = data[0].contactname;
            let contactduty = data[0].contactduty;
            let contacttel = data[0].contacttel;
            let contactwx = data[0].contactwx;
            let contactopenid = data[0].contactopenid;
            let email = data[0].email;

            var allUrl = util.fillUrlParams('/pages/establishment/oneEstablishment', {
              id: id,
              leaguetype: leaguetype,
              companydesc: companydesc,
              company: company,
              logopic: logopic,
              members: members,
              companyaddr: companyaddr,
              companytel: companytel,
              companyweb: companyweb,
              industry: industry,
              mainbussiness: mainbussiness,
              maindemand: maindemand,
              licensepic: licensepic,
              contactname: contactname,
              contactduty: contactduty,
              contacttel: contacttel,
              contactwx: contactwx,
              contactopenid: contactopenid,
              email: email,

              searchValue: "",
              inputShowed: false,
            });
            wx.navigateTo({
              url: allUrl
            });
          }
        })
      }
    }
  },

  // loadSign: function (id) {
  //   if (id == -1) return;
  //   var op = this;
  //   // 加载一个商户
  //   app.getUrl('/business/hasSigned/' + id, function (data) {
  //     if (app.hasData(data)) {
  //       if (data == null) return;
  //       if (data == 1) {
  //         op.setData({
  //           needSign: false
  //         });
  //       } else {
  //         op.setData({
  //           needSign: true
  //         });
  //       }
  //     }
  //   });
  // },

  sign2Server: function (id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/business/sign/' + id, function (data) {
      if (app.hasData(data)) {
        op.refresh();
      }
    });
  },

  loadOneBusiness: function (id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/business/info/' + id, function (data) {
      if (app.hasData(data)) {
        if (data == null || data.length == 0) return;
        op.setData({
          oneBusiness: data[0],
          needShow: true
        });

        op.getEstablishmentAdminName();
      }
    });
  },

  getBaseList: function (id) {
    let op = this;
    app.post('/base/getBaseList', {
      id: id
    }, function (data) {
      if (app.hasData(data)) {
        if (data == null || data.length == 0) return;
        op.setData({
          isBaseAdministrator: true,
          baseList: data,
        })
      }
    })
  },

  manageBase: function (e) {
    let op = this;
    if (op.data.baseList.length > 1) {
      var allUrl = util.fillUrlParams("/pages/my/baselist", {
        baseList: JSON.stringify(op.data.baseList),
      });
      wx.navigateTo({
        url: allUrl,
      })
    } else {
      let baseList = op.data.baseList[0];
      var allUrl = util.fillUrlParams("/pages/base/modify", {
        id: baseList.id,
        cardId: baseList.cardId,
        city: baseList.city,
        district: baseList.district,
        introduce: baseList.introduce,
        latitude: baseList.latitude,
        level: baseList.level,
        longitude: baseList.longitude,
        main_image: baseList.main_image,
        name: baseList.name,
        official_account_name: baseList.official_account_name,
        open_time: baseList.open_time,
        price: baseList.price,
        topic_type_id: baseList.topic_type_id,
        traffic: baseList.traffic,
        workaddress: baseList.workaddress,
        topic_type_name: baseList.topicTypeName,
      });
      wx.navigateTo({
        url: allUrl,
      })
    }
  },

  toEnterpriseOrderList: function (e) {
    let op = this;
    var allUrl = util.fillUrlParams("/pages/my/enterpriseOrderList", {

    });
    wx.navigateTo({
      url: allUrl,
    })
  },

  toBaseReserveList: function (e) {
    let op = this;
    var allUrl = util.fillUrlParams("/pages/my/baseReserveList", {

    });
    wx.navigateTo({
      url: allUrl,
    })
  },

  getUnreadNum: function (e) {
    let op = this;
    app.post("/business/getUnreadNum", {}, function (data) {
      if (app.hasData) {
        op.setData({
          enterpriseOrderUnreadNum: data.enterpriseOrderUnreadNum,
          baseReserveUnreadNum: data.baseReserveUnreadNum,
        })
      }
    })
  },

  refresh: function () {
    var op = this;
    var id = app.getUserId();
    this.setData({
      id: id
    });
    var card = wx.getStorageSync('id');
    if (card != '') {
      if (card == "1428" || card == "490") {
        op.setData({
          isEnterpriseAdministrator: true,
        });
        op.getBaseList(card);
        op.getUnreadNum();
      }
    }

    this.loadOneBusiness(id);
    // this.loadSign(id);
  },

  getEstablishmentAdminName: function (e) {
    let op = this;
    let companyId = op.data.oneBusiness.companyId || -1;
    let establishmentBtnName = "";
    let isEstablishmentAdministrator = 0;
    if (companyId != -1) {
      app.post("/establishment/getAdminName", {
        companyId: companyId,
      }, function (data) {
        if (app.hasData(data)) {
          op.setData({
            establishmentAdminName: data.adminName,
          });
          if (companyId != -1 && op.data.establishmentAdminName == op.data.oneBusiness.realname) {
            establishmentBtnName = "更新企业信息";
            isEstablishmentAdministrator = 1;
          } else if (companyId != -1 && op.data.establishmentAdminName != op.data.oneBusiness.realname) {
            establishmentBtnName = "企业信息";
            isEstablishmentAdministrator = 0;
          }
          op.setData({
            establishmentBtnName: establishmentBtnName,
            isEstablishmentAdministrator: isEstablishmentAdministrator,
          })
        }
      })
    } else if (companyId == -1) {
      establishmentBtnName = "完善企业信息";
      isEstablishmentAdministrator = 1;
      op.setData({
        establishmentBtnName: establishmentBtnName,
        isEstablishmentAdministrator: isEstablishmentAdministrator,
      })
    }


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refresh();
    var res = wx.getSystemInfoSync();
    if ('ios' == res.platform) {
      this.setData({
        isIos: true,
      });
    }

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
    var op = this;
    this.refresh();
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
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.refresh();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var op = this;
    var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
      id: app.getUserId(),
      follow: 0
    });

    return {
      title: '请关注我',
      path: allUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})