export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  const jsonObject = new Set();

  const { locales, defaultLocale } = getLocales();

  for (const loc of locales) {
    const fileContent = readFile(`${process.cwd()}/${config.localeDirPath}/${loc}.json`);
    jsonObject.add({ locale: loc, messages: fileContent });
  }

  const data = Array.from(jsonObject) as {
    locale: string;
    messages: any;
  }[];

  const languages = data.map((m) => m.locale);

  const messages = data.find((m) => m.locale === defaultLocale)?.messages;

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

  const keysWithProgress = [];

  for (const key of keys) {
    const progress = await getProgressOfTranslation(key);
    keysWithProgress.push({
      key,
      progress,
    });
  }

  return { languages, keys, defaultLocale, missingKeys, keysWithProgress };
});

function getObjectKeys(obj: Record<string, any>, prefix: string = ''): string[] {
  let result: string[] = [];

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result = result.concat(getObjectKeys(obj[key], newKey));
      } else {
        result.push(newKey);
      }
    }
  }

  return result;
}

function hasNestedKey(obj: Record<string, any>, keyPath: string): boolean {
  const keys = keyPath.split('.');

  let current: any = obj;
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return false;
    }
  }

  return true;
}

async function getProgressOfTranslation(key: string) {
  if (!key) return;

  const response = await $fetch(`/api/v1/messages/${key}`);

  const alreadyTranslated = response.messages.filter((m: any) => m.message).length;
  const totalMessages = response.messages.length;
  const progress = (alreadyTranslated / totalMessages) * 100;

  if (isNaN(progress)) {
    return 0;
  } else {
    return progress.toFixed(0);
  }
}
