<template>
<div>
  <q-list v-for="thiscase in myCases" :key="thiscase.id">
      <q-expansion-item 
      group="casesGroup"
      default-closed>
        <template v-slot:header>
          <q-item-section avatar>
            <q-badge :class="thiscase.status" :label="thiscase.status" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ thiscase.firstName }}</q-item-label>
            <q-item-label caption><b>Submitted:</b> {{ moment.unix(thiscase.created.seconds).format('MMMM Do YYYY, h:mm:ss a') }} </q-item-label>
          </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <q-list>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Reported Preexisting Conditions</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{thiscase.haspreexist }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Symptoms</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ thiscase.symptoms.toString() }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Reported Current Condition</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ thiscase.currentcondition }} / 10</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Phone</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ thiscase.phone }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Email</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ thiscase.email }}</q-item-label>
                </q-item-section>
              </q-item>

              </q-list>
          </q-card-section>

          <q-separator dark />

          <q-card-actions class="text-grey" align="right" style="padding-right: 20px;">
            <q-btn color="primary" label="Add Comment" @click="openComment(thiscase)" />
            <q-btn flat @click="withdrawConfirm(thiscase)" v-if="thiscase.status == 'new'">Withdraw Case</q-btn>
          </q-card-actions>
        </q-card>
      </q-expansion-item>
      <q-separator />
  </q-list>
  <q-dialog v-model="withdrawconfirm" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-red text-white" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Remove <u>{{ case_to_delete.firstName }}'s</u> Case</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          Confirm below that you want to remove this case or click Cancel to return to your dashboard. Once this case is removed you will no longer have access to it.
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="negative" label="I Confirm" @click="removeCase(case_to_delete)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="commentwindow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <div style="text-align: center; font-weight: 400; color: grey; font-size: 1.2em;">Add Comment to <u>{{ this.case_to_comment.firstName }}'s</u> Case</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="" style="max-width: 100%">
            <q-input
              v-model="newcomment"
              filled
              label="Enter Comment"
              type="textarea"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-teal">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="green" label="Save Comment" @click="saveComment(case_to_comment)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import * as firebase from 'firebase';

export default {
  data() {
    return {
      withdrawconfirm: false,
      case_to_delete: '',
      commentwindow: false,
      case_to_comment: '',
      newcomment: '',
      myCases: null,
    }
  },
  computed: {
    ...mapState('user', ['userCases']),
  },
  created () {
    this.myCases = this.userCases
    
  },
  async beforeCreate () {
      await this.$store.dispatch('user/fetchUserCases');
  },
  methods: {
    async removeCase(event) {
      var that = this;
      var case_to_remove = event;
      await this.$store.dispatch('user/withdrawCase', case_to_remove);
      this.withdrawconfirm = false;
    },
    withdrawConfirm(event) {
      this.case_to_delete = event;
      this.withdrawconfirm = true;
    },
    openComment(event) {
      this.case_to_comment = event;
      this.commentwindow = true;
    },
    saveComment(event) {
      var case_to_save = event
      const newComment = this.newcomment;
      this.newcomment = '';
      let now = moment().format('MMMM Do YYYY, h:mm:ss a');
      var thisComment = {submittedby: this.user.id, comment: newComment, created: now};
      var that = this;
      var caseRef = this.$firebase.firestore().collection("cases").doc(case_to_save.caseid);
      return caseRef.update({
          comments: firebase.firestore.FieldValue.arrayUnion(thisComment)
      })
      .then(function() {
          that.$q.notify({
            message: 'Your comment: ' + '"' +  that.thisComment + '"' + ' has been saved.' ,
            color: 'green',
            icon: 'eva-checkmark-circle-2-outline'
          })
          that.commentwindow = false
      })
      .catch(function(error) {
          that.$q.notify({
            message: 'Your comment: ' + '"' +  that.thisComment + '"' + ' failed to save. Please try adding your comment again.' ,
            color: 'red',
            icon: 'eva-alert-triangle-outline'
          })
          that.commentwindow = false
          console.error("Error updating document: ", error);
      });
    }
  },
  watch: {
    userCases(newCases, oldCases) {
      this.myCases = this.userCases
    }
  },
}
</script>

<style lang="scss" scoped>

.new {
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

</style>