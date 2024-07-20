export default defineEventHandler(async (event) => {
  const { key } = await readBody(event);

  const config = useRuntimeConfig();

  const { locales } = getLocales();

  for (const loc of locales) {
    const fileContent = readFile(`${process.cwd()}/${config.localeDirPath}/${loc}.json`);
    addKeyToObject(fileContent, key, '');
    writeFile(`${process.cwd()}/${config.localeDirPath}/${loc}.json`, fileContent);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function addKeyToObject(obj: any, path: string, value: any): any {
    const keys = path.split('.');
    let current = obj;

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];

      if (i === keys.length - 1) {
        if (!(key in current)) {
          current[key] = value;
        }
      } else {
        if (!current[key] || typeof current[key] !== 'object') {
          current[key] = {};
        }
        current = current[key];
      }
    }

    return obj;
  }
});
