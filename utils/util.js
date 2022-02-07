const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var rootDocment = 'https://www.qinzi123.com';

function req(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'post',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

function formatDate(date) {
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':';
  var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
  return YY + MM + DD + " " + hh + mm;
}

function formatDateToDay(date) {
  var date = new Date(date);
  var YY = date.getFullYear() + '-';
  var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var DD = (date.getDate() < 10 ? '0' + (date.getDate()) : date.getDate());
  return YY + MM + DD;
}

function getReq(url, data, cb) {
  wx.request({
    url: rootDocment + url,
    data: data,
    method: 'get',
    header: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      return typeof cb == "function" && cb(res.data)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}


function checkInvoiceMobile(receiver_mobile) {
  var isMobile = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1})|(14[0-9]{1}))+\d{8})$/;
  var isPhone = /^(?:(?:0\d{2,3})-)?(?:\d{7,8})(-(?:\d{3,}))?$/;;
  //如果为1开头则验证手机号码
  if (receiver_mobile.substring(0, 1) == 1) {
    if (!isMobile.exec(receiver_mobile) && receiver_mobile.length != 11) {
      return false;
    }
  }
  //如果为0开头则验证固定电话号码
  else if (receiver_mobile.substring(0, 1) == 0) {
    if (!isPhone.test(receiver_mobile)) {
      return false;
    }
  }
  //否则全部不通过
  else {
    return false;
  }
  return true;
}

function hidePhone(num) {
  if (!num) return num;
  var len = num.length;
  var split = len / 3;
  var result = num.substring(0, split);
  for (var index = 0; index < split; index++)
    result += '*';
  result += num.substring(2 * split, len);
  return result;
}

// 去前后空格  
function trim(str) {
  return str.replace(/(^\s*)|(\s*$)/g, "");
}

// 提示错误信息  
function isError(msg, that) {
  that.setData({
    showTopTips: true,
    errorMsg: msg
  })
}

// 清空错误信息  
function clearError(that) {
  that.setData({
    showTopTips: false,
    errorMsg: ""
  })
}

// 参数拼接
function fillUrlParams(url, params) {
  var list = [];
  for (var prop in params) {
    list.push(prop + "=" + params[prop]);
  }
  return list.length > 0 ? url + "?" + list.join("&") : url;
}

function translate(data, value) {
  for (var index = 0; index < data.length; index++)
    if (data[index].value == value) return data[index].desc;
  return value;
}

function translateUrl(value) {
  if (value.indexOf(rootDocment) == -1)
    return rootDocment + value;
  return value;
}

function IsNum(value){
  return (value-0)==value && value.length>0;
  }

/* 加载动画相关 */
const showLoading = (tips = '加载中...') => {
  wx.showNavigationBarLoading()
  wx.showLoading({
    title: tips,
  })
}

const hideLoading = () => {
  wx.hideLoading()
  wx.hideNavigationBarLoading()
}

const hideLoadingWithErrorTips = (err = '加载失败...') => {
  hideLoading()
  wx.showToast({
    title: err,
    icon: 'error',
    duration: 2000
  })
}

module.exports = {
  formatTime: formatTime,
  req: req,
  hidePhone: hidePhone,
  trim: trim,
  isError: isError,
  clearError: clearError,
  getReq: getReq,

  fillUrlParams: fillUrlParams,
  translate: translate,
  translateUrl: translateUrl,
  formatDate: formatDate,
  formatDateToDay: formatDateToDay,
  showLoading: showLoading,
  hideLoading: hideLoading,
  hideLoadingWithErrorTips: hideLoadingWithErrorTips,
  checkInvoiceMobile: checkInvoiceMobile,
  IsNum: IsNum,
}