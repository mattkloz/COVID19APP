<template>
  <section>
  <div class="content">
    <div class="q-mx-md q-mt-lg text-center" v-if="hasCases">
      <q-btn-toggle
        v-model="showWhich"
        class="my-custom-toggle"
        unelevated
        toggle-color="green"
        :options="[
          {value: 'list', slot: 'one'},
          {value: 'map', slot: 'two'},
        ]"
      >
        <template v-slot:one>
          <div class="row items-center no-wrap">
            <q-icon left name="eva-list-outline" />
            <div class="text-center">
              List
            </div>
          </div>
        </template>

        <template v-slot:two>
          <div class="row items-center no-wrap">
            <q-icon left name="eva-map-outline" />
            <div class="text-center">
              Map
            </div>
          </div>
        </template>
      </q-btn-toggle>
    </div>
    <div class="q-mx-md q-mt-lg">
        <mycases v-if="showWhich === 'list'" />
        <getmap v-if="showWhich === 'map'"/>
        <div class="text-center" v-if="!hasCases">
          <h6>You haven't accepted any cases yet today.</h6>
        </div>
    <div class="col text-center q-my-lg">
        <div>
        <q-btn
          v-if="!this.userProfile.baseZip"
          color="green"
          push
          @click="finishProfile"
            
        >
            Finish My Profile
        </q-btn>
        </div>
    </div>
    </div>
  </div>
  <q-inner-loading :showing="spinner">
        <q-spinner-oval size="100px" color="green" />
      </q-inner-loading>
  
  </section>
</template>

<script>
import { mapState } from 'vuex'
import mycases from "../../components/medical/dailieslist.vue";
import getmap from "../../components/shared/map.vue";

export default {
  name: "MedicalDashboard",
  components: {
    mycases,
    getmap,
  },
  props: ["name"],
  data() {
    return {
      location: null,
      hasCases: false,
      showWhich: 'list',
      showcases: true,
      spinner: false,
    }
  },
  computed: {
    caseLoadCount () {
      return this.$store.getters['medical/getCasesCount']
    },
    myCases () {
      return this.$store.getters['medical/getCases']
    },
    userProfile () {
      return this.$store.getters['auth/getUserProfile']
    },

  },

  created () {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async pos => {
        var location = {lat: pos.coords.latitude, lng: pos.coords.longitude};
        await this.$store.commit('auth/SET_MEDICAL_LOCATION', location);
        await this.$store.dispatch('medical/fetchAcceptedCases')
      }, err => {
        console.log(err.message);
      })
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
    let getLocal = JSON.parse(this.$q.sessionStorage.getItem('vuex'));
    let caseNum = getLocal.medical.caseLoad.length
    if (caseNum) {
      this.hasCases = true;
    }
  },
  methods: {
    finishProfile() {
      this.$router.push({ name: 'medicalprofile' })
    }
  },
  watch: {
    caseLoadCount(value) {
      if (value == 0) {
        this.hasCases = false;
      } else {
        this.hasCases = true;
      }
    }
}
};
</script>

<style lang="scss" scoped>
.my-custom-toggle{
  border: 1px solid grey;
  color: grey;
}

</style>
