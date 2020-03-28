<template>
  <div>

  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
    name: 'WatchCases',
    data() {
        return {
        
        }
    },
    computed: {
        ...mapState('medical', ['allCases']),
    },
    watch: {
        allCases(newvalue, oldvalue) {
        if (newvalue > oldvalue) {
            this.$q.notify({
                timeout: 1000,
                message: 'A New Case was opened in your area',
                color: 'primary',
                icon: 'eva-bell-outline',
                actions: [
                    { label: 'View', color: 'white', handler: () => { this.$router.replace({ name: 'medicalallcases' }).catch(() => {}) } }
                ]
        })
        }
        }
    },
};
</script>

<style>

</style>