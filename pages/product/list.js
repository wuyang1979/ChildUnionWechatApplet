var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        productList: [],
        productId: 0,
        start: 0,
        pageSize: 15,
        hasMoreData: true,
        isConfirmShow: false,
    },

    loadAllProduct: function () {
        var op = this;
        var id = wx.getStorageSync('id');
        id = id == '' ? -1 : id;
        var productList = op.data.productList;
        // 加载商户
        app.post('/product/list', {
            card: app.getUserId(),
            start: op.data.start,
            num: op.data.pageSize,
        }, function (data) {
            if (app.hasData(data)) {
                if (data.length < op.data.pageSize) {
                    op.setData({
                        productList: productList.concat(data),
                        hasMoreData: false
                    });
                } else {
                    op.setData({
                        productList: productList.concat(data),
                        hasMoreData: true,
                        start: op.data.start + op.data.pageSize
                    })
                }
            }
        });
    },

    modify: function (e) {
        let id = e.currentTarget.dataset.id;
        let name = e.currentTarget.dataset.name;
        let main_image = e.currentTarget.dataset.main_image;
        let original_price = e.currentTarget.dataset.original_price;
        let present_price = e.currentTarget.dataset.present_price;
        let inventory = e.currentTarget.dataset.inventory;
        let repeat_purchase = e.currentTarget.dataset.repeat_purchase;
        let once_max_purchase_count = e.currentTarget.dataset.once_max_purchase_count;
        let phone = e.currentTarget.dataset.phone;
        let introduce = e.currentTarget.dataset.introduce;
        let vedio_path = e.currentTarget.dataset.vedio_path;
        let instruction = e.currentTarget.dataset.instruction;
        let deadline_time = e.currentTarget.dataset.deadline_time;

        let allUrl = util.fillUrlParams("/pages/product/modify", {
            id: id,
            name: name,
            main_image: main_image,
            original_price: original_price,
            present_price: present_price,
            inventory: inventory,
            repeat_purchase: repeat_purchase,
            once_max_purchase_count: once_max_purchase_count,
            phone: phone,
            introduce: introduce,
            vedio_path: vedio_path,
            instruction: instruction,
            deadline_time: deadline_time,
        });
        wx.navigateTo({
            url: allUrl,
        })
    },

    delete: function (e) {
        let op = this;
        let id = e.currentTarget.dataset.id;
        op.setData({
            productId: id,
            isConfirmShow: true,
        })
    },

    deny: function (e) {
        let op = this;
        op.setData({
            isConfirmShow: false,
        });
    },

    confirm: function (e) {
        let op = this;
        op.deleteProduct();
    },

    deleteProduct: function (e) {
        let op = this;
        app.post("/product/deleteProductById", {
            productId: op.data.productId
        }, function (data) {
            if (typeof (data) == 'number') {
                op.setData({
                    isConfirmShow: false,
                    productList: [],
                    start: 0,
                    hasMoreData: true,
                })
                op.loadAllProduct();
            }
        })
    },

    oneProduct: function (e) {
        let id = e.currentTarget.dataset.id;
        let card_id = e.currentTarget.dataset.card_id;
        let name = e.currentTarget.dataset.name;
        let main_image = e.currentTarget.dataset.main_image;
        let original_price = e.currentTarget.dataset.original_price;
        let present_price = e.currentTarget.dataset.present_price;
        let inventory = e.currentTarget.dataset.inventory;
        let repeat_purchase = e.currentTarget.dataset.repeat_purchase;
        let once_max_purchase_count = e.currentTarget.dataset.once_max_purchase_count;
        let phone = e.currentTarget.dataset.phone;
        let introduce = e.currentTarget.dataset.introduce == undefined ? "" : e.currentTarget.dataset.introduce;
        let vedio_path = e.currentTarget.dataset.vedio_path == undefined ? "" : e.currentTarget.dataset.vedio_path;
        let instruction = e.currentTarget.dataset.instruction;
        let deadline_time = e.currentTarget.dataset.deadline_time;

        let allUrl = util.fillUrlParams("/pages/product/oneProduct", {
            id: id,
            card_id: card_id,
            name: name,
            main_image: main_image,
            original_price: original_price,
            present_price: present_price,
            inventory: inventory,
            repeat_purchase: repeat_purchase,
            once_max_purchase_count: once_max_purchase_count,
            phone: phone,
            introduce: introduce,
            vedio_path: vedio_path,
            instruction: instruction,
            deadline_time: deadline_time,
        });
        wx.navigateTo({
            url: allUrl,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadAllProduct();
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
        this.setData({
            productList: [],
            start: 0,
            hasMoreData: true,
        });
        this.loadAllProduct();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.hasMoreData) {
            this.loadAllProduct();
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