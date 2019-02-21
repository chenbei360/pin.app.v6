//获取应用实例
const app = getApp();

function cancel(that,orderId,successCallback, failCallback){

  that.cancelCallback = function() {
    that.setData({showWinpopModal: true});
  },

  that.confirmCallback = function() {
    wx.request({
      url: app.globalData.apiUrl + "v1.0/users/orders/" + orderId,
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      method: "DELETE",
      success: function(res){
        successCallback(res);
      },
      fail: function (res){
        failCallback(res);
      },
      complete: function(){
      }
    })
  }

  that.setData({ showWinpopModal: true, winpopContent: "确定“取消订单”吗？", showWinpopCancel: true } )
}

function express(orderId, successCallback, failCallback, completeCallback){
  wx.request({
    url: app.globalData.apiUrl + 'v1.0/orders/' + orderId + "/express",
    success: function (res) {
      successCallback(res);
    },
    fail: function (res) {
      failCallback(res);
    },
    complete: function (res) {
      completeCallback(res);
    }
  });
} 

function receive(that,orderId, successCallback, failCallback){

  that.cancelCallback = function () {
    that.setData({ showWinpopModal: true });
  },

  that.confirmCallback = function () {
    wx.request({
      url: app.globalData.apiUrl + "v1.0/users/orders/" + orderId + "/" + "receive",
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      method: "POST",
      success: function (res) {
        successCallback(res);
      },
      fail: function (res) {
        failCallback(res);
      },
      complete: function () {
      }
    })
  }

  that.setData({ showWinpopModal: true, winpopContent: "确定“确认收货”吗？", showWinpopCancel: true })


  // wx.showModal({
  //   title: '确定“确认收货”吗？',
  //   content: '',
  //   success: function (res) {
  //   }
  // });
}

function pay(orderId, successCallback, failCallback, completeCallback){
  var that = this;
  wx.request({
    url: app.globalData.apiUrl + 'v1.0/users/orders/' + orderId + "/wxpay",
    header: {
      'AccessToken': wx.getStorageSync("token")
    },
    success: function (res) {
      successCallback(res);
    },
    fail: function (res) {
      failCallback(res);
    },
    complete: function (res) {
      completeCallback(res);
    }
  });
}

function goPay(payParams, successCallback, failCallback, completeCallback){
  wx.requestPayment({
    'timeStamp': payParams.timeStamp,
    'nonceStr': payParams.nonceStr,
    'package': payParams.package,
    'signType': payParams.signType,
    'paySign': payParams.paySign,
    
    success:function (res) {
      successCallback(res)
    },

    fail:function(res){
      failCallback(res);

      if (res.errMsg == "requestPayment:fail cancel"){
      }else{
        wx.showToast({title: res.errMsg,icon: "none"})
      }
    },

    complete: function(res){
      completeCallback(res);
      
      
    }

  });
}

function paySuccess(orderId) {
  wx.request({
    url: app.globalData.apiUrl + 'v1.0/users/orders/' + orderId,
    header: {
      'AccessToken': wx.getStorageSync("token")
    },
    success: function (res) {
      if (res.data.result == 'ok') {
        if (res.data.order.group_order_id && res.data.order.group_order_id != '0') {
          wx.redirectTo({ 'url': 'group?id=' + res.data.order.group_order_id });
        } else {
          wx.redirectTo({ 'url': 'order?id=' + orderId });
        }
      } else {
        wx.redirectTo({ 'url': 'orders' });
      }
    }
  });
}



module.exports = {
  cancel: cancel,
  pay: pay,
  goPay: goPay,
  receive: receive,
  express: express,
  paySuccess: paySuccess
}