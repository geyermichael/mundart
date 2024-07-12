export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  const { hasMeta } = getLocales();

  if (hasMeta) {
    return readFile(`${process.cwd()}/${config.localeDirPath}/.meta.json`);
  } else {
    console.error('No meta file found');
  }
});
