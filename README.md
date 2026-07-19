# Estor — Excel-Driven Product Store

A customer-facing storefront where the product catalog is managed entirely
through an Excel file. The client updates a spreadsheet with their products;
an import script syncs it into the database, and the website reflects it
automatically — no manual data entry into the site itself.

## Why this architecture

The client already manages inventory in Excel and doesn't want to learn a new
admin system. Rather than reading the Excel file live on every page request
(slow, fragile), this project treats Excel as the source of truth for
input and a lightweight SQLite database as the source of truth for
serving the site - fast reads, no dependency on a spreadsheet library at
request time.

```
Excel file (client edits)
        |
        |  node scripts/import-excel.js
        v
  SQLite database  -->  Next.js pages & API  -->  Customers browse
```

## Tech stack

| Layer      | Choice                          |
|------------|----------------------------------|
| Frontend   | Next.js (App Router) + React     |
| Styling    | Tailwind CSS                     |
| Backend    | Next.js API routes               |
| Database   | SQLite via better-sqlite3        |
| Data import| xlsx (SheetJS)                   |

## Getting started

```bash
npm install
node scripts/generate-sample-excel.js
node scripts/import-excel.js
npm run dev
```

Visit http://localhost:3000

## Updating the catalog

1. Client edits data/products.xlsx (columns: name, category, price,
   stock, image_url, description).
2. Run node scripts/import-excel.js to sync it into the database.
3. Refresh the site - changes are live.

(A future iteration will add an admin page so the client can upload the
Excel file directly from the browser instead of this being a manual step.)

## Project status

Early scaffold: product listing page + import pipeline. Next planned steps:
product detail pages, category filtering, and an admin upload page.
