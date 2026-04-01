/**
 * Replace a blog post's content (body HTML) from a local .html file.
 *
 * Usage:
 *   node scripts/update-post-body.mjs <slug> <path-to-html-file>
 *
 * Example:
 *   node scripts/update-post-body.mjs elg-partner-model article-body.html
 *
 * The HTML file should contain the full article body HTML (no <html>/<body> wrapper).
 * Use <h2>, <p>, <strong>, <a href="...">, <ul><li>, etc.
 */

import { connect } from "framer-api"
import { readFileSync } from "fs"
import { FRAMER_PROJECT_URL, FRAMER_API_TOKEN, BLOG_COLLECTION_ID, BLOG_FIELDS } from "../config.mjs"

const [slug, htmlFile] = process.argv.slice(2)

if (!slug || !htmlFile) {
  console.error("Usage: node scripts/update-post-body.mjs <slug> <path-to-html-file>")
  process.exit(1)
}

const html = readFileSync(htmlFile, "utf8").trim()

const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_TOKEN)
const collection = await framer.getCollection(BLOG_COLLECTION_ID)
const items = await collection.getItems()

const item = items.find(i => i.slug === slug)
if (!item) {
  console.error(`❌ No post found with slug: ${slug}`)
  process.exit(1)
}

await collection.addItems([{
  id: item.id,
  slug: item.slug,
  draft: item.draft,
  fieldData: {
    [BLOG_FIELDS.content]: { type: "formattedText", value: html },
  }
}])

console.log(`✅ Body updated for: ${slug}`)
console.log(`   Item ID: ${item.id}`)
process.exit(0)
