<template>
  <div class="add-item-view container mt-4">
    <div class="rounded p-4 shadow-sm bg-white">
      <h2 class="mb-4">{{ isEditMode ? "Modifier l'item" : "Ajouter un nouvel item" }}</h2>
      <ItemForm :initialData="initialData" :isEditMode="isEditMode" @submit="handleSubmit" />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { useItemStore } from "@/stores/itemStore";
import { useRouter, useRoute } from "vue-router";
import { useTagStore } from "@/stores/tagStore";
import ItemForm from "@/components/ItemForm.vue";

export default {
  name: "AddItemView",
  components: {
    ItemForm,
  },
  setup() {
    const itemStore = useItemStore();
    const tagStore = useTagStore();
    const router = useRouter();
    const route = useRoute();

    const isEditMode = ref(route.name === "EditItem");

    const initialData = ref({
      title: "",
      url: null,
      content: "",
      latitude: null,
      longitude: null,
      tagsInput: "",
      private: false,
      sticky: false,
    });

    onMounted(async () => {
      if (isEditMode.value) {
        await loadItemData();
      }
    });

    /**
     * Handles the submission of the form.
     *
     * @param {Object} formData - The data submitted from the form.
     * @returns {Promise<void>} Resolves after the item is successfully added or edited.
     */
    const handleSubmit = async (formData) => {
      try {
        if (isEditMode.value) {
          await itemStore.editItem(route.params.id, formData);
          alert("Item modifié avec succès !");
        } else {
          await itemStore.addItem(formData);
          alert("Item créé avec succès !");
          router.push({ name: "ItemDetail", params: { permalink: itemStore.selectedItem.permalink } });
          return;
        }

        router.push("/");
      } catch (error) {
        alert("Une erreur est survenue.");
      }
    };

    /**
     * Loads the initial data for the form in edit mode.
     * Fetches the item by ID and loads all tags if not already loaded.
     *
     * @returns {Promise<void>} Resolves after the item and tags are loaded.
     */
    const loadItemData = async () => {
      try {
        await itemStore.loadItemById(route.params.id);
        const item = itemStore.selectedItem;

        if (!item) {
          throw new Error("Item not found or could not be loaded.");
        }

        if (!tagStore.tags.length) {
          await tagStore.loadAllTags();
        }

        const tagNames = item.tags
          .map((tagId) => {
            const tag = tagStore.getTagById(tagId);
            return tag ? tag.name : null;
          })
          .filter((name) => name);

        initialData.value = {
          ...item,
          latitude: item.latitude ?? null,
          longitude: item.longitude ?? null,
          tagsInput: tagNames.join(" "),
        };
      } catch (error) {
        alert("Une erreur est survenue.");
      }
    };

    return {
      initialData,
      isEditMode,
      handleSubmit,
      loadItemData,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
