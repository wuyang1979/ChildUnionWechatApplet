var util = require('../../utils/util.js');
const app = getApp()
import businessTemp from '../common/businessTemp';

Page({
  data: {
    // 轮播URL和图片用来做广告栏
    imgUrls: [

      {
        link: '/pages/business/banner/banner1',
        url: "/pages/img/qinghuaci_banner.jpeg",
        isTab: true
      }, {
        link: '/pages/join/classList',
        url: "/pages/img/banner2.png",
        isTab: false
      }, {
        link: '/pages/my/invite',
        url: "/pages/img/invite.jpg",
        isTab: false
      }

    ],

    oneBusiness: {},
    tagList: [],
    needShow: false,
    // 轮播控制项
    indicatorDots: true,
    autoplay: true,
    interval: 3000, // 轮播间隔
    duration: 1000,
    num: 1,
    cost: 0,
    vipCost: 0,

    selectTxt: '行业',

    businessList: [],
    signCount: 0,

    start: 0,
    firstTagStart: 0,
    pageSize: 30,
    hasMoreData: true,
    firstTagHasMoreData: true,
    qinziBusinessesShowFlag: true,
    qinziCommunitiesShowFlag: false,

    inputShowed: false,
    needSign: true,
    searchValue: "",

    tag: -1,
    id: -1,

    isSelectIndustryShow: false,
    cityCode: 0,
    cityName: '',
    industryName: '行业',
    subserviceId: 11,
    subServiceList: [],

    formIdArray: [],

    countDisplayCards: 1000,

    isIos: false,
    iosJoinFlag: false,

    needRefreshFlag: false,
  },

  oneBusiness: businessTemp.oneBusiness,
  onGotUserInfo: businessTemp.onGotUserInfo,
  addFollower: businessTemp.addFollower,
  getSeeCardRecord: businessTemp.getSeeCardRecord,
  addSeeCardRecord: businessTemp.addSeeCardRecord,

  saveFormId: function (v) {
    app.formIdInput(v, this);
  },

  businessesLab: function (e) {
    let op = this;
    op.setData({
      qinziBusinessesShowFlag: true,
      qinziCommunitiesShowFlag: false
    });
  },

  join: function (e) {

    var op = this;
    var res = wx.getSystemInfoSync();
    if ('ios' == res.platform) {
      op.setData({
        iosJoinFlag: true,
      });
      return;
    }
    var card = wx.getStorageSync('id');
    if (card == '') {
      app.onGotUserInfo(e, function () {
        var id = app.getUserId();
        op.setData({
          id: id
        });
      });
      return;
    }

    let cost, vipCost;
    let index = e.currentTarget.dataset.index;
    switch (index) {
      case "1":
        cost = 500;
        vipCost = 250;
        break;
      case "2":
        cost = 500;
        vipCost = 250;
        break;
      case "3":
        cost = 400;
        vipCost = 200;
        break;
      case "4":
        cost = 10;
        vipCost = 5;
        break;
      case "5":
        cost = 200;
        vipCost = 100;
        break;
    }
    op.setData({
      cost: cost,
      vipCost: vipCost
    });

    var price;

    // 会员价
    if (op.data.oneBusiness.leaguer == 1) {
      price = op.data.vipCost;
    } else {
      price = op.data.cost;
    }

    app.post('/rechargeOrder/data', {
      cardId: card,
      price: price,
      num: op.data.num,
      total: price,
      body: '亲子社群订单',
    }, function (data) {
      if (typeof data == 'number') {
        var allUrl = util.fillUrlParams('/pages/campaign/scoreOrder', {
          id: data,
          communityIndex: index,
          type: 3,
        });
        wx.navigateTo({
          url: allUrl
        });
      } else {
        wx.showToast({
          title: '订单创建失败',
        })
      }
    });
  },

  close: function (e) {
    let op = this;
    op.setData({
      iosJoinFlag: false,
    });
  },

  communitiesLab: function (e) {
    let op = this;
    op.setData({
      qinziBusinessesShowFlag: false,
      qinziCommunitiesShowFlag: true
    });
  },

  sign: function (e) {
    var op = this;
    this.saveFormId(e);
    app.batchAddFormId(op);
    app.onGotUserInfo(e, function () {
      var id = app.getUserId();
      op.setData({
        id: id
      });
      op.sign2Server(op.data.id);
    });
  },

  loadSign: function (id) {
    if (id == -1) return;
    var op = this;
    op.data.signCount = 0;
    // 加载一个商户
    app.getUrl('/business/hasSigned/' + id, function (data) {
      if (app.hasData(data)) {
        if (data == null) return;
        op.data.signCount++;
        if (data == 1) {
          op.setData({
            needSign: false
          });
        } else {
          op.setData({
            needSign: true
          });
        }
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
      }
    });
  },

  sign2Server: function (id) {
    var op = this;
    app.getUrl('/business/hasSigned/' + id, function (data) {
      if (app.hasData(data)) {
        if (data == null) return;
        op.data.signCount++;
        if (data == 1) {
          op.setData({
            needSign: false
          });
          if (op.data.signCount < 2) {
            if (!op.data.needSign) {
              wx.showToast({
                title: '已签到',
                icon: 'success',
                duration: 2000
              });
            }
          }
        } else {
          op.setData({
            needSign: true
          });
          // 加载一个商户
          app.getUrl('/business/sign/' + id, function (data) {
            if (app.hasData(data)) {
              op.refresh();
              if (op.data.signCount < 2) {
                if (op.data.needSign) {
                  wx.showToast({
                    title: '亲子币+10',
                    icon: 'success',
                    duration: 2000
                  });
                }
              }
            }
          });
        }
        // if (op.data.signCount < 2) {
        //   if (op.data.needSign) {
        //     wx.showToast({
        //       title: '亲子币+10',
        //       icon: 'success',
        //       duration: 2000
        //     });
        //   } else {
        //     wx.showToast({
        //       title: '已签到',
        //       icon: 'success',
        //       duration: 2000
        //     });
        //   }
        // }
      }
    });
  },

  refresh: function () {
    var op = this;
    var id = app.getUserId();
    this.setData({
      id: id
    });
    this.loadOneBusiness(id);
    this.loadSign(id);
  },


  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },

  clearInput: function () {
    this.refreshAllBusiness();
  },

  inputTyping: function (e) {
    this.setData({
      searchValue: e.detail.value
    });
  },

  searchSubmit: function (e) {
    this.setData({
      businessList: [],
      start: 0,
      hasMoreData: true,
      inputShowed: false
    });
    this.loadAllBusiness();
  },

  selectCity: function (event) {
    var tag = this.data.tag;
    var allUrl = util.fillUrlParams('./citys', {
      sourceTab: 1,
      sourcePage: '/pages/business/list'
    });
    wx.navigateTo({
      url: allUrl,
    });
  },

  selectType: function (event) {
    var tag = this.data.tag;
    var allUrl = util.fillUrlParams('./typeSelect', {
      tagId: tag
    });
    wx.navigateTo({
      url: allUrl,
    });
  },

  selectAll: function (event) {
    this.setData({
      selectTxt: '行业',
      tag: -1,
    });
    this.refreshAllBusiness();
  },

  refreshAllBusiness: function () {
    this.setData({
      businessList: [],
      start: 0,
      hasMoreData: true,
      searchValue: "",
      inputShowed: false,
    });
    this.loadAllBusiness();
  },

  loadBusinessCount: function (city) {
    var op = this;
    app.getUrl('/business/count/' + city, function (data) {
      if (app.hasData(data)) {
        op.setData({
          countDisplayCards: data,
        });
      }
    });
  },

  loadAllBusiness: function () {
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    var businessList = this.data.businessList;
    // 加载商户
    app.post('/business/list', {
      id: id,
      start: op.data.start,
      num: op.data.pageSize,
      search: op.data.searchValue,
      tag: op.data.tag,
      city: op.data.cityCode
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            businessList: businessList.concat(data),
            hasMoreData: false
          });
        } else {
          op.setData({
            businessList: businessList.concat(data),
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
    });
  },

  loadSelectAllBusinessByFirstTagId: function () {
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    let businessList = op.data.businessList;
    // 加载商户
    app.post('/business/selectBusinessListByFirstTagId', {
      id: id,
      tag: op.data.tag,
      city: op.data.cityCode,
      start: op.data.firstTagStart,
      num: op.data.pageSize,
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            businessList: businessList.concat(data),
            firstTagHasMoreData: false
          });
        } else {
          op.setData({
            businessList: businessList.concat(data),
            firstTagHasMoreData: true,
            firstTagStart: op.data.firstTagStart + op.data.pageSize
          })
        }
      }
    });
  },

  loadSelectAllBusiness: function () {
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    // 加载商户
    app.post('/business/selectIndustryList', {
      id: id,
      search: op.data.searchValue,
      tag: op.data.tag,
      city: op.data.cityCode
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            businessList: data,
            hasMoreData: false
          });
        } else {
          op.setData({
            businessList: data,
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
    });
  },

  loadCity: function () {
    var op = this;
    app.loadCity(function (city) {
      op.setData({
        cityCode: city.cityCode,
        cityName: city.cityName
      });
      // op.refreshAllBusiness();
    })
  },

  getTagList: function (e) {
    let op = this;
    app.post("/business/getTagList", {}, function (data) {
      if (app.hasData(data)) {
        let teachTagList = [],
          activityTagList = [],
          lifeTagList = [],
          baseTagList = [],
          otherTagList = [];
        for (let i = 0; i < data.length; i++) {
          if (data[i].subservice_id == 11) {
            teachTagList.push(data[i]);
          } else if (data[i].subservice_id == 12) {
            activityTagList.push(data[i]);
          } else if (data[i].subservice_id == 13) {
            lifeTagList.push(data[i]);
          } else if (data[i].subservice_id == 14) {
            baseTagList.push(data[i]);
          } else if (data[i].subservice_id == 15) {
            otherTagList.push(data[i]);
          }
        }
        let teachAllTag = {
          service_id: 1,
          service_name: "服务类",
          subservice_id: 11,
          subservice_name: "教育",
          tag_id: 11,
          tag_name: "全部"
        }
        let activityAllTag = {
          service_id: 1,
          service_name: "服务类",
          subservice_id: 12,
          subservice_name: "亲子活动",
          tag_id: 12,
          tag_name: "全部"
        }
        let lifeAllTag = {
          service_id: 1,
          service_name: "服务类",
          subservice_id: 13,
          subservice_name: "亲子生活",
          tag_id: 13,
          tag_name: "全部"
        }
        let baseAllTag = {
          service_id: 1,
          service_name: "服务类",
          subservice_id: 14,
          subservice_name: "亲子基地",
          tag_id: 14,
          tag_name: "全部"
        }
        teachTagList.unshift(teachAllTag);
        activityTagList.unshift(activityAllTag);
        lifeTagList.unshift(lifeAllTag);
        baseTagList.unshift(baseAllTag);

        op.setData({
          teachTagList: teachTagList,
          activityTagList: activityTagList,
          lifeTagList: lifeTagList,
          baseTagList: baseTagList,
          otherTagList: otherTagList,
        })
      }
    });
  },

  getSubServiceList: function (e) {
    let op = this;
    app.post("/business/getSubServiceList", {}, function (data) {
      if (app.hasData(data)) {
        let allSubService = {
          'subservice_id': 0,
          'subservice_name': '全部行业'
        };
        data.unshift(allSubService);
        op.setData({
          subServiceList: data
        })
      }
    });
  },

  selectIndustry: function (e) {
    let op = this;
    op.setData({
      isSelectIndustryShow: !op.data.isSelectIndustryShow,
    })
  },

  chooseSubService: function (e) {
    let op = this;
    let subserviceId = e.currentTarget.dataset.subservice_id;
    if (subserviceId == 0) {
      op.setData({
        industryName: "全部行业",
        isSelectIndustryShow: false,
        tag: -1,
      })
      op.refreshAllBusiness();
    }
    op.setData({
      subserviceId: subserviceId,
    })
  },

  chooseTag: function (e) {
    let op = this;
    let tagId = e.currentTarget.dataset.tag_id;
    let tagName = e.currentTarget.dataset.tag_name;

    if (tagId == 11) {
      tagName = "教育";
    } else if (tagId == 12) {
      tagName = "亲子活动";
    } else if (tagId == 13) {
      tagName = "亲子生活";
    } else if (tagId == 14) {
      tagName = "亲子基地";
    }

    op.setData({
      industryName: tagName,
      tag: tagId,
      isSelectIndustryShow: false,
      firstTagStart: 0,
      businessList: [],
    })
    if (tagId == 11 || tagId == 12 || tagId == 13 || tagId == 14) {
      op.loadSelectAllBusinessByFirstTagId();
    } else {
      op.loadSelectAllBusiness();
    }
  },

  onLoad: function (options) {
    let op = this;
    var res = wx.getSystemInfoSync();
    if ('ios' == res.platform) {
      op.setData({
        isIos: true,
      });
    }
    let findContactsFlag = getApp().globalData.findContactsFlag || false;
    let findCommunitiesFlag = getApp().globalData.findCommunitiesFlag || false;
    if (findContactsFlag) {
      this.setData({
        qinziBusinessesShowFlag: true,
        qinziCommunitiesShowFlag: false,
      })
    }
    if (findCommunitiesFlag) {
      this.setData({
        qinziBusinessesShowFlag: false,
        qinziCommunitiesShowFlag: true,
      })
    }
    if (!!options.tagId) {
      this.setData({
        tag: options.tagId,
        selectTxt: options.tagName
      });
    }
    // 由公众号跳转过来
    if (!!options.cityCode) {
      this.setData({
        cityCode: options.cityCode,
        cityName: options.cityName
      });
      //this.loadAllBusiness();
    } else {
      //this.setData({ cityCode: 220, cityName: '南京' });
      this.setData({
        cityCode: -1,
        cityName: '全国'
      });
      //this.loadCity();
    }
    this.loadAllBusiness();
    this.loadBusinessCount(-1);
    this.refresh();
    this.getTagList();
    this.getSubServiceList();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let op = this;
    var res = wx.getSystemInfoSync();
    if ('ios' == res.platform) {
      op.setData({
        isIos: true,
      });
    }
    let findContactsFlag = getApp().globalData.findContactsFlag || false;
    let findCommunitiesFlag = getApp().globalData.findCommunitiesFlag || false;
    if (findContactsFlag) {
      this.setData({
        qinziBusinessesShowFlag: true,
        qinziCommunitiesShowFlag: false,
      })
    }
    if (findCommunitiesFlag) {
      this.setData({
        qinziBusinessesShowFlag: false,
        qinziCommunitiesShowFlag: true,
      })
    }
    if (app.globalData.listDataUpdated) {
      op.refreshAllBusiness();
      app.globalData.listDataUpdated = false;
    }
    // if (wx.getStorageSync('city') == '') {
    //   this.loadCity();
    // }
    // this.refresh();
    if (op.data.needRefreshFlag) {
      if (op.data.cityCode == -1 && op.data.tag == -1) {
        op.refreshAllBusiness();
      } else {
        op.loadSelectAllBusiness();
      }

    }
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.refreshAllBusiness();
    this.refresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.tag == 11 || this.data.tag == 12 || this.data.tag == 13 || this.data.tag == 14) {
      if (this.data.firstTagHasMoreData) {
        this.loadSelectAllBusinessByFirstTagId();
      } else {
        wx.showToast({
          title: '没有更多数据',
          duration: 500,
        })
      }
    } else {
      if (this.data.hasMoreData) {
        this.loadAllBusiness();
      } else {
        wx.showToast({
          title: '没有更多数据',
          duration: 500,
        })
      }
      this.refresh();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }

})