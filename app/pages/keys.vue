<template>
  <div class="flex justify-center mb-4">
    <div class="text-xl">Keys</div>
    <UButton @click="isOpen = true" label="Add new" class="ml-auto" disabled />

    <UModal v-model="isOpen">
      <div class="p-4">
        <UForm :state="state" class="space-y-4" @submit="onSubmit">
          <UFormGroup class="py-2" label="Key">
            <UInput v-model="state.key" placeholder="foo.bar" />
          </UFormGroup>

          <UButton label="Add" class="mt-4" type="submit" />
        </UForm>
      </div>
    </UModal>
  </div>

  <UTable v-if="data?.defaultLanguage" :rows="keys" :columns="columns">
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
  <div v-else>
    <UAlert
      icon="i-heroicons-information-circle"
      color="yellow"
      variant="solid"
      title="No default language found!"
      description="You need to set a default language in the '.meta.json' file to be able to manage keys."
    />
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch("/api/v1/keys");

const isOpen = ref(false);
const state = reactive({
  key: "",
});

const items = (row: any) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => console.log("Edit", row.id),
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
    },
  ],
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
    },
  ],
];

const columns: {
  key: string;
  label: string;
}[] = reactive([]);

const keys: {
  key: string;
}[] = reactive([]);

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
    if (
      a.key === data.value?.defaultLanguage &&
      b.key !== data.value?.defaultLanguage
    ) {
      return -1;
    }
    if (
      a.key !== data.value?.defaultLanguage &&
      b.key === data.value?.defaultLanguage
    ) {
      return 1;
    }
    return 0;
  });

  // set table columns
  columns.splice(0, columns.length); // Clear the array
  columns.push(
    {
      key: "key",
      label: "Key",
    },
    ...languageCols!,
    {
      key: "actions",
      label: "",
    }
  );

  // set languages columns values to indicate if the key is missing or not
  const setLanguageColumnValues = (key: string) => {
    // set all languages to have a be present as default
    const res = data.value?.languages.reduce(
      // @ts-ignore
      (acc, curr) => ((acc[curr] = "✅"), acc),
      {}
    );

    // set missing keys to have a warning icon
    data.value?.missingKeys.forEach((item) => {
      if (item.key === key) {
        // @ts-ignore
        res[item.language] = "❗️";
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

const onSubmit = async (event: any) => {
  console.log(event.data);
};
</script>
