<template>
  <div>

  </div>
</template>

<script>

export default {
    name: 'WatchCases',
    data() {
        return {
        
        }
    },
    computed: {
        caseLoadCount () {
        return this.$store.getters['medical/getAllCasesCount']
        },
    },
    watch: {
        caseLoadCount(newvalue, oldvalue) {
        if (newvalue > oldvalue) {
            this.$q.notify({
            message: 'A New Comment was added to your case.',
            color: 'primary',
            icon: 'eva-bell-outline',
            actions: [
                { label: 'View', color: 'white', handler: () => { this.$router.push({ name: 'medicalallcases' }) } }
            ]
        })
        }
        }
    },
};
</script>

<style>

</style>