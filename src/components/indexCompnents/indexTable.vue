<template>
  <div class="mainbox">
    <div class="responsive">
      <div class="box">
        <div class="green">{{monthUserSum}} <span>本月用户活跃数</span></div>
        <div class="green">{{quarterUserSum}} <span >本季用户活跃数</span></div>
        <div class="green">{{yearUserSum}} <span >本年用户活跃数</span></div>

      </div>
      <div class="box">
        <div class="green">{{monthOrganSum}} <span>本月机构活跃数</span></div>
        <div class="green">{{quaterOrganSum}} <span>本季机构活跃数</span></div>
        <div class="green">{{yearOrganSum}} <span >本年机构活跃数</span></div>
      </div>
    </div>
  </div>
</template>
<style  scoped>
  @import "../../assets/styles/indextable.css";
</style>
<script>
import { selectMonthPersonalSum, selectMonthOrganSum,  selectQuarterPersonalSum,selectQuarterOrganSum, selectYearPersonalSum, selectYearOrganSum } from  '@/api/backmanage/indexActiveSum';
export default {
    name: 'TableList',
    components: {
    },
    data () {
        return {
            monthUserSum:'',
            monthOrganSum:'',
            quarterUserSum:'',
            quaterOrganSum:'',
            yearUserSum:'',
            yearOrganSum:'',
        }
    },
    mounted () {
        selectMonthPersonalSum().then((res) =>{
             this.monthUserSum = res
        })
        selectMonthOrganSum().then((res) =>{
            this.monthOrganSum = res
        })
        selectQuarterPersonalSum().then((res) =>{
            this.quarterUserSum = res
        })
        selectQuarterOrganSum().then((res) =>{
            this.quaterOrganSum = res
        })
        selectYearPersonalSum().then((res) =>{
            this.yearUserSum = res
        })
        selectYearOrganSum().then((res) =>{
            this.yearOrganSum = res
        })
    },

}
</script>
