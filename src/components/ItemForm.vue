<template>
    <div class="item-form rounded p-4 shadow-sm mx-auto bg-white">
      <h2 class="mb-4">{{ isEditMode ? "Modifier l'item" : "Créer l'item" }}</h2>
      <form @submit.prevent="handleSubmit" class="needs-validation" novalidate>
        <div class="mb-3">
          <label for="itemTitle" class="form-label">Titre <span class="text-danger">*</span></label>
          <input
            type="text"
            id="itemTitle"
            v-model="formData.title"
            class="form-control"
            :class="validationClass('title')"
            required
          />
          <div class="invalid-feedback">Le titre est requis et ne doit pas dépasser 100 caractères.</div>
        </div>
  
        <div class="mb-3">
          <label for="itemUrl" class="form-label">Lien <span class="text-muted">(Optionnel)</span></label>
          <input
            type="url"
            id="itemUrl"
            v-model="formData.url"
            class="form-control"
            :class="validationClass('url')"
            placeholder="https://example.com"
          />
          <div class="invalid-feedback">L'URL doit être valide (commençant par http:// ou https://).</div>
        </div>
  
        <div class="mb-3">
          <label for="itemContent" class="form-label">Contenu <span class="text-muted">(Optionnel)</span></label>
          <textarea
            id="itemContent"
            v-model="formData.content"
            rows="4"
            class="form-control"
          ></textarea>
        </div>
  
        <div class="row">
          <div class="col-md-6 mb-3">
            <label for="latitude" class="form-label">Latitude <span class="text-muted">(Optionnel)</span></label>
            <input
              type="number"
              id="latitude"
              v-model="formData.latitude"
              class="form-control"
              :class="validationClass('latitude')"
              placeholder="-90 à 90"
            />
            <div class="invalid-feedback">La latitude doit être entre -90 et 90.</div>
          </div>
          <div class="col-md-6 mb-3">
            <label for="longitude" class="form-label">Longitude <span class="text-muted">(Optionnel)</span></label>
            <input
              type="number"
              id="longitude"
              v-model="formData.longitude"
              class="form-control"
              :class="validationClass('longitude')"
              placeholder="-180 à 180"
            />
            <div class="invalid-feedback">La longitude doit être entre -180 et 180.</div>
          </div>
        </div>
  
        <div class="mb-3">
          <label for="itemTags" class="form-label">Tags <span class="text-muted">(Optionnel)</span></label>
          <input
            type="text"
            id="itemTags"
            v-model="formData.tagsInput"
            class="form-control"
          />
          <small class="form-text text-muted">
            Entrez les tags séparés par un espace. Ex: "recette cuisine dessert".
          </small>
        </div>
  
        <div class="form-check mb-3">
          <input
            type="checkbox"
            id="itemPrivate"
            v-model="formData.private"
            class="form-check-input"
          />
          <label for="itemPrivate" class="form-check-label">Privé</label>
        </div>
  
        <div class="form-check mb-3">
          <input
            type="checkbox"
            id="itemSticky"
            v-model="formData.sticky"
            class="form-check-input"
          />
          <label for="itemSticky" class="form-check-label">Épingler</label>
        </div>
  
        <button type="submit" class="btn btn-primary w-100">
          {{ isEditMode ? "Modifier l'item" : "Créer l'item" }}
        </button>
      </form>
    </div>
  </template>
  
  <script>
  import { ref } from "vue";
  
  export default {
    name: "ItemForm",
    props: {
      initialData: {
        type: Object,
        default: () => ({
          title: "",
          url: null,
          content: "",
          latitude: null,
          longitude: null,
          tagsInput: "",
          private: false,
          sticky: false,
        }),
      },
      isEditMode: {
        type: Boolean,
        default: false,
      },
    },
    emits: ["submit"],
    setup(props, { emit }) {
      const formData = ref({ ...props.initialData });
      const attemptedSubmit = ref(false);
  
      const isValid = ref({
        title: false,
        url: true,
        latitude: true,
        longitude: true,
      });
  
      const validateField = (field) => {
        switch (field) {
          case "title":
            isValid.value.title =
              formData.value.title.trim().length > 0 &&
              formData.value.title.trim().length <= 100;
            break;
  
          case "url":
            isValid.value.url =
              !formData.value.url || /^(http|https):\/\/[^ "]+$/.test(formData.value.url.trim());
            break;
  
          case "latitude":
            isValid.value.latitude =
              formData.value.latitude === null ||
              (formData.value.latitude >= -90 && formData.value.latitude <= 90);
            break;
  
          case "longitude":
            isValid.value.longitude =
              formData.value.longitude === null ||
              (formData.value.longitude >= -180 && formData.value.longitude <= 180);
            break;
  
          default:
            break;
        }
      };
  
      const validateForm = () => {
        Object.keys(isValid.value).forEach(validateField);
      };
  
      const validationClass = (field) => {
        if (!attemptedSubmit.value) return "";
        return isValid.value[field] ? "is-valid" : "is-invalid";
      };
  
      const handleSubmit = () => {
        attemptedSubmit.value = true;
        validateForm();
  
        if (!isValid.value.title) {
          return;
        }
  
        const tagsArray = formData.value.tagsInput
          .trim()
          .split(/\s+/)
          .filter((tag) => tag);
  
        const payload = { ...formData.value, tags: tagsArray };
        emit("submit", payload);
      };
  
      return {
        formData,
        validationClass,
        handleSubmit,
      };
    },
  };
  </script>
  
  <style scoped>
  </style>
  