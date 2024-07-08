export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const { locales } = getLocales();

  let currentMeta = await $fetch("/api/v1/meta", {
    method: "GET",
  });

  if (process.env.NODE_ENV === "development") {
    // check if request coming from "init-state" event, body should have "generateBy" key as it the current meta data
    if (Object.keys(body).includes("generateBy")) {
      handleFoundLocalesAndMetaLanguageMismatch();
    } else {
      // if (JSON.stringify(body.foundLocales) === JSON.stringify(locales)) {
      //   return setResponseStatus(event, 304);
      // } else {
      const languageFileName = body.country_code
        ? `${body.language_code}-${body.country_code}`
        : body.language_code;

      writeFile(`${process.cwd()}/${config.localeDirPath}/.meta.json`, {
        generateBy: "mundart",
        generateAt: new Date().toISOString(),
        foundLocales: locales,
        languages: {
          ...currentMeta.languages,
          [languageFileName]: {
            name: body.name,
            language_code: body.language_code,
            country_code: body.country_code,
            default: body.default,
          },
        },
      });
    }
  }
  // }

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
    const missingLanguageMeta = locales.filter(
      (loc: any) => !Object.keys(currentMeta.languages).includes(loc)
    );

    for (const lang of missingLanguageMeta) {
      currentMeta.languages[lang] = {
        name: "",
        language_code: lang.split("-")[0],
        country_code: lang.split("-")[1] || "",
        default: false,
      };
    }

    writeFile(`${process.cwd()}/${config.localeDirPath}/.meta.json`, {
      generateBy: "mundart",
      generateAt: new Date().toISOString(),
      foundLocales: locales,
      languages: currentMeta.languages,
    });
  }
});
