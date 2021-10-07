<template>
  <div :class="className" :style="{height:height,width:width}"/>
</template>
<script>
import * as echarts from 'echarts'
import { selectJoinSystemInterfaceNum } from '@/api/backmanage/lastyearInterfaceSum'
require('echarts/theme/macarons') // echarts theme
let monthList = []
let sssList = []
let sumsList = []
let sList = []
export default {
    mixins: [0],
    props: {
        className: {
            type: String,
            default: 'chart',
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
    data() {
        return {
            dataList: null,
            nameList: [],
            numList: [],
            map:{}
        }
    },
    mounted() {
        selectJoinSystemInterfaceNum().then((res) => {
          console.log(res)
            sssList = res.monthList
            console.log(sssList)
             sumsList = res.sumList
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
                title: {
                    text: '接口访问量趋势图', // 主标题
                    x: 'center', // x轴方向对齐方式
                    textStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontSize: 16
                    }
                },
                backgroundColor: '#fff',

                tooltip: {
                    trigger: 'axis',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    axisPointer: {
                        lineStyle: {
                            color: {
                                type: 'linear',
                                x: 0,
                                y: 0,
                                x2: 0,
                                y2: 1,
                                colorStops: [{
                                    offset: 0,
                                    color: 'rgba(244, 185, 90, 0)'
                                }, {
                                    offset: 0.5,
                                    color: 'rgba(244, 185, 90, 0.3)'
                                }, {
                                    offset: 1,
                                    color: 'rgba(244, 185, 90, 0.8)'
                                }],
                                global: false
                            }
                        },
                    },
                },
                grid: {
                    top: '15%',
                    left: '11%',
                    right: '3%',
                    bottom: '8%',
                    // containLabel: true
                },
                xAxis: [{
                    type: 'category',
                    color: '#59588D',
                    //坐标轴
                    axisLabel: {
                        margin: 5,
                        color: '#041730'
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#cccccc',
                        }
                    },
                    axisTick: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    // boundaryGap: true,
                    data: sssList
                       // ['2020-05', '2020-06', '2020-07', '2020-08', '2020-09', '2020-10']

                }],

                yAxis: [{
                    type: 'value',
                    min: 0,
                    splitNumber: 4,
                    axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#041730',
                        }
                    },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            type: 'dashed',
                            color: "#e5e5e5"
                        },
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#cccccc',
                        }
                    },
                    axisTick: {
                        show: false
                    },
                }],
                series: [{
                    name: '',
                    type: 'line',
                    // smooth: true, //是否平滑
                    showAllSymbol: true,
                    symbol: 'circle',
                    symbolSize: 5,
                    lineStyle: {
                        normal: {
                            color: "#f4b959"
                        },
                    },
                    label: {
                        show: false,
                        position: 'top',
                        textStyle: {
                            color: '#48B3FF',
                        }
                    },

                    itemStyle: {
                        color: "#FFF",
                        borderColor: "#f4b959",
                        borderWidth: 1,
                    },
                    tooltip: {
                        show: true
                    },
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(244, 185, 90, 0.7)'
                            }, {
                                offset: 1,
                                color: 'rgba(244, 185, 90, 0)'
                            }], false),
                            shadowColor: 'rgba(244, 185, 90, 0.1)',
                            shadowBlur: 20
                        }
                    },
                    data: sumsList
                      /*  [0, 0, 0, 0, 0, 0, 0, 45, 15208, 1793, 695, 0]*/
                }]
            })
        }
    }
}
</script>
