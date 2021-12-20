var util = require('../../utils/util.js');
const app = getApp()

var reply = {

  oneBusiness: function(id, follow){
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
    if(userId != -1){
      app.getUrl('/business/hasFollowed/' + userId + '-' + card,  function (data) {
        if (app.hasData(data)) {
          var follow = data;
          op.oneBusiness(card, follow);
        }else{
          op.oneBusiness(card, 0);    
        }
      });
    }else{
      op.oneBusiness(card, 0);
    }
    
  }
    

};

export default reply;