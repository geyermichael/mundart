export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const key = getRouterParam(event, 'key') as string;

  const { locales } = getLocales();

  const messages = [];

  for (const loc of locales) {
    const fileContent = readFile(`${process.cwd()}/${config.localeDirPath}/${loc}.json`);
    messages.push({ locale: loc, message: getValueAtPath(fileContent, key) });
  }

  console.log();

  return {
    key,
    messages,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function getValueAtPath(obj: any, path: string): any {
    // Split the path by dots to get the individual keys
    const keys = path.split('.');

    // Reduce the keys to get the value at the specified path
    return keys.reduce((acc, key) => {
      if (acc && key in acc) {
        return acc[key];
      }
      return undefined;
    }, obj);
  }
});
