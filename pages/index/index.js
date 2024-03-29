Page({
  data: {
    available: false,
    discovering: false,
    devices: []
  },
  _deviceIds: [],
  onLoad: function (options) {
    this.onBluetoothAdapterStateChange();
    this.onBluetoothDeviceFound();
  },
  onBluetoothAdapterStateChange() {
    wx.onBluetoothAdapterStateChange(({
      available,
      discovering
    }) => {
      this.setData({
        available,
        discovering
      })
    })
  },
  onBluetoothDeviceFound() {
    wx.onBluetoothDeviceFound(({
      devices
    }) => {
      let device = devices[0];
      if (!device.connectable) return;
      let _devices = this.data.devices;
      let deviceIdx = this._deviceIds.indexOf(device.deviceId);
      if (deviceIdx < 0) {
        this._deviceIds.push(device.deviceId);
        _devices.push(device);
      } else {
        _devices.splice(deviceIdx, 1, device);
      }
      this.setData({
        devices: _devices
      })
    })
  },
  onTapDiscover() {
    if (this.data.discovering) {
      wx.stopBluetoothDevicesDiscovery();
    } else {
      this.setData({
        devices: []
      })
      this._deviceIds = []
      if (this.data.available) {
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: true
        })
      } else {
        this.openBluetoothAdapter();
      }
    }
  },
  openBluetoothAdapter() {
    wx.openBluetoothAdapter({
      success: () => {
        wx.startBluetoothDevicesDiscovery({
          allowDuplicatesKey: true
        })
      },
      fail: getApp().fail
    })
  },
  onTapDevice(e){
    let deviceId=e.currentTarget.dataset.deviceid
    wx.showModal({
      title: 'Connected or not',
      content: deviceId,
      success (res) {
        if (res.confirm) {
          getApp().Toast("connecting");
          wx.createBLEConnection({
            deviceId,
            success:()=>{
              wx.stopBluetoothDevicesDiscovery();
              wx.navigateTo({
                url: `/pages/BLE/Services/Services?deviceId=${deviceId}`
              })
            }
          })
        }
      }
    })
  }
})