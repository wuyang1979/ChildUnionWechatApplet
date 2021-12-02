var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    templateId: "R2gfeze2ZLxJQIvSIjDwPTvQX6w-reWfQE32-ibFAlo",
    card: "",
    id: 0,
    name: "",
    topic_type_id: 0,
    topic_type: [],
    price: "",
    open_time: "",
    traffic: "",
    workaddress: "",
    official_account_name: "",
    introduce: "",
    activities: "",
    consulting: "",
    card_id: "",
    card_name: "",
    main_image: "",
    longitude: "",
    latitude: "",
    level: "",
    city: "",
    district: "",
    districtName: "",
    levelId: "",
    consultingeList: [],

    isConfirmShow: false,
    isIntroduce: true,
    isActivities: false,
    isConsultinge: false,
    pictureList: [],
  },

  openMapByTencent: function (e) {
    let op = this;
    let latitude = parseFloat(op.data.latitude);
    let longitude = parseFloat(op.data.longitude);

    wx.openLocation({
      latitude: latitude,
      longitude: longitude,
      scale: 11,
      name: op.data.name,
      address: op.data.workaddress,
    })

    // 腾讯服务定位插件
    // let key = 'EAXBZ-PAWWS-RYYOC-6YHEB-P7DQO-GJFAV'; //使用在腾讯位置服务申请的key
    // let referer = '亲子云商'; //调用插件的app的名称
    // let location = JSON.stringify({
    //   latitude: latitude,
    //   longitude: longitude
    // });
    // let category = "";

    // wx.navigateTo({
    //   url: 'plugin://chooseLocation/index?key=' + key + '&referer=' + referer + '&location=' + location + '&category=' + category
    // });
  },

  deny: function (e) {
    let op = this;
    op.setData({
      isConfirmShow: false,
    });
  },

  toIntroduce: function (e) {
    let op = this;
    op.setData({
      isIntroduce: true,
      isConsultinge: false,
      isActivities: false,
    });
  },

  toActivitie: function (e) {
    let op = this;
    op.setData({
      isIntroduce: false,
      isConsultinge: false,
      isActivities: true,
    });
  },

  loadAllConsultinges: function (baseId) {
    let op = this;
    // 加载咨询信息列表
    app.getUrl('/base/consultingeList/' + baseId, function (data) {
      if (app.hasData(data)) {
        for (let i = 0; i < data.length; i++) {
          data[i].lastString = util.formatDateToDay(data[i].lastString);
        }
        op.setData({
          consultingeList: data,
        });
      }
    });
  },

  oneBusiness: function (id, follow) {
    var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
      id: id,
      follow: follow
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  jumpBusiness: function (event) {
    var op = this;
    var userId = app.getUserId();
    var card = event.currentTarget.dataset.card;
    if (userId != -1) {
      app.getUrl('/business/hasFollowed/' + userId + '-' + card, function (data) {
        if (app.hasData(data)) {
          var follow = data;
          op.oneBusiness(card, follow);
        } else {
          op.oneBusiness(card, 0);
        }
      });
    } else {
      op.oneBusiness(card, 0);
    }
  },

  toConsultinge: function (e) {
    let op = this;
    op.setData({
      isIntroduce: false,
      isConsultinge: true,
      isActivities: false,
    });
  },

  confirm: function (e) {
    let op = this;
    op.reserve(e);
  },

  onGotUserInfo: function (e) {
    var op = this;
    app.onGotUserInfo(e, function () {
      op.setData({
        isConfirmShow: true,
      });
    });
  },

  reserve: function (event) {
    var card = wx.getStorageSync('id');
    if (card == '') {
      app.onGotUserInfo(e, function () {
        var id = app.getUserId();
        op.setData({
          card: id
        });
      });
      return;
    }
    var op = this;
    let templateId = op.data.templateId;
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        console.log(res);
        // 如果用户点击允许
        if (res[templateId] == 'accept') {
          console.log('点击了允许');
          app.post('/base/reserve', {
            baseId: op.data.id,
            cardId: card,
            authClick: true,
            openId: app.globalData.openId,
          }, function (data) {
            if (app.hasData(data)) {
              var allUrl = util.fillUrlParams('/pages/business/success', {
                id: op.data.id,
                type: 5,
                name: op.data.name,
              });
              wx.navigateTo({
                url: allUrl
              });
            } else {
              wx.showToast({
                title: '预订失败',
              })
            }
          });
        } else {
          console.log('点击了取消');
          app.post('/base/reserve', {
            baseId: op.data.id,
            cardId: card,
            authClick: false,
          }, function (data) {
            if (app.hasData(data)) {
              var allUrl = util.fillUrlParams('/pages/business/success', {
                id: op.data.id,
                type: 5,
                name: op.data.name,
              });
              wx.navigateTo({
                url: allUrl
              });
            } else {
              wx.showToast({
                title: '预订失败',
              })
            }
          });
        }
      },
      fail: (res) => {
        console.log('操作失败', res);
      },
      complete: (res) => {
        console.log('一定操作', res);
        //runFunction();
      }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let op = this;
    let id = options.id;
    let name = options.name;
    let topic_type_id = options.topic_type_id;
    let topic_type = JSON.parse(options.topic_type);
    let price = options.price;
    let open_time = options.open_time;
    let traffic = options.traffic;
    let workaddress = options.workaddress;
    let official_account_name = options.official_account_name;
    let introduce = options.introduce;
    let card_id = options.card_id;
    let main_image = options.main_image;
    let longitude = options.longitude;
    let latitude = options.latitude;
    let level = options.level;
    let card_name = options.card_name;
    let city = options.city;
    let district = options.district;
    let levelId = options.levelId;
    let districtName = options.districtName;
    let number = options.number;

    this.setData({
      id: id,
      name: name,
      topic_type_id: topic_type_id,
      topic_type: topic_type,
      price: price,
      open_time: open_time,
      traffic: traffic,
      workaddress: workaddress,
      official_account_name: official_account_name,
      introduce: introduce,
      card_id: card_id,
      main_image: main_image,
      longitude: longitude,
      latitude: latitude,
      level: level,
      card_name: card_name,
      city: city,
      district: district,
      levelId: levelId,
      districtName: districtName,
      number: number,
    });

    op.loadAllConsultinges(id);

    // 加载图片列表
    app.post('/base/pictureList', {
      id: id,
    }, function (data) {
      if (app.hasData(data)) {
        for (let i = 0; i < data.length; i++) {
          data[i].src = app.qinzi + data[i].src;
        }
        op.setData({
          pictureList: data || [],
        });
      }
    });

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
    let op = this;
    op.loadAllConsultinges(op.data.id);
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
    var allUrl = util.fillUrlParams('/pages/base/oneBase', {
      id: op.data.id,
      name: op.data.name,
      topic_type_id: op.data.topic_type_id,
      topic_type: JSON.stringify(op.data.topic_type),
      price: op.data.price,
      open_time: op.data.open_time,
      traffic: op.data.traffic,
      workaddress: op.data.workaddress,
      official_account_name: op.data.official_account_name,
      introduce: op.data.introduce,
      activities: op.data.activities,
      consulting: op.data.consulting,
      card_id: op.data.card_id,
      card_name: op.data.card_name,
      main_image: op.data.main_image,
      longitude: op.data.longitude,
      latitude: op.data.latitude,
      level: op.data.level,
      city: op.data.city,
      district: op.data.district,
      districtName: op.data.districtName,
      levelId: op.data.levelId,
      consultingeList: op.data.consultingeList,

      isConfirmShow: op.data.isConfirmShow,
      isIntroduce: op.data.isIntroduce,
      isActivities: op.data.isActivities,
      isConsultinge: op.data.isConsultinge,
      pictureList: op.data.pictureList,
    });

    return {
      title: '分享了一个活动基地！',
      path: allUrl,
      success: function (res) {
        console.log(res)
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})