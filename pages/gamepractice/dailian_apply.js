let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    disabled: false,
    nav_select: false, // 快捷导航
    region: '',
    id_card: '', //身份证号
    date: '',
    user_nikename: "请输入昵称",
    realname: "请输入真实姓名",
    user_sex: '',
    gender_arrey: ['男', '女'],
    index: 0,
    user_phone: '请输入手机号码',
    error: '',
    game_id_list: '请输入擅长的游戏',
    age:'',
    gameList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getGame();

  },
  getGame:function(){
    let _this = this;
    App._post_form('game/getGameList', { gid: 0 }, function (result) {
      console.log(result)

      _this.setData({
        gameList: result.data
      })
    });
  },
  /**
   * 填写宝宝身份证号码
   */

  getUserIdCard: function (e) {
    let _this = this;
    _this.setData({
      id_card: e.detail.value
    })

    //截取身份证号出生年月
    if (e.detail.value.length > 17) {
      var flg = "-"
      _this.insert_flg(e.detail.value, flg)
    }
  },

  /**
   * 填写宝宝姓名
   */
  getUserRealName: function (e) {
    this.setData({
      realname: e.detail.value
    })
  },
  getUserGame: function(e){
    this.setData({
      user_game:e.detail.value
    })
  },
  /**
   * 修改宝宝性别
   */
  chengeUserSex: function (e) {
    this.setData({
      index: e.detail.value
    })
  },


  /**
   * 填写紧急联系人手机号
   */
  getUserPhone: function (e) {
    this.setData({
      user_phone: e.detail.value
    })
  },

  /**
   * 表单提交
   */
  saveData: function (e) {

    let _this = this,
      values = e.detail.value

    // 处理性别
    values.user_sex = (values.user_sex === 0) ? 1 : 2;

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
    App._post_form('waiter/applywaiter', values, function (result) {

      App.showSuccess(result.msg, function () {
        wx.navigateBack();
      });
    }, false, function () {
      // 解除禁用
      _this.setData({
        disabled: false
      });
    });
  },

  /**
   * 表单验证
   */
  validation: function (values) {
    console.log(values);
    if (values.user_nikename === '') {
      this.data.error = '昵称不能为空';
      return false;
    }
    if (values.id_card === "" || values.id_card.length < 18) {
      this.data.error = '身份证号码不合规范';
      return false;
    }
    if (values.user_phone.length < 1) {
      this.data.error = '手机号不能为空';
      return false;
    }
    if (values.user_phone.length !== 11) {
      this.data.error = '手机号长度有误';
      return false;
    }
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (!reg.test(values.user_phone)) {
      this.data.error = '手机号不符合要求';
      return false;
    }
    if (values.realname === '') {
      this.data.error = '真实姓名不能为空';
      return false;
    }
    if (values.user_game === '') {
      this.data.error = '擅长的游戏不能为空';
      return false;
    }
    return true;
  },


  /**
   * 快捷导航 显示/隐藏
   */
  commonNav: function () {
    this.setData({
      nav_select: !this.data.nav_select
    });
  },

  /**
   * 快捷导航跳转
   */
  nav: function (e) {
    let url = '';
    switch (e.currentTarget.dataset.index) {
      case 'home':
        url = '../index/index';
        break;
      case 'fenlei':
        url = '../category/index';
        break;
      case 'cart':
        url = '../flow/index';
        break;
      case 'profile':
        url = '../user/index';
        break;
    }
    wx.switchTab({
      url
    });
  },


  /**
   * 自动计算年龄
   */
  insert_flg: function (input_str, flg) {
    var str = input_str.substr(6, 8)
    var newstr = "";
    var nian = str.substr(0, 4)
    var yue = str.substr(4, 2)
    var ri = str.substr(6, 2)
    newstr += nian + flg + yue + flg + ri;
    var now_date = new Date(Date.parse(new Date()));
    //获取年份  
    var now_year = now_date.getFullYear();
    //获取月份  
    var now_month = (now_date.getMonth() + 1 < 10 ? '0' + (now_date.getMonth() + 1) : now_date.getMonth() + 1);
    //获取当日日期 
    var now_day = now_date.getDate() < 10 ? '0' + now_date.getDate() : now_date.getDate();
    //自动计算年龄
    var age = 0;
    if(nian > now_year){
      App.showError("身份证号填写错误");
    } else{
      age = now_year - nian;
      if(now_month < yue){
        age -= 1;
      } else{
        if(now_day < ri){
          age -= 1;
        }
      }
    }

    this.setData({
      age: age
    })
  },

})