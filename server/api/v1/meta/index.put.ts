export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { currentMeta, locales } = await readBody(event);

  if (Object.keys(currentMeta).includes('generateBy')) {
    handleFoundLocalesAndMetaLanguageMismatch();
  } else {
    const languageFileName = currentMeta.country_code
      ? `${currentMeta.language_code}-${currentMeta.country_code}`
      : currentMeta.language_code;

    writeFile(`${process.cwd()}/${config.localeDirPath}/.meta.json`, {
      generateBy: 'mundart',
      generateAt: new Date().toISOString(),
      foundLocales: locales,
      languages: {
        ...currentMeta.languages,
        [languageFileName]: {
          name: currentMeta.name,
          language_code: currentMeta.language_code,
          country_code: currentMeta.country_code,
          default: currentMeta.default,
        },
      },
    });
  }

  return setResponseStatus(event, 200);

  /**
   *
   * @name handleFoundLocalesAndMetaLanguageMismatch
   * @description used to handle missing locales and languages in .meta.json file if manual changes are made to the locales folder
   * @example locale file was deleted, added or .meta.json file was updated manually
   */
  function handleFoundLocalesAndMetaLanguageMismatch() {
    /**
     * handle missing locale files
     */
    const missingLocaleFiles = Object.keys(currentMeta.languages).filter(
      (loc: any) => !currentMeta.foundLocales.includes(loc)
    );

    for (const loc of missingLocaleFiles) {
      if (currentMeta.languages[loc]) delete currentMeta.languages[loc];
    }

    /**
     * handle missing languages in .meta.json file
     */
    const missingLanguageMeta = locales.filter((loc: any) => !Object.keys(currentMeta.languages).includes(loc));

    for (const lang of missingLanguageMeta) {
      currentMeta.languages[lang] = {
        name: '',
        language_code: lang.split('-')[0],
        country_code: lang.split('-')[1] || '',
        default: false,
      };
    }

    writeFile(`${process.cwd()}/${config.localeDirPath}/.meta.json`, {
      generateBy: 'mundart',
      generateAt: new Date().toISOString(),
      foundLocales: locales,
      languages: currentMeta.languages,
    });
  }
});
