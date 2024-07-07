<script setup lang="ts">
console.log('Hello from playground')
</script>

<template>
  <div>
    <h1>{{ $t('hello') }}</h1>
    <form>
      <label for="locale-select">{{ $t('language') }}: </label>
      <select id="locale-select" v-model="$i18n.locale">
        <option value="en">en</option>
        <option value="fr">de</option>
      </select>
    </form>
  </div>
</template>


