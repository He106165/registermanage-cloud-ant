var wsUri = 'ws://127.0.0.1:7082'
var data;
var connected=false;
var websocket;
var fn;
export function OnRecv(fn, result) {
  debugger
  if(fn == "GetCert") {
    //
  } else if(fn === 'GetCertList') {
    var code = result.substr(0, 1)
    if (code === '1') {
      var certList = result.substr(1)
      this.certMap = certList.split('||')
    } else {
      alert("取证书列表失败!");
    }
  }else if(fn == "GetSignData") {
    var code = result.substr(0, 1);
    if(code == "1") {
      var sign = result.substr(1);
      alert(sign);
      loginform.signed.value=result.substr(1);
      loginform.submit();
    } else {
      alert("取签名失败！");
    }
  }
}
export function onOpen(evt) {
  doSend(data);
}
export function onMessage(evt) {
  OnRecv(fn,evt.data);
}
export function onError(evt) {
  alert("连接错误！");
}
export function onClose(evt){
  alert("连接断开了");
}
export function doSend(message) {
  websocket.send(message);
}
export function SendMessage(fn_, data_) {
  debugger;
  fn = fn_;
  data = data_;
  if (connected) {
    websocket.send(data);
  } else {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) {
      connected=true;
      onOpen(evt.data);
    }
  }
  websocket.onmessage = function(evt) {
    onMessage(evt);
  };
  websocket.onerror = function(evt) {
    onError(evt);
  };
}
