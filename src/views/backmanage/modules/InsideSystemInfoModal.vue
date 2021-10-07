<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
    @ok="handleSubmit"
  >
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['insideSystemId']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统名称">
        <a-input placeholder="系统名称" v-decorator="['name']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="域名">
        <a-input placeholder="域名" v-decorator="['realmPlace']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="免登录地址">
        <a-input placeholder="免登录地址" v-decorator="['returnUrl']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图标">
        <a-input placeholder="图标" v-decorator="['icon']"/>
      </a-form-item>
<!--      <a-form-item-->
<!--        :labelCol="labelCol"-->
<!--        :wrapperCol="wrapperCol"-->
<!--        label="图标"-->
<!--      >-->
<!--        <a-input v-decorator="['icon',{rules: [{ required: true, message: '请选择图标' }]}]" ref="iconInput" @click="iconselect()" enterButton="选择图标" placeholder="选择图标">-->
<!--          <a-icon slot="prefix" :type="icon" />-->
<!--          <a-icon slot="suffix" type="close-circle" @click="emitEmpty"/>-->
<!--        </a-input>-->
<!--      </a-form-item>-->
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-input placeholder="备注" v-decorator="['remark']"/>
      </a-form-item>
    </a-form>
    <iconSelector-modal ref="modal" @ok="setIcon" :icon="icon"/>

  </a-modal>
</template>
<script>
import { saveInsideSystemInfo } from '@/api/backmanage/insidesystem'
import IconSelectorModal from '../../system/modules/IconSelectorModal.vue'

import pick from 'lodash.pick'
export default {
  name: 'InsideSystemInfoModal',
  props: {
  },
  components: {
    IconSelectorModal
  },
  data () {
    return {
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      confirmLoading: false,
      mdl: {},
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    iconselect () {
      this.$refs.modal.show()
    },
    emitEmpty () {
      this.$refs.iconInput.focus()
      this.form.setFieldsValue({ 'icon': '' })
    },
    menuTypeChange (type) {
      this.menuType = type
    },
    setIcon (icon) {
      this.icon = icon
      this.form.setFieldsValue({ 'icon': icon })
    },
    add () {
      this.form.resetFields()
      this.edit({ insideSystemId: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'insideSystemId','joinsysCode','icon','name','realmPlace','returnUrl','status','remark','createTime','createBy','updateTime','updateBy','version','delFlag'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveInsideSystemInfo(values).then(res => {
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
