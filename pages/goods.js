// pages/goods.js
//获取应用实例
const app = getApp();
var goodsId = 0;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLoading: true,
    isOperate: false,
    isNoNetError: true,
    goods: {},
    gallery: [],
    image_w_h: {},

    shareAnimationData: null,
    showShareModalStatus: false,


    isNoNetError: true,
    qrcodeUrl: null,//海报地址
    showPosterModal: false,

    _: app.globalData._.config,

    current: 1,
    showAuthModal: false,

    showPage: false
  },

  loadData: function() {
    var that = this;

    app.getUserInfo(function (res) {

    }, function () {
      that.setData({
        showAuthModal: true,
      });
    });
    
    wx.request({
      url: app.globalData.miniUrl + 'v1.0/goods/' + goodsId,
      success: function (res) {
        if (res.data.result == 'fail'){

          that.setData({ showWinpopModal: true, showWinpopCancel: false, winpopContent: that.data._.error_text[4] }),
            that.setData({ isLoading: false, isOperate: false })

        }else if(res.data.result == 'ok'){
          that.setData({
            goods: res.data.goods,
            gallery: res.data.gallery,
            isShow_out: 0 >= parseInt(res.data.goods.goods_stock),
            showPage: true
          });

          app.getImageUrlInfo(that, that.data.gallery[0].img_url
            , function () {
              that.setData({ isOperate: true })
            }, function (image_w_h) {
              that.setData({ isLoading: false, isOperate: false, image_w_h: app.wxAutoImageCal(image_w_h.width, image_w_h.height) })
            }, function () {
              that.setData({ isLoading: false, isOperate: false })
            });
          that.setData({
            isNoNetError: true
          });
        }else{

          that.setData({ isLoading: false, isOperate: false }),
            that.setData({ showWinpopModal: true, showWinpopCancel: false, winpopContent: that.data._.error_text[0]})
          
        }

        that.confirmCallback = function(){
          that.goHome();
        }


      },
      fail: function (res) {
        that.setData({
          isNoNetError: false
        });
      },
      complete: function (res) {
        wx.stopPullDownRefresh();
      }
    });
  },  

  showShareModal: function () {

    this.setData({
      isNoScroll: true
    });
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease",
      delay: 0
    });

    animation.translateY(300).step();
    this.setData({
      shareAnimationData: animation.export(),
      showShareModalStatus: true
    });

    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        shareAnimationData: animation.export()
      })
    }.bind(this), 100);
  },

  hideShareModal: function () {

    this.setData({
      isNoScroll: false
    });
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    });

    animation.translateY(300).step();
    this.setData({
      shareAnimationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step();
      this.setData({
        shareAnimationData: animation.export(),
        showShareModalStatus: false
      });
    }.bind(this), 200);
  },

  onLoad: function (options) {
    goodsId = options.goods_id;
    this.loadData();
  },

  onPullDownRefresh: function() {
    this.loadData();
  },

  previewImage: function (e) {
    var idx = e.currentTarget.dataset.idx;
    var gallery = [];

    for (var i = 0; i < this.data.gallery.length; i++) {
      gallery[i] = this.data.gallery[i].img_url;
    }

    wx.previewImage({
      current: gallery[idx],
      urls: gallery
    })
  },
  
  bindchange: function (e) {
    var current = e.detail.current + 1;
    this.setData({ current: current });
  },

  /*返回首页*/
  goHome: function () {
    wx.switchTab({
      url: './index',
    });
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
   * 生成分享海报
   */
  shareQrcode: function () {
    var that = this;
    that.hideShareModal();

    that.setData({
      qrcodeUrl: app.globalData.miniUrl + "v1.0/wxacode/" + goodsId + "?page=" + "pages/goods",
      posterUrl: app.globalData.miniUrl + "goods/poster/" + goodsId,
      showPosterModal: true
    });
  }

})