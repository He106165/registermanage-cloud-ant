<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="系统唯一标识">
              <a-input placeholder="请输入唯一标识" v-model="queryParam.joinsysCode"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="系统名称">
              <a-input placeholder="请输入系统名称" v-model="queryParam.name"/>
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
      <a-button type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown >
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="insideSystemId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="returnUrl" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="status" slot-scope="text,record">
        <a-switch :checked="record.status=='1'" @change="onChangeStatus(record)"/>
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.insideSystemId])">删除</a>
      </span>
    </s-table>
    <insideSystemInfo-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="内部系统注册信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
        <descriptions-item label="系统唯一标识">
          {{ mdl.joinsysCode }}
        </descriptions-item>
<!--        <descriptions-item label="图标">-->
<!--          {{ mdl.icon }}-->
<!--        </descriptions-item>-->
        <descriptions-item label="系统名称">
          {{ mdl.name }}
        </descriptions-item>
        <descriptions-item label="域名">
          {{ mdl.realmPlace }}
        </descriptions-item>
        <descriptions-item label="免登录地址">
          {{ mdl.returnUrl }}
        </descriptions-item>
        <descriptions-item label="状态">
          {{ mdl.status }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getInsideSystemInfoList, delInsideSystemInfo, saveInsideSystemInfo } from '@/api/backmanage/insidesystem'
import InsideSystemInfoModal from './modules/InsideSystemInfoModal.vue'
import { checkPermission } from '@/utils/permissions'
import Descriptions from '@/components/Descriptions/Descriptions'
import pick from 'lodash.pick'

export default {
  name: 'TableList',
  inject: ['reload'],
  components: {
    STable,
    Ellipsis,
    InsideSystemInfoModal,
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
          title: '系统唯一标识',
          dataIndex: 'joinsysCode'
        },
        {
          title: '图标',
          dataIndex: 'icon'
        },
        {
          title: '系统名称',
          dataIndex: 'name'
        },
        {
          title: '域名',
          dataIndex: 'realmPlace'
        },
        {
          title: '免登录地址',
          dataIndex: 'returnUrl',
          scopedSlots: { customRender: 'returnUrl' }

        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }

        },
        {
          title: '操作',
          width: '180px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getInsideSystemInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('insideSystem:insideSystemInfo:add'),
      editEnabel: checkPermission('insideSystem:insideSystemInfo:edit'),
      removeEnable: checkPermission('insideSystem:insideSystemInfo:remove')
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
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds (ids) {
      this.$confirm({
        title: '提示',
        content: '确定删除这条数据 ?',
        onOk: () => {
          delInsideSystemInfo({ ids: ids.join(',') }).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.handleOk()
            } else {
              this.$message.error(res.msg)
            }
            this.selectedRowKeys = []
          })
        },
        onCancel () {
        }
      })
    },
    onChangeStatus (record) {
      record.status = record.status === '0' ? '1' : '0'
      const mag = record.status === '0' ? '已禁用' : '已启用'
      saveInsideSystemInfo(pick(record, 'insideSystemId', 'status', 'version')).then(res => {
        if (res.code === 0) {
          this.reload()
          this.$message.success(mag)
        } else {
          this.$message.error(res.msg)
        }
      })
      // 发送状态到服务器
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
