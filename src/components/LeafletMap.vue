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

    const initializeMap = () => {
      mapInstance.value = createMap([props.latitude, props.longitude]);
      addTileLayer();
      addMarker(props.latitude, props.longitude);
    };

    const createMap = (coordinates) =>
      L.map("map").setView(coordinates, 13);

    const addTileLayer = () => {
      L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    subdomains:['mt0','mt1','mt2','mt3'],
    attribution: 'Map data &copy; <a href="https://www.google.com/maps">Google Maps</a>'
}).addTo(mapInstance.value);

    };

    const addMarker = (latitude, longitude) => {
      L.marker([latitude, longitude]).addTo(mapInstance.value);
    };

    const updateMapView = ([newLatitude, newLongitude]) => {
      if (!mapInstance.value) return;
      mapInstance.value.setView([newLatitude, newLongitude], 13);
      addMarker(newLatitude, newLongitude);
    };

    onMounted(initializeMap);

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
