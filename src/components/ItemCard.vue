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

      <div class="card-footer bg-white border-top d-flex justify-content-end">
        <a :href="'/item/' + item.permalink" class="btn btn-outline-primary d-flex align-items-center justify-content-between">
          View Details
          <i class="bi bi-chevron-right ms-2"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import hljs from 'highlight.js';
import 'highlight.js/styles/grayscale.css';
import { useTagStore } from '@/stores/tagStore';
import { onMounted } from 'vue';

export default {
  name: 'ItemCard',
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const tagStore = useTagStore();

    onMounted(() => {
      if (!tagStore.tags.length) {
        tagStore.loadAllTags();
      }
    });

    return { tagStore };
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
  },
  mounted() {
    this.highlightCode();
  },
  updated() {
    this.highlightCode();
  },
};
</script>

<style scoped>
.truncate-multiline {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
  line-clamp: 3;
  box-orient: vertical;
}

.code-wrapper {
  white-space: pre-wrap;
  word-break: break-word;
  background-color: #f9f9f9;
  padding: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid #e1e4e8;
  font-size: 0.875rem;
  line-height: 1.4;
  overflow-x: auto;
}
</style>
