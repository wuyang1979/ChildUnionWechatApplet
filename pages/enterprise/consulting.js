var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: "",
        phone: "",
        enterpriseId: "",
        enterpriseName: "",
    },

    inputName: function (e) {
        let op = this;
        op.setData({
            name: e.detail.value,
        })
    },

    inputPhone: function (e) {
        let op = this;
        op.setData({
            phone: e.detail.value,
        })
    },

    submit: function (e) {
        var op = this;
        if (!op.checkInput()) return;
        op.addEnterpriseConsulting();
    },

    checkInput: function () {
        if (!this.data.name || this.data.name.length < 1) {
            wx.showToast({
                title: '请输入姓名'
            });
            return false;
        }
        if (!this.data.phone || this.data.phone.length < 1) {
            wx.showToast({
                title: '请输入手机号'
            });
            return false;
        }
        if (!util.checkInvoiceMobile(this.data.phone)) {
            wx.showToast({
                title: '手机号格式错误'
            });
            return false;
        }
        return true;
    },

    addEnterpriseConsulting: function (e) {
        let op = this;
        app.post('/enterprise/addEnterpriseConsulting', {
            enterpriseId: op.data.enterpriseId,
            name: op.data.name,
            phone: op.data.phone,
        }, function (data) {
            if (app.hasData(data)) {
                if (data == 1) {
                    var allUrl = util.fillUrlParams('/pages/business/success', {
                        id: op.data.enterpriseId,
                        type: 5,
                        name: op.data.enterpriseName,
                    });
                    wx.navigateTo({
                        url: allUrl
                    });
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        let enterpriseName = options.enterpriseName;
        let enterpriseId = options.enterpriseId;
        op.setData({
            enterpriseId: enterpriseId,
            enterpriseName: enterpriseName,
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