<template>
  <LineChart :data="barChartData" :options="barChartOptions" :height="400" />
</template>

<script>
import LineChart from '~/components/utils/LineChart.vue'
export default {
  components: { LineChart },
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data () {
    return {
      barChartDataOld: {
        labels: [
          '2019-06',
          '2019-07',
          '2019-08',
          '2019-09',
          '2019-10',
          '2019-11',
          '2019-12',
          '2020-01',
          '2020-02',
          '2020-03'
        ],
        datasets: [
          {
            label: 'Visualizaciones',
            data: [2, 61, 16, 3, 4, 5, 0, 0, 4, 12, 2],
            backgroundColor: 'rgba(20, 255, 0, 0.3)',
            borderColor: 'rgba(100, 255, 0, 1)',
            borderWidth: 2
          }
        ]
      },
      barChartOptions: {
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Google analytics data',
          fontSize: 24,
          fontColor: '#6b7280'
        },
        tooltips: {
          backgroundColor: '#17BF62'
        },
        scales: {
        //   xAxes: [
        //     {
        //       gridLines: {
        //         display: true
        //       }
        //     }
        //   ]
        //   yAxes: [
        //     {
        //       ticks: {
        //         beginAtZero: true,
        //         max: 3,
        //         min: 0,
        //         stepSize: 0
        //       },
        //       gridLines: {
        //         display: true
        //       }
        //     }
        //   ]
        }
      }
    }
  },
  computed: {
    barChartData () {
      let sale_summary_data = this.data.map(sum => parseInt(sum.count))
      sale_summary_data = [...sale_summary_data, 2, 1, 16, 3, 4, 5, 0, 0, 4, 12, 2]
      let sale_summary_labels = this.data.map(sum => parseInt(sum.month))
      sale_summary_labels = [...sale_summary_labels, 1, 2, 3, 4, 5, 5, 7, 8, 9, 10, 11]
      sale_summary_labels = sale_summary_labels.map((sum) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
        ]
        sum = monthNames[sum - 1]
        return sum
      })
      const data = {
        labels: sale_summary_labels,
        datasets: [
          {
            label: 'Visualizaciones',
            data: sale_summary_data,
            backgroundColor: 'rgba(20, 255, 0, 0.3)',
            borderColor: 'rgba(100, 255, 0, 1)',
            borderWidth: 2
          }
        ]
      }
      return data
    }
  }
}
</script>
