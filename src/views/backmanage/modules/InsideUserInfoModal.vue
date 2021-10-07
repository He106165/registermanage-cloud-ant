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
        <a-input v-decorator="['userId']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="登录账号">
        <a-input placeholder="登录账号" v-decorator="['loginName', {rules: [{required: true, message: '请输入登录账号'}]}]"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户昵称">
        <a-input placeholder="用户昵称" v-decorator="['userName', {rules: [{required: true, message: '请输入用户昵称'}]}]"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件类型">
        <a-input placeholder="证件类型" v-decorator="['cardType']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件号">
        <a-input placeholder="证件号" v-decorator="['cardNo']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户邮箱">
        <a-input placeholder="用户邮箱" v-decorator="['email']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号码">
        <a-input placeholder="手机号码" v-decorator="['phonenumber']"/>
      </a-form-item>
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统角色">-->
        <!--<a-input placeholder="系统角色" v-decorator="['phonenumber']"/>-->
        <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统角色">
          <a-select
            mode="tags"
            placeholder="系统角色"
            option-filter-prop="children"
            style="width: 100%"
            v-decorator="['insideRole']"
          >
            <a-select-option  v-for="item in roleList" :key="item.roleId" :value="item.roleId">
              {{ item.roleName }}
            </a-select-option>
          </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveInsideUser } from '@/api/system'
import { getRoleList } from '@/api/backmanage/insiderole'
import pick from 'lodash.pick'
export default {
  name: 'SysUserModal',
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
      roleList: {}
    }
  },
  beforeCreate () {
  },
  created () {
    this.filteredOptions()
  },
  methods: {
    filteredOptions () {
      // 查找角色
      const roleList = getRoleList()
      Promise.all([roleList]).then((d) => {
        this.roleList = d[0]
      })
    },
    add () {
      this.form.resetFields()
      this.edit({ userId: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'userId','deptId','loginName','userName','userType','email','phonenumber','sex','avatar','password','salt','status','delFlag','loginIp','loginDate','createBy','createTime','updateBy','updateTime','remark','cardType','cardNo','insideRole'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          values.insideRole = values.insideRole.toString()
          this.confirmLoading = true
          values.userType = '02'
          saveInsideUser(values).then(res => {
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
