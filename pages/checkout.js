// pages/checkout.js
//获取应用实例
const app = getApp();
var sellType = 0, goodsId = 0, addressId = 0, groupOrderId = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    isBannering: true,
    isGroupHelp: false,
    isNoNetError: true
  },
  setIsGroupHelp: function() {
    this.setData({"isGroupHelp" : true});
  },
  goodsDetail: function() {
    var that = this;
    wx.request({
      url: app.globalData.miniUrl + 'v1.0/goods/' + goodsId,
      success: function (res) {
        that.setData({
          goods: res.data.goods
        });
        that.setData({
          isNoNetError: true
        });
      },
      fail: function (res) {
        that.setData({
          isNoNetError: false
        });
      },
      complete: function (res) {
        wx.stopPullDownRefresh();
        that.setData({
          isLoading: false
        });
      }
    });
  },

  orderBanner: function () {
    var that = this;
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/banners/order',
      success: function (res) {
        that.setData({
          banner: res.data.banner
        });
      }
    });
  },

  closeBanner: function (e) {
    this.setData({ 'isBannering': false });
  },

  loadData: function() {
    this.goodsDetail(),
      this.orderBanner();
  },

  //跳转地址页面
  redirectAddresses: function () {


    var url;


    if (this.data.address != undefined && this.data.address.address_id != undefined && this.data.address.address_id > 0) {
      url = "addresses?sell_type=" + this.sell_type + "&goods_id=" + this.goods_id;
      url += " &address_id=" + this.data.address.address_id;
    } else {
      url = "address?goods_id=" + this.goods_id + "&sell_type=" + this.sell_type;
    }


    wx.navigateTo({
      url: url
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    goodsId = options.goods_id,
    sellType = options.sell_type, 
    addressId = options.address_id,
    groupOrderId = options.group_order_id;

    this.setData({
      sell_type: sellType,
      goods_id: goodsId
    });

    setTimeout(function () {
      that.closeBanner();
    }, 3500);

    this.loadData();
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