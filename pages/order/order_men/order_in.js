import http from '../../../utils/http.js';
import util from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    submitList: [],
    storelist: [],
    templatelist: [],
    storeId: '',
    templateId: '',
    startTime: '',
    endTime: '',
    selectTime: '',
    endselectTime: '',
    store: '',
    templateText: '',
    storeText: '',
    goodType: '',
    ordertime: '',
    endordertime: '',
    memo: '',
    good: '',
    savegoodList: [],
    goodsId: '',
    goodsText: '',
    orderList: [],
    selectOrderId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let now = new Date();
    let year = (now.getFullYear() + 1);
    //console.log(now + 1);
    //明天的时间
    var day3 = new Date();
    day3.setTime(day3.getTime() - 24 * 60 * 60 * 1000 * 30);
    let time = day3.getFullYear() + "-" + (day3.getMonth() + 1) + "-" + day3.getDate();
    //let time = util.formatTime(that.getDateStr(null, 1));
    let endTime = util.formatTime(new Date(year, '0', '0'));
    let startTime = time.split(" ")[0];
    that.setData({
      endTime,
      startTime,
      selectTime: startTime,
      endselectTime: startTime
    })
    //获取门店
    that.getStoreList('api/org/storelist')
    //物品模板列表
    that.getTemplateList('api/org/supplierlist')
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
  //输入地址
  memoChange(e) {
    this.setData({
      memo: e.detail.value
    })
  },
  //物品搜索
  goodsChange(e) {
    let that = this;
    let good = e.detail.value;
    that.setData({
      good: e.detail.value
    })
    //console.log(good)
    //物品
    that.getGoodsList('/api/org/goodslist?py=' + good)
  },
  //选择门店
  storeChange(e) {
    let storeId = this.data.storelist[e.detail.value].id
    this.setData({
      storeText: this.data.storelist[e.detail.value].name,
      storeId
    })
  },
  //选择时间
  timeChange(e) {
    let ordertime = this.datetime_to_unix(e.detail.value);
    this.setData({
      selectTime: e.detail.value,
      ordertime
    })
  },
  //选择时间
  endtimeChange(e) {
    let endordertime = this.datetime_to_unix(e.detail.value);
    this.setData({
      endselectTime: e.detail.value,
      endordertime
    })
  },
  //选择订单模板
  templateChange(e) {
    let templateId = this.data.templatelist[e.detail.value].id
    this.setData({
      templateText: this.data.templatelist[e.detail.value].name,
      templateId,
      goodType: e.detail.value
    });
  },
  //门店列表数据
  getStoreList(url) {
    let that = this;
    http({
      url: url,
      method: "GET",
      success: function(res) {
        if (res.code == 200) {
          that.setData({
            storelist: res.data
          })
        } else {
          console.log("错误请求")
        }
      }
    })
  },
  //物品模板列表
  getTemplateList(url) {
    let that = this;
    http({
      url: url,
      method: "GET",
      success: function(res) {
        if (res.code == 200) {
          that.setData({
            templatelist: res.data
          })
        } else {
          console.log("请求接口错误")
        }
      }
    })
  },
  //提交数据
  submitData() {
    let that = this;
    let templateId = this.data.templateId;
    let storeId = this.data.storeId;
    let ordertime = this.data.ordertime || this.datetime_to_unix(this.data.selectTime);
    let endordertime = this.data.endordertime || this.datetime_to_unix(this.data.endselectTime);
    let userId = getApp().globalData.id;
    let data = {
      supplier_id: templateId,
      org_id: storeId,
      user_id: userId,
      from_date: ordertime,
      to_date: endordertime
    }
    if (!this.data.storeText && !this.data.templateText) {
      //return false;
    }
    console.log(data);
    http({
      url: "api/org/orderlist",
      method: "GET",
      data: {
        supplier_id: templateId,
        org_id: storeId,
        user_id: userId,
        from_date: ordertime,
        to_date: endordertime
      },
      success: function (res) {
        if (res.code == 200) {
          that.setData({
            goodsList: res.data
          });
        } else {
          console.log("错误请求")
        }
      }
    })
  },
  // 获取选中推荐列表中的值
  selectOrdersid: function (res) {
    //console.log(res.currentTarget.dataset.index, res.currentTarget.dataset.name);
    console.log(res.currentTarget.dataset.name);
    //跳转页面
    wx.navigateTo({
      url: '/pages/order/order_men/order_detail?orderId=' + res.currentTarget.dataset.name
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