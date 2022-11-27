/* eslint-disable vue/no-side-effects-in-computed-properties */

<template>
  <v-card>
    <v-card-text>
      <div class="layout row ma-0 align-center justify-space-between">
        <div class="text-box">
          <div class="subheading pb-2">
            {{ title }}
          </div>
          <span class="grey--text">{{ subTitle }} <v-icon small :color="iconColor">{{ icon }}</v-icon></span>
        </div>
        <div class="chart">
          <e-chart
            :path-option="computeChartOption"
            height="68px"
            width="100%"
          />
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import EChart from '@/components/utils/echart'
export default {
  components: {
    EChart
  },
  props: {
    title: {
      type: String,
      require: true,
      default: ''
    },
    subTitle: {
      type: String,
      default: ''
    },
    icon: {
      type: String,
      default: ''
    },
    iconColor: {
      type: String,
      default: 'success'
    },
    type: {
      type: String,
      default: ''
    },
    chartColor: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      defaultOption: [
        ['dataset.source', this.data],
        ['xAxis.show', false],
        ['yAxis.show', false],
        ['color', [this.chartColor]]
      ]
    }
  },

  computed: {
    computeChartOption () {
      switch (this.type) {
        case 'bar':
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].type', 'bar'])
          break
        case 'area':
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].type', 'line'])
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].areaStyle', {}])
          break
        default:
          break
      }
      return this.defaultOption
    }
  }

}
</script>
