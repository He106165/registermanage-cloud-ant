<template>
  <div id="htlogin">
    <!--头部-->
    <div class="header">
      <img :src="imgSrc" class="img"/>
      <!-- <div class="img"></div> -->
      <div class="text">
        <p>教育部留学服务中心</p>
        <p>统一用户身份认证系统</p>
      </div>
    </div>
    <!--中间-->
    <div class="content-wrapper">
      <!--密码登录-->
      <div class="login-form">
        <div>
          <span>欢迎您登录!</span>
          <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="errorMsg" />
          <a-form
            class="demo-form-inline"
            ref="formLogin"
            :role="rules"
            :form="form"
            @submit="handleSubmit">
            <div class="item">
              <div class="bg1"></div>
              <a-form-item>
                <a-input
                  autocomplete="off"
                  class="input-user"
                  placeholder="请输入用户名"
                  v-decorator="[
                'username',
                {rules: [{ required: true, message: '请输入用户名' },], validateTrigger: 'change'}
              ]">
                </a-input>
              </a-form-item>
            </div>
            <div class="item">
              <div class="bg2"></div>
              <a-form-item>
                <a-select  v-model="chooseCert" class="input-pass"  >
                  <a-select-option :value="''" checked>请选择证书</a-select-option>
                  <a-select-option v-for="(d, index) in certMap" :key="index" :value="d">{{ d }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
            <a-button
              type="primary"
              htmlType="submit"
              :loading="state.loginBtn"
              :disabled="state.loginBtn"
            >
              <span>登 录</span>
            </a-button>
            <!--              <a-checkbox v-model="checked">记住密码</a-checkbox>-->
          </a-form>
          <ul class="login-list">
            <li>
              <img src="../../../public/images/l1.png" alt="" />
              <p>软证书使用手册及常见问题?</p>
            </li>
            <li>
              <img src="../../../public/images/l2.png" alt="" />
              <p>管理工具及驱动下载</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!--版权信息-->
    <div class="footer">
      <div class="left"></div>
      <div class="right">
        <p>
          <a href="#">关于我们</a>
          <a href="#">联系我们</a>
          <a href="#">服务网络</a>
          <a href="#">法律声明</a>
          <a href="#">网站地图</a>
          <a href="#">标识系统</a>
        </p>
        <p>
          <span>中国留学服务中心版权所有     1996-2016   电话：86-010-62677000</span>
        </p>
        <p>
          <span>北京市海淀区四环路西路56号  辉煌时代大厦6层  京ICP备05061711号-1  京公网专备：110102430085号</span>
        </p>
      </div>
    </div>
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
const isCAVerify = 0
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
      chooseCert: '',
      signed: null,
      imgSrc: require("../../../public/lf_logo.png"),

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
    ...mapActions(['Login', 'Logout', 'CaUserLogin']),
    handleTabClick (key) {
      this.customActiveKey = key
    },
    handleSubmit (e) {
      e.preventDefault()
      const {
        form: { validateFields },
        state,
        customActiveKey,
        CaUserLogin
      } = this

      state.loginBtn = true

      const validateFieldsKey = customActiveKey === 'tab1' ? ['username', 'password', 'captcha'] : ['mobile', 'captcha']

      validateFields(validateFieldsKey, { force: true }, (err, values) => {
        const that = this
        if (!err) {
          try {
            user = values
            // 跳过证书验证
            if (isCAVerify === 0) {
              const loginParams = { ...values }
              // loginParams.username = 'fcenter'
              loginParams.username = values.username
              CaUserLogin(loginParams)
                .then((res) => this.loginSuccess(res))
                .catch(err => this.requestFailed(err))
                .finally(() => {
                  state.loginBtn = false
                })
            } else {
              that.Login()
            }
          } catch (e) {
            console.info(e)
            alert('登录异常')
            setTimeout(() => {
              state.loginBtn = false
            }, 600)
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
      const {
        CaUserLogin,
        state
      } = this
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
              if (res.code < 0) {
                this.$message.error(res.msg)
                return false
              } else {
                user.username = this.chooseCert
                CaUserLogin(user)
                  .then((res) => this.loginSuccess(res))
                  .catch(err => this.requestFailed(err))
                  .finally(() => {
                    state.loginBtn = false
                  })
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
        CaUserLogin,
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
              CaUserLogin(user)
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
      // alert('连接错误！')
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
    },
    // 开发阶段为了跳过证书验证
    JumpVaLogin () {
      const {
        CaUserLogin,
        state
      } = this
      CAVerifyLogin().then(res => {
        console.info(res)
        if (res.code < 0) {
          this.$message.error(res.msg)
          return false
        } else {
          console.info(user)
          console.info('验证已经通过可以执行登陆方法了')
          CaUserLogin(user)
            .then((res) => this.loginSuccess(res))
            .catch(err => this.requestFailed(err))
            .finally(() => {
              state.loginBtn = false
            })
        }
      })
    },
    requestFailed (err) {
      // 这里关闭了巨丑的的登陆提示框，选择下面的
      // this.isLoginError = true
      this.errorMsg = ((err.response || {}).data || {}).msg || err.msg || '请求出现错误，请稍后再试'
      this.$notification['error']({
        message: '错误',
        description: this.errorMsg,
        duration: 4
      })
    }
  }
}
</script>

<style lang="scss" scped>
#htlogin{
  p{
    margin: 0;
    padding: 0;
  }
  ul,li{
    list-style: none;
  }
  width: 100%;
  // height: 100%;
  .header{
    width: 100%;
    height: 120px;
    padding:0 434px;
    display: flex;
    align-items: center;
    .text{
      height: 64px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 29px;
      font-size: 22px;
      color: #0c3581;
      p:nth-child(2){
        font-size: 24px;
        span{
          color: #dc5b2f;
        }
      }
    }
  }
  .content-wrapper{
    width: 100%;
    height: 600px;
    background: url('../../../public/login-bg.png')  center;
    background-size: cover;
    position: relative;
    .login-form{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      width: 396px;
      height: 396px;
      padding: 55px 55px;
      // background: #eee;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      >div{
        text-align: center;
      }
      span{
        font-size: 22px;
        color: #1a4a6d;
      }
      .demo-form-inline{
        margin-top: 38px;
      }
      .item{
        display: flex;
        width: 284px;
        height: 38px;
        background-color: #ffffff;
        border-radius: 4px;
        border: solid 1px #0669a8;
        &:nth-child(2){
          margin-top: 16px;
        }
        .bg1{
          width: 38px;
          height: 38px;
          background: url('../../../public/user.png');
        }
        .bg2{
          width: 38px;
          height: 38px;
          background: url('../../../public/pwd.png');
        }
        .input-user{
          height: 100%;
          border: none;
          &::placeholder{
            color: #1a4a6d;
          }
        }
        .ant-form-item{
          width: 100%;
          height: 100%;
          margin: 0;
          .ant-form-item-control-wrapper{
            height: 100%;
            .ant-form-item-control{
              height: 100%;
              .ant-select-selection{
                height: 100%;
                border: none;
                .ant-select-selection__rendered{
                  height: 100%;
                  .ant-select-selection-selected-value{
                    height: 100%;
                    color: #1a4a6d;
                    line-height: 34px;
                  }
                }
              }
            }
          }
        }
        .ant-form-item-control{
          line-height: normal;
        }
      }
      .ant-btn-primary{
        width: 285px;
        height: 40px;
        margin-top: 16px;
        line-height: 40px;
        background-color: #2774b5;
        border-radius: 4px;
        >span{
          font-size: 18px;
          color: #fff;

        }
      }
      .login-list{
        margin-top: 55px;
        >li{
          display: flex;
          &:nth-child(2){
            margin-top: 9px;
          }
          >img{
            width: 19px;
            height: 19px;
          }
          >p{
            margin-left: 10px;
          }
        }
      }

    }
  }

  .footer{
    position: absolute;
    width: 100%;
    height: calc(100% - 720px);
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .left{
      width: 42px;
      height: 51px;
      background: url('../../../public/pic.png');
    }
    .right{
      margin-left: 36px;
      p{
        font-size: 14px;
        color: #666;
        a{
          color: #666;
          padding-right: 7px;
          border-right: 1px solid #666;
          margin-right: 5px;
          &:last-child{
            border: none;
          }
        }
      }
    }
  }
}
</style>