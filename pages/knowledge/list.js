var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        card: "",
        knowledgeList: [],
        start: 0,
        pageSize: 30,
        activityPlanShowFlag: true,
        safetyPlanShowFlag: false,
        activitySummaryShowFlag: false,
        researchManualShowFlag: false,
        agreementShowFlag: false,
    },

    activityPlanLab: function (e) {
        let op = this;
        op.setData({
            activityPlanShowFlag: true,
            safetyPlanShowFlag: false,
            activitySummaryShowFlag: false,
            researchManualShowFlag: false,
            agreementShowFlag: false,
        });
    },

    safetyPlanLab: function (e) {
        let op = this;
        op.setData({
            activityPlanShowFlag: false,
            safetyPlanShowFlag: true,
            activitySummaryShowFlag: false,
            researchManualShowFlag: false,
            agreementShowFlag: false,
        });
    },

    activitySummaryLab: function (e) {
        let op = this;
        op.setData({
            activityPlanShowFlag: false,
            safetyPlanShowFlag: false,
            activitySummaryShowFlag: true,
            researchManualShowFlag: false,
            agreementShowFlag: false,
        });
    },

    researchManualLab: function (e) {
        let op = this;
        op.setData({
            activityPlanShowFlag: false,
            safetyPlanShowFlag: false,
            activitySummaryShowFlag: false,
            researchManualShowFlag: true,
            agreementShowFlag: false,
        });
    },

    agreementLab: function (e) {
        let op = this;
        op.setData({
            activityPlanShowFlag: false,
            safetyPlanShowFlag: false,
            activitySummaryShowFlag: false,
            researchManualShowFlag: false,
            agreementShowFlag: true,
        });
    },

    getAllKnowledgeList: function (e) {
        let op = this;
        app.post("/knowledge/list", {
            start: op.data.start,
            num: op.data.pageSize,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    let urlArr = data[i].url.split("/");
                    //根据url数据结构定义，取第四位名称为标题
                    let titleTempArr = urlArr[4].split(".");
                    titleTempArr = titleTempArr[0].split("_");
                    let title = titleTempArr[1];
                    data[i].title = title;
                }
                op.setData({
                    knowledgeList: data
                })
            }
        })
    },

    // 预览文件
    previewDetail(e) {
        app.onGotUserInfo(e, function () {
            let title = e.currentTarget.dataset.title;
            let url = e.currentTarget.dataset.url;
            let cost = e.currentTarget.dataset.cost;
            let id = e.currentTarget.dataset.id;
            let readCount = e.currentTarget.dataset.readcount;
            var allUrl = util.fillUrlParams("/pages/knowledge/oneKnowledge", {
                title: title,
                url: url,
                cost: cost,
                id: id,
                readCount: readCount,
            })
            wx.navigateTo({
                url: allUrl,
            })
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        op.getAllKnowledgeList();
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
        op.getAllKnowledgeList();
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