// pages/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searching: false,
    devicesList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  },

  /**
   * 点击QR Scan按钮事件
   */
  clickButton: function() {
    wx.navigateTo({
      url: '/pages/qr_scanner/qr_scanner',
    })
  },
    /**
   * 点击搜索蓝牙设备按钮事件
   */
  Search: function () {
    var that = this
    if (!that.data.searching) {
      wx.closeBluetoothAdapter({
        complete: function (res) {
          console.log(res)
          wx.openBluetoothAdapter({
            success: function (res) {
              console.log(res)
              wx.getBluetoothAdapterState({
                success: function (res) {
                  console.log(res)
                }
              })
              wx.startBluetoothDevicesDiscovery({
                allowDuplicatesKey: false,
                success: function (res) {
                  console.log(res)
                  wx.navigateTo({
                    url: '/pages/searching/searching'})
                  that.setData({
                    searching: true,
                    devicesList: []
                  })
                }
              })
            },
            fail: function (res) {
              console.log(res)
              wx.showModal({
                title: '提示',
                content: '请检查手机蓝牙是否打开',
                showCancel: false,
                success: function (res) {
                  that.setData({
                    searching: false
                  })
                }
              })
            }
          })
        }
      })
    }
    else {
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log(res)
          that.setData({
            searching: false
          })
        }
      })
    }
  },
})
