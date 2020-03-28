<template>
<div class="container">
      <div class="row">
          <form @submit.prevent="submit">
            <div class="col-12" style="margin-top: 30px;">
                <div class="q-gutter-sm">
                    <q-input
                        square 
                        outlined 
                        class="account-input biggerfont"
                        v-model.trim="age" 
                        label="Age" 
                        type="number"
                        bottom-slots
                        :error="$v.age.$error"
                        ref="age"
                        maxlength="2"
                        >
                        <template v-slot:error>
                            Age is Required
                        </template>
                    </q-input>
                </div>
            </div>
            <div class="col-12">
                <h6>Symptoms</h6>
                <div class="q-gutter-sm" v-bind:class="{ 'option-error': $v.mysymptoms.$error }">
                   <q-option-group
                        v-model="mysymptoms"
                        :options="options2"
                        color="green"
                        type="checkbox"
                        inline
                    >
                    </q-option-group>
                </div>
                <div class="error" v-if="$v.mysymptoms.$error">You must select at least one symptom option.</div>
            </div>
            <div class="col-12">
                <h6>Est. Date of Symptoms Start</h6>
                <q-input 
                filled 
                v-model="date"
                class="biggerfont"
                >
                <template v-slot:append>
                    <q-icon name="event" color="blue" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                            <q-date 
                            v-model="date" 
                            mask="MM-DD-YYYY" 
                            @input="() => $refs.qDateProxy.hide()" 
                            :options="optionsFn"
                            />
                        </q-popup-proxy>
                    </q-icon>
                </template>
                </q-input>
            </div>
            <div class="col-12">
                <h6>Prexisting Conditions</h6>
                <div v-bind:class="{ 'option-error': $v.preexist.$error }">
                    <q-radio v-model="preexist" val="yes" label="Yes" />
                    <q-radio v-model="preexist" val="no" label="No" />
                </div>
                <div class="error" v-if="$v.preexist.$error">You must select Yes or No</div>
            </div>
            <div class="q-gutter-sm">
                <h6>Contacted Your Primary Care Doctor?</h6>
                <div v-bind:class="{ 'option-error': $v.doctor.$error }">
                    <q-radio v-model="doctor" val="yes" label="Yes" />
                    <q-radio v-model="doctor" val="no" label="No" />
                </div>
                <div class="error" v-if="$v.doctor.$error">You must select Yes or No</div>
            </div>
            <div class="q-gutter-sm" >
                <h6>Currently Self-Quarantined?</h6>
                <div v-bind:class="{ 'option-error': $v.quar.$error }">
                    <q-radio v-model="quar" val="yes" label="Yes" />
                    <q-radio v-model="quar" val="no" label="No" />
                </div>
                <div class="error" v-if="$v.mysymptoms.$error">You must select Yes or No</div>
            </div>
            <div class="col-12">
                <h6>Number of people in household?</h6>
                <div class="q-gutter-sm">
                    <q-select 
                    outlined 
                    v-model="household" 
                    :options="options" 
                    label="Select Household Size" 
                    bottom-slots
                    :error="$v.household.$error"
                    ref="household"
                    class="biggerfont"
                    >
                    <template v-slot:error>
                        Household Size is Required
                    </template>
                    </q-select>
                </div>
            </div>
            <div class="col-12">
                <h6>Rate Current Condition</h6>
                <p style="margin-bottom: 20px;">1 being good condition, 10 being very bad condition.</p>
                <div class="q-px-sm">
                    <q-item>
                        <q-item-section side>
                            <q-icon name="las la-thumbs-up" />
                        </q-item-section>
                        <q-item-section>
                            <q-slider
                                v-model="condition"
                                :min="1"
                                :max="10"
                                :step="1"
                                markers
                                snap
                                label
                                label-always
                                color="blue"
                            />
                        </q-item-section>
                        <q-item-section side>
                        <q-icon name="las la-thumbs-down" />
                        </q-item-section>
                    </q-item>
                </div>
            </div>
            <div class="col-12" style="margin-top: 20px;">
                <div class="q-gutter-sm">
                    <q-input
                        v-model="notes"
                        label="Add Additional Details"
                        filled
                        type="textarea"
                        class="biggerfont"
                    />
                </div>
            </div>
            <div class="col text-center q-my-lg">
            <q-btn
              outline 
              color="primary" 
              class="action-btn"
              type="submit"
            >
              Review and Send
            </q-btn>
      </div>
        </form>
      </div>
      
      
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators';

export default {
    data() {
        return {
            date: null,
            preexist: null,
            doctor: null,
            quar: null,
            household: null,
            options: [
                '1', '2', '3', '4', '5','6', '7', '8', '9', '10+'
            ],
            condition: 1,
            age: '',
            notes: '',
            options2: [
                {
                    label: 'Fever',
                    value: 'fever'
                },
                {
                    label: 'Cough',
                    value: 'cough'
                },
                {
                    label: 'Shortness of Breath',
                    value: 'breath'
                },
                {
                    label: 'No Current Symptoms',
                    value: 'nosymp'
                },
            ],
            mysymptoms: [],
        }
    },
    created () {
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1;
        var curr_year = d.getFullYear();
        this.date = ('0' + (d.getMonth()+1)).slice(-2) + '-'
             + ('0' + d.getDate()).slice(-2) + '-'
             + d.getFullYear();
    },
    validations: {
        age: { required },
        mysymptoms: { required },
        preexist: { required },
        doctor: { required },
        quar: { required },
        household: { required },
    },
  methods: {
    optionsFn (date) {
        var d = new Date();
        var curr_date = d.getDate();
        var curr_month = d.getMonth() + 1;
        var curr_year = d.getFullYear();
        var todaysdate = 
             d.getFullYear() + '/'
             + ('0' + (d.getMonth()+1)).slice(-2) + '/'
             + ('0' + d.getDate()).slice(-2);
        return date >= '2020/01/01' && date <= todaysdate
    },
    submit() {
        this.$v.$touch();
        if(this.$v.$error) {
            this.$q.notify({
                message: 'Please correct the errors and submit again.',
                color: 'red',
                icon: 'eva-alert-triangle-outline'
            })
            return
        }
        var formData = {
            age: this.age,
            symptoms: this.mysymptoms,
            sympstartdate: this.date,
            haspreexist: this.preexist,
            contactedpcp: this.doctor,
            isquar: this.quar,
            housesize: this.household,
            currentcondition: this.condition,
            notes: this.notes
        }
        this.$store.commit('user/UPDATE_CURRENT_CASE', formData);
        this.$router.push({ name: 'review' })
    },
  }
};
</script>
<style lang="scss" scoped>

.action-btn {
  width: 75% !important;
}

h6 {
    margin: 25px 0 10px 0;
    font-size: 1.2em;
}
.q-field {
    padding: 0;
}

.biggerfont {
    font-size: 1.4em;
}
.error {
    color: #c10015;
}
.option-error {
    border: 2px solid #c10015;
}
</style>
