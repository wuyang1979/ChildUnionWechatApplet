var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        readStatus: true
    },

    toInteractionMessagePage: function (e) {
        let op = this;
        let card = wx.getStorageSync('id');
        let allUrl = util.fillUrlParams("/pages/message/list", {});
        if (card == '') {
            app.onGotUserInfo(e, function () {
                wx.navigateTo({
                    url: allUrl,
                })
            });
        } else {
            wx.navigateTo({
                url: allUrl,
            })
        }
    },

    judgeReadStatus: function (e) {
        let op = this;
        let card = wx.getStorageSync('id');
        if (card != "") {
            app.post("/message/judgeReadStatus", {
                card: card
            }, function (data) {
                if (app.hasData(data)) {
                    if (data == 0) {
                        op.setData({
                            readStatus: true,
                        })
                    } else {
                        op.setData({
                            readStatus: false,
                        })
                    }
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.judgeReadStatus();
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
        this.judgeReadStatus();
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