<template>
  <div>
    <div class="flex mb-4">
      <div class="text-xl">Messages</div>
    </div>
    <div class="flex flex-col grid grid-cols-10 gap-8">
      <div class="col-span-3">
        <div class="px-3 border-r">
          <UInput v-model="q" placeholder="Search for keys..." />
        </div>
        <UTable :rows="filteredRows" :columns="[{ key: 'key', label: '' }]"
          class="border-r max-h-[80vh] overflow-hidden overflow-y-scroll">
          <template #key-data="{ row }">
            <div class="flex items-center">
              <span class="text-sm hover:cursor-pointer" @click="showContent(row.key)">
                {{ row.key }}
              </span>
            </div>
          </template>
        </UTable>
      </div>
      <div class="col-span-6">
        <div>
          {{ choosenKey }}
        </div>
        <div>
          <UContainer v-for="message in messages" :key="message" class="py-4">
            <UForm :state="message">
              <div class="flex justify-between items-end mb-2">
                <div>
                  {{ message.message ? message.locale : message.locale + '❗️' }}
                </div>

                <UButton disabled label="Save" type="submit" />
              </div>

              <UFormGroup>
                <UTextarea v-model="message.message" placeholder="missing message" />
              </UFormGroup>
            </UForm>
          </UContainer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/v1/keys');

const choosenKey = ref('');

// create an array of objects using data.keys. Objects should look like { key: arrayElement }
const rows = computed(() => {
  const keys = data.value?.keys;
  if (!keys) return [];
  return keys.map((key) => ({ key }));
});

const q = ref('');

const filteredRows = computed(() => {
  if (!q.value) {
    return rows.value;
  }

  return rows.value.filter((key) => {
    return Object.values(key).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase());
    });
  });
});

const messages = ref<{ locale: string; message: string }[]>();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showContent = async (key: any) => {
  console.log(key);
  choosenKey.value = key;

  const response = await $fetch(`/api/v1/messages/${key}`);
  messages.value = response.messages;
};
</script>
