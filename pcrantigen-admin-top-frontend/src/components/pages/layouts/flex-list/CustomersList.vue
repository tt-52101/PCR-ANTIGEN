<script setup lang="ts">
import {computed, onMounted, ref} from 'vue'

import getCustomers from '/@src/composable/customersData'

import useNotyf from '/@src/composable/useNotyf'

import CustomerService from '/@src/service/customerService';

const customerService = new CustomerService();

const notif = useNotyf()

const {search, saveCustomer, customers} = getCustomers();

const centeredActionsOpen = ref(false)

const filters = ref('')

const filteredData = computed(() => {
  if (!filters.value) {
    return customers.value
  } else {
    return customers.value.filter((item) => {
      return (
        item.name.match(new RegExp(filters.value, 'i')) ||
        item.contact_number.match(new RegExp(filters.value, 'i')) ||
        item.email.match(new RegExp(filters.value, 'i')) ||
        item.profile_url.match(new RegExp(filters.value, 'i'))
      )
    })
  }
});

//profile_url: string; password: string; email: string; contact_number: string; name: string;
const name = ref('')
const contact_number = ref('')
const email = ref('')
const confirm_email = ref('')
const profile_url = ref('https://www.pngarts.com/files/5/User-Avatar-PNG-Transparent-Image.png')
const password = ref('')
const confirm_password = ref('')

const saveCustomerFunc = () => {
  console.log("saving")
  if (name.value && contact_number.value && email.value && confirm_email.value && password.value && confirm_password.value && profile_url.value) {
    if (email.value === confirm_email.value) {
      if (password.value === confirm_password.value) {
        console.log("working")
        const customer  = {
          name: name.value,
          email: email.value,
          contact_number: contact_number.value,
          password: password.value,
          profile_url: profile_url.value
        }
        customerService.postCustomer(customer)
          .then(function (response) {
            console.log('response',response)
            if (response.data.data.success){
              notif.success(response.data.data.message)
            }else{
              notif.warning(response.data.data.message)
            }
          })
          .catch(function (error) {
            console.log(error);
          });
      } else {
        notif.warning('Passwords do not match. Please try again.!!')
      }
    } else {
      notif.warning('Emails do not match. Please try again.!!')
    }
  } else {
    notif.warning('Empty Fields.!!')
  }
}

onMounted(async () => {
  search();
})
</script>

<template>
  <div>
    <div class="list-flex-toolbar flex-list-v1">
      <V-Field>
        <V-Control icon="feather:search">
          <input
            v-model="filters"
            class="input custom-text-filter"
            placeholder="Search..."
          />
        </V-Control>
      </V-Field>

      <V-Buttons>
        <!--        <V-Button dark="3">View Reports</V-Button>-->
        <V-Button color="primary" icon="fas fa-plus" elevated @click="centeredActionsOpen = true">
          Add Customer
        </V-Button>
      </V-Buttons>
    </div>

    <div class="page-content-inner">
      <div class="flex-list-wrapper flex-list-v1">
        <!--List Empty Search Placeholder -->
        <V-PlaceholderPage
          :class="[filteredData.length !== 0 && 'is-hidden']"
          title="We couldn't find any matching results."
          subtitle="Too bad. Looks like we couldn't find any matching results for the
          search terms you've entered. Please try different search terms or
          criteria."
          larger
        >
        </V-PlaceholderPage>

        <div class="flex-table">
          <!--Table header-->
          <div
            class="flex-table-header"
            :class="[filteredData.length === 0 && 'is-hidden']"
          >
            <span class="is-grow">Customer</span>
            <span>Email</span>
            <span>Contact</span>
            <span class="cell-end">Action</span>
          </div>

          <div class="flex-list-inner">
            <transition-group name="list" tag="div">
              <!--Table item-->
              <div
                v-for="customer in filteredData"
                :key="customer.contact_number"
                class="flex-table-item"
              >
                <div class="flex-table-cell is-media is-grow">
                  <V-Avatar
                    :picture="customer.profile_url"
                    color="info"
                    size="medium"
                  />
                  <div>
                    <span class="item-name dark-inverted">{{ customer.name }}</span>
                  </div>
                </div>
                <div class="flex-table-cell" data-th="Email">
                  <span class="light-text">{{ customer.email }}</span>
                </div>
                <div class="flex-table-cell" data-th="Contact Number">
                  <span class="light-text">{{ customer.contact_number }}</span>
                </div>
                <div class="flex-table-cell cell-end" data-th="Actions">
                  <VButton color="primary" outlined> More</VButton>
                </div>
              </div>
            </transition-group>
          </div>
        </div>

        <!--Table Pagination-->
        <V-FlexPagination
          v-if="filteredData.length > 5"
          :item-per-page="10"
          :total-items="873"
          :current-page="42"
          :max-links-displayed="7"
        />
      </div>
    </div>
    <VModal
      :open="centeredActionsOpen"
      size="medium"
      actions="center"
      @close="centeredActionsOpen = false"
      title="Add New Customers"
    >
      <template #content>
        <form class="form-layout is-split" @submit.prevent>
          <div class="form-outer">
            <div class="form-section is-grey">
              <div>
                <V-Field>
                  <V-Control icon="feather:user">
                    <input
                      type="text"
                      class="input"
                      placeholder="Name"
                      autocomplete="name"
                      v-model="name"
                    />
                  </V-Control>
                </V-Field>
                <V-Field>
                  <V-Control icon="feather:phone">
                    <input
                      type="tel"
                      class="input"
                      placeholder="Phone Number"
                      autocomplete="tel"
                      inputmode="tel"
                      v-model="contact_number"
                    />
                  </V-Control>
                </V-Field>
                <V-Field>
                  <V-Control icon="feather:mail">
                    <input
                      type="email"
                      class="input"
                      placeholder="Email Address"
                      autocomplete="email"
                      inputmode="email"
                      v-model="email"
                    />
                  </V-Control>
                </V-Field>
                <V-Field>
                  <V-Control icon="feather:mail">
                    <input
                      type="email"
                      class="input"
                      placeholder="Confirm Email"
                      autocomplete="confirm-email"
                      v-model="confirm_email"
                    />
                  </V-Control>
                </V-Field>
                <V-Field>
                  <V-Control icon="feather:lock">
                    <input
                      type="password"
                      class="input"
                      placeholder="Password"
                      autocomplete="password"
                      v-model="password"
                    />
                  </V-Control>
                </V-Field>
                <V-Field>
                  <V-Control icon="feather:lock">
                    <input
                      type="password"
                      class="input"
                      placeholder="Confirm Password"
                      autocomplete="confirm-password"
                      v-model="confirm_password"
                    />
                  </V-Control>
                </V-Field>
              </div>
            </div>
          </div>

        </form>

      </template>
      <template #action>
        <VButton color="primary" raised @click="saveCustomerFunc">Add Customer</VButton>
      </template>
    </VModal>
  </div>

</template>

<style lang="scss">
@import '../../../../scss/abstracts/_variables.scss';

.has-top-nav {
  .flex-list-wrapper,
  .list-flex-toolbar {
    max-width: 880px;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
