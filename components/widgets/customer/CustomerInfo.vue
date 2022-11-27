<template>
  <v-card
    v-if="customer&& Object.keys(customer).length>0"
    flat
    elevation="2"
  >
    <v-card-title class="pa-2 primary">
      <h3 class="text-h6 font-weight-light text-center grow">
        {{ customer.name }}
      </h3>
      <v-avatar>
        <v-img
          src="/3d-characters/customer_boy.png"
        />
      </v-avatar>
    </v-card-title>
    <v-card-text>
      <!-- <v-list color="transparent" flat>
        <v-list-item v-show="customer.phone" dense>
          <v-list-item-icon>
            <v-icon>
              mdi-phone
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="customer.phone" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-show="customerCity" dense>
          <v-list-item-icon>
            <v-icon>
              mdi-city
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ customerCity }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-show="customerAddress" dense>
          <v-list-item-icon>
            <v-icon>
              mdi-map-marker-outline
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-wrap">
              {{ customerAddress }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-show="note" dense>
          <v-list-item-icon>
            <v-icon>
              mdi-calendar-text
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-wrap">
              {{ note }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-show="deliveryAddress" dense>
          <v-list-item-icon>
            <v-icon>
              mdi-map-marker
            </v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title class="text-wrap">
              {{ deliveryAddress }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list> -->
      <!-- <div v-for="(item,key) in customerInfoata" :key="key" class="customer_info_data py-2 text-wrap">
        <v-icon v-show="item">
          {{ key }}
        </v-icon>
        <strong v-show="item" class="text-wrap">{{ item }}</strong>
      </div> -->
      <v-list v-if="customer.phone" color="transparent" flat>
        <v-list-item v-for="(item,key) in customerInfoata" :key="key" dense>
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
  name: 'CustomerInfo',
  props: {
    customer: {
      type: Object,
      default: () => {}
    },
    note: {
      type: String,
      default: ''
    }
  },
  computed: {
    deliveryAddress () {
      return this.customer.delivery_address ? this.customer.delivery_address : ''
    },
    customerInfoata () {
      const infoData = {
        'mdi-phone': this.customer.phone,
        'mdi-city': 'city' in this.customer ? `${this.customer.city.name}` : '',
        'mdi-city-variant': 'city' in this.customer ? `${this.customer.zone.name}` : '',
        'mdi-map-marker-outline': this.customer.address ? this.customer.address : ''
      }
      if (this.customer.note) {
        infoData['mdi-calendar-text'] = this.customer.note
      }
      if (this.customer.delivery_address) {
        infoData['mdi-map-marker'] = this.customer.delivery_address
      }
      return infoData
    }
  }
}
</script>
