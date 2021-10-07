<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="5" :sm="15">
            <a-form-item label="用户类型">
              <a-select placeholder="请选择" v-model="queryParam.usertype">
                <a-select-option :value="''">请选择</a-select-option>
                <a-select-option v-for="usertype in options" :key="usertype.value" :value="usertype.value">{{usertype.label }}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="5" :sm="15">
            <a-form-item label="系统名称">
              <a-input placeholder="请输入系统名称" v-model="queryParam.systemName"/>
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
      <a-dropdown >
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
      <span slot="systemName" slot-scope="text">
        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
      </span>
      <span slot="userType" slot-scope="text,record">
        <a-tag v-if="record.userType ==='00' " color="#2db7f5">个人用户</a-tag>
        <a-tag v-else-if="record.userType === '01'" color="#87d068" >机构用户</a-tag>
      </span>
      <span slot="action" slot-scope="text, record">
        <a @click="showModal(record)">详细</a>
        <a-divider type="vertical" />
        <a  @click="handleEdit(record)">编辑</a>
        <a-divider type="vertical" />
        <a  @click="delByIds([record.id])">删除</a>
      </span>
    </s-table>
    <systemUrl-modal ref="modal" @ok="handleOk"/>
    <a-modal v-model="visible" title="应用系统地址信息" on-ok="handleOk" width="600px">
      <template slot="footer">
        <a-button key="back" @click="handleCancel">
          关闭
        </a-button>
      </template>
      <descriptions :column="1" bordered>
        <descriptions-item label="系统名称">
          {{ mdl.systemName }}
        </descriptions-item>
        <descriptions-item label="系统地址">
          {{ mdl.address }}
        </descriptions-item>
        <descriptions-item label="用户类型">
          {{ mdl.userType  | usertypeFilter }}
        </descriptions-item>
        <descriptions-item label="图片地址">
<!--          {{ mdl.imageUrl }}-->
          <img v-if="mdl.imageUrl" :src="mdl.imageUrl" alt="avatar" style="width: 128px;height: 128px"/>

        </descriptions-item>
        <descriptions-item label="备注">
          {{ mdl.remark }}
        </descriptions-item>
      </descriptions>
    </a-modal>
  </a-card>
</template>

<script>
import { STable } from '@/components'
import { getSystemUrlList, delSystemUrl } from '@/api/systemUrl/systemUrl'
import SystemUrlModal from './modules/SystemUrlModal.vue'
import { checkPermission } from '@/utils/permissions'
import Descriptions from '@/components/Descriptions/Descriptions'
export default {
  name: 'TableList',
  components: {
    STable,
    SystemUrlModal,
    Descriptions
  },
  data () {
    return {
      options: [{
        value: '选项1',
        label: '个人用户'
      }, {
        value: '选项2',
        label: '机构用户'
      }],
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
      // 表头
      columns: [
        {
          title: '系统名称',
          dataIndex: 'systemName',
          scopedSlots: { customRender: 'systemName' }
        },
        {
          title: '系统地址',
          dataIndex: 'address'
        },
        {
          title: '用户类型',
          dataIndex: 'userType',
          scopedSlots: { customRender: 'userType' }
        },
        // {
        //   title: '图片地址',
        //   dataIndex: 'imageUrl'
        // },
        {
          title: '备注',
          dataIndex: 'remark'
        },

     /* {
          title: '版本',
           dataIndex: 'version',
           show: false
  },*/
        {
          title: '操作',
          width: '200px',
          dataIndex: 'action',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        return getSystemUrlList(Object.assign(parameter, this.queryParam))
      },
      selectedRowKeys: [],
      addEnable: checkPermission('systemUrl:systemUrl:add'),
      editEnabel: checkPermission('systemUrl:systemUrl:edit'),
      removeEnable: checkPermission('systemUrl:systemUrl:remove')
    }
  },
  filters: {
    usertypeFilter: function (val) {
      if (val === '00') {
        return '个人用户'
      } else if (val === '01') {
        return '机构用户'
      } else {
        return '未知类型'
      }
    }
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
      this.$confirm({
        title: '提示',
        content: '确定删除这条数据 ?',
        onOk: () => {
          delSystemUrl({ ids: ids.join(',') }).then(res => {
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

  }
}
</script>
