export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { locales } = await readBody(event);

  writeFile(
    `${process.cwd()}/${config.localeDirPath}/.meta.json`,
    JSON.stringify({
      generateBy: 'mundart',
      generateAt: new Date().toISOString(),
      foundLocales: locales,
      languages: createMetaData(locales),
    })
  );

  return setResponseStatus(event, 201);
});

function createMetaData(locales: string[]) {
  const languages: { [key: string]: any } = {};

  const hasCountryCode = locales.some((loc) => loc.split('-').length > 1);

  for (const loc of locales) {
    languages[loc] = {
      name: '',
      language_code: loc.split('-')[0],
      country_code: hasCountryCode ? loc.split('-')[1] : '',
      default: false,
    };
  }

  return languages;
}
