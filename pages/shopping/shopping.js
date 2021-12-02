// pages/shopping/shopping.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.navigateToMiniProgram({
      appId: 'wxe1c066637ef76a85',
      path: '',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      },
      fail(res) {
        // 打开失败
      },
      complete(res) {
        // 调用结束  不管成功还是失败都执行
      }
      /**
       * appId：跳转到的小程序app-id
       * path：打开的页面路径，如果为空则打开首页，path 中 ? 后面的部分会成为 query，在小程序的 App.onLaunch、App.onShow 和 Page.onLoad的回调函数中获取query数据
       * extraData：需要传递给目标小程序的数据，目标小程序可在 App.onLaunch、App.onShow 中获取到这份数据
       * envVersion：要打开的小程序版本，有效值: develop（开发版），trial（体验版），release（正式版），仅在当前小程序为开发版或体验版时此参数有效，如果当前小程序是正式版，则打开的小程序必定是正式版
       */
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.navigateToMiniProgram({
      appId: 'wxe1c066637ef76a85',
      path: '',
      extraData: {
        foo: 'bar'
      },
      envVersion: 'release',
      success(res) {
        // 打开成功
      },
      fail(res) {
        // 打开失败
      },
      complete(res) {
        // 调用结束  不管成功还是失败都执行
      }
      /**
       * appId：跳转到的小程序app-id
       * path：打开的页面路径，如果为空则打开首页，path 中 ? 后面的部分会成为 query，在小程序的 App.onLaunch、App.onShow 和 Page.onLoad的回调函数中获取query数据
       * extraData：需要传递给目标小程序的数据，目标小程序可在 App.onLaunch、App.onShow 中获取到这份数据
       * envVersion：要打开的小程序版本，有效值: develop（开发版），trial（体验版），release（正式版），仅在当前小程序为开发版或体验版时此参数有效，如果当前小程序是正式版，则打开的小程序必定是正式版
       */
    })
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