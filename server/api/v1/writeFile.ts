import fs from "fs";
import { getLocales } from "../../utils/get-locales";

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const { hasMeta, locales } = getLocales();

  if (!hasMeta) {
    console.error("No meta file found");
    fs.writeFileSync(
      `${process.cwd()}/${config.localeDirPath}/.meta.json`,
      JSON.stringify({
        generateBy: "i18n-editor",
        generateAt: new Date().toISOString(),
        foundLocales: locales,
        meta: createMetaData(locales),
      })
    );
  }
});

function createMetaData(locales: string[]) {
  const meta: { [key: string]: any } = {};

  for (const loc of locales) {
    meta[loc] = {
      name: undefined,
      language_code: loc,
      country_code: undefined,
      default: undefined,
    };
  }

  return meta;
}
