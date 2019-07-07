import http from '../../utils/http.js';
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginShow: true,
    username: "",
    password: "",
    iconList: [{
      icon: 'cardboardfill',
      color: 'red',
      badge: 120,
      name: 'VR'
    }, {
      icon: 'recordfill',
      color: 'orange',
      badge: 1,
      name: '录像'
    }, {
      icon: 'picfill',
      color: 'yellow',
      badge: 0,
      name: '图像'
    }, {
      icon: 'noticefill',
      color: 'olive',
      badge: 22,
      name: '通知'
    }, {
      icon: 'upstagefill',
      color: 'cyan',
      badge: 0,
      name: '排行榜'
    }, {
      icon: 'clothesfill',
      color: 'blue',
      badge: 0,
      name: '皮肤'
    }, {
      icon: 'discoverfill',
      color: 'purple',
      badge: 0,
      name: '发现'
    }, {
      icon: 'questionfill',
      color: 'mauve',
      badge: 0,
      name: '帮助'
    }, {
      icon: 'commandfill',
      color: 'purple',
      badge: 0,
      name: '问答'
    }, {
      icon: 'brandfill',
      color: 'mauve',
      badge: 0,
      name: '版权'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.hideTabBar({})
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
  handUsername(e) {
    this.setData({
      username: e.detail.value
    })
  },
  handPassword(e) {
    this.setData({
      password: e.detail.value
    })
  },
  handLogin() {
    let that = this;
    http({
      url: '/api/user/login',
      data: {
        username: that.data.username,
        password: that.data.password
      },
      success: function(res) {
        let {
          code,
          data
        } = res;
        if (code == 200 && data.length) {
          getApp().globalData.id = data[0].id;
          getApp().globalData.companyid = data[0].company_id;
          getApp().globalData.username = data[0].name;
          getApp().globalData.org_id = data[0].org_id;
          getApp().globalData.org_code = data[0].org_code;
          getApp().globalData.data_org = data[0].data_org;
          getApp().globalData.org_name = data[0].org_name;
          //console.log(getApp().globalData.org_name);
          that.setData({
            loginShow: false
          })
          wx.showModal({
            title: '提示',
            content: '登录成功',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/order/order'
                })
              }
            }
          })

        } else {
          wx.showModal({
            title: '提示',
            content: '登录失败,用户名或密码错误',
            showCancel: false,
            success(res) {
              if (res.confirm) {

              }
            }
          })
        }

      },
      fail: function() {
        getApp().globalData.id = "";
        getApp().globalData.companyid = "";
      }
    })
  }
})