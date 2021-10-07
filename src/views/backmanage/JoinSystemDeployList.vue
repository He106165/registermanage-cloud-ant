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
      <!--<a-button  type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>-->
      <!--<a-dropdown>-->
      <!--<a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>-->
      <!--</a-dropdown>-->
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
        <a-tag v-if="record.status===null & record.remark===null" color="#f50">未配置</a-tag>
        <a-tag v-else color="#87d068" >已配置</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a @click="handleEdit(record)">编辑</a>

        <!--<a-divider type="vertical" />-->
        <!--<a @click="delByIds([record.joinsysId])">删除</a>-->
      </span>
    </s-table>
    <join-system-deploy-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="对接用户数据项配置信息" on-ok="handleOk" width="600px">
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
        <descriptions-item label="域名">
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
import { delJoinSystemInfo, saveJoinSystemInfo } from '@/api/backmanage/joinSystemInfo'
import { getSystemConfig, getUserListDateByTN, SystemDataConfiglist } from '@/api/backmanage/systemDataConfig'
import JoinSystemDeployModal from './modules/JoinSystemDeployModal.vue'
import { checkPermission } from '@/utils/permissions'
import pick from 'lodash.pick'
import Descriptions from '@/components/Descriptions/Descriptions'

export default {
  name: 'TableList',
  components: {
    STable,
    JoinSystemDeployModal,
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
          align: 'center',
          dataIndex: 'joinsysCode'
        },
        {
          title: '系统名称',
          align: 'center',
          dataIndex: 'joinsysName'
        },
        {
          title: '域名',
          align: 'center',
          dataIndex: 'realmPlace'
        },
        {
          title: '免登录地址',
          align: 'center',
          dataIndex: 'returnUrl'
        },
        {
          title: '状态',
          align: 'center',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '操作',
          align: 'center',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return SystemDataConfiglist(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      chooseRow: null,
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
      // 获取系统配置
      console.info(record)
      const date = { 'joinsysId': record.joinsysId }
      getSystemConfig(date).then(res => {
        console.info(res)
        /* 列表页面需要把修改页面需要的数据整理好
         * 1.机构用户数据改为集合数据
         * 2.个人用户数据改为集合
         * */
        this.chooseRow = res
        const orgArray = this.chooseRow.orgParamArray.split(',')
        this.chooseRow.orgParamArray = orgArray
        const proArray = this.chooseRow.proParamArray.split(',')
        this.chooseRow.proParamArray = proArray
        if (this.chooseRow.empowerBy != null) {
          this.$refs.modal.edit(this.chooseRow)
        } else {
          this.chooseRow.id = 0
          this.$refs.modal.edit(this.chooseRow)
        }
      })
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    onChangeStatus (record) {
      record.status = record.status === '0' ? '1' : '0'
      saveJoinSystemInfo(pick(record, 'joinsysId', 'status')).then(res => {
        if (res.code === 0) {
          this.$message.success('保存成功')
        } else {
          this.$message.error(res.msg)
        }
      })
      // 发送状态到服务器
    },
    delByIds (ids) {
      delJoinSystemInfo({ ids: ids.join(',') }).then(res => {
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
