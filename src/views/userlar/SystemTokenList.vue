<template>
  <a-card :bordered="true">
    <a-form :data="form">
      <a-form-item >
        <a-input v-decorator="['id']" hidden/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
        <a-input placeholder="名称" v-model="form.systemName"   disabled  />
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="有效时间">
        <a-input-number placeholder="有效时间" v-model="form.time"/>(min)
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="描述">
        <a-textarea placeholder="描述" v-model="form.descript"/>
      </a-form-item>
      <span class="table-page-search-submitButtons" >
        <a-button type="primary" @click="handleSubmit" style="display:block;margin:0 auto">修改</a-button>
      </span>
    </a-form>
  </a-card>
</template>

<script>
import { getSystemToken, saveSystemToken } from '@/api/userlar/token'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
export default {
  name: 'TableList',
  components: {
    ATextarea
  },
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 5 },
        sm: { span: 10 }
      },
      visible: false,
      confirmLoading: false,
      mdl: {},
      form: {}
    }
  },
  filters: {
  },
  created () {
    this.loadData()
  },
  methods: {
    loadData () {
      const data = getSystemToken()
      Promise.all([data]).then((d) => {
        this.form = d[0]
      })
      // this.form.length
      // this.mdl = Object.assign(this.form)
      // console.info(this.mdl)
      // this.visible = true
      // this.$nextTick(() => {
      //   this.form.setFieldsValue(pick(this.mdl, 'id' , 'systemName' , 'time', 'descript'))
      // })
    },
    handleEdit (record) {
      this.edit(record)
    },
    add () {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id' , 'systemName' , 'time', 'descript'))
      })
    },
    handleSubmit (e) {
      saveSystemToken(this.form).then(res => {
        if (res.code === 0) {
          this.$message.success('保存成功')
          this.$emit('ok')
          this.visible = false
        } else {
          this.$message.success(res.msg)
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      }).finally(() => {
        this.confirmLoading = false
      })
    }
  },
  watch: {
    /*
      'selectedRows': function (selectedRows) {
        this.needTotalList = this.needTotalList.map(item => {
          return {
            ...item,
            total: selectedRows.reduce( (sum, val) => {
              return sum + val[item.dataIndex]
            }, 0)
          }
        })
      }
      */
  }
}
</script>
