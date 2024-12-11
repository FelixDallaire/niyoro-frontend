<template>
  <div class="card shadow-sm h-100">
    <div class="card-header text-center">
      <h5 class="card-title mb-0">Carte de l'emplacement</h5>
    </div>

    <div class="card-body p-4">
      <div id="map" class="rounded"></div>
    </div>

    <div class="card-footer text-center">
      <p class="mb-0">
        <strong>Latitude:</strong> {{ latitude }} | <strong>Longitude:</strong> {{ longitude }}
      </p>
    </div>
  </div>
</template>

<script>
import { onMounted, watch, ref } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "LeafletMap",
  props: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const mapInstance = ref(null);

    /**
     * Initialise la carte avec les coordonnées actuelles.
     */
    const initializeMap = () => {
      mapInstance.value = createMap([props.latitude, props.longitude]);
      addTileLayer();
      addMarker(props.latitude, props.longitude);
    };

    /**
     * Crée une instance de carte Leaflet centrée sur les coordonnées spécifiées.
     * 
     * @param {Array} coordinates - Tableau contenant la latitude et la longitude.
     * @returns {Object} L'instance de la carte Leaflet.
     */
    const createMap = (coordinates) =>
      L.map("map").setView(coordinates, 13);

    /**
     * Ajoute les tuiles de carte Google Maps à la carte Leaflet.
     */
    const addTileLayer = () => {
      L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: 'Données cartographiques &copy; <a href="https://www.google.com/maps">Google Maps</a>'
      }).addTo(mapInstance.value);
    };

    /**
     * Ajoute un marqueur à la carte aux coordonnées spécifiées.
     * 
     * @param {Number} latitude - Latitude du marqueur.
     * @param {Number} longitude - Longitude du marqueur.
     */
    const addMarker = (latitude, longitude) => {
      L.marker([latitude, longitude]).addTo(mapInstance.value);
    };

    /**
     * Met à jour la vue de la carte et ajoute un nouveau marqueur si les coordonnées changent.
     * 
     * @param {Array} newCoordinates - Tableau contenant la nouvelle latitude et longitude.
     */
    const updateMapView = ([newLatitude, newLongitude]) => {
      if (!mapInstance.value) return;
      mapInstance.value.setView([newLatitude, newLongitude], 13);
      addMarker(newLatitude, newLongitude);
    };

    // Initialise la carte au montage du composant
    onMounted(initializeMap);

    // Met à jour la carte si les coordonnées changent
    watch(() => [props.latitude, props.longitude], updateMapView);

    return {};
  },
};
</script>

<style scoped>
#map {
  height: 400px;
  width: 100%;
}
</style>
