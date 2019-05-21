import http from '../../../utils/http.js';
import util from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsList: [],
    storelist: [],
    templatelist: [],
    storeId: '',
    templateId: '',
    startTime: '',
    endTime: '',
    selectTime: '',
    store: '',
    templateText: '',
    storeText: '',
    goodType: '',
    ordertime: '',
    memo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let year = (new Date().getFullYear() + 1);
    let time = util.formatTime(new Date());
    let endTime = util.formatTime(new Date(year, '0', '0'));
    let startTime = time.split(" ")[0];
    that.setData({
      endTime,
      startTime,
      selectTime: startTime
    })
    //获取门店
    that.getStoreList('api/org/storelist')
    //物品模板列表
    that.getTemplateList('/api/org/templatelist')
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
    this.getHuaList(templateId);
    this.setData({
      templateText: this.data.templatelist[e.detail.value].bill_memo,
      templateId,
      goodType: e.detail.value
    })
  },
  //删除goods
  deleGoods(e) {
    let code = e.target.dataset.code;
    console.log(code);
    this.deleGoodsList(code);
  },
  deleGoodsList(code) {
    let num = this.data.goodsList.findIndex((item) => {
      return item.goods_id == code
    })
    
    this.data.goodsList.splice(num, 1);
    this.setData({
      goodsList: this.data.goodsList
    })
  },
  //物品列表数据
  getHuaList(id) {
    let that = this;
    http({
      url: "api/org/templatedetails",
      method: "GET",
      data: {
        id: id
      },
      success: function(res) {
        if (res.code == 200) {
          that.setData({
            goodsList: res.data
          })
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
  //添加数量
  dataChange(e) {
    let code = e.target.dataset.good;
    let num = e.detail.value;
    this.data.goodsList.map((item) => {
      if (item.goods_id == code) {
        item.goods_count = num
      }
    })
    this.setData({
      goodsList: this.data.goodsList
    })

  },
  //提交数据
  submitData() {
    let that = this;
    let templateId = this.data.templateId;
    let storeId = this.data.storeId;
    let ordertime = this.data.ordertime || this.datetime_to_unix(this.data.selectTime);
    let items = this.data.goodsList;
    let memo = this.data.memo;
    let data = {
      template_id: templateId,
      company_id: storeId,
      memo,
      ordertime,
      items
    }
    if (!this.data.storeText && !this.data.templateText){      
        return false;
    }
    http({
      url: '/api/org/orderAdd',
      method: "GET",
      data: {
        data
      },
      success: function (res) {
        if (res.code == 200) {
          wx.showModal({
            showCancel:false,
            title: '订单成功',
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
      }
    })

  },
  // ListTouch触摸开始
  ListTouchStart(e) {
    this.setData({
      ListTouchStart: e.touches[0].pageX
    })
  },

  // ListTouch计算方向
  ListTouchMove(e) {
    this.setData({
      ListTouchDirection: e.touches[0].pageX - this.data.ListTouchStart > 0 ? 'right' : 'left'
    })
  },
  // ListTouch计算滚动
  ListTouchEnd(e) {
    if (this.data.ListTouchDirection == 'left') {
      this.setData({
        modalName: e.currentTarget.dataset.target
      })
    } else {
      this.setData({
        modalName: null
      })
    }
    this.setData({
      ListTouchDirection: null
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