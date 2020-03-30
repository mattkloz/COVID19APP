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
            <q-input 
                square 
                outlined 
                class="account-input"
                v-model="yourbasezip" 
                label="Your Base Zip Code"
                bottom-slots 
                :error="$v.yourbasezip.$error"
                maxlength="5"
                :disabled="!mybasezip"
            >
              <template v-slot:append>
                <q-icon name="close" @click="yourbasezip = ''" class="cursor-pointer" />
              </template>

              <template 
              v-slot:hint 
              v-if="!mybasezip"
              >
                You cannot change your basezip if you have incomplete cases in your caseload. Please remove them or complete them to change your basecode.
              </template>
            </q-input>
      <q-btn 
      outline 
      color="primary" 
      class="action-btn" 
      label="Save" 
      @click="submit" 
      v-bind:class="{ addMargin: !mybasezip }" 
      />
      <q-btn 
      outline color="grey" 
      class="action-btn" 
      label="Cancel" 
      @click="$router.go(-1)" 
      />
      </form>
    </div>
    </div>
  </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import { required, minLength, maxLength } from 'vuelidate/lib/validators';


export default {
  name: "Profile",
  components: {
  },
  data() {
    return {
      yourname: '',
      youremail: '',
      yourphone: '',
      yourbasezip: '',
      mybasezip: true,
    };
  },
  computed: {
    userProfile () {
      return this.$store.getters['auth/getUserProfile']
    },
    ...mapState('medical', ['caseLoad']),
  },
  created () {
    this.yourname = this.userProfile.name;
    this.youremail = this.userProfile.email;
    this.yourphone = this.userProfile.phone;
    this.yourbasezip = this.userProfile.baseZip;
    var checkComp = []
    this.$_.forEach(this.caseLoad, function(key, value) {
      if (key.status != "completed") {
        checkComp.push(key)
      }
    })
    if (checkComp.length) {
      this.mybasezip = false;
    }
    console.log(this.mybasezip)
  },
  validations: {
    yourbasezip: { required, minLength: minLength(5) },
    youremail: { required },
    yourphone: { required },
    yourname: { required },
  },
  methods: {
    async submit() {
      this.$v.$touch();
      if(this.$v.$error) {
        this.loading1 = false;
        return
      } 
      var payload = {
        baseZip: this.yourbasezip,
        email: this.youremail,
        phone: this.yourphone,
        name: this.yourname,
      }
      await this.$store.dispatch('auth/updateMedicalProfile', payload);
      
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
.addMargin {
  margin-top: 50px;
}
</style>