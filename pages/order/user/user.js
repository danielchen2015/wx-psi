import http from '../../../utils/http.js';
import util from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    index: 0,
    companylist: [],
    companyText: "",
    companyId: "",
    name: "",
    phone: "",
    idCard: "",

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
    //获取门店
    this.getCompanyList("/api/employee/companylist");
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
  //门店
  getCompanyList(url) {
    var that = this;
    http({
      url: url,
      method: "GET",
      success: function(res) {
        if (res.code == 200) {
          that.setData({
            companylist: res.data
          })
        } else {
          console.log("接口错误")
        }
      }
    })
  },
  //门店
  companyChange(e) {
    let text = this.data.companylist[e.detail.value].name;
    let companyId = this.data.companylist[e.detail.value].id;
    this.setData({
      companyText: text,
      companyId
    })
  },
  //姓名
  nameChange(e) {
    let name = e.detail.value
    this.setData({
      name
    })
  },
  //查询手机号
  phoneChange(e) {
    let phone = e.detail.value
    this.setData({
      phone
    })
  },
  //身份证号http://test.xingyizxmr.com/api/employee/search?mobile=1&idcard=4&name=刘&company_id=4D74E1E4-A129-11E4-9B6A-782BCBD7746B
  idChange(e) {
    let idCard = e.detail.value
    this.setData({
      idCard
    })
    console.log("id---", idCard)
  },
  submitData() {
    let that = this;
    let data = {
      mobile: that.data.phone,
      idcard: that.data.idCard,
      name: that.data.name,
      company_id: that.data.companyId
    }
    if (!data.mobile && !data.idcard && !data.name && !data.company_id){
      return false;
    }
    http({
      url: "api/employee/search",
      data: data,
      method: "GET",
      success: function(res) {
        if (res.code == 200 && res.data.length) {
          let userinfo = res.data;
          that.setData({
            userinfo
          })
          wx.navigateTo({
            url: '/pages/order/detail/detail?userinfo='+ JSON.stringify(userinfo)　　// 详细页面
          })
          console.log("userinfo", userinfo)
        } else {
          wx.showModal({
            title: '提示',
            showCancel:false,
            content: '没有找到',
            success(res) {
              if (res.confirm) {
                
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
        }
      }
    })


  }

})