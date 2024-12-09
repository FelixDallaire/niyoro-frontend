<template>
  <div class="dropdown">
    <button class="btn btn-secondary btn-sm dropdown-toggle" type="button" id="dropdownMenuButton"
      data-bs-toggle="dropdown" aria-expanded="false">
      <i class="bi bi-gear-fill"></i>
    </button>
    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
      <li>
        <button class="dropdown-item" @click="editItem">
          <i class="bi bi-pencil-fill me-2"></i> Éditer
        </button>
      </li>
      <li>
        <button class="dropdown-item text-danger" @click="confirmDelete">
          <i class="bi bi-trash-fill me-2"></i> Supprimer
        </button>
      </li>
    </ul>
  </div>
</template>

<script>
import { useItemStore } from "@/stores/itemStore";

export default {
  name: "ItemDropdownMenu",
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  methods: {
    editItem() {
      this.$router.push({ name: "EditItem", params: { id: this.itemId } });
    },
    confirmDelete() {
      if (confirm("Êtes-vous sûr de vouloir supprimer cet item ?")) {
        const itemStore = useItemStore();
        itemStore.removeItem(this.itemId);
      }
    },
  },
};
</script>

<style scoped>
.dropdown-menu {
  border: none;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
