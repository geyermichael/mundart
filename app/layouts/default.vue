<template>
  <div class="bg-white">
    <header class="bg-primary">
      <nav
        class="mx-auto flex max-w-7xl py-6 px-8 items-center justify-between"
        aria-label="Global"
      >
        <div class="flex lg:flex-1">
          <NuxtLink href="/"> i18n Editor </NuxtLink>
        </div>

        <div class="flex gap-x-12">
          <NuxtLink to="/">Languages</NuxtLink>
          <NuxtLink to="/keys">Keys</NuxtLink>
        </div>
      </nav>
    </header>

    <main class="mx-auto max-w-7xl py-6 px-8">
      <slot />
    </main>

    <footer></footer>
  </div>
</template>
