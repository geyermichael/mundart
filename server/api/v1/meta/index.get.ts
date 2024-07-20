export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  return readFile(`${process.cwd()}/${config.localeDirPath}/.meta.json`);
});
