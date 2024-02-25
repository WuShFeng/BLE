App({
  fail:(res)=>{
    wx.showToast({
      title: res.errMsg,
      icon:"none"
    })
  }
})
