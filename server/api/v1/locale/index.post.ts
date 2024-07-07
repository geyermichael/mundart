import { writeFile } from "../../../utils/write-file";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);

  const fileName = body.country_code
    ? `${body.language_code}-${body.country_code}.json`
    : `${body.language_code}.json`;

  writeFile(`${process.cwd()}/${config.localeDirPath}/${fileName}`, {});
  await $fetch("/api/v1/meta", {
    method: "PUT",
    body: JSON.stringify(body),
  });

  return setResponseStatus(event, 201);
});
