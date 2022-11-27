<template>
  <div>
    <v-subheader v-show="showHistory" v-if="showHistory&&histories.length>0">
      HISTORIES
    </v-subheader>
    <v-subheader v-if="showHistory&&histories.length===0" class="error--text">
      NO RELATED HISTORIES
    </v-subheader>
    <v-progress-linear
      v-show="loadingData"
      :indeterminate="loadingData"
      color="primary"
    />
    <v-timeline
      v-if="showHistory && histories.length>0"
      align-top
      dense
      class="mr-1"
    >
      <v-timeline-item
        v-for="(log,index) in histories"
        :key="index"
        color="primary"
        small
        left
        class="pa-1"
      >
        <strong class="mr-2">{{ log.created_by }}</strong>
        <strong>{{ log.status_mm }}</strong>
        <div class="text-caption d-flex flex-row justify-space-between">
          <strong>{{ log.created_date }}</strong>
          <strong class="text-right">{{ log.created_time }}</strong>
        </div>
      </v-timeline-item>
    </v-timeline>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: Boolean,
    historyUrl: {
      type: String,
      default: ''
    },
    historyData: {
      type: Array,
      default: () => []
    }
  },
  data: () => ({
    loadingData: false,
    histories: []
  }),
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    showHistory: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  watch: {
    showHistory: {
      async handler (newVal, oldVal) {
        if (newVal === true && oldVal !== newVal) {
          if (!this.historyUrl) {
            this.histories = this.historyData
            return
          }
          try {
            this.loadingData = true
            const { data, message, status } = await this.$request.fetchData(`${this.historyUrl}`, this.jwt)
            if (status === 1) {
              this.histories = data
              this.loadingData = false
            } else {
              this.loadingData = false
              this.handleStatus({ status, message, that: this })
            }
          } catch (error) {
            this.handleException({ error, that: this })
          }
        }
      },
      deep: true
    }
  }
}
</script>
