// pages/gamepractice/index.js
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
    this.getWaiterIndex()
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

  getWaiterIndex: function () {
    App._post_form("waiter/waiterIndex", {
      user_token: App.getGlobalData("user_token")
    }, function (res) {
      console.log(res)
      if (res.data.waiter_info.id === 0) {
        wx.showModal({
          title: '提示',
          content: '您还没有申请成为代练人员',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.switchTab({
                url: 'pages/user/index',
              });
            }
          },
        });
      }
      if (res.data.waiter_info.id > 0 && res.data.waiter_info.status === 2) {
        wx.showModal({
          title: '提示',
          content: '您的代练资格已锁定，请联系客服人员',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.switchTab({
                url: 'pages/user/index',
              });
            }
          },
        });
      } 
      if (res.data.waiter_info.id > 0 && res.data.waiter_info.status === 3) {
        wx.showModal({
          title: '提示',
          content: '您的代练资格正在申请中，请耐心等待',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {
              wx.switchTab({
                url: 'pages/user/index',
              });
            }
          },
        });
      } 
    })
  },
})