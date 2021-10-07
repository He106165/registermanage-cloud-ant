<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="地址">
              <a-input placeholder="请输入地址" v-model="queryParam.reveiceEmail"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="主题">
              <a-input placeholder="请输入主题" v-model="queryParam.theme"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="内容">
              <a-input placeholder="请输入内容" v-model="queryParam.content"/>
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
      <span slot="content" slot-scope="text">
        <ellipsis :length="40" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="status" slot-scope="text,record">
        <a-tag v-if="record.status=== '1' " color="#87d068" >成功</a-tag>
        <a-tag v-else color="#f50" >失败</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <mailSendLog-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="短信发送日志的信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
        <descriptions-item label="地址">
          {{ mdl.reveiceEmail }}
        </descriptions-item>
        <descriptions-item label="主题">
          {{ mdl.theme }}
        </descriptions-item>
        <descriptions-item label="内容">
          {{ mdl.content }}
        </descriptions-item>
        <descriptions-item label="是否成功">
          {{ mdl.status }}
        </descriptions-item>
        <descriptions-item label="发送时间">
          {{ mdl.sendTime }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getMailSendLogList, delMailSendLog } from '@/api/magsend/emailsendlog'
import MailSendLogModal from './modules/MailSendLogModal.vue'
import { checkPermission } from '@/utils/permissions'
import Descriptions from '@/components/Descriptions/Descriptions'

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    MailSendLogModal,
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
          title: '地址',
          dataIndex: 'reveiceEmail'
        },
        {
          title: '主题',
          dataIndex: 'theme'
        },
        {
          title: '内容',
          width: 350,
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }

        },
        {
          title: '是否成功',
          width: 150,
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '发送时间',
          dataIndex: 'sendTime',
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getMailSendLogList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('emailManage:mailSendLog:add'),
      editEnabel: checkPermission('emailManage:mailSendLog:edit'),
      removeEnable: checkPermission('emailManage:mailSendLog:remove')
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
      this.$refs.modal.edit(record)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds (ids) {
      delMailSendLog({ ids: ids.join(',') }).then(res => {
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
