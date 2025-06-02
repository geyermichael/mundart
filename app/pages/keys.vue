<template>
  <div>
    <v-data-table
      :items="keys"
      :headers="headers"
      :search="search"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title>
            <v-icon
              color="medium-emphasis"
              icon="mdi-key"
              size="x-small"
            />

            Keys
          </v-toolbar-title>

          <div class="d-flex justify-end flex-grow-1 align-center">
            <v-text-field
              v-model="search"
              label="Search"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              hide-details
              single-line
              density="compact"
              class="w-50"
            />
            <v-btn
              class="me-2"
              prepend-icon="mdi-plus"
              text="Add a key"
              @click="dialog = true"
            />
          </div>
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
            v-model="state.key"
            variant="outlined"
            label="Key"
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
const { data, refresh } = await useFetch('/api/v1/keys');

const state = ref({
  key: '',
});

const dialog = ref(false);

const isEditing = ref(false);

const actions = [
  {
    label: 'Edit',
    icon: 'mdi-pencil',
    click: () => alert('Editing is not implemented yet'),
  },

  {
    label: 'Delete',
    icon: 'mdi-delete',
    click: () => alert('Editing is not implemented yet'),
  },
];

interface Headers {
  key: string;
  title: string;
  sortable?: boolean;
}

const headers = ref<Headers[]>([]);

interface Key {
  key: string;
}

const keys = ref<Key[]>([]);

const search = ref('');

watchEffect(() => {
  if (!data.value?.defaultLocale) return;

  // generate columns data for all languages that are available
  const languageCols = data.value?.languages.map((lang) => {
    return {
      key: lang,
      title: lang === data.value?.defaultLocale ? `${lang} 👋` : lang,
    };
  });

  // sort key by default language first
  languageCols!.sort((a, b) => {
    if (a.key === data.value?.defaultLocale && b.key !== data.value?.defaultLocale) {
      return -1;
    }
    if (a.key !== data.value?.defaultLocale && b.key === data.value?.defaultLocale) {
      return 1;
    }
    return 0;
  });

  // set table columns
  headers.value.splice(0, headers.value.length); // Clear the array
  headers.value.push(
    {
      key: 'key',
      title: 'Key',
      sortable: true,
    },
    ...languageCols!,
    {
      key: 'actions',
      title: '',
    }
  );

  // set languages columns values to indicate if the key is missing or not
  const setLanguageColumnValues = (key: string) => {
    // set all languages to have a be present as default
    const res = data.value?.languages.reduce(
      // @ts-expect-error - TS complains about the return type
      (acc, curr) => ((acc[curr] = '✅'), acc),
      {}
    );

    // set missing keys to have a warning icon
    data.value?.missingKeys.forEach((item) => {
      if (item.key === key) {
        // @ts-expect-error - TS complains about the return type
        res[item.language] = '❗️';
      }
    });

    return res;
  };

  keys.value.splice(0, keys.value.length); // Clear the array
  data.value?.keys.forEach((item) => {
    keys.value.push({
      key: item,
      ...setLanguageColumnValues(item),
    });
  });
});

const submit = async () => {
  await $fetch('/api/v1/keys', {
    method: 'POST',
    body: state.value,
  });
  dialog.value = false;
  state.value.key = '';
  await refresh();
};
</script>
