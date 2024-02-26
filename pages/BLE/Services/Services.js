Page({
  data: {
    services: []
  },
  onLoad({
    deviceId
  }) {
    this.setData({
      deviceId
    })
    wx.getBLEDeviceServices({
      deviceId,
      success: (res) => {
        let services = []
        for (let i = 0; i < res.services.length; i++) {
          if (res.services[i].isPrimary) {
            services.push(res.services[i].uuid);
          }
        }
        this.setData({
          services
        });
      }
    })
  },
  onUnload() {
    wx.closeBLEConnection({
      deviceId: this.data.deviceId
    })
  },
  onTapService(e) {
    let serviceId = e.currentTarget.dataset.serviceid;
    wx.navigateTo({
      url: `/pages/BLE/control/control?deviceId=${this.data.deviceId}&serviceId=${serviceId}`,
    })
  }
})