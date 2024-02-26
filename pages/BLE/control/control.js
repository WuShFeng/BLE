Page({
  data: {
    read: "1",
    wirte: "",
    notify: "11",
    deviceId: "",
    serviceId: "",
    receive: [],
    isReceiveHex: false,
    isInput: false,
    send: ""
  },
  onLoad(e) {
    this.onBLECharacteristicValueChange();
    this.getBLEDeviceCharacteristics(e);
    this.setData(e)
  },
  getBLEDeviceCharacteristics({
    deviceId,
    serviceId
  }) {
    wx.getBLEDeviceCharacteristics({
      deviceId,
      serviceId,
      success: (res) => {
        let characteristics = []
        for (let i = 0; i < res.characteristics.length; i++) {
          let item = res.characteristics[i]
          characteristics.push(item);
          if (item.properties.read) {
            wx.readBLECharacteristicValue({
              characteristicId: item.uuid,
              deviceId,
              serviceId,
              success: () => {
                this.setData({
                  read: item.uuid
                })
              }
            })
          }
          if (item.properties.write) {
            wx.writeBLECharacteristicValue({
              characteristicId: item.uuid,
              deviceId,
              serviceId,
              value: new ArrayBuffer(1),
              success: () => {
                this.setData({
                  write: item.uuid
                })
              }
            })
          }
          if (item.properties.notify || item.properties.indicate) {
            wx.notifyBLECharacteristicValueChange({
              deviceId,
              serviceId,
              characteristicId: item.uuid,
              state: true,
              success: () => {
                this.setData({
                  notify: item.uuid
                })
              }
            })
          }
        }
        this.setData({
          characteristics
        })
      },
      fail: getApp().fail
    })
  },
  onChangeReceive(e) {
    this.setData({
      isReceiveHex: e.detail.value
    })
  },
  onBLECharacteristicValueChange() {
    wx.onBLECharacteristicValueChange(({
      value
    }) => {
      let receive = this.data.receive;
      receive.push({
        time: new Date().toTimeString().substring(0, 8),
        str: getApp().ab2str(value),
        hex: getApp().ab2hex(value)
      })
      this.setData({
        receive
      })
    })
  },
  onInput(e) {
    this.setData({
      send: e.detail.value
    })
  },
  onChangeSend(e) {
    this.setData({
      isInput: e.detail.value
    })
  },
  sendString(message) {
    let array = getApp().str2ab(message);
    wx.writeBLECharacteristicValue({
      characteristicId: this.data.write,
      deviceId: this.data.deviceId,
      serviceId: this.data.serviceId,
      value: array,
      fail: getApp().fail
    })
  },
  onTapCommand(e) {
    this.sendString(e.currentTarget.dataset.cmd)
  }
})