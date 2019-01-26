const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showPosterModal: {
      type: Boolean,
      value: false,
    },
    posterUrl: {
      type: String,
      value: null
    },

    qrcodeUrl: {
      type: String,
      value: null
    },
    goods: {
      type: Object,
      value: null
    },
    disabled: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    appiconUrl: app.globalData.appiconUrl,
    appName: app.globalData.appName,
    confirmDisabled: false
  },

  /**
   * 组件的方法列表
   */
  methods: {

    hidePosterModal: function () {

      var myEventDetail = {} // detail对象，提供给事件监听函数
      var myEventOption = {} // 触发事件的选项
      this.triggerEvent("close", myEventDetail, myEventOption);

      this.setData({
        showPosterModal: false
      });

      console.log("hidePosterModal");
    },

    emptytest: function () {

    },

    save: function () {

      var that = this, pages = getCurrentPages(), currentPage = pages[pages.length - 1], uri = currentPage.route + "?" + (app.urlEncode(currentPage.options).slice(1));
      console.log(currentPage)
      wx.showLoading({
        title: '保存图片到手机相册中...',
      });

      that.setData({
        disabled: true
      });
      
      wx.downloadFile({
        url: that.data.posterUrl,
        success: function (res) {
          that.setData({
            disabled: false

          });
          if (res.statusCode === 200) {
            //保存到相册
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: function () {
                wx.hideLoading();
                that.setData({
                  showPosterModal: false
                });

                wx.showToast({
                  title: '成功保存',
                  icon: "success"
                });
                
                app.handlerShare("分享海报", 1, uri );

                that.triggerEvent("close", {}, {});
              },
              fail: function () {
                wx.hideLoading();
                app.handlerShare("分享海报", 0, uri );
                that.triggerEvent("close", {}, {});
              }
            });
          }
        },
        fail: function () {
          that.setData({
            disabled: false
          });
          wx.hideLoading();
          that.triggerEvent("close", {}, {});
        }
      });
    }
  }
})