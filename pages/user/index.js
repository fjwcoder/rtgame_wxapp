let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    orderCount: {
      received: 3
    },
    phone: '', //手机号
    code: '', //验证码
    iscode: null, //用于存放验证码接口里获取到的code
    codename: '获取验证码',
    input_disabled: false,
    hiddenmodalput: true, //modal的隐藏
    show: true,
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // 获取当前用户信息

    this.getUserDetail();
    this.getUserIndex()

    // console.log(wx.getStorageSync('user_id'));
    // console.log(wx.getStorageSync('user_token'));

    this.setData({
      hiddenmodalput: this.isBindMobile()
    })

  },
  /**
   * 获取用户首页数据
   */
  getUserIndex: function () {
    let _this = this
    App._post_form("user/getUserIndex", {
      user_token: App.getGlobalData("user_token")
    }, function (result) {
      console.log(result)
      _this.setData({
        orderCount: result.data.order_count,
        waiterInfo:result.data.waiter_info
      })
    })
  },
  /**
   * 获取当前用户信息
   */
  getUserDetail: function () {

    if (App.isLogin() === false) { // create by fjw in 19.3.22: 如果用户没有登录，就重新登录
      wx.hideNavigationBarLoading();
      App.doLogin();
      return false;
    }

    let _this = this;

    // App._get('User/getUserDetail', {}, function (result) {
    //   this.setData(result.data);
    // });
  },
  shows: function () {
    this.setData({
      display: "block"
    })
  },
  hides: function () {
    this.setData({
      display: "none"
    })
  },
  /**
   * 是否绑定手机号
   */
  isBindMobile: function () {
    // console.log(wx.getStorageSync('user_mobile'));

    if (App.isLogin() && wx.getStorageSync('user_mobile') === '' || wx.getStorageSync('user_mobile') === null || wx.getStorageSync('user_mobile') === undefined) {
      return false;
    } else {
      return true;
    }
  },

  /***
   * 获取手机号码
   */

  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  /**
   * 获取输入验证码
   */
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  getCode: function () {
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      App.showError('手机号不能为空');
      return false;
    }
    if (!myreg.test(this.data.phone)) {
      App.showError('请输入正确的手机号');
      return false;
    }

    App._post_form("Common/sendSms", {
      mobile: this.data.phone
    }, function (result) {
      console.log(result);
      if (result.code === 200) {

        _this.setData({
          input_disabled: true, // 1. 手机输入框变为不可修改
          disabled: true // 2. 获取验证码按钮disable
        })

        // 3. 获取验证码按钮显示倒计时
        var num = 61;
        var timer = setInterval(function () {
          num--;
          if (num <= 0) {
            clearInterval(timer);
            _this.setData({
              codename: '重新发送',
              disabled: false
            })

          } else {
            _this.setData({
              disabled: true,
              codename: num + "s"
            })

          }
        }, 1000)
      }
    });
  },

  apply:function(){
    let _this = this;
    App._post_form('waiter/waiterIndex', { user_token: App.getGlobalData('user_token') }, function (result) {
      console.log(result);
      var user_status = result.data.waiter_info.id;
      console.log(user_status);
      if(user_status === 0){
        wx.redirectTo({
          url: '../gamepractice/dailian_apply',
        })
      } else if(user_status === 1){
        //显示代练中心
      } else if (user_status === 2){
        App.showError("锁定中，请联系客服");
      } else if (user_status === 3) {
        App.showError("申请中");
      }
      
    });
  },


  /**
   * 取消
   */

  //提交表单信息

  bindMobile: function () {
    var _this = this;
    // if (_this.data.code.length !== 6) {
    //   wx.showToast({
    //     title: '验证码应为6位数字',
    //     icon: 'none'
    //   })
    //   return false;
    // }

    App._post_form("User/wxappBindMobile", {
      user_token: App.getGlobalData('user_token'),
      mobile: this.data.phone,
      yzm: this.data.code
    }, function (result) {

      if (result.code === 200) {
        App.globalData.user_id = result.data.user_id;
        wx.setStorageSync('user_id', result.data.user_id);

        App.globalData.user_mobile = result.data.mobile;
        wx.setStorageSync('user_mobile', result.data.mobile);

        App.globalData.user_token = result.data.user_token;
        wx.setStorageSync('user_token', result.data.user_token);
        console.log(result)
        // user_token = App.getGlobalData('user_token');
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        _this.setData({
          hiddenmodalput: true
        })
      }
    })
  },
})