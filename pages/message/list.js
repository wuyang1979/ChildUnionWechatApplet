var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        messageList: [],
        pageSize: 20,
        start: 0,
        hasMoreData: true,
    },

    refresh: function (e) {
        let op = this;
        op.setData({
            messageList: [],
            start: 0,
            hasMoreData: true,
        });
        op.loadAllMessageList();
    },

    loadAllMessageList: function (e) {
        let op = this;
        let messageList = op.data.messageList;
        let id = wx.getStorageSync('id');
        id = id == '' ? -1 : id;
        // 加载消息列表
        app.post('/message/list', {
            receiveCard: id,
            start: op.data.start,
            num: op.data.pageSize,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].message_behavior == 1) {
                        data[i].behaviorName = "关注了你";
                    } else if (data[i].message_behavior == 2) {
                        data[i].behaviorName = "回复了你";
                    }
                }
                if (data.length < op.data.pageSize) {
                    op.setData({
                        messageList: messageList.concat(data),
                        hasMoreData: false
                    });
                } else {
                    op.setData({
                        messageList: messageList.concat(data),
                        hasMoreData: true,
                        start: op.data.start + op.data.pageSize
                    })
                }
            }
        });
    },

    readMessage: function (e) {
        let op = this;
        let id = e.currentTarget.dataset.id;
        let message_behavior = e.currentTarget.dataset.message_behavior;
        let card_message_id = e.currentTarget.dataset.card_message_id || -1;
        let send_person_card = e.currentTarget.dataset.send_person_card;
        let read_status = e.currentTarget.dataset.read_status;
        if (read_status == 0) {
            app.post("/message/updateReadStatus", {
                id: id
            }, function (data) {
                if (typeof data == 'number') {
                    if (message_behavior == 1) {
                        //关注行为
                        op.jumpBusiness(send_person_card);
                    } else if (message_behavior == 2) {
                        //回复行为
                        op.toOneBussinessPage(card_message_id);
                    }
                }
            });
        } else {
            if (message_behavior == 1) {
                //关注行为
                op.jumpBusiness(send_person_card);
            } else if (message_behavior == 2) {
                //回复行为
                op.toOneBussinessPage(card_message_id);
            }
        }
    },

    toOneBussinessPage: function (card_message_id) {
        app.post("/message/getCardMessageInfoById", {
            cardMessageId: card_message_id
        }, function (data) {
            if (app.hasData(data)) {
                let id = data[0].id;
                let title = data[0].title;
                let message = data[0].message;
                let messageType = data[0].messageType;
                let sourceType = data[0].sourceType;
                let sourcePath = data[0].sourcePath;
                let last = data[0].last;
                if (last < 60) {
                    last += "分钟前";
                  } else if (lase < 1440) {
                    let hour = Math.floor(last / 60);
                    last = hour + "小时前";
                  } else {
                    let day = Math.floor(last / 1440);
                    last = day + "天前";
                  }
                let read = data[0].readCount;
                let like = data[0].giveLike;
                let card = data[0].cardId;
                let phone = data[0].cardInfo.phone;
                let realname = data[0].cardInfo.realname;
                let job = data[0].cardInfo.job;
                let company = data[0].cardInfo.company;
                let headimgurl = data[0].cardInfo.headimgurl;

                var allUrl = util.fillUrlParams('/pages/cooperate/oneMessage', {
                    id: id,
                    title: title,
                    message: message,
                    messageType: messageType,
                    sourceType: sourceType,
                    sourcePath: sourcePath,
                    last: last,
                    read: read,
                    like: like,

                    card: card,
                    phone: phone,
                    realname: realname,
                    job: job,
                    company: company,
                    headimgurl: headimgurl,
                });
                wx.navigateTo({
                    url: allUrl
                });
            }
        })
    },

    jumpBusiness: function (sendCard) {
        var op = this;
        var userId = app.getUserId();
        var card = sendCard;
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

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadAllMessageList();
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
        this.refresh();
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
        if (this.data.hasMoreData) {
            this.loadAllMessageList();
        } else {
            wx.showToast({
                title: '没有更多数据',
                duration: 500,
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})