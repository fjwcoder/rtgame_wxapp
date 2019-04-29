let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    step: '0',
    status: '1',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.data.step = options.type || '0';
    this.setData({ dataType: this.data.step });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getOrderList(this.data.step);
  },

  /**
   * 获取订单列表
   */
  getOrderList: function (step, status) {
    let _this = this;
    App._post_form('order/getOrderList', { user_token: App.getGlobalData('user_token'), step: step, status: status }, function (result) {
      console.log(result)
     
      _this.setData({
        // list:result.data
        list:[
          {
            id: '1',
            order_id: 'num001',
            img: '',
            game_name: '测试游戏名称',
            plantform_name: 'IOS微信',
            area_name: '测试区服名称',
            pay_money: '￥100',
            step: '0',
            status: '1',
            create_time: '2019-01-01'
          },
          {
            id: '1',
            order_id: 'num001',
            img: '',
            game_name: '测试游戏名称',
            plantform_name: 'IOS微信',
            area_name: '测试区服名称',
            pay_money: '￥100',
            step: '1',
            status: '1',
            create_time: '2019-01-01'
          },
          {
            id: '1',
            order_id: 'num001',
            img: '',
            game_name: '测试游戏名称',
            plantform_name: 'IOS微信',
            area_name: '测试区服名称',
            pay_money: '￥100',
            step: '2',
            status: '1',
            create_time: '2019-01-01'
          },
          {
            id: '1',
            order_id: 'num001',
            img: '',
            game_name: '测试游戏名称',
            plantform_name: 'IOS微信',
            area_name: '测试区服名称',
            pay_money: '￥100',
            step: '3',
            status: '1',
            create_time: '2019-01-01'
          },
          {
            id: '1',
            order_id: 'num001',
            img: '',
            game_name: '测试游戏名称',
            plantform_name: 'IOS微信',
            area_name: '测试区服名称',
            pay_money: '￥100',
            step: '4',
            status: '1',
            create_time: '2019-01-01'
          },
          {
            id: '1',
            order_id: 'num001',
            img: '',
            game_name: '测试游戏名称',
            plantform_name: 'IOS微信',
            area_name: '测试区服名称',
            pay_money: '￥100',
            step: '0',
            status: '2',
            create_time: '2019-01-01'
          }
        ]
      })
      console.log(_this.data.list)
    });
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    console.log(e)
    this.setData({ dataType: e.target.dataset.type });
    this.data.step = e.target.dataset.type;
    if(this.data.step === '6'){
      this.setData({status: '2'});
    }
    
    // 获取订单列表
    this.getOrderList(this.data.step, this.data.status);
  },

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = e.currentTarget.dataset.id;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('user.order/cancel', { order_id }, function (result) {
            _this.getOrderList(_this.data.dataType);
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
    let order_id = e.currentTarget.dataset.order_id;
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