<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="操作类型">
              <a-select placeholder="请选择" v-model="queryParam.opType" default-value="0">
                <a-select-option :value="''">全部</a-select-option>
                <a-select-option v-for="(b, index) in businessTypes" :key="index" :value="b.dictValue">{{ b.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="20">
            <a-form-item label="操作时间">
              <a-range-picker v-model="range"/>
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
    <!--<div class="table-operator">-->
    <!--<a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>-->
    <!--<a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">-->
    <!--<a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>-->
    <!--</a-dropdown>-->
    <!--</div>-->
    <s-table
      size="default"
      ref="table"
      rowKey="id"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
      :rangPicker="range"
      defaultSort="opTime"
    >
      <span slot="businessType" slot-scope="text">
        {{ text | operTypeFilter }}
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a v-if="editEnabel" @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a v-if="removeEnable" @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <managerLog-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="管理员操作日志的信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
        <descriptions-item label="操作人">
          {{ mdl.opUserName }}
        </descriptions-item>
        <descriptions-item label="操作类型">
          {{ mdl.opType }}
        </descriptions-item>
        <descriptions-item label="操作模块">
          {{ mdl.opModel }}
        </descriptions-item>
        <descriptions-item label="操作内容">
          {{ mdl.opContent }}
        </descriptions-item>
        <descriptions-item label="操作时间">
          {{ mdl.opTime }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getManagerLogList, delManagerLog } from '@/api/backmanage/jouralquery'
import JouralQueryModal from './modules/JouralQueryModal'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'
import Descriptions from '@/components/Descriptions/Descriptions'
const operTypeMap = {}

export default {
  name: 'TableList',
  components: {
    STable,
    JouralQueryModal,
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
          title: '操作人',
          dataIndex: 'opUserName'
        },
        {
          title: '操作类型',
          dataIndex: 'opType',
          scopedSlots: { customRender: 'businessType' }
        },
        {
          title: '操作模块',
          dataIndex: 'opModel'
        },
        {
          title: '操作内容',
          dataIndex: 'opContent'
        },
        {
          title: '操作时间',
          dataIndex: 'opTime',
          sorter: true
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.opUserType = 'ADMIN'
        return getManagerLogList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      addEnable: checkPermission('jouralQuery:managerLog:add'),
      editEnabel: checkPermission('jouralQuery:managerLog:edit'),
      removeEnable: checkPermission('jouralQuery:managerLog:remove'),
      // 字典
      businessTypes: '',
      operTypeMap: null,
      range: null
    }
  },
  filters: {
    operTypeFilter (type) {
      return operTypeMap[type].text
    }
  },
  async created () {
    // 字典两种用法，各有优缺点
    // operTypeMap = await getDictMap('sys_oper_type')
    // this.operTypeMap = operTypeMap
    // this.operTypeMap.forEach((value, key, mymap) => {
    //   this.businessTypes.push({ code: key, label: value })
    // })
    this.businessTypes = await getDictArray('op_type')
    this.businessTypes.map(d => {
      operTypeMap[d.dictValue] = { text: d.dictLabel }
    })
    this.operTypeMap = operTypeMap
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
      delManagerLog({ ids: ids.join(',') }).then(res => {
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
