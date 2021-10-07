<template>
  <a-modal
    title="操作"
    style="top: 20px;"
    :width="800"
    v-model="visible"
    :confirmLoading="confirmLoading"
  >
    <template slot="footer">
      <a-button type="dashed" @click="cancleCallback">
        驳回
      </a-button>
      <a-button type="primary" @click="handleSubmit">
        通过
      </a-button>
    </template>
    <a-form :form="form">
      <a-form-item style="display:none">
        <a-input v-decorator="['id']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名">
        <a-input placeholder="姓名" disabled v-decorator="['userName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件号">
        <a-input placeholder="证件号" disabled v-decorator="['cardNo']"/>
      </a-form-item>
      <hr/>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="姓名" style="margin-top: 25px;">
        <a-input placeholder="姓名" disabled v-decorator="['userName']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="国籍国别/地区">
        <a-select
          placeholder="请选择国籍国别/地区"
          option-filter-prop="children"
          showSearch
          v-decorator="['nationality']"
          disabled
        >
          <a-select-option v-for="item in nationalitys" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件类型">
        <a-select
          placeholder="请选择证件类型"
          option-filter-prop="children"
          v-decorator="['cardType']"
          disabled
        >
          <!--<a-select-option v-for="(d, index) in authlevels" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>-->
          <a-select-option v-for="item in cardTypes" :key="item.dictValue" :value="item.dictValue">
            {{ item.dictLabel }}
          </a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="证件号">
        <a-input placeholder="证件号" v-decorator="['cardNo']" disabled/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="手机号">
        <a-input placeholder="手机号" v-decorator="['mobile']" disabled/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="邮箱">
        <a-input placeholder="邮箱" v-decorator="['email']" disabled/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="附件地址">
        <!--<a-input placeholder="附件地址" v-decorator="['fileUrl']"/>-->
        <img :src="mdl.fileUrl" width="150" height="150" preview="1"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-input placeholder="备注" v-decorator="['remark']" disabled/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="驳回原因">
        <a-textarea placeholder="驳回原因" v-decorator="['reasonRejection']"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveFindPersonalInfo, findUserInfo, successMsg, failMsg, inserBohui } from '@/api/backmanage/findUser'
import pick from 'lodash.pick'
import ATextarea from 'ant-design-vue/es/input/TextArea'
import preview from 'vue-photo-preview'
import 'vue-photo-preview/dist/skin.css'
const options = {
  fullscreenEl: false, // 控制是否显示右上角全屏按钮
  closeEl: false, // 控制是否显示右上角关闭按钮
  tapToClose: true, // 点击滑动区域应关闭图库
  shareEl: false, // 控制是否显示分享按钮
  zoomEl: false, // 控制是否显示放大缩小按钮
  counterEl: false, // 控制是否显示左上角图片数量按钮
  arrowEl: true, // 控制如图的左右箭头（pc浏览器模拟手机时）
  tapToToggleControls: true, // 点击应切换控件的可见性
  clickToCloseNonZoomable: true // 点击图片应关闭图库，仅当图像小于视口的大小时
}
Vue.use(preview, options)
export default {
  name: 'FindPersonalInfoModal',
  props: {},
  components: { ATextarea },
  data () {
    return {
      visible: false,
      cardTypes: [],
      nationalitys: [],
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
  computed: {},
  methods: {
    add (cardTypes, nationalitys) {
      this.cardTypes = cardTypes
      this.nationalitys = nationalitys
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit (record, cardTypes, nationalitys) {
      this.cardTypes = cardTypes
      this.nationalitys = nationalitys
      this.mdl = Object.assign(record)
      console.info(record)
      console.info(this.mdl)

      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id', 'nationality', 'userName', 'cardType', 'cardNo', 'mobile', 'email', 'password', 'fileUrl', 'status', 'remark', 'reasonRejection', 'createTime', 'createBy', 'updateTime', 'updateBy', 'version', 'delFlag'))
      })
      this.mdl = record
    },
    handleSubmit1 (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveFindPersonalInfo(values).then(res => {
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
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          findUserInfo(values).then(res => {
            if (res.status === 0) {
              this.$message.success('审批通过')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.warning(res.message)
              return
            }
            this.successMsg(values)
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
        }
      })
    },
    successMsg (values) {
      successMsg(values).then(res => {
        console.log(res)
      })
    },
    failMsg (values) {
      failMsg(values).then(res => {
        console.log(res)
      })
    },
    // 驳回功能
    cancleCallback () {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values.reasonRejection)
          // reasonRejection
          // debugger
          if (values.reasonRejection === null || values.reasonRejection === '') {
            // this.visible = true
            this.$message.warning('请填写驳回原因')
            return
          }
          // 向表中添加驳回字段内容
          inserBohui(values).then(res => {
            if (res.status === 0) {
              this.$message.success('审批驳回')
              this.$emit('ok')
              this.visible = false
            } else {
              this.$message.warning(res.message)
            }
            this.successMsg(values)
          }).catch(() => {
            this.$message.error('系统错误，请稍后再试')
          }).finally(() => {
            this.confirmLoading = false
          })
          this.failMsg(values)
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
<style>
    .avatar-uploader > .ant-upload {
        width: 128px;
        height: 128px;
    }

    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>
