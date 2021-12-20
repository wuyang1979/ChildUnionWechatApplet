var util = require('../../utils/util.js');
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    templateId: 'auLNgQjD8StjjSvOvVcdk3qU7XDURV2gRZB9OdiYozM',
    title: '',
    message: '',
    formIdArray: [],
    index: '',
    messageType: util.messageType,
    select: false,
    sourceType: 0,
    sourcePath: '',
    sourcePathList: [],
    showResult: '',
    authClick: false,
    titleFocusStatus: false,
    messageFocusStatus: false,
    isVideoChecked: false,
    isPicChecked: false,
    pics: [],
    canCheckPic: true,
    canCheckVideo: true,
  },

  saveFormId: function (v) {
    //if (v.detail.formId != 'the formId is a mock one') {
    app.formIdInput(v, this);
    //}
  },

  titleBlur: function (e) {
    this.setData({
      titleFocusStatus: false
    })
  },

  titleFocus: function (e) {
    this.setData({
      titleFocusStatus: true
    })
  },

  messageBlur: function (e) {
    this.setData({
      messageFocusStatus: false
    })
  },

  messageFocus: function (e) {
    this.setData({
      messageFocusStatus: true
    })
  },

  bindTitleInput: function (e) {
    this.setData({
      title: e.detail.value
    })
  },

  bindMessageInput: function (e) {
    this.setData({
      message: e.detail.value
    })
  },

  bindPickerChange: function (e) {
    this.setData({
      index: e.detail.value,
      select: true
    });

  },

  // radioChange: function (e) {
  //   this.setData({
  //     sourceType: e.detail.value
  //   })
  // },

  choosePic: function (e) {
    let op = this;
    op.setData({
      canCheckVideo: !op.data.canCheckVideo,
      sourceType: e.currentTarget.dataset.value
    })
  },

  chooseVideo: function (e) {
    let op = this;
    op.setData({
      canCheckPic: !op.data.canCheckPic,
      sourceType: e.currentTarget.dataset.value
    })
  },

  postFile2Server: function (path) {
    var op = this;
    wx.uploadFile({
      url: app.qinzi + '/mini/uploadFile/sourcePath', //请更改为你自己部署的接口
      filePath: path,
      name: 'file',
      success(res) {
        var data = JSON.parse(res.data);
        op.setData({
          sourcePath: data.data.url,
          showResult: '上传成功'
        });
      }
    })
  },

  checkAndPost: function (tempFilePaths) {

  },

  uploadFile: function () {
    var op = this;
    if (this.data.sourceType == -1) {
      wx.showToast({
        title: '请选择上传类型'
      });
      return;
    }
    if (this.data.sourceType == 0) {
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success(res) {
          var imgsrc = res.tempFilePaths;
          var picsTemp = op.data.pics;
          for (let i = 0; i < imgsrc.length; i++) {
            picsTemp.push(imgsrc[i]);
          }
          op.setData({
            pics: picsTemp
          });
        },
        fail() {

        },
        complete() {
          var pisc = op.data.pics;
          op.uploadimg({
            url: app.qinzi + '/mini/uploadFile/sourcePath', //请更改为你自己部署的接口
            path: pisc,
          });
        }
      })
    } else if (this.data.sourceType == 1) {
      wx.chooseVideo({
        success(res) {
          op.postFile2Server(res.tempFilePath);
        }
      });
    }
  },

  delectPic: function (e) {
    let op = this;
    let index = e.currentTarget.dataset.index;
    let picsTemp = op.data.pics;
    picsTemp.splice(index, 1);
    op.setData({
      pics: picsTemp
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
        that.data.sourcePathList.push(data.data.url);
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

  checkInput: function () {
    if (!this.data.title || this.data.title.length < 1) {
      wx.showToast({
        title: '标题不能为空'
      });
      return false;
    }
    if (!this.data.message || this.data.message.length < 1) {
      wx.showToast({
        title: '内容不能为空'
      });
      return false;
    }
    if (!this.data.index || this.data.message.index < 1) {
      wx.showToast({
        title: '类型不能为空'
      });
      return false;
    }
    return true;
  },

  auth: function () {
    if (!this.data.authClick) {
      app.getAuth2PushMessage(this.data.templateId);
      this.setData({
        authClick: true
      })
    }
  },

  addMessage: function () {
    var op = this;
    app.post('/cooperate/message', {
      cardId: app.getUserId(),
      //formId: op.data.formIdArray,
      formIdList: op.data.formIdArray,
      title: op.data.title,
      message: op.data.message,
      messageType: op.data.index,
      sourceType: op.data.sourceType,
      sourcePath: op.data.sourcePath || "",
      sourcePathList: op.data.sourcePathList || [],
    }, function (data) {
      if (app.hasData(data)) {
        app.globalData.messageDataUpdated = true;
        if (data == 1) {
          var allUrl = util.fillUrlParams('/pages/cooperate/verify', {
            type: 1,
          });
          wx.navigateTo({
            url: allUrl
          });
        }
      }
    });
  },

  submit: function (e) {
    var op = this;
    if (op.data.canCheckVideo && op.data.canCheckPic) {
      op.setData({
        sourceType: ""
      })
    }
    if (!this.checkInput()) return;
    this.auth();
    this.addMessage();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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