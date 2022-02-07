var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardId: "",
        name: "",
        price: "",
        openTime: "",
        selectLevel: false,
        selectDistrict: false,
        level: '',
        traffic: "",
        address: "",
        phone: "",
        city: "南京市",
        districtIndex: "",
        district: "",
        officialAccountName: "",
        introduce: "",
        mainImage: [],
        mainImagePic: [],
        baseTopicTypeList: [],
        topicTypeIdList: [],
        topicTypeNameList: [],
        topicTypeName: "",
        topicTypeId: "",
        latitude: "",
        longitude: "",
    },

    inputName: function (e) {
        let op = this;
        op.setData({
            name: e.detail.value,
        })
    },

    getLocation: function (e) {
        let op = this;
        wx.getLocation({
            success: (res) => {
                let latitude = res.latitude;
                let longitude = res.longitude;
                wx.chooseLocation({
                    latitude: latitude,
                    longitude: longitude,
                    success: (res) => {
                        op.setData({
                            longitude: res.longitude,
                            latitude: res.latitude,
                        })
                    },
                });
            }
        })


    },

    inputPrice: function (e) {
        let op = this;
        op.setData({
            price: e.detail.value,
        })
    },

    inputOpenTime: function (e) {
        let op = this;
        op.setData({
            openTime: e.detail.value,
        })
    },

    bindLevelPickerChange: function (e) {
        this.setData({
            level: e.detail.value,
            selectLevel: true
        });
    },

    bindDistrictPickerChange: function (e) {
        this.setData({
            district: parseInt(e.detail.value) + 1 + "",
            districtIndex: e.detail.value,
            selectDistrict: true
        });
    },

    inputTraffic: function (e) {
        let op = this;
        op.setData({
            traffic: e.detail.value,
        })
    },

    inputAddress: function (e) {
        let op = this;
        op.setData({
            address: e.detail.value,
        })
    },

    inputPhone: function (e) {
        let op = this;
        op.setData({
            phone: e.detail.value,
        })
    },

    inputCity: function (e) {
        let op = this;
        op.setData({
            city: e.detail.value,
        })
    },

    inputOfficialAccountName: function (e) {
        let op = this;
        op.setData({
            officialAccountName: e.detail.value,
        })
    },

    inputIntroduce: function (e) {
        let op = this;
        op.setData({
            introduce: e.detail.value,
        })
    },

    uploadMainImage: function (e) {
        let op = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                var imgsrc = res.tempFilePaths;
                var mainImageTemp = op.data.mainImagePic;
                for (let i = 0; i < imgsrc.length; i++) {
                    mainImageTemp.push(imgsrc[i]);
                }
                op.setData({
                    mainImagePic: mainImageTemp
                });
            },
            fail() {

            },
            complete() {
                var pisc = op.data.mainImagePic;
                let mainImagePicTemp = pisc[0];
                wx.compressImage({
                    src: mainImagePicTemp, // 图片路径
                    quality: 80, // 压缩质量
                    success: function (res) {},
                    fail: function (res) {

                    },
                    complete: function (res) {

                    }
                })
                op.uploadimg({
                    url: app.qinzi + '/mini/uploadFile/sourcePath', //请更改为你自己部署的接口
                    path: pisc,
                });
            }
        })
    },

    uploadimg: function (data) {
        var that = this,
            i = data.i ? data.i : 0,
            success = data.success ? data.success : 0,
            fail = data.fail ? data.fail : 0;
        wx.uploadFile({
            url: data.url,
            filePath: data.path[i],
            name: 'file',
            formData: null,
            success: (res) => {
                success++;
                var data = JSON.parse(res.data);
                let mainImagePicTemp = [];
                mainImagePicTemp.push(app.qinzi + data.data.url);
                that.setData({
                    mainImagePic: mainImagePicTemp,
                });
                let mainImageTemp = [];
                mainImageTemp.push(data.data.url);
                that.setData({
                    mainImage: mainImageTemp,
                });
            },
            fail: (res) => {
                fail++;
            },
            complete: () => {
                i++;
                if (i == data.path.length) {
                    //当图片传完时，停止调用 
                    // that.setData({
                    //   showResult: '上传成功'
                    // });
                } else { //若图片还没有传完，则继续调用函数
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    that.uploadimg(data);
                }
            }
        });
    },

    // selectTopicType: function (e) {
    //     let op = this;
    //     op.setData({
    //         isSelectAreaShow: true,
    //     });
    // },

    // selectConfirm: function (e) {
    //     let op = this;
    //     op.setData({
    //         isSelectAreaShow: false,
    //     });
    // },

    getBaseTopicTypeList: function (e) {
        let op = this;
        app.post('/base/getBaseTopicTypeList', {}, function (data) {
            if (app.hasData(data)) {
                op.setData({
                    baseTopicTypeList: data
                });
            }
        });
    },

    itemSelected: function (e) {
        let op = this;
        let index = e.currentTarget.dataset.index;
        let topicTpyeName = e.currentTarget.dataset.topictpyename;
        let topicTpyeId = e.currentTarget.dataset.topictpyeid;
        let item = op.data.baseTopicTypeList[index];
        item.isSelected = !item.isSelected;
        if (item.isSelected) {
            op.data.topicTypeIdList.push(topicTpyeId);
            op.data.topicTypeNameList.push(topicTpyeName);
        } else {
            let arrIndex = op.getArrIndex(op.data.topicTypeIdList, topicTpyeId);
            op.data.topicTypeIdList.splice(arrIndex, 1);
            op.data.topicTypeNameList.splice(arrIndex, 1);
        }

        op.setData({
            baseTopicTypeList: op.data.baseTopicTypeList,
            topicTypeIdList: op.data.topicTypeIdList,
            topicTypeNameList: op.data.topicTypeNameList,
        });

        op.data.topicTypeId = "";
        for (let i = 0; i < op.data.topicTypeIdList.length; i++) {
            op.data.topicTypeId += op.data.topicTypeIdList[i];
        }
        op.data.topicTypeName = "";
        for (let i = 0; i < op.data.topicTypeNameList.length; i++) {
            if (i == 0) {
                op.data.topicTypeName += op.data.topicTypeNameList[i];
            } else {
                op.data.topicTypeName += "/" + op.data.topicTypeNameList[i];
            }
        }
        op.data.topicTypeId = "";
        for (let i = 0; i < op.data.topicTypeIdList.length; i++) {
            if (i == 0) {
                op.data.topicTypeId += op.data.topicTypeIdList[i];
            } else {
                op.data.topicTypeId += "/" + op.data.topicTypeIdList[i];
            }
        }
        op.setData({
            topicTypeName: op.data.topicTypeName,
            topicTypeId: op.data.topicTypeId,
        });
    },

    getArrIndex: function (arr, val) {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] == val) {
                return i;
            }
        }
        return -1;
    },

    submit: function (e) {
        var op = this;
        if (!op.checkInput()) return;
        op.addBase();
    },

    checkInput: function () {
        if (!this.data.mainImage || this.data.mainImage.length < 1) {
            wx.showToast({
                title: '请上传主题图片'
            });
            return false;
        }
        if (!this.data.name || this.data.name.length < 1) {
            wx.showToast({
                title: '请输入基地名称'
            });
            return false;
        }
        if (!this.data.topicTypeId || this.data.topicTypeId.length < 1) {
            wx.showToast({
                title: '请选择景区类型'
            });
            return false;
        }
        if (!this.data.price || this.data.price.length < 1) {
            wx.showToast({
                title: '请输入票价'
            });
            return false;
        }
        if (!this.data.openTime || this.data.openTime.length < 1) {
            wx.showToast({
                title: '请输入开放时间'
            });
            return false;
        }
        if (!this.data.level) {
            wx.showToast({
                title: '请选择景区等级'
            });
            return false;
        }
        if (!this.data.traffic || this.data.traffic.length < 1) {
            wx.showToast({
                title: '请输入交通方式'
            });
            return false;
        }
        if (!this.data.address || this.data.address.length < 1) {
            wx.showToast({
                title: '请输入地址'
            });
            return false;
        }
        if (!this.data.phone || this.data.phone.length < 1) {
            wx.showToast({
                title: '请输入联系方式'
            });
            return false;
        }
        if (!this.data.longitude || this.data.longitude.length < 1 || !this.data.latitude || this.data.latitude.length < 1) {
            wx.showToast({
                title: '请获取位置信息'
            });
            return false;
        }
        if (!this.data.city || this.data.city.length < 1) {
            wx.showToast({
                title: '请输入城市'
            });
            return false;
        }
        if (!this.data.district) {
            wx.showToast({
                title: '请选择行政区'
            });
            return false;
        }
        if (!this.data.officialAccountName || this.data.officialAccountName.length < 1) {
            wx.showToast({
                title: '请输入公众号名称'
            });
            return false;
        }
        if (!this.data.introduce || this.data.introduce.length < 1) {
            wx.showToast({
                title: '请输入详情介绍'
            });
            return false;
        }
        return true;
    },

    addBase: function (e) {
        let op = this;
        let mainImage = op.data.mainImage[0];
        app.post('/base/addBaseEntity', {
            cardId: op.data.cardId,
            name: op.data.name,
            price: op.data.price,
            openTime: op.data.openTime,
            level: op.data.level,
            traffic: op.data.traffic,
            address: op.data.address,
            phone: op.data.phone,
            city: op.data.city,
            district: op.data.district,
            officialAccountName: op.data.officialAccountName,
            introduce: op.data.introduce,
            mainImage: mainImage,
            topicTypeId: op.data.topicTypeId,
            longitude: op.data.longitude,
            latitude: op.data.latitude,
        }, function (data) {
            if (app.hasData(data)) {
                if (data == 1) {
                    var allUrl = util.fillUrlParams('/pages/cooperate/verify', {
                        type: 2,
                    });
                    wx.navigateTo({
                        url: allUrl
                    });
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        var cardId = app.getUserId();
        op.setData({
            cardId: cardId
        });
        op.getBaseTopicTypeList();
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
        this.setData({
            select: false
        });
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