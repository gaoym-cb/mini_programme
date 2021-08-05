Page({
	data: {
		deviceName: ''
	},

	onLoad: function() {
		let that=this;
		// 扫码获取连接对象名
		wx.scanCode({
			onlyFromCamera: true,
			scanType: 'qrCode',
			success: function(res) {
				that.setData({
					deviceName: res.result
				});

				//成功获取连接对象名 执行连接流程
				wx.openBluetoothAdapter({
					success:function(res) {
						//打开蓝牙模块成功后 开启发现
						wx.startBluetoothDevicesDiscovery({
							allowDuplicatesKey: false,
							success:function(res) {
								wx.showLoading({
									title: '搜索设备...',
								});
								//延迟一段时间后再开始搜索
								setTimeout(function(){
									wx.getBluetoothDevices({
										success: function(res) {
											//在搜索结果中找目标设备
											for(let i = 0; i < res.devices.length; i++) {
												if (res.devices[i].name == that.data.deviceName) {
													//找到设备
													that.setData({
														deviceId: res.devices[i].deviceId
													})
													wx.hideLoading();
													wx.showLoading({
														title: '正在连接...',
													});
													// 连接函数
													that.createBleConnection();
												}
											}
										},

										// 失败
										fail:function(res) {
											wx.hideLoading();
											wx.showModal({
												content: '连接失败',
											})
										}
									})
								}, 1000);
							}
						})
					}
				})
			}
		});
	},

	onHide:function() {
		let that=this;
		if (that.data.deviceId) {
			wx.closeBLEConnection({
				deviceId: that.data.deviceId,
			});
			wx.stopBluetoothDevicesDiscovery({});
		}
	},

	createBleConnection:function() {
		let that=this;
		//找到设备后 停止搜索
		wx.stopBluetoothDevicesDiscovery({
			success: function(res) {
				console.log('停止搜索');
			},
		});

		// 发起连接
		wx.createBLEConnection({
			deviceId: that.data.deviceId,
			timeout: 1000,
			success:function(res) {
				wx.hideLoading();
				//获取服务
				wx.getBLEDeviceServices({
					deviceId: that.data.deviceId,
					success:function(res) {
						that.setData({
							service: res.services[0].uuid 
						});
						that.getCharacteristic();
						//完成连接任务后 转到send
						wx.navigateTo({
							url: '/pages/send/send',
						});
					}
				});
			}
		})
	},

	// 获取特征值
	getCharacteristic:function() {
		let that=this;
		wx.getBLEDeviceCharacteristics({
			deviceId: that.data.deviceId,
			serviceId: that.data.service,
			success:function(res) {
				that.setData({
					characteristic: res.characteristics[0].uuid
				});
			}
		});
	}

})