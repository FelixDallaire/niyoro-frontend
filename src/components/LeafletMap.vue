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
      mapInstance.value = L.map("map").setView([props.latitude, props.longitude], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstance.value);

      addMarker(props.latitude, props.longitude, "Item Location");
    };

    const addMarker = (latitude, longitude, popupText) => {
      L.marker([latitude, longitude])
        .addTo(mapInstance.value)
        .bindPopup(popupText)
        .openPopup();
    };

    const updateMapView = ([newLatitude, newLongitude]) => {
      if (mapInstance.value) {
        mapInstance.value.setView([newLatitude, newLongitude], 13);
        addMarker(newLatitude, newLongitude, "Updated Location");
      }
    };

    onMounted(() => {
      initializeMap();
    });

    watch(
      () => [props.latitude, props.longitude],
      updateMapView
    );

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
