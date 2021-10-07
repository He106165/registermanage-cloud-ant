<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="应用系统名称">
              <a-input placeholder="请输入应用系统名称" v-model="queryParam.joinsysName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="接口名称">
              <a-input placeholder="请输入接口名称" v-model="queryParam.sysmethodName"/>
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
      <a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="joinsysCode" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="joinsysName" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="sysmethodName" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="parameter" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="status" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="opertionmes" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="opertionTime" slot-scope="text">
        {{ text | opTimeFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>  </span>
    </s-table>
    <joinSystemRegisterlog-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="系统对接日志信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
        <descriptions-item label="系统唯一标识">
          {{ mdl.joinsysCode }}
        </descriptions-item>
        <descriptions-item label="应用系统名称">
          {{ mdl.joinsysName }}
        </descriptions-item>
        <descriptions-item label="接口名称">
          {{ mdl.sysmethodName }}
        </descriptions-item>
        <descriptions-item label="参数">
          {{ mdl.parameter }}
        </descriptions-item>
        <descriptions-item label="状态">
          {{ mdl.status }}
        </descriptions-item>
        <descriptions-item label="原因">
          {{ mdl.opertionmes }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getJoinSystemRegisterlogList, delJoinSystemRegisterlog } from '@/api/backmanage/systemJonitlog'
import JoinSystemRegisterlogModal from './modules/JoinSystemRegisterlogModal.vue'
import { checkPermission } from '@/utils/permissions'
import Descriptions from '@/components/Descriptions/Descriptions'
import moment from 'moment'

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    JoinSystemRegisterlogModal,
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
          dataIndex: 'joinsysCode',
          width: 130,
          scopedSlots: { customRender: 'joinsysCode' }

        },
        {
          title: '应用系统名称',
          dataIndex: 'joinsysName',
          width: 130,
          scopedSlots: { customRender: 'joinsysName' }
        },
        {
          title: '接口名称',
          width: 130,
          dataIndex: 'sysmethodName',
          scopedSlots: { customRender: 'sysmethodName' }
        },
        {
          title: '参数',
          dataIndex: 'parameter',
          width: '180px',
          scopedSlots: { customRender: 'parameter' }
        },
        {
          title: '状态',
          width: 80,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '原因',
          dataIndex: 'opertionmes',
          scopedSlots: { customRender: 'opertionmes' }
        },
        {
          title: '操作时间',
          dataIndex: 'opertionTime',
          scopedSlots: { customRender: 'opertionTime' },
          sorter: true
        }
        // {
        //   title: '操作',
        //   width: '130px',
        //   dataIndex: 'action',
        //   scopedSlots: { customRender: 'action' }
        // }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.info(getJoinSystemRegisterlogList(Object.assign(parameter, this.queryParam)))
        return getJoinSystemRegisterlogList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('systemJointLog:joinSystemRegisterlog:add'),
      editEnabel: checkPermission('systemJointLog:joinSystemRegisterlog:edit'),
      removeEnable: checkPermission('systemJointLog:joinSystemRegisterlog:remove')
    }
  },
  filters: {
    opTimeFilter (time) {
      return time ? moment(time).format('YYYY-MM-DD') : ''
    }
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
      delJoinSystemRegisterlog({ ids: ids.join(',') }).then(res => {
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
