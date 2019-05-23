let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    gid: null,
    status: '1',
    list: [],
    gemeTypeList: [],
    num: 3, //分页时每页的条数
    page: 1, // 当前所在第几页
    searchLoading: false, //"上拉加载"的变量，默认false，隐藏  
    searchLoadingComplete: false,  //“没有数据”的变量，默认false，隐藏  
    isFromSearch: true,   // 用于判断searchSongList数组是不是空数组，默认true，空的数组
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      dataType: options.dataType
    })
    this.getGameType();
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight + "px",
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 获取订单列表
    this.getGameList(this.data.gid);
  },

  getGameType: function () {
    let _this = this;
    App._post_form('game/getGameList', { gid: 0 }, function (result) {
      console.log(result)

      _this.setData({
        gemeTypeList: result.data
      })
    });
  },

  /**
   * 获取订单列表
   */
  getGameList: function (gid) {
    let _this = this;
    console.log("gid==" + _this.data.gid);
    App._post_form('waiter/waiterAssignOrder', { user_token: App.getGlobalData('user_token'), step: 4, gid: _this.data.gid, limit: _this.data.num, page: _this.data.page }, function (result) {
      console.log(result);
      let resultdata = result.data.data;
      if (resultdata == false) {
        if(_this.data.page === 1){
          _this.setData({
            searchLoadingComplete: false, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          });
        } else{
          _this.setData({
            searchLoadingComplete: true, //把“没有数据”设为true，显示  
            searchLoading: false  //把"上拉加载"的变量设为false，隐藏  
          });
        }
        _this.setData({
          list: resultdata, //获取数据数组  
          searchLoading: true   //把"上拉加载"的变量设为false，显示  
        });
      } else {
        let searchList = [];
        //如果isFromSearch是true从data中取出数据，否则先从原来的数据继续添加  
        _this.data.isFromSearch ? searchList = resultdata : searchList = _this.data.list.concat(resultdata)
        _this.setData({
          list: searchList, //获取数据数组  
          searchLoading: true   //把"上拉加载"的变量设为false，显示  
        });
      }
    });
  },

  /**
   * 切换标签
   */
  bindHeaderTap: function (e) {
    this.setData({
      dataType: e.target.dataset.type,
      scrollTop: 0
    });
    this.data.gid = e.target.dataset.type;
    this.data.page = 1;
    this.data.searchLoading = false; //"上拉加载"的变量，默认false，隐藏  
    this.data.searchLoadingComplete = false;  //“没有数据”的变量，默认false，隐藏  
    this.data.isFromSearch = true;
    // 获取订单列表
    this.getGameList(this.data.gid);
  },

  onScrollLower: function (e) {
    let that = this;
    if (that.data.searchLoading && !that.data.searchLoadingComplete) {
      that.setData({
        isFromSearch: false,  //触发到上拉事件，把isFromSearch设为为false  
      });
      this.data.gid = that.data.gid;
      this.data.page += 1;
      // 获取订单列表
      this.getGameList(this.data.gid);
    }
  }


});