import fs from 'fs';
import { name, version, description, author, license, repository, keywords } from '../package.json';

export default function createPackageInformation() {
  generatePackageJson();
  addReadme();
  addLicense();
}

function generatePackageJson() {
  const packageJson = {
    name,
    version,
    description,
    main: 'server/index.mjs',
    keywords,
    author,
    repository,
    license,
  };

  fs.writeFileSync(`${process.cwd()}/dist/package.json`, JSON.stringify(packageJson, null, 2));

  console.log('Generated package.json');
}

function addLicense() {
  const licenseText = fs.readFileSync(`${process.cwd()}/LICENSE`, 'utf-8');

  fs.writeFileSync(`${process.cwd()}/dist/LICENSE`, licenseText);

  console.log('Added LICENSE');
}

function addReadme() {
  const readmeText = fs.readFileSync(`${process.cwd()}/README.md`, 'utf-8');

  fs.writeFileSync(`${process.cwd()}/dist/README.md`, readmeText);

  console.log('Added README.md');
}
