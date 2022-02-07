var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        baseList: [],
        start: 0,
        screenStart: 0,
        pageSize: 10,
        hasMoreData: true,
        screenHasMoreData: true,
        selectDistrictName: "行政区",
        selectDistrictCode: 0,
        selectTypeName: "类型",
        selectTypeCode: 0,
        district: 0,
        selectDistrictFlag: false,
        selectTypFlag: false,
        districtList: [],
        typeList: [],
        searchValue: "",
        inputShowed: false,
    },

    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },

    searchSubmit: function (e) {
        this.setData({
            baseList: [],
            start: 0,
            hasMoreData: true,
            screenStart: 0,
            screenHasMoreData: true,
            inputShowed: false
        });
        this.loadSearchBase();
    },

    settled: function (e) {
        let op = this;
        var card = wx.getStorageSync('id');
        if (card == '') {
            app.onGotUserInfo(e, function () {
                var id = app.getUserId();
                op.setData({
                    id: id
                });
            });
            return;
        }
        var allUrl = util.fillUrlParams('/pages/base/settle', {});
        wx.navigateTo({
            url: allUrl,
        })
    },

    clearInput: function () {
        this.setData({
            baseList: [],
            start: 0,
            hasMoreData: true,
            searchValue: "",
            inputShowed: false,
            selectDistrictName: "行政区",
            selectDistrictCode: 0,
            selectTypeName: "类型",
            selectTypeCode: 0,
            screenStart: 0,
            screenHasMoreData: true,
        });
        this.loadAllBase();
    },

    inputTyping: function (e) {
        this.setData({
            searchValue: e.detail.value
        });
    },

    loadSearchBase: function (e) {
        var op = this;
        var id = wx.getStorageSync('id');
        id = id == '' ? -1 : id;
        var baseList = this.data.baseList;
        // 加载商户
        app.post('/base/searchList', {
            id: id,
            start: op.data.start,
            num: op.data.pageSize,
            searchValue: op.data.searchValue
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    data[i].main_image = app.qinzi + data[i].main_image;
                }
                if (data.length < op.data.pageSize) {
                    op.setData({
                        baseList: baseList.concat(data),
                        hasMoreData: false
                    });
                } else {
                    op.setData({
                        baseList: baseList.concat(data),
                        hasMoreData: true,
                        start: op.data.start + op.data.pageSize
                    })
                }
            }
        });
    },

    clearSearch: function (e) {
        let op = this;
        op.setData({
            baseList: [],
            start: 0,
            hasMoreData: true,
            searchValue: "",
            inputShowed: false,
            selectDistrictName: "行政区",
            selectDistrictCode: 0,
            selectTypeName: "类型",
            selectTypeCode: 0,
            screenStart: 0,
            screenHasMoreData: true,
        });
        op.loadAllBase();
    },

    loadAllBase: function () {
        var op = this;
        var id = wx.getStorageSync('id');
        id = id == '' ? -1 : id;
        var baseList = this.data.baseList;
        // 加载商户
        app.post('/base/list', {
            id: id,
            start: op.data.start,
            num: op.data.pageSize,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    data[i].main_image = app.qinzi + data[i].main_image;
                }
                if (data.length < op.data.pageSize) {
                    op.setData({
                        baseList: baseList.concat(data),
                        hasMoreData: false
                    });
                } else {
                    op.setData({
                        baseList: baseList.concat(data),
                        hasMoreData: true,
                        start: op.data.start + op.data.pageSize
                    })
                }
            }
        });
    },

    selectDistrict: function (e) {
        let op = this;
        op.setData({
            selectDistrictFlag: !op.data.selectDistrictFlag,
            selectTypFlag: false,
        });
    },


    selectType: function (e) {
        let op = this;
        op.setData({
            selectDistrictFlag: false,
            selectTypFlag: !op.data.selectTypFlag,
        });
    },

    screenDistrict: function (e) {
        let op = this;
        let districtName = e.currentTarget.dataset.districtname;
        let districtCode = e.currentTarget.dataset.districtcode;
        op.setData({
            selectDistrictFlag: false,
            selectDistrictName: districtName,
            selectDistrictCode: districtCode,
            screenStart: 0,
            screenHasMoreData: true,
            hasMoreData: true,
            baseList: [],
        });
        op.screenBaseList();
    },

    screenType: function (e) {
        let op = this;
        let typeName = e.currentTarget.dataset.typename;
        let typeCode = e.currentTarget.dataset.typecode;
        op.setData({
            selectTypFlag: false,
            selectTypeName: typeName,
            selectTypeCode: typeCode,
            screenStart: 0,
            hasMoreData: true,
            screenHasMoreData: true,
            baseList: [],
        });
        op.screenBaseList();
    },

    screenBaseList: function (e) {
        let op = this;
        let baseList = op.data.baseList;
        app.post('/base/screenBaseList', {
            districtCode: op.data.selectDistrictCode,
            typeCode: op.data.selectTypeCode,
            start: op.data.screenStart,
            num: op.data.pageSize,
        }, function (data) {
            if (app.hasData(data)) {
                for (let i = 0; i < data.length; i++) {
                    data[i].main_image = app.qinzi + data[i].main_image;
                }

                if (data.length < op.data.pageSize) {
                    op.setData({
                        baseList: baseList.concat(data),
                        screenHasMoreData: false
                    });
                } else {
                    op.setData({
                        baseList: baseList.concat(data),
                        screenHasMoreData: true,
                        start: op.data.screenStart + op.data.pageSize
                    })
                }
            }
        });
    },

    oneBase: function (e) {
        let card = wx.getStorageSync('id');
        if (card == "") {
          app.onGotUserInfo(e, function () {});
          return;
        }
        
        let id = e.currentTarget.dataset.id;
        let name = e.currentTarget.dataset.name;
        let topic_type_id = e.currentTarget.dataset.topic_type_id;
        let topic_type = e.currentTarget.dataset.topic_type;
        let price = e.currentTarget.dataset.price;
        let open_time = e.currentTarget.dataset.open_time;
        let traffic = e.currentTarget.dataset.traffic;
        let workaddress = e.currentTarget.dataset.workaddress;
        let official_account_name = e.currentTarget.dataset.official_account_name;
        let introduce = e.currentTarget.dataset.introduce;
        let card_id = e.currentTarget.dataset.card_id;
        let main_image = e.currentTarget.dataset.main_image;
        let longitude = e.currentTarget.dataset.longitude;
        let latitude = e.currentTarget.dataset.latitude;
        let level = e.currentTarget.dataset.level;
        let card_name = e.currentTarget.dataset.card_name;
        let city = e.currentTarget.dataset.city;
        let district = e.currentTarget.dataset.district;
        let levelId = e.currentTarget.dataset.levelid;
        let districtName = e.currentTarget.dataset.districtname;
        let number = e.currentTarget.dataset.number;
        let leaguetype = e.currentTarget.dataset.leaguetype;
        let phone = e.currentTarget.dataset.phone;

        var allUrl = util.fillUrlParams('/pages/base/oneBase', {
            id: id,
            name: name,
            topic_type_id: topic_type_id,
            topic_type: JSON.stringify(topic_type),
            price: price,
            open_time: open_time,
            traffic: traffic,
            workaddress: workaddress,
            official_account_name: official_account_name,
            introduce: introduce,
            card_id: card_id,
            main_image: main_image,
            longitude: longitude,
            latitude: latitude,
            level: level,
            card_name: card_name,
            city: city,
            district: district,
            levelId: levelId,
            districtName: districtName,
            number: number,
            leaguetype: leaguetype,
            phone: phone,
        });
        wx.navigateTo({
            url: allUrl
        });
    },

    toBaseMap: function (e) {
        app.post("/base/allBaseMapInfo", {}, function (data) {
            if (app.hasData(data)) {
                let allUrl = util.fillUrlParams("/pages/base/baseMap", {
                    baseMapData: JSON.stringify(data),
                });
                wx.navigateTo({
                    url: allUrl,
                })
            }
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadAllBase();
        let districtList = [{
                districtCode: 0,
                districtName: "不限"
            }, {
                districtCode: 1,
                districtName: "秦淮区"
            },
            {
                districtCode: 2,
                districtName: "玄武区"
            }, {
                districtCode: 3,
                districtName: "建邺区"
            }, {
                districtCode: 4,
                districtName: "雨花台区"
            }, {
                districtCode: 5,
                districtName: "鼓楼区"
            }, {
                districtCode: 6,
                districtName: "江宁区"
            }, {
                districtCode: 7,
                districtName: "六合区"
            }, {
                districtCode: 8,
                districtName: "浦口区"
            }, {
                districtCode: 9,
                districtName: "栖霞区"
            }, {
                districtCode: 10,
                districtName: "高淳区"
            }, {
                districtCode: 11,
                districtName: "溧水区"
            },
        ];

        let typeList = [{
            typeCode: 0,
            typeName: "不限"
        }, {
            typeCode: 1,
            typeName: "历史遗迹"
        }, {
            typeCode: 2,
            typeName: "文博场馆"
        }, {
            typeCode: 3,
            typeName: "红色旅游"
        }, {
            typeCode: 4,
            typeName: "宗教胜迹"
        }, {
            typeCode: 5,
            typeName: "美丽乡村"
        }, {
            typeCode: 6,
            typeName: "南京新景"
        }, {
            typeCode: 7,
            typeName: "亲子研学"
        }, {
            typeCode: 8,
            typeName: "国际营地"
        }, {
            typeCode: 9,
            typeName: "其它景点"
        }];

        this.setData({
            districtList: districtList,
            typeList: typeList,
        });

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
    onShow: function () {},

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
            baseList: [],
            start: 0,
            hasMoreData: true,
            searchValue: "",
            inputShowed: false,
            selectDistrictName: "行政区",
            selectDistrictCode: 0,
            selectTypeName: "类型",
            selectTypeCode: 0,
            screenStart: 0,
            screenHasMoreData: true,
        });
        this.loadAllBase();
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

        if (this.data.selectTypeCode == 0 && this.data.selectDistrictCode == 0) {
            if (this.data.hasMoreData) {
                this.loadAllBase();
            } else {
                wx.showToast({
                    title: '没有更多数据',
                    duration: 500,
                })
            }
        } else {
            if (this.data.screenHasMoreData) {
                this.screenBaseList();
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
        var op = this;
        var allUrl = util.fillUrlParams('/pages/base/list', {
            baseList: op.data.baseList,
            start: op.data.start,
            pageSize: op.data.pageSize,
            hasMoreData: op.data.hasMoreData,
            selectDistrictName: op.data.selectDistrictName,
            selectDistrictCode: op.data.selectDistrictCode,
            selectTypeName: op.data.selectTypeName,
            selectTypeCode: op.data.selectTypeCode,
            district: op.data.district,
            selectDistrictFlag: op.data.selectDistrictFlag,
            selectTypFlag: op.data.selectTypFlag,
            districtList: op.data.districtList,
            typeList: op.data.typeList,
            searchValue: op.data.searchValue,
            inputShowed: op.data.inputShowed,
            screenStart: 0,
            screenHasMoreData: true,
        });

        return {
            title: '分享了一些活动基地！',
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