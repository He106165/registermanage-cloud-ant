<template>
  <div class="main">
    <a-form
      id="formLogin"
      class="user-layout-login"
      ref="formLogin"
      :form="form"
      @submit="handleSubmit"
    >

          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="errorMsg" />
          <a-form-item>
            <a-input
              size="large"
              type="text"
              placeholder="用户名"
              v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入用户名' },], validateTrigger: 'change'}
              ]"
            >
              <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
            </a-input>
          </a-form-item>
          <a-form-item >
            <a-select placeholder="清选择证书" v-model="chooseCert">
              <a-select-option :value="''">清选择证书</a-select-option>
              <a-select-option v-for="(d, index) in certMap" :key="index" :value="d">{{ d }}</a-select-option>
            </a-select>
          </a-form-item>
              <!--size="large"-->
              <!--type="password"-->
              <!--autocomplete="false"-->
              <!--placeholder="密码"-->
              <!--v-decorator="[-->
                <!--'password',-->
                <!--{ rules: [{ required: true, message: '请输入密码' }], validateTrigger: 'blur'}-->
              <!--]"-->
            <!--&gt;-->
              <!--<a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>-->
            <!--</a-input>-->
          <!--</a-form-item>-->
      <a-form-item style="margin-top:24px">
        <a-button
          size="large"
          type="primary"
          htmlType="submit"
          class="login-button"
          :loading="state.loginBtn"
          :disabled="state.loginBtn"
        >确定</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import TwoStepCaptcha from '@/components/tools/TwoStepCaptcha'
import { mapActions } from 'vuex'
import { timeFix } from '@/utils/util'
import { CAVerifyLogin } from '@/api/login'
// ca 登陆用到的
const iss = '*'
let uuid = null
let websocket
let user
export default {
  components: {
    TwoStepCaptcha
  },
  data () {
    return {
      codesrc: null,
      randomStr: null,
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      errorMsg: '',
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,
      form: this.$form.createForm(this),
      state: {
        time: 60,
        loginBtn: false,
        // login type: 0 email, 1 username, 2 telephone
        loginType: 0,
        smsSendBtn: false
      },
      certMap: {},
      wsUri: 'ws://127.0.0.1:7082',
      data: null,
      connected: false,
      fn: null,
      chooseCert: null,
      signed: null,
    }
  },
  created () {
    if (this.isIE()) {
      this.certMap = this.getCertList()
    } else {
      this.OnGetCertList()
    }
    uuid = this.GetUUID()
  },
  methods: {
    ...mapActions(['Login', 'Logout', 'CaAdminLogin']),
    handleTabClick (key) {
      this.customActiveKey = key
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'captcha'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        const that = this
        if (!err) {
          try {
            user = values
            that.Login()
          } catch (e) {
            console.info(e)
            alert('登录异常')
          }
        } else {
          setTimeout(() => {
            state.loginBtn = false
          }, 600)
        }
      })
    },
    loginSuccess (res) {
      if (res.code === 0) {
        this.$router.push({ path: 'systemNav' }, () => {
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`
          })
        })
        this.isLoginError = false
      } else {
        this.requestFailed(res)
      }
    },
    isIE () {
      return 'ActiveXObject' in window
    },
    getCertList () {
      this.CreateCtrl()
      const sign = document.getElementById('SignCtrl')
      const r = sign.GetCertList(iss)
      if (r === '') {
        alert('获取证书列表失败')
      } else {
        return r.split('||')
      }
    },
    CreateCtrl () {
      const signId = 'SignCtrl'
      const signClassId = 'CLSID:4F8F009A-5276-4341-A9A0-971E0AFCE2B6'
      const obj = document.createElement('object')
      obj.classid = signClassId
      obj.id = signId
      obj.width = '1'
      obj.height = '1'
      document.body.appendChild(obj)
    },
    OnGetCertList () {
      const fn = 'GetCertList'
      const data = "{\"fn\":\"" + fn + "\",\"iss\":\"" + iss + "\"}";
      this.SendMessage(fn,data);
    },
    Login () {
      try {
        const SignCtrl = document.getElementById('SignCtrl')
        const cn = this.chooseCert
        const fn = 'GetSignData'
        const data = "{\"fn\":\"" + fn + "\",\"cn\":\"" + cn
          + "\",\"data\":\"" + uuid + "\"}"
        let result = null
        if (this.isIE()) {
          result = SignCtrl.GetSignData(cn, uuid)
          if (result === '') {
            alert('签名失败')
          } else {
            CAVerifyLogin(result).then(res => {
              if (res.code <= 0) {
                this.$message.error(res.msg)
                return false
              }
            })
          }
        } else {
          this.SendMessage(fn, data)
        }
      } catch (e) {
        alert('登录异常')
      }
      return true
    },
    OnRecv (fn, result) {
      const {
        CaAdminLogin,
        state
      } = this
      if (fn === 'GetCert') {
        //
      } else if (fn === 'GetCertList') {
        const code = result.substr(0, 1)
        if (code === '1') {
          const certList = result.substr(1)
          this.certMap = certList.split('||')
        } else {
          alert('取证书列表失败!')
        }
      } else if (fn === 'GetSignData') {
        const code = result.substr(0, 1)
        if (code === '1') {
          CAVerifyLogin(result.substr(1)).then(res => {
            console.info(res)
            if (res.code < 0) {
              this.$message.error(res.msg)
              return false
            } else {
              console.info(user)
              console.info('验证已经通过可以执行登陆方法了')
              CaAdminLogin(user)
                .then((res) => this.loginSuccess(res))
                .catch(err => this.requestFailed(err))
                .finally(() => {
                  state.loginBtn = false
                })
            }
          })
        } else {
          alert('取签名失败！')
        }
      }
    },
    onOpen (evt) {
      this.doSend(this.data)
    },
    onMessage (evt) {
      this.OnRecv(this.fn, evt.data)
    },
    onError (evt) {
      alert('连接错误！')
    },
    onClose (evt) {
      alert('连接断开了')
    },
    doSend (message) {
      websocket.send(message)
    },
    SendMessage (fn_, data_) {
      this.fn = fn_
      this.data = data_
      const that = this
      if (this.connected) {
        websocket.send(this.data)
      } else {
        websocket = new WebSocket(this.wsUri)
        websocket.onopen = function (evt) {
          this.connected = true
          that.onOpen(evt.data)
        }
      }
      websocket.onmessage = function (evt) {
        that.onMessage(evt)
      }
      websocket.onerror = function (evt) {
        that.onError(evt)
      }
    },
    GetUUID () {
      const s = []
      const hexDigits = '0123456789abcdef'
      for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
      }
      s[14] = '4'
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1)
      s[8] = s[13] = s[18] = s[23] = '-'
      this.uuidA = s.join('')
      console.log(s.join(''), 's.join("")')
      return this.uuidA
    }
  }
}
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
