<template>
  <div class="card shadow-sm h-100">
    <div class="card-header d-flex justify-content-center">
      <h5 class="card-title mb-0">Réactions</h5>
    </div>

    <div class="card-body d-flex flex-column justify-content-center align-items-center gap-3" style="height: 100%;">
      <div class="d-flex justify-content-between align-items-center w-100">
        <button v-for="type in reactionTypes" :key="type.value"
          class="btn d-flex align-items-center justify-content-center rounded-circle" :class="{
            'btn-primary': userReaction?.type !== String(type.value),
            'btn-danger': userReaction?.type === String(type.value),
          }" @click="handleReaction(type.value)" :title="type.label"
          :disabled="userReaction && userReaction.type !== String(type.value)">
          <i :class="type.icon"></i>
        </button>
      </div>
      <div class="d-flex flex-wrap justify-content-between align-items-center w-100 mt-2">
        <span v-for="type in reactionTypes" :key="type.value" class="badge bg-secondary d-flex align-items-center mx-2"
          :title="`Nombre de réactions: ${type.label}`">
          {{ getReactionCount(type.value) }}
        </span>
      </div>
    </div>
    <div class="card-footer"></div>
  </div>
</template>


<script>
import { onMounted, computed } from "vue";
import { useReactionStore } from "@/stores/reactionStore";
import { useUserStore } from "@/stores/userStore";

export default {
  name: "ItemReaction",
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const reactionStore = useReactionStore();
    const userStore = useUserStore();

    const currentUser = computed(() => userStore.currentUser);

    const reactions = computed(() => reactionStore.reactions);
    const userReaction = computed(() =>
      reactions.value.find(
        (reaction) =>
          reaction.user_id._id === currentUser.value?.userId &&
          reaction.item_id === props.itemId
      )
    );

    const reactionTypes = [
      { label: "J'aime", value: 1, icon: "bi bi-hand-thumbs-up-fill" },
      { label: "Informatif", value: 2, icon: "bi bi-info-circle-fill" },
      { label: "Drôle", value: 3, icon: "bi bi-emoji-laughing-fill" },
      { label: "Inapproprié", value: 4, icon: "bi bi-exclamation-circle-fill" },
    ];

    const getReactionCount = (type) =>
      reactions.value.filter(
        (reaction) =>
          reaction.type === String(type) && reaction.item_id === props.itemId
      ).length;


    const canReact = (type) => {
      return !userReaction.value || userReaction.value.type === type;
    };

    const handleReaction = async (type) => {
      try {
        if (userReaction.value?.type === String(type)) {
          await reactionStore.removeReaction(userReaction.value._id);
        } else {
          await reactionStore.addReaction(props.itemId, type);
        }

        await reactionStore.loadReactionsByItem(props.itemId);
      } catch (err) {
        console.error("Failed to handle reaction:", err);
      }
    };

    onMounted(async () => {
      try {
        await reactionStore.loadReactionsByItem(props.itemId);
      } catch (err) {
        console.error("Failed to load reactions:", err);
      }
    });

    return {
      reactions,
      userReaction,
      reactionTypes,
      getReactionCount,
      handleReaction,
    };
  },
};
</script>
