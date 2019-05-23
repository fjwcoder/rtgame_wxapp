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
    order_id: null,
    order: {},
    oid: '',
    src:'../../images/add_img.png',
    disabled: false,
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
    fromwhere:0  //0：抢单列表中进入  其他：已抢到的代练单列表中进入
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.order_id = options.order_id;
    this.data.oid =parseInt(options.o_id);
    this.setData({
      order_id: options.order_id,
      oid: parseInt(options.o_id),
      fromwhere:parseInt(options.fromwhere)
    });
    this.getOrderDetail(options.order_id, parseInt(options.o_id));
  },

  /**
   * 获取订单详情
   */
  getOrderDetail: function (order_id, o_id) {

    let _this = this;
    App._post_form('order/getOrderDetail', { user_token: App.getGlobalData('user_token'), oid: o_id, order_id: order_id }, function (result) {
      console.log(result);
      var createTime = _this.timeStampToDate(result.data.create_time, 'Y-M-D h:m:s');
      var payTime = _this.timeStampToDate(result.data.pay_time, 'Y-M-D h:m:s');
      var finishTime = _this.timeStampToDate(result.data.finish_time, 'Y-M-D h:m:s');
      var waiter = result.data.waiter_name;
      if (!waiter && typeof (waiter) != "undefined" && waiter != 0) {  //代练人员为空
        waiter = '暂未分配代练人员';
      }
      _this.setData({
        game_name: result.data.game_name,
        game_img: result.data.game_img,
        plantform_name: result.data.plantform_name,
        area_name: result.data.area_name,
        game_info: result.data.game_info,
        special_info: result.data.special_info,
        pay_money: result.data.pay_money,

        user_mobile: result.data.user_mobile,
        game_account: result.data.game_account,
        game_password: result.data.game_password,
        waiter_name: waiter,
        waiter_headimgurl: result.data.waiter_headimgurl,
        step: result.data.step,
        create_time: createTime,
        pay_time: payTime,
        finish_time: finishTime,
        server_list: _this.addImgSrc(result.data.detail),
        // server_list: result.data.detail,

      })
    });
  },

  assignOrder: function(){
    let _this = this;
    _this.setData({
      disabled: true
    });
    App._post_form('order/assignWaiter', { user_token: App.getGlobalData('user_token'), oid: _this.data.oid, order_id: _this.data.order_id }, function (result) {

      App.showSuccess(result.msg, function () {
        wx.redirectTo({
          url: 'practicelist_accepted_ing',
        });
      });
    }, false, function () {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },

  uploadPhoto: function(e){
    let _this = this;
    App._img_upload('Fileupload/finishImgUpload?img=','file',function (result) {
      console.log("result=="+result);  
      _this.setData({
        src: App.path_root + result,
        imgSrc: result
      });
    }, false, function () {});
  },
  saveImg:function(e){
    let _this = this;
    let s_id = e.currentTarget.dataset.sid;
    let imgSrc = e.currentTarget.dataset.img;
    console.log("s_id=="+s_id);
    console.log("img=="+imgSrc);
    App._post_form('order/saveFinishImg', { s_id: s_id, id: _this.data.oid, order_id: _this.data.order_id, server_img: imgSrc}, function (result) {

      App.showSuccess(result.msg, function () {
        wx.redirectTo({
          url: 'practicelist_accepted_ing',
        });
      });
    }, false, function () {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
    
  },

//转换img path,添加http头部
  addImgSrc: function (server_list){
    var url = App.siteInfo.siteroot; //'https://qijian.fjwcoder.com/';
    console.log("url=="+url);
    for (var index in server_list) {
      var img = server_list[index].server_img;
      if(img != '' && img != null && img != undefined && img != url){
        server_list[index].server_img = App.path_root + server_list[index].server_img;
      }else{
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

  timeStampToDate: function (number, format) {
    if (number === "") {
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

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  }

});

