<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="角色名">
              <a-input placeholder="请输入角色名" v-model="queryParam.roleName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="权限字符">
              <a-input placeholder="请输入权限字符" v-model="queryParam.roleKey"/>
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
    <s-table
      size="default"
      ref="table"
      rowKey="roleId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑</a>
      </span>
    </s-table>
    <inside-role-system-config-model ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="授权管理的信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
        <descriptions-item label="角色名">
          {{ mdl.roleName }}
        </descriptions-item>
        <descriptions-item label="权限字符">
          {{ mdl.roleKey }}
        </descriptions-item>
        <descriptions-item label="显示顺序">
          {{ mdl.sort }}
        </descriptions-item>
        <descriptions-item label="角色状态">
          {{ mdl.roleStatus }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getInsideRoleList, delInsideRole } from '@/api/backmanage/insiderole'
import InsideRoleSystemConfigModel from './modules/InsideRoleSystemConfigModel.vue'
import { checkPermission } from '@/utils/permissions'
import Descriptions from '@/components/Descriptions/Descriptions'

export default {
  name: 'TableList',
  components: {
    STable,
    InsideRoleSystemConfigModel,
    Descriptions
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
      // 详情页面
      loading: false,
      visible: false,
      update: true,
      // 表头
      columns: [
        {
          title: '角色名',
          dataIndex: 'roleName'
        },
        {
          title: '权限字符',
          dataIndex: 'roleKey'
        },
        {
          title: '显示顺序',
          dataIndex: 'sort'
        },
        {
          title: '角色状态',
          dataIndex: 'roleStatus'
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
        return getInsideRoleList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('exInterface:insideRole:add'),
      editEnabel: checkPermission('exInterface:insideRole:edit'),
      removeEnable: checkPermission('exInterface:insideRole:remove')
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
    showModal (record) {
      this.visible = true
      this.mdl = record
      // 移除组件
      this.update = false
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。嗯，花了我半天时间
      this.$nextTick(() => {
        this.update = true
      })
    },
    handleCancel (e) {
      this.visible = false
    },
    handleAdd () {
      this.$refs.modal.add()
    },
    handleEdit (record) {
      if (record.systemList != null) {
        record.systemList = record.systemList.toString().split(',')
      }
      console.info(record)
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds (ids) {
      delInsideRole({ ids: ids.join(',') }).then(res => {
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
