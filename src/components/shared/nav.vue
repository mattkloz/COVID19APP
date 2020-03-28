<template>
  <div>
  <gmap-map ref="map" :center="coords" :zoom="15" style="width: 100%; height: 300px">
    <gmap-marker :position="this.coords">
    </gmap-marker>
    <gmap-marker :position="this.destination">
    </gmap-marker>
  </gmap-map>
  <button @click="getDirection">get direction</button>
  </div>
</template>

<script>
import gmapsInit from '../../utils/gmaps';
 
export default {
  data() {
    return {
      coords: {},
      destination: {},
    }
  },
  computed: {
    currentCase () {
      return this.$store.getters['medical/getCurrentCase']
    }
  },
  created () {
    this.destination = {lat: this.currentCase.coords.lat, lng: this.currentCase.coords.long}
    
  },
  async mounted () {

  },
  methods: {
    getDirection: function() {

      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      directionsDisplay.setMap(this.$refs.map.$mapObject);

      function calculateAndDisplayRoute(directionsService, directionsDisplay, start, destination) {
        directionsService.route({
          origin: start,
          destination: destination,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }
      calculateAndDisplayRoute(directionsService, directionsDisplay, this.coords, this.destination);
    }
  },
}

</script>