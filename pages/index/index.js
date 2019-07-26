let App = getApp();

Page({
  data: {
    // banner轮播组件属性
    indicatorDots: true, // 是否显示面板指示点	
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长
    imgHeights: {}, // 图片的高度
    imgCurrent: {}, // 当前banne所在滑块指针

    // 页面元素
    items: {},
    newest: {},
    best: {},

    list: {},
    scrollTop: 0,

    swiperList: [],
    
  },

  onLoad: function() {
    // 设置页面标题
    let _this = this;
    App.setTitle();
    let swiper = [
        { imgSrc: App.siteInfo.siteroot+'static/assets/game/banner_1.jpg'},
        { imgSrc: App.siteInfo.siteroot + 'static/assets/game/banner_2.jpg'}
      ];
    _this.setData({
      swiperList: swiper
    });
    // 获取首页数据
    //this.getIndexData();
    // 获取接单列表
    _this.getOrderLists();
  },

  //获取接单列表
  getOrderLists:function(){
    let _this = this;
    App._get('order/getIndexOrder', {}, function (res) {
      console.log(res);
      _this.setData({
        orderList: Object.values(res.data.order),
        rorderList: Object.values(res.data.rorder)
        // orderList :orderList
      });
    });
  },

  /**
   * 获取首页数据
   */
  getIndexData: function() {
    let _this = this;
    App._get('index/page', {}, function (res) {
      console.log(res);
      _this.setData(res.data);
    });
    // App._get('Insurance/wxappGetInsuranceList', {}, function(res) {
    //   console.log(res);

    //   _this.setData({
    //     list: Object.values(res.data)
    //   });
    // });
  },
 
  /**
   * 计算图片高度
   */
  imagesHeight: function(e) {
    let imgId = e.target.dataset.id,
      itemKey = e.target.dataset.itemKey,
      ratio = e.detail.width / e.detail.height, // 宽高比
      viewHeight = 750 / ratio, // 计算的高度值
      imgHeights = this.data.imgHeights;

    // 把每一张图片的对应的高度记录到数组里
    if (typeof imgHeights[itemKey] === 'undefined') {
      imgHeights[itemKey] = {};
    }
    imgHeights[itemKey][imgId] = viewHeight;
    // 第一种方式
    let imgCurrent = this.data.imgCurrent;
    if (typeof imgCurrent[itemKey] === 'undefined') {
      imgCurrent[itemKey] = Object.keys(this.data.items[itemKey].data)[0];
    }
    this.setData({
      imgHeights,
      imgCurrent
    });
  },

  bindChange: function(e) {
    let itemKey = e.target.dataset.itemKey,
      imgCurrent = this.data.imgCurrent;
    // imgCurrent[itemKey] = e.detail.current;
    imgCurrent[itemKey] = e.detail.currentItemId;
    this.setData({
      imgCurrent
    });
  },

  goTop: function(t) {
    this.setData({
      scrollTop: 0
    });
  },

  scroll: function(t) {
    this.setData({
      indexSearch: t.detail.scrollTop
    }), t.detail.scrollTop > 300 ? this.setData({
      floorstatus: !0
    }) : this.setData({
      floorstatus: !1
    });
  },

  onShareAppMessage: function() {
    return {
      title: "小程序首页",
      desc: "",
      path: "/pages/index/index"
    };
  },

//跳转到接单列表详情页
  detail:function(e){
    console.log(e);
    var id = e.target.dataset.id;
    var order_id = e.target.dataset.orderid;
    var true_type = e.target.dataset.type;
    console.log("id=="+id);
    console.log("order_id=="+order_id);
    wx.navigateTo({
      url: '../gamepractice/practicelist_detail?order_id=' + order_id + '&o_id=' + id + '&fromwhere=0&true_type=' + true_type,
    })
  }
});