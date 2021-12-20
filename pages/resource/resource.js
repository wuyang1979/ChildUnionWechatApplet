Page({

    /**
     * 页面的初始数据
     */
    data: {
        tipsShow: false,
        title: "",
        content: "",
        address: "",
        rules: ""
    },

    closed: function (e) {
        let op = this;
        let tipShow = op.data.tipsShow
        this.setData({
            tipsShow: !tipShow
        })
    },

    showTips: function (e) {
        let op = this;
        let tipShow = op.data.tipsShow;
        let type = e.currentTarget.dataset.type;
        var title, content, address, rules;
        switch (type) {
            case "1":
                title = "三国村";
                content = "门票包含成人和身高1.4米以下的儿童。";
                rules = "";
                address = "南京市江宁区淳化街道马场山";
                break;
            case "2":
                title = "麦迪格眼科";
                content = "青少年（7-18周岁）验配近视防蓝光眼镜0元每幅。";
                rules = "1、首次到院才可享受 2、由至少一位家长陪同 3、儿童为7-18周岁 4、检查之前，需提前一天预约，预约电话：17849901966";
                address = "南京市秦淮区曙光天地1号麦迪格眼科";
                break;
            case "3":
                title = "火车莱斯";
                content = "门票包含成人和身高1.4米以下的儿童。";
                rules = "";
                address = "南京市江宁区东南大学路1号秣陵杏花村";
                break;
            case "4":
                title = "极橙儿童齿科";
                content = "1、儿童预防性清洁1次 2、挂号1次 3、全口检查1次 4、专业刷牙指导1次";
                rules = "每位小朋友仅可使用1次，需提前至少3天和客服预约看诊时间，预约电话：025-85792776";
                address = "南京市玄武区珠江路88号新世界百货B座101室极橙儿童齿科（必胜客旁）";
                break;
        }

        op.setData({
            title: title,
            content: content,
            rules: rules,
            address: address,
            tipsShow: !tipShow
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
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