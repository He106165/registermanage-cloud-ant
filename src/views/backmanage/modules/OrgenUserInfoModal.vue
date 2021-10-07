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
        <a-input v-decorator="['orgUserId']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构用户类型">
        <a-select
          placeholder="机构用户类型"
          option-filter-prop="children"
          disabled
          v-decorator="['oegUserTpye']"
        >
          <a-select-option  v-for="item in organUserType" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="名称">
        <a-input placeholder="企业名称/院校名称/机构名称/学联名称" v-decorator="['enterpriseName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="院校\机构英文名称">
        <a-input placeholder="院校\机构英文名称" v-decorator="['englishName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="法人姓名">
        <a-input placeholder="法人姓名" v-decorator="['legalName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="法人证件号">
        <a-input placeholder="法人证件号" v-decorator="['legalIdnumber']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="法人手机号">
        <a-input placeholder="法人手机号" v-decorator="['permanMobile']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人姓名">
        <a-input placeholder="联系人姓名" v-decorator="['hostpersionName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人邮箱">
        <a-input placeholder="联系人邮箱" v-decorator="['hostpersionEmail']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="联系人手机号">
        <a-input placeholder="联系人手机号" v-decorator="['hostpersionTelephone']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="国家/地区">
        <a-select
          placeholder="请选择国家/地区"
          option-filter-prop="children"
          showSearch
          v-decorator="['country']"
        >
          <a-select-option  v-for="item in nationalitys" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="省份">
        <a-input placeholder="省份" v-decorator="['province']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="院校\机构详细地址">
        <a-input placeholder="院校\机构详细地址" v-decorator="['address']"/>
      </a-form-item>
<!--      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="领事馆名称">-->
<!--        <a-input placeholder="领事馆名称" v-decorator="['consulateName']"/>-->
<!--      </a-form-item>-->
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-textarea placeholder="备注" v-decorator="['remark']"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveOrgenUserInfo } from '@/api/backmanage/orgenuser'
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
      nationalitys: [],
      authlevels: [],
      cardTypes: [],
      consulates: [],
      organUserType: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  created () {
  },
  methods: {
    add (nationalitys, authlevels, cardTypes, organUserType) {
      this.cardTypes = cardTypes
      this.nationalitys = nationalitys
      this.authlevels = authlevels
      this.organUserType = organUserType
      this.form.resetFields()
      this.edit({ orgUserId: 0 })
    },
    edit (record, nationalitys, authlevels, cardTypes, organUserType) {
      this.cardTypes = cardTypes
      this.nationalitys = nationalitys
      this.authlevels = authlevels
      this.organUserType = organUserType
      this.mdl = Object.assign(record)
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'orgUserId','oegUserTpye','permanType','enterpriseName','englishName','legalName','legalCardType','legalIdnumber','permanMobile','hostpersionName','hostpersionEmail','hostpersionTelephone','country','province','address','consulateName','consulateId','authlevel','ispass','statu','remark','avatarUrl','createTime','createBy','updateTime','updateBy','version','delFlag'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveOrgenUserInfo(values).then(res => {
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
