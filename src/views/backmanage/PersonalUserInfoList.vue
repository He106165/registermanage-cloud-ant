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
          <!--<a-col :md="5" :sm="15">
            <a-form-item label="国家/地区">
              <a-select placeholder="请选择" v-model="queryParam.nationality">
                <a-select-option :value="''">所有</a-select-option>
                <a-select-option v-for="(d, index) in nationalitys" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="邮箱">
              <a-input placeholder="请输入邮箱" v-model="queryParam.email"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="手机号">
              <a-input placeholder="请输入手机号" v-model="queryParam.phone"/>
            </a-form-item>
          </a-col>-->
          <a-col :md="5" :sm="15">
            <a-form-item label="实名认证等级">
              <a-select placeholder="请选择" v-model="queryParam.authlevel">
                <a-select-option :value="''">请选择</a-select-option>
                <a-select-option v-for="(d, index) in authlevels" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>
              </a-select>
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
      <a-button v-if="addEnable" type="primary" icon="plus" @click="handleAdd">新建</a-button>
      <a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">
        <a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>
      </a-dropdown>
    </div>
    <s-table
      size="default"
      ref="table"
      rowKey="userId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="userName" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="cardType" slot-scope="text">
        <ellipsis :length="15" tooltip>{{ text | cardTypeFilter }}</ellipsis>
      </span>
      <span slot="nationality" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text | nationalityFilter }}</ellipsis>
      </span>
      <span slot="email" slot-scope="text">
        <ellipsis :length="16" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="authlevel" slot-scope="text">
        {{ text | authlevelFilter }}
      </span>
      <span slot="status" slot-scope="text,record">
        <a-switch :checked="record.status=='1'" @change="onChangeStatus(record)"/>
      </span>
      <span slot="createTime" slot-scope="text">
        {{ text }}
      </span>

      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a  @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a  @click="delByIds([record.userId])">删除</a>
      </span>
    </s-table>
    <personalUserInfo-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="人员信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update" >
        <descriptions-item label="名称">
          {{ this.mdl.userName }}
        </descriptions-item>
        <descriptions-item label="证件类型">
          {{ mdl.cardType | cardTypeFilter }}
        </descriptions-item>
        <descriptions-item label="证件号">
          {{ mdl.cardNo }}
        </descriptions-item>
        <descriptions-item label="国家/地区">
        {{ mdl.nationality | nationalityFilter }}
        </descriptions-item>
        <descriptions-item label="邮箱" :span="2">
          {{ mdl.email }}
        </descriptions-item>
        <descriptions-item label="手机号" :span="3">
          {{ mdl.phone }}
        </descriptions-item>
        <descriptions-item label="实名认证等级">
          {{ mdl.authlevel | authlevelFilter }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>
<script>
import { STable, Ellipsis } from '@/components'
import { queryNationality } from '@/api/backmanage/nationality'
import { getPersonalUserInfoList, delPersonalUserInfo, savePersonalUserInfo } from '@/api/backmanage/personaluser'
import PersonalUserInfoModal from './modules/PersonalUserInfoModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'
import Descriptions from '@/components/Descriptions/Descriptions'

const nationalityMap = {}
const authlevelMap = {}
const cardTypeMap = {}

export default {
  name: 'TableList',
  components: {
    STable,
    Ellipsis,
    PersonalUserInfoModal,
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
      mdl: {
        userName: '',
        cardType: ''
      },
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
          title: '国家/地区',
          dataIndex: 'nationality',
          scopedSlots: { customRender: 'nationality' }
        },
        {
          title: '邮箱',
          dataIndex: 'email',
          scopedSlots: { customRender: 'email' }
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '实名等级',
          dataIndex: 'authlevel',
          scopedSlots: { customRender: 'authlevel' }
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          scopedSlots: { customRender: 'createTime' }
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
        return getPersonalUserInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      nationalitys: [],
      authlevels: [],
      cardTypes: [],
      nationalityMap: null,
      authlevelMap: null,
      cardTypeMap: null,
      addEnable: checkPermission('personalUser:personalUserInfo:add'),
      editEnabel: checkPermission('personalUser:personalUserInfo:edit'),
      removeEnable: checkPermission('personalUser:personalUserInfo:remove')
    }
  },
  filters: {
    /* 国家信息列表过滤器 */
    nationalityFilter (type) {
      return nationalityMap[type] === undefined ? '' : nationalityMap[type].text
    },
    /* 实名认证等级过滤器 */
    authlevelFilter (type) {
      return authlevelMap[type] === undefined ? '' : authlevelMap[type].text
    },
    /* 证件类型过滤器 */
    cardTypeFilter (type) {
      return cardTypeMap[type] === undefined ? '' : cardTypeMap[type].text
    },
    // TimeFilter (type) {
    //   return type
    // }
  },
  beforeCreate () {
  },
  created () {
    /* 获取实名认证等级 */
    getDictArray('auth_level').then(async (res) => {
      this.authlevels = res
      this.authlevels.map(d => {
        authlevelMap[d.dictValue] = { text: d.dictLabel }
      })
      this.authlevelMap = authlevelMap
    })

    /* 获取证件类型 */
    getDictArray('card_type').then(resu => {
      this.cardTypes = resu
      this.cardTypes.map(d => {
        cardTypeMap[d.dictValue] = { text: d.dictLabel }
      })
      this.cardTypeMap = cardTypeMap
    })
    //* 获取国家信息列表 */
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
    showModal (record) {
      // var that = this
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
      this.$refs.modal.add(this.cardTypes, this.nationalitys)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record, this.cardTypes, this.nationalitys, this.authlevels)
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
          delPersonalUserInfo({ ids: ids.join(',') }).then(res => {
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
      savePersonalUserInfo(pick(record, 'userId', 'status', 'version')).then(res => {
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
