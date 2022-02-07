var util = require('../../utils/util.js');
const app = getApp()
import messageReplyTemp from '../common/messageReplyTemp';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    title: '',
    message: '',
    messageType: 0,
    sourceType: 0,
    sourcePath: '',
    last: '',
    read: 0,
    like: 0,
    isFollow: false,

    card: 0,
    selfCard: app.getUserId(),
    phone: '',
    realname: '',
    job: '',
    company: '',
    headimgurl: '',

    replyList: [],
    newMessageList: [],
    formIdArray: [],
    sourcePathList: [],
    replyMessage: '',
    recommandFlag: false
  },

  oneBusiness: messageReplyTemp.oneBusiness,
  jumpBusiness: messageReplyTemp.jumpBusiness,

  onGotUserInfo: function (e) {
    var op = this;
    var replyId = e.currentTarget.dataset.id;
    var replyCard = op.data.card;
    app.onGotUserInfo(e, function () {
      var allUrl = util.fillUrlParams('/pages/cooperate/reply', {
        messageId: op.data.id,
        replyId: !!replyId ? replyId : 0,
        replyCard: replyCard,
      });
      wx.navigateTo({
        url: allUrl
      });
    });
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

  guanzhu: function (e) {
    var op = this;
    let card = wx.getStorageSync('id');
    if (card == '') {
      app.onGotUserInfo(e, function () {});
    } else {
      op.setData({
        selfCard: app.getUserId(),
      })
      op.addFollower(e);
      app.batchAddFormId(op);
    }
    if (this.data.recommandFlag) {
      wx.showToast({
        title: '已关注',
        icon: 'success',
        duration: 2000
      });
    }
  },

  addFollower: function (event) {
    let op = this;
    let templateId = '01EMtrNhQzLgkppeVZf0PtmoOk812HevdmwKDZQqkUE';
    var userId = app.getUserId();
    var id = event.currentTarget.dataset.id;
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        // 如果用户点击允许
        if (res[templateId] == 'accept') {} else {}
      },
      fail: (res) => {},
      complete: (res) => {
        app.getUrl('/business/addFollower/' + userId + '-' + id, function (data) {
          if (app.hasData(data)) {
            app.globalData.listDataUpdated = true;
            //判断是否有打开过页面
            op.setData({
              isFollow: true
            });
          }
        });
        this.data.recommandFlag = true;
      }
    })
  },

  saveFormId: function (v) {
    app.formIdInput(v, this);
  },

  oneMessage: function (event) {
    var op = this;
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
    var sourcePathList = op.data.sourcePathList;
    for (let i = this.data.newMessageList.length - 1; i > 0; i--) {
      let randomIndex = Math.floor(Math.random() * (i + 1));
      let itemAtIndex = this.data.newMessageList[randomIndex];
      this.data.newMessageList[randomIndex] = this.data.newMessageList[i];
      this.data.newMessageList[i] = itemAtIndex;
    }
    var newMessageList = JSON.stringify(this.data.newMessageList);

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
      messageList: newMessageList,
      sourcePathList: sourcePathList,
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  updateLike: function (e) {
    var op = this;
    app.getUrl('/cooperate/message/like/' + op.data.id, function (data) {
      if (app.hasData(data)) {
        op.setData({
          like: Number(op.data.like) + 1,
        });
        app.globalData.messageDataUpdated = true;
      }
    });
  },

  updateRead: function () {
    var op = this;
    app.getUrl('/cooperate/message/read/' + op.data.id, function (data) {
      if (app.hasData(data)) {
        op.setData({
          read: Number(op.data.read) + 1,
        });
        app.globalData.messageDataUpdated = true;
      }
    });
  },

  goHome: function (event) {
    wx.switchTab({
      url: '/pages/business/list',
    })
  },

  goCooperateList: function (event) {
    wx.switchTab({
      url: '/pages/cooperate/list',
    })
  },

  contact: function (event) {
    var call = this.data.phone;
    wx.makePhoneCall({
      phoneNumber: call, //此号码并非真实电话号码，仅用于测试  
      success: function () {},
      fail: function () {}
    })
  },

  loadReply4MessageId: function (messageId) {
    var op = this;
    // 加载一个商户
    app.getUrl('/cooperate/messageReply/' + messageId, function (data) {
      if (app.hasData(data)) {
        op.setData({
          replyList: data,
        });
      }
    });
  },

  getFollower: function (selfCard, card) {
    let op = this;
    app.post("/cooperate/getFollower", {
      userId: selfCard,
      followerId: card
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length == 0) {
          op.setData({
            isFollow: false,
          })
        } else {
          op.setData({
            isFollow: true,
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var op = this;
    var id = options.id;
    var title = options.title;
    var message = options.message;
    var messageType = options.messageType || 0;
    var shareFlag = options.shareFlag || false;
    var sourceType = options.sourceType || 0;
    var sourcePath;
    if (shareFlag) {
      sourcePath = options.sourcePath || "";
    } else {
      sourcePath = !!options.sourcePath && options.sourcePath != 'null' ? app.qinzi + "/" + options.sourcePath : "";
    }
    var last = options.last;
    var read = options.read;
    var like = options.like;
    var card = options.card;
    var phone = options.phone;
    var realname = options.realname;
    var job = options.job;
    var company = options.company;
    var headimgurl = options.headimgurl;
    var newMessageList = options.messageList ? JSON.parse(options.messageList) : [];

    this.setData({
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
      newMessageList: newMessageList
    });

    app.post('/cooperate/picList', {
      id: id,
    }, function (data) {
      if (app.hasData(data)) {
        for (let i = 0; i < data.length; i++) {
          data[i].url = app.qinzi + data[i].url;
        }
        op.setData({
          sourcePathList: data || [],
        });
      }
    });


    this.loadReply4MessageId(id);
    var selfCard = app.getUserId();
    if (selfCard != -1) {
      op.getFollower(selfCard, card);
    }
    this.updateRead();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
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
    this.loadReply4MessageId(this.data.id);
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
    var op = this;
    var arr = [];
    var allUrl = util.fillUrlParams('/pages/cooperate/oneMessage', {
      id: op.data.id,
      title: op.data.title,
      messageType: op.data.messageType,
      message: op.data.message,
      sourceType: op.data.sourceType,
      sourcePath: op.data.sourcePath,
      last: op.data.last,
      read: op.data.read,
      like: op.data.like,
      shareFlag: true,

      card: op.data.card,
      phone: op.data.phone,
      realname: op.data.realname,
      job: op.data.job,
      company: op.data.company,
      headimgurl: op.data.headimgurl,
      messageList: JSON.stringify(arr),
      sourcePathList: op.data.sourcePathList,
    });

    return {
      title: op.data.realname + '发布了一条市场动态！',
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