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
        <a-input v-decorator="['roleId']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色名">
        <a-input placeholder="角色名" v-decorator="['roleName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="角色权限字符串">
        <a-input placeholder="角色权限字符串" v-decorator="['roleKey']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="显示顺序">
        <a-input placeholder="显示顺序" v-decorator="['sort']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-input placeholder="备注" v-decorator="['remark']"/>
      </a-form-item>
        <a-form-item
          :labelCol="labelCol"
          :wrapperCol="wrapperCol"
          label="应用系统"
          hasFeedback
        >
          <a-select
            style="width: 100%"
            mode="multiple"
            v-decorator="['systemList', {rules: [{ required: true, message: '请选择应用系统' }]}]"
            :allowClear="true"
          >
          <a-select-option  v-for="item in systemDataList" :key="item.insideSystemId" :value="item.insideSystemId">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveInsideRoleSystemConfig } from '@/api/backmanage/insiderole'
import { getSystemList } from '@/api/backmanage/insidesystem'
import pick from 'lodash.pick'
export default {
  name: 'InsideRoleModal',
  props: {
  },
  components: {
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
      form: this.$form.createForm(this),
      systemDataList: {}
    }
  },
  beforeCreate () {
  },
  created () {
    this.filteredOptions()
  },
  methods: {
    filteredOptions () {
      // 查找系统集合
      const systemList = getSystemList()
      Promise.all([systemList]).then((d) => {
        this.systemDataList = d[0]
      })
    },
    add () {
      this.form.resetFields()
      this.edit({ roleId: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'roleId','roleName','roleKey','sort','roleStatus','remark','createTime','createBy','updateTime','updateBy','version','delFlag','systemList'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          values.systemList = values.systemList.toString()
          saveInsideRoleSystemConfig(values).then(res => {
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
