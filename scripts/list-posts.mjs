/**
 * List all blog posts (drafts and published)
 * Usage: node scripts/list-posts.mjs
 */

import { connect } from "framer-api"
import { FRAMER_PROJECT_URL, FRAMER_API_TOKEN, BLOG_COLLECTION_ID, BLOG_FIELDS } from "../config.mjs"

const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_TOKEN)
const collection = await framer.getCollection(BLOG_COLLECTION_ID)
const items = await collection.getItems()

const drafts = items.filter(i => i.draft)
const published = items.filter(i => !i.draft)

console.log(`\n📝 Drafts (${drafts.length})`)
for (const item of drafts) {
  const title = item.fieldData[BLOG_FIELDS.title]?.value || "(no title)"
  console.log(`  • [${item.id}] ${title}`)
  console.log(`    slug: ${item.slug}`)
}

console.log(`\n✅ Published (${published.length})`)
for (const item of published.sort((a, b) => b.fieldData[BLOG_FIELDS.date]?.value?.localeCompare(a.fieldData[BLOG_FIELDS.date]?.value))) {
  const title = item.fieldData[BLOG_FIELDS.title]?.value || "(no title)"
  const date = item.fieldData[BLOG_FIELDS.date]?.value?.slice(0, 10) || ""
  console.log(`  • [${item.id}] ${date}  ${title}`)
}

console.log()
process.exit(0)
