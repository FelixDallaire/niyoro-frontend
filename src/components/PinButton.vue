<template>
  <button class="btn btn-sticky btn-sm position-absolute top-0 end-0 m-2" :class="{ pinned: sticky }"
    :hidden="!isVisible" :disabled="!canToggle" @click="toggleSticky" :title="sticky ? 'Désépingler' : 'Épingler'">
    <i :class="sticky ? 'bi bi-pin-fill' : 'bi bi-pin-angle-fill'"></i>
  </button>
</template>

<script>
export default {
  name: "PinButton",
  props: {
    sticky: {
      type: Boolean,
      required: true,
    },
    isOwner: {
      type: Boolean,
      required: true,
    },
    is_admin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  computed: {
    isVisible() {
      return this.isOwner || this.is_admin || this.sticky;
    },
    canToggle() {
      return this.isOwner || this.is_admin;
    },
  },
  methods: {
    toggleSticky() {
      this.$emit("toggle-sticky");
    },
  },
};
</script>

<style scoped>
.btn-sticky {
  z-index: 1;
}
</style>