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
      <!--<a-form-item style="display:none">-->
        <!--<a-input v-decorator="['orgUserId']"/>-->
      <!--</a-form-item>-->
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构用户类型">-->
        <!--<a-input placeholder="机构用户类型" v-decorator="['oegUserTpye']"/>-->
      <!--</a-form-item>-->
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">-->
        <!--<a-input placeholder="企业名称/院校名称/机构名称/学联名称" v-decorator="['enterpriseName']"/>-->
      <!--</a-form-item>-->
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="院校\机构英文名称">-->
        <!--<a-input placeholder="院校\机构英文名称" v-decorator="['englishName']"/>-->
      <!--</a-form-item>-->
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="法人姓名">
        <a-input placeholder="法人姓名" v-decorator="['legalName']" disabled="true"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="法人证件号">
        <a-input placeholder="法人证件号" v-decorator="['legalIdnumber']" disabled="true"/>
      </a-form-item>
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="法人手机号">-->
        <!--<a-input placeholder="法人手机号" v-decorator="['permanMobile']"/>-->
      <!--</a-form-item>-->
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人姓名">-->
        <!--<a-input placeholder="联系人姓名" v-decorator="['hostpersionName']"/>-->
      <!--</a-form-item>-->
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人邮箱">-->
        <!--<a-input placeholder="联系人邮箱" v-decorator="['hostpersionEmail']"/>-->
      <!--</a-form-item>-->
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人手机号">-->
        <!--<a-input placeholder="联系人手机号" v-decorator="['hostpersionTelephone']"/>-->
      <!--</a-form-item>-->
      <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">-->
        <!--<a-input placeholder="备注" v-decorator="['remark']"/>-->
      <!--</a-form-item>-->
    </a-form>
  </a-modal>
</template>
<script>
import { saveOrgenUserInfo } from '@/api/backmanage/orgenuser'
import { authentication } from '@/api/backmanage/orgenuser'
import pick from 'lodash.pick'
export default {
  name: 'OrgenUserInfoModal',
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
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({ orgUserId: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl,'legalName','legalIdnumber'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const queryParam = {
            legalName: values.legalName,
            legalIdnumber: values.legalIdnumber
          }
          this.confirmLoading = true
          authentication(queryParam).then(res => {
            if (res.status === 0) {
              this.$message.success('认证成功')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.warning(res.message)
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
