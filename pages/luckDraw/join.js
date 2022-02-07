var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        hasJoinLuckDraw: false,
        hasJoinOutsideLuckDraw: false,
        type: 1,
    },


    joinInside: function (e) {
        let op = this;
        let card = wx.getStorageSync('id');
        if (card == '') {
            app.onGotUserInfo(e, function () {});
        } else {
            op.joinLuckDraw();
        }
    },

    joinOutside: function (e) {
        let op = this;
        app.luckDrawOnGotUserInfo(e, function () {
            app.post("/luckDraw/hasJoinForOutside", {
                openId: app.globalData.joinerOpenId,
            }, function (data) {
                if (data.length > 0) {
                    wx.showToast({
                        title: '已报名本次抽奖',
                    });
                } else {
                    app.post("/luckDraw/joinOutside", {
                        name: app.globalData.userInfo.nickName,
                        headimgurl: app.globalData.userInfo.avatarUrl,
                        openId: app.globalData.joinerOpenId,
                    }, function (data1) {
                        if (app.hasData(data1)) {
                            if (data1 == 1) {
                                op.setData({
                                    hasJoinOutsideLuckDraw: true,
                                })
                                wx.showToast({
                                    title: '报名成功',
                                })
                            }
                        } else {
                            wx.showToast({
                                title: '系统异常',
                            })
                        }
                    })
                }
            })
        });
    },

    joinLuckDraw: function (e) {
        let op = this;
        let card = wx.getStorageSync('id');
        app.post("/luckDraw/hasJoin", {
            card: card,
            type: op.data.type,
        }, function (data) {
            if (app.hasData(data)) {
                if (data.length > 0) {
                    wx.showToast({
                        title: '已报名本次抽奖',
                    });
                } else {
                    app.post("/luckDraw/join", {
                        card: card,
                        type: op.data.type,
                    }, function (data) {
                        if (app.hasData(data)) {
                            if (data == 1) {
                                op.setData({
                                    hasJoinLuckDraw: true,
                                })
                                wx.showToast({
                                    title: '报名成功',
                                })
                            }
                        } else {
                            wx.showToast({
                                title: '系统异常',
                            })
                        }
                    })
                }
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