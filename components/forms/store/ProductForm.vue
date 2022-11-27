<template>
  <v-stepper-content class="pa-0" step="2">
    <v-card>
      <v-progress-linear
        v-show="isLoading"
        :indeterminate="isLoading"
        color="primary"
      />
      <validation-observer
        ref="observer"
      >
        <v-form ref="form" @submit.prevent="onSaveProduct" @keyup.enter="onSaveProduct">
          <v-card-title class="primary--text">
            {{ model.id?model.name:'New Product' }}
            <v-spacer />
            <v-btn
              outlined
              color="primary"
              class="mx-1"
              @click="closeForm()"
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="disabledButton"
              color="primary"
              type="submit"
              :loading="isLoading"
            >
              {{ model.id?'Update':'Save' }}
            </v-btn>
          </v-card-title>
          <v-divider />
          <v-card-text>
            <v-row row wrap>
              <v-col cols="12" md="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Name"
                  rules="required"
                >
                  <v-text-field
                    v-model="model.name"
                    :error-messages="errors"
                    label="Name *"
                    required
                  />
                </validation-provider>
                <!-- end name -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Category"
                  rules="required"
                >
                  <v-autocomplete
                    v-model="model.category_id"
                    label="Category *"
                    :items="categories"
                    item-text="name"
                    item-value="id"
                    required
                    :error-messages="errors"
                  />
                </validation-provider>
                <!-- end category_id -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Inclusive Bottle Price"
                  rules="required|onlydigit"
                >
                  <v-text-field
                    v-model="model.price"
                    :error-messages="errors"
                    label="Inclusive Bottle Price (ဗူးခွံပါပြီး) *"
                    required
                    type="number"
                  />
                </validation-provider>
                <validation-provider
                  v-slot="{ errors }"
                  name="Exclusive Bottle Price"
                  rules="required|onlydigit"
                >
                  <v-text-field
                    v-model="model.without_bottle_price"
                    :error-messages="errors"
                    label="Exclusive Bottle Price (ဗူးခွံမပါ) *"
                    required
                    type="number"
                  />
                </validation-provider>
                <!-- end price -->
                <validation-provider
                  v-slot="{ errors }"
                  name="Item Code"
                  rules="required"
                >
                  <v-text-field
                    v-model="model.item_code"
                    label="Item Code"
                    :error-messages="errors"
                    required
                  />
                </validation-provider>
                <!-- end item_code -->
                <!-- :src="'https://matesat-test.sgp1.digitaloceanspaces.com/product/Testing_image_1650872959_5.jpeg'"-->
                <v-hover v-slot="{ hover }">
                  <v-img
                    :aspect-ratio="18/9"
                    :src="model.image_path !==''?model.image_path:''"
                  >
                    <v-expand-transition>
                      <div
                        v-if="hover"
                        class="d-flex transition-fast-in-fast-out white darken-4 v-card--reveal"
                      >
                        <v-btn
                          outlined
                          small
                          class="info--text font-weight-bold"
                          @click="$refs.file.click()"
                        >
                          Upload
                        </v-btn>
                      </div>
                    </v-expand-transition>
                  </v-img>
                </v-hover>

                <input
                  id="file"
                  ref="file"
                  style="display: none;"
                  type="file"
                  @change="handleFileUpload()"
                >
              </v-col>
              <v-divider
                vertical
              />
              <v-col cols="12" md="6">
                <validation-provider
                  v-slot="{ errors }"
                  name="Unit Qty"
                  :rules="`required|min_value:0`"
                >
                  <v-text-field
                    v-model="model.unit_qty"
                    type="number"
                    label="Unit Qty *"
                    required
                    :error-messages="errors"
                    @keypress="isQty($event)"
                  />
                </validation-provider>
                <div class="d-flex justify-space-between">
                  <validation-provider
                    v-slot="{ errors }"
                    name="Weight"
                  >
                    <v-text-field
                      v-model="model.weight"
                      outlined
                      type="number"
                      label="Weight"
                      :error-messages="errors"
                    />
                  </validation-provider>
                  <validation-provider
                    v-slot="{ errors }"
                    name="LWH"
                  >
                    <v-text-field
                      v-model="model.lwh"
                      outlined
                      type="number"
                      label="LWH"
                      :error-messages="errors"
                    />
                  </validation-provider>
                </div>
                <v-text-field
                  v-model="model.mm_name"
                  label="MM Name"
                />
                <!-- end mm_name -->
                <v-textarea
                  v-model="model.description"
                  solo
                  label="Description"
                />
                <!-- end description -->
                <v-checkbox
                  v-model="model.is_available"

                  label="Is Available?"
                />
                <!-- end is_available -->
                <!-- <v-checkbox
                  v-model="model.exclusive_bottle"
                  label="Exclusive Bottle ?"
                /> -->
                <!-- end exclusive_bottle -->
              </v-col>
            </v-row>
          </v-card-text>
        </v-form>
      </validation-observer>
    </v-card>
  </v-stepper-content>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    value: {
      type: Object,
      default: () => ({
        requiredPassword: false
      })
    }
  },
  data: () => {
    return {
      categories: [],
      roles: [],
      // model: {
      //   id: '',
      //   name: '',
      //   category_id: '',
      //   price: '',
      //   mm_name: '',
      //   item_code: '',
      //   description: '',
      //   is_available: '1',
      //   image_path: '',
      //   file: '',
      //   exclusive_bottle: '0'
      // },
      disabledButton: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      jwt: 'auth/jwt'
    }),
    model: {
      get () {
        return this.value
      },
      set (value) {
        return this.$emit('input', value)
      }
    }
  },
  async beforeMount () {
    this.categories = await this.getFromLocalStorage('stored:categories')
  },
  methods: {
    async handleFileUpload () {
      this.model.file = this.$refs.file.files[0]
      // this.submitFile()
      if (this.model.file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.model.image_path = e.target.result
        }
        reader.readAsDataURL(this.model.file)
        if (this.model.id) {
          this.isLoading = true
          let successMessage = ''
          try {
            const { message, status, data } = (await this.$request.uploadFile(`${this.$url.PRODUCT_URL}/${this.model.id}/update_image`, this.$axios, this.jwt, this.model.file)).data
            if (status === 1) {
              this.$parent.$emit('createdData', data)
              successMessage = `Success: Product Image"${data.name}" was Attached!.`
            }
            this.handleStatus({ status, message, that: this, successMessage })
          } catch (error) {
            this.handleException({ error, that: this })
          }
          this.isLoading = false
        }
      }
    },
    async onSaveProduct () {
      this.disabledButton = true
      const isErrorFree = await this.$refs.observer.validate()
      if (!isErrorFree) {
        this.disabledButton = false
        return false
      }
      this.isLoading = true
      let successMessage = ''
      if (!this.model.id) {
        try {
          const create_payload = this.$model.CREATE_PRODUCT_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.postDataWithFile(this.$url.PRODUCT_URL, this.$axios, this.jwt, create_payload)).data
          if (status === 1) {
            this.$parent.$emit('createdData', data)
            successMessage = `Success: New Product "${data.name}" was Created!.`
            this.closeForm(data, 'created')
          }
          this.handleStatus({ status, message, that: this, successMessage })
        } catch (error) {
          this.handleException({ error, that: this })
        }
      } else {
        try {
          const update_payload = this.$model.CREATE_PRODUCT_PAYLOAD(this.model)
          const { message, status, data } = (await this.$request.putData(`${this.$url.PRODUCT_URL}/${this.model.id}`, update_payload, this.jwt))
          if (status === 1) {
            this.$parent.$emit('updatedData', data)
            successMessage = `Success: Product "${this.model.name}"  was Updated!.`
            this.closeForm(data, 'updated')
          }
          this.handleStatus({ status, message, that: this, successMessage })
        } catch (error) {
          this.handleException({ error, that: this })
        }
      }
      this.isLoading = false
      this.disabledButton = false
    },
    closeForm (data = null, action = null) {
      this.$emit('onGoBack', data, action)
      return this.resetForm(this)
    }
  }
}
</script>
<style>
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: .6;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: .7;
}
</style>
