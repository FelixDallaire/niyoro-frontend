<template>
  <div class="card shadow-sm h-100">
    <div class="card-header d-flex justify-content-between align-items-center">
      <div>
        <h5 class="card-title mb-0">{{ item.title }}</h5>
        <small class="text-muted">
          Par
          <router-link :to="{ name: 'Profile', params: { id: item.created_by._id } }" class="text-decoration-none">
            {{ item.created_by.username }}
          </router-link>
          • {{ formattedCreatedAt }}
        </small>
      </div>
      <i :class="item.private ? 'bi bi-lock-fill' : 'bi bi-globe'" :title="item.private ? 'Privé' : 'Public'"></i>
    </div>

    <div class="card-body">
      <code v-if="item.content" ref="codeBlock" class="highlighted rounded p-3"></code>

      <div v-if="item.tags.length" class="mt-3">
        <span v-for="tagId in item.tags" :key="tagId" class="badge me-1 text-decoration-none">
          {{ getTagName(tagId) }}
        </span>
      </div>
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
import { useTagStore } from "@/stores/tagStore";

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
    formattedCreatedAt() {
      const options = {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(this.item.createdAt).toLocaleDateString("fr-FR", options).replace(":", "h");
    },
  },
  methods: {
    highlightCode() {
      if (this.codeBlock) {
        if (this.codeBlock.dataset.highlighted) {
          delete this.codeBlock.dataset.highlighted;
        }
        this.codeBlock.textContent = this.item.content;
        hljs.highlightElement(this.codeBlock);
        this.codeBlock.dataset.highlighted = "yes";
      }
    },
    async toggleSticky() {
      const itemStore = useItemStore();
      await itemStore.togglePin(this.item._id, this.item.sticky);
    },
    viewDetails() {
      this.$router.push({ name: "ItemDetail", params: { id: this.item._id } });
    },
    editItem() {
      this.$router.push({ name: "EditItem", params: { id: this.item._id } });
    },
    deleteItem() {
      const itemStore = useItemStore();
      if (confirm("Êtes-vous sûr de vouloir supprimer cet item ?")) {
        itemStore.removeItem(this.item._id);
      }
    },
    getTagName(tagId) {
      const tagStore = useTagStore();
      const tag = tagStore.getTagById(tagId);
      return tag ? tag.name : "Tag inconnu";
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
.highlighted {
  display: block;
  white-space: pre-wrap;
}
</style>
