Page({
	data: {
		deviceName: '',
		deviceId: '',
		serviceId: '',
		characteristicId: '',
		connected: false
	},

	onLoad: function() {
		let that=this;
		//获取连接设备名
		wx.scanCode({
		  onlyFromCamera: true,
		  scanType: 'qrCode',

		  success: function(res) {
			  // 更新deviceName
			  that.setData({
				  deviceName: res.result
			  });
			  console.log(res.result)
			  //已经获取了deviceName

			  //初始化蓝牙模块
			  wx.openBluetoothAdapter({
				success: function(res) {
					//初始化蓝牙模块成功过后 搜索附近的外围设备
					wx.startBluetoothDevicesDiscovery({
					  allowDuplicatesKey: false,
					  interval: 30,
					  //在搜索到的附近设备中寻找待连接设备
					  success:function(res) {
						wx.onBluetoothDeviceFound(function(res) {
							if(res.devices[0].name == that.data.deviceName) {
								// 根据获取的deviceId 获取服务和特征值的Id
								that.setData({
									deviceId: res.devices[0].deviceId
								});
								// 连接设备
								wx.createBLEConnection({
								  deviceId: that.data.deviceId,
								  success:function(res) { 
									//连接成功
									//获取服务与特征ID
									wx.getBLEDeviceServices({
									  deviceId: that.data.deviceId,
									  success: function(res) {
										  that.setData({
											  serviceId: res.services[0].uuid
										  })
										  wx.getBLEDeviceCharacteristics({
											deviceId: that.data.deviceId,
											serviceId: that.data.serviceId,
											success:function(res) {
												that.setData({
													characteristicId: res.characteristics[0].uuid
												})
												//停止发现
												wx.stopBluetoothDevicesDiscovery({
													success: (res) => {
														wx.showModal({
														  content: 'connected'
														})
														that.setData({
															connected: true
														})
													 },
												})
											}
										  })
									  }
									})
								  }
								});							
							}
						})
					  }
					})	
				}
			  })

		  }
		})
	},

	onUnload:function() {
		let that=this;
		wx.closeBLEConnection({
		  deviceId: that.data.deviceId,
		})
	},

	transmission:function() {
		let that=this;
		let buffer = new ArrayBuffer(1)
		let dataView = new DataView(buffer)
		dataView.setUint8(0, 0)

		wx.writeBLECharacteristicValue({
		// 这里的 deviceId 需要在 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取
		deviceId: that.data.deviceId,
		// 这里的 serviceId 需要在 getBLEDeviceServices 接口中获取
		serviceId: that.data.serviceId,
		// 这里的 characteristicId 需要在 getBLEDeviceCharacteristics 接口中获取
		characteristicId: that.data.characteristicId,
		// 这里的value是ArrayBuffer类型
		value: buffer,
		success (res) {
			console.log('writeBLECharacteristicValue success', res.errMsg)
		}
		})
	}
})