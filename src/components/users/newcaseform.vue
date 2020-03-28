<template>
<div class="container">
      <div class="row">
        <div class="col s12">
        <form @submit.prevent="submit">
            <q-input 
            square 
            outlined 
            class="account-input"
            v-model="firstname" 
            label="First Name"
            bottom-slots
            :error="$v.firstname.$error"
            ref="firstname"
            >
            <template v-slot:error>
              First Name is required.
            </template>
            </q-input>

            <q-input 
            square 
            outlined 
            ref="autocomplete"
            onfocus="value = ''" 
            class="account-input"
            v-model="selected" 
            label="Search for Address" 
            bottom-slots
            type="text"
            :error="$v.address.$error"
            >
            <template v-slot:error>
              Address is required.
            </template>
            </q-input>

            <q-input 
            disable
            square 
            outlined 
            class="account-input"
            v-model="address" 
            label="Street Address" 
            bottom-slots
            :error="$v.address.$error"
            ref="address"
            v-if="foundAddress"
            >
            <template v-slot:error>
             Street Address is required.
            </template>
            </q-input>

            <q-input 
            square 
            outlined 
            class="account-input"
            v-model="apartment" 
            label="Apartment # (optional)"
            bottom-slots
            v-if="foundAddress"
            >
            </q-input>

            <q-input 
            disable
            square 
            outlined 
            class="account-input"
            v-model="city" 
            label="City" 
            bottom-slots
            :error="$v.city.$error"
            ref="city"
            v-if="foundAddress"
            >
            <template v-slot:error>
              City is required.
            </template>
            </q-input>

            <q-select 
            disable
            outlined 
            v-model="state" 
            :options="option" 
            label="State" 
            hint="This service is only available in Rhode Island"
            v-if="foundAddress"
            >
            </q-select >

            <q-input 
            disable
            square 
            outlined 
            class="account-input"
            v-model="zip" 
            label="Zip Code" 
            mask="#####"
            bottom-slots
            :error="$v.zip.$error"
            ref="zip"
            v-if="foundAddress"
            >
            <template v-slot:error>
              Zip Code is required.
            </template>
            </q-input>

            <q-input 
            square 
            outlined 
            class="account-input"
            v-model="phone" 
            label="Phone Number"
            mask="(###) ###-####"
            bottom-slots
            :error="$v.phone.$error"
            ref="phone"
            >
          <template v-slot:error>
            Phone Number is required.
          </template>
            </q-input>

            <q-input 
            square 
            outlined 
            class="account-input"
            v-model="email" 
            label="Email Address (optional)"
            >
            </q-input>

            <div class="col text-center q-my-lg">
            <q-btn
              :loading="loading1"
              :percentage="percentage1"
              outline 
              color="primary" 
              class="action-btn"
              @click="submit"
            >
              Enter Symptoms
              <template v-slot:loading>
                <q-spinner-tail class="on-left" />
                Submitting...
              </template>
            </q-btn>
      </div>
        </form>
        </div>
      </div>
      
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators';
import gmapsInit from '../../utils/gmapsplaces';

export default {
  name: 'CaseForm',
  computed: {
    ...mapState('auth', ['user'])
  },
  data() {
    return {
      firstname: "",
      lastname: "",
      address: "",
      apartment: "",
      city: "",
      state: "Rhode Island",
      zip: "",
      phone: "",
      email: "",
      loading1: false,
      someoneelse: false,
      percentage1: 0,
      option: ['Alabama','Alaska','American Samoa','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Federated States of Micronesia','Florida','Georgia','Guam','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Marshall Islands','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Northern Mariana Islands','Ohio','Oklahoma','Oregon','Palau','Pennsylvania','Puerto Rico','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virgin Island','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
      persistent: false,
      latLng: {},
      selected: "",
      foundAddress: false,
      coords: {},
    }
  },
  validations: {
    firstname: { required },
    address: { required },
    city: { required },
    zip: { required },
    phone: { required },
  },
  methods: {
    submit() {
      this.loading1 = true;
      this.$v.$touch();
      if(this.$v.$error) {
        this.loading1 = false;
        return
      } 
      var relationship = this.$q.sessionStorage.getItem("relationship")
      var formData = {
        firstName: this.firstname,
        streetAddress: this.address,
        apartment: this.apartment,
        city: this.city,
        state: this.state,
        zip: this.zip,
        coords: this.coords,
        phone: this.phone,
        email: this.email,
        submittedBy: this.user.id,
        submitterRelationship: relationship,
      }
      this.$store.commit('user/SET_CURRENT_CASE', formData);
      this.$q.sessionStorage.remove("relationship")
      this.$router.push({ name: 'symptoms' })
    },
  },
  async mounted() {
    const google = await gmapsInit();
    var autocomplete = new google.maps.places.Autocomplete(
      (this.$refs.autocomplete.$refs.input),
      {types: ['address'],}
    );
    autocomplete.setComponentRestrictions(
            {'country': ['us']});
    autocomplete.addListener('place_changed', () => {
      let place = autocomplete.getPlace();
      let ac = place.address_components;
      console.log(ac)

      function extractFromAdress(components, type) {
        for (var i = 0; i < components.length; i++)
          for (var j = 0; j < components[i].types.length; j++)
            if (components[i].types[j] == type) return components[i].long_name;
        return "";
      }
      var street_num = extractFromAdress(place.address_components, "street_number");
      var street_name = extractFromAdress(place.address_components, "route");

      var city = extractFromAdress(place.address_components, "locality");
      if (city == "") {
        city = extractFromAdress(place.address_components, "neighborhood");
      }
      console.log(city)

      var state = extractFromAdress(place.address_components, "administrative_area_level_1");

      var zip = extractFromAdress(place.address_components, "postal_code");



      this.state = state;
      this.city = city;
      this.address = street_num + " " + street_name
      this.zip = zip
      this.selected = street_num + " " + street_name
      this.foundAddress = true;
      let lat = place.geometry.location.lat();
      let lon = place.geometry.location.lng();
      this.coords = {lat, lon}
    });
  },
};
</script>
<style lang="scss" scoped>
.account-input {
  margin: 20px 0;
}

.action-btn {
  width: 75% !important;
}

.search-location {
  display: block;
  width: 60vw;
  margin: 0 auto;
  margin-top: 5vw;
  font-size: 20px;
  font-weight: 400;
  outline: none;
  height: 30px;
  line-height: 30px;
  text-align: center;
  border-radius: 10px;
}
</style>
