<template>
  <div class="card shadow-sm h-100">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <h5 class="card-title mb-0">{{ item.title }}</h5>
        <small class="text-muted">Créé par : {{ item.created_by.username }}</small>
      </div>
      <i :class="item.private ? 'bi bi-lock-fill' : 'bi bi-globe'" :title="item.private ? 'Privé' : 'Public'"></i>
    </div>

    <div class="card-body">
      <pre class="content-wrapper rounded">
        <code ref="codeBlock">{{ item.content }}</code>
      </pre>
    </div>

    <div class="card-footer d-flex justify-content-between align-items-center">
      <button class="btn btn-sticky btn-sm" :class="{ pinned: item.sticky }"
        :disabled="!isOwner && !currentUser.isAdmin" @click="toggleSticky"
        :title="item.sticky ? 'Désépingler' : 'Épingler'">
        <i :class="item.sticky ? 'bi bi-pin-fill' : 'bi bi-pin-angle-fill'"></i>
      </button>

      <button class="btn btn-secondary btn-sm" :title="'Voir les détails de l’item'" @click="viewDetails">
        <i class="bi bi-info-circle-fill"></i>
      </button>

      <div v-if="isOwner" class="dropdown">
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
            <button class="dropdown-item text-danger" @click="deleteItem">
              <i class="bi bi-trash-fill me-2"></i> Supprimer
            </button>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from "highlight.js";
import "highlight.js/styles/paraiso-light.css";
import { useItemStore } from "@/stores/itemStore";

export default {
  name: "ItemCard",
  props: {
    item: {
      type: Object,
      required: true,
    },
    currentUser: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      codeBlock: null,
    };
  },
  computed: {
    isOwner() {
      return this.currentUser?.userId === this.item?.created_by?._id;
    },
  },
  methods: {
    highlightCode() {
      if (this.codeBlock) {
        if (this.codeBlock.dataset.highlighted) {
          delete this.codeBlock.dataset.highlighted;
        }
        hljs.highlightElement(this.codeBlock);
        this.codeBlock.dataset.highlighted = "yes";
      }
    },
    async toggleSticky() {
      const itemStore = useItemStore();
      await itemStore.togglePin(this.item._id, this.item.sticky);
    },
    viewDetails() { },
    editItem() { },
    deleteItem() {
      const itemStore = useItemStore();
      itemStore.removeItem(this.item._id);
    },
  },
  mounted() {
    this.codeBlock = this.$refs.codeBlock;
    this.highlightCode();
  },
  watch: {
    "item.content": function () {
      this.highlightCode();
    },
  },
};
</script>

<style scoped>
.content-wrapper {
  white-space: pre-wrap;
  background-color: #f8f9fa;
  padding: 0.5rem;
}
</style>
