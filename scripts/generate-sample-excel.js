const XLSX = require("xlsx");
const path = require("path");

// Column headers MUST match these names exactly — the import script
// looks them up by header name, not by column position, so the client
// can reorder columns in Excel without breaking anything.
const rows = [
  { name: "Wireless Mouse", category: "Electronics", price: 25.99, stock: 42, image_url: "mouse.jpg", description: "Ergonomic wireless mouse" },
  { name: "Mechanical Keyboard", category: "Electronics", price: 79.99, stock: 15, image_url: "keyboard.jpg", description: "RGB backlit mechanical keyboard" },
  { name: "Cotton T-Shirt", category: "Clothing", price: 12.5, stock: 100, image_url: "tshirt.jpg", description: "100% cotton, unisex fit" },
  { name: "Ceramic Mug", category: "Home", price: 8.0, stock: 60, image_url: "mug.jpg", description: "350ml ceramic coffee mug" },
  { name: "Yoga Mat", category: "Sports", price: 19.99, stock: 0, image_url: "yogamat.jpg", description: "Non-slip 6mm yoga mat (currently out of stock)" },
];

const sheet = XLSX.utils.json_to_sheet(rows);
const book = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(book, sheet, "Products");

const outPath = path.join(__dirname, "..", "data", "products.xlsx");
XLSX.writeFile(book, outPath);
console.log("Sample Excel file created at:", outPath);
