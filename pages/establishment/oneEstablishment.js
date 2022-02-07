var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        leaguetype: "",
        companydesc: "",
        company: "",
        logopic: "",
        members: "",
        companyaddr: "",
        companytel: "",
        companyweb: "",
        industry: "",
        mainbussiness: "",
        maindemand: "",
        licensepic: "",
        contactname: "",
        contactduty: "",
        contacttel: "",
        contactwx: "",
        contactopenid: "",
        email: "",

        memberList: [],

        isLeague: false,
    },

    getEstablishmemtMemberList: function (e) {
        let op = this;
        app.post("/establishment/getEstablishmemtMainMember", {
            id: op.data.id
        }, function (data1) {
            if (app.hasData(data1)) {
                if (data1.length > 0) {
                    let mainMemberList = data1[0];
                    let mainMemberName = mainMemberList.realname;

                    app.post("/establishment/getMemberList", {
                        id: op.data.id
                    }, function (data2) {
                        if (app.hasData(data2)) {

                            let memberList = data2;
                            let mainMemberindex = -1;
                            for (let i = 0; i < memberList.length; i++) {
                                if (memberList[i].realname == mainMemberName) {
                                    mainMemberindex = i;
                                }
                            }
                            if (mainMemberindex != -1) {
                                memberList.splice(mainMemberindex, 1);
                            }
                            memberList.unshift(mainMemberList);
                            op.setData({
                                memberList: memberList,
                            })
                        }
                    })
                }
            }
        })
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

    getSelfEstablishmentLeague: function (e) {
        let op = this;
        let card = wx.getStorageSync('id');
        if (card == "") {
            wx.showToast({
                title: '系统异常',
            })
        }

        app.post("/knowledge/isLeaguer", {
            id: card
        }, function (data) {
            if (app.hasData(data)) {
                if (data.leaguer == 1) {
                    op.setData({
                        isLeague: true
                    })
                }
            }
        })

    },

    toBeEstablishmentVip: function (e) {
        let op = this;
        let allUrl = util.fillUrlParams('/pages/campaign/score', {
            individualShowFlag: JSON.stringify(true),
            enterpriseShowFlag: JSON.stringify(false),
        });
        wx.navigateTo({
            url: allUrl,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = options.id;
        let leaguetype = options.leaguetype;
        let companydesc = options.companydesc;
        let company = options.company;
        let logopic = options.logopic;
        let members = options.members;
        let companyaddr = options.companyaddr;
        let companytel = options.companytel;
        let companyweb = options.companyweb;
        let industry = options.industry;
        let mainbussiness = options.mainbussiness;
        let maindemand = options.maindemand;
        let licensepic = options.licensepic;
        let contactname = options.contactname;
        let contactduty = options.contactduty;
        let contacttel = options.contacttel;
        let contactwx = options.contactwx;
        let contactopenid = options.contactopenid;
        let email = options.email;

        this.setData({
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
        });

        this.getEstablishmemtMemberList();
        this.getSelfEstablishmentLeague();

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
        let op = this;
        let allUrl = util.fillUrlParams('/pages/establishment/oneEstablishment', {
            id: op.data.id,
            leaguetype: op.data.leaguetype,
            companydesc: op.data.companydesc,
            company: op.data.company,
            logopic: op.data.logopic,
            members: op.data.members,
            companyaddr: op.data.companyaddr,
            companytel: op.data.companytel,
            companyweb: op.data.companyweb,
            industry: op.data.industry,
            mainbussiness: op.data.mainbussiness,
            maindemand: op.data.maindemand,
            licensepic: op.data.licensepic,
            contactname: op.data.contactname,
            contactduty: op.data.contactduty,
            contacttel: op.data.contacttel,
            contactwx: op.data.contactwx,
            contactopenid: op.data.contactopenid,
            email: op.data.email,

            memberList: op.data.memberList,
        });

        return {
            title: '分享了一个机构信息！',
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