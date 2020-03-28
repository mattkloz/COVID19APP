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
        <allcases v-if="showWhich === 'list'" />
        <getmap v-if="showWhich === 'map'" :key="mapKey"/>
        <div class="text-center" v-if="!hasCases">
          <h6>There are no open cases in your area. Please check back later.</h6>
        </div>
    </div>
  </div>
  <q-inner-loading :showing="spinner">
        <q-spinner-oval size="100px" color="green" />
      </q-inner-loading>
  <q-dialog v-model="launchNav" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Google Maps will open on your device to provide navigation to the next case location.</div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Launch" v-close-popup @click="openMap" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import allcases from "../../components/medical/allcases.vue";
import getmap from "../../components/shared/allcasesmap.vue";

export default {
  name: "UserDashboard",
  components: {
    allcases,
    getmap,
  },
  data() {
    return {
      location: null,
      loading1: false,
      hasCases: false,
      showWhich: 'list',
      showcases: true,
      spinner: false,
      launchNav: false,
      mapKey: 0,
    }
  },
  computed: {
    caseLoadCount () {
      return this.$store.getters['medical/getAllCasesCount']
    },
    userProfile () {
      return this.$store.getters['auth/getUserProfile']
    },
    ...mapState('medical', ['allCases']),
  },
  created () {
    this.spinner = true;
    let getLocal = JSON.parse(this.$q.sessionStorage.getItem('vuex'));
    let caseNum = getLocal.medical.allCases.length
    if (caseNum) {
      this.hasCases = true;
    }
    this.spinner = false;
  },
  methods: {
      openMap() {
        var that = this;
        var thislat = this.allcases[0].coords.lat.toString()
        var thislong = this.allcases[0].coords.long.toString()
        var thisCoords = "https://www.google.com/maps/dir/?api=1&destination=" + thislat + "," + thislong
        window.open(thisCoords)
      },
  },
  watch: {
    caseLoadCount(newvalue, oldvalue) {
      if (newvalue == 0) {
        this.hasCases = false;
      } else {
        this.hasCases = true;
      }
    },
    allCases(value) {
      this.myCases = this.allCases
      this.mapKey += 1; 
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
