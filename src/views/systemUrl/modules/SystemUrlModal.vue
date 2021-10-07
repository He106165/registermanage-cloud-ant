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
        <a-input v-decorator="['id']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统名称">
        <a-input placeholder="系统名称" v-decorator="['systemName', {rules: [{required: true, message: '请输入系统名称'}]}]"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="系统地址">
        <a-input placeholder="系统地址" v-decorator="['address', {rules: [{required: true, message: '请输入系统地址'}]}]"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="用户类型">
        <a-select
          placeholder="请选择用户类型"
          option-filter-prop="usertypeFilter"
          showSearch
          v-decorator="['userType']"
        >
          <a-select-option v-for="usertype in options" :key="usertype.value" :value="usertype.value">{{usertype.label }}</a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="图片地址">
<!--        <a-input placeholder="图片地址" v-decorator="['imageUrl']"/>-->
        <a-upload
          name="file"
          list-type="picture-card"
          class="avatar-uploader"
          :show-upload-list="false"
          action="http://192.168.2.226:8090/api/dfs/upload"
          :before-upload="beforeUpload"
          @change="handleChange"
        >
          <img v-if="imageUrl" :src="imageUrl" alt="avatar" style="width: 128px;height: 128px"/>
          <div v-else>
            <a-icon :type="loading ? 'loading' : 'plus'" />
            <div class="ant-upload-text">
              Upload
            </div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="备注">
        <a-input placeholder="备注" v-decorator="['remark']"/>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="版本" v-show="false">
        <a-input  placeholder="版本" v-decorator="['version']"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveSystemUrl } from '@/api/systemUrl/systemUrl'
import pick from 'lodash.pick'
function getBase64 (img, callback) {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}
export default {
  name: 'SystemUrlModal',
  props: {
  },
  components: {
  },
  data () {
    return {
      options: [{
        value: '00',
        label: '个人用户'
      }, {
        value: '01',
        label: '机构用户'
      }],
      loading: false,
      imageUrl: '',
      headers: {
        authorization: 'authorization-text'
      },
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
      usertype: [],
      form: this.$form.createForm(this)
    }
  },
  beforeCreate () {
  },
  filters: {
    usertypeFilter: function (val) {
      if (val === '00') {
        return '个人用户'
      } else if (val === '01') {
        return '机构用户'
      } else {
        return '未知类型'
      }
    }
  },
  created () {
  },
  methods: {
    add () {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit (record, usertype) {
      this.usertype = usertype
      this.mdl = Object.assign(record)
      this.imageUrl = this.mdl.imageUrl
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'id','address','remark','createTime','createBy','updateTime','updateBy','version','delFlag','userType','systemName','imageUrl'))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          values.imageUrl = this.mdl.imageUrl
          saveSystemUrl(values).then(res => {
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
    handleChange (info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
      // Get this url from response in real world.
        console.info(info.file.response.url)
        console.info(info.file.response.url)
        this.mdl.imageUrl = info.file.response.url
        getBase64(info.file.originFileObj, imageUrl => {
          this.imageUrl = imageUrl
          this.loading = false
        })
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('You can only upload JPG file!')
      }
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
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
