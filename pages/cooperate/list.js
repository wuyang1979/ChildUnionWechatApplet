var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    followerTemplateId: '01EMtrNhQzLgkppeVZf0PtmoOk812HevdmwKDZQqkUE',
    cardMessageTemplateId: 'uwhiRcacULuqIySAIE8salPOKd3muX8GIAorF4_b8kk',
    bannerDefault: '/pages/cooperate/banner',
    messageList: [],
    latestEstablishmentList: [],
    start: 0,
    pageSize: 10,
    latestEstablishmentPageSize: 10,
    hasMoreData: true,
    cooperationScrollTop: 0,
    releaseFlag: false,

    // 轮播URL和图片用来做广告栏
    imgUrls: [],
    // 轮播控制项
    indicatorDots: true,
    autoplay: true,
    interval: 3000, // 轮播间隔
    duration: 1000,
    qinzi: app.qinzi,
    campaigns: [],

    visitCount: -1,
    businessCount: -1,
    establishmentCount: -1,
  },

  moreActivities: function (e) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      app.onGotUserInfo(e, function () {});
      return;
    }

    let followerTemplateId = op.data.followerTemplateId;
    let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
              var allUrl = util.fillUrlParams('/pages/campaign/list', {});
              wx.navigateTo({
                url: allUrl
              });
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
                var allUrl = util.fillUrlParams('/pages/campaign/list', {});
                wx.navigateTo({
                  url: allUrl
                });
              }
            })
          } else {
            var allUrl = util.fillUrlParams('/pages/campaign/list', {});
            wx.navigateTo({
              url: allUrl
            });
          }
        }
      }
    })
  },

  moreCooperations: function (e) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      app.onGotUserInfo(e, function () {});
      return;
    }

    let followerTemplateId = op.data.followerTemplateId;
    let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
              var allUrl = util.fillUrlParams('/pages/cooperate/marketNews', {});
              wx.navigateTo({
                url: allUrl
              });
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
                var allUrl = util.fillUrlParams('/pages/cooperate/marketNews', {});
                wx.navigateTo({
                  url: allUrl
                });
              }
            })
          } else {
            var allUrl = util.fillUrlParams('/pages/cooperate/marketNews', {});
            wx.navigateTo({
              url: allUrl
            });
          }
        }
      }
    })
  },

  translateMessageType: function (value) {
    return util.translateMessageType(value);
  },

  findContacts: function (e) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      app.globalData.findContactsFlag = true;
      wx.navigateTo({
        url: '/pages/business/list',
      })
    } else {

      let followerTemplateId = op.data.followerTemplateId;
      let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
                app.globalData.findContactsFlag = true;
                wx.navigateTo({
                  url: '/pages/business/list',
                })
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
                  app.globalData.findContactsFlag = true;
                  wx.navigateTo({
                    url: '/pages/business/list',
                  })
                }
              })
            } else {
              app.globalData.findContactsFlag = true;
              wx.navigateTo({
                url: '/pages/business/list',
              })
            }
          }
        }
      })
    }
  },

  findCommunities: function (e) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      app.globalData.findCommunitiesFlag = true;
      wx.navigateTo({
        url: '/pages/business/list',
      })
    } else {

      let followerTemplateId = op.data.followerTemplateId;
      let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
                app.globalData.findCommunitiesFlag = true;
                wx.navigateTo({
                  url: '/pages/business/list',
                })
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
                  app.globalData.findCommunitiesFlag = true;
                  wx.navigateTo({
                    url: '/pages/business/list',
                  })
                }
              })
            } else {
              app.globalData.findCommunitiesFlag = true;
              wx.navigateTo({
                url: '/pages/business/list',
              })
            }
          }
        }
      })
    }
  },

  findKnowledge: function (e) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      wx.navigateTo({
        url: '/pages/knowledge/list',
      })
    } else {

      let followerTemplateId = op.data.followerTemplateId;
      let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
                wx.navigateTo({
                  url: '/pages/knowledge/list',
                })
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
                  wx.navigateTo({
                    url: '/pages/knowledge/list',
                  })
                }
              })
            } else {
              wx.navigateTo({
                url: '/pages/knowledge/list',
              })
            }
          }
        }
      })
    }
  },

  findCooperations: function (e) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      var allUrl = util.fillUrlParams('/pages/cooperate/marketNews', {});
      wx.navigateTo({
        url: allUrl
      });
    } else {

      let followerTemplateId = op.data.followerTemplateId;
      let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
                var allUrl = util.fillUrlParams('/pages/cooperate/marketNews', {});
                wx.navigateTo({
                  url: allUrl
                });
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
                  var allUrl = util.fillUrlParams('/pages/cooperate/marketNews', {});
                  wx.navigateTo({
                    url: allUrl
                  });
                }
              })
            } else {
              var allUrl = util.fillUrlParams('/pages/cooperate/marketNews', {});
              wx.navigateTo({
                url: allUrl
              });
            }
          }
        }
      })
    }
  },

  findBases: function (e) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      var allUrl = util.fillUrlParams('/pages/base/list', {});
      wx.navigateTo({
        url: allUrl
      });
    } else {

      let followerTemplateId = op.data.followerTemplateId;
      let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
                var allUrl = util.fillUrlParams('/pages/base/list', {});
                wx.navigateTo({
                  url: allUrl
                });
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
                  var allUrl = util.fillUrlParams('/pages/base/list', {});
                  wx.navigateTo({
                    url: allUrl
                  });
                }
              })
            } else {
              var allUrl = util.fillUrlParams('/pages/base/list', {});
              wx.navigateTo({
                url: allUrl
              });
            }
          }
        }
      })
    }
  },

  findEstablishments: function (e) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      var allUrl = util.fillUrlParams('/pages/establishment/list', {});
      wx.navigateTo({
        url: allUrl
      });
    } else {

      let followerTemplateId = op.data.followerTemplateId;
      let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
                var allUrl = util.fillUrlParams('/pages/establishment/list', {});
                wx.navigateTo({
                  url: allUrl
                });
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
                  var allUrl = util.fillUrlParams('/pages/establishment/list', {});
                  wx.navigateTo({
                    url: allUrl
                  });
                }
              })
            } else {
              var allUrl = util.fillUrlParams('/pages/establishment/list', {});
              wx.navigateTo({
                url: allUrl
              });
            }
          }
        }
      })
    }
  },

  loadBanner: function () {
    var op = this;
    app.getUrl('/banner/list', function (data) {
      if (app.hasData(data)) {
        op.setData({
          imgUrls: data,
        });
      }
    });
  },

  loadMessage: function () {
    var op = this;
    var messageList = this.data.messageList;
    app.post('/cooperate/list', {
      start: op.data.start,
      num: op.data.pageSize,
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
    });
  },

  refreshAllMessage: function () {
    this.setData({
      messageList: [],
      campaigns: [],
      start: 0,
      pageSize: 10,
      hasMoreData: true,
    });
    this.loadMessage();
    this.loadAllCampaign();
  },

  oneMessage: function (event) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      app.onGotUserInfo(event, function () {});
      return;
    }

    let followerTemplateId = op.data.followerTemplateId;
    let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
              for (let i = op.data.messageList.length - 1; i > 0; i--) {
                let randomIndex = Math.floor(Math.random() * (i + 1));
                let itemAtIndex = op.data.messageList[randomIndex];
                op.data.messageList[randomIndex] = op.data.messageList[i];
                op.data.messageList[i] = itemAtIndex;
              }
              var messageList = JSON.stringify(op.data.messageList);

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
                messageList: messageList
              });
              wx.navigateTo({
                url: allUrl
              });
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
                for (let i = op.data.messageList.length - 1; i > 0; i--) {
                  let randomIndex = Math.floor(Math.random() * (i + 1));
                  let itemAtIndex = op.data.messageList[randomIndex];
                  op.data.messageList[randomIndex] = op.data.messageList[i];
                  op.data.messageList[i] = itemAtIndex;
                }
                var messageList = JSON.stringify(op.data.messageList);

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
                  messageList: messageList
                });
                wx.navigateTo({
                  url: allUrl
                });
              }
            })
          } else {
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
            for (let i = op.data.messageList.length - 1; i > 0; i--) {
              let randomIndex = Math.floor(Math.random() * (i + 1));
              let itemAtIndex = op.data.messageList[randomIndex];
              op.data.messageList[randomIndex] = op.data.messageList[i];
              op.data.messageList[i] = itemAtIndex;
            }
            var messageList = JSON.stringify(op.data.messageList);

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
              messageList: messageList
            });
            wx.navigateTo({
              url: allUrl
            });
          }
        }
      }
    })
  },

  goMessage: function () {
    wx.navigateTo({
      url: '/pages/cooperate/message'
    });
  },

  isLeaguerExpired: function (id) {
    var op = this;
    // 加载一个商户
    app.getUrl('/business/info/' + id, function (data) {
      if (app.hasData(data)) {
        if (data == null || data.length == 0) return;
        let oneBusiness = data[0];
        if (oneBusiness.leaguer == 1) {
          //当前时间
          let currentTimeStamp = new Date().getTime();
          //会员到期时间
          let expirationTime = oneBusiness.expirationTime;
          if (currentTimeStamp > expirationTime) {
            app.post('/order/membershipExpiration', {
              id: id
            }, function (data) {
              if (data.result == 1) {}
            });
          }
        }
      }
    });
  },

  onGotUserInfo: function (e) {
    var op = this;
    app.onGotUserInfo(e, function () {
      op.goMessage();
    });
  },

  refreshAllCampaign: function () {
    this.setData({
      campaigns: [],
      start: 0,
      hasMoreData: true,
    });
    this.loadAllCampaign();
  },

  loadAllCampaign: function () {
    var op = this;
    var id = wx.getStorageSync('id');
    id = id == '' ? -1 : id;
    var campaigns = this.data.campaigns;
    // 加载商户
    app.post('/campaign/list', {
      id: id,
      start: op.data.start,
      num: op.data.pageSize,
    }, function (data) {
      if (app.hasData(data)) {
        if (data.length < op.data.pageSize) {
          op.setData({
            campaigns: campaigns.concat(data),
            hasMoreData: false
          });
        } else {
          op.setData({
            campaigns: campaigns.concat(data),
            hasMoreData: true,
            start: op.data.start + op.data.pageSize
          })
        }
      }
    });
  },

  oneCampaign: function (event) {
    let op = this;
    let card = wx.getStorageSync('id');
    if (card == "") {
      app.onGotUserInfo(event, function () {});
      return;
    }

    let followerTemplateId = op.data.followerTemplateId;
    let cardMessageTemplateId = op.data.cardMessageTemplateId;
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
              var id = event.currentTarget.dataset.id;
              var img = event.currentTarget.dataset.img;
              var deadline = event.currentTarget.dataset.deadline;
              var currency = event.currentTarget.dataset.currency;
              var read = event.currentTarget.dataset.read;
              var like = event.currentTarget.dataset.like;
              var allUrl = util.fillUrlParams('/pages/campaign/oneCampaign', {
                id: id,
                img: img,
                deadline: deadline,
                currency: currency,
                read: read,
                like: like,
              });
              wx.navigateTo({
                url: allUrl
              });
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
                var id = event.currentTarget.dataset.id;
                var img = event.currentTarget.dataset.img;
                var deadline = event.currentTarget.dataset.deadline;
                var currency = event.currentTarget.dataset.currency;
                var read = event.currentTarget.dataset.read;
                var like = event.currentTarget.dataset.like;
                var allUrl = util.fillUrlParams('/pages/campaign/oneCampaign', {
                  id: id,
                  img: img,
                  deadline: deadline,
                  currency: currency,
                  read: read,
                  like: like,
                });
                wx.navigateTo({
                  url: allUrl
                });
              }
            })
          } else {
            var id = event.currentTarget.dataset.id;
            var img = event.currentTarget.dataset.img;
            var deadline = event.currentTarget.dataset.deadline;
            var currency = event.currentTarget.dataset.currency;
            var read = event.currentTarget.dataset.read;
            var like = event.currentTarget.dataset.like;
            var allUrl = util.fillUrlParams('/pages/campaign/oneCampaign', {
              id: id,
              img: img,
              deadline: deadline,
              currency: currency,
              read: read,
              like: like,
            });
            wx.navigateTo({
              url: allUrl
            });
          }
        }
      }
    })
  },

  loadLatestEstablishmentList: function (e) {
    let op = this;
    app.post("/establishment/getLatestEstablishmentList", {
      start: 0,
      num: op.data.latestEstablishmentPageSize,
    }, function (data) {
      if (app.hasData(data)) {
        op.setData({
          latestEstablishmentList: data,
        })
      }
    })
  },

  loadShowDataCount: function () {
    let op = this;
    app.post("/cooperate/getShowDataCount", {}, function (data) {
      if (app.hasData(data)) {
        op.setData({
          visitCount: data.visitCount,
          businessCount: data.businessCount,
          establishmentCount: data.establishmentCount,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = app.getUserId();
    app.globalData.findContactsFlag = false;
    app.globalData.findCommunitiesFlag = false;
    this.loadBanner();
    this.loadMessage();
    this.loadAllCampaign();
    this.loadLatestEstablishmentList();
    this.loadShowDataCount();
    //判断该用户会员是否过期
    this.isLeaguerExpired(id);
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  /**
   * 生命周期函数--监听用户滑动页面事件
   */
  onPageScroll: function (e) {
    if (e.scrollTop >= this.data.cooperationScrollTop) {
      this.setData({
        releaseFlag: true,
      })
    } else {
      this.setData({
        releaseFlag: false,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    var query = wx.createSelectorQuery()
    query.select("#cooperation").boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      if (res[0] && res[1]) {
        that.setData({
          cooperationScrollTop: res[0].top + res[1].scrollTop + 300,
        })
      }
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.findContactsFlag = false;
    app.globalData.findCommunitiesFlag = false;
    if (app.globalData.messageDataUpdated) {
      this.refreshAllMessage();
      app.globalData.messageDataUpdated = false;
    }
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
    // if (this.data.hasMoreData) {
    //   this.loadMessage();
    // } else {
    //   wx.showToast({
    //     title: '没有更多数据',
    //     duration: 500,
    //   })
    // }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})