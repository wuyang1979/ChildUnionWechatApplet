var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   * type: 3-亲子社群充值订单
   */
  data: {
    id: -1,
    type: 0,
    communityIndex: "",
    qrCodeSrc: "",
    saveQrFlag: true,
    activeType: 0,
  },

  goHome: function (event) {
    wx.switchTab({
      url: '/pages/cooperate/list',
    });
  },

  jumpInvite: function (e) {
    var allUrl = util.fillUrlParams('/pages/my/invite', {});
    wx.navigateTo({
      url: allUrl
    });
  },

  goOrder: function (event) {
    var op = this;
    var url = this.data.type == 0 ? '/pages/campaign/oneOrder' : '/pages/campaign/oneRechargeOrder';
    var allUrl = util.fillUrlParams(url, {
      id: op.data.id,
    });
    wx.navigateTo({
      url: allUrl
    });
  },

  saveQrCode: function (e) {
    let that = this;
    var imgSrc = e.currentTarget.dataset.img;
    if (that.data.saveQrFlag) {
      //获取相册授权
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                that.img(imgSrc)
              }
            })
          } else {
            that.img(imgSrc)
          }
        }
      })
    } else {
      wx.showToast({
        title: '已保存',
        icon: 'success',
        duration: 2000
      });
    }
  },
  img: function (imgSrc) {
    let that = this;
    var imgSrc = imgSrc;
    wx.getImageInfo({
      src: imgSrc,
      success: function (res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success: function (data) {
            that.data.saveQrFlag = false;
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            });
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              wx.openSetting({
                success(settingdata) {
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    wx.showToast({
                      title: '图片已保存',
                      icon: 'success',
                      duration: 2000
                    })
                  } else {}
                }
              })
            }
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    let type = options.type;
    let communityIndex = options.communityIndex || "";
    let activeType = options.activeType || 0;
    this.setData({
      id: id,
      type: type,
      communityIndex: communityIndex,
      qrCodeSrc: "/pages/img/qinzi-communityQr1.png",
      activeType: activeType,
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

  }
})