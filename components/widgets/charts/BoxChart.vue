<template>
  <v-card :color="cardColor" :dark="computeCardDark">
    <v-card-title>
      <div class="layout row ma-0">
        <div class="subheading">
          {{ title }}
        </div>
        <v-spacer />
        <div class="caption">
          <v-icon>trending_up</v-icon>  {{ subTitle }}
        </div>
      </div>
    </v-card-title>
    <v-responsive class="white--text">
      <e-chart
        :path-option="computeChartOption"
        height="308px"
        width="100%"
      />
    </v-responsive>
  </v-card>
</template>

<script>
// import Material from 'vuetify/es5/util/colors'
import EChart from '@/components/utils/echart'

export default {
  components: {
    EChart
  },
  props: {
    title: String,
    gradient: {
      type: Boolean,
      default: false
    },
    subTitle: String,
    icon: String,
    cardColor: {
      type: String,
      default: 'white'
    },
    iconColor: {
      type: String,
      default: 'success'
    },
    type: String,
    chartColor: Array,
    data: Array
  },
  data () {
    return {
      defaultOption: [
        ['dataset.source', this.data],
        ['xAxis.show', false],
        ['yAxis.show', false],
        ['grid.top', '15%'],
        ['grid.left', '0'],
        ['grid.bottom', '0'],
        ['grid.right', '0'],
        ['color', this.chartColor]
      ]
    }
  },

  computed: {
    computeCardDark () {
      return this.cardColor !== 'white'
    },
    computeChartOption () {
      switch (this.type) {
        case 'bar':
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].type', 'bar'])
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].barWidth', '50%'])
          // add shadow series
          // this.defaultOption.push(['series[1].type', 'bar']);
          break
        case 'stack-bar':
          // set stacked bar
          // this.defaultOption.push(['series[0].data', StackBarData]);
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].type', 'bar'])
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].itemStyle.normar.color', 'rgba(0,0,0,0.05)'])
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].barGap', '-100%'])
          // set main series
          // this.defaultOption.push(['series[1].data', StackData]);
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[1].type', 'bar'])
          break
        case 'area':
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].type', 'line'])
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].smooth', true])
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['xAxis.boundaryGap', false])
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].areaStyle', {}])
          if (this.gradient) {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.defaultOption.push(['series[0].areaStyle', {
              normal: {
                color: new window.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    color: this.chartColor[0]
                  },
                  {
                    offset: 1,
                    color: this.chartColor[1]
                  }
                ])
              }
            }])
          }

          break
        default:
          // line
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['series[0].smooth', true])
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.defaultOption.push(['xAxis.boundaryGap', false])
          break
      }
      return this.defaultOption
    }
  }

}
</script>

<style>

</style>
