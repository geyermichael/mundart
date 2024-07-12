import fs from 'fs';

export function readFile(filePath: string) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading file:', error);
  }
}
