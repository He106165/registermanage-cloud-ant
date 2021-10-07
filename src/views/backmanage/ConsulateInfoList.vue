<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="用户名">
              <a-input placeholder="请输入用户名" v-model="queryParam.userName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="证件号">
              <a-input placeholder="请输入证件号" v-model="queryParam.cardNo"/>
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
      rowKey="id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="educationName" slot-scope="text">
        <ellipsis :length="40" tooltip>{{ text | consulateFilter }}</ellipsis>
      </span>
      <span slot="userName" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="cardType" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text | cardTypeFilter }}</ellipsis>
      </span>
      <span slot="email" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="status" slot-scope="text,record">
        <a-switch :checked="record.status=='1'" @change="onChangeStatus(record)"/>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <consulateInfo-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="教育处人员信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
        <descriptions-item label="教育处名称">
          {{ mdl.educationName | consulateFilter}}
        </descriptions-item>
        <descriptions-item label="用户名">
          {{ mdl.userName }}
        </descriptions-item>
        <descriptions-item label="证件类型">
          {{ mdl.cardType | cardTypeFilter }}
        </descriptions-item>
        <descriptions-item label="证件号">
          {{ mdl.cardNo }}
        </descriptions-item>
        <descriptions-item label="手机" :span="3">
          {{ mdl.phone }}
        </descriptions-item>
        <descriptions-item label="邮箱" :span="2">
          {{ mdl.email }}
        </descriptions-item>
      </descriptions></a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getConsulateInfoList, delConsulateInfo, saveConsulateInfo } from '@/api/backmanage/consulateuser'
import ConsulateInfoModal from './modules/ConsulateInfoModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'
import Descriptions from '@/components/Descriptions/Descriptions'
import pick from 'lodash.pick'

const cardTypeMap = {}
const consulateMap = {}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    ConsulateInfoModal,
    Descriptions
  },
  inject: ['reload'],
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
          title: '教育处名称',
          dataIndex: 'educationName',
          scopedSlots: { customRender: 'educationName' }
        },
        {
          title: '用户名',
          dataIndex: 'userName',
          scopedSlots: { customRender: 'userName' }
        },
        {
          title: '证件类型',
          dataIndex: 'cardType',
          scopedSlots: { customRender: 'cardType' }
        },
        {
          title: '证件号',
          dataIndex: 'cardNo'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '邮箱',
          width: '160px',
          dataIndex: 'email',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '用户状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          width: '160px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getConsulateInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      cardTypes: [],
      consulates: [],
      consulateMap: [],
      cardTypeMap: null,
      addEnable: checkPermission('consulateUser:consulateInfo:add'),
      editEnabel: checkPermission('consulateUser:consulateInfo:edit'),
      removeEnable: checkPermission('consulateUser:consulateInfo:remove')
    }
  },
  filters: {
    /* 证件类型过滤器 */
    consulateFilter (type) {
      return consulateMap[type] === undefined ? '' : consulateMap[type].text
    },
    /* 证件类型过滤器 */
    cardTypeFilter (type) {
      return cardTypeMap[type] === undefined ? '' : cardTypeMap[type].text
    }
  },
  created () {
    /* 获取大使馆字典 */
    getDictArray('consulate_info').then(reset => {
      this.consulates = reset
      this.consulates.map(d => {
        consulateMap[d.dictValue] = { text: d.dictLabel }
      })
      this.consulateMap = consulateMap
    })
    /* 获取证件类型 */
    getDictArray('card_type').then(reset => {
      this.cardTypes = reset
      this.cardTypes.map(d => {
        cardTypeMap[d.dictValue] = { text: d.dictLabel }
      })
      this.cardTypeMap = cardTypeMap
    })
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
      this.$refs.modal.add(this.consulates, this.cardTypes)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record, this.consulates, this.cardTypes)
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
          delConsulateInfo({ ids: ids.join(',') }).then(res => {
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
      saveConsulateInfo(pick(record, 'id', 'status', 'version')).then(res => {
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
