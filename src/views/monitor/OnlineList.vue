<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="15" :sm="15">
            <a-form-item label="登录名">
              <a-input placeholder="请输入" v-model="queryParam.loginName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="loginName"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="loginDate"
    >
      <span slot="admin" slot-scope="text">
        {{ text | adminFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="handleDetail(record)">踢除</a>
      </span>
    </s-table>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getOnlineList, delOnlineUser } from '@/api/monitor'
export default {
  name: 'TableList',
  components: {
    STable
  },
  data () {
    return {
      description: 'Redis中有效的用户清单',
      visible: false,
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
      },
      form: this.$form.createForm(this),
      mdl: {},
      permissions: [],
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '登陆名',
          dataIndex: 'loginName'
        },
        {
          title: '用户名称',
          dataIndex: 'userName'
        },
        {
          title: '登录IP',
          dataIndex: 'loginIp'
        },
        {
          title: '登录时间',
          dataIndex: 'loginDate',
          sorter: true
        },
        {
          title: '部门',
          dataIndex: 'dept.deptName'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '是否超管',
          dataIndex: 'admin',
          scopedSlots: { customRender: 'admin' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      range: null,
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getOnlineList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: []

    }
  },
  filters: {
    adminFilter (status) {
      const statusMap = {
        'false': '否',
        'true': '是'
      }
      return statusMap[status]
    }
  },
  beforeCreate () {

  },
  async created () {
    // 字典两种用法，各有优缺点
    // operTypeMap = await getDictMap('sys_oper_type')
    // this.operTypeMap = operTypeMap
    // this.operTypeMap.forEach((value, key, mymap) => {
    //   this.businessTypes.push({ code: key, label: value })
    // })
    // this.businessTypes = await getDictArray('sys_oper_type')
    // this.businessTypes.map(d => {
    //   operTypeMap[d.dictValue] = { text: d.dictLabel }
    // })
    // this.operTypeMap = operTypeMap
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleDetail: function (record) {
      this.mdl = Object.assign({}, record)
      delOnlineUser({ userId: this.mdl.userId }).then(res => {
        if (res.code === 0) {
          this.$message.success(`成功踢除用户：` + this.mdl.userId)
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    handleOk () {
      this.$refs.table.refresh(true)
    },
    delByIds (ids) {
      this.$message.success(`你删除了` + ids)
      // delOperLog({ ids: ids.join(',') }).then(res => {
      //   if (res.code === 0) {
      //     this.$message.success(`删除成功`)
      //     this.handleOk()
      //   } else {
      //     this.$message.error(res.msg)
      //   }
      //   this.selectedRowKeys = []
      // })
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
