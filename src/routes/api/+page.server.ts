import { transformerColorizedBrackets as brackets } from "@shikijs/colorized-brackets";
import { addCopyButton as copy } from "shiki-transformer-copy-button";
import { codeToHtml } from "shiki";

async function C (code: string, lang: string) {
  code = code.trim();
  return await codeToHtml(code, {
    lang,
    theme: "catppuccin-latte",
    transformers: [copy({ toggle: 2000 }), brackets()],
  });
}

export const load = async () => {
  const _interface = await C(
    `interface Book {
  index: number;
  author: string;
  notes: string;
  isbn: number;
  name: string;
}`,
    "typescript",
  );

  const tabs = [
    {
      name: "JSON",
      html: await C(
        `const data = fetch('https://books.manav.ch/2024.json')
  .then(r => r.json())
  .then(d => console.log(d));`,
        "javascript",
      ),
    },
    {
      name: "CSV",
      html: await C(
        `import pandas as pd

data = pandas.read_csv('https://books.manav.ch/2024.csv')
print(data)`,
        "python",
      ),
    },
    {
      name: "XML",
      html: await C(
        `DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
DocumentBuilder builder = factory.newDocumentBuilder();
Document doc = builder.parse(new URL("https://books.manav.ch/2024.xml").openStream());

NodeList books = doc.getElementsByTagName("book");
for (int i = 0; i < books.getLength(); i++) {
    Element book = (Element) books.item(i);
    String title = book.getElementsByTagName("name").item(0).getTextContent;
    System.out.println("Name: " + title);
}`,
        "java",
      ),
    },
    {
      name: "RSS",
      html: await C(
        `package main

import (
	"fmt"
	"github.com/mmcdole/gofeed"
)

func main() {
	fp := gofeed.NewParser()
	feed, _ := fp.ParseURL("https://books.manav.ch/2024.rss")
	for _, item := range feed.Items {
		fmt.Println(item.Title)
	}
}`,
        "go",
      ),
    },
    {
      name: "PList",
      html: await C(
        `if let url = URL(string: "https://books.manav.ch/2024.plist"),
   let data = try? Data(contentsOf: url) {
    let decoder = PropertyListDecoder()
    do {
        let books = try decoder.decode([Book].self, from: data)
        for book in books {
            print("Name: \\(book.name)")
        }
    } catch {
        print("Error decoding plist: \\(error)")
    }
}`,
        "swift",
      ),
    },
  ];

  return { _interface, tabs };
};
