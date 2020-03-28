import Vue from "vue";
import * as VueGoogleMaps from "vue2-google-maps";
import apiKey from './googlemaps.env.json'

Vue.use(VueGoogleMaps, {
  load: {
    key: apiKey,
    libraries: "places, visualization, geocoder, directions"
  }
});