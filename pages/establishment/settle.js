var util = require('../../utils/util.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        cardId: "",
        cardName: "",
        company: "",
        companyId: -1,
        selectIndustry: false,
        selectScope: false,
        industry: '',
        scope: '',
        address: "",
        companyTel: "",
        introduce: "",
        mainImage: [],
        license: [],
        mainImagePic: [],
        licensePic: [],
        baseTopicTypeList: [],
        topicTypeIdList: [],
        topicTypeNameList: [],
        topicTypeName: "",
        topicTypeId: "",
        companyWeb: "",
        email: "",
        mainBusiness: "",
        mainDemand: "",
        establishmentAdminName: "",
    },

    inputName: function (e) {
        let op = this;
        op.setData({
            company: e.detail.value,
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

    bindIndustryPickerChange: function (e) {
        this.setData({
            industry: e.detail.value,
            selectIndustry: true
        });
    },

    bindScopePickerChange: function (e) {
        this.setData({
            scope: e.detail.value,
            selectScope: true
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

    inputCompanyTel: function (e) {
        let op = this;
        op.setData({
            companyTel: e.detail.value,
        })
    },

    inputCompanyWeb: function (e) {
        let op = this;
        op.setData({
            companyWeb: e.detail.value,
        })
    },

    inputEmail: function (e) {
        let op = this;
        op.setData({
            email: e.detail.value,
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

    inputMainBusiness: function (e) {
        let op = this;
        op.setData({
            mainBusiness: e.detail.value,
        })
    },

    inputMainDemand: function (e) {
        let op = this;
        op.setData({
            mainDemand: e.detail.value,
        })
    },

    uploadLicensePic: function (e) {
        let op = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                var imgsrc = res.tempFilePaths;
                var licenseTemp = op.data.licensePic;
                for (let i = 0; i < imgsrc.length; i++) {
                    licenseTemp.push(imgsrc[i]);
                }
                op.setData({
                    licensePic: licenseTemp
                });
            },
            fail() {

            },
            complete() {
                var pisc = op.data.licensePic;
                op.uploadLicenseImg({
                    url: app.qinzi + '/mini/uploadFile/sourcePath', //请更改为你自己部署的接口
                    path: pisc,
                });
            }
        })
    },

    uploadLicenseImg: function (data) {
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
                let licensePicTemp = [];
                licensePicTemp.push(app.qinzi + data.data.url);
                that.setData({
                    licensePic: licensePicTemp,
                });
                let licenseTemp = [];
                licenseTemp.push(data.data.url);
                that.setData({
                    license: licenseTemp,
                });
            },
            fail: (res) => {
                fail++;
            },
            complete: () => {
                i++;
                if (i == data.path.length) { //当图片传完时，停止调用 
                    // that.setData({
                    //   showResult: '上传成功'
                    // });
                } else { //若图片还没有传完，则继续调用函数
                    data.i = i;
                    data.success = success;
                    data.fail = fail;
                    that.uploadLicenseImg(data);
                }
            }
        });
    },

    uploadMainImage: function (e) {
        let op = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
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
                if (i == data.path.length) { //当图片传完时，停止调用 
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
        op.checkEstablishmentExist();
    },

    checkInput: function () {
        if (!this.data.mainImage || this.data.mainImage.length < 1) {
            wx.showToast({
                title: '请上传LOGO'
            });
            return false;
        }
        if (!this.data.company || this.data.company.length < 1) {
            wx.showToast({
                title: '请输入机构名称'
            });
            return false;
        }
        if (!this.data.industry || this.data.industry.length < 1) {
            wx.showToast({
                title: '请选择所属行业'
            });
            return false;
        }
        if (!this.data.scope || this.data.scope.length < 1) {
            wx.showToast({
                title: '请选择机构规模'
            });
            return false;
        }
        if (!this.data.address || this.data.address.length < 1) {
            wx.showToast({
                title: '请输入地址'
            });
            return false;
        }
        if (!this.data.companyTel || this.data.companyTel.length < 1) {
            wx.showToast({
                title: '请输入联系方式'
            });
            return false;
        }
        if (!this.data.email || this.data.email.length < 1) {
            wx.showToast({
                title: '请输入机构邮箱'
            });
            return false;
        }
        if (!this.data.introduce || this.data.introduce.length < 1) {
            wx.showToast({
                title: '请输入机构介绍'
            });
            return false;
        }
        if (!this.data.mainBusiness || this.data.mainBusiness.length < 1) {
            wx.showToast({
                title: '请输入主营业务'
            });
            return false;
        }
        if (!this.data.mainDemand || this.data.mainDemand.length < 1) {
            wx.showToast({
                title: '请输入需求资源'
            });
            return false;
        }
        return true;
    },

    checkEstablishmentExist: function (e) {
        let op = this;
        let company = op.data.company;
        let companyId = op.data.companyId;
        if (companyId == -1) {
            app.post("/establishment/checkEstablishmentExist", {
                company: company
            }, function (data) {
                if (app.hasData(data)) {
                    if (data.length > 0) {
                        wx.showToast({
                            title: '机构已存在'
                        });
                    } else {
                        op.addEstablishment();
                    }
                }
            });
        } else if (companyId != -1 && op.data.cardName == op.data.establishmentAdminName) {
            //更新机构信息
            op.updateEstablishmentInfo();
        } else if (companyId != -1 && op.data.cardName != op.data.establishmentAdminName) {
            wx.showToast({
                title: "您不是管理员",
                icon: 'error',
                duration: 2000
            });
        }

    },

    addEstablishment: function (e) {
        let op = this;
        let mainImage = op.data.mainImage[0];
        let licensePic = op.data.license[0];
        app.post('/establishment/addEstablishment', {
            cardId: op.data.cardId,
            mainImage: mainImage,
            licensePic: licensePic,
            company: op.data.company,
            industry: op.data.industry,
            scope: op.data.scope,
            address: op.data.address,
            companyTel: op.data.companyTel,
            companyWeb: op.data.companyWeb,
            email: op.data.email,
            introduce: op.data.introduce,
            mainBusiness: op.data.mainBusiness,
            mainDemand: op.data.mainDemand,
        }, function (data) {
            if (app.hasData(data)) {
                if (data == 1) {
                    var allUrl = util.fillUrlParams('/pages/cooperate/verify', {
                        type: 3,
                    });
                    wx.navigateTo({
                        url: allUrl
                    });
                }
            }
        })
    },

    updateEstablishmentInfo: function (e) {
        let op = this;
        let mainImage = op.data.mainImage[0];
        let licensePic = op.data.license[0];
        app.post('/establishment/updateEstablishment', {
            companyId: op.data.companyId,
            mainImage: mainImage,
            licensePic: licensePic,
            company: op.data.company,
            industry: op.data.industry,
            scope: op.data.scope,
            address: op.data.address,
            companyTel: op.data.companyTel,
            companyWeb: op.data.companyWeb,
            email: op.data.email,
            introduce: op.data.introduce,
            mainBusiness: op.data.mainBusiness,
            mainDemand: op.data.mainDemand,
        }, function (data) {
            if (app.hasData(data)) {
                if (data == 1) {
                    var allUrl = util.fillUrlParams('/pages/business/success', {});
                    wx.navigateTo({
                        url: allUrl
                    });
                }
            }
        })
    },

    getEstablishmentAdminName: function (e) {
        let op = this;
        let companyId = op.data.companyId;
        if (companyId != -1) {
            app.post("/establishment/getAdminName", {
                companyId: companyId,
            }, function (data) {
                if (app.hasData(data)) {
                    op.setData({
                        establishmentAdminName: data.adminName,
                    });
                }
            })
        }
    },

    getEstablishmentInfo: function (e) {
        let op = this;
        let companyId = op.data.companyId;
        app.post("/establishment/getEstablishmentInfo", {
            companyId: companyId
        }, function (data) {
            if (app.hasData(data)) {
                let establishmentInfo = data[0];
                let mainImage = [];
                let license = [];
                if (establishmentInfo.logopic != "") {
                    if (establishmentInfo.logopic.indexOf('http') == -1) {
                        establishmentInfo.logopic = app.qinzi + establishmentInfo.logopic;
                    }
                    mainImage.push(establishmentInfo.logopic);
                }
                if (app.hasData(establishmentInfo.licensepic)) {
                    if (establishmentInfo.licensepic != "") {
                        if (establishmentInfo.licensepic.indexOf('http') == -1) {
                            establishmentInfo.licensepic = app.qinzi + establishmentInfo.licensepic;
                        }
                        license.push(establishmentInfo.licensepic);
                    }
                }

                op.setData({
                    company: establishmentInfo.company,
                    industry: establishmentInfo.industry,
                    scope: establishmentInfo.members,
                    address: establishmentInfo.companyaddr,
                    companyTel: establishmentInfo.companytel,
                    introduce: establishmentInfo.companydesc,
                    mainImage: mainImage,
                    mainImagePic: mainImage,
                    license: license,
                    licensePic: license,
                    companyWeb: establishmentInfo.companyweb,
                    email: establishmentInfo.email,
                    mainBusiness: establishmentInfo.mainbussiness,
                    mainDemand: establishmentInfo.maindemand,
                    selectIndustry: true,
                    selectScope: true,
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let op = this;
        let companyId = options.companyId || -1;
        let company = options.company || "";
        let introduce = options.introduce || "";
        let workaddress = options.workaddress || "";
        let cardName = options.cardName || "";
        var cardId = app.getUserId();
        op.setData({
            cardId: cardId,
            companyId: companyId,
            company: company,
            introduce: introduce,
            address: workaddress,
            cardName: cardName,
        });
        op.getEstablishmentAdminName();

        if (companyId != -1) {
            op.getEstablishmentInfo();
        }
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