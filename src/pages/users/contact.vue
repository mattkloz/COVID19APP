<template>
  <section>
  <div class="credit content">
    <div class="q-mx-md q-mt-lg">
      <new-case-form />
    <!-- <newaddress/> -->
    </div>
  </div>
  </section>
</template>

<script>
import NewCaseForm from "../../components/users/newcaseform";
import newaddress from "../../components/users/address";

export default {
  name: "Contact",
  components: {
    NewCaseForm,
    newaddress,
  },
  props: ["name"],
  data() {
    return {
    };
  },
  methods: {
  },
};
</script>

<style>

</style>
