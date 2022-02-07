//app.js

// import 'umtrack-wx';

App({
  qinzi: "https://www.qinzi123.com",
  userCode: "0",
  newOpenId: "",
  canIUseGetUserProfile: false,

  // umengConfig: {
  //   appKey: '618cd2e1e014255fcb756bc0', //由友盟分配的APP_KEY
  //   // 使用Openid进行统计，此项为false时将使用友盟+uuid进行用户统计。
  //   // 使用Openid来统计微信小程序的用户，会使统计的指标更为准确，对系统准确性要求高的应用推荐使用Openid。
  //   useOpenid: true,
  //   // 使用openid进行统计时，是否授权友盟自动获取Openid，
  //   // 如若需要，请到友盟后台"设置管理-应用信息"(https://mp.umeng.com/setting/appset)中设置appId及secret
  //   autoGetOpenid: true,
  //   debug: true, //是否打开调试模式
  //   uploadUserInfo: true // 自动上传用户信息，设为false取消上传，默认为false
  // },

  onLoad() {
    var self = this
    // 获取小程序更新机制兼容
    if (wx.canIUse('getUpdateManager')) {
      const updateManager = wx.getUpdateManager()
      //1. 检查小程序是否有新版本发布
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //检测到新版本，需要更新，给出提示
          wx.showModal({
            title: '更新提示',
            content: '检测到新版本，是否下载新版本并重启小程序？',
            success: function (res) {
              if (res.confirm) {
                //2. 用户确定下载更新小程序，小程序下载及更新静默进行
                self.downLoadAndUpdate(updateManager)
              } else if (res.cancel) {
                //用户点击取消按钮的处理，如果需要强制更新，则给出二次弹窗，如果不需要，则这里的代码都可以删掉了
                wx.showModal({
                  title: '温馨提示~',
                  content: '本次版本更新涉及到新的功能添加，旧版本无法正常访问的哦~',
                  showCancel: false, //隐藏取消按钮
                  confirmText: "确定更新", //只保留确定更新按钮
                  success: function (res) {
                    if (res.confirm) {
                      //下载新版本，并重新应用
                      self.downLoadAndUpdate(updateManager)
                    }
                  }
                })
              }
            }
          })
        }
      })
    } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }

    //新增小程序访问次数
    this.post("/start/addVisitCount", {}, function (data) {

    })

    // 登录
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          this.userCode = code;
          this.globalData.userCode = code;
        } else {}

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    });
    if (wx.getUserProfile) {
      this.canIUseGetUserProfile = true
    }
  },

  /**
   * 下载小程序新版本并重启应用
   */
  downLoadAndUpdate: function (updateManager) {
    var self = this
    wx.showLoading();
    //静默下载更新小程序新版本
    updateManager.onUpdateReady(function () {
      wx.hideLoading()
      //新的版本已经下载好，调用 applyUpdate 应用新版本并重启
      updateManager.applyUpdate()
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
      wx.showModal({
        title: '已经有新版本了哟~',
        content: '新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~',
      })
    })
  },

  getUserProfileForLuckDraw(e, getFunction) {
    wx.getUserProfile({
      desc: '用于报名抽奖', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.globalData.userInfo = res.userInfo;
        this.globalData.hasUserInfo = true;
        getFunction();
      },
      fail: (res) => {
        wx.switchTab({
          url: '/pages/cooperate/list',
        })
        wx.showToast({
          title: '请点允许继续',
        })
      },
      complete: (res) => {}
    })
  },

  getUserProfile(e, getFunction) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.globalData.userInfo = res.userInfo;
        this.globalData.hasUserInfo = true;
        this.onGotUserInfoV1(e, getFunction);
      },
      fail: (res) => {

        wx.switchTab({
          url: '/pages/cooperate/list',
        })
        wx.showToast({
          title: '请点允许继续',
        })
      },
      complete: (res) => {}
    })
  },


  login: function () {

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },

  onLaunch: function () {
    //this.login();
    this.onLoad();
  },

  post: function (loadUrl, postData, func) {
    wx.request({
      url: this.qinzi + loadUrl,
      data: postData,
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data.code) {
          if (res.data.code != "00000000") {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });
          } else {
            func(res.data.data);
          }
        } else
          func(res.data);
      }
    })
  },

  getUrl: function (loadUrl, func) {
    wx.request({
      url: this.qinzi + loadUrl,
      method: "GET",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (!!res.data.code) {
          if (res.data.code != "00000000") {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 2000
            });
          } else {
            func(res.data.data);
          }
        } else
          func(res.data);
      }
    })
  },

  deleteUrl: function (loadUrl, func) {
    wx.request({
      url: this.qinzi + loadUrl,
      method: "DELETE",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        func(res.data.data);
      }
    })
  },

  modifyCard: function () {
    wx.navigateTo({
      url: '/pages/my/info'
    });
  },

  onGotUserInfoV1: function (e, getFunction) {
    //this.globalData.userInfo = e.detail.userInfo;
    if (this.getUserId() != -1) {
      getFunction();
      return;
    }
    if (this.globalData.userInfo != null) {
      var op = this;
      if (op.newOpenId == "") {
        op.getUrl('/business/info/getOpenId/' + op.userCode, function (data) {
          op.newOpenId = data.openid;
          op.globalData.openId = data.openid;
          op.getUrl('/business/info/code/' + op.newOpenId, function (data) {
            if (op.hasData(data)) {
              if (data == null || data == -1) {
                wx.showModal({
                  title: '提示',
                  content: '请注册会员信息',
                  success: function (res) {
                    if (res.confirm) {
                      op.modifyCard();
                    }
                  }
                });
              } else {
                wx.setStorageSync('id', data);
                if (op.globalData.userInfo.avatarUrl != null) {
                  op.post("/business/updateHeadingImgUrl", {
                    id: data,
                    headingImgUrl: op.globalData.userInfo.avatarUrl,
                  }, function (data) {
                    if (op.hasData(data)) {} else {}
                  })
                }
                getFunction();
              }
            }
          });
        });
      } else {
        op.globalData.openId = op.newOpenId;
        op.getUrl('/business/info/code/' + op.newOpenId, function (data) {
          if (op.hasData(data)) {
            if (data == null || data == -1) {
              wx.showModal({
                title: '提示',
                content: '请注册会员信息',
                success: function (res) {
                  if (res.confirm) {
                    op.modifyCard();
                  }
                }
              });
            } else {
              wx.setStorageSync('id', data);
              getFunction();
            }
          }
        });
      }


    }
  },

  luckDrawOnGotUserInfo: function (e, func) {
    let op = this;
    if (op.globalData.joinerOpenId == "") {
      op.getUrl('/business/info/getOpenId/' + op.globalData.userCode, function (data) {
        if (op.hasData(data)) {
          op.globalData.joinerOpenId = data.openid;
          if (Object.keys(op.globalData.userInfo) == 0) {
            op.getUserProfileForLuckDraw(e, func);
          } else {
            func();
          }
        }
      })
    } else {
      if (Object.keys(this.globalData.userInfo) == 0) {
        this.getUserProfileForLuckDraw(e, func);
      } else {
        func();
      }
    }
  },

  onGotUserInfo: function (e, func) {
    if (Object.keys(this.globalData.userInfo) == 0)
      this.getUserProfile(e, func);
    else
      this.onGotUserInfoV1(e, func);
  },

  isLeaguerFunc: function (func) {
    var op = this;
    //var score = wx.getStorageSync('score');
    var leaguer = wx.getStorageSync('leaguer');
    if (leaguer == '') {
      if (this.getUserId() == -1) {
        func(false);
      } else {
        this.getUrl('/business/info/' + this.getUserId(), function (data) {
          if (op.hasData(data)) {
            if (data == null || data.length == 0) return;
            // 因为积分动态更新,使用缓存的话,需要在多个积分的地方增加更新缓存,暂不考虑缓存
            //wx.setStorageSync('score', data[0].score);
            //func(data[0].score >= 2000);
            func(data[0].leaguer == 1);
          }
        });
      }
    } else {
      //func(score >= 2000);
      func(leaguer == 1);
    }
    return;
  },

  formIdInput: function (v, op) {
    var formId = v.detail.formId == 'the formId is a mock one' ? '0' : v.detail.formId;
    if (op.data.formIdArray.indexOf(formId) < 0)
      op.data.formIdArray.push(formId);
  },

  batchAddFormId: function (op) {
    if (!!op.data.formIdArray) {
      if (op.data.formIdArray.length == 0) return;
      var idList = op.data.formIdArray.join(",");
      this.post('/formList/' + this.getUserId() + '-' + idList, {}, function (data) {
        op.setData({
          formIdArray: []
        });
      });
    }
  },

  getAuth2PushMessage: function (templateId) {
    //var templateId = 'Ite6-mnfTlONu6rd35AJ-SGQYKQgj1WMvjVj0O5h9kE'
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        // 如果用户点击允许
        if (res[templateId] == 'accept') {} else {}
      },
      fail: (res) => {},
      complete: (res) => {}
    })
  },

  // 后续要重构采用 result{code: msg: data}这种结构返回
  hasData: function (data) {
    if (data == undefined || data == null) return false;
    if (!!data.code && data.code != "00000000") return false;
    return true;
  },

  joinConfirm: function (event, func) {
    if (event.type != "getuserinfo") return;
    if (this.isAuth(event)) {
      func();
    } else {
      wx.showModal({
        title: '用户未授权',
        content: '拒绝授权后,将无法发起拼班和参与拼班,  请您确认后重新操作,并允许授权',
        confirmText: '确认',
        showCancel: false,
        success: function (res) {}
      })
    }
  },

  getUserId: function () {
    var id = wx.getStorageSync('id');
    return id == '' ? -1 : id;
    //return 26;
  },

  loadCity: function (setCity) {
    var defaultCity = {
      cityCode: 220,
      cityName: '南京'
    };
    if (this.getUserId() == -1)
      setCity(defaultCity);
    var cityCode = wx.getStorageSync('city');
    var op = this;
    if (cityCode == '') {
      this.getUrl('/business/info/' + this.getUserId(), function (data) {
        if (op.hasData(data)) {
          if (data != null && data.length > 0) {
            cityCode = data[0].city;
            if (!!cityCode) {
              op.getUrl('/business/oneCity/' + cityCode, function (data1) {
                if (op.hasData(data1)) {
                  wx.setStorageSync('city', cityCode);
                  wx.setStorageSync('cityName', data1.cityName);
                  setCity({
                    cityCode: cityCode,
                    cityName: data1.cityName
                  });
                }
              });
            }
          }
        }
      });
    } else {
      setCity({
        cityCode: cityCode,
        cityName: wx.getStorageSync('cityName')
      });
    }
  },

  globalData: {
    userInfo: {},
    hasUserInfo: false,
    listDataUpdated: false,
    messageDataUpdated: false,
    messageBussinessUpdated: false,
    openId: "",
    userCode: "",
    joinerOpenId: "",
  }
})