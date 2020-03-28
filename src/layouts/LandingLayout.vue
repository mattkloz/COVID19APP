<template>
  <q-layout view="hHh lpR fFf" class="content">
    <land-header />
    <q-page-container>
      <router-view />
    </q-page-container>
    <land-footer/>
  </q-layout>
</template>

<script>
import Header from '../components/shared/LandingHeader';
import Footer from '../components/shared/LandingFooter';

export default {

  components: {
    LandHeader: Header,
    LandFooter: Footer
  }
};
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
.action-btn {
  background-color: #811ecd;
  box-shadow: none;
  color: #fff;
  font-size: 1.3em;
}
.action-btn:hover, .action-btn:active {
  box-shadow: none;
  border-radius: 5px;
  border: 1px solid #811edc;
}
</style>
