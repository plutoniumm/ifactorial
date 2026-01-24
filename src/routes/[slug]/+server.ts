import type { RequestHandler } from './$types';
import { json } from '@sveltejs/kit';

interface Book {
  index: string;
  author: string;
  notes: string;
  isbn: string;
  name: string;
}

function toCSV (data: Book[]) {
  const header = Object.keys(data[0]).join(',') + '\n';
  const rows = data.map(book => Object.values(book).join(',')).join('\n');

  return header + rows;
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

function isAPI (file: string) {
  let is = false;
  let type = file.split('.').pop();

  if (
    file.endsWith('.json')
    || file.endsWith('.xml')
    || file.endsWith('.csv')
    || file.endsWith('.plist')
  )
    is = true;

  return [is, type];
};

const csv = { headers: { 'Content-Type': 'text/csv' } };
const xml = { headers: { 'Content-Type': 'application/xml' } };

export const GET: RequestHandler = async ({ params, url }) => {
  let file = params.slug;
  const [is, type] = isAPI(file);

  if (is) {
    console.log('API request for type:', type);
    file = file.replace(`.${type}`, '');
  }

  let books = await import(`../../../data/${file}.csv`);
  books = books.default;
  for (let i = 0; i < books.length; i++) {
    books[i].index = Number(i);
    books[i].isbn = Number(books[i].isbn);
  }
  let data = books as Book[];

  if (url.pathname.endsWith('.json')) {
    return json(data);
  } else if (url.pathname.endsWith('.xml')) {
    return new Response(toXML(data), xml);
  } else if (url.pathname.endsWith('.csv')) {
    return new Response(toCSV(data), csv);
  } else if (url.pathname.endsWith('.plist')) {
    return new Response(toPlist(data), xml);
  }

  return new Response('Not found', { status: 404 });
};
