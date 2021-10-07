<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <a-col :md="5" :sm="15">
                        <a-form-item label="机构名称">
                            <a-input placeholder="请输入机构名称" v-model="queryParam.enterpriseName"/>
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
            <!--<a-button v-if="addEnable" type="primary" icon="plus" @click="$refs.modal.add()">新建</a-button>-->
            <!--<a-dropdown v-if="removeEnable&&selectedRowKeys.length > 0">-->
            <!--<a-button type="danger" icon="delete" @click="delByIds(selectedRowKeys)">删除</a-button>-->
            <!--</a-dropdown>-->
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
        <ellipsis :length="15" tooltip>{{ text }}</ellipsis>
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
        <ellipsis :length="20" tooltip>{{ text | consulateMapFilter }}</ellipsis>
      </span>
            <span slot="statu" slot-scope="text,record">
        <a-switch :checked="record.statu=='1'" @change="onChangeStatus(record)"/>
      </span>

            <span slot="ispass" slot-scope="text,record">
        <a-tag v-if="record.ispass === null || record.ispass ===0 " color="#2db7f5">未审批</a-tag>
        <a-tag v-else-if="record.ispass === 1" color="#87d068">已通过</a-tag>
        <a-tag v-else color="#f50">未通过</a-tag>
      </span>
            <span slot="action" slot-scope="text, record">
          <a @click="showModalX(record)">详情</a>
          <a-divider type="vertical"/>
        <a @click="showModal(record)">审批</a>
                <!--<a @click="handleEdit(record)">审批</a>-->
      </span>
        </s-table>
        <FederationUserListModal ref="modal" @ok="handleOk"/>
        <a-modal v-model="visible" title="海外学联人员信息" on-ok="handleOk" width="600px">
            <template slot="footer" class="nextStep">
                <a-button key="back" @click="handleCancel">
                    关闭
                </a-button>
                <a-button type="primary" @click="handleSucc" v-show="xianshi">
                    通过
                </a-button>
            </template>
            <descriptions :column="1" bordered v-if="update">
                <descriptions-item label="机构名称">
                    {{ mdl.enterpriseName }}
                </descriptions-item>
                <descriptions-item label="机构名称(英文)">
                    {{ mdl.englishName }}
                </descriptions-item>
                <descriptions-item label="国家">
                    {{ mdl.country | nationalityFilter}}
                </descriptions-item>
                <descriptions-item label="地址">
                    {{ mdl.address }}
                </descriptions-item>
                <descriptions-item label="联系人姓名">
                    {{ mdl.hostpersionName }}
                </descriptions-item>
                <descriptions-item label="联系人邮箱">
                    {{ mdl.hostpersionEmail }}
                </descriptions-item>
                <descriptions-item label="联系电话">
                    {{ mdl.hostpersionTelephone }}
                </descriptions-item>
                <descriptions-item label="使领馆名称">
                    {{ mdl.consulateName |consulateMapFilter }}
                </descriptions-item>
                <!--<descriptions-item label="审核状态" :span="3">-->
                    <!--{{ mdl.ispass }}-->
                <!--</descriptions-item>-->
            </descriptions>
        </a-modal>
    </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import {
  getOrgenUserInfoList,
  delOrgenUserInfo,
  saveOrgenUserInfo,
  federationApprove
} from '@/api/backmanage/orgenuser'
import FederationUserListModal from './modules/FederationUserListModal.vue'
import { checkPermission } from '@/utils/permissions'
import pick from 'lodash.pick'
import Descriptions from '@/components/Descriptions/Descriptions'
import { getDictArray } from '@/utils/dict'
import { queryNationality } from '@/api/backmanage/nationality'

