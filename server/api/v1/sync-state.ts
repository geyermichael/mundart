export default defineEventHandler(async (event) => {
  const { hasMeta, locales } = getLocales();

  if (!hasMeta) {
    createMetaFile(locales);
  } else {
    const currentMeta = await $fetch('/api/v1/meta', {
      method: 'GET',
    });

    updateMetaFile(currentMeta, locales);
  }

  setResponseStatus(event, 200);
});

async function createMetaFile(locales: any) {
  await $fetch('/api/v1/meta', {
    method: 'POST',
    body: { locales },
  });
}

async function updateMetaFile(currentMeta: any, locales: any) {
  await $fetch('/api/v1/meta', {
    method: 'PUT',
    body: { currentMeta, locales },
  });
}
