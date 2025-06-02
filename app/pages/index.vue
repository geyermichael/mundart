<template>
  <div>
    <v-data-table
      :items="languages"
      :headers="headers"
      fixed-header
      :items-per-page="-1"
      hide-default-footer
      style="max-height: 90dvh"
      class="overflow-y-auto"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-web"
              size="x-small"
            />

            Languages
          </v-toolbar-title>

          <v-btn
            class="me-2"
            prepend-icon="mdi-plus"
            text="Add a language"
            @click="dialog = true"
          />
        </v-toolbar>
      </template>

      <template #[`item.actions`]>
        <v-btn
          v-for="action in actions"
          :key="action.label"
          :icon="action.icon"
          @click="action.click()"
        />
      </template>
    </v-data-table>

    <v-dialog
      v-model="dialog"
      max-width="500"
    >
      <v-card :title="`${isEditing ? 'Edit' : 'Add'} a language`">
        <template #text>
          <v-text-field
            v-model="state.country_code"
            variant="outlined"
            label="Country Code"
          />
          <v-text-field
            v-model="state.language_code"
            variant="outlined"
            label="Language Code"
          />
          <v-text-field
            v-model="state.name"
            variant="outlined"
            label="Name (optional)"
          />
          <v-checkbox
            v-if="!hasAlredyDefaultLocale"
            v-model="state.default"
            label="Set as default language"
            :disabled="isEditing && !hasAlredyDefaultLocale"
          />
        </template>

        <v-divider />

        <v-card-actions class="bg-surface-light">
          <v-btn
            text="Cancel"
            variant="plain"
            @click="dialog = false"
          />

          <v-spacer />

          <v-btn
            text="Save"
            @click="submit"
          />
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
const { data: languages, refresh } = await useFetch('/api/v1/meta', {
  transform: (response) => {
    const tableData = Object.values(response.languages).map((lang) => ({
      country_code: lang.country_code ?? '-',
      language_code: lang.language_code,
      name: lang.name ?? '-',
      default: lang.default ? 'Yes' : '',
    }));

    return tableData;
  },
});

const state = ref({
  country_code: '',
  language_code: '',
  name: '',
  default: false,
});

const dialog = ref(false);

const isEditing = ref(false);

const hasAlredyDefaultLocale = computed(() => {
  return languages.value?.some((lang) => lang.default);
});

const headers = [
  {
    key: 'country_code',
    title: 'Country code',
  },
  {
    key: 'language_code',
    title: 'Language code',
  },
  {
    key: 'name',
    title: 'Name',
  },
  {
    key: 'default',
    title: 'Default',
  },
  {
    key: 'actions',
    title: '',
    sortable: false,
  },
];

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
const actions = [
  {
    label: 'Edit',
    icon: 'mdi-pencil',
    click: () => alert('Editing is not implemented yet'),
  },
  {
    label: 'Delete',
    icon: 'mdi-delete',
    click: () => alert('Deleting is not implemented yet'),
  },
];

const submit = async () => {
  console.log('Submitting', state.value);
  await $fetch('/api/v1/locale', {
    method: 'POST',
    body: state.value,
  });

  dialog.value = false;
  // toast.add({ title: 'Language added!' });
  state.value = {
    country_code: '',
    language_code: '',
    name: '',
    default: false,
  };

  await refresh();
};
</script>
