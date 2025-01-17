import csv, requests, sys, os, glob

def olid_to_isbn(olid):
    url = f"https://openlibrary.org/api/books?bibkeys=OLID:{olid}&format=json&jscmd=data"
    try:
        r = requests.get(url, timeout=10).json()
        book = r.get(f"OLID:{olid}", {})
        ids = book.get("identifiers", {})
        isbns = ids.get("isbn_13") or ids.get("isbn_10")
        return isbns[0] if isbns else None
    except Exception:
        return None

def process_csv(infile):
    with open(infile, newline="") as f:
        reader = csv.DictReader(f)
        if "isbn" in reader.fieldnames:
            print(f"Skipping {infile} (already has isbn column)")
            return
        outfile = "O" + os.path.basename(infile)
        with open(outfile, "w", newline="") as out:
            writer = csv.DictWriter(out, fieldnames=reader.fieldnames + ["isbn"])
            writer.writeheader()
            for row in reader:
                # Fallback: if no ISBN found, store work URL using OLID
                olid = row.get("OLID", "").strip()
                isbn = olid_to_isbn(olid)
                row["isbn"] = isbn if isbn else (f"https://openlibrary.org/works/{olid}" if olid else None)
                writer.writerow(row)
        print(f"Processed {infile} → {outfile}")

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_csv(sys.argv[1])
    else:
        for path in glob.glob("*.csv"):
            out = "O" + os.path.basename(path)
            if not os.path.exists(out):
                process_csv(path)
