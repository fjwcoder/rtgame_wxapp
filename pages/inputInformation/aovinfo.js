// pages/user/fadan.js
let App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: 2, //游戏id 由上个页面传入

    ServiceIndex: "0", //选择服务picker初始值
    ServiceArray: [], //picker代练列表
    s_id: null, //当前选择代练类型的id  默认排位赛
    input_hidden: true,
    picker_hidden: false, //代练类型为巅峰赛的时候显示picker隐藏input
    initialNum: '', //巅峰赛当前分数
    ServiceIndexArray: [], //代练列表对应id数组
    card_input_titleS: '当前段位',
    card_input_titleO: '目标段位',
    game_index_list: [],
    game_name_list: [],

    plantform_index_list: [],
    plantform_index_list: [],
    plantformNumArr: [],
    plantformNameList: [],
    area_name_list: [],

    game_index: '',
    multiArray: [],
    multiIndex: [0, 0, 0],
    time: '12:01',
    date: '2018-12-25',
    region: ['广东省', '广州市', '海珠区'],
    imgList: [],
    modalName: null,
    textareaAValue: '',
    textareaBValue: '',

    showMol: null,

    server_info: {},
    winNumShow: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      gid: parseInt(options.gid),
      game_name: options.gid === "1" ? '王者荣耀' : '英雄联盟',
      s_id: options.gid === "1" ? 1 : 4,
    })
    wx.setNavigationBarTitle({
      title: this.data.game_name + '代练'
    })
    this.getGameServer();
    this.getServerList();
    this.winNum_show(this.data.gid); //胜点输入框显示     options.pid
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 获取游戏区服列表
   */
  getGameServer: function () {
    let _this = this;
    App._post_form('game/getGameServer', {
      user_token: App.getGlobalData('user_token'),
      gid: _this.data.gid
    }, function (result) {
      console.log(result);
      _this.setData({
        plantformNameList: _this.splitGame(result.data.plantform, "name"),
        plantformIndexList: _this.splitGame(result.data.plantform, "id"),

      });

      if (result.data.area.length < 1) {
        _this.setData({
          plantformNumArr: _this.splitGame(result.data.plantform, "area_num"),
        })
        var area_name_list = []
        for (var i = 1; i <= 4; i++) {
          var item = _this.autoincrementArr(_this.data.plantformNumArr[i - 1])
          area_name_list[i] = []
          //area_name_list[i].push(item)
          area_name_list[i] = item
        }
        _this.setData({
          area_name_list: area_name_list
        })
      }
      if (result.data.area.length > 0) {
        _this.setData({
          area_name_list: _this.split_area(result.data.area, 'name'),
        })
      }
      console.log(_this.data.plantformNameList)
      console.log(_this.data.plantformIndexList)
      var multiArray = [];
      multiArray[0] = _this.data.plantformNameList;
      multiArray[1] = _this.data.area_name_list[_this.data.plantformIndexList[0]];

      _this.setData({
        multiArray: multiArray,
      })
    })
  },
  /**
   * 跳转价格参考页面
   */
  jumpPriceReference: function () {
    wx.navigateTo({
      url: 'price_ref'
    });
  },
  /**
   * 获取代练类型列表
   */
  getServerList: function () {
    let _this = this
    App._post_form('game/getGServerList', {
      gid: _this.data.gid
    }, function (result) {
      console.log(result)
      _this.setData({
        ServiceIndexArray: _this.splitGame(result.data, "id"),
        ServiceArray: _this.splitGame(result.data, "name"),
      })
    })
  },

  /**
   * 王者荣耀选择服务
   */
  selectService: function (e) {
    console.log(e)
    if (this.data.gid === 1) {
      if (e.detail.value === "2") {
        wx.showModal({
          title: '提示',
          content: '您确定要选择其它代练吗？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.navigateTo({
                url: 'aovspecial?gid=' + this.data.gid
              });
            }
          },
        });
      } else if (e.detail.value === "1") {
        this.setData({
          ServiceIndex: e.detail.value,
          s_id: this.data.ServiceIndexArray[e.detail.value],
          s_place: '',
          o_place: '',
          card_input_titleS: '当前分数',
          card_input_titleO: '目标分数',
          input_hidden: false,
          picker_hidden: true,
          numOrText: "number",

          scoreArr: this.autoincrementArray(36)
        })
        console.log(this.data.s_place)
        console.log(this.data.o_place)
      } else {
        this.setData({
          ServiceIndex: e.detail.value,
          s_id: this.data.ServiceIndexArray[e.detail.value],
          card_input_titleS: '当前段位',
          card_input_titleO: '目标段位',
          input_hidden: true,
          picker_hidden: false,
        })
      }
    } else if (this.data.gid === 2) {
      if (e.detail.value === "2") {
        wx.showModal({
          title: '提示',
          content: '您确定要选择其它代练吗？',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.navigateTo({
                url: 'aovspecial?gid=' + this.data.gid
              });
            }
          },
        });
      } else {
        this.setData({
          ServiceIndex: e.detail.value,
          s_id: this.data.ServiceIndexArray[e.detail.value],
        })
        console.log(this.data.ServiceIndexArray[e.detail.value])
        console.log(this.data.s_id)
      }
    }
  },
  /**
   * 胜点输入框显示
   */
  winNum_show: function (pid) {
    if (pid === 2) {
      this.setData({
        winNumShow: true
      })
    } else {
      this.setData({
        winNumShow: false
      })
    }
  },
  /**
   * 排位赛目标段位
   */
  getOPlace: function (e) {
    this.setData({
      o_place: e.detail.value
    })
  },
  /**
   * 排位赛当前段位
   */
  getSPlace: function (e) {
    this.setData({
      s_place: e.detail.value
    })
  },
  /**
   * 选择巅峰赛数值
   */
  modifyScore: function (e) {
    if (this.data.initialNum === '') {
      wx.showToast({
        title: '请先输入巅峰赛当前分数',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      this.setData({
        initialNum: ''
      })
    } else {
      this.setData({
        score: parseInt(this.data.initialNum) + parseInt(this.data.scoreArr[parseInt(e.detail.value)])
      })
    }

  },



  MultiChange(e) {
    console.log(e)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  MultiColumnChange(e) {
    let _data = this.data;
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (data.multiIndex[0]) {
      case 0:
        data.multiArray[1] = _data.area_name_list[_data.plantformIndexList[0]];
        break;
      case 1:
        data.multiArray[1] = _data.area_name_list[_data.plantformIndexList[1]];
        break;
      case 2:
        data.multiArray[1] = _data.area_name_list[_data.plantformIndexList[2]];
        break;
      case 3:
        data.multiArray[1] = _data.area_name_list[_data.plantformIndexList[3]];
        break;

    }

    this.setData(data);
    console.log(this.data.multiIndex)
  },

  /**
   * 佣金
   */
  getSalary: function (e) {
    if (e.detail.value < 10) {
      wx.showToast({
        title: '佣金太低啦~',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      this.setData({
        salary: ''
      })
    } else {
      this.setData({
        salary: e.detail.value.toString()
      })
    }
  },
  /**
   * 胜点输入
   */
  getWinNum: function (e) {
    if (e.detail.value < 1 || e.detail.value > 100) {
      wx.showToast({
        title: '请输入0-100之间的整数',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      this.setData({
        win_num: ''
      })
    } else {
      this.setData({
        win_num: e.detail.value
      })
    }
  },
  /**
   * 巅峰赛当前值
   */
  getInitial: function (e) {
    console.log(e)
    if (this.data.ServiceIndex === "1") {
      if (e.detail.value < 1000 || e.detail.value > 2000) {
        wx.showToast({
          title: '请输入1000-2000的整数',
          icon: 'none',
          duration: 1500,
          mask: false,
        });
        this.setData({
          initialNum: ''
        })
      } else {
        this.setData({
          initialNum: e.detail.value
        })
      }
    }
  },
  /**
   * 英雄数量
   */
  getHeroesNum: function (e) {
    if (e.detail.value > 200 || e.detail.value < 1) {
      this.setData({
        heroNum: ''
      })
    }
  },
  /**
   * 铭文等级
   */
  getRuneNum: function (e) {
    if (e.detail.value < 1 || e.detail.value > 150 || e.detail.value % 1 !== 0) {
      wx.showToast({
        title: '请输入1-150之间的整数',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      this.setData({
        runeNum: ''
      })
    }
  },
  /**
   * 表单提交
   */
  saveData: function (e) {
    let _this = this
    //弹窗
    // this.setData({
    //   showMol: 'show'
    // })
    // return false;
    var server = {};
    var data_arr = {} //dataArray的元素
    //pid
    var pid = this.data.plantformIndexList[this.data.multiIndex[0]];
    //area_name = arr[pid][index]
    // var area_name = this.data.area_name_list[pid][this.data.multiIndex[1]]
    data_arr.server_id = this.data.s_id //服务id
    if (_this.data.gid === 1) {
      server.server_type = _this.data.s_id === 1 ? '排位赛' : '巅峰赛'
      if (_this.data.s_id === 1) { //如果选择段位赛
        server.server_begin_info = data_arr.begin_info = _this.data.s_place //当前段位（当前分值）
        server.server_end_info = data_arr.end_info = _this.data.o_place
      } else
      // if (_this.data.s_id === 2) 
      { //巅峰赛 
        server.server_begin_info = data_arr.begin_info = _this.data.initialNum //当前段位（当前分值）         
        server.server_end_info = data_arr.end_info = _this.data.score
      }
    } else {
      server.server_type = _this.data.s_id === 4 ? '单双排' : '灵活排位'
      server.server_begin_info = data_arr.begin_info = _this.data.s_place + ',' + _this.data.win_num + '胜点' //当前段位（当前分值）
      server.server_end_info = data_arr.end_info = _this.data.o_place
      server.win_num = _this.data.win_num
    }
    server.server_price = data_arr.server_price = _this.data.salary //佣金
    var dataArray = {
      0: data_arr
    }
    // dataArray = {data_arr};
    // console.log(dataArray);
    var values = e.detail.value
    // console.log(values);
    values.dataArray = JSON.stringify(dataArray)
    if (_this.data.gid === 2) {
      if (server.win_num === '' || server.win_num === undefined) {
        App.showError("当前胜点不可为空")
        return false;
      }
    }
    console.log(values, dataArray)

    // return false;
    // 表单验证
    if (_this.validation(values, data_arr) === false) {
      App.showError(this.data.error);
      return false;
    }



    values.user_token = App.getGlobalData('user_token')
    values.game_id = _this.data.gid
    values.plantform_id = pid
    values.area_name = this.data.area_name_list[pid][this.data.multiIndex[1]]
    _this.data.gid === 1 ? values.game_info = '英雄数量：' + values["hreonum"] + ',' + '铭文等级：' + values["runenum"] + ',' + '详细说明：' + values["info"] : values.game_info = '英雄数量：' + values["hreonum"] + ',' + '详细说明：' + values["info"]
    console.log(values);
    //console.log(values["dataArray"][0]["server_price"])


    //弹窗
    this.setData({
      _values: values,
      showMol: 'show',
      server_info: server
    })
    // console.log(this.data)
    //console.log(area_name)
    // console.log(pid)
    // console.log(e)
    // console.log(values)
    // console.log(this.data._values)



  },

  /**
   * 预览确定  提交后台
   */

  submitData: function () {
    var values = this.data._values
    console.log(values)
    App._post_form('order/creatorders', values, function (result) {
      console.log(result.data.oid)
      console.log(result.data.order_id)


      if (result.code === 200) {
        App._post_form('payment/orderPay', {
          user_token: values.user_token,
          oid: result.data.oid,
          order_id: result.data.order_id
        }, function (res) {
          console.log(res)
          if (res.code === 200) {
            wx.requestPayment({
              timeStamp: res.data.timeStamp,
              nonceStr: res.data.nonceStr,
              package: res.data.package,
              signType: res.data.signType,
              paySign: res.data.paySign,
              success(res) {
                console.log(res)
              },
              fail(res) {
                console.log(res)
              }
            });
          } else {
            App.showError(res.data.msg)

          }
        })
      }
    })
  },

  /**
   * 表单验证
   */

  validation: function (values, arr) {
    if (arr["begin_info"] === '' || arr["begin_info"] === undefined) {
      this.data.error = '当前段位(分数)不可为空';
      return false;
    }
    if (arr["end_info"] === '' || arr["end_info"] === undefined) {
      this.data.error = '目标段位(分数)不可为空';
      return false;
    }
    if (arr["server_price"] === '' || arr["server_price"] === undefined) {
      this.data.error = '佣金不可为空';
      return false;
    }
    if (values["game_account"] === '') {
      this.data.error = '游戏账号不可为空';
      return false;
    }
    if (values["game_password"] === '') {
      this.data.error = '游戏密码不可为空';
      return false;
    }
    if (values["game_user"] === '') {
      this.data.error = '游戏角色名称不可为空';
      return false;
    }
    if (values["hreonum"] === '') {
      this.data.error = '英雄数量不可为空';
      return false;
    }
    if (values["runenum"] === '') {
      this.data.error = '铭文等级不可为空';
      return false;
    }
    let reg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (values["user_mobile"] === '' || parseInt(values["user_mobile"].length) !== 11 || !reg.test(values["user_mobile"])) {
      this.data.error = '手机号码不合规范';
      return false;
    }
    return true;
  },

  /**
   * 弹窗预览
   */
  showModal: function (e) {
    this.setData({
      showMol: 'show'
    })
  },

  /**
   * 隐藏弹窗
   */
  hideModal: function (e) {
    this.setData({
      showMol: null
    })
  },
  /**
   * 遍历二维数组，提取元素成为一维数组
   */
  splitGame: function (arr, key) {
    var data = [];
    arr.map(function (value, index) {
      data.push(value[key]);
    });
    return data;
  },

  /**
   * 遍历二维数组，提取元素成为一维数组（带条件）
   */
  split_area: function (arr, key) {
    var data = [];
    arr.map(function (value, index) {
      if (data.hasOwnProperty(value.pid)) {
        data[value.pid].push(value[key]);
      } else {
        data[value.pid] = [];
        data[value.pid].push(value[key]);
      }
    });
    return data;
  },

  /**
   * 遍历二维数组，提取元素成为一维数组（带条件）
   */
  splitArea: function (arr, key) {
    var data = [];
    arr.map(function (value, index) {
      if (data.hasOwnProperty(value.gid)) {

        if (data[value.gid].hasOwnProperty(value.pid)) {
          data[value.gid][value.pid].push(value[key]);
        } else {
          data[value.gid][value.pid] = [];
          data[value.gid][value.pid].push(value[key]);
        }

      } else {

        data[value.gid] = [];

        if (data[value.gid].hasOwnProperty(value.pid)) {
          data[value.gid][value.pid].push(value[key]);
        } else {
          data[value.gid][value.pid] = [];
          data[value.gid][value.pid].push(value[key]);
        }

      }
    });
    return data;
  },
  /**
   * 自增生成王者荣耀巅峰赛增加分值数组
   */
  autoincrementArray: function (num) {
    var array = [];
    for (var i = 1; i <= num; i++) {
      array.push('+' + i * 30 + '分')
    }
    return array;
  },
  /**
   * 根据区最大数自增生成数组
   */
  autoincrementArr: function (num) {
    var array = [];
    for (var i = 1; i <= num; i++) {
      array.push('第' + i + '区')
    }
    return array;
  },
  /**
   * 根据属性名取出数组中对象(取area_num)
   */
  nameGetOutAreaNum: function (arr, k) {
    return arr.filter(item => item.gid === k)
  },
  /**
   * 根据属性名取出数组中对象(取pid)
   */
  nameGetOutPId: function (arr, k) {
    return arr.filter(item => item.id === k)
  },
  /**
   * 根据属性名取出数组中对象(取area_name)
   */
  nameGetOutAreaName: function (arr, k) {
    return arr.filter(item => item.gid === k)
  },

})