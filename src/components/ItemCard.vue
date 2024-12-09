<template>
  <div class="card shadow-sm h-100">
    <div class="card-header d-flex position-relative">
      <div class="flex-grow-1 me-5">
        <h5 class="card-title mb-0 text-wrap">{{ item.title }}</h5>
        <small class="text-muted">
          <i :class="item.private ? 'bi bi-lock-fill' : 'bi bi-globe'" :title="item.private ? 'Privé' : 'Public'"></i>
          • Par
          <router-link :to="{ name: 'Profile', params: { id: item.created_by._id } }" class="text-decoration-none">
            {{ item.created_by.username }}
          </router-link>
          • {{ formattedCreatedAt }}
        </small>
      </div>
      <PinButton
        :sticky="item.sticky"
        :isOwner="isOwner"
        :isAdmin="currentUser.isAdmin"
        @toggle-sticky="toggleSticky"
      />
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
      <button class="btn btn-secondary btn-sm" :title="'Voir les détails de l’item'" @click="viewDetails">
        <i class="bi bi-info-circle-fill"></i>
      </button>

      <ItemDropdownMenu v-if="isOwner" :itemId="item._id" />
    </div>
  </div>
</template>

<script>
import hljs from "highlight.js";
import "highlight.js/styles/paraiso-light.css";
import { useItemStore } from "@/stores/itemStore";
import { useTagStore } from "@/stores/tagStore";
import PinButton from "@/components/PinButton.vue";
import ItemDropdownMenu from "@/components/ItemDropdownMenu.vue";

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
      default: () => ({}),
    },
  },
  data() {
    return {
      codeBlock: null,
    };
  },
  computed: {
    isOwner() {
      return this.currentUser?.userId && this.currentUser.userId === this.item?.created_by?._id;
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
      this.$router.push({ name: "ItemDetail", params: { id: this.item.permalien } });
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
  components: {
    PinButton,
    ItemDropdownMenu,
  },
};
</script>

<style scoped>
.highlighted {
  display: block;
  white-space: pre-wrap;
}

.card-header .btn-sticky {
  z-index: 1;
}

.card-header {
  overflow: hidden;
}

.card-title {
  word-break: break-word;
}
</style>
