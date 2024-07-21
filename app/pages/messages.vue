<template>
  <div>
    <div class="flex mb-4">
      <div class="text-xl">Messages</div>
    </div>
    <div
      v-if="data?.defaultLocale"
      class="flex flex-col grid grid-cols-12"
    >
      <div class="col-span-4">
        <div class="px-3 divide-y divide-gray-200 h-[3rem] border-r">
          <UInput
            v-model="q"
            placeholder="Search for keys..."
          />
        </div>
        <UTable
          :rows="filteredRows"
          :columns="[{ key: 'key', label: '' }]"
          class="border-r max-h-[80vh] overflow-hidden overflow-y-scroll"
          :ui="{ thead: 'hidden' }"
        >
          <template #key-data="{ row }">
            <div
              class="flex items-center hover:cursor-pointer hover:font-bold"
              :class="choosenKey === row.key ? 'font-bold' : ''"
              @click="showContent(row.key)"
            >
              <span class="text-sm">
                {{ row.key }}
              </span>
            </div>
          </template>
        </UTable>
      </div>
      <div
        v-if="choosenKey"
        class="col-span-8 max-h-[80vh] overflow-hidden overflow-y-scroll"
      >
        <div class="font-bold sticky top-0 bg-white z-10 h-[3.05rem] pl-6 pt-1 border-b border-gray-200">
          {{ choosenKey }}
        </div>
        <div>
          <UContainer
            v-for="message in messages"
            :key="message"
            class="py-4"
          >
            <UForm
              :state="message"
              @submit="onSubmit"
            >
              <div class="flex justify-between items-end mb-2">
                <div>
                  {{ message.message ? message.locale : message.locale + '❗️' }}
                </div>

                <UButton
                  label="Save"
                  type="submit"
                  variant="ghost"
                  :disabled="message.message === message.currentMessage"
                  :class="message.message === message.currentMessage ? 'text-gray-400' : 'text-primary'"
                />
              </div>

              <UFormGroup>
                <UTextarea
                  v-model="message.message"
                  placeholder="missing message"
                />
              </UFormGroup>
            </UForm>
          </UContainer>
        </div>
      </div>
    </div>
    <div v-else>
      <NoDefaulLocale />
    </div>
  </div>
</template>

<script setup lang="ts">
const { data, refresh } = await useFetch('/api/v1/keys');

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

const messages = ref();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showContent = async (key: any) => {
  choosenKey.value = key;

  const response = await $fetch(`/api/v1/messages/${key}`);
  messages.value = response.messages;

  const helper = [];

  for (const message of messages.value) {
    helper.push({
      locale: message.locale,
      message: message.message,
      currentMessage: message.message,
    });
  }

  messages.value = helper;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = async (event: any) => {
  const response = await $fetch(`/api/v1/messages/${choosenKey.value}`, {
    method: 'PUT',
    body: JSON.stringify({
      locale: event.data.locale,
      message: event.data.message.trim(),
    }),
  });

  if (response.success) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages.value.find((message: any) => message.locale === event.data.locale).currentMessage = event.data.message;
  }
};
</script>
