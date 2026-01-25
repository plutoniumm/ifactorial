import { csvParse } from "d3-dsv";
import fs from "fs/promises";
import path from "path";

type Size = "L" | "M" | "S";

async function ISBNs (dataDir: string): Promise<string[]> {
  const files = await fs.readdir(dataDir);
  const csvs = files.filter((f) => f.endsWith(".csv"));

  const promises = csvs.map(async (file) => {
    const content = await fs.readFile(path.join(dataDir, file), "utf-8");
    const parsed = csvParse(content);

    return parsed
      .map((row: any) => row.isbn)
      .filter((isbn: string) => isbn && isbn.length > 5);
  });

  let res: any = await Promise.all(promises);
  res = new Set(res.flat())
  return Array.from(res);
}

class Imager {
  oDir: string;
  concurrency: number;

  constructor(oDir = "static/images", concurrency = 12) {
    this.oDir = oDir;
    this.concurrency = concurrency;
  }

  public async run (isbns: string[]) {
    const existing = new Set(await fs.readdir(this.oDir));
    const queue = isbns.filter(isbn => !existing.has(`${isbn}.jpg`));

    console.log(`Total: ${isbns.length} | Existing: ${existing.size} | Queue: ${queue.length}`);

    if (queue.length) await this.Batch(queue);
  }

  async Batch (queue: string[]) {
    const active: Promise<void>[] = [];

    while (queue.length > 0 || active.length > 0) {
      while (queue.length > 0 && active.length < this.concurrency) {
        const isbn = queue.shift()!;
        const worker = this.download(isbn).finally(() => {
          active.splice(active.indexOf(worker), 1);
        });
        active.push(worker);
      }

      if (active.length > 0)
        await Promise.race(active);
    }
  }

  async download (isbn: string): Promise<void> {
    const sizes: Size[] = ["L", "M", "S"];
    for (const size of sizes) {
      const buffer = await fetch(`https://covers.openlibrary.org/b/isbn/${isbn}-${size}.jpg`)
        .then(r => r.arrayBuffer())

      await fs.writeFile(
        path.join(this.oDir, `${isbn}.jpg`),
        Buffer.from(buffer)
      );

      console.log(`[OK] ${isbn} @ ${size}`);
      return;
    }
  }
}

const isbns = await ISBNs("data");
await new Imager().run(isbns);