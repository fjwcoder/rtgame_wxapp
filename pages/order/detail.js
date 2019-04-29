let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: null,
    order: {},
    oid:'',


    game_name: '',
    game_img: '',
    plantform_name: '',
    area_name: '',
    game_info: '',
    special_info: '',
    pay_money: '',
    user_mobile: '',
    game_account: '',
    waiter_name: '',
    waiter_headimgurl: '',
    step: 0,
    create_time: '',
    pay_time: '',
    finish_time: '',
    server_list: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.order_id;
    this.data.o_id =parseInt(options.o_id);
    this.setData({
      order_id: options.order_id
    });
    this.getOrderDetail(options.order_id,parseInt(options.o_id));
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (order_id,o_id) {
   
    let _this = this;
    // let values;
    // values.order_id = order_id;
    // values.oid = o_id;
    // values.user_token = App.getGlobalData('user_token')
    App._post_form('order/getOrderDetail', { user_token : App.getGlobalData('user_token'), oid :o_id , order_id :order_id }, function (result) {
      console.log(result)
      _this.setData({

        // game_name: '',
        // game_img: '',
        // plantform_name: '',
        // area_name: '',
        // game_info: '',
        // special_info: '',
        // pay_money: '',
        // user_mobile: '',
        // game_account: '',
        // waiter_name: '',
        // waiter_headimgurl: '',
        // step: '1',
        // create_time: '',
        // pay_time: '',
        // finish_time: '',

        game_name: result.data.game_name,
        game_img: result.data.game_img ,
        plantform_name: result.data.plantform_name,
        area_name: result.data.area_name,
        game_info: result.data.game_info,
        special_info: result.data.special_info,
        pay_money: result.data.pay_money,

        user_mobile: result.data.user_mobile,
        game_account: result.data.game_account,
        waiter_name: result.data.waiter_name,
        waiter_headimgurl: result.data.waiter_headimgurl,
        step: result.data.step,
        create_time: result.data.create_time,
        pay_time: result.data.pay_time,
        finish_time: result.data.finish_time,
        server_list: result.data.detail
        
      })
    });
  },


  /**
   * 跳转理赔页面
   */
  // claimApplication:function(){
  //   wx.navigateTo({
      
  //     url: '../lipei/index'
  //   })
  // },
  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/cancel', { order_id }, function (result) {
            wx.navigateBack();
          });
        }
      }
    });
  },

  /**
   * 发起付款
   */
  payOrder: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;

    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('user.order/pay', { order_id }, function (result) {
      if (result.code === -10) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: 'prepay_id=' + result.data.prepay_id,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          _this.getOrderDetail(order_id);
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 确认收货
   */
  receipt: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    wx.showModal({
      title: "提示",
      content: "确认收到商品？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/receipt', { order_id }, function (result) {
            _this.getOrderDetail(order_id);
          });
        }
      }
    });
  },


});