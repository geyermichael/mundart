<template>
  <v-row no-gutters>
    <v-col cols="6">
      <v-data-table
        :items="keys"
        :search="search"
        :items-per-page="-1"
        hide-default-footer
        hide-default-header
        style="height: 80dvh"
        class="overflow-y-auto pb-24 mb-24"
      >
        <template #top>
          <v-toolbar flat>
            <v-toolbar-title>
              <v-icon
                color="medium-emphasis"
                icon="mdi-translate"
                size="x-small"
              />

              Translations
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
                class="w-50 mx-5"
              />
            </div>
          </v-toolbar>
        </template>

        <template #[`item.key`]="{ item }">
          <span
            style="cursor: pointer"
            :class="selectedKey === item.key ? 'font-weight-bold text-primary' : ''"
            @click="showContent(item.key)"
          >
            {{ item.key }}
          </span>
        </template>
      </v-data-table>
    </v-col>
    <v-col
      v-if="selectedKey"
      cols="6"
    >
      <v-toolbar>
        <v-toolbar-title>
          <v-icon
            color="medium-emphasis"
            icon="mdi-key"
            size="x-small"
          />

          {{ selectedKey }}
        </v-toolbar-title>
      </v-toolbar>

      <v-container
        style="height: 80dvh"
        class="overflow-y-auto pb-24 mb-24"
      >
        <v-card
          v-for="message in messages"
          :key="message.locale"
        >
          <v-form @submit.prevent="onSubmit(message)">
            <v-card-title class="d-flex align-center justify-space-between">
              <div>
                <v-icon
                  color="medium-emphasis"
                  icon="mdi-web"
                  size="x-small"
                />
                {{ message.locale }}
              </div>

              <v-btn
                type="submit"
                color="primary"
                :disabled="message.message === message.currentMessage"
              >
                Save
              </v-btn>
            </v-card-title>

            <v-card-text>
              <v-textarea
                v-model="message.message"
                placeholder="missing message"
                variant="outlined"
              />
            </v-card-text>
          </v-form>
        </v-card>
      </v-container>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/v1/keys');

// create an array of objects using data.keys. Objects should look like { key: arrayElement }
const keys = computed(() => {
  const keys = data.value?.keys;
  if (!keys) return [];
  return keys.map((key) => ({ key }));
});

const selectedKey = ref('');

const search = ref('');

const messages = ref();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const showContent = async (key: any) => {
  selectedKey.value = key;

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
  console.log('onSubmit', event);

  const response = await $fetch(`/api/v1/messages/${selectedKey.value}`, {
    method: 'PUT',
    body: {
      locale: event.locale,
      message: event.message.trim(),
    },
  });

  if (response.success) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages.value.find((message: any) => message.locale === event.locale).currentMessage = event.message;
  }
};

onMounted(() => {
  if (data.value?.keys) {
    selectedKey.value = data.value.keys[0] || '';
    showContent(selectedKey.value);
  }
});
</script>
