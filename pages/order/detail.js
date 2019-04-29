let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: null,
    order: {},
    oid:'',


    relationship_to_baby: ["父子", "父女", "母子", "母女"],//与被保人关系
    user_name: '',
    index_a:'',
    user_sex: '',
    user_address: '',
    user_age: '',
    user_mobile: '',
    user_id_card: '',
    user_s_date: '', //投保人身份证开始时间
    user_o_date: '', //投保人身份证结束时间
    user_region: [], //投保人省市区
    relationship_to_baby: ["父子", "父女", "母子", "母女"],//与被保人关系

    baby_name: '',
    baby_sex: '',
    baby_age: '',
    baby_region: '',
    baby_address: '',
    baby_id_card: '',
    baby_s_date: '',
    baby_o_date: '',
    relationship_to_user: '',//与投保人关系

    insurance_name:'',
    insurance_description:'',
    pay_money:'',
    insurance_order_id:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.order_id;
    this.data.o_id =parseInt(options.o_id);
    console.log(this.data.o_id)
    this.getOrderDetail(options.order_id,parseInt(options.o_id));
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (order_id,o_id) {
    console.log(order_id);
    console.log(o_id);
   
    let _this = this;
    // let values;
    // values.order_id = order_id;
    // values.oid = o_id;
    // values.user_token = App.getGlobalData('user_token')
    App._post_form('order/getOrderDetail', { user_token : App.getGlobalData('user_token'), oid :o_id , order_id :order_id }, function (result) {
      console.log(result)
      _this.setData({
        user_name: result.data.user_name,
        user_sex: (result.data.user_sex === 1)?"男":"女" ,
        user_age: result.data.user_age,
        user_o_date: result.data.user_id_card_endtime,
        user_s_date: result.data.user_id_card_begintime,
        user_id_card: result.data.user_id_card,
        user_address: result.data.user_address.split(",")[3],
        user_mobile: result.data.user_mobile,
        index_a: result.data.relationship_to_baby - 1,
        user_address: result.data.user_address,
        baby_name: result.data.baby_name,
        baby_age: result.data.baby_age,
        baby_id_card: result.data.baby_id_card,
        baby_o_date: result.data.baby_id_card_endtime,
        baby_s_date: result.data.baby_id_card_begintime,
        baby_sex: (result.data.baby_sex === 1) ? "男" : "女",
        baby_address: result.data.baby_address,
        pay_money: result.data.pay_money,
        insurance_name: result.data.insurance_name, 
        insurance_description: result.data.insurance_description,
        insurance_order_id: result.data.insurance_order_id,
        pay_limit: result.data.pay_limit,
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