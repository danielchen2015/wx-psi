import { API_HOST } from "const"

function http(opts) {
  if (!opts.noLoading) {
    wx.showLoading({
      title: '数据请求中...',
      mask: true
    })
  }
  var url = opts.url;
  if (!/^http/.test(url)) {
    url = API_HOST + opts.url;
  }
  wx.request({
    method: opts.method || 'GET',
    url: url,
    data: opts.data,
    header: {
      "content-type": "application/json",
      "Accept-Language": "zh-CN, zh;q=0.9"
    },
    success: function (res) {
      if (res && res.statusCode === 200) {
        opts.success && opts.success(res.data);
      }
    },
    fail: function (res) {
      opts.fail && opts.fail(res)
    },
    complete: function (res) {
      if (res.statusCode === 403) {
      }
      if (!opts.noLoading) {
        wx.hideLoading();
      }
      wx.hideNavigationBarLoading(); //完成停止加载
    }
  })
}
module.exports = http;
