// component/winpop-mask/winpop-mask.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showWinpopModal: {
      type: Boolean,
      value: false,
    },
    winpopContent: {
      type: String,
      value: "",
    },
    showWinpopCancel: {
      type: Boolean,
      value: true,
    },
    showWinpopConfirm: {
      type: Boolean,
      value: true,
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
    cancelCallback: function() {
      this.triggerEvent('cancelCallback'),
      this.setData({"showWinpopModal": false});
    },
    confirmCallback: function() {
      this.triggerEvent('confirmCallback'),
       this.setData({"showWinpopModal": false});
    }
  }
})
