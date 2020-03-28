<template>
  <q-layout view="hHh lpR fFf" class="content">
    <app-header />
    <q-banner inline-actions class="text-white bg-red" style="margin-top: 50px; text-align: center;">
      <h5 style="margin: 0;">Attention: This app is currently in development and is not ready for public use!</h5>
    </q-banner>
    <q-page-container style="max-width: 800px; display: block; margin: 0 auto; padding-top: 0;">
      <router-view />
    </q-page-container>
    <watch-cases/>
  <bottom-nav/>
  </q-layout>
</template>

<script>
import Header from '../components/medical/TopNav.vue';
import BottomNav from "../components/medical/BottomNav";
import WatchCases from "../components/medical/watchcases";
export default {
  components: {
    AppHeader: Header,
    BottomNav,
    WatchCases,
  },
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss">
.content {
  font-family: 'Lora', serif;
  color: #2C3E50 !important;
}
.section-header {
  text-align: center;
  background-color: purple;
  color: #fff;
  border-radius: 15px;
  margin: 15px 0 10px 0;
}
</style>
