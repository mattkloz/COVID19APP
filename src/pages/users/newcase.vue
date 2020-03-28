<template>
  <section>
  <div class="fixed-center" style="width: 80%;">
    <div class="text-center">
      <h6 style="margin: 0;" v-if="!someoneelse">I Am Creating a Case for</h6>
      <h6 style="margin: 0;" v-if="someoneelse">Create a Case for Someone Else</h6>
    </div>
    <div class="text-center q-my-lg" v-if="!hasSelfCase">
      <q-btn outline color="primary" class="action-btn" label="Myself" @click="myself" v-if="!someoneelse" />
      </div>
    <div class="text-center q-my-lg">
      <q-btn outline color="primary" class="action-btn" label="Someone Else" @click="someoneElse" v-if="!someoneelse" />
    </div>
    <div class="text-center q-my-lg" v-if="someoneelse">
      <form @submit.prevent="submit">
        <q-input 
          square 
          outlined 
          class="account-input"
          v-model="relationship"
          ref="relationship"
          label="Your Relationship to This Person" 
          bottom-slots
          :error="$v.relationship.$error"
          hint="(e.g. Mother, Husband, Friend, Caretaker etc.)"
        >
        <template v-slot:error>
          Relationship is required.
        </template>
        </q-input>
        <q-input 
          square 
          outlined 
          class="account-input"
          v-model="yourname" 
          ref="yourname"
          label="Your First Name" 
          bottom-slots
          :error="$v.yourname.$error"
          :disabled="this.nameAlready == true"
        >
        <template v-slot:error>
          Your first name is required.
        </template>
        </q-input>
      <q-btn outline color="green" type="submit" class="started-btn" label="Enter Their Info" />
      </form>
      <q-btn outline color="grey" class="started-btn" label="Cancel" @click="someoneelse = false" />
    </div>
  </div>
  </section>
</template>

<script>

import { mapState } from 'vuex'
import { required } from 'vuelidate/lib/validators';

export default {
  name: "NewCase",
  computed: {
    ...mapState('auth', ['user']),
    ...mapState('user', ['userCases']),
    ...mapState('auth', ['userProfile']),
  },
  components: {
  },
  props: [],
  data() {
    return {
      relationship: '',
      yourname: '',
      someoneelse: false,
      hasSelfCase: null,
      nameAlready: false,
    };
  },
  created () {
    var thisCases = this.userCases
    var hasSelf = this.$_.find(thisCases, {submitterRelationship:"self"});
    if (hasSelf) {
      this.hasSelfCase = true
    };
    if (this.userProfile.name != '') {
      this.yourname = this.userProfile.name
      this.nameAlready = true
    }
    
  },
  validations: {
    relationship: { required },
    yourname: { required } 
  },
  methods: {
    myself() {
      try {
        this.$q.sessionStorage.set("relationship", "self")
      } catch (e) {
        this.$q.notify('There was a problem saving your data because of: ' + e + '. Please try again.');
      }
      this.$router.push({ name: 'contact' })

    },
    someoneElse() {
      this.someoneelse = true;
    },
    submit() {
      this.$v.$touch();
      if(this.$v.$error) return

      let newcasevals = {
        yourrelationship: this.relationship
      }
      try {
        this.$q.sessionStorage.set("relationship", this.relationship)
      } catch (e) {
        this.$q.notify('There was a problem saving your data because of: ' + e + '. Please try again.');
      }
      this.$firebase.firestore().collection('users').doc(this.user.id).update({
            name: this.yourname
        }).then(() => {
            this.$router.push({ name: 'contact' })
        }).catch(err => {
            console.log(err)
        })
    }
  },
};
</script>

<style lang="scss" scoped>
.account-input {
  margin-top: 25px;
}
.action-btn {
  width: 70%;
}
.started-btn {
  width: 70%;
  margin-top: 20px;
}
</style>
