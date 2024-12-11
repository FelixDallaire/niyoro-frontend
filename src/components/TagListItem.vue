<template>
    <li class="list-group-item d-flex justify-content-between align-items-center">
        <div v-if="isEditing" class="d-flex w-100">
            <input v-model="editedTagName" type="text" class="form-control me-2"
                :class="{ 'is-invalid': hasValidationError }" @keydown.enter="confirmEdit" />
            <div v-if="hasValidationError" class="invalid-feedback">Tag invalide.</div>
        </div>
        <div v-else class="w-100">
            {{ tag.name }}
        </div>
        <div class="d-flex align-items-center ms-3">
            <button v-if="!isEditing" class="btn btn-secondary btn-sm me-2" @click="startEdit">
                <i class="bi bi-pencil-fill"></i>
            </button>
            <button v-else class="btn btn-secondary btn-sm me-2" @click="confirmEdit">
                <i class="bi bi-check-lg"></i>
            </button>
            <button class="btn btn-danger btn-sm" @click="confirmDelete">
                <i class="bi bi-trash3-fill"></i>
            </button>
        </div>
    </li>
</template>

<script>
export default {
    name: "TagListItem",
    props: {
        tag: {
            type: Object,
            required: true,
        },
        onDelete: {
            type: Function,
            required: true,
        },
        onEdit: {
            type: Function,
            required: true,
        },
    },
    data() {
        return {
            isEditing: false,
            editedTagName: this.tag.name,
            hasValidationError: false,
        };
    },
    methods: {
        /**
         * Active le mode d'édition et initialise le nom du tag pour modification.
         */
        startEdit() {
            this.isEditing = true;
            this.editedTagName = this.tag.name;
            this.hasValidationError = false;
        },
        /**
         * Valide le nouveau nom du tag et applique les modifications si valide.
         * Émet un événement pour informer le parent de la modification.
         */
        async confirmEdit() {
            if (this.isInvalidName(this.editedTagName)) {
                this.hasValidationError = true;
                return;
            }
            this.hasValidationError = false;
            await this.onEdit(this.tag._id, { name: this.editedTagName });
            this.isEditing = false;
        },
        /**
         * Confirme la suppression du tag et émet un événement pour informer le parent.
         */
        confirmDelete() {
            this.onDelete(this.tag._id);
        },
        /**
         * Vérifie si un nom de tag est invalide.
         * 
         * @param {String} name - Le nom du tag à valider.
         * @returns {Boolean} True si le nom est invalide, sinon False.
         */
        isInvalidName(name) {
            return !name || name.trim() === "";
        },
    },
};
</script>

<style scoped></style>
