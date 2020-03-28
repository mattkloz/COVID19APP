<template>
  <section>
    <div id="loginDiv" class="q-mx-md q-mt-lg" style="max-width: 500px; display: block; margin: 0 auto;">
        <q-tabs
        v-model="tab"
        align="justify"
        narrow-indicator
        class="q-mb-lg"
      >
        <q-tab class="text-purple" name="phone" label="Phone Login" />
        <q-tab class="text-purple" name="email" label="Email Login" />
      </q-tabs>
      <q-tab-panels
          v-model="tab"
          animated
          transition-prev="scale"
          transition-next="scale"
          class=""
          style="padding: 0;"
        >
          <q-tab-panel name="phone">  
            <div>
              <div id="recaptcha-container"></div>
                <div class="row">
                <form @submit.prevent style="width: 100%;" v-show="!isCodeSent">
                    <div class="row">
                        <div class="col-12">
                            <q-input 
                            square 
                            outlined 
                            v-model="phone" 
                            label="Phone Number"
                            type="tel"
                            :invalid-feedback="invalidFeedback"
                            :valid-feedback="validFeedback"
                            :state="state"
                            mask="(###) ###-####"
                            />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col s12 text-center q-ma-lg">
                            <q-btn 
                            rounded 
                            color="secondary" 
                            class="action-btn"
                            label="Login"
                            id="get-sign-in-code"
                            @click="loginPhone"
                            />
                        </div>
                    </div>
                </form>
                <form
                  action=""
                  class="col s12"
                  v-show="isCodeSent"
                >
                  <div class="row">
                    <div class="col s12">
                        <q-input 
                        square 
                        outlined 
                        v-model="receivedCode" 
                        label="Confirmation Code"
                        type="number"
                        />
                        <span v-show="confError" style="color: red;">Incorrect Code. Please try again.</span>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col s12 text-center q-ma-lg">
                          <q-btn 
                            rounded 
                            color="secondary" 
                            class="action-btn" 
                            label="Verify"
                            @click="verifyPhone"
                          />
                    </div>
                  </div>
                </form>
              </div>
            </div>
        </q-tab-panel>
        <q-tab-panel name="email">
          <div>
            <div class="row">
              <form @submit.prevent style="width: 100%;">
                  <div class="row">
                      <div class="col-12 q-my-md">
                          <q-input 
                          square 
                          outlined 
                          v-model.trim="email" 
                          label="Email Address"
                          type="text"
                          :invalid-feedback="invalidFeedback"
                          :valid-feedback="validFeedback"
                          :state="state"
                          :loading="loadingState"
                          />
                      </div>
                  </div>
                  <div class="row">
                    <div class="col s12 text-center q-ma-lg">
                      <q-btn 
                      rounded 
                      color="secondary" 
                      class="action-btn"
                      label="Login"
                      @click="loginEmail"
                      />
                    </div>
                  </div>
              </form>
            </div>
          </div>
        </q-tab-panel>
        </q-tab-panels>
    </div>
  </section>
</template>

<script>
import Firebase from 'firebase/app';

export default {
  name: 'Home',
  async preFetch ({ store, currentRoute, previousRoute, redirect, ssrContext }) {
    let ifAuth = await Firebase.getCurrentUser()
    let isMedical = store.state.auth.medical
    
    if (isMedical && ifAuth) {
      redirect('/medicaldashboard')
    } else if (ifAuth) {
      redirect('/userdashboard')
    }
  },
  data() {
    return {
      tab: 'phone',
      phone: '',
      errorText: null,
      confCode: '',
      isCodeSent: false,
      receivedCode: '',
      confError: false,
      userId: "",
      loadingState: false,
      email: "",
      password: "",
      newemail: false,
      existemail: false,
      newpassword: '',
      confirmpassword: '',
      isPwd1: true,
      isPwd2: true,
    }
  },
  async created() {
    var that = this;
    let location = window.location.href
    if (this.$firebase.auth().isSignInWithEmailLink(location)) {
      let email = this.$q.localStorage.getItem('emailForSignIn');
      if (!email) {
        email = window.prompt('Please provide your email for confirmation');
      }
      let payload = {
        email: email,
        location: location
      }
      this.$store.dispatch('auth/logUserIn', payload)
    }
  },
  methods: {
    loginEmail () {
      this.$store.dispatch('auth/signIn', {email: this.email, location: window.location.href})
      this.$q.notify('A sign-in link has been sent to email: ' + this.email);
    },
    loginPhone() {
      var that = this;
      var Firebase = this.$firebase;
      var phoneNumber = "+1 " + this.phone;
      // Firebase.auth().settings.appVerificationDisabled = true
      var appVerifier = new Firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
      });
      Firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
        .then(function (confirmationResult) {
          window.confirmationResult = confirmationResult;
          that.isCodeSent = true;
          that.$q.notify('A sign-in code has been sent to phone number: ' + phoneNumber);
        }).catch(function (error) {
          that.isCodeSent = false;
          that.$q.notify('There was a problem sending a message to phone number: ' + phoneNumber + '. Please try again.');
          console.log(error)
        });
    },
    verifyPhone() {
      var that = this;
      var code = this.receivedCode;
      confirmationResult.confirm(code).then(user => {
        const newUser = {
          id: user.user.uid,
        }
        this.$store.commit('auth/SET_USER', newUser);
        if (user.additionalUserInfo.isNewUser == true) {
          this.$firebase.firestore().collection('users').doc(user.user.uid).set({
            role: "user",
            email: "",
            phone: this.phone
          }).then(() => {
              that.$store.dispatch('auth/fetchUserProfile')
          }).catch(err => {
              console.log(err)
          })
        } else {
          that.$store.dispatch('auth/fetchUserProfile')
        }
        this.$router.push({ name: 'userdashboard' })
      }).catch(function (error) {
        console.log("sign-in error: " + error);
      });
    },
  },
  computed: {
    state() {
      return this.phone.length == 10 ? true : false
    },
    invalidFeedback() {
      if (this.phone.length == 10) {
        return ''
      } else if (this.phone.length > 10) {
        return 'Invalid Phone'
      } else {
        return 'Enter Phone Number'
      }
    },
    validFeedback() {
        return this.state === true ? 'Thank you' : ''
    },
  },
}
</script>
<style lang="scss" scoped>
.action-btn {
  width: 100% !important;
}

</style>
