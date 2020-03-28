<template>
  <section>
  <div class="credit content">
    <div class="q-mx-md">
      <review />
    </div>
  </div>
  </section>
</template>

<script>
import review from "../../components/users/review";

export default {
  name: "Review",
  components: {
    review,
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
