let App = getApp();
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
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
    server_list: [],
    dailian:0,
    order_type: 1,
    server_type: 1,
    server_con: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!App.isLogin()) {
      wx.showModal({
        title: '提示',
        content: '您还未登录小程序',
        success(res) {
          if (res.confirm) {
            wx.switchTab({
              url: '../user/index'
            })
          } else {
            wx.switchTab({
              url: '../index/index'
            })
          }
        }
      })
    }
    this.data.order_id = options.order_id;
    this.data.oid =parseInt(options.o_id);
    this.setData({
      order_id: options.order_id,
      oid: parseInt(options.o_id)
    });
    this.getOrderDetail(options.order_id,parseInt(options.o_id));
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (order_id,o_id) {
   
    let _this = this;
    App._post_form('order/getOrderDetail', { user_token : App.getGlobalData('user_token'), oid :o_id , order_id :order_id }, function (result) {
      console.log(result);
      var createTime = _this.timeStampToDate(result.data.create_time, 'Y-M-D h:m:s');
      var payTime = _this.timeStampToDate(result.data.pay_time, 'Y-M-D h:m:s');
      var finishTime = _this.timeStampToDate(result.data.finish_time, 'Y-M-D h:m:s');
      var waiter = result.data.waiter_name;
      var waiter_id = result.data.waiter_id;
      var step = result.data.step;
      if (step >= 3 && waiter_id > 0){  //代练人员为空
        _this.setData({
          dalian: 0
        });
      } else{
        _this.setData({
          dalian: 1
        });
      }
      
      _this.data.step = parseInt(result.data.step);
      _this.setData({
        game_name: result.data.game_name,
        game_img: result.data.game_img ,
        plantform_name: result.data.plantform_name,
        area_name: result.data.area_name,
        game_info: result.data.game_info,
        special_info: result.data.special_info,
        pay_money: result.data.pay_money,

        user_mobile: result.data.user_mobile,
        game_account: result.data.game_account,
        waiter_name: waiter,
        waiter_headimgurl: result.data.headimgurl,
        step: result.data.step,
        create_time: createTime,
        pay_time: payTime,
        finish_time: finishTime,
        server_list: _this.addImgSrc(result.data.detail),
        status: result.data.status,
        order_type: result.data.order_type
        
      })
    });
  },

  //转换img path,添加http头部
  addImgSrc: function (server_list) {
    var url = App.siteInfo.siteroot; //'https://qijian.fjwcoder.com/';
    console.log("url==" + url);
    for (var index in server_list) {
      var img = server_list[index].server_img;
      if (img != '' && img != null && img != undefined && img != url) {
        server_list[index].server_img = App.path_root + server_list[index].server_img;
      } else {
        server_list[index].server_img = "";
      }
      console.log(server_list[index]);
      // if (!img && typeof (img) != "undefined" && img != 0) {  //服务图片为空
      //   server_list[index].server_img = "";
      // } else{
      //   if(img == url){
      //     server_list[index].server_img = "";
      //   } else{
      //     server_list[index].server_img = App.path_root + server_list[index].server_img;
      //   }
      // }
      console.log("img==" + server_list[index].server_img);
    }
    return server_list;

  },


  changeStatus: function(e){
    let _this = this;
    console.log("oid==" + _this.data.oid);
    console.log("order_id==" + _this.data.order_id);
    console.log("step==" + _this.data.step);
    wx.showModal({
      title: '提示',
      content: '确定完成该订单么？',
      success: function (res) {
        if (res.confirm) {
          App._post_form('order/changeorderstep', { id: _this.data.oid, order_id: _this.data.order_id, step: _this.data.step, next:4 },            function (result) {
            App.showSuccess(result.msg, function () {
              wx.navigateBack();
            });
          }, false, function () {
            // 解除禁用
            _this.setData({
              disabled: false
            });
          });
        } 
      }
    })
    
  },

  

  /**
   * 取消订单
   */
  cancelOrder: function (e) {
    let _this = this;
    let order_id = _this.data.order_id;
    let oid = _this.data.oid;
    wx.showModal({
      title: "提示",
      content: "确认取消订单？",
      success: function (o) {
        if (o.confirm) {
          App._post_form('order/changeorderstatus', { order_id: order_id, id: oid, status: 1 }, function (result) {
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
    let oid = e.currentTarget.dataset.oid;
    let order_id = e.currentTarget.dataset.orderid;
    console.log("oid=="+oid);
    console.log("order_id==" + order_id);
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

  timeStampToDate:function (number, format) {
    if(number === ""){
      return "";
    }
    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    var date = new Date(number * 1000);
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for(var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  }
  
});

