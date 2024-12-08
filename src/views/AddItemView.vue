<template>
  <div class="add-item-view container mt-4">
    <div class="rounded p-4 shadow-sm bg-white">
      <h2 class="mb-4">Ajouter un nouvel item</h2>
      <ItemForm @submit="createItem" />
    </div>
  </div>
</template>

<script>
import ItemForm from "@/components/ItemForm.vue";
import { useItemStore } from "@/stores/itemStore";
import { useRouter } from "vue-router";

export default {
  name: "AddItemView",
  components: {
    ItemForm,
  },
  setup() {
    const itemStore = useItemStore();
    const router = useRouter(); 

    const createItem = async (formData) => {
      console.log("[DEBUG] Form data received in createItem:", formData); 
      try {
        const result = await itemStore.addItem(formData);
        console.log("[DEBUG] Item successfully added:", result); 

        alert("Item créé avec succès !");
        
        router.push("/");
      } catch (error) {
        console.error("[ERROR] Failed to create item:", error);
        alert("Une erreur est survenue.");
      }
    };

    return {
      createItem,
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
}
</style>
