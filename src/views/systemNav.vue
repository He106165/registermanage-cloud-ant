<template>
  <el-container>
      <div class="el-header">
        <div class="content">
          <img :src="imgSrc1" />
        </div>
      </div>
    <el-container>
      <el-main class="dhfw-main">
        <div class="main-con">
          <h3>我的工作台</h3>
          <a-button  style="float: right; margin-right: 20px;margin-top: -2%"  @click="SystemOut()">退出</a-button>
          <div class="dhfw-content">
            <div>
              <ul class="list">
                <li  v-for='item in systemList'>
                  <a @click="redrictSystem(item.returnUrl)">
                    <img :src='item.icon' alt="" />
                    <h2> {{ item.name }}</h2>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </el-main>
      <div class="el-footer">
        <div class="content">
          Copyright © 2004-2020 版权所有:中国留学服务中心
        </div>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import {getUserSystemByRole, getCALoginUserInfo} from '@/api/login'
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      imgSrc1: require('../../public/images/logo1.png'),
      ArrImg: [
        {
          icon: require('../../public/skipSystem/icon1.png'),
          name: '互联网+政务服务平台',
          returnUrl: 'https://baidu.com'
        },
        {
          icon: require('../../public/skipSystem/icon2.png'),
          name: '平安留学培训服务平台',
          returnUrl: 'http://192.168.7.30:8080/qcloud/edu/unified/login'
        },
        {
          icon: require('../../public/skipSystem/icon3.png'),
          name: '互联网+社会化服务平台',
          returnUrl: 'https://baidu.com'
        },
        {
          icon: require('../../public/skipSystem/icon3.png'),
          name: '活动系统',
          returnUrl: 'http://www.iptv-soft.com:12686/imscp/admin/room/third/login.do?appid=ppf4np45furr6p96'
        },
        {
          icon: require('../../public/skipSystem/icon4.png'),
          name: '国际化留学人才双选云招聘系统',
          returnUrl: 'http://lxfzxtest.cscse.edu.cn/manageApi/home/callback'
        },
        {
          icon: require('../../public/skipSystem/icon4.png'),
          name: '统一用户注册系统',
          returnUrl: '/weclome'
        }
      ],
      systemList: {}
    }
  },
  components: {},
  computed: {},
  created() {
    this.systemInit()
  },
  methods: {
    ...mapActions(['Logout']),
    systemInit(key) {
      getUserSystemByRole().then(res => {
        if (res != null && res !== '') {
          console.info(res)
          this.systemList = res
        } else {
          this.systemList = this.ArrImg
        }
      })
    },
    redrictSystem (url) {
      // 如果不是跳转注册系统  就需要带着个人信息跳转
      if (url === '/weclome') {
        window.location.href = url
      } else {
        // 查询当前登陆人信息
        getCALoginUserInfo().then((res) => {
          console.info(JSON.stringify(res))
          const data = encodeURI(JSON.stringify(res))
          // 推送当前登录人信息到业务系统中
          const form = document.createElement('form')
          form.action = url
          form.target = '_blank'
          form.method = 'post'
          form.style.display = 'none'
          const opt = document.createElement('input')
          opt.name = 'data'
          opt.value = data
          form.appendChild(opt)
          document.body.appendChild(form)
          // 提交数据
          form.submit()
        })
      }
    },
    SystemOut () {
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk: () => {
          return this.Logout({}).then(() => {
            setTimeout(() => {
              window.location.reload()
            }, 16)
          }).catch(err => {
            this.$message.error({
              title: '错误',
              description: err.message
            })
          })
        },
        onCancel () {
        }
      })
    }
  }

}
</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
  height: 100%;
  min-height: 100%;
  background-color: #f5f5fa;
}
.el-header {
  background: #2774b5;
  height: 60px;
  width: 100%;

}
.el-header .content {
  width: 1001px;
  margin: 0 auto;
  text-align: left;
}

.el-footer {
  color: #333;
  font-size: 14px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  padding: 0;
  background: #fff;
  margin-top: 10px;
}
</style>
  <style>
  ol, ul, li {
    list-style: none;
  }
.dhfw-main {
  background-color: #f5f5f5;
  color: #333;
  text-align: center;
  height: calc(100vh - 120px);
  min-height: calc(100vh - 120px);
}
.dhfw-main .main-con {
  width: 1001px;
  margin: 0 auto;
  background: #fff;
  box-shadow: 2px 0px 12px #f6f6f6;
  height: 81%;
  padding-top: 20px;
  margin-top: 10px;
}
.dhfw-main .main-con h3 {
  text-align: left;
  margin: 0;
  border-left: 3px solid #2774b5;
  padding-left: 10px;
}
.dhfw-main .dhfw-content {
  width: 100%;
  height: 60%;
  display: table;
}
.dhfw-main .dhfw-content > div{
  display: table-cell;
  vertical-align: middle;
}
.list{
  width: 76%;
  height: 140px;
  margin: 0 auto;
  padding: 0;
}
.list li{
  width: 238px;
  height: 136px;
  float: left;
  display: table;
  border: 1px solid rgb(238, 238, 238);
  border-radius: 10px;
  margin-top: 20px;
  background: rgb(255, 255, 255);
  box-shadow: 0px 5px 8px 0px rgba(4, 46, 117, 0.05);
}
.list li:hover, .list li.listhover{
  border: 1px solid rgb(21, 105, 200);
  background: rgb(21, 105, 200);
  box-shadow: 0px 5px 8px 0px rgba(4, 46, 117, 0.05);
}
.list li:hover a h2, .list li.listhover a h2{
  color: #fff;
}
.list li:nth-child(2),.list li:nth-child(5){
  margin: 20px 20px 0;
}
.list li a{
  display: table-cell;
  vertical-align: middle;
}
.list li a h2{
  color: #666;
  font-weight: normal;
  font-size: 16px;
  text-align:center;
  padding: 0;
  margin: 0;
  padding-bottom: 15px;
}

</style>