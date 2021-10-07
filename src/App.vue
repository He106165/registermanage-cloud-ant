<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view v-if="isRouterAlive"/>
    </div>
  </a-locale-provider>
</template>

<script>
// import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { AppDeviceEnquire } from '@/utils/mixin'
// 引用cdn还可以这么写
import { locales } from 'ant-design-vue'
const zhCN = locales.zh_CN

export default {
  mixins: [AppDeviceEnquire],
  provide () {
    return {
      reload: this.reload
    }
  },
  data () {
    return {
      locale: zhCN,
      isRouterAlive: true
    }
  },
  mounted () {

  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function () {
        this.isRouterAlive = true
      })
    }
  }
}
</script>
<style>
  #app {
    height: 100%;
  }
</style>
