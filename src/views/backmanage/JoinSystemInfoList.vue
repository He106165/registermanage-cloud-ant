<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="唯一标识">
              <a-input placeholder="请输入唯一标识" v-model="queryParam.joinsysCode"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="系统名称">
              <a-input placeholder="请输入系统名称" v-model="queryParam.joinsysName"/>
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
      <a-dropdown>
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="joinsysId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="status" slot-scope="text,record">
        <a-switch :checked="record.status=='1'" @change="onChangeStatus(record)"/>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delByIds([record.joinsysId])">删除</a>
        <!--<a-popconfirm-->
        <!--title="确认删除这条数据?"-->
        <!--@confirm="() => delByIds(record.joinsysId)"-->
        <!--&gt;-->
        <!--<a href="javascript:;">删除</a>-->
        <!--</a-popconfirm>-->

      </span>
    </s-table>
    <joinSystemInfo-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="应用系统注册信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
        <descriptions-item label="唯一标识">
          {{ mdl.joinsysCode }}
        </descriptions-item>
        <descriptions-item label="系统名称">
          {{ mdl.joinsysName }}
        </descriptions-item>
        <descriptions-item label="免登录地址">
          {{ mdl.realmPlace }}
        </descriptions-item>
        <descriptions-item label="免登陆地址">
          {{ mdl.returnUrl }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getJoinSystemInfoList, delJoinSystemInfo, saveJoinSystemInfo } from '@/api/backmanage/joinSystemInfo'
import JoinSystemInfoModal from './modules/JoinSystemInfoModal.vue'
import { checkPermission } from '@/utils/permissions'
import pick from 'lodash.pick'
import Descriptions from '@/components/Descriptions/Descriptions'
export default {
  name: 'TableList',
  components: {
    STable,
    JoinSystemInfoModal,
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
          title: '唯一标识',
          dataIndex: 'joinsysCode'
        },
        {
          title: '系统名称',
          dataIndex: 'joinsysName'
        },
        {
          title: '免登录地址',
          dataIndex: 'realmPlace'
        },
        {
          title: '免登陆地址',
          dataIndex: 'returnUrl'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
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
        return getJoinSystemInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('systemRegister:joinSystemInfo:add'),
      editEnabel: checkPermission('systemRegister:joinSystemInfo:edit'),
      removeEnable: checkPermission('systemRegister:joinSystemInfo:remove')
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
    onChangeStatus (record) {
      record.status = record.status === '0' ? '1' : '0'
      const mag = record.status === '0' ? '已禁用' : '已启用'
      saveJoinSystemInfo(pick(record, 'joinsysId', 'status')).then(res => {
        if (res.code === 0) {
          this.$message.success(mag)
        } else {
          this.$message.error(res.msg)
        }
      })
      // 发送状态到服务器
    },
    delByIds (ids) {
      this.$confirm({
        title: '提示',
        content: '确定删除这条数据 ?',
        onOk: () => {
          delJoinSystemInfo({ ids: ids.join(',') }).then(res => {
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
