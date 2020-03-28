<template>
  <section>
  <div class="credit content">
    <div class="q-mx-md q-mt-lg">
      <h6 style="margin: 20px 0;">My Cases</h6>
        <mycases />
    <div class="col text-center q-my-lg">
        <q-btn
            outline 
            color="primary" 
            class="action-btn"
            @click="newCase"
        >
            Create New Case
        </q-btn>
    </div>
    </div>
  </div>
  </section>
</template>

<script>
import mycases from "../../components/users/mycases";

export default {
  name: "UserDashboard",
  components: {
      mycases,
  },
  props: ["name"],
  data() {
    return {
    };
  },
  methods: {
      newCase() {
          this.$router.push({ name: 'newcase' })
      },
  },
  computed: {
    user () {
      return this.$store.getters.user
    },
    
  },
  created () {
  },
};
</script>

<style>

</style>
