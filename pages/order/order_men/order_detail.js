import http from '../../../utils/http.js';
import util from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    orderId: '',
    goodsCount: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    console.log(options);
    let orderId = options.orderId;
    that.setData({
      orderId: options.orderId
    })
    //订单物品列表
    that.getOrderList('api/org/orderdetails?orderId=' + orderId);
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
  //订单物品列表
  getOrderList(url) {
    let that = this;
    http({
      url: url,
      method: "GET",
      success: function(res) {
        if (res.code == 200) {
          that.setData({
            orderList: res.data
          })
        } else {
          console.log("请求接口错误")
        }
      }
    })
  },
  //修改发货数量
  dataChange(e) {
    let code = e.target.dataset.good;
    let num = e.detail.value;
    this.data.orderList.map((item) => {
      if (item.id == code) {
        item.ld_goods_count = num;
        item.cha_count = num - item.goods_count;
      }
    })
    this.setData({
      'orderList': this.data.orderList
    })
    console.log(this.data.orderList);
  },
  //提交数据
  submitData() {
    let that = this;
    let orderId = this.data.orderId;
    let items = this.data.orderList;
    let userId = getApp().globalData.id;
    let data = {
      orderId: orderId,
      user_id: userId,
      items
    }
    if (!this.data.orderId && !this.data.orderList) {
      //return false;
    }
    console.log(data);
    wx.request({
      url: 'https://www.notmenu.com/web/api/org/orderin',
      method: "POST",
      data: {
        data: JSON.stringify(data)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res.data);
        if (res.data.code == 200) {
          wx.showModal({
            showCancel: false,
            title: '入库成功',
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/order/order'
                })
              }
            }
          })
        } else {
          console.log("接口错误")
        }
      },
    })
  },
  //转化时间戳
  datetime_to_unix(datetime) {
    var tmp_datetime = datetime.replace(/:/g, '-');
    tmp_datetime = tmp_datetime.replace(/ /g, '-');
    var arr = tmp_datetime.split("-");
    var now = new Date(Date.UTC(arr[0], arr[1] - 1, arr[2]));
    return parseInt(now.getTime() / 1000);
  }
})