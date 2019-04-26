// pages/user/fadan.js
let App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    rtdy: [{
      gid: 1,
      name: "diyige "
    }, {
      gid: 1,
      name: "第二个 "
    }, {
      gid: 1,
      name: "第三个 "
    }, {
      gid: 2,
      name: "第四个 "
    }, ],
    error: '',

    game_index_list: [],
    game_name_list: [],

    plantform_index_list: [],
    plantform_index_list: [],

    area_name_list: [],


    game_index: '',
    multiArray: [
      // ['一级1', '一级2'],
      // ['二级1', '线形动物', '环节动物', '软体动物', '节肢动物'],
      // ['猪肉绦虫', '吸血虫']
    ],
    multiIndex: [0, 0, 0],
    time: '12:01',
    date: '2018-12-25',
    region: ['广东省', '广州市', '海珠区'],
    imgList: [],
    modalName: null,
    textareaAValue: '',
    textareaBValue: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGameServer()

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
      user_token: App.getGlobalData('user_token')
    }, function (result) {
      console.log(result);

      _this.setData({
        game_index_list: _this.splitGame(result.data.game, 'id'),
        game_name_list: _this.splitGame(result.data.game, 'cname'),

        plantform_index_list: _this.splitPlantform(result.data.plantform, 'id'),
        plantform_name_list: _this.splitPlantform(result.data.plantform, 'name'),

        area_name_list: _this.splitArea(result.data.area, 'name'),
      });
      // 向area_name_list添加王者荣耀大区数据
      var area_name_list = _this.data.area_name_list
      var aovLsit = _this.getAovList(result.data.plantform, 1);
      area_name_list[1] = []
      for (var i = 1; i <= aovLsit.length; i++) {
        var item = _this.autoincrementArr(aovLsit[i - 1].area_num)
        area_name_list[1][i] = []
        //aovname[i].push(item)
        area_name_list[1][i] = item
      }
      var multiArray = [];
      multiArray[0] = _this.data.game_name_list;
      let first_game_id = _this.data.game_index_list[0];
      multiArray[1] = _this.data.plantform_name_list[first_game_id];
      let first_plantform_id = _this.data.plantform_index_list[first_game_id][0];
      multiArray[2] = _this.data.area_name_list[first_game_id][first_plantform_id];

      _this.setData({
        multiArray: multiArray,
        area_name_list: area_name_list
      });

      // console.log(_this.data.multiArray);
      // console.log(_this.data.game_index_list);
      // console.log(_this.data.game_name_list);
      console.log(_this.data.plantform_name_list);
      console.log(_this.data.plantform_index_list);
      console.log(_this.data.area_name_list);

    })
  },

  /**
   * 选择游戏
   */
  pickerChangeGame: function (e) {
    this.setData({
      game_index: e.detail.value
    })

  },
  MultiChange(e) {
    console.log(e)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  MultiColumnChange(e) {
    let _data = this.data;
    console.log(e)
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = _data.plantform_name_list[_data.game_index_list[0]];
            data.multiArray[2] = _data.area_name_list[_data.game_index_list[0]][_data.plantform_index_list[_data.game_index_list[0]][0]];
            break;
            //_data.area_name_list[gid][pid]
            //gid = _data.game_index_list[0]
            //pid = _data.plantform_index_list[_data.game_index_list[0]][0]
          case 1:
            data.multiArray[1] = _data.plantform_name_list[_data.game_index_list[1]];
            data.multiArray[2] = _data.area_name_list[_data.game_index_list[1]][_data.plantform_index_list[_data.game_index_list[1]][0]];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = _data.area_name_list[_data.game_index_list[0]][_data.plantform_index_list[_data.game_index_list[0]][0]];
                break;
              case 1:
                data.multiArray[2] = _data.area_name_list[_data.game_index_list[0]][_data.plantform_index_list[_data.game_index_list[0]][1]];
                break;
              case 2:
                data.multiArray[2] = _data.area_name_list[_data.game_index_list[0]][_data.plantform_index_list[_data.game_index_list[0]][2]];
                break;
              case 3:
                data.multiArray[2] = _data.area_name_list[_data.game_index_list[0]][_data.plantform_index_list[_data.game_index_list[0]][3]];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = _data.area_name_list[_data.game_index_list[1]][_data.plantform_index_list[_data.game_index_list[1]][0]];
                break;
              case 1:
                data.multiArray[2] = _data.area_name_list[_data.game_index_list[1]][_data.plantform_index_list[_data.game_index_list[1]][1]];
                break;
              case 2:
                data.multiArray[2] = _data.area_name_list[_data.game_index_list[1]][_data.plantform_index_list[_data.game_index_list[1]][2]];
                break;
              case 3:
                data.multiArray[2] = _data.area_name_list[_data.game_index_list[1]][_data.plantform_index_list[_data.game_index_list[1]][3]];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
    console.log(this.data.multiIndex)
  },

  /**
   * 表单提交
   */
  saveData: function () {
    //处理gid pid area_name
    //gid
    var gid = this.data.game_index_list[this.data.multiIndex[0]];
    //pid
    var pid = this.data.plantform_index_list[gid][this.data.multiIndex[1]];
    //area_name = arr[gid][pid][index]
    var area_name = this.data.area_name_list[gid][pid][this.data.multiIndex[2]]
    console.log(gid)
    console.log(pid)
    console.log(area_name)
  },
  /**
   * 表单验证
   */

  validation: function (values) {
    if (values.aa === '') {
      this.data.error = '游戏账号不可为空';
      return false;
    }

    return true;
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
  splitPlantform: function (arr, key) {
    var data = [];
    arr.map(function (value, index) {
      if (data.hasOwnProperty(value.gid)) {
        data[value.gid].push(value[key]);
      } else {
        data[value.gid] = [];
        data[value.gid].push(value[key]);
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
   * 根据区最大数自增生成数组
   */
  autoincrementArr: function (num) {
    var array = [];
    for (var i = 1; i <= num; i++) {
      array.push('第' + i + '区')
    }
    return array;
  },

  // aa:function(arr){
  //   for (var i in arr) {
  //     if(arr[i].gid === 1){
  //       newarr[j++] =arr[i] 
  //       return newarr;
  //     }
  //    }
  // },
  // aa: function (arr) {
  //   for (var i = 0; i < arr.length; i++) {
  //     var newarr = []
  //     if (arr[i].gid === 1) {
  //       newarr.push(arr[i])
  //     }
  //     console.log(newarr)
  //   }

  // },
  getAovList: function (arr, gid) {
    return arr.filter(item => item.gid == gid)
  }


})