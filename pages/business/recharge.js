var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        value: 0,
        num: 1,
        otherAmountFlag: false,
    },

    inputAmount: function (e) {
        let op = this;
        op.setData({
            value: e.detail.value,
        })
    },

    amount10: function (e) {
        let op = this;
        op.setData({
            value: 5,
        });
    },

    amount30: function (e) {
        let op = this;
        op.setData({
            value: 10,
        });
    },

    amount50: function (e) {
        let op = this;
        op.setData({
            value: 50,
        });
    },

    amount100: function (e) {
        let op = this;
        op.setData({
            value: 100,
        });
    },

    amount200: function (e) {
        let op = this;
        op.setData({
            value: 500,
        });
    },

    amountOther: function (e) {
        let op = this;
        op.setData({
            otherAmountFlag: true,
            value: 0,
        });
    },

    closeAmountArea: function (e) {
        let op = this;
        op.setData({
            otherAmountFlag: false,
        });
    },

    payfor: function (event) {
        var card = wx.getStorageSync('id');
        if (card == '') {
            app.onGotUserInfo(event, function () {
                var id = app.getUserId();
                op.setData({
                    id: id
                });
            });
            return;
        }
        var op = this;

        app.post('/rechargeOrder/data', {
            cardId: card,
            price: op.data.value,
            num: op.data.num,
            total: op.data.value,
            body: '充值订单',
        }, function (data) {
            if (typeof data == 'number') {
                var allUrl = util.fillUrlParams('/pages/campaign/scoreOrder', {
                    id: data,
                    type: 4,
                    activeType: 4,
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