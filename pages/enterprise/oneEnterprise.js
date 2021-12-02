var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        name: "",
        cardId: "",
        business: "",
        requirement: "",
        resources: "",
        isHot: "",
        mainImage: "",
        title: "",
        score: "",
        introduce: "",
        pictureList: [],
        isDetail: true,
        isComment: false,
        isConsulting: false,
        replyList: [],
        consultingeList: [],
        commentCount: "",
        consultingCount: "",
    },

    getPictureList: function (e) {
        let op = this;
        app.post('/enterprise/pictureList', {
            id: op.data.id,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    data[i].url = app.qinzi + data[i].url;
                }
                op.setData({
                    pictureList: data || [],
                });
            }
        });
    },

    toDetail: function (e) {
        let op = this;
        op.setData({
            isDetail: true,
            isComment: false,
            isConsulting: false,
        })
    },

    toComment: function (e) {
        let op = this;
        op.setData({
            isDetail: false,
            isComment: true,
            isConsulting: false,
        })
    },

    toConsulting: function (e) {
        let op = this;
        op.setData({
            isDetail: false,
            isComment: false,
            isConsulting: true,
        })
    },

    previewImage: function (e) {
        let imgArr = [];
        let current = e.currentTarget.dataset.src;
        imgArr.push(current);
        wx.previewImage({
            current: current,
            urls: imgArr,
        })
    },

    jumpBusiness: function (event) {
        var op = this;
        var userId = app.getUserId();
        var card = event.currentTarget.dataset.card;
        if (userId != -1) {
            app.getUrl('/business/hasFollowed/' + userId + '-' + card, function (data) {
                if (app.hasData(data)) {
                    var follow = data;
                    op.oneBusiness(card, follow);
                } else {
                    op.oneBusiness(card, 0);
                }
            });
        } else {
            op.oneBusiness(card, 0);
        }

    },

    oneBusiness: function (id, follow) {
        var allUrl = util.fillUrlParams('/pages/business/oneBusiness', {
            id: id,
            follow: follow
        });
        wx.navigateTo({
            url: allUrl
        });
    },

    loadReply4MessageId: function (enterpriseId) {
        var op = this;
        app.getUrl('/enterprise/enterpriseComment/' + enterpriseId, function (data) {
            if (app.hasData(data)) {
                op.setData({
                    replyList: data,
                });
            }
        });
    },

    loadAllConsulting: function (enterpriseId) {
        var op = this;
        app.getUrl('/enterprise/enterpriseConsulting/' + enterpriseId, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    data[i].name = data[i].name.substr(0, 1) + "**";
                }

                op.setData({
                    consultingeList: data,
                });
            }
        });
    },

    goCooperateList: function (event) {
        wx.switchTab({
            url: '/pages/cooperate/list',
        })
    },

    onGotUserInfo: function (e) {
        var op = this;
        app.onGotUserInfo(e, function () {
            var allUrl = util.fillUrlParams('/pages/enterprise/comment', {
                enterpriseId: op.data.id,
            });
            wx.navigateTo({
                url: allUrl
            });
        });
    },

    consulting: function (e) {
        let op = this;
        var allUrl = util.fillUrlParams('/pages/enterprise/consulting', {
            enterpriseId: op.data.id,
            enterpriseName: op.data.name,
        });
        wx.navigateTo({
            url: allUrl
        });
    },

    getConsultingAndCommentCount: function (enterpriseId) {
        var op = this;
        app.getUrl('/enterprise/getConsultingAndCommentCount/' + enterpriseId, function (data) {
            if (app.hasData(data)) {
                op.setData({
                    consultingCount: data.consultingCount,
                    commentCount: data.commentCount,
                });
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        let id = options.id;
        let name = options.name;
        let cardId = options.cardId;
        let business = options.business;
        let requirement = options.requirement;
        let resources = options.resources;
        let isHot = options.isHot;
        let mainImage = options.mainImage;
        let title = options.title;
        let score = options.score;
        let introduce = options.introduce;
        let pictureList = options.pictureList == null ? [] : JSON.parse(options.pictureList);
        let replyList = options.replyList == null ? [] : JSON.parse(options.replyList);
        let consultingeList = options.consultingeList == null ? [] : JSON.parse(options.consultingeList);

        op.setData({
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
            pictureList: pictureList,
            replyList: replyList,
            consultingeList: consultingeList,
        });

        op.getPictureList();
        op.loadReply4MessageId(id);
        op.loadAllConsulting(id);
        op.getConsultingAndCommentCount(id);

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
        this.loadReply4MessageId(this.data.id);
        this.loadAllConsulting(this.data.id);
        this.getConsultingAndCommentCount(this.data.id);
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
        var allUrl = util.fillUrlParams('/pages/enterprise/oneEnterprise', {
            id: op.data.id,
            name: op.data.name,
            cardId: op.data.cardId,
            business: op.data.business,
            requirement: op.data.requirement,
            resources: op.data.resources,
            isHot: op.data.isHot,
            mainImage: op.data.mainImage,
            title: op.data.title,
            score: op.data.score,
            introduce: op.data.introduce,
            pictureList: JSON.stringify(op.data.pictureList),
            replyList: JSON.stringify(op.data.replyList),
            consultingeList: JSON.stringify(op.data.consultingeList),
        });

        return {
            title: '分享了一条企业服务！',
            path: allUrl,
            success: function (res) {
                console.log(res)
                // 转发成功
            },
            fail: function (res) {
                // 转发失败
            }
        }
    }
})