<template>
  <div>
    <main class="q-pa-sm">
      <div class="container q-my-lg">
        <div class="row">
          <div class="col s12">
            <h6>Covey is an for people to request in-home testing of COVID-19 (aka Coronavirus). Requests for testing are then available to local medical professionals to process.</h6>
            <h6 style="margin: 30px 0;">Covey was created to relieve some burden on hospitals and keep people that are self-quarantined at home rather than venturing out for testing.</h6>
          </div>
        </div>
        <div class="row">
          <div class="col s12 text-center">
            <q-btn 
              outline
              rounded
              color="black"
              class="q-my-xs action-btn"
              label="Get Started"
              :to="{name: 'login' }"
            />
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            <h5 style="text-align: center;">
              Covey Features
            </h5>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-4 text-center">
            <div class="center promo">
              <q-icon name="las la-stethoscope" />
              <p class="promo-caption">
                Medical Professionals
              </p>
              <p class="light center">
                Covey makes it simple to manage in-home testing. It automatically creates daily caseloads and route navigation to each case. You can also update cases, add comments to cases, refer cases to another medical professional or institution.
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 text-center">
            <div class="center promo">
              <q-icon name="las la-home" />
              <p class="promo-caption">
                Request a Test from Home
              </p>
              <p class="light center">
                Users can request a test for themselves or others in minutes and receive updates when your test has been scheduled.
              </p>
            </div>
          </div>
          <div class="col-12 col-md-4 text-center">
            <div class="center promo">
              <q-icon name="las la-h-square" />
              <p class="promo-caption">
                Hospitals
              </p>
              <p class="light center">
                Hospitals or clinics can view the number of pending cases in their area, as well as the estimated likelihood of a cases needing to be admitted to their institution.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>

export default {
  components: {
  },
  methods: {

  }
};
</script>
<style lang="scss" scoped>
.action-btn {
  width: 75%;
}
.promo i {
  font-size: 5rem;
}
.promo-caption {
  font-size: 1.4em;
  font-weight: 600;
}
main {
  flex: 1 0 auto;
}
h4, h6 {
  margin: 0;
}
li {
  padding: 10px 0px;
}

</style>
