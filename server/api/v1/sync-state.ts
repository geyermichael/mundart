export default defineEventHandler(async (event) => {
  const { hasMeta } = getLocales();

  if (!hasMeta) {
    await $fetch('/api/v1/meta', {
      method: 'POST',
    });
  } else {
    const currentMeta = await $fetch('/api/v1/meta', {
      method: 'GET',
    });
    await $fetch('/api/v1/meta', {
      method: 'PUT',
      body: JSON.stringify(currentMeta),
    });
  }

  setResponseStatus(event, 200);

  return { success: true, message: 'Init state completed' };
});
