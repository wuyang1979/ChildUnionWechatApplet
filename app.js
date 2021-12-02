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
    //正式版检测小程序是否有新版本
    if (wx.canIUse("getUpdateManager")) {
      const updateManager = wx.getUpdateManager();
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          updateManager.onUpdateReady(function () {
            wx.showModal({
              title: "更新提示",
              content: "新版本已经准备好，是否重启应用？",
              success(res) {
                if (res.confirm) {
                  // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                  updateManager.applyUpdate();
                }
              }
            });
          });
          updateManager.onUpdateFailed(function () {
            // 新的版本下载失败
            wx.showModal({
              title: "已经有新版本了哟~",
              content: "新版本已经上线啦~，请您删除当前小程序，重新搜索打开哟~"
            });
          });
        }
      });
    } else {
      wx.showModal({
        title: "提示",
        content: "当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。"
      });
    }

    // 登录
    wx.login({
      success: res => {
        var code = res.code;
        if (code) {
          this.userCode = code;
        } else {
          console.log('获取用户登录态失败：' + res.errMsg);
        }

        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        //console.log(res);
      }
    });
    if (wx.getUserProfile) {
      this.canIUseGetUserProfile = true
    }
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
        console.log(res);
      },
      complete: (res) => {
        console.log(res);
      }
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
      url: '/pages/my/type'
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
                  title: '完善信息',
                  content: '请完善个人信息,谢谢',
                  success: function (res) {
                    console.log(res)
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
                    if (op.hasData(data)) {
                      console.log("更新头像成功");
                    } else {
                      console.log("更新头像失败");
                    }
                  })
                }
                getFunction();
              }
            }
          });
        });
      } else {
        op.getUrl('/business/info/code/' + op.newOpenId, function (data) {
          if (op.hasData(data)) {
            if (data == null || data == -1) {
              wx.showModal({
                title: '完善信息',
                content: '请完善个人信息,谢谢',
                success: function (res) {
                  console.log(res)
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
        console.log("批量新增formId：" + data);
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
        console.log(res);
        // 如果用户点击允许
        if (res[templateId] == 'accept') {
          console.log('点击了允许');
        } else {
          console.log('点击了取消');
        }
      },
      fail: (res) => {
        console.log('操作失败', res);
      },
      complete: (res) => {
        console.log('一定操作', res);
        //runFunction();
      }
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
  }
})