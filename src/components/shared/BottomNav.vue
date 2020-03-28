<template>
  <q-footer class="">
      <q-tabs
        v-model="tab"
        class="bg-grey-3 shadow-2 text-accent"
        :breakpoint="0"
        align="justify"
      >
        <q-route-tab to="/userdashboard/" name="userdashboard" icon="eva-file-add-outline"/>
        <q-route-tab to="/userprofile/" name="userprofile" icon="eva-person-outline" />
      </q-tabs>
    </q-footer>
</template>

<script>
export default {
  data() {
    return {
      tab: 'userdashboard',
    }
  },

}
</script>

<style lang="scss" scoped>
.q-tab__icon {
  font-size: 28px;
}

</style>