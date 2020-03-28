<template>
  <div class="q-pa-md">
    <q-table
      title="Review and Submit Your Case"
      :data="data"
      :columns="columns"
      row-key="name"
      hide-header
      hide-bottom
      wrap-cells
      flat
      :pagination.sync="pagination"
      :rows-per-page-options="[0]"
    />
    <div class="col text-center q-my-lg" v-if="this.caseLoadCount > 2">
      <h6>You can only submit 2 test cases</h6>
    </div>
    <div class="col text-center q-my-lg" v-if="this.caseLoadCount < 3">
      <q-btn
        outline 
        color="primary" 
        class="action-btn"
        @click="submit"
      >
        Submit
      </q-btn>
    </div>
    <div class="col text-center q-my-lg">
      <q-btn
        outline 
        color="grey" 
        class="action-btn"
        @click="cancel"
      >
        Cancel
      </q-btn>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import gmapsInit from '../../utils/gmaps';

const columns = [
  { name: 'name', align: 'left', label: 'Field', field: 'name', },
  { name: 'value', align: 'center', label: 'Value', field: 'value' }
]

export default {
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('user', ['currentCase']),
    caseLoadCount () {
      return this.$store.getters['user/getAllCasesCount']
    },
  },
  data () {
    return {
      data: [],
      columns,
      pagination: {
        rowsPerPage: 0 
      },
      caseCoords: {},
    }
  },
  created () {
    return this.data = [
      {
        name: 'Name',
        value: this.currentCase.firstName,
      },
      {
        name: 'Phone',
        value: this.currentCase.phone,
      },
      {
        name: 'Email',
        value: this.currentCase.email,
      },
      {
        name: 'Household Size',
        value: this.currentCase.housesize,
      },
      {
        name: 'Address',
        value: this.currentCase.streetAddress,
      },
      {
        name: 'Apartment #',
        value: this.currentCase.apartment,
      },
      {
        name: 'City',
        value: this.currentCase.city,
      },
      {
        name: 'State',
        value: this.currentCase.state,
      },
      {
        name: 'Zip',
        value: this.currentCase.zip,
      },
      {
        name: 'Symptoms',
        value: this.currentCase.symptoms,
      },
      {
        name: 'Age',
        value: this.currentCase.age,
      },
      {
        name: 'Symptoms Began',
        value: this.currentCase.sympstartdate,
      },
      {
        name: 'Preexisting Conditions',
        value: this.currentCase.haspreexist,
      },
      {
        name: 'Condition Rating',
        value: this.currentCase.currentcondition,
      },
      {
        name: 'Self Quarantined',
        value: this.currentCase.isquar,
      },
      {
        name: 'Contacted Doctor',
        value: this.currentCase.contactedpcp,
      },
      {
        name: 'Notes',
        value: this.currentCase.notes,
      }
    ]
  },
  methods: {

    cancel() {
      this.$router.push({ name: 'userdashboard' })
      this.$q.notify({
        message: 'This case has been cancelled.' ,
        color: 'grey',
      })
    },

    async submit() {
      var priority = 0;
      if (this.currentCase.age > 60){
        priority++
      }
      if (this.currentCase.haspreexist == "yes"){
        priority++
      }
      if (this.currentCase.currentcondition > 6 ){
        priority++
      }
      let payload = {
        firstName: this.currentCase.firstName,
        streetAddress: this.currentCase.streetAddress,
        apartment: this.currentCase.apartment,
        city: this.currentCase.city,
        state: this.currentCase.state,
        zip: this.currentCase.zip,
        coords: this.currentCase.coords,
        phone: this.currentCase.phone,
        email: this.currentCase.email,
        age: this.currentCase.age,
        housesize: this.currentCase.housesize,
        haspreexist: this.currentCase.haspreexist,
        symptoms: this.currentCase.symptoms,
        sympstartdate: this.currentCase.sympstartdate,
        currentcondition: this.currentCase.currentcondition,
        isquar: this.currentCase.isquar,
        contactedpcp: this.currentCase.contactedpcp,
        submittedBy: this.user.id,
        submitterRelationship: this.currentCase.submitterRelationship,
        notes: this.currentCase.notes,
        status: "new",
        priority: priority,
        created: this.$firebase.firestore.Timestamp.fromDate(new Date())
      }
      await this.$store.dispatch('user/setUserCase', payload)
      this.$router.push({ name: 'userdashboard' });
      this.$q.notify({
        timeout: 1000,
        message: 'This case has been submitted.',
        color: 'green',
        icon: 'eva-checkmark-outline'
      });
    }
  },
  // watch: {
  //   caseLoadCount(newvalue, oldvalue) {
  //     if (newvalue >= 2) {
  //       this.hasCases = false;
  //     } else {
  //       this.hasCases = true;
  //     }
  //   },
  // },
}
</script>

<style lang="scss" scoped>
.action-btn {
  width: 70%;
}

.q-table tbody td {
  font-size: 24px !important;
}

</style>