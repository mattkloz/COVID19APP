<template>
<div>
  <q-list bordered class="rounded-borders" v-for="maincase in myCases" :key="maincase.id">
    <q-expansion-item
        :group="maincase.cases[0].streetAddress"
        expand-separator
        icon="eva-folder-outline"
        :label="maincase.cases[0].streetAddress + ' (' + maincase.cases[0].distance + ' miles away)'"
        :caption="maincase.cases.length + ' Cases at this address'"
        default-closed
        header-class="text-primary"
        expand-icon-toggle
    >
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="eva-plus-circle-outline" class="text-green" @click="addThisCase(maincase)" />
          </q-item-section>

        <q-item-section>
          <q-item-label>{{maincase.cases[0].streetAddress}} ({{maincase.cases[0].distance}} miles away)</q-item-label>
          <q-item-label caption>{{maincase.cases.length}} cases here</q-item-label>
        </q-item-section>
 
        </template>
        <q-expansion-item
          :header-inset-level="0.3"
          default-closed
          v-for="eachcase in maincase.cases" 
          :key="eachcase.id"
          expand-separator
        >

          <template v-slot:header>
          <q-item-section avatar>
            <q-badge 
            outline
            color="primary" 
            :label="eachcase.status"
            v-if="eachcase.status == 'pending'"
            />
            <q-badge 
            color="green" 
            :label="eachcase.status"
            v-if="eachcase.status == 'accepted'"
            />
          </q-item-section>

          <q-item-section>
            {{eachcase.firstName}}
          </q-item-section>
          <q-item-section v-if="eachcase.priority == 3">
            <q-badge 
            color="red" 
            :label="' Priority: ' + eachcase.priority" 
            />
          </q-item-section>
          <q-item-section v-if="eachcase.priority == 2">
            <q-badge 
            color="yellow" 
            class="text-black"
            :label="' Priority: ' + eachcase.priority" 
            />
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              Age: {{eachcase.age}}
            </div>
          </q-item-section>
        </template>

          <q-list >
              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Reported Preexisting Conditions</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{eachcase.haspreexist }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Symptoms</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ eachcase.symptoms.toString() }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Reported Current Condition</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ eachcase.currentcondition }} / 10</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Phone</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ eachcase.phone }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Email</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ eachcase.email }}</q-item-label>
                </q-item-section>
              </q-item>

              </q-list>
        </q-expansion-item>
      </q-expansion-item>
    </q-list>
    <q-dialog v-model="acceptwindow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Add this to My Caseload</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Click add to accept.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="green" v-close-popup label="Accept Cases" @click="confirmCases(cases_to_add)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import * as firebase from 'firebase';
import groupBy from '../../utils/groupBy';
import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      myCases: null,
      thiscase: '',
      acceptwindow: false,
      cases_to_add: '',
    }
  },
  validations: {
    removeNotes: { required },
  },
  computed: {
    ...mapState('medical', ['allCases']),
  },
  created () {
    this.$q.loading.show()
    this.$store.dispatch('medical/fetchOpenCases')
  },
  mounted () {
    this.$q.loading.hide()
  },
  methods: {

    async addThisCase(event) {
      this.cases_to_add = event;
      this.acceptwindow = true;
    },

    async confirmCases(event) {
      await this.$store.dispatch('medical/acceptCase', event)
      this.$q.notify({
          message: 'Your Caseload Has Been Updated',
          color: 'green',
          icon: 'eva-checkmark-circle-2-outline',
          actions: [
          { label: 'View', color: 'white', handler: () => { this.$router.push({ name: 'medicaldashboard' }) } }
          ]
      })
    }
  },
  watch: {
    allCases() {
      this.myCases = this.$_.chain(this.allCases)
      .orderBy('distance','asc')
      .groupBy('coords.lat', 'coords.lon')
      .map((cases, address) => ({ cases, address }))
      .value();
    }
}

}
</script>

<style lang="scss" scoped>

.newer {
  background-color: green;
}
.pending {
  background-color: purple;
}
.completed {
  background-color: blue;
}
.canceled {
  background-color: lightgrey;
  color: black;
}

.priority {
  background: red !important;
  color: #fff !important;
}

.q-item__section--avatar {
  color: yellow !important;
}

</style>