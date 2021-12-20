var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        temporarilyUnableViewUrl: app.qinzi + '/file/temporarily-unable-view.png',
        establishmentList: [],
        start: 0,
        pageSize: 30,
        hasMoreData: true,
        screenIndustryHasMoreData: true,
        searchValue: "",
        inputShowed: false,
        selectTypeName: "全部行业",
        selectTypeCode: -1,
        selectTypeFlag: false,
        typeList: [],
        screenIndustryStart: 0,
        screenIndustryPageSize: 30,
    },

    inputTyping: function (e) {
        this.setData({
            searchValue: e.detail.value
        });
    },

    clearInput: function () {
        this.setData({
            establishmentList: [],
            start: 0,
            hasMoreData: true,
            searchValue: "",
            inputShowed: false,
        });
        this.loadEstablishMents();
    },

    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },

    clearSearch: function (e) {
        let op = this;
        op.setData({
            establishmentList: [],
            start: 0,
            hasMoreData: true,
            searchValue: "",
            inputShowed: false,
        });
        op.loadEstablishMents();
    },

    searchSubmit: function (e) {
        this.setData({
            establishmentList: [],
            start: 0,
            hasMoreData: true,
            inputShowed: false
        });
        this.loadSearchEstablishments();
    },

    loadSearchEstablishments: function (e) {
        var op = this;
        var id = wx.getStorageSync('id');
        id = id == '' ? -1 : id;
        // 加载商户
        app.post('/establishment/searchList', {
            id: id,
            searchValue: op.data.searchValue
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].logopic == "") {
                        data[i].logopic = op.data.temporarilyUnableViewUrl;
                    } else if (data[i].logopic.indexOf('http') == -1) {
                        data[i].logopic = app.qinzi + data[i].logopic;
                    }
                }
                op.setData({
                    establishmentList: data,
                });
            }
        });
    },

    settled: function (e) {
        let op = this;
        var card = wx.getStorageSync('id');
        if (card == '') {
            app.onGotUserInfo(e, function () {
                var allUrl = util.fillUrlParams('/pages/establishment/settle', {});
                wx.navigateTo({
                    url: allUrl,
                })
            });
            return;
        } else {
            var allUrl = util.fillUrlParams('/pages/establishment/settle', {});
            wx.navigateTo({
                url: allUrl,
            })
        }
    },

    screenEstablishmentList: function (e) {
        let op = this;
        let establishmentList = op.data.establishmentList;
        app.post('/establishment/screenEstablishmentList', {
            industry: op.data.selectTypeCode,
            start: op.data.screenIndustryStart,
            num: op.data.screenIndustryPageSize,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].logopic == "") {
                        data[i].logopic = op.data.temporarilyUnableViewUrl;
                    } else if (data[i].logopic.indexOf('http') == -1) {
                        data[i].logopic = app.qinzi + data[i].logopic;
                    }
                }
                if (data.length < op.data.pageSize) {
                    op.setData({
                        establishmentList: establishmentList.concat(data),
                        screenIndustryHasMoreData: false
                    });
                } else {
                    op.setData({
                        establishmentList: establishmentList.concat(data),
                        screenIndustryHasMoreData: true,
                        screenIndustryStart: op.data.screenIndustryStart + op.data.screenIndustryPageSize
                    })
                }
            }
        });
    },

    loadEstablishMents: function (e) {
        let op = this;
        let establishmentList = op.data.establishmentList;
        app.post('/establishment/list', {
            start: op.data.start,
            num: op.data.pageSize,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    if (data[i].logopic == "") {
                        data[i].logopic = op.data.temporarilyUnableViewUrl;
                    } else if (data[i].logopic.indexOf('http') == -1) {
                        data[i].logopic = app.qinzi + data[i].logopic;
                    }
                }
                if (data.length < op.data.pageSize) {
                    op.setData({
                        establishmentList: establishmentList.concat(data),
                        hasMoreData: false
                    });
                } else {
                    op.setData({
                        establishmentList: establishmentList.concat(data),
                        hasMoreData: true,
                        start: op.data.start + op.data.pageSize
                    })
                }
            }
        });
    },

    refreshEstablishment: function () {
        this.setData({
            establishmentList: [],
            start: 0,
            pageSize: 30,
            hasMoreData: true,
            searchValue: "",
            inputShowed: false,
        });
        this.loadEstablishMents();
    },

    oneEstablishment: function (e) {
        let id = e.currentTarget.dataset.id;
        let leaguetype = e.currentTarget.dataset.leaguetype;
        let companydesc = e.currentTarget.dataset.companydesc;
        let company = e.currentTarget.dataset.company;
        let logopic = e.currentTarget.dataset.logopic;
        let members = e.currentTarget.dataset.members;
        let companyaddr = e.currentTarget.dataset.companyaddr;
        let companytel = e.currentTarget.dataset.companytel;
        let companyweb = e.currentTarget.dataset.companyweb;
        let industry = e.currentTarget.dataset.industry;
        let mainbussiness = e.currentTarget.dataset.mainbussiness;
        let maindemand = e.currentTarget.dataset.maindemand;
        let licensepic = e.currentTarget.dataset.licensepic;
        let contactname = e.currentTarget.dataset.contactname;
        let contactduty = e.currentTarget.dataset.contactduty;
        let contacttel = e.currentTarget.dataset.contacttel;
        let contactwx = e.currentTarget.dataset.contactwx;
        let contactopenid = e.currentTarget.dataset.contactopenid;
        let email = e.currentTarget.dataset.email;

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
    },

    selectType: function (e) {
        let op = this;
        op.setData({
            selectTypeFlag: !op.data.selectTypeFlag,
        });
    },

    screenType: function (e) {
        let op = this;
        let typeName = e.currentTarget.dataset.typename;
        let typeCode = e.currentTarget.dataset.typecode;
        op.setData({
            selectTypeFlag: false,
            selectTypeName: typeName,
            selectTypeCode: typeCode,
            establishmentList: [],
            screenIndustryStart: 0,
            screenIndustryPageSize: 30,
            screenIndustryHasMoreData: true,
        });
        if (typeCode == -1) {
            op.refreshEstablishment();
        } else {
            op.screenEstablishmentList();
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let typeList = [{
            typeCode: -1,
            typeName: "全部行业"
        }, {
            typeCode: 0,
            typeName: "教育培训"
        }, {
            typeCode: 1,
            typeName: "亲子活动"
        }, {
            typeCode: 2,
            typeName: "生活服务"
        }, {
            typeCode: 3,
            typeName: "亲子基地"
        }, {
            typeCode: 4,
            typeName: "其他行业"
        }];

        this.setData({
            typeList: typeList,
        });

        this.loadEstablishMents();

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
        this.refreshEstablishment();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        if (this.data.selectTypeCode == -1) {
            if (this.data.hasMoreData) {
                this.loadEstablishMents();
            } else {
                wx.showToast({
                    title: '没有更多数据',
                    duration: 500,
                })
            }
        } else {
            if (this.data.screenIndustryHasMoreData) {
                this.screenEstablishmentList();
            } else {
                wx.showToast({
                    title: '没有更多数据',
                    duration: 500,
                })
            }
        }

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
        let op = this;
        let allUrl = util.fillUrlParams('/pages/establishment/list', {
            temporarilyUnableViewUrl: op.data.temporarilyUnableViewUrl,
            establishmentList: op.data.establishmentList,
            start: op.data.start,
            pageSize: op.data.pageSize,
            hasMoreData: op.data.hasMoreData,
            searchValue: op.data.searchValue,
            inputShowed: op.data.inputShowed,
            selectTypeName: op.data.selectTypeName,
            selectTypeCode: op.data.selectTypeCode,
            selectTypeFlag: op.data.selectTypeFlag,
            typeList: op.data.typeList,
            screenIndustryStart: op.data.screenIndustryStart,
            screenIndustryPageSize: op.data.screenIndustryPageSize,
        });

        return {
            title: '分享了一些企业机构！',
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