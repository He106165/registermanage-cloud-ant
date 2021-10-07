<template>
  <div class="page-header-index-wide">
    <panel-group></panel-group>

    <a-row :gutter="100" style="margin-top: 7px;margin-left: 1px;">
      <a-col :xs="22" :sm="22" :lg="8" style="background-color: white; margin-top: 10px; width: 32%;height: 260px;">
        <div class="chart-wrapper" style="padding: 1px;">
          <div style="font-size:23px; text-align: center;margin-top: 10px; ">个人变动</div>
          <number-chart-pro-add-day style="display:inline;width: 100px; float: left"/>
          <number-chart-pro-add-month style="display:inline;width: 100px;float: left"/>
          <number-chart-pro-add-year style="display:inline;width: 100px;float: left"/>
        </div>
      </a-col>
      <a-col :xs="22" :sm="22" :lg="8"
             style="background-color: white; padding-left: 20px; margin-top: 10px;  width: 32%;height: 260px;">
        <div class="chart-wrapper">
          <div style="font-size:23px; text-align: center;margin-top: 10px; margin-left: -30px;">机构变动</div>
          <number-chart-org-add-day style="display:inline;width: 100px; float: left"/>
          <number-chart-org-add-month style="display:inline;width: 100px;float: left"/>
          <number-chart-org-add-year style="display:inline;width: 100px;float: left"/>
        </div>
      </a-col>
      <a-col :xs="22" :sm="22" :lg="8"
             style="background-color: white; padding-left: 0px; margin-top: 10px;  width: 32%;height: 260px;">
        <div class="chart-wrapper">
          <div style="font-size:23px; text-align: center;margin-top: 10px; ">活跃用户情况</div>
          <index-table></index-table>
        </div>
      </a-col>
    </a-row>
      <el-row :gutter="32">
        <el-col :xs="24" :sm="24" :lg="12">
           <div class="chart-c">
             <bar-data-chart/>
           </div>
        </el-col>
        <el-col :xs="24" :sm="24" :lg="12">
           <div class="chart-d">
            <ring-chart/>
           </div>
        </el-col>
      </el-row>
    <!--<page-view :avatar="avatar" :title="false">-->
    <!--<div>-->
    <!--<a-row :gutter="24">-->
    <!--<a-col>-->
    <!--<a-card :bordered="false">-->
    <!--<div style="font-size: 20px;">{{ timeFix }}，{{ user.userName }}，{{ welcome }}</div>-->
    <!--<div>&nbsp;</div>-->
    <!--<p style="font-size: 32px;"><strong>欢迎使用统一用户注册服务系统</strong></p>-->
    <!--</a-card>-->
    <!--</a-col>-->
    <!--</a-row>-->
    <!--</div>-->
    <!--</page-view>-->
  </div>
</template>

<script>
    import {PageView} from '@/layouts'
    import PanelGroup from '@/components/indexCompnents/PanelGroup'
    import NumberChartProAddDay from '@/components/indexCompnents/NumberChart-ProAddDay'
    import NumberChartProAddMonth from '@/components/indexCompnents/NumberChart-ProAddMonth'
    import NumberChartProAddYear from '@/components/indexCompnents/NumberChart-ProAddYear'

    import NumberChartOrgAddDay from '@/components/indexCompnents/NumberChart-OrgAddDay'
    import NumberChartOrgAddMonth from '@/components/indexCompnents/NumberChart-OrgAddMonth'
    import NumberChartOrgAddYear from '@/components/indexCompnents/NumberChart-OrgAddYear'
    import indexTable from '@/components/indexCompnents/indexTable'
    import BarDataChart from '@/components/indexCompnents/BarDataChart'
    import RingChart from '@/components/indexCompnents/RingChart'

    export default {
        name: 'Workplace',
        components: {
            PageView,
            PanelGroup,
            NumberChartProAddDay,
            NumberChartProAddMonth,
            NumberChartProAddYear,
            NumberChartOrgAddDay,
            NumberChartOrgAddMonth,
            NumberChartOrgAddYear,
            indexTable,
            BarDataChart,
            RingChart
        },
        data() {
            return {}
        },
        computed: {},
        created() {
        }
    }

</script>

<style lang="scss" scoped>
  .chart-c {
   position: relative;
    overflow: hidden;
    width: 49%;
    padding: 17px 10px 10px 0;
    margin-left: 0.5%;
    margin-right: 0px;
    border-width: 0px;
    cursor: default;
    display: inline;
    float: left;
  }
  .chart-d {
    position: relative;
    overflow: hidden;
    width: 49%;
    padding: 17px 0 0 10px;
    margin-right: 10px;
    margin-left: 0.5%;
    border-width: 0px;
    cursor: default;
    display: inline;
    float: right;
  }
</style>