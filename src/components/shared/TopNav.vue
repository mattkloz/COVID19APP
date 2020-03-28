<template>
  <q-header elevated class="bg-white text-accent">
      <q-toolbar>
        <q-btn v-if="leftNav" @click="$router.go(-1)" flat round dense :icon="leftNav" class="q-mr-xs" />
        <q-btn v-else flat round dense icon="eva-question-mark-circle-outline" class="q-mr-xs" @click="opensettings('left')" />

        <q-toolbar-title>
          {{pageTitle}} 
        </q-toolbar-title>
        <q-btn flat round dense icon="eva-power-outline" class="q-mr-xs" @click="open('right')" />
      </q-toolbar>

    <q-dialog v-model="sliders" :position="position">
      <q-card style="width: 300px" class="q-px-sm q-pb-md">
        <q-card-section>
          <div class="text-h6">Frequently Asked Questions</div>
        </q-card-section>
        <q-card-section>
          <p class="question">Do I need to create a case for everyone in my house?</p>
          <p class="answer">Yes, anyone that is showing symptoms of a COVID-19 infection (fever, achy body, trouble breathing, cough) should have their own case.</p>
        </q-card-section>
        <q-card-section>
          <p class="question">How long will it take to get tested?</p>
          <p class="answer">That can't be answered here, response times are determined by local healthcare workers.</p>
        </q-card-section>
        <q-card-section>
          <p class="question">Should I go to the hospital?</p>
          <p class="answer">If you or others are distressed, then yes, go to the hospital.</p>
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="signout" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-teal text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Confirm Signout</div>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" v-close-popup/>
          <q-btn flat label="Signout" v-close-popup @click="signOut" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    </q-header>
</template>

<script>
export default {
  data() {
    return {
      signout: false,
      sliders: false,
      position: 'top',
      newMessage: '',
      sendMessage: '',
      radiusValue: 50,
      ageValue: {
          min: 25,
          max: 45,
      },
      score: {
          min: 600,
          max: 750,
      },
    }
  },
  props: [
    'viewHeader',
    'leftNav',
    'navRoute'
    ],
  methods: {
    open (position) {
      this.position = position
      this.signout = true
    },
    opensettings (position) {
      this.position = position
      this.sliders = true
    },
    signOut() {
        this.$store.dispatch('auth/signOut')
      }
  },
  computed: {
    pageTitle() {
      let currentPath = this.$route.fullPath;
      if (currentPath == '/newcase') return "Create a Case"
      else if (currentPath == '/symptoms/') return "Case Details"
      else if (currentPath == '/review/') return "Review Case"
      else if (currentPath == '/login') return "Login"
      else if (currentPath == '/contact/') return "Person to Test"
      else if (currentPath == '/userdashboard/' || currentPath == '/userdashboard') return "My Dashboard"
      else if (currentPath == '/userprofile/') return "My Profile"
    }
  },
}
</script>

<style lang="scss" scoped>
.q-toolbar__title {
  text-align: center;
}
.question {
  font-weight: 600;
}
</style>