var util = require('../../utils/util.js');
const app = getApp()
import oneBusinessTemp from '../common/oneBusinessTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    oneBusiness: {},
    isMyPage: false,
    imageIndex: 0,
    follow: 0,
    id: -1,

    messageList: [],
    messageShowList: [],
    start: 0,
    pageSize: 10,
    hasMoreData: true,
    phone: '',

    isLeaguer: false,
    isTempCanShow: false,
    isMoreMessageList: false,
    isOneSelf: true,
  },

  getFollowerById: oneBusinessTemp.getFollowerById,
  getFansById: oneBusinessTemp.getFansById,
  jumpScore: oneBusinessTemp.jumpScore,
  callMe: oneBusinessTemp.callMe,
  setClip: oneBusinessTemp.setClip,

  goHome: function (event) {
    wx.switchTab({
      url: '/pages/cooperate/list',
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

  jump2OneMessage: function (event) {
    var arr = [];
    var id = event.currentTarget.dataset.id;
    var title = event.currentTarget.dataset.title;
    var message = event.currentTarget.dataset.message;
    var last = event.currentTarget.dataset.last;
    var read = event.currentTarget.dataset.read;
    var like = event.currentTarget.dataset.like;
    var stype = event.currentTarget.dataset.stype;
    var spath = event.currentTarget.dataset.spath;

    var card = this.data.oneBusiness.id;
    var phone = this.data.oneBusiness.phone;
    var realname = this.data.oneBusiness.realname;
    var job = this.data.oneBusiness.job;
    var company = this.data.oneBusiness.company;
    var headimgurl = this.data.oneBusiness.headimgurl;

    var allUrl = util.fillUrlParams('/pages/cooperate/oneMessage', {
      id: id,
      title: title,
      message: message,
      last: last,
      read: read,
      like: like,
      sourceType: stype,
      sourcePath: spath,

      card: card,
      phone: phone,
      realname: realname,
      job: job,
      company: company,
      headimgurl: headimgurl,
      messageList: JSON.stringify(arr)
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  cancel: function (event) {
    // 加载一个商户
    var op = this;
    var userId = app.getUserId();
    app.getUrl('/business/deleteFollower/' + userId + '-' + this.data.id, function (data) {
      if (app.hasData(data)) {
        op.setData({
          follow: 0
        });
        app.globalData.listDataUpdated = true;

        var allUrl = util.fillUrlParams('/pages/business/success', {});
        wx.navigateTo({
          url: allUrl
        });
      }
    });
  },

  onGotUserInfo: function (e) {
    var op = this;
    app.onGotUserInfo(e, function () {
      op.addFollower(e);
    });
  },

  payShowScore: function (e) {
    var op = this;
    wx.showModal({
      title: '提示',
      content: '本次操作将消耗100亲子币，继续吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定
          // 支付可以查看权限的积分
          var userId = app.getUserId();
          // app.onGotUserInfo(e, function () {

          app.post('/business/updateSeeContact', {
            seeCardId: userId,
            seenCardId: op.data.id,
          }, function (data) {
            if (typeof data == 'number' && data > 0) {
              app.getUrl('/card/show/payScore/' + userId + '-' + op.data.id, function (data) {
                if (app.hasData(data)) {
                  wx.showToast({
                    title: '支付成功',
                    icon: 'none',
                    duration: 2000
                  });
                  wx.setStorageSync(op.data.id, op.data.id);
                  op.onLoad({
                    id: op.data.id,
                    follow: op.data.follow
                  })
                }
              });
            }
          });
          // });
        } else if (sm.cancel) {
          return;
        }
      }

    })

  },

  addFollower: function (event) {
    // 加载一个商户
    var op = this;
    var userId = app.getUserId();
    app.getUrl('/business/addFollower/' + userId + '-' + this.data.id, function (data) {
      if (app.hasData(data)) {
        op.setData({
          follow: 1
        });
        app.globalData.listDataUpdated = true;

        var allUrl = util.fillUrlParams('/pages/business/success', {});
        wx.navigateTo({
          url: allUrl
        });
      }
    });
  },

  loadTempShowInfo: function (id) {
    // 检查该用户是否被支付，可以查看信息
    var canShowId = wx.getStorageSync(id);
    var isTempCanShow = canShowId != '' ? true : false;
    this.setData({
      isTempCanShow: isTempCanShow,
    });
  },

  loadOneBusiness: function (id) {
    var op = this;
    let selfId = app.getUserId();
    // 加载一个商户
    app.getUrl('/business/info/' + id, function (data) {
      if (app.hasData(data)) {
        var business = data[0];
        var leaguer = false;
        app.isLeaguerFunc(function (leaguer) {
          leaguer = leaguer || op.data.isTempCanShow;
          if (!leaguer) {
            business.phone = util.hidePhone(business.phone);
            //business.weixincode = util.hidePhone(business.weixincode);
          }
          op.setData({
            oneBusiness: business,
            isLeaguer: leaguer,
            isOneSelf: selfId == id ? true : false,
          });
        });

      }
    });
  },

  loadMessageByCardId: function (id) {
    var op = this;
    var messageList = this.data.messageList;
    app.post('/cooperate/cardId', {
      start: op.data.start,
      num: op.data.pageSize,
      cardId: id
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
      if (op.data.messageList.length > 5) {
        let messageShowList = [];
        for (let i = 0; i < 5; i++) {
          messageShowList.push(op.data.messageList[i]);
        }
        op.setData({
          messageShowList: messageShowList,
        });
      } else {
        op.setData({
          messageShowList: op.data.messageList,
        });
      }

    });
  },

  refreshAllMessage: function () {
    this.setData({
      messageList: [],
      start: 0,
      pageSize: 10,
      hasMoreData: true,
    });
    this.loadMessageByCardId(this.data.id);
  },

  showMoreMessageList: function (e) {
    let op = this;
    op.setData({
      isMoreMessageList: true,
    });
    if (op.data.hasMoreData) {
      op.loadMessageByCardId(op.data.id);
    } else {
      wx.showToast({
        title: '没有更多数据',
        duration: 500,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    var follow = options.follow;
    this.setData({
      id: id,
      follow: follow
    });
    this.loadTempShowInfo(id);
    this.loadOneBusiness(id);
    this.loadMessageByCardId(id);
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
    if (app.globalData.messageBussinessUpdated) {
      this.refreshAllMessage();
      app.globalData.messageBussinessUpdated = false;
    }
    /*
    if (app.globalData.messageDataUpdated) {
      this.loadMessageByCardId(this.data.id);
      app.globalData.messageDataUpdated = false;
    }
    */
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
    if (this.data.isMoreMessageList) {
      if (this.data.hasMoreData) {
        this.loadMessageByCardId(this.data.id);
      } else {
        wx.showToast({
          title: '没有更多数据',
          duration: 500,
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var op = this;
    var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
      id: op.data.id,
      isFollowed: 0,
    });

    return {
      title: '分享名片',
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