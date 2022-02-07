var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    releaseProducts: function (e) {
        let op = this;
        let card = wx.getStorageSync('id')
        if (card == "") {
            app.onGotUserInfo(e, function () {});
            return;
        }
        let allUrl = util.fillUrlParams("/pages/product/releaseProduct", {});
        wx.navigateTo({
            url: allUrl,
        })
    },

    myProducts: function (e) {
        let allUrl = util.fillUrlParams("/pages/product/list", {});
        wx.navigateTo({
            url: allUrl,
        })
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