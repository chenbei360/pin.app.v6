// pages/personal.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    showAuthModal: false
  },

  loadData: function() {
    var thisPage = this;
    app.getUserInfo(function (res) {
      thisPage.setData({
        userInfo: res,
      });
    }, function () {
      thisPage.setData({
        showAuthModal: true,
      });
    });
  },

  goSwitchTab(e) {
    wx.switchTab({
      url: e.currentTarget.dataset.url,
    });
  },

  goReLaunch(e) {
    wx.reLaunch({
      url: e.currentTarget.dataset.url,
    });
  },
  
  onLoad: function (options) {
    var that = this;
  },

  
  onReady: function () {

  },

  
  onShow: function () {
    this.setData({showAuthModal: false});
    this.loadData();
  },


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