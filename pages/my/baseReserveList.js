var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseReserveList: [],
    },

    read: function (e) {
        let op = this;
        let id = e.currentTarget.dataset.id;
        app.post("/base/readOrder", {
            id: id
        }, function (data) {
            if (app.hasData(data) && data == 1) {
                op.getBaseReserveList();
            }
        })
    },

    getBaseReserveList: function (e) {
        let op = this;
        app.post("/base/getBaseReserveList", {}, function (data) {
            if (app.hasData(data)) {
                op.setData({
                    baseReserveList: data,
                })
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.getBaseReserveList();
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