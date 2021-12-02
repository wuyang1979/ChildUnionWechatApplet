var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        searchLetter: [],
        showLetter: "",
        winHeight: 0,
        cityList: [],
        isShowLetter: false,
        scrollTop: 0, //置顶高度
        scrollTopId: '', //置顶id
        city: "",
        cityList_search: [],
        address_show: false,
        search_city: [],
        is_data: true,
        empty: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 生命周期函数--监听页面加载
        let that = this;
        var searchLetter = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"];
        new Promise(function (resolve) {
            that.getCity(function (data) {
                let cityObj = data.cityList;
                var tempObj = [];
                for (var i = 0; i < searchLetter.length; i++) {
                    var initial = searchLetter[i];
                    var cityInfo = [];
                    var tempArr = {};
                    tempArr.initial = initial;
                    for (var j = 0; j < cityObj.length; j++) {
                        if (initial == cityObj[j].first_name) {
                            cityInfo.push(cityObj[j]);
                        }
                    }
                    tempArr.cityInfo = cityInfo;
                    tempObj.push(tempArr);
                }
                that.setData({
                    cityList: tempObj
                })
                resolve(tempObj);
            })

        }).then(function (res) {
            let cityObj = [];
            var sysInfo = wx.getSystemInfoSync();
            var winHeight = sysInfo.windowHeight;
            var itemH = winHeight / searchLetter.length;
            var tempObj = [];
            for (var i = 0; i < searchLetter.length; i++) {
                var temp = {};
                temp.name = searchLetter[i];
                temp.tHeight = i * itemH;
                temp.bHeight = (i + 1) * itemH;
                tempObj.push(temp)
            }
            that.setData({
                winHeight: winHeight,
                itemH: itemH,
                searchLetter: tempObj,
            })
        })

    },
    getCity: function (callBack) {
        let that = this;
        app.getUrl('/business/listCitys', function (data) {
            if (app.hasData(data)) {
                that.setData({
                    cityList: data,
                })
                callBack({
                    cityList: data,
                })
            } else {
                callBack({
                    cityList: data,
                })
            }
        })
    },
    search_city: function (e) {
        let that = this;
        that.setData({
            address_show: true
        })

    },
    cancel_city: function (e) {
        let that = this;
        that.setData({
            search_city: [],
            address_show: false,
            empty: '',
        })
    },
    seacrch_city: function (e) {
        let that = this;
        let search_val = e.detail.value;
        if (search_val == '') {
            return;
        }
        app.getUrl('/business/searchCity/' + search_val, function (data) {
            if (app.hasData(data)) {
                that.setData({
                    search_city: data,
                    is_data: true
                })
            } else {
                that.setData({
                    search_city: data,
                    is_data: false
                })
            }
        })
    },
    clickLetter: function (e) {
        var showLetter = e.currentTarget.dataset.letter;
        // isShowLetter: true,
        this.setData({
            showLetter: showLetter,
            scrollTopId: showLetter,
        });
        // var that = this;
        // setTimeout(function () {
        //     that.setData({
        //         isShowLetter: false
        //     })
        // }, 1000)
    },
    //选择城市
    bindCity: function (e) {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        let prePage = pages[pages.length - 2];
        prePage.setData({
            cityCode: e.currentTarget.dataset.citycode,
            cityName: e.currentTarget.dataset.cityname,
            needRefreshFlag:true,
        })
        wx.navigateBack({
            delta: 1,
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