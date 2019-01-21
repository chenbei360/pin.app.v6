// component/express-dialog/express-dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showExpressModal: {
      type: Boolean,
      value: false,
    },
    shippingInfo: {
      type: Object
    },
    isLoading: {
      type: Boolean,
      value: true,
    },
    isNoNetError: {
      type: Boolean,
      value: false,
    },
    _: {
      type: Object
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeExpress: function(){
      this.setData({showExpressModal : false});
    }
  }
})
