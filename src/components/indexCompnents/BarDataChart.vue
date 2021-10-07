<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>
<script>
import * as echarts from 'echarts'
import { selectWeekPersonalNum } from '@/api/backmanage/LastweekSum';
require('echarts/theme/macarons') // echarts theme
let WeekPersonalNum = []
export default {
  mixins: [0],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data () {
    return {
      chart: null,
      nameList: [],
      numList: []
    }
  },
  created () {
  },
  mounted () {
    selectWeekPersonalNum().then((res) => {
      WeekPersonalNum = res
      this.initChart()
    })
  },
  beforeDestroy () {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart () {
      this.chart = echarts.init(this.$el, 'macarons')
      this.chart.setOption({
        title: {
          text: '最近一周用户新增情况', // 主标题
          x: 'center', // x轴方向对齐方式
          textStyle: {
            color: '#333',
            fontStyle: 'normal',
            fontSize: 16
          }
        },
        grid: {
          top: '15%',
          left: '8%',
          right: '3%',
          bottom: '8%'
          // containLabel: true
        },
        backgroundColor: '#ffffff',
        tooltip: {
          trigger: 'axis',
          formatter: '{b} : {c}',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        xAxis: {
          data: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
          // 坐标轴
          axisLabel: {
            margin: 5,
            color: '#041730'
          },
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          axisTick: {
            show: false
          }
        },
        yAxis: {
          // 坐标值标注
          axisLabel: {
            show: true,
            textStyle: {
              color: '#041730'
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              type: 'dashed',
              color: '#e5e5e5'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#cccccc'
            }
          },
          axisTick: {
            show: false
          }
        },
        series: [{
          name: 'a',
          tooltip: {
            show: false
          },
          type: 'bar',
          barWidth: 24.5,
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [{
                offset: 0,
                color: '#0B4EC3' // 0% 处的颜色
              }, {
                offset: 0.6,
                color: '#138CEB' // 60% 处的颜色
              }, {
                offset: 1,
                color: '#17AAFE' // 100% 处的颜色
              }], false)
            }
          },
          data: WeekPersonalNum
        }]
      })
    }
  }
}
</script>
