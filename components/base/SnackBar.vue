<template>
  <v-snackbar
    v-model="showSnack"
    :elevation="24"
    top
    centered
    :timeout="5000 * 1"
    light
    :color="snackColor"
    outlined
    :class="{'ml-0': $vuetify.breakpoint.smAndDown, 'ml-12': $vuetify.breakpoint.mdAndUp,'d-print-none':true}"
  >
    <!-- shaped -->
    {{ snackMessage }}
    <v-icon
      color="warning"
      text
      small
      right
      style="float:right"
      @click="setShowSnack(false)"
    >
      close
    </v-icon>
  </v-snackbar>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters({
      snackMessage: 'snackMessage',
      snackColor: 'snackColor'
    }),
    showSnack: {
      get () {
        return this.$store.state.showSnack
      },
      set (val) {
        this.$store.dispatch('setShowSnack', val)
      }
    }
  },
  methods: {
    ...mapMutations({
      setShowSnack: 'setShowSnack'
    })
  }
}
</script>
<style lang="sass">
$snackbar-background-color:red !default
</style>
