<template>
    <a-modal
            title="实名认证"
            style="top: 20px;"
            :width="800"
            v-model="visible"
            :confirmLoading="confirmLoading"
            @ok="handleSubmit"
    >
        <a-form :form="form">
            <!--<a-form-item style="display:none">-->
            <!--<a-input v-decorator="['userId']"/>-->
            <!--</a-form-item>-->
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
                <a-input placeholder="姓名" v-decorator="['userName']" disabled="true"/>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件类型">
                <a-select
                        placeholder="请选择证件类型"
                        option-filter-prop="children"
                        v-decorator="['cardType']"
                >
                    <!--<a-select-option v-for="(d, index) in authlevels" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>-->
                    <a-select-option v-for="item in cardTypes" :key="item.dictValue" :value="item.dictValue">
                        {{ item.dictLabel }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件号">
                <a-input placeholder="证件号" v-decorator="['cardNo']" disabled="true"/>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="国家/地区">
                <a-select
                        placeholder="请选择国家/地区"
                        option-filter-prop="children"
                        showSearch
                        v-decorator="['nationality']"
                >
                    <a-select-option v-for="item in nationalitys" :key="item.dictValue" :value="item.dictValue">
                        {{ item.dictLabel }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <!--<a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">-->
            <!--<a-input placeholder="性别" v-decorator="['gender']"/>-->
            <!--</a-form-item>-->
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="邮箱">
                <a-input placeholder="邮箱" v-decorator="['email']"/>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
                <a-input placeholder="手机号" v-decorator="['phone']"/>
            </a-form-item>
            <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="实名认证等级" v-if="mdl.authlevel != null">
                <a-select
                        placeholder="实名认证等级"
                        option-filter-prop="children"
                        disabled
                        v-decorator="['authlevel']"
                >
                    <a-select-option v-for="item in authlevels" :key="item.dictValue" :value="item.dictValue">
                        {{ item.dictLabel }}
                    </a-select-option>
                </a-select>
            </a-form-item>
        </a-form>
    </a-modal>
</template>
<script>
import { authentication } from '@/api/backmanage/personaluser'
import pick from 'lodash.pick'

export default {
  name: 'PersonalUserInfoModal',
  props: {
  },
  components: {
  },
  data() {
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
      nationalitys: [],
      cardTypes: [],
      authlevels: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate() {
  },
  created() {
  },
  methods: {
    add (cardTypes, nationalitys) {
      this.cardTypes = cardTypes
      this.nationalitys = nationalitys
      this.form.resetFields()
      this.edit({ userId: 0 })
    },
    edit (record, cardTypes, nationalitys, authlevels) {
      this.cardTypes = cardTypes
      this.nationalitys = nationalitys
      this.authlevels = authlevels
      this.mdl = Object.assign(record)
      console.log(nationalitys)
      console.log(this.mdl)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'userId', 'userName', 'cardType', 'cardNo', 'nationality', 'dateOfBirth','gender', 'email', 'phone', 'avatarUrl', 'status', 'authlevel', 'remark', 'createTime', 'createBy', 'updateTime', 'updateBy', 'version'))
      })
    },
    handleSubmit(e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          const queryParam = {
            userName: values.userName,
            cardNo: values.cardNo
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
