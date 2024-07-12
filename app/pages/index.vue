<template>
  <div>
    <div class="flex justify-center mb-4">
      <div class="text-xl">Languages</div>
      <UButton label="Add new" class="ml-auto" @click="isOpen = true" />

      <UModal v-model="isOpen">
        <div class="p-4">
          <UForm :state="state" class="space-y-4" @submit="onSubmit">
            <UFormGroup class="py-2" label="Name">
              <UInput v-model="state.name" placeholder="Germany" />
            </UFormGroup>
            <UFormGroup class="py-2" label="Country Code">
              <UInput v-model="state.country_code" placeholder="DE" />
            </UFormGroup>
            <UFormGroup class="py-2" label="Language Code">
              <UInput v-model="state.language_code" placeholder="de" required />
            </UFormGroup>
            <UFormGroup label="Default">
              <UCheckbox v-model="state.default" :disabled="hasAlredyDefaultLocale" />
            </UFormGroup>

            <UButton label="Add" class="mt-4" type="submit" />
          </UForm>
        </div>
      </UModal>
    </div>

    <UTable :rows="languages" :columns="columns">
      <template #empty-state>
        <div class="flex flex-col items-center justify-center py-6 gap-3">
          <span class="italic text-sm">No one here!</span>
          <UButton label="Add people" />
        </div>
      </template>

      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton color="gray" variant="ghost" icon="i-heroicons-ellipsis-horizontal-20-solid" />
        </UDropdown>
      </template>
    </UTable>
  </div>
</template>

<script setup lang="ts">
const { data, refresh } = await useFetch("/api/v1/meta");
const toast = useToast();

const isOpen = ref(false);
const hasAlredyDefaultLocale = ref(false);

const columns = [
  {
    key: "country_code",
    label: "Country code",
  },
  {
    key: "language_code",
    label: "Language code",
  },
  {
    key: "name",
    label: "Name",
  },
  {
    key: "default",
    label: "Default",
  },
  {
    key: "actions",
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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

const languages: {
  country_code: string;
  language_code: string;
  name: string;
  default: "Yes" | "";
}[] = reactive([]);

watchEffect(() => {
  languages.splice(0, languages.length); // Clear the array
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Object.values(data.value.languages).forEach((lang: any) => {
    languages.push({
      country_code: lang.country_code ?? "-",
      language_code: lang.language_code,
      name: lang.name ?? "-",
      default: lang.default ? "Yes" : "",
    });

    if (lang.default) {
      hasAlredyDefaultLocale.value = true;
    }
  });
});

const state = reactive({
  name: "",
  country_code: "",
  language_code: "",
  default: false,
});

const onSubmit = async () => {
  await $fetch("/api/v1/locale", {
    method: "POST",
    body: JSON.stringify(state),
  });

  isOpen.value = false;
  toast.add({ title: "Language added!" });
  await refresh();
};
</script>
