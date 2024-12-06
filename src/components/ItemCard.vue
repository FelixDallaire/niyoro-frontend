<template>
  <div class="col">
    <div class="card h-100 shadow-sm">
      <div class="card-header bg-white border-bottom d-flex align-items-start justify-content-between">
        <div class="flex-grow-1">
          <h5 class="card-title mb-0">
            <a v-if="item.url" :href="item.url" target="_blank" rel="noopener noreferrer" class="link-dark text-decoration-none">
              {{ item.title }}
            </a>
            <span v-else>{{ item.title }}</span>
          </h5>
        </div>
        <div class="ms-2">
          <i v-if="item.private" class="bi bi-lock-fill" title="Private"></i>
          <i v-else class="bi bi-globe" title="Public"></i>
        </div>
      </div>

      <div class="card-body">
        <pre v-if="isCodeContent" class="code-wrapper">
          <code ref="codeBlock">{{ item.content }}</code>
        </pre>
        <p v-else class="card-text truncate-multiline">
          {{ item.content }}
        </p>

        <div class="mt-3">
          <span v-for="tagId in item.tags" :key="tagId">
            <a :href="'/tags/' + tagId" class="badge me-1 text-decoration-none">
              {{ getTagName(tagId) }}
            </a>
          </span>
        </div>
      </div>

      <div class="card-footer bg-white border-top d-flex justify-content-between align-items-center">
        <div v-if="isCreatedByUser">
          <button @click="togglePin(item)" class="btn btn-secondary btn-sm me-2" :title="item.sticky ? 'Désépingler' : 'Épingler'">
            <i :class="item.sticky ? 'bi bi-pin-fill' : 'bi bi-pin-angle-fill pinned'"></i>
          </button>
        </div>

        <a :href="'/item/' + item.permalink" class="btn btn-secondary btn-sm d-flex align-items-center justify-content-center">
          <i class="bi bi-info-circle-fill"></i>
        </a>

        <div v-if="isCreatedByUser" class="dropdown ms-2">
          <button class="btn btn-secondary btn-sm" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
            <i class="bi bi-gear-fill"></i>
          </button>
          <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuButton">
            <li><a class="dropdown-item" @click.prevent="editItem(item)" href="#">Modifier</a></li>
            <li><a class="dropdown-item text-danger" @click.prevent="deleteItem(item)" href="#">Supprimer</a></li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js';
import 'highlight.js/styles/grayscale.css';
import { useTagStore } from '@/stores/tagStore';
import { useUserStore } from '@/stores/userStore';
import { useItemStore } from '@/stores/itemStore';
import { onMounted, computed } from 'vue';

export default {
  name: 'ItemCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const tagStore = useTagStore();
    const userStore = useUserStore();
    const itemStore = useItemStore();

    onMounted(() => {
      if (!tagStore.tags.length) {
        tagStore.loadAllTags();
      }
    });

    const isCreatedByUser = computed(() => {
      return props.item.created_by === userStore.currentUser?._id;
    });

    return { tagStore, isCreatedByUser, itemStore };
  },
  computed: {
    isCodeContent() {
      const codeIndicators = /[{};<>]/;
      return codeIndicators.test(this.item.content);
    },
  },
  methods: {
    highlightCode() {
      if (this.isCodeContent) {
        const codeBlock = this.$refs.codeBlock;
        hljs.highlightBlock(codeBlock);
      }
    },
    getTagName(tagId) {
      const tag = this.tagStore.getTagById(tagId);
      return tag ? tag.name : 'Unknown';
    },
    togglePin(item) {
      this.itemStore.togglePin(item._id, item.sticky);
    },
    editItem(item) {
      console.log('Editing item:', item);
    },
    deleteItem(item) {
      this.itemStore.removeItem(item._id);
    },
  },
  mounted() {
    this.highlightCode();
  },
  updated() {
    this.highlightCode();
  },
};
</script>
