<template>
    <a-card :bordered="false">
        <div class="table-page-search-wrapper">
            <a-form layout="inline">
                <a-row :gutter="48">
                    <!--<a-col :md="5" :sm="15">-->
                    <!--<a-form-item label="名称">-->
                    <!--<a-input placeholder="请输入名称" v-model="queryParam.enterpriseName"/>-->
                    <!--</a-form-item>-->
                    <!--</a-col>-->
                    <a-col :md="5" :sm="15">
                        <a-form-item label="法人姓名">
                            <a-input placeholder="请输入法人姓名" v-model="queryParam.legalName"/>
                        </a-form-item>
                    </a-col>
                    <a-col :md="5" :sm="15">
                        <a-form-item label="证件号">
                            <a-input placeholder="请输入法人姓名" v-model="queryParam.legalIdnumber"/>
                        </a-form-item>
                    </a-col>
                    <!--<a-col :md="5" :sm="15">-->
                    <!--<a-form-item label="实名认证等级">-->
                    <!--<a-select placeholder="请选择" v-model="queryParam.authlevel">-->
                    <!--<a-select-option :value="''">请选择</a-select-option>-->
                    <!--<a-select-option v-for="(d, index) in authlevels" :key="index" :value="d.dictValue">{{ d.dictLabel }}</a-select-option>-->
                    <!--</a-select>-->
                    <!--</a-form-item>-->
                    <!--</a-col>-->
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
        <ellipsis :length="20" tooltip>{{ text }}</ellipsis>
      </span>
            <span slot="authlevel" slot-scope="text">
        {{ text | authlevelFilter }}
      </span>
            <span slot="action" slot-scope="text, record">
          <a @click="showModal(record)">实名认证</a>
                <!--<a  @click="handleEdit(record)">实名认证</a>-->
      </span>
        </s-table>
        <orgen-user-cert-modal ref="modal" @ok="handleOk"/>
        <a-modal v-model="orgenvisible" title="机构人员信息" on-ok="handleOk" width="600px">
            <template slot="footer">
                <a-button key="back" @click="handleCancel">
                    关闭
                </a-button>
                <a-button type="primary" @click="handleSucc">
                    通过
                </a-button>
            </template>
            <descriptions :column="1" bordered v-if="update">
                <descriptions-item label="名称">
                    {{ mdl.enterpriseName }}
                </descriptions-item>
                <descriptions-item label="法人姓名">
                    {{ mdl.legalName }}
                </descriptions-item>
                <descriptions-item label="联系人姓名">
                    {{ mdl.hostpersionName }}
                </descriptions-item>
                <descriptions-item label="联系人邮箱">
                    {{ mdl.hostpersionEmail }}
                </descriptions-item>
                <descriptions-item label="联系人手机号">
                    {{ mdl.hostpersionTelephone }}
                </descriptions-item>
                <descriptions-item label="实名认证等级">
                    {{ mdl.authlevel | authlevelFilter }}
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
import { getOrgenUserInfoList, delOrgenUserInfo, saveOrgenUserInfo } from '@/api/backmanage/orgenuser'
import OrgenUserCertModal from './modules/OrgenUserCertModal.vue'
import { checkPermission } from '@/utils/permissions'
import { getDictArray } from '@/utils/dict'
import Descriptions from '@/components/Descriptions/Descriptions'
import { orgenAuthentication } from '../../api/backmanage/orgenuser'
import pick from 'lodash.pick'

const authlevelMap = {}
export default {
  name: 'TableList',
  components: {
    STable,
    OrgenUserCertModal,
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
      orgenvisible: false,
      // 查询参数
      queryParam: {},
      // 表头
      columns: [
        {
          title: '名称',
          width: 150,
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
          title: '实名认证等级',
          dataIndex: 'authlevel',
          scopedSlots: { customRender: 'authlevel' }
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
        parameter.oegUserTpye = '00'
        parameter.authlevel = '2'
        return getOrgenUserInfoList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      selectedRows: [],
      authlevels: [],
      authlevelMap: null,
      addEnable: checkPermission('orgenUser:orgenUserInfo:add'),
      editEnabel: checkPermission('orgenUser:orgenUserInfo:edit'),
      removeEnable: checkPermission('orgenUser:orgenUserInfo:remove')
    }
  },
  filters: {
    /* 实名认证等级过滤器 */
    authlevelFilter(type) {
      return authlevelMap[type] === undefined ? '' : authlevelMap[type].text
    }
  },
  created() {
    /* 获取实名认证等级 */
    getDictArray('auth_level').then(res => {
      const authlevels = res
      authlevels.map(d => {
        authlevelMap[d.dictValue] = { text: d.dictLabel }
      })
      this.authlevelMap = authlevelMap
    })
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    handleAdd () {
      this.$refs.modal.add()
    },
    handleEdit (record) {
      this.$refs.modal.edit(record)
    },
    showModal (record) {
      this.orgenvisible = true
      this.mdl = record
      // 移除组件
      this.update = false
      // 在组件移除后，重新渲染组件
      // this.$nextTick可实现在DOM 状态更新后，执行传入的方法。嗯，花了我半天时间
      this.$nextTick(() => {
        this.update = true
      })
    },
    handleSucc () {
      orgenAuthentication(this.mdl).then(res => {
        if (res.status === 0) {
          this.$message.success('认证成功')
          this.$emit('ok')
          this.orgenvisible = false
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
      this.orgenvisible = false
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
