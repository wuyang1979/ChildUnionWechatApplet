var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: "",
        typeName: "",
        screenEnterpriseList: [],
        start: 0,
        pageSize: 30,
        hasMoreData: true,
    },

    toDetailEnterprise: function (e) {
        let op = this;
        let id = e.currentTarget.dataset.id;
        let name = e.currentTarget.dataset.name;
        let cardId = e.currentTarget.dataset.card_id;
        let cardName = e.currentTarget.dataset.card_name;
        let business = e.currentTarget.dataset.business;
        let requirement = e.currentTarget.dataset.requirement;
        let resources = e.currentTarget.dataset.resources;
        let isHot = e.currentTarget.dataset.ishot;
        let mainImage = e.currentTarget.dataset.main_image;
        let title = e.currentTarget.dataset.title;
        let score = e.currentTarget.dataset.score;
        let introduce = e.currentTarget.dataset.introduce;
        let allUrl = util.fillUrlParams("/pages/enterprise/oneEnterprise", {
            id:id,
            name: name,
            cardId: cardId,
            cardName: cardName,
            business: business,
            requirement: requirement,
            resources: resources,
            isHot: isHot,
            mainImage: mainImage,
            title: title,
            score: score,
            introduce: introduce,
        });
        wx.navigateTo({
            url: allUrl,
        })
    },

    loadAllEnterprise: function () {
        var op = this;
        var id = wx.getStorageSync('id');
        id = id == '' ? -1 : id;
        var screenEnterpriseList = op.data.screenEnterpriseList;
        // 加载商户
        app.post('/enterprise/screenList', {
            id: id,
            start: op.data.start,
            num: op.data.pageSize,
            type: op.data.type,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    data[i].main_image = app.qinzi + data[i].main_image;
                }
                if (data.length < op.data.pageSize) {
                    op.setData({
                        screenEnterpriseList: screenEnterpriseList.concat(data),
                        hasMoreData: false
                    });
                } else {
                    op.setData({
                        screenEnterpriseList: screenEnterpriseList.concat(data),
                        hasMoreData: true,
                        start: op.data.start + op.data.pageSize
                    })
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        let type = options.type;
        let typeName = options.typeName;
        op.setData({
            type: type,
            typeName: typeName,
        });

        op.loadAllEnterprise();
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