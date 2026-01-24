<script>
  import { transformerColorizedBrackets as brackets } from "@shikijs/colorized-brackets";
  import { addCopyButton as copy } from "shiki-transformer-copy-button";
  import { codeToHtml } from "shiki";

  import Tabs from "./tabs.svelte";
  import { onMount } from "svelte";
  import "./code.css";

  let tabs = [];

  async function C(code, lang) {
    code = code.trim();
    return await codeToHtml(code, {
      lang,
      theme: "catppuccin-latte",
      transformers: [copy({ toggle: 2000 }), brackets()],
    });
  }

  let _interface = "";
  onMount(async () => {
    _interface = await C(
      `interface Book {
  index: number;
  author: string;
  notes: string;
  isbn: number;
  name: string;
}`,
      "typescript",
    );

    tabs = [
      {
        // JSON, JS
        name: "JSON",
        html: await C(
          `const data = fetch('https://books.manav.ch/2024.json')
  .then(r => r.json())
  .then(d => console.log(d));`,
          "javascript",
        ),
      },
      {
        // CSV, Python
        name: "CSV",
        html: await C(
          `import pandas as pd

data = pandas.read_csv('https://books.manav.ch/2024.csv')
print(data)`,
          "python",
        ),
      },
      {
        // XML, Java
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
        // Plist, Swift
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
  });
</script>

<main class="p20">
  Even after Demerzel has achieved Galaxia at the end of time, I don't think I
  will be able to find out why I caved to those who asked for an API. Each page
  contains the keys:

  {@html _interface}

  <Tabs {tabs}></Tabs>
</main>

<style lang="scss">
  main {
    line-height: 1.5;
  }
</style>
