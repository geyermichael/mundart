import { existsSync } from 'fs';

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig();

  // Check if locales directory exists
  if (!existsSync(`${process.cwd()}/${config.localeDirPath}`)) {
    console.warn('Locales directory not found using path:', `${process.cwd()}/${config.localeDirPath}`);
    console.log('Please provide the path to your locales directory.');

    // graceful shutdown of the application
    process.exit(0);
  } else {
    console.log('✅ Using mundart 👍');
  }
});
