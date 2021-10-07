<template>
    <div>
        <!--<a-button @click='tiaozhuan()'>点击跳转4</a-button>-->
    </div>

</template>

<script>
import Vue from 'vue'
import { ACCESS_TOKEN } from '@/store/mutation-types'

var url = 'ws://127.0.0.1:7082'
var connected = false
var fn = ''
var data = ''
var ws
export default {
  data() {
    return {
      // 跳转地址带过来 unionid
      token: ''

    }
  },
  created () {
    this.token = this.$route.query.Access_Token
    this.tianjia()
  },
  methods: {
    isIE () {
      return ('ActiveXObject' in window)
    },
    CreateCtrl () {
      var vpnId = 'VpnCtrl'
      var vpnClassId = 'CLSID:8FE6FBCE-5606-40F4-8516-DCA01C30508C'

      var obj = document.createElement('object')
      obj.classid = vpnClassId
      obj.id = vpnId
      obj.width = 1
      obj.height = 1
      document.body.appendChild(obj)
    },
    logout () {
      if (this.isIE()) {
        this.CreateCtrl()

        var Vpn = document.getElementById('VpnCtrl')
        Vpn.Connect()

        var Type = 'ExitVpn'
        var Value = ' '
        var ret = Vpn.SendMessage(Type, Value)
      } else {
        var fn_ = 'Connect'
        var data = '{"fn":"' + fn_ + '"}'
        this.SendMessage(fn_, data)
      }
    },
    onsend() {
      try {
        if (data !== '') {
          ws.send(data)
          data = ''
        }
      } catch (e) {
      }
    },
    onopen (evt) {
      // Web Socket is connected
      connected = true
      this.setTimeout('onsend()', 100)
    },
    onmessage (evt) {
      if (fn !== '') {
        var fn_ = fn
        fn = ''
        this.OnRecv(fn_, evt.data)
      } else {
        console.log('1111')
      }
    },
    onclose (evt) {
      if (!connected) {
      }

      // websocket is closed.
      connected = false
    },
    SendMessage (fn_, data_) {
      if (connected) {
        fn = fn_
        ws.send(data_)
      } else {
        fn = fn_
        data = data_

        ws = new WebSocket(url)
        ws.onopen = this.onopen
        ws.onmessage = onmessage
        ws.onclose = onclose
      }
    },
    OnRecv (fn, result) {
      if (fn === 'Connect') {
        var fn_ = 'SendMessage'
        var Type = 'ExitVpn'
        var Value = ' '

        var data = '{"fn":"' + fn_ + '","type":"' + Type + '","value":"' + Value + '"}'
        this.SendMessage(fn_, data)
      }
    },
    tianjia() {
      if (this.token == null && this.token === '') {
        this.$router.push('http://192.168.2.237/unified.jsp')
      } else {
        Vue.ls.set(ACCESS_TOKEN, this.token, 12 * 60 * 60 * 1000)
        this.$router.push('/')
      }
    }
  }

}
</script>
