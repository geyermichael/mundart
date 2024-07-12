import fs from 'fs';

export function writeFile(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing file:', error);
    return false;
  }
}
