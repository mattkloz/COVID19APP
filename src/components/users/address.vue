<template>
  <section>
      <div class="row">
          <div class="col-12" id="locationField">
            <q-input 
                outlined 
                label="Enter your address"
                id="autocomplete"
                onFocus="geolocate"
                type="text"
            />
        </div>
      </div>
      <div class="row">
          <div class="q-pa-md col-12">
            <q-table
            title="Address"
            row-key="name"
            hide-header
            hide-bottom
            />
        </div>
      </div> 
  </section>
</template>

<script>


export default {
    data() {
        return {
            addressinput: '',
        }
    },
created () {
    
},
methods: {
},
}
</script>

<style lang="scss" scoped>

</style>