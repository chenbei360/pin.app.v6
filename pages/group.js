// pages/group.js
//获取应用实例
const app = getApp();
var groupId = 0, util = require('../utils/util.js');
Page({


  data: {
    isLoading: true,
    isOperate: false,
    qrcodeUrl: null,
    isHideLoadMore: true,
    isNoNetError: true,
    _: app.globalData._.config,

    showPosterModal: false,
    shareAnimationData: null,
    showShareModalStatus: false,


    showPage: false,

    showAuthModal: false

  },

  countdown: function (expire_time) {
    if (this.timer) clearTimeout(this.timer);
    var times = (expire_time - new Date().getTime() / 1000) * 1000, that = this;
    util.countdowns(this, [times],function(i) {
      clearTimeout(that.timer);
    });
  },

  setIsGroupHelp: function () {
    this.setData({ "isGroupHelp": true });
  },

  loadData: function () {
    var that = this;
    //请求订单列表
    that.data.group_order = null;
    wx.request({
      url: app.globalData.apiUrl + 'v1.0/users/groups/' + groupId,
      header: {
        'AccessToken': wx.getStorageSync("token")
      },
      success: function (res) {
        var group_title_class, group_detail_class, is_buy = false, group_but_url, group_but_text, tips_tit, tips_detail, group_type;




        if (res.data.result == 'fail') {
          that.setData({ showWinpopModal: true, showWinpopCancel: false, winpopContent: that.data._.error_text[2] }),
            that.setData({ isLoading: false, isOperate: false })




        }else if(res.data.result == 'ok') {
          
          group_title_class = res.data.group_order.status == '2' ? 'tips_err' : res.data.group_order.status == '1' ? 'tips_succ tips_succ2' : 'tips_succ tips_succ2',

          group_detail_class = res.data.group_order.status == '2' ? 'tm_err' : res.data.group_order.status == '1' ? 'tm_succ' : 'tm_tm';

          
          for (var i = 0; i < res.data.group_order.users.length; i++) {
            if (res.data.group_order.caller_id == res.data.group_order.users[i].user_id) {
              is_buy = true;
            }
          } 


          if (res.data.group_order.status == '0') {
            if(!is_buy) {
              group_but_url = 'checkout?sell_type=1&goods_id=' + res.data.group_order.order.goods_id + "&group_order_id=" + res.data.group_order.group_order_id;
              group_but_text = that.data._.group_text[1];  
            } else {
              group_but_url = '';
              group_but_text = that.data._.group_text[0].replace("%s", (res.data.group_order.require_num - res.data.group_order.people));
            }
          } else {
            group_but_url = 'index';
            group_but_text = that.data._.group_text[2];
          }

        
          if(!is_buy) {
            group_type = 0;
          } else if (res.data.group_order.users[0].user_id != res.data.group_order.caller_id) {
            group_type = 1;
          } else {
            group_type = 2;
          }

          tips_tit = that.data._.tuan_status[res.data.group_order.status]['tips_title'][group_type],
          tips_detail = that.data._.tuan_status[res.data.group_order.status]['tips_detail'][group_type];


          res.data.group_order.tips_tit = tips_tit,
          res.data.group_order.tips_detail = tips_detail,
          res.data.group_order.group_but_text = group_but_text,
          res.data.group_order.group_but_url = group_but_url,
          res.data.group_order.group_detail_class = group_detail_class,
          res.data.group_order.group_title_class = group_title_class;


          that.countdown(res.data.group_order.expire_time);


          that.setData({
            group_order: res.data.group_order,
            showPage: true
          });

        } else {

          that.setData({ isLoading: false, isOperate: false }),
            that.setData({ showWinpopModal: true, showWinpopCancel: false, winpopContent: that.data._.error_text[0] })

        }

        that.confirmCallback = function () {
          that.goHome();
        }


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


  goHome: function () {
    wx.switchTab({
      url: './index',
    });
  },


  redirect: function (e) {
    util.redirect(e.currentTarget.dataset.url);
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
    groupId = options.id;

    //处理扫描二维码打开时候带的参数
    var scene = decodeURIComponent(options.scene);

    if (scene != "undefined") {
      groupId = scene;
    }
    
    var thisPage = this;
    app.getUserInfo(function (res) {
      thisPage.setData({
        userInfo: res,
      });
      thisPage.loadData()
    }, function () {
      ;
      thisPage.setData({
        showAuthModal: true,
        isLoading: false,
        isOperate: false,
        showPage: true
      });
    });
    
  },


  onReady: function () {

  },


  onShow: function () {

  },


  onHide: function () {

  },


  onUnload: function () {

  },


  onPullDownRefresh: function () {
    this.loadData();
  },


  onReachBottom: function () {

  },


  onShareAppMessage: function () {

  },

  /**
   * 生成分享海报
   */
  shareQrcode: function () {
    var that = this;
    that.hideShareModal();

    that.setData({
      qrcodeUrl: app.globalData.miniUrl + "v1.0/wxacode/" + groupId + "?page=" + "pages/group",
      posterUrl: app.globalData.miniUrl + "group/poster/" + groupId,
      showPosterModal: true
    });
  },

  onShareAppMessage: function () {
    if (this.data.group_order.status == 0 || this.data.group_order.status == 8) {
      var desc = '您参加的 ' + this.data.group_order.order.order_goods.goods_name + '目前还差' + (this.data.group_order.require_num - this.data.group_order.people) + '人,快去叫上身边的小伙伴一起' + app.globalData._.config.app.name;
      return app.share({ title: this.data.group_order.order.order_goods.goods_name, desc: desc, path: "pages/group?id=" + groupId });
    } else {
      return app.share({ title: "", desc: "", path: "pages/group?id=" + groupId });
    }
  }
  
})