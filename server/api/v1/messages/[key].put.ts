export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const key = getRouterParam(event, 'key') as string;
  const body = await readBody(event);

  const { locale, message } = body;

  const fileContent = readFile(`${process.cwd()}/${config.localeDirPath}/${locale}.json`);

  setValueAtPath(fileContent, key, message);

  const success = writeFile(`${process.cwd()}/${config.localeDirPath}/${locale}.json`, fileContent);

  if (success) {
    setResponseStatus(event, 200);
    return { success };
  } else {
    setResponseStatus(event, 500);
    return { success: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function setValueAtPath(obj: any, path: string, value: any): void {
    const keys = path.split('.');
    const lastKey = keys.pop();

    if (!lastKey) {
      throw new Error('Invalid path');
    }

    const target = keys.reduce((acc, key) => {
      if (!(key in acc)) {
        acc[key] = {};
      }
      return acc[key];
    }, obj);

    target[lastKey] = value;
  }
});
