import os
import re
import json

ALIMENTOS_DRAFTS = "/Volumes/M2 Externo/Code/Alimentos/drafts"
OUTPUT_DIR = "src/data"

def parse_markdown_file(filepath):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    frontmatter = {}
    body = content

    fm_match = re.match(r"^---\n(.*?)\n---\n(.*)$", content, re.DOTALL)
    if fm_match:
        fm_text = fm_match.group(1)
        body = fm_match.group(2).strip()
        for line in fm_text.split("\n"):
            line = line.strip()
            if ":" in line:
                k, v = line.split(":", 1)
                k = k.strip()
                v = v.strip().strip('"').strip("'")
                if k == "tags":
                    frontmatter[k] = [t.strip() for t in v.split(",") if t.strip()]
                else:
                    frontmatter[k] = v

    path = frontmatter.get("path", "")
    if not path:
        rel = os.path.relpath(filepath, ALIMENTOS_DRAFTS)
        path = rel.replace(".md", "")

    title = frontmatter.get("title", "")
    if not title:
        h1 = re.search(r"^#\s+(.+)$", body, re.MULTILINE)
        title = h1.group(1).strip() if h1 else os.path.basename(filepath).replace(".md", "").replace("-", " ").title()

    description = frontmatter.get("description", "")
    tags = frontmatter.get("tags", [])

    return {
        "path": path,
        "title": title,
        "description": description,
        "tags": tags,
        "body": body
    }

all_pages = []
for root, _, files in os.walk(ALIMENTOS_DRAFTS):
    for f in sorted(files):
        if f.endswith(".md"):
            fp = os.path.join(root, f)
            try:
                page = parse_markdown_file(fp)
                all_pages.append(page)
            except Exception as e:
                print(f"Error parsing {fp}: {e}")

print(f"Total compiled pages: {len(all_pages)}")

# Categorize into subsets
modules = [p for p in all_pages if p["path"].startswith("programa/modulos/")]
concepts = [p for p in all_pages if p["path"].startswith("conceptos/")]
ingredients = [p for p in all_pages if p["path"].startswith("ingredientes/") and not p["path"].startswith("ingredientes/categorias/")]
categories = [p for p in all_pages if p["path"].startswith("ingredientes/categorias/")]
myths = [p for p in all_pages if p["path"].startswith("afirmaciones/")]
regulations = [p for p in all_pages if p["path"].startswith("regulacion/")]
lab = [p for p in all_pages if p["path"].startswith("laboratorio/")]

print(f"Modules: {len(modules)}")
print(f"Concepts: {len(concepts)}")
print(f"Ingredients: {len(ingredients)}")
print(f"Categories: {len(categories)}")
print(f"Myths & Claims: {len(myths)}")
print(f"Regulations: {len(regulations)}")
print(f"Lab & Forensics: {len(lab)}")

with open(os.path.join(OUTPUT_DIR, "all_pages.json"), "w", encoding="utf-8") as f:
    json.dump(all_pages, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "modules.json"), "w", encoding="utf-8") as f:
    json.dump(modules, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "concepts.json"), "w", encoding="utf-8") as f:
    json.dump(concepts, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "ingredients.json"), "w", encoding="utf-8") as f:
    json.dump(ingredients, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "categories.json"), "w", encoding="utf-8") as f:
    json.dump(categories, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "myths.json"), "w", encoding="utf-8") as f:
    json.dump(myths, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "regulations.json"), "w", encoding="utf-8") as f:
    json.dump(regulations, f, ensure_ascii=False, indent=2)

with open(os.path.join(OUTPUT_DIR, "lab.json"), "w", encoding="utf-8") as f:
    json.dump(lab, f, ensure_ascii=False, indent=2)

print("Data compilation completed successfully!")
