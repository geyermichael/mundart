import { readdirSync } from 'fs';

export function getLocales() {
  const config = useRuntimeConfig();

  let files: string[] = [];
  files = readdirSync(`${process.cwd()}/${config.localeDirPath}`);

  // check if .meta.json file exists
  const metaFile = files.find((file) => file === '.meta.json');

  // remove file extension .json and skip ".meta.json" file or any other file starting with "."
  const usedLocales = files.map((file) => {
    return file.split('.')[0];
  });

  // get default locale
  const { languages } = readFile(`${process.cwd()}/${config.localeDirPath}/.meta.json`);
  const defaultLocale = Object.keys(languages).find((key) => languages[key].default);

  // remove empty array elements
  return {
    hasMeta: metaFile !== undefined,
    locales: usedLocales.filter((locale) => locale !== ''), // remove empty array elements
    defaultLocale: defaultLocale ?? undefined,
  };
}
