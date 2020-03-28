<template>
  <section>
  <div class="credit content">
    <div class="q-mx-md q-mt-lg">
      <Symptoms />
    </div>
  </div>
  </section>
</template>

<script>
import Symptoms from "../../components/users/symptoms";

export default {
  name: "Credit",
  components: {
    Symptoms,
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
