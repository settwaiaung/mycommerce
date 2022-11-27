<template>
  <!-- <v-layout row wrap justify-space-between my-3>
    <v-flex xs2 px-3>
      <v-layout align-center row wrap> -->
  <v-menu
    ref="dateMenu"
    v-model="dateMenu"
    :close-on-content-click="false"
    :return-value.sync="date_value"
    transition="scale-transition"
    offset-y
    min-width="auto"
  >
    <template #activator="{ on }">
      <v-text-field
        v-model="date_value"
        clearable
        :label="label"
        prepend-icon="event"
        readonly
        hide-details
        outlined
        dense
        single-line
        v-on="on"
      />
    </template>
    <v-date-picker
      v-model="date_value"
      no-title
      scrollable
      :min="min"
      :max="new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10)"
      color="primary"
    >
      <v-spacer />
      <v-btn
        text
        color="primary"
        @click="dateMenu = false"
      >
        Cancel
      </v-btn>
      <v-btn
        text
        color="primary"
        @click="$refs.dateMenu.save(date_value)"
      >
        OK
      </v-btn>
    </v-date-picker>
  </v-menu>
  <!-- </v-layout>
    </v-flex>
  </v-layout> -->
</template>
<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    min: {
      type: String,
      default: ''
    }
  },
  data: () => ({
    dateMenu: false
  }),
  computed: {
    date_value: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    }
  }
}
</script>
