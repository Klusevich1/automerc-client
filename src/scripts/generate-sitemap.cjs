/* eslint-disable no-console */
// node src/scripts/generate-sitemap.cjs
require('dotenv').config({ path: '.env' });
const { writeFileSync, mkdirSync, existsSync } = require("fs");
const { join } = require("path");
const { Client } = require("pg");

const SITE_ORIGIN = process.env.SITE_ORIGIN ?? "https://automerc.by";
const CHUNK_SIZE = 50000;
const OUT_DIR = join(process.cwd(), "public", "sitemaps");

function xmlEscape(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
function urlXml(u) {
  const parts = [
    `<loc>${xmlEscape(u.loc)}</loc>`,
    u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : "",
    u.changefreq ? `<changefreq>${u.changefreq}</changefreq>` : "",
    u.priority != null ? `<priority>${u.priority.toFixed(1)}</priority>` : "",
  ].filter(Boolean);
  return `<url>${parts.join("")}</url>`;
}
function wrapSitemap(urls) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(urlXml).join("\n")}
</urlset>`;
}
function wrapIndex(parts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${parts
  .map(
    (p) =>
      `<sitemap><loc>${xmlEscape(p.loc)}</loc>${p.lastmod ? `<lastmod>${p.lastmod}</lastmod>` : ""}</sitemap>`
  )
  .join("\n")}
</sitemapindex>`;
}
function chunk(arr, size) {
  const res = [];
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
  return res;
}
function isoDate(d = new Date()) {
  return d.toISOString().slice(0, 19) + "Z";
}

async function main() {
  if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    // или укажите { user, password, host, port, database }
  });
  await client.connect();

  const now = isoDate();
  /** @type {{loc:string,lastmod?:string,changefreq?:string,priority?:number}[]} */
  const urls = [
    { loc: `${SITE_ORIGIN}/`, lastmod: now, changefreq: "daily", priority: 1.0 },
    { loc: `${SITE_ORIGIN}/catalog`, lastmod: now, changefreq: "daily", priority: 0.9 },
  ];

  // 1) /catalog/:category/:subcategory
  const subcats = await client.query(`
    SELECT
  c.slug AS category_slug,
  sc.slug AS subcategory_slug,
  to_char(MAX(sp.created_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS lastmod
  FROM spare_part sp
  JOIN subcategory sc ON sc.id::text = sp.subcategory_id::text
  JOIN category    c  ON c.id::text  = sc.category_id::text
  GROUP BY c.slug, sc.slug
  `);

  for (const r of subcats.rows) {
    urls.push({
      loc: `${SITE_ORIGIN}/catalog/${r.category_slug}/${r.subcategory_slug}`,
      lastmod: r.lastmod ?? now,
      changefreq: "weekly",
      priority: 0.8,
    });
  }

  // 2) /catalog/:category/:subcategory/:brand/:model[/:generation]
  // model_with_generation -> generation.id (nullable)
  const generations = await client.query(`
    SELECT DISTINCT
      c.slug  AS category_slug,
      sc.slug AS subcategory_slug,
      b.slug  AS brand_slug,
      ms.slug AS model_slug,
      g.slug  AS generation_slug,
      to_char(MAX(sp.created_at) AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS lastmod
    FROM spare_part sp
    JOIN subcategory  sc  ON sc.id::text  = sp.subcategory_id::text
    JOIN category     c   ON c.id::text   = sc.category_id::text
    JOIN brand        b   ON b.id::text   = sp.brand_id::text
    JOIN model_series ms  ON ms.id::text  = sp.model_id::text AND ms.brand_id::text = b.id::text

    -- ключ: связь запчасти с поколениями
    JOIN spare_part_generation spg ON spg.spare_part_id::text = sp.id::text
    JOIN generation g ON g.id::text = spg.generation_id::text
      -- страховка на согласованность: поколение относится к той же модели/бренду
      AND g.model_id::text = ms.id::text
      AND g.brand_id::text = b.id::text

    GROUP BY c.slug, sc.slug, b.slug, ms.slug, g.slug
  `);

  for (const r of generations.rows) {
    urls.push({
      loc: `${SITE_ORIGIN}/catalog/${r.category_slug}/${r.subcategory_slug}/${r.brand_slug}/${r.model_slug}/${r.generation_slug}`,
      lastmod: r.lastmod ?? now,
      changefreq: "weekly",
      priority: 0.65,
    });
  }


  // 3) /product/:article
  const products = await client.query(`
    SELECT
      sp.article,
      to_char(sp.created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS lastmod
    FROM spare_part sp
    WHERE sp.article IS NOT NULL AND sp.article <> ''

  `);

  for (const r of products.rows) {
    urls.push({
      loc: `${SITE_ORIGIN}/product/${encodeURIComponent(r.article)}`,
      lastmod: r.lastmod ?? now,
      changefreq: "weekly",
      priority: 0.6,
    });
  }

  // 4) запись файлов
  const parts = chunk(urls, CHUNK_SIZE);
  const index = [];

  parts.forEach((list, i) => {
    const n = i + 1;
    const xml = wrapSitemap(list);
    const fname = `sitemap-${n}.xml`;
    writeFileSync(join(OUT_DIR, fname), xml, "utf-8");
    index.push({ loc: `${SITE_ORIGIN}/sitemaps/${fname}`, lastmod: now });
  });

  const indexXml = wrapIndex(index);
  writeFileSync(join(process.cwd(), "public", "sitemap.xml"), indexXml, "utf-8");

  await client.end();
  console.log(`OK. sitemap.xml + ${parts.length} part(s) сгенерированы.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
