<template>
  <v-app>
    <v-app-bar>
      <v-toolbar>
        <template #prepend>
          <div class="d-flex align-center gap-2">
            <v-btn
              flat
              to="/"
            >
              Languages
            </v-btn>
            <v-btn
              flat
              to="/keys"
            >
              Keys
            </v-btn>
            <v-btn
              flat
              to="/translations"
            >
              Translations
            </v-btn>
          </div>
        </template>
      </v-toolbar>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <slot />
      </v-container>
    </v-main>

    <!-- <header class="bg-primary">
      <nav class="mx-auto flex max-w-7xl py-6 px-8 items-center justify-between">
        <NuxtLink href="/"></NuxtLink>

        <div class="flex gap-x-12">
          <NuxtLink to="/">Languages</NuxtLink>
          <NuxtLink to="/keys">Keys</NuxtLink>
          <NuxtLink to="/messages">Messages</NuxtLink>
        </div>
      </nav>
    </header> -->

    <!-- <VMain class="mx-auto max-w-7xl py-6 px-8">
      <slot />
    </VMain>

    <footer /> -->
  </v-app>
</template>
