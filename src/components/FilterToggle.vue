<template>
    <div class="d-flex justify-content-between align-items-center mb-3">
        <h1>Items</h1>
        <div>
            <label for="showMyItems" class="form-check-label me-2">Afficher mes items uniquement</label>
            <input type="checkbox" id="showMyItems" :checked="showMyItems" class="form-check-input"
                @change="handleToggle" />
        </div>
    </div>
</template>

<script>
export default {
    name: 'FilterToggle',
    props: {
        showMyItems: {
            type: Boolean,
            required: true,
        },
    },
    emits: ['update:showMyItems'],
    methods: {
        handleToggle(event) {
            this.$emit('update:showMyItems', event.target.checked);
        },
    },
};
</script>

<style scoped></style>