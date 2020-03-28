<template>
  <q-layout view="hHh lpR fFf" class="content">
    <app-header />
    <q-banner inline-actions class="text-white bg-red" style="margin-top: 50px; text-align: center;">
      <h5 style="margin: 0;">Attention: This app is currently in development and is not ready for public use!</h5>
    </q-banner>
    <q-page-container style="max-width: 800px; display: block; margin: 0 auto; padding-top: 0;">
      <router-view />
    </q-page-container>
  <bottom-nav/>
  </q-layout>
</template>

<script>
import Header from '../components/shared/TopNav.vue';
import BottomNav from "../components/shared/BottomNav";

const menuList = [
  {
    icon: 'eva-file-add-outline',
    label: 'Dashboard',
    separator: false,
    to: 'userdashboard'
  },
  {
    icon: 'eva-person-outline',
    label: 'Profile',
    separator: false,
    to: 'userprofile'
  },
]
export default {
  components: {
    AppHeader: Header,
    BottomNav
  },
  data () {
    return {
      drawer: false,
      menuList,
      drawerRight: true,
      drawerLeft: true
    }
  }
}
</script>

<style lang="scss">
.content {
  font-family: 'Lora', serif;
  color: #2C3E50 !important;
}
</style>
