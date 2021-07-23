const app = getApp()
Page({
  data: {
    searching: false,
    devicesList: []
  },
  Connect: function (e) {
    var that = this
    var advertisData, name
    console.log(e.currentTarget.id)
    for (var i = 0; i < that.data.devicesList.length; i++) {
      if (e.currentTarget.id == that.data.devicesList[i].deviceId) {
        name = that.data.devicesList[i].name
        advertisData = that.data.devicesList[i].advertisData
      }
    }
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        console.log(res)
        that.setData({
          searching: false
        })
      }
    })
    wx.showLoading({
      title: '连接蓝牙设备中...',
    })
    wx.createBLEConnection({
      deviceId: e.currentTarget.id,
      success: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showToast({
          title: '连接成功',
          icon: 'success',
          duration: 1000
        })
        wx.navigateTo({
          url: '../device/device?connectedDeviceId=' + e.currentTarget.id + '&name=' + name
        })
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '连接失败',
          showCancel: false
        })
      }
    })
  },
  onLoad: function (options) {
    var that = this
    var list_height = ((app.globalData.SystemInfo.windowHeight - 50) * (750 / app.globalData.SystemInfo.windowWidth)) 
    that.setData({
      list_height: list_height
    })
    wx.onBluetoothAdapterStateChange(function (res) {
      console.log(res)
      that.setData({
        searching: res.discovering
      })
      if (!res.available) {
        that.setData({
          searching: false
        })
      }
    })
    wx.onBluetoothDeviceFound(function (devices) {
      //剔除重复设备，兼容不同设备API的不同返回值
      var isnotexist = true
      if (devices.deviceId) {
        if (devices.advertisData)
        {
          devices.advertisData = app.buf2hex(devices.advertisData)
        }
        else
        {
          devices.advertisData = ''
        }
        console.log(devices)
        for (var i = 0; i < that.data.devicesList.length; i++) {
          if (devices.deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          that.data.devicesList.push(devices)
        }
      }
      else if (devices.devices) {
        if (devices.devices[0].advertisData)
        {
          devices.devices[0].advertisData = app.buf2hex(devices.devices[0].advertisData)
        }
        else
        {
          devices.devices[0].advertisData = ''
        }
        console.log(devices.devices[0])
        for (var i = 0; i < that.data.devicesList.length; i++) {
          if (devices.devices[0].deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          that.data.devicesList.push(devices.devices[0])
        }
      }
      else if (devices[0]) {
        if (devices[0].advertisData)
        {
          devices[0].advertisData = app.buf2hex(devices[0].advertisData)
        }
        else
        {
          devices[0].advertisData = ''
        }
        console.log(devices[0])
        for (var i = 0; i < devices_list.length; i++) {
          if (devices[0].deviceId == that.data.devicesList[i].deviceId) {
            isnotexist = false
          }
        }
        if (isnotexist) {
          that.data.devicesList.push(devices[0])
        }
      }
      that.setData({
        devicesList: that.data.devicesList
      })
    })
  },
  onReady: function () {

  },
  onShow: function () {
    
  },
  onHide: function () {
    var that = this
    that.setData({
      devicesList: []
    })
    if (this.data.searching) {
      wx.stopBluetoothDevicesDiscovery({
        success: function (res) {
          console.log(res)
          that.setData({
            searching: false
          })
        }
      })
    }
  }
})