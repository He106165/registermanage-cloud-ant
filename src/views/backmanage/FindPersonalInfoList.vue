<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="姓名">
              <a-input placeholder="请输入姓名" v-model="queryParam.userName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="证件号">
              <a-input placeholder="请输入证件号" v-model="queryParam.cardNo"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.mobile"/>
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
      <span slot="cardType" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text | cardTypeFilter }}</ellipsis>
      </span>

      <span slot="userName" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="nationality" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text | nationalityFilter }}</ellipsis>
      </span>
      <span slot="email" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="status" slot-scope="text,record">
        <a-tag v-if="record.status === null || record.status ==='0' " color="#2db7f5">未审批</a-tag>
        <a-tag v-else-if="record.status ==='1'" color="#87d068" >已通过</a-tag>
        <a-tag v-else color="#f50">已驳回</a-tag>
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider v-if="record.status === null || record.status ==='0'" type="vertical" />
        <a v-if="record.status === null || record.status ==='0'" @click="handleEdit(record)">审批</a>
      </span>
    </s-table>
    <FindPersonalInfo-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="找回用户人员信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
        <descriptions-item label="姓名">
          {{ mdl.userName }}
        </descriptions-item>
        <descriptions-item label="证件类型">
          {{ mdl.cardType | cardTypeFilter }}
        </descriptions-item>
        <descriptions-item label="证件号">
          {{ mdl.cardNo }}
        </descriptions-item>
        <descriptions-item label="手机号" :span="3">
          {{ mdl.mobile }}
        </descriptions-item>
        <descriptions-item label="邮箱">
          {{ mdl.email }}
        </descriptions-item>
        <descriptions-item label="国籍国别/地区">
          {{ mdl.nationality | nationalityFilter }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { getFindPersonalInfoList, delFindPersonalInfo } from '@/api/backmanage/findUser'
import FindPersonalInfoModal from './modules/FindPersonalInfoModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'
import Descriptions from '@/components/Descriptions/Descriptions'
import { queryNationality } from '../../api/backmanage/nationality'
const nationalityMap = {}
const cardTypeMap = {}
export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    FindPersonalInfoModal,
    Descriptions
  },
  data () {
    return {
      visibleBohui:false,
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
          title: '姓名',
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
          dataIndex: 'mobile'
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '国籍国别/地区',
          dataIndex: 'nationality',
          scopedSlots: { customRender: 'nationality' }
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
        return getFindPersonalInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      nationalitys: [],
      cardTypes: [],
      addEnable: checkPermission('consulateUser:findPersonalInfo:add'),
      editEnabel: checkPermission('consulateUser:findPersonalInfo:edit'),
      removeEnable: checkPermission('consulateUser:findPersonalInfo:remove')
    }
  },
  filters: {
    /* 国家信息列表过滤器 */
    nationalityFilter (type) {
      return nationalityMap[type] === undefined ? '' : nationalityMap[type].text
    },
    /* 证件类型过滤器 */
    cardTypeFilter (type) {
      return cardTypeMap[type] === undefined ? '' : cardTypeMap[type].text
    }
  },
  created () {
    /* 获取证件类型 */
    getDictArray('card_type').then(resu => {
      this.cardTypes = resu
      this.cardTypes.map(d => {
        cardTypeMap[d.dictValue] = { text: d.dictLabel }
      })
      this.cardTypeMap = cardTypeMap
    })
    // getDictArray('nationality').then(res => {
    //   this.nationalitys = res
    //   this.nationalitys.map(d => {
    //     nationalityMap[d.dictValue] = { text: d.dictLabel.toString() }
    //   })
    //   this.nationalityMap = nationalityMap
    // })
    /* 获取国家信息列表 */
    queryNationality().then(res => {
      this.nationalitys = res
      this.nationalitys.map(d => {
        nationalityMap[d.dictValue] = { text: d.dictLabel.toString() }
      })
      this.nationalityMap = nationalityMap
    })
  },
  methods: {
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd () {
      this.$refs.modal.add(this.cardTypes, this.nationalitys)
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
      this.$refs.modal.edit(record,this.cardTypes, this.nationalitys)
    },
    handleOk () {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds (ids) {
      delFindPersonalInfo({ ids: ids.join(',') }).then(res => {
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
