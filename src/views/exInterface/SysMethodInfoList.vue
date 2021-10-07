<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="接口名称">
              <a-input placeholder="请输入接口名称" v-model="queryParam.sysmethodName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="接口地址">
              <a-input placeholder="请输入接口地址" v-model="queryParam.sysmethodUrl"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="描述">
              <a-input placeholder="请输入描述" v-model="queryParam.descript"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="参数列表">
              <a-input placeholder="请输入参数列表" v-model="queryParam.parameterlist"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="排序">
              <a-input placeholder="请输入排序" v-model="queryParam.sort"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="版本">
              <a-input placeholder="请输入版本" v-model="queryParam.version"/>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="() => queryParam = {}">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
     <div class="table-operator">
      <a-button  type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown >
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="sysmethodId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a  @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a  @click="delByIds([record.sysmethodId])">删除</a>
      </span>
    </s-table>
    <sysMethodInfo-modal ref="modal" @ok="handleOk"/>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getSysMethodInfoList, delSysMethodInfo } from '@/api/exInterface/exInterface'
import SysMethodInfoModal from './modules/SysMethodInfoModal.vue'
import { checkPermission } from '@/utils/permissions'

export default {
  name: 'TableList',
  components: {
    STable,
    SysMethodInfoModal
  },
  data () {
    return {
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
      // 高级搜索 展开/关闭
      advanced: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '接口名称',
          dataIndex: 'sysmethodName'
        },
        {
          title: '接口地址',
          dataIndex: 'sysmethodUrl'
        },
        {
          title: '描述',
          dataIndex: 'descript'
        },
        {
          title: '参数列表',
          dataIndex: 'parameterlist'
        },
        {
          title: '调用示例',
          dataIndex: 'example'
        },
        {
          title: '排序',
          dataIndex: 'sort'
        },
        {
          title: '备注',
          dataIndex: 'remark'
        },
        {
          title: '状态',
          dataIndex: 'status'
        },
        {
          title: '版本',
          dataIndex: 'version'
        },
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getSysMethodInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('exInterface:sysMethodInfo:add'),
      editEnabel: checkPermission('exInterface:sysMethodInfo:edit'),
      removeEnable: checkPermission('exInterface:sysMethodInfo:remove')
    }
  },
  filters: {
  },
  created () {
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd () {
      this.$refs.modal.add()
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds (ids) {
      delSysMethodInfo({ ids: ids.join(',') }).then(res => {
        if (res.code === 0) {
          this.$message.success('删除成功')
          this.handleOk()
        } else {
          this.$message.error(res.msg)
        }
        this.selectedRowKeys = []
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
