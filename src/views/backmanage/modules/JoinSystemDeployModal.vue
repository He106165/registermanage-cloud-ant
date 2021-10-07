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
        <a-select
          placeholder="请选择系统名称"
          option-filter-prop="children"
          disabled
          v-decorator="['joinsysId']"
        >
          <a-select-option  v-for="item in SystemList" :key="item.joinsysId" :value="item.joinsysId">
            {{ item.joinsysName }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="个人用户数据项">
        <a-select
          mode="tags"
          placeholder="请选择个人用户数据项"
          option-filter-prop="children"
          style="width: 100%"
          v-decorator="['proParamArray']"
        >
          <a-select-option  v-for="item in UserTableColList" :key="item.LABEL" :value="item.LABEL">
            {{ item.VALUE }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item :labelCol="labelCol" :wrapperCol="wrapperCol" label="机构用户数据项">
        <a-select
          mode="tags"
          placeholder="请选择机构用户数据项"
          option-filter-prop="children"
          style="width: 100%"
          v-decorator="['orgParamArray']"
        >
          <a-select-option  v-for="item in OrgTableColList" :key="item.LABEL" :value="item.LABEL">
            {{ item.VALUE }}
          </a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { saveJoinSystemDeploy, getSystemList, getUserListDateByTN } from '@/api/backmanage/systemDataConfig'
import pick from 'lodash.pick'
export default {
  name: 'JoinSystemDeployModal',
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
      getSystemList: {},
      form: this.$form.createForm(this),
      selectedItems: [],
      SystemList: {},
      OrgTableColList: {},
      UserTableColList: {}
    }
  },
  beforeCreate () {
  },
  created () {
  },
  mounted () {
    this.filteredOptions()
  },
  methods: {
    initData () {
      const dataType = this.form.getFieldValue('dataType')
      const data = { 'tableName': dataType }
      getUserListDateByTN(data).then(res => {
        this.TableColList = res
      })
    },
    filteredOptions () {
      // 查找系统集合
      const SystemList = getSystemList()
      Promise.all([SystemList]).then((d) => {
        this.SystemList = d[0]
      })
      // 查找机构用户数据
      const data = { 'tableName': 'ORGEN_USER_INFO' }
      const OrgTableColList = getUserListDateByTN(data)
      Promise.all([OrgTableColList]).then((d) => {
        this.OrgTableColList = d[0]
      })
      // 查找个人用户数据
      const userTableName = { 'tableName': 'PERSONAL_USER_INFO' }
      const UserTableColList = getUserListDateByTN(userTableName)
      Promise.all([UserTableColList]).then((d) => {
        this.UserTableColList = d[0]
      })
    },
    add () {
      this.form.resetFields()
      this.edit({ id: 0 })
    },
    edit (record) {
      this.mdl = Object.assign(record)
      if (this.mdl.orgParamArray == null) {
        this.mdl.orgParamArray = []
      }
      if (this.mdl.proParamArray == null) {
        this.mdl.proParamArray = []
      }
      this.visible = true
      this.$nextTick(() => {
        this.form.setFieldsValue(pick(this.mdl, 'joinsysId','proParamArray','orgParamArray','empowerBy','empowerTime','id','orgParamArray',''))
      })
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          values.proParamArray = values.proParamArray.toString()
          values.orgParamArray = values.orgParamArray.toString()
          console.log('Received values of form: ', values)
          this.confirmLoading = true
          saveJoinSystemDeploy(values).then(res => {
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
    handleChange (selectedItems) {
      this.selectedItems = selectedItems
    }
    // DateTypeChange (selectedItems) {
    //   console.info(selectedItems)
    //   this.form.setFieldsValue({
    //     'paramArray': []
    //   })
    //   const data = { 'tableName': selectedItems }
    //   getUserListDateByTN(data).then(res => {
    //     this.TableColList = res
    //   })
    // },
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
