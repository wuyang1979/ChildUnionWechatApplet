var util = require('../../utils/util.js');
const app = getApp()

var types = {
  
  btnSelect: function (data) {
    var subArray = [];
    var tagMap = {};
    for (var subIndex = 0; subIndex < data.length; subIndex++) {
      var tagList = data[subIndex]["tagList"];
      var tagArray = [];
      for (var tagIndex = 0; tagIndex < tagList.length; tagIndex++) {
        tagMap[tagList[tagIndex]["tagId"]] = { parent: subIndex, index: tagIndex };
        tagArray.push("not-click");
      }
      subArray.push(tagArray);
    }
    return {
      map: tagMap,
      array: subArray
    };
  },

  tagClick: function (event) {
    var tagId = event.currentTarget.dataset.tag;
    var parent = event.currentTarget.dataset.parent;
    var index = event.currentTarget.dataset.index;
    var tagName = event.currentTarget.dataset.name;

    var currentTagList = this.data.tagList;
    var currentTagName = this.data.tagNameList;
    var btnServiceSelected = this.data.btnServiceSelected;

    var dataIndex = currentTagList.indexOf(tagId);
    // 已关注
    if (dataIndex >= 0) {
      currentTagList.splice(dataIndex, 1);
      btnServiceSelected[parent][index] = "not-click";
    } else {
      if (currentTagList.length >= this.data.canPushCount) {
      } else {
        currentTagList.push(tagId);
        currentTagName.push(tagName);
        btnServiceSelected[parent][index] = "click";
      }
    }

    this.setData({
      tagList: currentTagList,
      btnServiceSelected: btnServiceSelected
    });
  },

  tagCheck: function () {
    var tag = this.data.tagList;
    if (tag.length == 0) {
      wx.showToast({
        title: '标签必须选择',
      })
      return false;
    }
    return true;
  },

  initTagClick: function (data) {
    for (var subIndex = 0; subIndex < data.length; subIndex++) {
      var tagList = data[subIndex]["tagList"];
      var tagArray = [];
      for (var tagIndex = 0; tagIndex < tagList.length; tagIndex++) {
        tagArray.push("not-click");
      }
      subArray.push(tagArray);
    }
  },

  loadService: function (func) {
    var op = this;
    // 加载所有信息
    app.getUrl('/business/service/list', function (data) {
      if (app.hasData(data)) {
        for (var index = 0; index < data.length; index++) {
          if (data[index].serviceId == 1) {
            var service = data[index]['subserviceList'];
            op.setData({ service: service });
            var select = op.btnSelect(service);
            op.setData({
              btnServiceSelected: select.array,
              tagMap: select.map
            });
            func();
          }

        }
      }
    });
  },

};

export default types;