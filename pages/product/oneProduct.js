var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: -1,
        name: '',
        card_id: '',
        main_image: '',
        original_price: '',
        present_price: '',
        inventory: '',
        repeat_purchase: '',
        once_max_purchase_count: '',
        phone: '',
        introduce: '',
        vedio_path: '',
        instruction: '',
        deadline_time: '',
        deadlineTimeBuXianFlag: false,
        pictureList: [],

        logopic: '',
        company: '',
        company_id: '',
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

    getOtherImageList: function (e) {
        let op = this;
        app.post("/product/getOtherImagesById", {
            productId: op.data.id,
        }, function (data) {
            if (app.hasData(data)) {
                if (data.length > 0) {
                    let pictureList = [];
                    for (let i = 0; i < data.length; i++) {
                        pictureList.push('https://qinzi123.com' + data[i].url)
                    }
                    op.setData({
                        pictureList: pictureList,
                    })
                }
            }
        })
    },

    loadReleaserInfo: function (e) {
        let op = this;
        app.post("/product/getReleaseCompanyInfoByCardId", {
            card: app.getUserId(),
        }, function (data) {
            if (app.hasData(data)) {
                op.setData({
                    logopic: data.logopic.indexOf("https") == -1 ? 'https://qinzi123.com' + data.logopic : data.logopic,
                    company: data.company,
                    company_id: data.id,
                })
            }
        })
    },

    jumpEstablishment: function (e) {
        let companyId = e.currentTarget.dataset.company_id;
        app.post("/product/getReleaseCompanyInfoByCompanyId", {
            companyId: companyId
        }, function (data) {
            if (app.hasData(data)) {
                let establishmentInfo = data[0];
                let id = establishmentInfo.id;
                let leaguetype = establishmentInfo.leaguetype;
                let companydesc = establishmentInfo.companydesc;
                let company = establishmentInfo.company;
                let logopic = establishmentInfo.logopic;
                let members = establishmentInfo.members;
                let companyaddr = establishmentInfo.companyaddr;
                let companytel = establishmentInfo.companytel;
                let companyweb = establishmentInfo.companyweb;
                let industry = establishmentInfo.industry;
                let mainbussiness = establishmentInfo.mainbussiness;
                let maindemand = establishmentInfo.maindemand;
                let licensepic = establishmentInfo.licensepic;
                let contactname = establishmentInfo.contactname;
                let contactduty = establishmentInfo.contactduty;
                let contacttel = establishmentInfo.contacttel;
                let contactwx = establishmentInfo.contactwx;
                let contactopenid = establishmentInfo.contactopenid;
                let email = establishmentInfo.email;

                var allUrl = util.fillUrlParams('/pages/establishment/oneEstablishment', {
                    id: id,
                    leaguetype: leaguetype,
                    companydesc: companydesc,
                    company: company,
                    logopic: logopic,
                    members: members,
                    companyaddr: companyaddr,
                    companytel: companytel,
                    companyweb: companyweb,
                    industry: industry,
                    mainbussiness: mainbussiness,
                    maindemand: maindemand,
                    licensepic: licensepic,
                    contactname: contactname,
                    contactduty: contactduty,
                    contacttel: contacttel,
                    contactwx: contactwx,
                    contactopenid: contactopenid,
                    email: email,

                    searchValue: "",
                    inputShowed: false,
                });
                wx.navigateTo({
                    url: allUrl
                });
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        let card_id = options.card_id;
        let name = options.name;
        let main_image = options.main_image.indexOf("http") == -1 ? 'https://qinzi123.com' + options.main_image : options.main_image;
        let original_price = options.original_price;
        let present_price = options.present_price;
        let inventory = options.inventory;
        let repeat_purchase = options.repeat_purchase;
        let once_max_purchase_count = options.once_max_purchase_count;
        let phone = options.phone;
        let introduce = options.introduce == "" ? "" : options.introduce;
        let video_path = options.vedio_path == "" ? "" : (options.vedio_path.indexOf("http") == -1 ? 'https://qinzi123.com' + options.vedio_path : options.vedio_path);
        let instruction = options.instruction;
        let deadline_time = options.deadline_time;
        let deadlineTimeBuXianFlag;
        if (deadline_time.indexOf('9999') != -1) {
            deadlineTimeBuXianFlag = true;
        } else {
            deadlineTimeBuXianFlag = false;
        }

        this.setData({
            id: id,
            name: name,
            card_id: card_id,
            main_image: main_image,
            original_price: original_price,
            present_price: present_price,
            inventory: inventory,
            repeat_purchase: repeat_purchase,
            once_max_purchase_count: once_max_purchase_count,
            phone: phone,
            introduce: introduce,
            video_path: video_path,
            instruction: instruction,
            deadline_time: deadline_time,
            deadlineTimeBuXianFlag: deadlineTimeBuXianFlag,
        })

        this.getOtherImageList();
        this.loadReleaserInfo();
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