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
      <a-form-item style="display:none">
        <a-input v-decorator="['version']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
        <!--<span style="margin-left:100px;" v-if="isDetail">{{mdl.userName}}</span>-->
        <a-input  placeholder="姓名" v-decorator="['userName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件号">
        <!--<span style="margin-left:100px;" v-if="isDetail">{{mdl.cardNo}}</span>-->
        <a-input  placeholder="证件号" v-decorator="['cardNo']"/>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件类型">
        <a-select
          placeholder="请选择证件类型"
          option-filter-prop="children"
          v-decorator="['cardType']"
        >
          <!--<a-select-option v-for="(d, index) in authlevels" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>-->
          <a-select-option  v-for="item in cardTypes" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="国家/地区">
        <a-select
          placeholder="请选择国家/地区"
          option-filter-prop="children"
          showSearch
          v-decorator="['nationality']"
        >
          <a-select-option  v-for="item in nationalitys" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="性别">
        <a-input placeholder="性别" v-decorator="['gender']"/>
      </a-form-item>
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
          <a-select-option  v-for="item in authlevels" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-textarea placeholder="备注" v-decorator="['remark']"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { savePersonalUserInfo } from '@/api/backmanage/personaluser'
import pick from 'lodash.pick'
const isDetail = false
export default {
  name: 'PersonalUserInfoModal',
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
      nationalitys: [],
      cardTypes: [],
      authlevels: [],
      isDetail: isDetail,
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
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
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'userId','userName','cardType','cardNo','nationality','dateOfBirth','gender','email','phone','avatarUrl','status','authlevel','remark','createTime','createBy','updateTime','updateBy','version'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          savePersonalUserInfo(values).then(res => {
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
