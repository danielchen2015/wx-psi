Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  exitSys() {
    wx.showModal({
      title: '提示',
      content: '确定要退出系统吗?',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          getApp().globalData.id = "";
          getApp().globalData.companyid = "";
          getApp().globalData.username = "";
          getApp().globalData.org_id = "";
          getApp().globalData.org_code = "";
          getApp().globalData.data_org = "";
          getApp().globalData.org_name = "";
          wx.clearStorage();
          wx.reLaunch({
            url: '/pages/home/home',
          })
          console.log(1313);
          // wx.switchTab({
          //   url: '/pages/home/home',
          // })
        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }

})