export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  let jsonObject = new Set();

  const { locales } = getLocales();

  const meta = (await $fetch("/api/v1/meta", {
    method: "GET",
  })) as any;

  for (const loc of locales) {
    const fileContent = readFile(
      `${process.cwd()}/${config.localeDirPath}/${loc}.json`
    );
    jsonObject.add({ locale: loc, messages: fileContent });
  }

  const data = Array.from(jsonObject) as {
    locale: string;
    messages: any;
  }[];

  const languages = data.map((m) => m.locale);

  // find default language in meta.languages
  const usedLanguages = Object.keys(meta.languages).map((key) => [
    key,
    meta.languages[key],
  ]);
  // @ts-ignore
  const defaultLanguage = usedLanguages.find(
    (lang) => lang[1].default
  )[0] as string;

  const messages = data.find((m) => m.locale === defaultLanguage)?.messages;

  const keys = getObjectKeys(messages);

  // iterate over all messages and check if all keys are present
  const missingKeys = [];
  for (const { locale, messages } of data) {
    for (const key of keys) {
      if (!hasNestedKey(messages, key)) {
        missingKeys.push({ key, language: locale });
      }
    }
  }

  return { languages, keys, defaultLanguage, missingKeys };
});

function getObjectKeys(
  obj: Record<string, any>,
  prefix: string = ""
): string[] {
  let result: string[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === "object" && obj[key] !== null) {
        result = result.concat(getObjectKeys(obj[key], newKey));
      } else {
        result.push(newKey);
      }
    }
  }

  return result;
}

function hasNestedKey(obj: Record<string, any>, keyPath: string): boolean {
  const keys = keyPath.split(".");

  let current: any = obj;
  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key];
    } else {
      return false;
    }
  }

  return true;
}
