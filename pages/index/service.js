// pages/index/service.js
let App = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wx_erweima:App.siteInfo.siteroot+'static/assets/game/wx_kefu.png',
      qq_erweima:App.siteInfo.siteroot+'static/assets/game/qq_kefu.png',
    })

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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
/*       for($i=0; $i<$v['star']; $i++){
              $king_star += 1;
              $name = '最强王者'.$king_star.'星';
              $name_list[] = $name;
              $temp = ['name'=>$name, 'stars'=>$star, 'star_level'=>$v['star_level']];
              $level_list[] = $temp;
              $star ++;
          }
 */
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})