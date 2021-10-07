<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>
<script>
import * as echarts from 'echarts'
import {selectNewAddPersonalSum} from  '@/api/backmanage/newAddPersonalUser';
require('echarts/theme/macarons') // echarts theme
export default {
  mixins: [4000],
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
      default: '200px'
    }
  },
  data () {
    return {
      counter: 1,
        todayPersonSum:''
    }
  },
  mounted () {
      selectNewAddPersonalSum().then((res) =>{
          this.todayPersonSum = res
          this.initChart()
      })
  },
  beforeDestroy() {
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
        graphic: [{
          type: 'group',
          left: 'center',
          bottom: '20',
          children: [{
            type: 'text',
            z: 100,
            left: '10',
            bottom: '20',
            style: {
              fill: '#666666',
              text: '本日新增',
              font: '14px Microsoft YaHei'
            }
          }]
        }],
        series: [{
          type: 'liquidFill',
          radius: '90%',
          data: [0.3],
          center: ['50%', '45%'],
          itemStyle: {
            color: 'rgba(249, 143, 142, 0.6)',
            shadowBlur: 0// 波浪的阴影范围
          },
          label: {
            normal: {
              color: '#fff',
              insideColor: 'transparent',
              formatter: this.todayPersonSum + '',
              textStyle: {
                fontSize: 24,
                color: '#666',
                fontWeight: 'normal',
                fontFamily: 'Microsoft YaHei',
              }
            }
          },
          outline: {
            show: false
            // borderDistance: 5,
            // itemStyle: {
            //   borderColor: 'rgba(67,209,100,1)',
            //   borderWidth: 2
            // }
          },
          backgroundStyle: {
            color: {
              type: 'radial',
              x: 0.5,
              y: 0.5,
              r: 0.5,
              colorStops: [{
                offset: 0,
                color: 'rgba(255, 255, 255, 0)' // 0% 处的颜色
              }, {
                offset: 0.8,
                color: 'rgba(255, 255, 255, 0)' // 0% 处的颜色
              }, {
                offset: 1,
                color: 'rgba(249, 143, 142, 0.3)'// 100%处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          }
        }]
      })
    }
  }
}
</script>
