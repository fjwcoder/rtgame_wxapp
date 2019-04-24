let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    nav_select: false, // 快捷导航
    region: '',
    detail: {},
    name: '',
    sex: '',
    age: "",
    country: '',
    mobile: '',
    id_card: '',
    s_date: '',
    o_date: '',
    gender_arrey: ['男', '女'],
    index: 0,

    error: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取当前地址信息
    // this.getAddressDetail(options.address_id);
    this.getUserInfo();
    // console.log(this.data.name);
  },

  /**
   * 获取当前地址信息
   */
  getAddressDetail: function(address_id) {
    let _this = this;
    // App._get('address/detail', {
    //   address_id
    // }, function (result) {
    //   _this.setData(result.data);
    // });
  },

  /**
   * 表单提交
   */
  saveData: function(e) {
    let _this = this,
      values = e.detail.value
    values.region = this.data.region;

    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });

    // 提交到后端
    values.address_id = _this.data.detail.address_id;
    App._post_form('address/edit', values, function(result) {
      App.showSuccess(result.msg, function() {
        wx.navigateBack();
      });
    }, false, function() {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 修改地区
   */
  bindRegionChange: function(e) {
    this.setData({
      region: e.detail.value
    })
  },

  /**
   * 修改性别
   */
  chengeSex: function(e) {
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 修改身份证开始日期
   */
  bindIdCardSDateChange: function(e) {
    this.setData({
      s_date: e.detail.value

    })
  },

  /**
   * 修改身份证结束日期
   */
  bindIdCardODateChange: function(e) {
    this.setData({
      o_date: e.detail.value

    })
  },


  /**
   * 填写姓名
   */
  getName: function(e) {
    this.setData({
      babyName: e.detail.value
    })
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function() {
    let _this = this;
    App._get('user/getuserdetail', {
      user_token: App.getGlobalData('user_token'),
    }, function(result) {
       console.log(result.data);
      _this.setData({
        name: result.data.us_name,
        index: result.data.sex - 1,
        age: result.data.us_age,
        o_date: result.data.id_card_begintime,
        s_date: result.data.id_card_endtime,
        id_card: result.data.id_card,
        detail: result.data.address_detail,
        mobile: result.data.mobile,
        region: result.data.us_sheng + ',' + result.data.us_shi + ',' + result.data.us_qu
      })
      if (_this.data.region === "null,null,null") {
        _this.setData({
          region: "请选择地区"
        })
      }
    });
  },


  /**
   * 表单提交
   */
  saveData: function(e) {

    let _this = this,
      values = e.detail.value

    // values.date = this.data.date;
    values.us_sheng = values.area[0];
    values.us_shi = values.area[1];
    values.us_qu = values.area[2];
    values.sex = (values.sex === 0) ? 1 : 2;
    values.user_token = App.getGlobalData('user_token');
    console.log(values);

    // return false;
    // 处理性别


    // 表单验证
    if (!_this.validation(values)) {
      App.showError(_this.data.error);
      return false;
    }

    // 按钮禁用
    _this.setData({
      disabled: true
    });
    // console.log(values);
    // return false;
    // 提交到后端
    App._post_form('User/editUserDetail', 
      values
    , function(result) {

      App.showSuccess(result.msg, function() {
        wx.navigateBack();
      });
      console.log(result)
    }, false, function() {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },


  /**
   * 表单验证
   */
  validation: function(values) {
    if (values.us_name === '') {
      this.data.error = '姓名不能为空';
      return false;
    }
    if (values.us_name.length < 2) {
      this.data.error = '请填写真实姓名';
      return false;
    }
    if (values.mobile.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.mobile.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(values.mobile)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (values.id_card === '') {
      this.data.error = '身份证号不能为空';
      return false;
    }
    if (values.id_card.length !== 18) {
      this.data.error = '身份证号应为18位';
      return false;
    }
    if (values.id_card_begintime === null) {
      this.data.error = '身份证开始日期不能为空';
      return false;
    }
    if (values.id_card_endtime === null) {
      this.data.error = '身份证结束日期不能为空';
      return false;
    }
    if (values.address_detail === '') {
      this.data.error = '详细地址不能为空';
      return false;
    }
    if (values.us_age === '') {
      this.data.error = '年龄不能为空';
      return false;
    }
    if (values.index === '') {
      this.data.error = '请选择性别';
      return false;
    }
    if (values.id_card_begintime >= values.id_card_endtime) {
      this.data.error = '身份证有效期开始日期不可大于或等于结束日期';
      return false;
    }
    return true;
  },

})