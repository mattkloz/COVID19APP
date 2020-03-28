<template>
  <q-footer class="">
      <q-tabs
        v-model="tab"
        class="bg-grey-3 shadow-2 text-primary"
        :breakpoint="0"
        align="justify"
      >
        <q-route-tab to="/medicalallcases" name="allcases" icon="eva-archive-outline"/>
        <q-route-tab to="/medicaldashboard" name="dashboard" icon="eva-file-add-outline"/>
        <q-route-tab to="/medicalprofile" name="medicalprofile" icon="eva-person-outline" />
      </q-tabs>
    </q-footer>
</template>

<script>
export default {
  data() {
    return {
      tab: 'dashboard',
    }
  },

}
</script>

<style lang="scss" scoped>
.q-tab__icon {
  font-size: 28px;
}

</style>