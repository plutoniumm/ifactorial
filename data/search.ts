import { csvParse } from 'd3-dsv';
import afs from 'fs/promises';
import fs from 'fs';

if (fs.existsSync('static/search.csv')) {
  const base = "Skipping Indexing";
  console.log(`\x1b[34m[${base}]\x1b[0m`);
  process.exit(0);
};

interface Book {
  index: string;
  author: string;
  notes: string;
  isbn: string;
  name: string;
};

type Entry = [string, string, number, number];

const files = fs.readdirSync('data')
  .filter(file => file.endsWith('.csv'));

let search: Entry[] = [];
for (const file of files) {
  const content = fs.readFileSync(`data/${file}`, 'utf-8');
  const data: Book[] = csvParse(content) as Book[];

  const year = Number(file.replace('.csv', ''));
  data.forEach(book => search.push([
    `"${book.author.trim()}"`,
    `"${book.name.trim()}"`,
    Number(book.isbn),
    year
  ]));
};

const keys = search.map(e => e.join(',')).join('\n');
await afs.writeFile('static/search.csv', keys, 'utf-8');
console.log('Build complete.');