<template>
  <v-card v-if="model&& Object.keys(model).length>0" id="print_component" flat>
    <v-card-text>
      <div class="tw-flex print:tw-hidden">
        <v-spacer />
        <button
          class="
            tw-outline
            tw-outline-1
            tw-text-indigo-400 py-2 px-4
            tw-rounded tw-shadow hover:tw-shadow-xl
            tw-duration-300"
          @click="showPrint=!showPrint"
        >
          <v-icon
            dark
            color="primary"
          >
            mdi-arrow-left-bold-box
          </v-icon>
          Back
        </button>
        <button
          onclick="window.print()"
          class="
          tw-mx-2
          tw-bg-indigo-400 py-2 px-4
          tw-rounded tw-shadow hover:tw-shadow-xl
          tw-duration-300"
        >
          Print This Page
        </button>
      </div>
      <div class="tw-flex tw-justify-between tw-mt-10 tw-mb-5 tw-items-center">
        <div class="tw-flex tw-w-max tw-text-xl tw-flex-wrap tw-gap-3">
          <p class="tw-font-bold ">
            Assign Incharge
          </p>
          <p>{{ model.name }}</p>
        </div>
        <div class="tw-flex">
          <p class="tw-font-bold tw-text-xl tw-text-black">
            Bottle Return Form
          </p>
        </div>
        <div class="tw-flex tw-w-max tw-justify-end tw-text-xl tw-flex-wrap tw-gap-3">
          <p class="tw-font-bold ">
            Date
          </p>
          <p>{{ model.date }}</p>
        </div>
      </div>

      <table class="tw-w-full">
        <thead>
          <tr>
            <th rowspan="2">
              No
            </th>
            <th rowspan="2">
              Marathon Vr-No
            </th>
            <th rowspan="2">
              MS Invoice
            </th>
            <th rowspan="2">
              Cuetomer Name
            </th>
            <th rowspan="2">
              Phone
            </th>
            <th colspan="2">
              ပြန်ယူရမည့် ဘူးအရေအတွက်
            </th>
            <th rowspan="2">
              ပြန်အပ်သည့်
              <br>
              (Date)
            </th>
          </tr>
          <tr>
            <th>
              10 ပိသာ
            </th>
            <th>
              5 ပိသာ
            </th>
            <th />
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(item,index) in model.bottles"
            :key="item.id"
          >
            <td>{{ index+1 }}</td>
            <td>{{ item.voucher_no }}</td>
            <td>{{ item.invoice_no }}</td>
            <td>{{ item.customer_name }}</td>
            <td>{{ item.customer_phone }}</td>
            <td>{{ item.qty_10v }}</td>
            <td>{{ item.qty_5v }}</td>
            <td />
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" style="background-color:cyan !important">
              Total
            </td>
            <td>{{ model.total_10_v }}</td>
            <td>{{ model.total_5_v }}</td>
            <td />
          </tr>
        </tfoot>
      </table>
      <div class="tw-flex tw-justify-between tw-mt-8 ">
        <div class="tw-text-center">
          <p>ဘူးခွံလက်ခံသူလက်မှတ်</p>
          <p />
        </div>
        <div class="tw-text-center">
          <p>Pick Up သူလက်မှတ်</p>
          <p>Marathon</p>
        </div>
        <div class="tw-text-center">
          <p>ဘူးခွံပြန်အပ်သူလက်မှတ်</p>
          <p>Marathon</p>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: Boolean,
    model: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    showPrint: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    }
  },
  mounted () {
    this.$store.dispatch('setDrawer', false)
  },
  methods: {
    print () {
      setTimeout(() => window.print(), 1000)
    },
    closeForm (data = null, action = null) {
      this.$emit('onGoBack', data, action)
    }
  }
}
</script>

<style scoped>
@media print {
table {
  color-adjust: exact
}
}
thead{
  background-color:cyan  !important;
}
  table,tr,th,td{
    border:1px solid black;
  }

  th,td{
    height: 50px;
    text-align: center;
  }
</style>
