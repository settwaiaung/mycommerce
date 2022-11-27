<template>
  <v-card min-height="300">
    <v-card-title>Sales Summary</v-card-title>
    <v-card-text>
      <v-sparkline
        :fill="fill"
        :gradient="selectedGradient"
        :line-width="width"
        :padding="padding"
        :smooth="radius || false"
        :value="summaryData.datasets"
        auto-draw
        :labels="summaryData.labels"
      />
    </v-card-text>
  </v-card>
</template>
<script>
const gradients = [
  ['#222'],
  ['#42b3f4'],
  ['red', 'orange', 'yellow'],
  ['purple', 'violet'],
  ['#00c6ff', '#F0F', '#FF0'],
  ['#f72047', '#ffd200', '#1feaea']
]
export default {
  props: {
    data: {
      type: Array,
      default: () => ([])
    }
  },
  data: () => ({
    fill: true,
    selectedGradient: gradients[4],
    gradients,
    padding: 8,
    radius: 10,
    value: [0, 2, 5, 9, 5, 10, 3, 5, 0, 0, 1, 8, 2, 9, 0],
    width: 2
  }),
  computed: {
    summaryData () {
      const sale_summary_data = this.data.map(sum => parseInt(sum.count))
      // sale_summary_data = [3, 1, ...sale_summary_data]
      let sale_summary_labels = this.data.map(sum => parseInt(sum.month))
      // sale_summary_labels = [4, 5, ...sale_summary_labels]
      // let start = sale_summary_labels[0]
      // let end = sale_summary_labels.slice(-1)[0]
      // if(start>1) {
      //   for(i=0;i<start-1;i++) {
      //     sale_summary_data[i] =
      //   }
      // }
      sale_summary_labels = sale_summary_labels.map((sum) => {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
          'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
        ]
        sum = monthNames[sum - 1]
        return sum
      })
      const summaryData = {
        labels: sale_summary_labels,
        datasets: sale_summary_data
      }
      return summaryData
    }
  }
}
</script>