const consulateMap = {}
const nationalityMap = {}
export default {
  name: 'TableList',
  components: {
    STable,
    FederationUserListModal,
    Ellipsis,
    Descriptions
  },
  data() {
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
      xianshi: false,
      // 详情页面
      loading: false,
      visible: false,
      update: true,
      // 表头
      columns: [
        {
          title: '机构名称',
          width: 150,
          dataIndex: 'enterpriseName',
          scopedSlots: { customRender: 'enterpriseName' }

        },
        // {
        //   title: '法人姓名',
        //   dataIndex: 'legalName',
        //   scopedSlots: { customRender: 'legalName' }
        // },
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
        // {
        //   title: '联系人手机号',
        //   dataIndex: 'hostpersionTelephone'
        // },
        {
          title: '使领馆名称',
          dataIndex: 'consulateName',
          scopedSlots: { customRender: 'consulateName' }
        },
        {
          title: '审批状态',
          dataIndex: 'ispass',
          scopedSlots: { customRender: 'ispass' }
        },
        {
          title: '操作',
          width: '150px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        parameter.oegUserTpye = '03'
        return getOrgenUserInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      consulateMap: [],
      nationalityMap: [],
      addEnable: checkPermission('orgenUser:orgenUserInfo:add'),
      editEnabel: checkPermission('orgenUser:orgenUserInfo:edit'),
      removeEnable: checkPermission('orgenUser:orgenUserInfo:remove')
    }
  },
  filters: {
    consulateMapFilter(type) {
      return consulateMap[type] === undefined ? '' : consulateMap[type].text
    },
    /* 国家信息列表过滤器 */
    nationalityFilter(type) {
      return nationalityMap[type] === undefined ? '' : nationalityMap[type].text
    }
  },
  async created() {
    /* 获取大使馆字典 */
    getDictArray('consulate_info').then(reset => {
      const cardTypes = reset
      cardTypes.map(d => {
        consulateMap[d.dictValue] = { text: d.dictLabel }
      })
      this.consulateMap = consulateMap
    })
    queryNationality().then(res => {
      this.nationalitys = res
      this.nationalitys.map(d => {
        nationalityMap[d.dictValue] = { text: d.dictLabel.toString() }
      })
      this.nationalityMap = nationalityMap
    })
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    showModal(record) {
      this.xianshi = true
      this.mdl = record
      this.visible = true
    },
    // 展示详细信息
    showModalX(record) {
      this.mdl = record
      this.visible = true
      this.xianshi = false
    },
    // 通过海外学联注册信息的审核
    handleSucc() {
      console.log(this.mdl)
      if (this.mdl.ispass === 1) {
        return this.$message.warning('该审批已通过，请勿重复提交')
      }
      federationApprove(this.mdl).then(res => {
        if (res.status === 0) {
          this.$message.success('审批通过')
          this.$emit('ok')
          this.visible = false
          this.xianshi = false
          this.handleOk()
        } else {
          this.$message.warning(res.message)
        }
      }).catch(() => {
        this.$message.error('系统错误，请稍后再试')
      }).finally(() => {
        this.confirmLoading = false
      })
    },
    handleCancel(e) {
      this.visible = false
      this.xianshi = false
    },
    handleAdd() {
      this.$refs.modal.add()
    },
    handleEdit(record) {
      this.$refs.modal.edit(record)
    },
    handleOk() {
      this.$refs.table.refresh(true)
      console.log('handleSaveOk')
    },
    delByIds(ids) {
      this.$confirm({
        title: '提示',
        content: '确定删除这条数据 ?',
        onOk: () => {
          delOrgenUserInfo({ ids: ids.join(',') }).then(res => {
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.handleOk()
            } else {
              this.$message.error(res.msg)
            }
            this.selectedRowKeys = []
          })
        },
        onCancel() {
        }
      })
    },
    onChangeStatus(record) {
      record.status = record.status === '0' ? '1' : '0'
      const mag = record.status === '0' ? '已禁用' : '已启用'
      saveOrgenUserInfo(pick(record, 'id', 'statu')).then(res => {
        if (res.code === 0) {
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
<style>
    .nextStep {
        text-align: center;
        margin-top: 30px;
    }
</style>
