interface Meta {
  languages: Locale[];
  generateBy: string;
  generateAt: string;
  foundLocales: string[];
}
export default defineEventHandler(async (): Promise<Meta> => {
  const config = useRuntimeConfig();
  return readFile(`${process.cwd()}/${config.localeDirPath}/.meta.json`);
});
