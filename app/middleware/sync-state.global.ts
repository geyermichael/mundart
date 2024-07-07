export default defineNuxtRouteMiddleware(async () => {
  await $fetch("/api/v1/sync-state", {
    method: "GET",
  });
});
