App({
  fail:(res)=>{
    console.log(res);
    wx.showToast({
      title: res.errMsg,
      icon:"none",
      mask:true
    })
  },
  Toast:(message)=>{
    wx.showToast({
      title: message,
      icon:"none",
      mask:true
    })
  },
  ab2hex(buffer) {
    let hexArr = Array.prototype.map.call(
      new Uint8Array(buffer),
      function(bit) {
        return ('00' + bit.toString(16)).slice(-2)
      }
    )
    return hexArr.join(' ');
  },
  ab2str(buffer) {
    buffer=new Uint8Array(buffer);
    let res="";
    for(let i=0;i<buffer.length;i++){
      res+=String.fromCharCode(buffer[i])
    }
    console.log(buffer,buffer[0]);
    return res;
  },
   str2ab(str) {
    let val = ""
    for (let i = 0; i < str.length; i++) {
      if (val === '') {
        val = str.charCodeAt(i).toString(16)
      } else {
        val += ',' + str.charCodeAt(i).toString(16)
      }
    }
    return new Uint8Array(val.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    })).buffer
  },
})
