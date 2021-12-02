var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseList: [],
    },


    modify: function (e) {
        let id = e.currentTarget.dataset.id;
        let cardId = e.currentTarget.dataset.card_id;
        let city = e.currentTarget.dataset.city;
        let district = e.currentTarget.dataset.district;
        let introduce = e.currentTarget.dataset.introduce;
        let latitude = e.currentTarget.dataset.latitude;
        let level = e.currentTarget.dataset.level;
        let longitude = e.currentTarget.dataset.longitude;
        let main_image = e.currentTarget.dataset.main_image;
        let name = e.currentTarget.dataset.name;
        let official_account_name = e.currentTarget.dataset.official_account_name;
        let open_time = e.currentTarget.dataset.open_time;
        let price = e.currentTarget.dataset.price;
        let topic_type_id = e.currentTarget.dataset.topic_type_id;
        let traffic = e.currentTarget.dataset.traffic;
        let workaddress = e.currentTarget.dataset.workaddress;
        let topic_type_name = e.currentTarget.dataset.topic_type_name;
        let allUrl = util.fillUrlParams("/pages/base/modify", {
            id: id,
            cardId: cardId,
            city: city,
            district: district,
            introduce: introduce,
            latitude: latitude,
            level: level,
            longitude: longitude,
            main_image: main_image,
            name: name,
            official_account_name: official_account_name,
            open_time: open_time,
            price: price,
            topic_type_id: topic_type_id,
            traffic: traffic,
            workaddress: workaddress,
            topic_type_name: topic_type_name,
        });
        wx.navigateTo({
            url: allUrl,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        let baseList = JSON.parse(options.baseList);
        op.setData({
            baseList: baseList,
        })
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