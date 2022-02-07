var util = require('../../utils/util.js');
var dateTimePicker = require('../../utils/dateTimePicker.js');
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: -1,
        mainImage: [],
        mainImagePic: [],
        otherImage: [],
        otherImagePic: [],
        otherImageTemp: [],
        videoPath: "",
        name: "",
        originalPrice: "",
        presentPrice: "",
        inventory: "",
        introduce: "",
        instruction: "",
        repeatPurchase: 0,
        onceMaxPurchaseCount: "",
        onceMaxPurchaseCountInput: "",
        phone: "",
        buxianFlag: false,
        deadlineBuxianFlag: false,
        disableInputMaxCount: false,

        date: '',
        time: '',
        dateTimeArray: null,
        dateTime: null,
        dateTimeArray1: null,
        dateTime1: null,
        startYear: 2020,
        endYear: 9999,
        deadlineTimeInput: "",
        deadlineTime: "",
        disableChooseDeadlineFlag: false,
        bottom: 0,
    },

    uploadvideo: function (e) {
        let op = this;
        wx.chooseVideo({
            success(res) {
                op.postFile2Server(res.tempFilePath);
            }
        });
    },

    deleteVedio: function (e) {
        let op = this;
        op.setData({
            videoPath: "",
        })
    },

    postFile2Server: function (path) {
        let op = this;
        wx.uploadFile({
            url: app.qinzi + '/mini/uploadFile/sourcePath', //请更改为你自己部署的接口
            filePath: path,
            name: 'file',
            success(res) {
                var data = JSON.parse(res.data);
                op.setData({
                    videoPath: data.data.url,
                });
            }
        });
    },

    uploadOtherImage: function (e) {
        let op = this;
        wx.chooseImage({
            count: 9,
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                var imgsrc = res.tempFilePaths;
                var picsTemp = op.data.otherImagePic;
                for (let i = 0; i < imgsrc.length; i++) {
                    picsTemp.push(imgsrc[i]);
                }

                op.setData({
                    otherImagePic: picsTemp,
                    otherImage: [],
                    otherImageTemp: op.data.otherImage,
                });
            },
            fail() {

            },
            complete() {
                var pisc = op.data.otherImagePic;
                op.uploadOtherimg({
                    url: app.qinzi + '/mini/uploadFile/sourcePath', //请更改为你自己部署的接口
                    path: pisc,
                });
            }
        });
    },

    delectPic: function (e) {
        let op = this;
        let index = e.currentTarget.dataset.index;
        let picsTemp = op.data.otherImagePic;
        let otherImageTemp = op.data.otherImage;
        picsTemp.splice(index, 1);
        otherImageTemp.splice(index, 1);
        op.setData({
            otherImage: otherImageTemp,
            otherImagePic: picsTemp,
        });
    },

    uploadOtherimg: function (data) {
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
                that.data.otherImage.push(data.data.url);
                if (that.data.otherImageTemp.length > 0) {
                    for (let i = 0; i < that.data.otherImageTemp.length; i++) {
                        that.data.otherImage.push(that.data.otherImageTemp[i]);
                    }
                }
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
                    that.uploadOtherimg(data);
                }
            }
        });
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

    inputName: function (e) {
        let op = this;
        op.setData({
            name: e.detail.value,
        })
    },

    inputIntroduce: function (e) {
        let op = this;
        op.setData({
            introduce: e.detail.value,
        })
    },

    inputInstruction: function (e) {
        let op = this;
        op.setData({
            instruction: e.detail.value,
        })
    },

    inputOriginalPrice: function (e) {
        let op = this;
        if (e.detail.value != "") {
            if (util.IsNum(e.detail.value)) {
                op.setData({
                    originalPrice: e.detail.value,
                })
            } else {
                wx.showToast({
                    title: '请输入数字',
                });
                op.setData({
                    originalPrice: "",
                })
            }
        }
    },

    inputPresentPrice: function (e) {
        let op = this;
        if (e.detail.value != "") {
            if (util.IsNum(e.detail.value)) {
                op.setData({
                    presentPrice: e.detail.value,
                })
            } else {
                wx.showToast({
                    title: '请输入数字',
                });
                op.setData({
                    presentPrice: "",
                })
            }
        }
    },

    inputInventory: function (e) {
        let op = this;
        if (e.detail.value != "") {
            if (util.IsNum(e.detail.value)) {
                op.setData({
                    inventory: e.detail.value,
                })
            } else {
                wx.showToast({
                    title: '请输入数字',
                });
                op.setData({
                    inventory: "",
                })
            }
        }
    },

    allowRepeatPurchase: function (e) {
        let op = this;
        op.setData({
            repeatPurchase: e.currentTarget.dataset.value
        })
    },

    refuseRepeatPurchase: function (e) {
        let op = this;
        op.setData({
            repeatPurchase: e.currentTarget.dataset.value
        })
    },

    inputOnceMaxPurchaseCount: function (e) {
        let op = this;
        if (e.detail.value != "") {
            if (util.IsNum(e.detail.value)) {
                op.setData({
                    onceMaxPurchaseCount: e.detail.value,
                    onceMaxPurchaseCountInput: e.detail.value,
                })
            } else {
                wx.showToast({
                    title: '请输入数字',
                });
                op.setData({
                    onceMaxPurchaseCount: "",
                    onceMaxPurchaseCountInput: "",
                })
            }
        } else {
            op.setData({
                onceMaxPurchaseCount: e.detail.value,
                onceMaxPurchaseCountInput: e.detail.value,
            })
        }
    },

    chooseBuXian: function (e) {
        let op = this;
        if (op.data.disableInputMaxCount) {
            op.setData({
                buxianFlag: !op.data.buxianFlag,
                disableInputMaxCount: !op.data.disableInputMaxCount,
                onceMaxPurchaseCount: op.data.onceMaxPurchaseCountInput,
            })
        } else {
            op.setData({
                buxianFlag: !op.data.buxianFlag,
                disableInputMaxCount: !op.data.disableInputMaxCount,
                onceMaxPurchaseCount: "-1",
            })
        }
    },

    deadlineBuxian: function (e) {
        let op = this;
        if (op.data.disableChooseDeadlineFlag) {
            op.setData({
                deadlineBuxianFlag: !op.data.deadlineBuxianFlag,
                disableChooseDeadlineFlag: !op.data.disableChooseDeadlineFlag,
                deadlineTime: op.data.deadlineTimeInput,
            })
        } else {
            op.setData({
                deadlineBuxianFlag: !op.data.deadlineBuxianFlag,
                disableChooseDeadlineFlag: !op.data.disableChooseDeadlineFlag,
                deadlineTime: '9999-12-31 00:00',
            })
        }
    },

    inputPhone: function (e) {
        let op = this;
        op.setData({
            phone: e.detail.value,
        })
    },

    submit: function (e) {
        let op = this;
        if (!op.checkInput()) return;
        op.auth();
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
                title: '请输入产品名称'
            });
            return false;
        }
        if (!this.data.originalPrice || this.data.originalPrice.length < 1) {
            wx.showToast({
                title: '请输入产品原价'
            });
            return false;
        }
        if (!this.data.presentPrice || this.data.presentPrice.length < 1) {
            wx.showToast({
                title: '请输入产品现价'
            });
            return false;
        }
        if (!this.data.inventory || this.data.inventory.length < 1) {
            wx.showToast({
                title: '请输入库存数量'
            });
            return false;
        }
        if (!this.data.onceMaxPurchaseCount || this.data.onceMaxPurchaseCount.length < 1) {
            wx.showToast({
                title: '请输入单购上限'
            });
            return false;
        }
        if (!this.data.phone || this.data.phone.length < 1) {
            wx.showToast({
                title: '请输入客服电话'
            });
            return false;
        }
        if (this.data.introduce == "" && this.data.otherImage.length < 1 && this.data.videoPath == "") {
            wx.showToast({
                title: '请上传产品介绍'
            });
            return false;
        }
        return true;
    },

    auth: function (e) {
        let op = this;
        let card = wx.getStorageSync('id')
        if (card == "") {
            app.onGotUserInfo(e, function () {});
            return;
        }
        //订阅消息

        op.updateProduct();
    },

    updateProduct: function (e) {
        let op = this;

        let otherImage = [];
        for (var i = 0; i < op.data.otherImage.length; i++) { //遍历原数组
            var isadd = true; //设置标记
            for (var j = 0; j < otherImage.length; j++) { //遍历新数组
                if (op.data.otherImage[i] === otherImage[j]) {
                    isadd = false;
                    break;
                } //如果当前原数组中的项，在新数组中存在，则标记为‘不添加’，并跳出新数组遍历
            }
            if (isadd) {
                otherImage.push(op.data.otherImage[i]);
            } //若标记为‘添加’（即遍历新数组后，没有发现相同项），则添加进新数组
        }

        app.post("/product/updateProduct", {
            id: op.data.id,
            mainImage: op.data.mainImage[0],
            name: op.data.name,
            originalPrice: op.data.originalPrice,
            presentPrice: op.data.presentPrice,
            inventory: op.data.inventory,
            repeatPurchase: op.data.repeatPurchase,
            onceMaxPurchaseCount: op.data.onceMaxPurchaseCount,
            phone: op.data.phone,
            introduce: op.data.introduce,
            otherImage: otherImage,
            videoPath: op.data.videoPath,
            instruction: op.data.instruction,
            deadlineTime: op.data.deadlineTime,
        }, function (data) {
            if (typeof data == 'number') {
                let allUrl = util.fillUrlParams('/pages/cooperate/verify', {
                    type: 4
                })
                wx.navigateTo({
                    url: allUrl,
                })
            }
        })
    },

    changeDate(e) {
        this.setData({
            date: e.detail.value
        });
    },
    changeTime(e) {
        this.setData({
            time: e.detail.value
        });
    },
    changeDateTime(e) {
        this.setData({
            dateTime: e.detail.value
        });
    },
    changeDateTime1(e) {
        this.setData({
            dateTime1: e.detail.value
        });
    },
    changeDateTimeColumn(e) {
        var arr = this.data.dateTime,
            dateArr = this.data.dateTimeArray;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray: dateArr,
            dateTime: arr
        });
    },
    changeDateTimeColumn1(e) {
        var arr = this.data.dateTime1,
            dateArr = this.data.dateTimeArray1;

        arr[e.detail.column] = e.detail.value;
        dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);

        this.setData({
            dateTimeArray1: dateArr,
            dateTime1: arr
        });

        var dateTime1 = this.data.dateTime1;
        var dateTimeArray1 = this.data.dateTimeArray1;
        let deadlineTimeInput = dateTimeArray1[0][dateTime1[0]] + "-" + dateTimeArray1[1][dateTime1[1]] + "-" + dateTimeArray1[2][dateTime1[2]] + " " + dateTimeArray1[3][dateTime1[3]] + ":" + dateTimeArray1[4][dateTime1[4]];
        this.setData({
            deadlineTime: deadlineTimeInput,
            deadlineTimeInput: deadlineTimeInput,
        })
    },

    // introduceFocus: function (e) {
    //     this.setData({
    //         bottom: e.detail.height,
    //     });
    // },

    // introduceBlur: function (e) {
    //     this.setData({
    //         bottom: 0
    //     });
    // },

    // noticeFocus: function (e) {
    //     this.setData({
    //         bottom: e.detail.height,
    //     });
    // },

    // noticeBlur: function (e) {
    //     this.setData({
    //         bottom: 0
    //     });
    // },

    getOtherImageList: function (e) {
        let op = this;
        app.post("/product/getOtherImagesById", {
            productId: op.data.id,
        }, function (data) {
            if (app.hasData(data)) {
                if (data.length > 0) {
                    let otherImage = [];
                    let otherImagePic = [];
                    for (let i = 0; i < data.length; i++) {
                        otherImage.push(data[i].url);
                        otherImagePic.push('https://qinzi123.com' + data[i].url)
                    }
                    op.setData({
                        otherImage: otherImage,
                        otherImagePic: otherImagePic,
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let id = parseInt(options.id);
        let name = options.name;
        let main_image = options.main_image;
        let mainImage = [];
        let mainImagePic = [];
        mainImage.push(main_image);
        mainImagePic.push('https://qinzi123.com' + main_image);
        let original_price = options.original_price;
        let present_price = options.present_price;
        let inventory = options.inventory;
        let repeat_purchase = parseInt(options.repeat_purchase);
        let once_max_purchase_count = options.once_max_purchase_count;
        let phone = options.phone;
        let introduce = options.introduce;
        let video_path = options.vedio_path;
        let instruction = options.instruction;
        let deadline_time = options.deadline_time;
        let buxianFlag, deadlineBuxianFlag, disableInputMaxCount, disableChooseDeadlineFlag;
        if (once_max_purchase_count == "-1") {
            buxianFlag = true;
            disableInputMaxCount = true;
        } else {
            buxianFlag = false;
            disableInputMaxCount = false;
        }

        if (deadline_time.indexOf("9999") != -1) {
            deadlineBuxianFlag = true;
            disableChooseDeadlineFlag = true;
        } else {
            deadlineBuxianFlag = false;
            disableChooseDeadlineFlag = false;
        }

        // 获取完整的年月日 时分秒，以及默认显示的数组
        var obj = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, deadline_time);
        var obj1 = dateTimePicker.dateTimePicker(this.data.startYear, this.data.endYear, deadline_time);
        // 精确到分的处理，将数组的秒去掉
        var lastArray = obj1.dateTimeArray.pop();
        var lastTime = obj1.dateTime.pop();


        this.setData({
            id: id,
            name: name,
            mainImage: mainImage,
            mainImagePic: mainImagePic,
            originalPrice: original_price,
            presentPrice: present_price,
            inventory: inventory,
            repeatPurchase: repeat_purchase,
            onceMaxPurchaseCount: once_max_purchase_count,
            phone: phone,
            introduce: introduce,
            videoPath: video_path,
            instruction: instruction,
            deadlineTime: deadline_time,
            buxianFlag: buxianFlag,
            disableInputMaxCount: disableInputMaxCount,
            deadlineBuxianFlag: deadlineBuxianFlag,
            disableChooseDeadlineFlag: disableChooseDeadlineFlag,

            dateTime: obj.dateTime,
            dateTimeArray: obj.dateTimeArray,
            dateTimeArray1: obj1.dateTimeArray,
            dateTime1: obj1.dateTime,
        })

        this.getOtherImageList();
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