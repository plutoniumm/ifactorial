import { csvParse } from 'd3-dsv';
import afs from 'fs/promises';
import fs from 'fs';

interface Book {
  index: string;
  author: string;
  notes: string;
  isbn: string;
  name: string;
};

function toXML (data: Book[]) {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
  <books>`.trim();

  data.forEach(book => {
    xml += '<book>';
    for (const [key, value] of Object.entries(book)) {
      xml += `<${key}>${value}</${key}>\n`;
    }
    xml += '</book>\n';
  });

  xml += '</books>';
  return xml;
};

function toPlist (data: Book[]) {
  let plist = `
  <?xml version="1.0" encoding="UTF-8"?>
  <!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
  <plist version="1.0">
  <array>`.trim();

  data.forEach(book => {
    plist += '<dict>\n';
    for (const [key, value] of Object.entries(book)) {
      plist += `
      <key>${key}</key>
      <string>${value}</string>
      `;
    }
    plist += '</dict>';
  });
  plist += '</array>\n</plist>';

  return plist;
};

const files = fs.readdirSync('data')
  .filter(file => file.endsWith('.csv'));

for (const file of files) {
  const content = fs.readFileSync(`data/${file}`, 'utf-8');
  const data: Book[] = csvParse(content) as unknown as Book[];

  const base = file.replace('.csv', '');

  await Promise.all([
    afs.writeFile(`build/${base}.csv`, content, 'utf-8'),
    afs.writeFile(`build/${base}.json`, JSON.stringify(data), 'utf-8'),
    afs.writeFile(`build/${base}.xml`, toXML(data), 'utf-8'),
    afs.writeFile(`build/${base}.plist`, toPlist(data), 'utf-8')
  ]);

  console.log(`\x1b[34m[${base} done]\x1b[0m`);
}

console.log('Build complete.');