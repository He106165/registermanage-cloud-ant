<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="名称">
              <a-input placeholder="请输入名称" v-model="queryParam.enterpriseName"/>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="法人姓名">
              <a-input placeholder="请输入法人姓名" v-model="queryParam.legalName"/>
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
      rowKey="orgUserId"
      :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
      :columns="columns"
      :data="loadData"
    >
      <span slot="enterpriseName" slot-scope="text">
        <ellipsis :length="30" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="legalName" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="hostpersionName" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>

      <span slot="hostpersionEmail" slot-scope="text">
        <ellipsis :length="18" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="consulateName" slot-scope="text">
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="statu" slot-scope="text,record">
        <a-switch :checked="record.statu=='1'" @change="onChangeStatus(record)"/>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a  @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a  @click="delByIds([record.orgUserId])">删除</a>
      </span>
    </s-table>
    <orgenUserInfo-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="机构人员信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered v-if="update">
          <descriptions-item label="名称" >
            {{ mdl.enterpriseName }}
          </descriptions-item>
          <descriptions-item label="法人姓名" >
            {{ mdl.legalName }}
          </descriptions-item>
          <descriptions-item label="联系人姓名" >
            {{ mdl.hostpersionName }}
          </descriptions-item>
          <descriptions-item label="联系人邮箱" >
            {{ mdl.hostpersionEmail }}
          </descriptions-item>
          <descriptions-item label="联系人手机号" >
            {{ mdl.hostpersionTelephone }}
          </descriptions-item>
        </descriptions>

        <!--<detail-list size="small" :col="2" >-->
          <!--<detail-list-item term="邮箱" >{{ mdl.email }}</detail-list-item>-->
        <!--</detail-list>-->
        <!--<detail-list size="small" :col="2" >-->
          <!--<detail-list-item term="手机号" >{{ mdl.phone }}</detail-list-item>-->
        <!--</detail-list>-->
        <!--<detail-list size="small" :col="2" >-->
          <!--<detail-list-item term="实名认证等级" >{{ mdl.authlevel | authlevelFilter }}</detail-list-item>-->
        <!--</detail-list>-->
    </a-modal>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import { queryNationality } from '@/api/backmanage/nationality'
import { getOrgenUserInfoList, delOrgenUserInfo, saveOrgenUserInfo } from '@/api/backmanage/orgenuser'
import OrgenUserInfoModal from './modules/OrgenUserInfoModal.vue'
import { checkPermission } from '@/utils/permissions'
import pick from 'lodash.pick'
import { getDictArray } from '@/utils/dict'
import Descriptions from '@/components/Descriptions/Descriptions'
const consulateMap = {}
const authlevelMap = {}
const cardTypeMap = {}
const nationalityMap = {}
export default {
  name: 'TableList',
  components: {
    STable,
    OrgenUserInfoModal,
    Ellipsis,
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
          title: '名称',
          width: 250,
          dataIndex: 'enterpriseName',
          scopedSlots: { customRender: 'enterpriseName' }

        },
        {
          title: '法人姓名',
          dataIndex: 'legalName',
          scopedSlots: { customRender: 'legalName' }
        },
        {
          title: '联系人姓名',
          dataIndex: 'hostpersionName',
          scopedSlots: { customRender: 'hostpersionName' }

        },
        {
          title: '联系人邮箱',
          dataIndex: 'hostpersionEmail',
          scopedSlots: { customRender: 'hostpersionEmail' }

        },
        {
          title: '联系人手机号',
          dataIndex: 'hostpersionTelephone'
        },
        // {
        //   title: '使领馆名称',
        //   dataIndex: 'consulateId',
        //   scopedSlots: { customRender: 'consulateId' }
        // },
        {
          title: '状态',
          dataIndex: 'statu',
          scopedSlots: { customRender: 'statu' }
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
        return getOrgenUserInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      nationalitys: [],
      authlevels: [],
      cardTypes: [],
      consulates: [],
      nationalityMap: null,
      authlevelMap: null,
      cardTypeMap: null,
      consulateMap: null,
      organUserType: null,
      addEnable: checkPermission('orgenUser:orgenUserInfo:add'),
      editEnabel: checkPermission('orgenUser:orgenUserInfo:edit'),
      removeEnable: checkPermission('orgenUser:orgenUserInfo:remove')
    }
  },
  filters: {
    consulateMapFilter (type) {
      return consulateMap[type] === undefined ? '' : consulateMap[type].text
    }
  },
  created () {
    /* 获取大使馆字典 */
    // getDictArray('consulate_info').then(res => {
    //   this.consulates = res
    //   this.consulates.map(d => {
    //     consulateMap[d.dictValue] = { text: d.dictLabel }
    //   })
    //   this.consulateMap = consulateMap
    // })
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
      console.info(resu)
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
    // 机构用户类型
    getDictArray('organ_type').then(resu => {
      this.organUserType = resu
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
      this.$refs.modal.add(this.nationalitys, this.authlevels, this.cardTypes, this.organUserType)
    },
    handleEdit (record) {
      this.$refs.modal.edit(record, this.nationalitys, this.authlevels, this.cardTypes, this.organUserType)
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
          delOrgenUserInfo({ids: ids.join(',')}).then(res => {
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
      record.statu = record.statu === '0' ? '1' : '0'
      const mag = record.statu === '0' ? '已禁用' : '已启用'
      saveOrgenUserInfo(pick(record, 'orgUserId', 'statu')).then(res => {
        if (res.code === 0) {
          this.$message.success(mag)
          this.reload()
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
