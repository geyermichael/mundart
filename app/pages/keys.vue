<template>
  <div>
    <div class="flex justify-center mb-4">
      <div class="text-xl">Keys</div>
      <UButton
        label="Add new"
        class="ml-auto"
        disabled
        @click="isOpen = true"
      />

      <UModal v-model="isOpen">
        <div class="p-4">
          <UForm
            :state="state"
            class="space-y-4"
            @submit="onSubmit"
          >
            <UFormGroup
              class="py-2"
              label="Key"
            >
              <UInput
                v-model="state.key"
                placeholder="foo.bar"
              />
            </UFormGroup>

            <UButton
              label="Add"
              class="mt-4"
              type="submit"
            />
          </UForm>
        </div>
      </UModal>
    </div>

    <div v-if="data?.defaultLanguage">
      <div class="flex px-3 py-3.5 border-b border-gray-200 dark:border-gray-700">
        <UInput
          v-model="q"
          placeholder="Search for keys..."
        />
      </div>

      <UTable
        :rows="rows"
        :columns="columns"
      >
        <template #empty-state>
          <div class="flex flex-col items-center justify-center py-6 gap-3">
            <span class="italic text-sm">No keys found!</span>
          </div>
        </template>

        <template #actions-data="{ row }">
          <UDropdown :items="items(row)">
            <UButton
              color="gray"
              variant="ghost"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
            />
          </UDropdown>
        </template>
      </UTable>
      <div class="flex justify-end px-3 py-3.5 border-t border-gray-200 dark:border-gray-700">
        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="keys.length"
        />
      </div>
    </div>
    <div v-else>
      <UAlert
        variant="solid"
        title="No default language found!"
        color="yellow"
        icon="i-heroicons-information-circle"
        description="You need to set a default language in the '.meta.json' file to be able to manage keys."
      />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/v1/keys');

const isOpen = ref(false);
const state = reactive({
  key: '',
});

const page = ref(1);
const pageCount = 10;

const rows = computed(() => {
  if (q.value) {
    return filteredRows.value.slice((page.value - 1) * pageCount, page.value * pageCount);
  } else {
    return keys.slice((page.value - 1) * pageCount, page.value * pageCount);
  }
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const items = (row: any) => [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => console.log('Edit', row.id),
    },
    {
      label: 'Duplicate',
      icon: 'i-heroicons-document-duplicate-20-solid',
    },
  ],
  [
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
    },
  ],
];

const columns: {
  key: string;
  label: string;
  sortable?: boolean;
}[] = reactive([]);

const keys: {
  key: string;
}[] = reactive([]);

const q = ref('');

const filteredRows = computed(() => {
  if (!q.value) {
    return keys;
  }

  return keys.filter((key) => {
    return Object.values(key).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

watchEffect(() => {
  if (!data.value?.defaultLanguage) return;

  // generate columns data for all languages that are available
  const languageCols = data.value?.languages.map((lang) => {
    return {
      key: lang,
      label: lang === data.value?.defaultLanguage ? `${lang} 👋` : lang,
    };
  });

  // sort key by default language first
  languageCols!.sort((a, b) => {
    if (a.key === data.value?.defaultLanguage && b.key !== data.value?.defaultLanguage) {
      return -1;
    }
    if (a.key !== data.value?.defaultLanguage && b.key === data.value?.defaultLanguage) {
      return 1;
    }
    return 0;
  });

  // set table columns
  columns.splice(0, columns.length); // Clear the array
  columns.push(
    {
      key: 'key',
      label: 'Key',
      sortable: true,
    },
    ...languageCols!,
    {
      key: 'actions',
      label: '',
    },
  );

  // set languages columns values to indicate if the key is missing or not
  const setLanguageColumnValues = (key: string) => {
    // set all languages to have a be present as default
    const res = data.value?.languages.reduce(
      // @ts-expect-error - TS complains about the return type
      (acc, curr) => ((acc[curr] = '✅'), acc),
      {},
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

  keys.splice(0, keys.length); // Clear the array
  data.value?.keys.forEach((item) => {
    keys.push({
      key: item,
      ...setLanguageColumnValues(item),
    });
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (event: any) => {
  console.log(event.data);
};
</script>
