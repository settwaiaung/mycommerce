<template>
  <v-card
    v-if="supplier&& Object.keys(supplier).length>0"
    flat
    elevation="2"
  >
    <v-card-title class="pa-2 primary">
      <h3 class="text-h6 font-weight-light text-center grow">
        {{ supplier.name }}
      </h3>
      <v-avatar>
        <v-img
          src="/3d-characters/customer_boy.png"
        />
      </v-avatar>
    </v-card-title>
    <v-card-text>
      <v-list v-if="supplier.phone" color="transparent" flat>
        <v-list-item v-for="(item,key) in supplierInfoata" :key="key" dense>
          <v-list-item-icon v-if="item">
            <v-icon>
              {{ key }}
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content v-if="item">
            <v-list-item-title class="text-wrap" v-text="item" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <slot />
    </v-card-text>
  </v-card>
</template>
<script>
export default {
  name: 'SupplierInfo',
  props: {
    supplier: {
      type: Object,
      default: () => {}
    },
    note: {
      type: String,
      default: ''
    }
  },
  computed: {
    supplierInfoata () {
      const infoData = {
        'mdi-phone': this.supplier.phone,
        'mdi-city': 'city' in this.supplier ? `${this.supplier.city.name}` : '',
        'mdi-city-variant': 'city' in this.supplier ? `${this.supplier.zone.name}` : '',
        'mdi-map-marker-outline': this.supplier.address ? this.supplier.address : ''
      }
      if (this.supplier.note) {
        infoData['mdi-calendar-text'] = this.suppler.note
      }
      return infoData
    }
  }
}
</script>
