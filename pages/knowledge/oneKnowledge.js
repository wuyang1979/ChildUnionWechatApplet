var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: "",
        url: "",
        title: "",
        cost: "",
        readCount: 0,
        leaguer: 0,
        hasBoughtFlag: false,
    },

    onGotUserInfo: function (e) {
        var op = this;
        app.onGotUserInfo(e, function () {
            op.goOrder(e);
        });
    },

    // 预览文件
    previewFile(fileLink) {
        if (!fileLink) {
            return false
        }
        util.showLoading()

        // 单次下载允许的最大文件为 200MB
        wx.downloadFile({
            url: fileLink,
            success: function (res) {
                if (res.statusCode != 200) {
                    util.hideLoadingWithErrorTips()
                    return false
                }
                var Path = res.tempFilePath //返回的文件临时地址，用于后面打开本地预览所用
                wx.openDocument({
                    filePath: Path,
                    showMenu: true,
                    success: function (res) {
                        util.hideLoading()
                    }
                })
            },
            fail: function (err) {
                util.hideLoadingWithErrorTips()
            }
        })
    },

    goOrder: function (event) {
        var card = wx.getStorageSync('id');
        if (card == '') {
            wx.showToast({
                title: '请先绑定用户',
            });
            return;
        }
        var op = this;

        if (op.data.leaguer == 1 || op.data.hasBoughtFlag) {
            op.previewFile(app.qinzi + op.data.url);
        } else {
            app.post('/knowledgeOrder/data', {
                cardId: card,
                productId: op.data.id,
                price: op.data.cost,
                num: 1,
                total: op.data.cost,
                body: '知识库订单',
            }, function (data) {
                if (typeof data == 'number') {
                    var allUrl = util.fillUrlParams('/pages/knowledge/order', {
                        id: data,
                        currency: 2,
                        url: op.data.url,
                        knowledgeId: op.data.id,
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
        }
    },

    updateReadCount: function () {
        let op = this;
        app.post("/knowledge/updateReadCount", {
            id: op.data.id,
        }, function (data) {
            if (typeof data == 'number') {
            } else {
                wx.showToast({
                    title: '系统正在更新，请稍后再试'
                });
                return;
            }
        });
    },

    isLeaguer: function (card) {
        let op = this;
        app.post("/knowledge/isLeaguer", {
            id: card
        }, function (data) {
            if (app.hasData(data)) {
                op.setData({
                    leaguer: data.leaguer
                })
            }
        });
    },

    hasBoughtKnowledge: function (card) {
        let op = this;
        app.post("/knowledge/hasBoughtKnowledge", {
            card: card,
            knowledgeId: op.data.id
        }, function (data) {
            if (app.hasData(data)) {
                if (data > 0) {
                    op.setData({
                        hasBoughtFlag: true,
                    })
                }
            }
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var card = wx.getStorageSync('id');
        let op = this;
        let id = options.id;
        let title = options.title;
        let url = options.url;
        let readCount = options.readCount;
        let cost = options.cost;
        let tempArr = url.split("/");
        let urlPrefix = "/" + tempArr[1] + "/" + tempArr[2] + "/" + tempArr[3];
        let picNum = tempArr[4].split(".")[0].split("_")[0];
        let picUrl = app.qinzi + urlPrefix + "/" + picNum + ".jpg";

        op.setData({
            title: title,
            url: url,
            cost: cost,
            picUrl: picUrl,
            id: id,
            readCount: readCount,
        });

        op.updateReadCount();
        op.isLeaguer(card);
        if (op.data.leaguer == 0) {
            op.hasBoughtKnowledge(card);
        }
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