var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        inputShowed: false,
        searchValue: "",
        enterpriseHotList: [],
        start: 0,
        pageSize: 30,
        hasMoreData: true,
    },

    loadAllEnterprise: function () {
        var op = this;
        var id = wx.getStorageSync('id');
        id = id == '' ? -1 : id;
        // 加载商户
        app.post('/enterprise/list', {
            id: id,
            start: op.data.start,
            num: op.data.pageSize,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    data[i].main_image = app.qinzi + data[i].main_image;
                }
                if (data.length < op.data.pageSize) {
                    op.setData({
                        enterpriseHotList: data,
                        hasMoreData: false
                    });
                } else {
                    op.setData({
                        enterpriseHotList: data,
                        hasMoreData: true,
                        start: op.data.start + op.data.pageSize
                    })
                }
            }
        });
    },

    screenEnterpriseList: function (e) {
        let op = this;
        let type = e.currentTarget.dataset.type;
        let typeName = e.currentTarget.dataset.typename;
        let allUrl = util.fillUrlParams("/pages/enterprise/detailList", {
            type: type,
            typeName: typeName,
        });
        wx.navigateTo({
            url: allUrl,
        })
    },

    toDetailEnterprise: function (e) {
        let op = this;
        let id = e.currentTarget.dataset.id;
        let name = e.currentTarget.dataset.name;
        let cardId = e.currentTarget.dataset.card_id;
        let business = e.currentTarget.dataset.business;
        let requirement = e.currentTarget.dataset.requirement;
        let resources = e.currentTarget.dataset.resources;
        let isHot = e.currentTarget.dataset.ishot;
        let mainImage = e.currentTarget.dataset.main_image;
        let title = e.currentTarget.dataset.title;
        let score = e.currentTarget.dataset.score;
        let introduce = e.currentTarget.dataset.introduce;
        let allUrl = util.fillUrlParams("/pages/enterprise/oneEnterprise", {
            id: id,
            name: name,
            cardId: cardId,
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        let enterpriseHotList = options.enterpriseHotList == null ? [] : JSON.parse(options.enterpriseHotList);
        op.setData({
            enterpriseHotList: enterpriseHotList,
        })

        op.loadAllEnterprise();
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
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
        let op = this;
        op.loadAllEnterprise();
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
        var op = this;
        var allUrl = util.fillUrlParams('/pages/enterprise/list', {
            enterpriseHotList: JSON.stringify(op.data.enterpriseHotList),
        });

        return {
            title: '分享了一些热门企业服务！',
            path: allUrl,
            success: function (res) {
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})