<template>
<div>
  <q-list bordered class="rounded-borders" v-for="location in myCases" :key="location.id">
      <q-expansion-item
        :group="location.cases[0].streetAddress"
        expand-separator
        icon="eva-folder-outline"
        :label="location.cases[0].streetAddress + ' (' + location.cases[0].distance + ' miles away)'"
        :caption="location.cases.length + ' Cases at this address'"
        default-closed
        header-class="text-primary"
      >
        <q-expansion-item
          :header-inset-level="0.3"
          default-closed
          v-for="eachcase in location.cases" 
          :key="eachcase.id"
          expand-separator
        >

          <template v-slot:header>
            <q-item-section avatar>
              <q-badge 
              outline
              color="primary" 
              :label="eachcase.status"
              v-if="eachcase.status == 'accepted'"
              />
              <q-badge 
              color="green" 
              :label="eachcase.status"
              v-if="eachcase.status == 'completed'"
              />
          </q-item-section>

          <q-item-section>
            {{eachcase.firstName}}
          </q-item-section>
          <q-item-section v-if="eachcase.priority == 3">
            <q-badge 
            color="red" 
            :label="' Priority: ' + eachcase.priority" 
            />
          </q-item-section>
          <q-item-section v-else="eachcase.priority">
            <q-badge 
            color="yellow" 
            class="text-black"
            :label="' Priority: ' + eachcase.priority" 
            />
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              Age: {{eachcase.age}}
            </div>
          </q-item-section>
        </template>

          <q-card style="padding-bottom: 20px;">
            <q-card-section>
              <q-list>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Reported Preexisting Conditions</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{eachcase.haspreexist }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Symptoms</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ eachcase.symptoms.toString() }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Reported Current Condition</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ eachcase.currentcondition }} / 10</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Phone</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ eachcase.phone }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-item-section>
                  <q-item-label>Email</q-item-label>
                </q-item-section>
                <q-item-section side >
                  <q-item-label>{{ eachcase.email }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item tag="label" v-ripple>
                <q-list style="width: 100%">
                  <q-item-label header style="padding: 0; margin-bottom: 10px; background-color: darkgrey; color: #fff; font-size: 1.1em; border-radius: 5px; text-transform: uppercase; text-align: center; padding: 5px 0; width: 100%;">Comments</q-item-label>

                  <q-item tag="label" v-if="!eachcase.comments">
                    <q-item-section>
                      <q-item-label>No Comments Yet</q-item-label>
                    </q-item-section>
                  </q-item>


                  <q-item v-for="comment in eachcase.comments" :key="comment.id" style="padding: 0; margin-top: 5px;">
                    <q-item-section avatar>
                      <q-icon class="text-teal" name="eva-message-circle-outline" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label lines="1">{{comment.commentedName}}</q-item-label>
                      <q-item-label caption lines="2">
                        <span class="text-weight-bold"></span>
                        {{comment.comment}}
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side top style="font-size: 0.8em;">
                      {{moment.unix(comment.submitted.seconds).format('MMMM Do, YYYY')}}
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-item>

              </q-list> 
            </q-card-section>
            <q-card-actions class="text-grey" align="center" style="">
            <q-btn-dropdown color="green" label="Case Actions" style="width: 60%;">
              <q-list>
                <q-item clickable v-close-popup @click="markComplete(eachcase)" v-if="eachcase.status != 'completed'">
                  <q-item-section>
                    <q-item-label>Complete Case</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click="markComment(eachcase)">
                  <q-item-section>
                    <q-item-label>Add a Comment</q-item-label>
                  </q-item-section>
                </q-item>

                <!-- <q-item clickable v-close-popup @click="markRefer(eachcase)">
                  <q-item-section>
                    <q-item-label>Refer Case</q-item-label>
                  </q-item-section>
                </q-item> -->

                <q-item clickable v-close-popup @click="markRemove(eachcase)" v-if="eachcase.status != 'completed'">
                  <q-item-section>
                    <q-item-label>Remove From My Caseload</q-item-label>
                  </q-item-section>
                </q-item>

              </q-list>
            </q-btn-dropdown>
          </q-card-actions>
          </q-card>
        </q-expansion-item>
      </q-expansion-item>
    </q-list>
    <div class="q-mx-md q-mt-lg">
    <div class="col text-center q-my-lg">
      <q-btn-dropdown
      :loading="loading1"
      split
      color="green"
      push
      icon="eva-pin-outline"
      label="Start Navigating"
      @click="beginNav"
      v-if="caseLoad != ''"
    >
      <q-list>
        </q-item>
        <q-item clickable v-close-popup @click="doneToday">
          <q-item-section side>
            <q-icon name="eva-checkmark-square-outline" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Done For The Day</q-item-label>
          </q-item-section>
          
        </q-item>
      </q-list>
    </q-btn-dropdown>
    </div>
    </div>
    <q-dialog v-model="commentwindow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Add Comment to {{ case_to_comment.firstName }}'s Case</div>
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
          <q-btn color="green" icon="eva-checkmark-circle-outline" label="Save Comment" @click="saveComment(case_to_comment)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="completewindow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Complete {{case_to_complete.firstName}}'s case</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="" style="max-width: 100%">
            <q-input
              v-model="completionNotes"
              filled
              label="Enter any completion notes"
              type="textarea"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-teal">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="green" icon="eva-checkmark-circle-outline" label="Completed" @click="saveComplete(case_to_complete)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="referwindow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Refer {{case_to_refer.firstName}}'s case</div>
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
          <q-btn color="primary" label="Confirm Refer" @click="saveRefer(case_to_refer)" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="removewindow" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg-white text-black" style="width: 300px">
        <q-card-section>
          <div class="text-h6">Remove {{case_to_remove.firstName}}'s case</div>
        </q-card-section>
        <form @submit.prevent="submit">
          <q-card-section class="q-pt-none">
          <div v-bind:class="{ 'option-error': $v.removewhich.$error }">
              <q-radio v-model="removewhich" val="this" label="This Case" />
            <q-radio v-model="removewhich" val="all" label="All Address Cases" />
          </div>
          <div class="error" v-if="$v.removewhich.$error">You must select an option</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="" style="max-width: 100%">
            <q-input
              v-model="removeNotes"
              filled
              label="Enter Reason for Removal"
              type="textarea"
              :error="$v.removeNotes.$error"
            />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="text-teal">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn color="red" icon="eva-save-outline" label="Confirm Remove" @click="saveRemove(case_to_remove)" />
          
        </q-card-actions>
        </form>
      </q-card>
    </q-dialog>

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

  </div>
</template>

<script>
import { mapState } from 'vuex'
import moment from 'moment'
import * as firebase from 'firebase';
import groupBy from '../../utils/groupBy';
import { required } from 'vuelidate/lib/validators';

export default {
  data() {
    return {
      withdrawconfirm: false,
      case_to_delete: '',
      showphone: false,
      myCases: null,
      commentwindow: false,
      completewindow: false,
      updatewindow: false,
      referwindow: false,
      removewindow: false,
      case_to_comment: '',
      newcomment: '',
      completionNotes: '',
      updateNotes: '',
      removeNotes: '',
      removeReason: null,
      case_to_comment: '',
      case_to_complete: '', 
      case_to_refer: '',
      case_to_update: '',
      case_to_remove: '',
      launchNav: false,
      loading1: false,
      removewhich: null,
    }
  },
  validations: {
    removeNotes: { required },
    removewhich: { required }
  },
  computed: {
    ...mapState('medical', ['caseLoad']),
    ...mapState('auth', ['medicalLocation']),
    ...mapState('auth', ['allUsers'])
  },
  created () {
    this.$q.loading.show()
    this.myCases = this.$_.chain(this.caseLoad)
    .orderBy('distance','asc')
    .groupBy('streetAddress')
    .map((cases, address) => ({ cases, address }))
    .value();
    var that = this;
    this.$_.forEach(this.myCases, function(key, value){
      that.$_.forEach(key.cases, function(key, value) {
        if ("comments" in key) {
        that.$_.forEach(key.comments, function(key, value){
          let commentedBy = key.commentedBy
          let name = ""
          let userid = ""
          that.$_.forEach(that.allUsers, function(key, value){
            if (commentedBy == key.userid) {
              name = key.name
            }
          })
          key["commentedName"] = name
        })
      }
    })
    })
  },
  mounted () {
    this.$q.loading.hide();
  },
  methods: {
    markComplete(event) {
      this.case_to_complete = event;
      this.completewindow = true;
    },
    markUpdate(event) {
      this.case_to_update = event;
      this.updatewindow = true;
    },
    markComment(event) {
      this.case_to_comment = event;
      this.commentwindow = true;
    },
    markRefer(event) {
      this.case_to_refer = event;
      this.referwindow = true;
    },
    markRemove(event) {
      this.case_to_remove = event;
      this.removewindow = true;
    },
    async saveComment(event) {
      this.commentwindow = false;
      var payload = {
        caseid: event.caseid,
        comment: this.newcomment,
        parent: event.parent
      }
      await this.$store.dispatch('medical/addComment', payload)
      this.newcomment = ""
      this.$q.notify({
        message: 'Your comment has been saved.' ,
        color: 'green',
        icon: 'eva-checkmark-circle-2-outline'
      })
      
    },
    saveRefer(event) {
      //this adds a refer to someone, like a hospital or a person etc. Will use cloud functions to find who to send the case to. Maybe a nice to have at some point.
      this.referwindow = false;
      var refer_to_save = event
      // await this.$store.dispatch('medical/referCase', payload)
      this.$q.notify({
        message: 'This cas has been referred to: Some Name.' ,
        color: 'green',
        icon: 'eva-checkmark-circle-2-outline'
      })
    },
    async saveComplete(event) {
      this.completewindow = false;
      var complete_to_save = event
      var payload = {
        caseid: event.caseid,
        notes: this.completionNotes,
        parent: event.parent
      }
      await this.$store.dispatch('medical/completeCase', payload)
      this.$q.notify({
        message: 'This case has been marked as completed' ,
        color: 'green',
        icon: 'eva-checkmark-circle-2-outline'
      })
    },
    async saveRemove(event) {
      this.$v.$touch();
      if(this.$v.$error) {
        this.loading1 = false;
        return
      } 
      let that = this;
      let removecase = event
      let notes = this.removeNotes
      let removeType = this.removewhich
      if (removeType == "this") {
        var payload = {
          removeNotes: notes,
          caseid: event.caseid,
          parent: event.parent
        }
        await this.$store.dispatch('medical/removeCase', payload)
        that.removewhich = ""
        that.removeNotes = ""
      } else {
        let removalLoad = []
        that.$_.forEach(that.myCases, function(key, value){
          if (key.address == removecase.streetAddress) {
            that.$_.forEach(key.cases, function(key, value){
              if (key.status != "completed") {
                removalLoad.push(key)
              }
            })
          }
          })
          var payload = {
          removalLoad: removalLoad,
          removalNotes: that.removeNotes
        }
        await this.$store.dispatch('medical/removeCases', payload)
        that.removewhich = ""
        that.removeNotes = ""
      }
      this.removewindow = false;
      this.$q.notify({
        timeout: 800,
        message: 'This case has been removed from your caseload.' ,
        color: 'green',
        icon: 'eva-checkmark-circle-2-outline'
      })
    },
    
    beginNav () {
      this.launchNav = true;
    },

    openMap() {
      var that = this;
      var thislat = this.myCases[0].cases[0].coords.lat.toString()
      var thislong = this.myCases[0].cases[0].coords.lon.toString()
      var thisCoords = "https://www.google.com/maps/dir/?api=1&destination=" + thislat + "," + thislong
      window.open(thisCoords)
    },

    doneToday() {
      this.$store.commit('medical/RESET_CASE_LOAD');
    },
      
  },
  watch: {
    caseLoad(newvalue, oldvalue) {
      this.myCases = this.$_.chain(this.caseLoad)
      .orderBy('distance','asc')
      .groupBy('streetAddress')
      .map((cases, address) => ({ cases, address }))
      .value();
      var that = this;
      this.$_.forEach(this.myCases, function(key, value){
        that.$_.forEach(key.cases, function(key, value) {
          if ("comments" in key) {
          that.$_.forEach(key.comments, function(key, value){
            let commentedBy = key.commentedBy
            let name = ""
            let userid = ""
            that.$_.forEach(that.allUsers, function(key, value){
              if (commentedBy == key.userid) {
                name = key.name
              }
            })
            key["commentedName"] = name
          })
        }
      })
      })
    }
}

}
</script>

<style lang="scss" scoped>

.newer {
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

.priority {
  background: red !important;
  color: #fff !important;
}

.q-item__section--avatar {
  color: yellow !important;
}

</style>