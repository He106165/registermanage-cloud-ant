<template>
  <a-row :gutter="40" class="panel-group">
    <a-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="padding-left: 20px; padding-right: 0px;" >
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-cascader">
          <img src="../../assets/image/i2.png"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日活跃用户数
          </div>
         <!-- <count-to :start-val="0" :end-val={} :duration="3600" class="card-panel-num" />-->
          {{todayUserSum}}
        </div>
      </div>
    </a-col>
    <a-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="padding-left: 10px; padding-right: 0px;" >
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-date">
          <img src="@/assets/image/i3.png"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            今日活跃机构数
          </div>
         <!-- <count-to :start-val="0" :end-val={todayOrganSum} :duration="3600" class="card-panel-num" />-->
          {{todayOrganSum}}
        </div>
      </div>
    </a-col>
    <a-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="padding-left: 10px; padding-right: 0px;" >
      <div class="card-panel" >
        <div class="card-panel-icon-wrapper icon-clipboard">
          <img src="@/assets/image/i4.png"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            用户总数
          </div>
         <!-- <count-to :start-val="0" :end-val="personSum" :duration="3600" class="card-panel-num" />-->
          {{personSum}}
        </div>
      </div>
    </a-col>
    <a-col :xs="12" :sm="12" :lg="6" class="card-panel-col" style="padding-left: 10px; padding-right: 20px;" >
      <div class="card-panel" @click="handleSetLineChartData('purchases')">
        <div class="card-panel-icon-wrapper icon-list">
          <img src="@/assets/image/i5.png"/>
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">
            机构总数
          </div>
         <!-- <count-to :start-val="0" :end-val="organSum" :duration="3200" class="card-panel-num" />-->
          {{organSum}}
        </div>
      </div>
    </a-col>

  </a-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { selectTodayUserSum,selectTodayOrganSum} from  '@/api/backmanage/indexActiveSum'
import {selectPersonalSum} from  '@/api/backmanage/newAddPersonalUser'
import {selectOrgenPersonSum} from  '@/api/backmanage/newAddOrganUser';
export default {
  components: {
    CountTo
  },
  data () {
    return {
        dataList: [],
        todayUserSum:'',
        todayOrganSum:'',
        personSum:'',
        organSum:'',
    }
  },
  created () {
  },
  methods: {

  },
  mounted () {
      selectTodayUserSum().then((res) =>{
            this.todayUserSum = res
        })
      selectTodayOrganSum().then((res) =>{
          this.todayOrganSum = res
      })
      selectPersonalSum().then((res) =>{
          this.personSum = res
      })
      selectOrgenPersonSum().then((res) =>{
          this.organSum = res
      });
  }
}
</script>

<style lang="scss" scoped>
.panel-group {
  margin-top: -10px;

  .card-pana-col {
    margin-bottom: 32px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-guide {
        background: #40c9c6;
      }
      .icon-bug {
        background: #f4516c;
      }

      .icon-druid {
        background: #36a3f7;
      }
      .icon-shopping {
        background: #34bfa3
      }
      .icon-date{
        background: #13ce66;
      }
      .icon-cascader{
        background: #ffba00;
      }
      .icon-clipboard{
        background: #1ab394;
      }
      .icon-list{
        background: #1c84c6;
      }

    }
    .icon-guide {
      color: #40c9c6;
    }
    .icon-bug {
      color: #f4516c;
    }
    .icon-druid {
      color: #36a3f7;
    }

    .icon-shopping {
      color: #34bfa3
    }

    .icon-date{
      color: #13ce66;
    }
    .icon-cascader{
      color: #ffba00;
    }

    .icon-clipboard{
      color: #1ab394;
    }
    .icon-list{
      color: #1c84c6;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}

@media (max-width:550px) {
  .card-panel-description {
    display: none;
  }

  .card-panel-icon-wrapper {
    float: none !important;
    width: 100%;
    height: 100%;
    margin: 0 !important;

    .svg-icon {
      display: block;
      margin: 14px auto !important;
      float: none !important;
    }
  }
}
</style>
