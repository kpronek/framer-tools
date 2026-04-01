/**
 * Publish a draft blog post (or unpublish a live one).
 *
 * Usage:
 *   node scripts/publish-post.mjs <slug>             # publish (draft → live)
 *   node scripts/publish-post.mjs <slug> --unpublish  # revert to draft
 *
 * Example:
 *   node scripts/publish-post.mjs elg-partner-model
 */

import { connect } from "framer-api"
import { FRAMER_PROJECT_URL, FRAMER_API_TOKEN, BLOG_COLLECTION_ID, BLOG_FIELDS } from "../config.mjs"

const [slug, flag] = process.argv.slice(2)
const unpublish = flag === "--unpublish"

if (!slug) {
  console.error("Usage: node scripts/publish-post.mjs <slug> [--unpublish]")
  process.exit(1)
}

const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_TOKEN)
const collection = await framer.getCollection(BLOG_COLLECTION_ID)
const items = await collection.getItems()

const item = items.find(i => i.slug === slug)
if (!item) {
  console.error(`❌ No post found with slug: ${slug}`)
  process.exit(1)
}

const newDraft = unpublish ? true : false

await collection.addItems([{
  id: item.id,
  slug: item.slug,
  draft: newDraft,
  fieldData: item.fieldData,
}])

if (unpublish) {
  console.log(`📝 Post reverted to draft: ${slug}`)
} else {
  console.log(`🚀 Post published: ${slug}`)
}
console.log(`   Item ID: ${item.id}`)
process.exit(0)
