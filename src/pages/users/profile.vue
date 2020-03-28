<template>
  <section>
  <div class="q-mx-md q-mt-lg">
    <div class="q-mx-md">
        <div class="text-center q-my-lg">
            <form>
            <q-input 
                square 
                outlined 
                class="account-input"
                v-model="yourname" 
                label="Your Name" 
                :error="$v.yourname.$error"
            >
              <template v-slot:append>
                <q-icon name="close" @click="yourname = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <q-input 
                square 
                outlined 
                class="account-input"
                v-model="yourphone" 
                label="Your Phone Number" 
                mask="(###) ###-####"
                :error="$v.yourphone.$error"
            >
              <template v-slot:append>
                <q-icon name="close" @click="yourphone = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <q-input 
                square 
                outlined 
                class="account-input"
                v-model="youremail" 
                label="Your Email Address" 
                :error="$v.youremail.$error"
            >
              <template v-slot:append>
                <q-icon name="close" @click="youremail = ''" class="cursor-pointer" />
              </template>
            </q-input>
            <div class="q-gutter-sm">
              <q-checkbox v-model="requestMedical" label="Request Medical Professional Access" />
            </div>
      <q-btn outline color="primary" class="action-btn" label="Save" @click="submit" />
      <q-btn outline color="grey" class="action-btn" label="Cancel" @click="$router.go(-1)" />
      </form>
    </div>
    </div>
  </div>
  <q-dialog v-model="medicalDialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Requesting Medical Access</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          This service is only available to licensed medical professionals. All requests will be verified before granting access.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" v-close-popup @click="requestMedical = false" />
          <q-btn flat label="I Understand" v-close-popup @click="requestMedical = true" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { required, minLength, maxLength } from 'vuelidate/lib/validators';

export default {
  name: "UserProfile",
  components: {
  },
  props: ["name"],
  data() {
    return {
      yourname: '',
      youremail: '',
      yourphone: '',
      requestMedical: false,
      medicalDialog: false,
    };
  },
  computed: {
    userProfile () {
      return this.$store.getters['auth/getUserProfile']
    },
    openDialog: function () {

    }
  },
  created () {
    this.yourname = this.userProfile.name
    this.youremail = this.userProfile.email
    this.yourphone = this.userProfile.phone
  },
  validations: {
    youremail: { required },
    yourphone: { required },
    yourname: { required },
  },
  watch: {
    requestMedical(value) {
      if (value == true) {
        this.medicalDialog = true
      } else if (value == false) {
        this.medicalDialog = false
      }
    }
  },
  methods: {
    async submit() {
      this.$v.$touch();
      if(this.$v.$error) {
        this.loading1 = false;
        return
      } 
      var payload = {}
      if (this.requestMedical == true) {
        payload = {
          baseZip: null,
          email: this.youremail,
          phone: this.yourphone,
          name: this.yourname,
          requestedMed: true,
        }
      } else {
        payload = {
          baseZip: null,
          email: this.youremail,
          phone: this.yourphone,
          name: this.yourname,
          requestedMed: false,
        }
      }
      await this.$store.dispatch('auth/updateUserProfile', payload);
      this.$q.notify({
      timeout: 1000,
      message: 'Success! Your profile has been updated.',
      color: 'green',
        icon: 'eva-checkmark-circle-2-outline'
    });

    }
  },
};
</script>

<style lang="scss" scoped>
.account-input {
  margin-top: 10px;
}
.action-btn {
  width: 70%;
  margin-top: 20px;
}
</style>
