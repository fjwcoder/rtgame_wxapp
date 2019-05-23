let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: null,
    status: 1,
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.data.step = parseInt(options.type);
    if(parseInt(options.type) === 0){
      this.data.status = 0;
    } else{
      this.data.status = 1;
    }
    this.setData({ 
      dataType:options.type, 
      step:parseInt(options.type)
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getOrderList(this.data.step, this.data.status);
  },
  onUnload: function () {
    wx.reLaunch({
      url: '../user/index'
    })
  },

  /**
   * 获取订单列表
   */
  getOrderList: function (step, status) {
    let _this = this;
    App._post_form('order/getOrderList', { user_token: App.getGlobalData('user_token'), step: _this.data.step, status: status}, function (result) {
      console.log(result)
     
      _this.setData({
         list:result.data
      })
      console.log(_this.data.list)
    });
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    console.log(e);
    this.data.dataType = e.target.dataset.type;
    this.setData({
       dataType: e.target.dataset.type 
      });
    this.data.step = e.target.dataset.type;
    if(this.data.step === '0'){
      this.data.status = 0;
    } else{
      this.data.status = 1;
    }

    console.log("status==" + this.data.status);
    
    // 获取订单列表
    this.getOrderList(this.data.step, this.data.status);
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let oid = e.currentTarget.dataset.oid;
    let order_id = e.currentTarget.dataset.id;
    console.log(oid);
    console.log(order_id);
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('order/changeorderstatus', { order_id: order_id, id: oid, status: 1 }, function (result) {
            console.log(result);
            if (_this.data.step === '0') {
              _this.data.status = 0;
            } else {
              _this.data.status = 1;
            }
            _this.getOrderList(_this.data.step, _this.data.status);
          });
        }
      }
    });
  },

  /**
   * 确认收货
   */
  // receipt: function (e) {
  //   let _this = this;
  //   let order_id = e.currentTarget.dataset.id;
  //   wx.showModal({
  //     title: "提示",
  //     content: "确认收到商品？",
  //     success: function (o) {
  //       if (o.confirm) {
  //         App._post_form('user.order/receipt', { order_id }, function (result) {
  //           _this.getOrderList(_this.data.dataType);
  //         });
  //       }
  //     }
  //   });
  // },

  /**
   * 发起付款
   */
  payOrder: function (e) {

    let _this = this;
    let post = [];
    let oid = e.currentTarget.dataset.oid;
    let order_id = e.currentTarget.dataset.orderid;
    console.log(e);
    console.log("oid=="+oid);
    console.log("order_id=="+order_id);
    // 显示loading
    wx.showLoading({ title: '正在处理...', });
    App._post_form('payment/orderPay', { 
      user_token: App.getGlobalData('user_token'),
      order_id: order_id,
      oid: oid
     }, function (result) {
      console.log(result);
      if (result.code !== 200) {
        App.showError(result.msg);
        return false;
      }
      // 发起微信支付
      wx.requestPayment({
        timeStamp: result.data.timeStamp,
        nonceStr: result.data.nonceStr,
        package: result.data.package,
        signType: 'MD5',
        paySign: result.data.paySign,
        success: function (res) {
          // 跳转到已付款订单
          wx.navigateTo({
            url: '../order/detail?order_id=' + order_id
          });
        },
        fail: function () {
          App.showError('订单未支付');
        },
      });
    });
  },

  /**
   * 跳转订单详情页
   */
  // detail: function (e) {
  //   let order_id = e.currentTarget.dataset.id;
  //   wx.navigateTo({
  //     url: '../order/detail?order_id=' + order_id
  //   });
  // },

  // onPullDownRefresh: function () {
  //   wx.stopPullDownRefresh();
  // }


});