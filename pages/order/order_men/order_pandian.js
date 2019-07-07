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
    var s1 = new Date();
    s1.setTime(s1.getTime());
    var s2 = new Date();
    s2.setTime(s2.getTime() + 24 * 60 * 60 * 1000);
    let st = s1.getFullYear() + "-" + (s1.getMonth() + 1) + "-" + s1.getDate();
    let et = s2.getFullYear() + "-" + (s2.getMonth() + 1) + "-" + s2.getDate();
    //let endTime = util.formatTime(new Date(year, '0', '0'));
    let startTime = st.split(" ")[0];
    let endTime = et.split(" ")[0];
    that.setData({
      startTime: startTime,
      endTime: endTime,
      selectTime: startTime,
      endselectTime: startTime,
      storeText: getApp().globalData.org_name,
      storeId: getApp().globalData.org_id
    })
    //获取门店
    that.getStoreList('api/org/storelist')
    //盘点模板列表
    that.getTemplateList('api/org/pdtemplatelist')
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
  //选择订单模板
  templateChange(e) {
    let templateId = this.data.templatelist[e.detail.value].id
    this.setData({
      templateText: this.data.templatelist[e.detail.value].ref,
      templateId,
      goodType: e.detail.value
    });
    this.getDetails();
  },
  getDetails() {
    let storeId = this.data.storeId;
    let templateId = this.data.templateId;
    if (!storeId) {
      wx.showModal({
        title: '提示',
        content: '请选择订货门店',
        showCancel: false
      });
      return false;
    }

    if (!templateId) {
      wx.showModal({
        title: '提示',
        content: '请选择盘点模板',
        showCancel: false
      });
      return false;
    }
    let that = this;
    let url = "api/org/pdtemplatedetails?id=" + templateId + "&org_id=" + storeId;
    http({
      url: url,
      method: "GET",
      success: function(res) {
        if (res.code == 200) {
          that.setData({
            'orderList': res.data
          });
        } else {
          console.log("错误请求")
        }
      }
    })
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
  //修改发货数量
  dataChange(e) {
    let code = e.target.dataset.good;
    let num = e.detail.value;
    this.data.orderList.map((item) => {
      if (item.goods_id == code) {
        item.ld_goods_count = num;
        item.cha_count = item.goods_count - num;
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
    let templateId = this.data.templateId;
    let storeId = this.data.storeId;
    let ordertime = this.data.ordertime || this.datetime_to_unix(this.data.selectTime);
    let items = this.data.orderList;
    let memo = this.data.memo;
    let userId = getApp().globalData.id;
    let data = {
      template_id: templateId,
      company_id: storeId,
      user_id: userId,
      memo: memo,
      ordertime: ordertime,
      items
    }
    if (!this.data.storeText || !this.data.storeId) {
      wx.showModal({
        title: '提示',
        content: '请选择订货门店',
        showCancel: false
      });
      return false;
    }
    if (!templateId) {
      wx.showModal({
        title: '提示',
        content: '请选择盘点模板',
        showCancel: false
      });
      return false;
    }

    let bitems = false;
    for (let i = 0; i < items.length; i++) {
      if (items[i].goods_count > 0) {
        bitems = true;
        break;
      }
    }
    console.log(items.length);

    if (bitems == false || items.length == 0) {
      wx.showModal({
        title: '提示',
        content: '无盘点物品',
        showCancel: false
      });
      return false;
    }
    console.log(data);
    wx.request({
      url: 'https://www.notmenu.com/web/api/org/pandianAdd',
      method: "POST",
      data: {
        data: JSON.stringify(data)
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        console.log(res.data);
        if (res.data.code == 200) {
          wx.showModal({
            showCancel: false,
            title: '盘点成功',
            success(res) {
              if (res.confirm) {
                wx.redirectTo({
                  url: '/pages/order/order_men/order_pandian',
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