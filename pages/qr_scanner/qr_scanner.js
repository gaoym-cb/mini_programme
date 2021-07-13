// pages/qr_scanner/qr_scanner.js
Page({

  /**
   * 页面的初始数据
   * device_name通过扫码获得，目前使用的设备名称为ShanghaiTech 示例二维码在figures文件夹下
   */
  data: {
    deviceName:'',
    deviceId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    // 调用qr
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success: function(res) {
        that.setData({
          deviceName: res.result
        });

        //打开蓝牙
        wx.openBluetoothAdapter({
          success: function(res) {  },
          fail: function(res) {
            wx.showModal({
              content: 'Please open Bluetooth and try again'
            });
          }
        });

        // 上面的代码已经完成二维码扫描 开始扫描蓝牙设备
        // 有一个问题 第一次调用会扫描不出来任何设备 ----> 还没找到解决方法
        // 扫描三次以后能找到ShanghaiTech设备 ----> 还没找到解决方法
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: false,
          success : function(res) {
            wx.getBluetoothDevices({
              success: function(res) {
                if (res.devices.length <= 0) {
                  //没有搜索到任何设备--提示
                  wx.showModal({
                    content: 'No device found, please try later.'
                  });
                }
                else {
                  // 遍历搜索到的设备
                  var deviceFound=false;
                  for(var i=0; i < res.devices.length; i++) {
                    // 打印搜索到的设备名
                    console.log(res.devices[i].name);
                    if (res.devices[i].name == that.data.deviceName) {
                      //找到了
                      deviceFound=true;
                      // 刷新deviceId
                      that.setData({
                        deviceId: res.devices[i].deviceId
                      });
                      break;
                    }
                  }

                  if (deviceFound) {
                    // 查找到设备 执行连接程序
                    wx.createBLEConnection({
                      deviceId: that.data.deviceId,
                      success: function(res) {
                        wx.showModal({
                          content: 'connected'
                        });
                      }
                    });
                  }
                  else wx.showModal({
                    content: 'Failed to find device ' + that.data.deviceName
                  });
                }
              },
            })
          }
        });
      }
    })
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

  }


})